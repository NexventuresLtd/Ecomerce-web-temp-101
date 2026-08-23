import { useState, useEffect, useRef } from 'react';
import { Bell, UserPlus, ShoppingCart, CreditCard } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface Notification {
    type: 'new_user' | 'new_cart' | 'payment';
    color: 'blue' | 'amber' | 'green' | 'red' | 'gray';
    message: string;
    at: string | null;
}

const DOT_COLOR: Record<Notification['color'], string> = {
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400',
};

const ICON: Record<Notification['type'], any> = {
    new_user: UserPlus,
    new_cart: ShoppingCart,
    payment: CreditCard,
};

const LAST_SEEN_KEY = 'dashboardNotificationsLastSeen';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);
    const [unseenCount, setUnseenCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const load = async () => {
        try {
            const res = await mainAxios.get('/dashboard/notifications?limit=20');
            const items: Notification[] = res.data?.notifications ?? [];
            setNotifications(items);

            const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
            const unseen = lastSeen ? items.filter(n => n.at && n.at > lastSeen).length : items.length;
            setUnseenCount(unseen);
        } catch {
            // non-admin viewer or a transient error — silently do nothing
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

    const toggleOpen = () => {
        setOpen(o => !o);
        if (!open) {
            localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
            setUnseenCount(0);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={toggleOpen}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unseenCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unseenCount > 99 ? '99+' : unseenCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-gray-500 text-center">Nothing yet</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {notifications.map((n, i) => {
                                const Icon = ICON[n.type];
                                return (
                                    <li key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50">
                                        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLOR[n.color]}`} />
                                        <Icon size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-800 truncate">{n.message}</p>
                                            {n.at && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {new Date(n.at).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
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

export default NotificationBell;
