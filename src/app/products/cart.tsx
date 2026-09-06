import mainAxios from "../../Instance/mainAxios";
import { getGuestCartId, clearGuestCartId } from "../utils/guestCart";
import { notifyCartUpdated } from "../utils/countEvents";

export const cartApi = {
    // Works for guests too — no login required to add to cart.
    //
    // guest_id goes out on every request, logged in or not. The server only
    // falls back to it when the request has no usable user, and an expired
    // token resolves to exactly that — no user. Gating it on a token being
    // *present* meant a stale token left the request with neither identity,
    // and the cart rejected it with 400 "guest_id is required when not
    // logged in".
    addToCart: async (product_id: number, quantity: number, color: any, delivery: any) => {
        const response = await mainAxios.post(
            `/cart/add?product_id=${product_id}&quantity=${quantity}&delivery=${delivery}&guest_id=${getGuestCartId()}`,
            [{ "color": color }]
        );
        notifyCartUpdated();
        return response;
    },

    // Called right after login/signup to fold the anonymous cart into the account's cart.
    mergeGuestCart: async () => {
        const guestId = localStorage.getItem('guestCartId');
        if (!guestId) return;
        try {
            await mainAxios.post(`/cart/merge-guest?guest_id=${guestId}`);
        } finally {
            clearGuestCartId();
            notifyCartUpdated();
        }
    },
};
