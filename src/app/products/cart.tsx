import mainAxios from "../../Instance/mainAxios";
import { token } from "../Localstorage";
import { getGuestCartId, clearGuestCartId } from "../utils/guestCart";

export const cartApi = {
    // Works for guests too — no login required to add to cart.
    addToCart: async (product_id: number, quantity: number, color: any, delivery: any) => {
        const guestParam = token ? '' : `&guest_id=${getGuestCartId()}`;
        const response = await mainAxios.post(
            `/cart/add?product_id=${product_id}&quantity=${quantity}&delivery=${delivery}${guestParam}`,
            [{ "color": color }]
        );
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
        }
    },
};
