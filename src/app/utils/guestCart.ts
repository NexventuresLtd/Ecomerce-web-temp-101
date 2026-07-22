// Anonymous cart identity — lets visitors add to cart before creating an account.
// Persisted in localStorage so it survives refreshes; merged into the real
// cart once they log in or sign up (see cartApi.mergeGuestCart).
const STORAGE_KEY = 'guestCartId';

export function getGuestCartId(): string {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
        id = (crypto as any).randomUUID ? crypto.randomUUID() : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
}

export function clearGuestCartId(): void {
    localStorage.removeItem(STORAGE_KEY);
}
