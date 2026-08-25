import { useState, useEffect, useRef } from 'react';
import { Bell, CreditCard, ShoppingBag, Heart, Package, Info } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

export interface UserNotification {
    id: number;
    type: 'payment' | 'order' | 'cart' | 'wishlist' | 'system';
    title: string;
    message: string | null;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

const ICON: Record<UserNotification['type'], any> = {
    payment: CreditCard,
    order: Package,
    cart: ShoppingBag,
    wishlist: Heart,
    system: Info,
};

interface UserNotificationBellProps {
    // Called with the notification's `link` — lets the dashboard switch tabs
    // in-app for its own routes (/profile?section=...) or navigate away for
    // external ones (/shopping-cart, /wish-list).
    onNavigate: (link: string) => void;
}

const UserNotificationBell: React.FC<UserNotificationBellProps> = ({ onNavigate }) => {
    const [notifications, setNotifications] = useState<UserNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const load = async () => {
        try {
            const [listRes, countRes] = await Promise.all([
                mainAxios.get('/notifications/mine?limit=20', { skipAuthRedirect: true } as any),
                mainAxios.get('/notifications/unread-count', { skipAuthRedirect: true } as any),
            ]);
            setNotifications(listRes.data?.notifications ?? []);
            setUnreadCount(countRes.data?.unread_count ?? 0);
        } catch {
            // transient error — silently do nothing
        }
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = async (n: UserNotification) => {
        setOpen(false);
        if (!n.is_read) {
            try {
                await mainAxios.put(`/notifications/${n.id}/read`, {});
                setUnreadCount((c) => Math.max(0, c - 1));
                setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
            } catch {
                // non-blocking
            }
        }
        if (n.link) onNavigate(n.link);
    };

    const markAllRead = async () => {
        try {
            await mainAxios.put('/notifications/read-all', {});
            setUnreadCount(0);
            setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })));
        } catch {
            // non-blocking
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                Mark all read
                            </button>
                        )}
                    </div>
                    {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-gray-500 text-center">Nothing yet</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {notifications.map((n) => {
                                const Icon = ICON[n.type] || Info;
                                return (
                                    <li key={n.id}>
                                        <button
                                            onClick={() => handleItemClick(n)}
                                            className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                                        >
                                            {!n.is_read && <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-blue-500" />}
                                            <Icon size={16} className={`mt-0.5 flex-shrink-0 ${n.is_read ? 'text-gray-400' : 'text-blue-600'}`} />
                                            <div className="min-w-0">
                                                <p className={`text-sm truncate ${n.is_read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>{n.title}</p>
                                                {n.message && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>}
                                                <p className="text-xs text-gray-400 mt-0.5">{new Date(n.created_at).toLocaleString()}</p>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserNotificationBell;
