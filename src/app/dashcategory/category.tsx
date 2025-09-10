import mainAxios from "../../Instance/mainAxios";
import type { MainCategory, ProductCategory, SubCategory } from "../../types/dashboard/category";

// API service functions
export const categoryApi = {
    getMainCategories: async () => {
        const response = await mainAxios.get('/categories/main');
        return response.data;
    },

    getMainCategory: async (id: number) => {
        const response = await mainAxios.get(`/categories/main/${id}`);
        return response.data;
    },

    createMainCategory: async (category: Omit<MainCategory, 'id'>) => {
        const response = await mainAxios.post('/categories/main', category);
        return response.data;
    },

    updateMainCategory: async (id: number, category: Omit<MainCategory, 'id'>) => {
        const response = await mainAxios.put(`/categories/main/${id}`, category);
        return response.data;
    },

    deleteMainCategory: async (id: number) => {
        await mainAxios.delete(`/categories/main/${id}`);
    },

    getSubCategories: async () => {
        const response = await mainAxios.get('/categories/sub');
        return response.data;
    },

    getSubCategory: async (id: number) => {
        const response = await mainAxios.get(`/categories/sub/${id}`);
        return response.data;
    },

    createSubCategory: async (category: Omit<SubCategory, 'id'>) => {
        const response = await mainAxios.post('/categories/sub', category);
        return response.data;
    },

    updateSubCategory: async (id: number, category: Omit<SubCategory, 'id'>) => {
        const response = await mainAxios.put(`/categories/sub/${id}`, category);
        return response.data;
    },

    deleteSubCategory: async (id: number) => {
        await mainAxios.delete(`/categories/sub/${id}`);
    },

    getProductCategories: async () => {
        const response = await mainAxios.get('/categories/product');
        return response.data;
    },

    getProductCategory: async (id: number) => {
        const response = await mainAxios.get(`/categories/product/${id}`);
        return response.data;
    },

    createProductCategory: async (category: Omit<ProductCategory, 'id'>) => {
        const response = await mainAxios.post('/categories/product', category);
        return response.data;
    },

    updateProductCategory: async (id: number, category: Omit<ProductCategory, 'id'>) => {
        const response = await mainAxios.put(`/categories/product/${id}`, category);
        return response.data;
    },

    deleteProductCategory: async (id: number) => {
        await mainAxios.delete(`/categories/product/${id}`);
    },

    getFullHierarchy: async () => {
        const response = await mainAxios.get('/categories/hierarchy');
        return response.data;
    },
};