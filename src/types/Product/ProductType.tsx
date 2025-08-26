
//---for product
export interface ProductColor {
    name: string;
    value: string;
    image?: string;
}
export interface ProductImage {
    isprimary: boolean;
    image?: string;
}
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    isNew: boolean;
    isFeatured: boolean;
    link: string;
    reviewsCount: number;
    instock: number;
    deliveryFee: number;
    images: ProductImage[];
    hoverImage?: string;
    tags: string[];
    colors: ProductColor[];
    features: string[];
    tutorialVideo?: string;
    category: string;
    brand: string;
    bgColor?: 'bg-primary' | 'bg-secondary' | 'bg-accent' | 'bg-third';
}


// for product owner
export interface Owner {
    name: string;
    isverified: boolean;
    email: string;
    image: string;
    JoinedAt: string
}