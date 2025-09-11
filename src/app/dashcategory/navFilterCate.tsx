// hooks/useCategories.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface MainCategory {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string;
    created_at: string;
    updated_at: string;
    sub_categories: SubCategory[];
}

export interface SubCategory {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    main_category_id: number;
    product_categories: ProductCategory[];
}

export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    sub_category_id: number;
}

export const useCategories = () => {
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mainResponse, subResponse] = await Promise.all([
                    axios.get<MainCategory[]>('http://127.0.0.1:8000/categories/main', {
                        params: { skip: 0, limit: 100 },
                    }),
                    axios.get<SubCategory[]>('http://127.0.0.1:8000/categories/sub', {
                        params: { skip: 0, limit: 100 },
                    }),
                    axios.get<ProductCategory[]>('http://127.0.0.1:8000/categories/product', {
                        params: { skip: 0, limit: 100 },
                    }),
                ]);

                setMainCategories(mainResponse.data);
                setSubCategories(subResponse.data);
            } catch (err) {
                setError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message || err.message
                        : 'An error occurred'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { mainCategories, subCategories, loading, error };
};
