// Types
export interface Product {
    created_at: string | number | Date;
    id: number;
    title: string;
    description: string;
    price?: number;
    original_price?: number;
    discount?: number;
    rating?: number;
    is_new: boolean;
    is_featured: boolean;
    is_active: boolean;
    reviews_count?: number;
    instock?: number;
    delivery_fee?: string;
    brock?: string;
    returnDay?: string;
    warranty?: string;
    hover_image?: string;
    tutorial_video?: string;
    tags?: string[];
    features?: string[];
    colors?: Array<{ name: string; hex: string; stock: number }>;
    category_id: number;
    category?: {
        id: number;
        name: string;
    };
    images?: Array<{
        id: number;
        url: string;
        is_primary: boolean;
    }>;
    wishlist_id?: number;
}

export interface CategoryHierarchy {
    mainCategories: MainCategory[];
    subCategories: SubCategory[];
    productCategories: ProductCategory[];
}

interface MainCategory {
    id: number;
    name: string;
    slug: string;
}

interface SubCategory {
    id: number;
    name: string;
    slug: string;
    main_category_id: number;
}

interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    sub_category_id: number;
}

export interface ProductImage {
    id: number;
    url: string;
    is_primary: boolean;
    product_id: number;
}
