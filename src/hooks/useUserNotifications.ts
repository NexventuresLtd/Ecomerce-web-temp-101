import { useEffect, useState } from 'react';
import mainAxios from '../Instance/mainAxios';

export interface UserNotification {
    id: number;
    type: 'payment' | 'order' | 'cart' | 'wishlist' | 'system';
    title: string;
    message: string | null;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

interface Store {
    notifications: UserNotification[];
    unreadCount: number;
}

// One poller shared by every consumer (the header bell, the sidebar badges),
// so a notification marked read in the dropdown clears its sidebar badge in the
// same tick instead of both components drifting on separate 30s timers.
let store: Store = { notifications: [], unreadCount: 0 };
const listeners = new Set<(s: Store) => void>();
let pollTimer: ReturnType<typeof setInterval> | null = null;
let subscriberCount = 0;

const emit = (next: Store) => {
    store = next;
    listeners.forEach((l) => l(store));
};

export const loadUserNotifications = async () => {
    try {
        const [listRes, countRes] = await Promise.all([
            mainAxios.get('/notifications/mine?limit=20', { skipAuthRedirect: true } as any),
            mainAxios.get('/notifications/unread-count', { skipAuthRedirect: true } as any),
        ]);
        emit({
            notifications: listRes.data?.notifications ?? [],
            unreadCount: countRes.data?.unread_count ?? 0,
        });
    } catch {
        // transient error / signed-out viewer — keep whatever we already have
    }
};

export const markNotificationRead = async (id: number) => {
    // Optimistic: the badge should drop the moment the item is opened.
    emit({
        notifications: store.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        unreadCount: Math.max(0, store.unreadCount - 1),
    });
    try {
        await mainAxios.put(`/notifications/${id}/read`, {});
    } catch {
        loadUserNotifications();
    }
};

export const markAllNotificationsRead = async () => {
    emit({
        notifications: store.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
    });
    try {
        await mainAxios.put('/notifications/read-all', {});
    } catch {
        loadUserNotifications();
    }
};

export const useUserNotifications = () => {
    const [state, setState] = useState<Store>(store);

    useEffect(() => {
        listeners.add(setState);
        subscriberCount += 1;
        if (subscriberCount === 1) {
            loadUserNotifications();
            pollTimer = setInterval(loadUserNotifications, 30000);
        } else {
            setState(store);
        }

        return () => {
            listeners.delete(setState);
            subscriberCount -= 1;
            if (subscriberCount === 0 && pollTimer) {
                clearInterval(pollTimer);
                pollTimer = null;
            }
        };
    }, []);

    // Unread notifications grouped by the dashboard section they belong to, so
    // each sidebar entry can carry its own badge.
    const unreadBySection = state.notifications.reduce<Record<string, number>>((acc, n) => {
        if (n.is_read) return acc;
        acc[n.type] = (acc[n.type] ?? 0) + 1;
        return acc;
    }, {});

    return { ...state, unreadBySection };
};
