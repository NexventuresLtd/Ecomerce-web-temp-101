// src/services/wishlistService.ts
import mainAxios from '../../Instance/mainAxios';

mainAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const wishlistService = {
  // Get user's wishlist
  getMyWishlist: async (): Promise<WishlistResponse> => {
    const response = await mainAxios.get('/wishlist/my-wishlist');
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (
    productId: number, 
    quantity: number, 
    delivery: string, 
    color: Array<{ name: string; hex: string }> = []
  ): Promise<{ message: string }> => {
    const response:any = await mainAxios.post(`/wishlist/add?product_id=${productId}&quantity=${quantity}&delivery=${delivery}`,
            [{ "color": color }]
        );
    return response;
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
        color: JSON.stringify(color)
      }
    });
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (wishlistItemId: number): Promise<{ message: string }> => {
    const response = await mainAxios.delete(`/wishlist/delete/${wishlistItemId}`);
    return response.data;
  },

  // Move item to cart
  moveToCart: async (wishlistItemId: number): Promise<{ message: string }> => {
    const response = await mainAxios.post(`/wishlist/move-to-cart/${wishlistItemId}`);
    return response.data;
  }
};