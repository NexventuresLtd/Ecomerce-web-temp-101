import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import mainAxios from '../../Instance/mainAxios';

interface Announcement {
    id: number;
    message: string;
    link: string | null;
    bg_color: string;
}

const DISMISSED_KEY = 'dismissedAnnouncementId';

const AnnouncementBanner = () => {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        mainAxios.get('/announcements/active')
            .then(res => {
                const a = res.data?.announcement;
                if (a && String(a.id) !== sessionStorage.getItem(DISMISSED_KEY)) {
                    setAnnouncement(a);
                }
            })
            .catch(() => { /* no announcement configured */ });
    }, []);

    if (!announcement) return null;

    const dismiss = () => {
        sessionStorage.setItem(DISMISSED_KEY, String(announcement.id));
        setAnnouncement(null);
    };

    const content = (
        <span className="text-sm font-medium text-white text-center flex-1">
            {announcement.message}
        </span>
    );

    return (
        <div
            className="w-full flex items-center justify-center gap-3 px-4 py-2 relative"
            style={{ backgroundColor: announcement.bg_color || '#1d293d' }}
        >
            {announcement.link ? (
                <a href={announcement.link} className="flex-1 text-center hover:underline">
                    {content}
                </a>
            ) : content}
            <button
                onClick={dismiss}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                aria-label="Dismiss announcement"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default AnnouncementBanner;
