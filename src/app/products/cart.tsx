import mainAxios from "../../Instance/mainAxios";

export const cartApi = {
  addToCart: async (product_id: number, quantity: number) => {
    const response = await mainAxios.post(
      `/cart/add?product_id=${product_id}&quantity=${quantity}`
    );
    return response.data;
  },
};
