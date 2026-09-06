import { useState, useEffect, useRef } from 'react';
import { Bell, UserPlus, ShoppingCart, CreditCard } from 'lucide-react';
import { useAppContext } from '../../../contexts/dashbaord/context';
import {
    useDashboardNotifications,
    markDashboardNotificationsSeen,
    TARGET_VIEW,
    type DashboardNotification as Notification,
} from '../../../hooks/useDashboardNotifications';

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

const NotificationBell = () => {
    // Feed + unseen counts come from a shared store the sidebar badges read too.
    const { notifications, unseenCount } = useDashboardNotifications();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { setCurrentView } = useAppContext();

    const handleNotificationClick = (n: Notification) => {
        setOpen(false);
        setCurrentView?.(TARGET_VIEW[n.type]);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOpen = () => {
        setOpen(o => !o);
        if (!open) markDashboardNotificationsSeen();
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
                                    <li key={i}>
                                        <button
                                            onClick={() => handleNotificationClick(n)}
                                            className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors"
                                        >
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

export default NotificationBell;
