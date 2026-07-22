// src/services/wishlistService.ts
import mainAxios from '../../Instance/mainAxios';
import { token } from '../Localstorage';
import { getGuestCartId, clearGuestCartId } from '../utils/guestCart';

export interface WishlistItem {
  wishlist_item_id: number;
  product_id: number;
  product_name: string;
  delivery_fee: number;
  product_image: string[any];
  current_price: number;
  price_at_time: number;
  quantity: number;
  wishlist_color: Array<{ name: string; hex: string }>;
  product_color: Array<{ name: string; hex: string }>;
  delivery: string;
  item_total: number;
  in_stock: number;
  max_available: number;
}

export interface WishlistResponse {
  wishlist_id: number | null;
  user_id: number;
  items: WishlistItem[];
  total_items: number;
  total_price: number;
  wishlist_status: boolean;
  created_at: string;
  message?: string;
}

// Not logged in? Reuse the same anonymous identity as the guest cart, so the
// heart icon and wishlist page work without an account too.
const guestParam = (prefix: '?' | '&' = '&') => (token ? '' : `${prefix}guest_id=${getGuestCartId()}`);

export const wishlistService = {
  // Get user's (or guest's) wishlist
  getMyWishlist: async (): Promise<WishlistResponse> => {
    const response = await mainAxios.get(`/wishlist/my-wishlist${guestParam('?')}`, { skipAuthRedirect: true } as any);
    return response.data;
  },

  // Add product to wishlist — works for guests too
  addToWishlist: async (
    productId: number,
    quantity: number,
    delivery: string,
    color: Array<{ name: string; hex: string }> = []
  ): Promise<{ message: string }> => {
    const response: any = await mainAxios.post(
      `/wishlist/add?product_id=${productId}&quantity=${quantity}&delivery=${delivery}${guestParam()}`,
      [{ "color": color }]
    );
    return response;
  },

  // One click to add (heart -> red), one click to remove (heart -> outline) — works for guests too
  toggleWishlist: async (
    productId: number,
    quantity: number = 1,
    delivery: string = "",
    color: Array<{ name: string; hex: string }> = []
  ): Promise<{ message: string; wishlisted: boolean }> => {
    const response = await mainAxios.post(
      `/wishlist/toggle?product_id=${productId}&quantity=${quantity}&delivery=${delivery}${guestParam()}`,
      [{ "color": color }],
      { skipAuthRedirect: true } as any
    );
    return response.data;
  },

  // IDs of products already wishlisted by the current user/guest — used to init heart state
  getMyWishlistedProductIds: async (): Promise<number[]> => {
    const response = await mainAxios.get(`/wishlist/my-product-ids${guestParam('?')}`, { skipAuthRedirect: true } as any);
    return response.data?.product_ids ?? [];
  },

  // Update wishlist item
  updateWishlistItem: async (
    wishlistItemId: number,
    quantity: number,
    delivery: string,
    color: Array<{ name: string; hex: string }> = []
  ): Promise<{ message: string }> => {
    const response = await mainAxios.put(`/wishlist/update/${wishlistItemId}`, null, {
      params: {
        quantity,
        delivery,
        color: JSON.stringify(color),
        ...(token ? {} : { guest_id: getGuestCartId() }),
      }
    });
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (wishlistItemId: number): Promise<{ message: string }> => {
    const response = await mainAxios.delete(`/wishlist/delete/${wishlistItemId}${guestParam('?')}`);
    return response.data;
  },

  // Move item to cart
  moveToCart: async (wishlistItemId: number): Promise<{ message: string }> => {
    const response = await mainAxios.post(`/wishlist/move-to-cart/${wishlistItemId}${guestParam('?')}`);
    return response.data;
  },

  // Called right after login/signup to fold the anonymous wishlist into the account's wishlist.
  mergeGuestWishlist: async (): Promise<void> => {
    const guestId = localStorage.getItem('guestCartId');
    if (!guestId) return;
    try {
      await mainAxios.post(`/wishlist/merge-guest?guest_id=${guestId}`);
    } finally {
      clearGuestCartId();
    }
  },
};
