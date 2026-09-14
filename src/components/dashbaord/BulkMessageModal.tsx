import { useEffect, useMemo, useRef, useState } from 'react';
import { Mail, MessageSquare, X, CheckCircle2, XCircle, Loader2, Users, ListChecks, AlertTriangle } from 'lucide-react';
import { notifyApi, type Recipient, type SendFailure } from '../../app/notify';
import { getAdminErrorMessage } from '../../app/utils/getAdminErrorMessage';

type Channel = 'sms' | 'email';
type Audience = 'selected' | 'all';

// Recipients per API call. Small on purpose: the SMS gateway answers per
// batch, not per number, so a smaller batch means a failure is pinned to
// fewer people — and the progress bar moves in visible steps.
const CHUNK: Record<Channel, number> = { sms: 20, email: 25 };

interface Props {
    open: boolean;
    onClose: () => void;
    // Users ticked in the table — what "Selected users" sends to.
    selected: { id: number; name: string; phone?: string | null; email?: string | null }[];
}

type Phase = 'compose' | 'sending' | 'done';

const gsmSegments = (n: number) => (n <= 160 ? 1 : Math.ceil(n / 153));

// Same person can appear twice (two accounts on one number, or 078… vs
// +25078…). Collapse those before sending so "Send to N" and the progress
// total are honest, and no one gets the message twice.
const normalizeContact = (channel: Channel, c: string) => {
    if (channel === 'email') return c.trim().toLowerCase();
    const d = c.replace(/\D/g, '');
    return d.length >= 9 ? d.slice(-9) : d;
};
const dedupe = (channel: Channel, list: Recipient[]) => {
    const seen = new Set<string>(); const out: Recipient[] = []; let dupes = 0;
    for (const r of list) {
        const k = normalizeContact(channel, r.contact);
        if (!k || seen.has(k)) { dupes++; continue; }
        seen.add(k); out.push(r);
    }
    return { list: out, dupes };
};

const BulkMessageModal = ({ open, onClose, selected }: Props) => {
    const [channel, setChannel] = useState<Channel>('sms');
    const [audience, setAudience] = useState<Audience>('selected');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    // "All users" audience, per channel, fetched once the modal opens.
    const [all, setAll] = useState<Record<Channel, Recipient[] | null>>({ sms: null, email: null });
    const [loadingAll, setLoadingAll] = useState(false);

    const [phase, setPhase] = useState<Phase>('compose');
    const [progress, setProgress] = useState({ total: 0, sent: 0, failed: 0 });
    const [failures, setFailures] = useState<SendFailure[]>([]);
    const [stopped, setStopped] = useState<string | null>(null); // why we stopped before the end
    const [showAllFailures, setShowAllFailures] = useState(false);
    const cancelRef = useRef(false);

    useEffect(() => {
        if (!open) return;
        setLoadingAll(true);
        Promise.all([notifyApi.getRecipients('sms'), notifyApi.getRecipients('email')])
            .then(([s, e]) => setAll({ sms: s.recipients, email: e.recipients }))
            .catch(err => setError(getAdminErrorMessage(err, 'Could not load recipient counts')))
            .finally(() => setLoadingAll(false));
    }, [open]);

    // Who this send actually goes to, after the channel/audience choice.
    const selectedReachable = useMemo(() => selected
        .filter(u => (channel === 'sms' ? u.phone : u.email))
        .map(u => ({ id: u.id, name: u.name, contact: (channel === 'sms' ? u.phone : u.email) as string })),
        [selected, channel]);
    const { list: recipients, dupes } = useMemo(
        () => dedupe(channel, audience === 'all' ? (all[channel] ?? []) : selectedReachable),
        [channel, audience, all, selectedReachable]);

    const counts = {
        selectedReachable: selectedReachable.length,
        allSms: all.sms?.length ?? null,
        allEmail: all.email?.length ?? null,
    };

    const canSend = recipients.length > 0 && message.trim().length > 0 && (channel === 'sms' || subject.trim().length > 0);

    const reset = () => {
        setPhase('compose'); setProgress({ total: 0, sent: 0, failed: 0 }); setFailures([]); setError(null);
        setStopped(null); setShowAllFailures(false);
        cancelRef.current = false;
    };
    const close = () => { reset(); setMessage(''); setSubject(''); setAudience('selected'); onClose(); };

    const send = async () => {
        if (!canSend) return;
        setError(null);
        setPhase('sending');
        cancelRef.current = false;
        setProgress({ total: recipients.length, sent: 0, failed: 0 });
        setFailures([]);

        setStopped(null);
        const size = CHUNK[channel];
        for (let i = 0; i < recipients.length; i += size) {
            if (cancelRef.current) { setStopped('Stopped by you.'); break; }
            const chunk = recipients.slice(i, i + size);
            let fails: SendFailure[] = [];
            let sentCount = 0;
            try {
                const res = channel === 'sms'
                    ? await notifyApi.sendBulkSms(chunk.map(r => r.contact), message.trim())
                    : await notifyApi.sendBulkEmail(chunk.map(r => ({ email: r.contact, name: r.name })), subject.trim(), message.trim());
                fails = res.failures ?? res.failed.map(f => ({ recipient: f, reason: 'Delivery failed' }));
                sentCount = res.sent.length;
                // The server normalises numbers, so match on the normalised form to
                // find anyone it neither sent to nor reported — never leave a gap.
                const accounted = new Set([...res.sent, ...fails.map(f => f.recipient)].map(c => normalizeContact(channel, c)));
                const missing = chunk.filter(r => !accounted.has(normalizeContact(channel, r.contact)));
                fails = [...fails, ...missing.map(r => ({ recipient: r.contact, reason: 'Skipped by the server (duplicate of another recipient)' }))];
            } catch (err) {
                // The whole chunk is unaccounted for — record every recipient with the server's reason.
                const reason = getAdminErrorMessage(err, 'Request failed');
                fails = chunk.map(r => ({ recipient: r.contact, reason }));
            }
            setProgress(p => ({ ...p, sent: p.sent + sentCount, failed: p.failed + fails.length }));
            if (fails.length) setFailures(f => [...f, ...fails]);

            // Nothing in this batch went through and every failure says the same
            // thing (balance, credentials, mail server down…) — the rest will fail
            // identically, so stop instead of hammering the gateway.
            const oneReason = fails.length === chunk.length && sentCount === 0 && new Set(fails.map(f => f.reason)).size === 1
                && !/valid (phone|email)/i.test(fails[0].reason);
            if (oneReason && i + size < recipients.length) {
                setStopped(`Stopped early — the gateway is rejecting every message for the same reason. ${recipients.length - i - size} recipients were not attempted.`);
                break;
            }
        }
        setPhase('done');
    };

    if (!open) return null;

    const remaining = progress.total - progress.sent - progress.failed;
    const pct = progress.total ? Math.round(((progress.sent + progress.failed) / progress.total) * 100) : 0;
    const nameFor = (contact: string) => recipients.find(r => r.contact === contact)?.name;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-xl w-full max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {channel === 'sms' ? <MessageSquare className="w-5 h-5 text-primary" /> : <Mail className="w-5 h-5 text-primary" />}
                            Send {channel === 'sms' ? 'SMS' : 'Email'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">Broadcast a message to your users</p>
                    </div>
                    <button onClick={close} disabled={phase === 'sending'} className="text-gray-400 hover:text-gray-600 disabled:opacity-40"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {phase === 'compose' && (
                        <div className="space-y-5">
                            {/* Channel */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['sms', 'email'] as Channel[]).map(ch => (
                                        <button key={ch} onClick={() => setChannel(ch)}
                                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                                                channel === ch ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                            {ch === 'sms' ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                            {ch === 'sms' ? 'SMS' : 'Email'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Audience with counts */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Send to</label>
                                <div className="space-y-2">
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${audience === 'selected' ? 'border-primary bg-gray-50' : 'border-gray-200'}`}>
                                        <input type="radio" name="audience" checked={audience === 'selected'} onChange={() => setAudience('selected')} className="accent-[#1d293d]" />
                                        <ListChecks className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-800 flex-1">Selected users</span>
                                        <span className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                                            {counts.selectedReachable} of {selected.length} have {channel === 'sms' ? 'a phone' : 'an email'}
                                        </span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${audience === 'all' ? 'border-primary bg-gray-50' : 'border-gray-200'}`}>
                                        <input type="radio" name="audience" checked={audience === 'all'} onChange={() => setAudience('all')} className="accent-[#1d293d]" />
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-800 flex-1">All users</span>
                                        <span className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                                            {loadingAll ? '…' : channel === 'sms'
                                                ? `${counts.allSms ?? '?'} with a phone number`
                                                : `${counts.allEmail ?? '?'} with an email`}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {channel === 'email' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input value={subject} onChange={e => setSubject(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g. New arrivals this week" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder={channel === 'sms' ? 'Type the SMS…' : 'Type the email body…'} />
                                {dupes > 0 && (
                                    <p className="text-xs text-gray-500 mt-2">{dupes} duplicate {channel === 'sms' ? 'number' : 'address'}{dupes > 1 ? 's' : ''} removed — each person is messaged once.</p>
                                )}
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{message.length} characters</span>
                                    {channel === 'sms' && (
                                        <span className={gsmSegments(message.length) > 1 ? 'text-amber-600 font-medium' : ''}>
                                            {gsmSegments(message.length)} SMS segment{gsmSegments(message.length) > 1 ? 's' : ''} per recipient
                                            {recipients.length > 0 && ` · ${gsmSegments(message.length) * recipients.length} credits total`}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {phase !== 'compose' && (
                        <div className="space-y-5">
                            {/* Progress */}
                            <div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-800 flex items-center gap-2">
                                        {phase === 'sending' ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : progress.failed === 0 ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                        {phase === 'sending' ? 'Sending…' : progress.failed === 0 ? 'All sent' : 'Finished with failures'}
                                    </span>
                                    <span className="text-gray-500">{pct}%</span>
                                </div>
                                <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex">
                                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress.total ? (progress.sent / progress.total) * 100 : 0}%` }} />
                                    <div className="h-full bg-red-400 transition-all duration-300" style={{ width: `${progress.total ? (progress.failed / progress.total) * 100 : 0}%` }} />
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                                        <p className="text-2xl font-bold text-green-700">{progress.sent}</p>
                                        <p className="text-xs text-green-700/80 uppercase tracking-wide">Sent</p>
                                    </div>
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                                        <p className="text-2xl font-bold text-red-600">{progress.failed}</p>
                                        <p className="text-xs text-red-600/80 uppercase tracking-wide">Failed</p>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
                                        <p className="text-2xl font-bold text-gray-700">{remaining}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Remaining</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {progress.sent + progress.failed} of {progress.total} processed
                                    {phase === 'done' && remaining > 0 && ` · ${remaining} not attempted`}
                                </p>
                                {stopped && (
                                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{stopped}</span>
                                    </div>
                                )}
                            </div>

                            {/* Failures — grouped by reason, so 119 identical errors read as one line */}
                            {failures.length > 0 && (() => {
                                const groups = Array.from(failures.reduce((m, f) => m.set(f.reason, [...(m.get(f.reason) ?? []), f]), new Map<string, SendFailure[]>()).entries())
                                    .sort((a, b) => b[1].length - a[1].length);
                                return (
                                    <div className="rounded-lg border border-red-200 overflow-hidden">
                                        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-sm font-semibold text-red-700 flex items-center gap-2">
                                            <XCircle className="w-4 h-4" /> Could not send to {failures.length}
                                        </div>
                                        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                                            {groups.map(([reason, list]) => (
                                                <div key={reason} className="px-4 py-3">
                                                    <p className="text-sm text-red-700 leading-snug">
                                                        <span className="font-semibold">{list.length === failures.length ? 'All' : list.length} {list.length === 1 ? 'recipient' : 'recipients'}:</span> {reason}
                                                    </p>
                                                    {(showAllFailures || list.length <= 5) ? (
                                                        <ul className="mt-2 flex flex-wrap gap-1.5">
                                                            {list.map((f, i) => (
                                                                <li key={`${f.recipient}-${i}`} title={f.recipient}
                                                                    className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-gray-700">
                                                                    {nameFor(f.recipient) ?? f.recipient}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <button onClick={() => setShowAllFailures(true)} className="mt-1 text-xs text-primary hover:underline">
                                                            Show who ({list.length})
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    {phase === 'compose' && (
                        <>
                            <button onClick={close} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
                            <button onClick={send} disabled={!canSend || loadingAll}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {channel === 'sms' ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                Send to {recipients.length}
                            </button>
                        </>
                    )}
                    {phase === 'sending' && (
                        <button onClick={() => { cancelRef.current = true; }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                            Stop after current batch
                        </button>
                    )}
                    {phase === 'done' && (
                        <>
                            {failures.length > 0 && (
                                <button onClick={reset} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">Compose again</button>
                            )}
                            <button onClick={close} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors">Done</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkMessageModal;
