// Server-uploaded images (avatars, sliders, product photos) are stored as
// relative /static/... paths; Google-provided avatars are already full URLs.
// Always resolve through this before using as an <img src> or CSS background.
export const resolveImageUrl = (path?: string | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
};
