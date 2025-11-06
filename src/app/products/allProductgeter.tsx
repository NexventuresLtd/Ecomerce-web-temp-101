import mainAxios from "../../Instance/mainAxios";
import type { Product } from "../../types/Product/producttypeAdmin";

// API service functions
export const productApi = {
    getProducts: async (skip = 0, limit = 0, queryParams: Record<string, any> = {}) => {
        // Build URLSearchParams from object
        const params = new URLSearchParams();

        // Add pagination
        params.append('skip', skip.toString());
        params.append('limit', limit.toString());

        // Add all query parameters
        Object.entries(queryParams).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Handle array parameters (like category IDs)
                value.forEach(item => params.append(key, item.toString()));
            } else if (value !== null && value !== undefined && value !== '') {
                params.append(key, value.toString());
            }
        });

        const url = `/products?${params.toString()}`;
        console.log('Making API request to:', url);
        const response = await mainAxios.get(url);
        return response.data;
    },
    getProduct: async (id: any) => {
        const response = await mainAxios.get(`/products/${id}`);
        return response.data;
    },
    getProductsByCategoryHierarchy: async (categoryIds: number[], skip = 0, limit = 100, queryParams = '') => {
        const categoryIdsParam = categoryIds.join(',');
        const url = `/products/category-hierarchy?category_ids=${categoryIdsParam}&skip=${skip}&limit=${limit}${queryParams ? `&${queryParams}` : ''}`;
        const response = await mainAxios.get(url);
        return response.data;
    },


    createProduct: async (productData: Omit<Product, 'id'>) => {
        // Create FormData for multipart upload
        const formData = new FormData();

        // Add basic fields
        formData.append('title', productData.title);
        formData.append('description', productData.description);
        formData.append('price', productData.price?.toString() || '0');
        formData.append('category_id', productData.category_id?.toString() || '');
        formData.append('instock', productData.instock?.toString() || '0');

        // Add optional fields if they exist
        if (productData.original_price) formData.append('original_price', productData.original_price.toString());
        if (productData.discount) formData.append('discount', productData.discount.toString());
        if (productData.is_new !== undefined) formData.append('is_new', productData.is_new.toString());
        if (productData.is_featured !== undefined) formData.append('is_featured', productData.is_featured.toString());
        if (productData.is_active !== undefined) formData.append('is_active', productData.is_active.toString());
        if (productData.delivery_fee) formData.append('delivery_fee', productData.delivery_fee);
        if (productData.brock) formData.append('brock', productData.brock);
        if (productData.returnDay) formData.append('returnDay', productData.returnDay);
        if (productData.warranty) formData.append('warranty', productData.warranty);
        if (productData.tutorial_video) formData.append('tutorial_video', productData.tutorial_video);

        // Add JSON fields
        if (productData.tags && productData.tags.length > 0) {
            formData.append('tags', JSON.stringify(productData.tags));
        }
        if (productData.features && productData.features.length > 0) {
            formData.append('features', JSON.stringify(productData.features));
        }
        if (productData.colors && productData.colors.length > 0) {
            formData.append('colors', JSON.stringify(productData.colors));
        }

        // Add images (convert base64 to files)
        if (productData.images && productData.images.length > 0) {
            for (let i = 0; i < productData.images.length; i++) {
                const image = productData.images[i];
                if (image.url.startsWith('data:')) {
                    // Convert base64 to file
                    const base64Response = await fetch(image.url);
                    const blob = await base64Response.blob();
                    const file = new File([blob], `image_${i}.jpg`, { type: 'image/jpeg' });
                    formData.append('images', file);
                }
            }
        }

        // Add hover image if provided
        if (productData.hover_image && productData.hover_image.startsWith('data:')) {
            const base64Response = await fetch(productData.hover_image);
            const blob = await base64Response.blob();
            const file = new File([blob], 'hover_image.jpg', { type: 'image/jpeg' });
            formData.append('hover_image', file);
        }

        const response = await mainAxios.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateProduct: async (id: number, productData: Partial<Product>) => {
        // Create FormData for multipart upload
        const formData = new FormData();

        // Add basic fields if they exist
        if (productData.title) formData.append('title', productData.title);
        if (productData.description) formData.append('description', productData.description);
        if (productData.price !== undefined) formData.append('price', productData.price.toString());
        if (productData.category_id !== undefined) formData.append('category_id', productData.category_id.toString());
        if (productData.instock !== undefined) formData.append('instock', productData.instock.toString());

        // Add optional fields if they exist
        if (productData.original_price !== undefined) formData.append('original_price', productData.original_price.toString());
        if (productData.discount !== undefined) formData.append('discount', productData.discount.toString());
        if (productData.is_new !== undefined) formData.append('is_new', productData.is_new.toString());
        if (productData.is_featured !== undefined) formData.append('is_featured', productData.is_featured.toString());
        if (productData.is_active !== undefined) formData.append('is_active', productData.is_active.toString());
        if (productData.delivery_fee !== undefined) formData.append('delivery_fee', productData.delivery_fee);
        if (productData.brock !== undefined) formData.append('brock', productData.brock);
        if (productData.returnDay !== undefined) formData.append('returnDay', productData.returnDay);
        if (productData.warranty !== undefined) formData.append('warranty', productData.warranty);
        if (productData.tutorial_video !== undefined) formData.append('tutorial_video', productData.tutorial_video);

        // Add JSON fields
        if (productData.tags) formData.append('tags', JSON.stringify(productData.tags));
        if (productData.features) formData.append('features', JSON.stringify(productData.features));
        if (productData.colors) formData.append('colors', JSON.stringify(productData.colors));

        // Add keep_existing_images flag for updates
        formData.append('keep_existing_images', 'true');

        // Add new images if provided
        if (productData.images) {
            for (let i = 0; i < productData.images.length; i++) {
                const image = productData.images[i];
                if (image.url.startsWith('data:')) {
                    // Convert base64 to file
                    const base64Response = await fetch(image.url);
                    const blob = await base64Response.blob();
                    const file = new File([blob], `image_${i}.jpg`, { type: 'image/jpeg' });
                    formData.append('images', file);
                }
            }
        }

        // Add hover image if provided
        if (productData.hover_image && productData.hover_image.startsWith('data:')) {
            const base64Response = await fetch(productData.hover_image);
            const blob = await base64Response.blob();
            const file = new File([blob], 'hover_image.jpg', { type: 'image/jpeg' });
            formData.append('hover_image', file);
        }

        const response = await mainAxios.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProduct: async (id: number) => {
        await mainAxios.delete(`/products/${id}`);
    },

    addProductImages: async (productId: number, images: File[]) => {
        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });

        const response = await mainAxios.post(`/products/${productId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProductImage: async (productId: number, imageIndex: number) => {
        await mainAxios.delete(`/products/${productId}/images/${imageIndex}`);
    },

    setPrimaryImage: async (productId: number, imageIndex: number) => {
        const response = await mainAxios.patch(`/products/${productId}/images/set-primary?image_index=${imageIndex}`);

        return response.data;
    }
};