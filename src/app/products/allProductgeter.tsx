import mainAxios from "../../Instance/mainAxios";
import type { Product } from "../../types/Product/producttypeAdmin";


// API service functions
export const productApi = {
    getProducts: async (skip = 0, limit = 100) => {
        const response = await mainAxios.get(`/products?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    getProduct: async (id: number) => {
        const response = await mainAxios.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (product: Omit<Product, 'id'>) => {
        const response = await mainAxios.post('/products', product);
        return response.data;
    },

    updateProduct: async (id: number, product: Partial<Product>) => {
        const response = await mainAxios.put(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id: number) => {
        await mainAxios.delete(`/products/${id}`);
    },

    addProductImage: async (productId: number, imageData: FormData) => {
        const response = await mainAxios.post(`/products/${productId}/images`, imageData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProductImage: async (imageId: number) => {
        await mainAxios.delete(`/products/images/${imageId}`);
    },

    setPrimaryImage: async (productId: number, imageIndex: number) => {
        await mainAxios.patch(`/products/${productId}/images/set-primary?image_index=${imageIndex}`);
    }
};
