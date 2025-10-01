import mainAxios from "../../Instance/mainAxios";
import type { MainCategory, ProductCategory, SubCategory } from "../../types/dashboard/category";

const CACHE_PREFIX = "categories_cache_";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour TTL (you can adjust)

// Utility to get cached data
const getCache = (key: string) => {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;
    try {
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp > CACHE_TTL) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return parsed.data;
    } catch {
        return null;
    }
};

// Utility to set cache
const setCache = (key: string, data: any) => {
    localStorage.setItem(
        CACHE_PREFIX + key,
        JSON.stringify({ data, timestamp: Date.now() })
    );
};

// Generic fetcher with caching
const fetchWithCache = async (key: string, url: string) => {
    const cachedData = getCache(key);
    if (cachedData) {
        // Return cached first
        refreshCache(key, url); // refresh in background
        return cachedData;
    }
    const response = await mainAxios.get(url);
    setCache(key, response.data);
    return response.data;
};

// Refresh cache silently in background
const refreshCache = async (key: string, url: string) => {
    try {
        const response = await mainAxios.get(url);
        setCache(key, response.data);
    } catch (err) {
        console.error(`Failed to refresh ${key} cache`, err);
    }
};

export const categoryApi = {
    getMainCategories: async () => fetchWithCache("main", "/categories/main"),
    getMainCategory: async (id: number) =>
        fetchWithCache(`main_${id}`, `/categories/main/${id}`),

    createMainCategory: async (category: Omit<MainCategory, 'id'>) => {
        const response = await mainAxios.post('/categories/main', category);
        localStorage.removeItem(CACHE_PREFIX + "main"); // invalidate cache
        return response.data;
    },

    updateMainCategory: async (id: number, category: Omit<MainCategory, 'id'>) => {
        const response = await mainAxios.put(`/categories/main/${id}`, category);
        localStorage.removeItem(CACHE_PREFIX + "main");
        localStorage.removeItem(CACHE_PREFIX + `main_${id}`);
        return response.data;
    },

    deleteMainCategory: async (id: number) => {
        await mainAxios.delete(`/categories/main/${id}`);
        localStorage.removeItem(CACHE_PREFIX + "main");
        localStorage.removeItem(CACHE_PREFIX + `main_${id}`);
    },

    getSubCategories: async () => fetchWithCache("sub", "/categories/sub/?skip=0&limit=100000"),
    getSubCategory: async (id: number) =>
        fetchWithCache(`sub_${id}`, `/categories/sub/${id}`),

    createSubCategory: async (category: Omit<SubCategory, 'id'>) => {
        const response = await mainAxios.post('/categories/sub', category);
        localStorage.removeItem(CACHE_PREFIX + "sub");
        return response.data;
    },

    updateSubCategory: async (id: number, category: Omit<SubCategory, 'id'>) => {
        const response = await mainAxios.put(`/categories/sub/${id}`, category);
        localStorage.removeItem(CACHE_PREFIX + "sub");
        localStorage.removeItem(CACHE_PREFIX + `sub_${id}`);
        return response.data;
    },

    deleteSubCategory: async (id: number) => {
        await mainAxios.delete(`/categories/sub/${id}`);
        localStorage.removeItem(CACHE_PREFIX + "sub");
        localStorage.removeItem(CACHE_PREFIX + `sub_${id}`);
    },

    getProductCategories: async () =>
        fetchWithCache("product", "/categories/product?skip=0&limit=100000"),
    getProductCategory: async (id: number) =>
        fetchWithCache(`product_${id}`, `/categories/product/${id}`),

    createProductCategory: async (category: Omit<ProductCategory, 'id'>) => {
        const response = await mainAxios.post('/categories/product', category);
        localStorage.removeItem(CACHE_PREFIX + "product");
        return response.data;
    },

    updateProductCategory: async (id: number, category: Omit<ProductCategory, 'id'>) => {
        const response = await mainAxios.put(`/categories/product/${id}`, category);
        localStorage.removeItem(CACHE_PREFIX + "product");
        localStorage.removeItem(CACHE_PREFIX + `product_${id}`);
        return response.data;
    },

    deleteProductCategory: async (id: number) => {
        await mainAxios.delete(`/categories/product/${id}`);
        localStorage.removeItem(CACHE_PREFIX + "product");
        localStorage.removeItem(CACHE_PREFIX + `product_${id}`);
    },

    getFullHierarchy: async () =>
        fetchWithCache("hierarchy", "/categories/hierarchy"),
};
