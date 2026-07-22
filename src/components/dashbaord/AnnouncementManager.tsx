import { useState, useEffect } from 'react';
import { Plus, Trash2, Megaphone } from 'lucide-react';
import mainAxios from '../../Instance/mainAxios';

interface Announcement {
    id: number;
    message: string;
    link: string | null;
    bg_color: string;
    is_active: boolean;
    created_at: string | null;
}

const AnnouncementManager = () => {
    const [items, setItems] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [bgColor, setBgColor] = useState('#1d293d');
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await mainAxios.get('/announcements/all');
            setItems(res.data?.announcements ?? []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const create = async () => {
        if (!message.trim()) return;
        setSaving(true);
        try {
            await mainAxios.post(`/announcements/?message=${encodeURIComponent(message)}&link=${encodeURIComponent(link)}&bg_color=${encodeURIComponent(bgColor)}`);
            setMessage(''); setLink(''); setBgColor('#1d293d');
            await load();
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (a: Announcement) => {
        await mainAxios.put(`/announcements/${a.id}?is_active=${!a.is_active}`);
        load();
    };

    const remove = async (id: number) => {
        await mainAxios.delete(`/announcements/${id}`);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Megaphone className="w-5 h-5" /> New Announcement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="e.g. Black Friday — 20% off cameras this week!"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Link (optional)"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                        type="color"
                        value={bgColor}
                        onChange={e => setBgColor(e.target.value)}
                        className="border border-gray-300 rounded-lg h-10 w-full"
                    />
                </div>
                <button
                    onClick={create}
                    disabled={saving || !message.trim()}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" /> {saving ? 'Publishing...' : 'Publish'}
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {loading ? (
                    <p className="p-6 text-sm text-gray-500">Loading...</p>
                ) : items.length === 0 ? (
                    <p className="p-6 text-sm text-gray-500">No announcements yet.</p>
                ) : items.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: a.bg_color }} />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{a.message}</p>
                                {a.link && <p className="text-xs text-gray-500 truncate">{a.link}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={() => toggleActive(a)}
                                className={`text-xs px-3 py-1 rounded-full border ${a.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                            >
                                {a.is_active ? 'Active' : 'Inactive'}
                            </button>
                            <button onClick={() => remove(a.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementManager;
