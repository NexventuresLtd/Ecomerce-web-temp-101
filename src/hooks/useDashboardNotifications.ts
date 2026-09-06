import { useEffect, useState } from 'react';
import mainAxios from '../Instance/mainAxios';
import type { ViewType } from '../types/dashboard/mainDashbaord';

export interface DashboardNotification {
    type: 'new_user' | 'new_cart' | 'payment';
    color: 'blue' | 'amber' | 'green' | 'red' | 'gray';
    message: string;
    at: string | null;
}

// Which admin tab each notification type belongs to — used both to jump there
// from the bell and to badge that tab in the sidebar.
export const TARGET_VIEW: Record<DashboardNotification['type'], ViewType> = {
    new_user: 'users',
    new_cart: 'carts',
    payment: 'orders',
};

export const LAST_SEEN_KEY = 'dashboardNotificationsLastSeen';

// A single poller feeds the header bell and the sidebar badges, so opening the
// bell clears both at once instead of leaving stale counts in the sidebar.
let notifications: DashboardNotification[] = [];
let lastSeen: string | null = localStorage.getItem(LAST_SEEN_KEY);
const listeners = new Set<() => void>();
let pollTimer: ReturnType<typeof setInterval> | null = null;
let subscriberCount = 0;

const emit = () => listeners.forEach((l) => l());

const load = async () => {
    try {
        const res = await mainAxios.get('/dashboard/notifications?limit=20');
        notifications = res.data?.notifications ?? [];
        emit();
    } catch {
        // non-admin viewer or a transient error — silently do nothing
    }
};

export const markDashboardNotificationsSeen = () => {
    lastSeen = new Date().toISOString();
    localStorage.setItem(LAST_SEEN_KEY, lastSeen);
    emit();
};

export const useDashboardNotifications = () => {
    const [, forceRender] = useState(0);

    useEffect(() => {
        const listener = () => forceRender((n) => n + 1);
        listeners.add(listener);
        subscriberCount += 1;
        if (subscriberCount === 1) {
            load();
            pollTimer = setInterval(load, 30000);
        }

        return () => {
            listeners.delete(listener);
            subscriberCount -= 1;
            if (subscriberCount === 0 && pollTimer) {
                clearInterval(pollTimer);
                pollTimer = null;
            }
        };
    }, []);

    const unseen = lastSeen
        ? notifications.filter((n) => n.at && n.at > lastSeen!)
        : notifications;

    // Unseen events grouped by the sidebar tab they belong to.
    const unseenByView = unseen.reduce<Partial<Record<ViewType, number>>>((acc, n) => {
        const view = TARGET_VIEW[n.type];
        if (view) acc[view] = (acc[view] ?? 0) + 1;
        return acc;
    }, {});

    return { notifications, unseenCount: unseen.length, unseenByView };
};
