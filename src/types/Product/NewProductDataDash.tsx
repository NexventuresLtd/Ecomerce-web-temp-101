// Types
export interface ProductImage {
    url: string;
    is_primary: boolean;
    alt_text?: string;
    thumbnail?: string;
}
export interface CategoryHierarchy {
    mainCategories: any[];
    subCategories: any[];
    productCategories: any[];
}
export interface CategoryInfo {
    id: number;
    name: string;
    slug: string;
    image?: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    original_price?: number;
    discount?: number;
    rating: number;
    is_new: string;
    is_featured: boolean;
    is_active: boolean;
    reviews_count: number;
    instock: number;
    delivery_fee?: string;
    brock?: string;
    returnDay?: string;
    warranty?: string;
    hover_image?: string;
    owner_id?: number;
    tutorial_video?: string;
    tags: string[];
    features: string[];
    colors: Array<{ name: string; hex: string; stock: number }>;
    category_id?: number;
    images: ProductImage[];
    created_at: string;
    updated_at: string;
    category?: CategoryInfo;
}
