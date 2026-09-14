import { motion, AnimatePresence } from 'framer-motion';
import { FileText, RotateCcw, ShoppingBag, X } from 'lucide-react';

const RWF = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 });

// Brand tokens (src/index.css): primary navy, accent red.
const NAVY = '#1d293d';
const RED = '#f63b3b';
const GREEN = '#16a34a';

interface Props {
    open: boolean;
    status: 'success' | 'failed';
    amount: number;
    message?: string;
    invoiceNumber?: string | null;
    invoiceUrl?: string | null;
    onClose: () => void;
    onRetry?: () => void;
    onContinue?: () => void;
}

// Draws a check (success) or cross (failed) by animating the SVG stroke, on
// a disc that pops in — the visual "verdict" the buyer waits for.
const Verdict = ({ ok }: { ok: boolean }) => {
    const color = ok ? GREEN : RED;
    return (
        <div className="relative mx-auto w-28 h-28">
            {/* pulse rings */}
            {[0, 1].map(i => (
                <motion.span
                    key={i}
                    className="absolute inset-0 rounded-full"
                    style={{ border: `2px solid ${color}` }}
                    initial={{ scale: 0.6, opacity: 0.6 }}
                    animate={{ scale: 1.7, opacity: 0 }}
                    transition={{ duration: 1.4, delay: 0.25 + i * 0.35, repeat: ok ? Infinity : 0, repeatDelay: 0.6, ease: 'easeOut' }}
                />
            ))}
            <motion.div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color, boxShadow: `0 18px 40px -12px ${color}99` }}
                initial={{ scale: 0, rotate: -20 }}
                animate={ok ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0, x: [0, -8, 8, -6, 6, -3, 3, 0] }}
                transition={ok
                    ? { type: 'spring', stiffness: 260, damping: 16, delay: 0.05 }
                    : { scale: { type: 'spring', stiffness: 260, damping: 16 }, x: { duration: 0.55, delay: 0.35 } }}
            >
                <svg viewBox="0 0 52 52" className="w-14 h-14" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
                    {ok ? (
                        <motion.path d="M14 27 L23 36 L39 18"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }} />
                    ) : (
                        <>
                            <motion.path d="M17 17 L35 35" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.25 }} />
                            <motion.path d="M35 17 L17 35" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.45 }} />
                        </>
                    )}
                </svg>
            </motion.div>
        </div>
    );
};

// Small burst of brand-coloured confetti for a successful payment.
const Confetti = () => {
    const pieces = Array.from({ length: 18 }, (_, i) => i);
    const colors = [NAVY, '#3b82f6', RED, GREEN, '#f59e0b'];
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            {pieces.map(i => {
                const angle = (i / pieces.length) * Math.PI * 2;
                const dist = 120 + (i % 4) * 30;
                return (
                    <motion.span
                        key={i}
                        className="absolute left-1/2 top-[30%] w-2 h-3 rounded-sm"
                        style={{ backgroundColor: colors[i % colors.length] }}
                        initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
                        animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist + 60, opacity: 0, rotate: 360 + i * 20, scale: 1 }}
                        transition={{ duration: 1.3, delay: 0.35, ease: 'easeOut' }}
                    />
                );
            })}
        </div>
    );
};

const PaymentResultModal = ({ open, status, amount, message, invoiceNumber, invoiceUrl, onClose, onRetry, onContinue }: Props) => {
    const ok = status === 'success';
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)' }}
                        onClick={onClose}
                    />
                    <motion.div
                        role="dialog" aria-modal="true" aria-labelledby="payment-result-title"
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 40, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    >
                        {ok && <Confetti />}
                        {/* top band */}
                        <div className="h-1.5 w-full" style={{ backgroundColor: ok ? GREEN : RED }} />
                        <button onClick={onClose} aria-label="Close"
                            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="px-8 pt-10 pb-8 text-center">
                            <Verdict ok={ok} />

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                <h2 id="payment-result-title" className="mt-6 text-2xl font-bold" style={{ color: NAVY }}>
                                    {ok ? 'Payment successful' : 'Payment failed'}
                                </h2>
                                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                    {message || (ok
                                        ? 'Your order is confirmed. Your invoice has been sent to your email.'
                                        : 'The payment could not be completed. No money was taken.')}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}
                                className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 flex items-center justify-between"
                            >
                                <div className="text-left">
                                    <p className="text-[11px] uppercase tracking-wider text-gray-400">{ok ? 'Amount paid' : 'Amount'}</p>
                                    <p className="text-xl font-bold" style={{ color: ok ? GREEN : NAVY }}>{RWF.format(amount)}</p>
                                </div>
                                {invoiceNumber && (
                                    <div className="text-right">
                                        <p className="text-[11px] uppercase tracking-wider text-gray-400">Invoice</p>
                                        <p className="text-xs font-mono text-gray-700">{invoiceNumber}</p>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.74 }}
                                className="mt-6 space-y-2.5"
                            >
                                {ok ? (
                                    <>
                                        {invoiceUrl && (
                                            <a href={invoiceUrl} target="_blank" rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                                                <FileText className="w-4 h-4" /> View invoice
                                            </a>
                                        )}
                                        <button onClick={onContinue ?? onClose}
                                            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-transform active:scale-[0.98]"
                                            style={{ backgroundColor: NAVY }}>
                                            <ShoppingBag className="w-4 h-4" /> Continue shopping
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={onRetry ?? onClose}
                                            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-transform active:scale-[0.98]"
                                            style={{ backgroundColor: NAVY }}>
                                            <RotateCcw className="w-4 h-4" /> Try again
                                        </button>
                                        <button onClick={onClose}
                                            className="w-full py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                                            Close
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentResultModal;
