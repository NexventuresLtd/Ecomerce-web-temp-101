// The navbar badges (see components/SharedComp/navabaritems/UserInfo.tsx) refresh
// when these fire. Dispatch them from the service layer rather than from screens,
// so any page that adds, updates, removes or moves an item keeps the badge honest
// without having to remember to announce it.
export const CART_UPDATED = 'cartUpdated';
export const WISHLIST_UPDATED = 'wishlistUpdated';

export const notifyCartUpdated = () =>
    window.dispatchEvent(new CustomEvent(CART_UPDATED));

export const notifyWishlistUpdated = () =>
    window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED));
