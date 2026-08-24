// Turns an API error into a message that actually tells the admin what
// happened — "you don't have access" instead of a generic "failed to load"
// when the real cause is a 403 (wrong admin tier for this section).
export const getAdminErrorMessage = (error: any, fallback: string): string => {
    const status = error?.response?.status;
    if (status === 403) {
        return error?.response?.data?.detail || "You don't have permission to view this section.";
    }
    if (status === 401) {
        return 'Your session has expired. Please log in again.';
    }
    return error?.response?.data?.detail || fallback;
};
