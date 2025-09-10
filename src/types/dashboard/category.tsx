// Types
export interface CategoryBase {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

export interface MainCategory extends CategoryBase {
    type: 'main';
    sub_categories?: SubCategory[];
}

export interface SubCategory extends CategoryBase {
    type: 'sub';
    main_category_id: number;
    main_category_name?: string;
    product_categories?: ProductCategory[];
}

export interface ProductCategory extends CategoryBase {
    type: 'product';
    sub_category_id: number;
    sub_category_name?: string;
}
export type Category = MainCategory | SubCategory | ProductCategory;


// Category Form Modal Component
export interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    editingCategory: Category | null;
    mainCategories: MainCategory[];
    subCategories: SubCategory[];
    type: 'main' | 'sub' | 'product';
    loading: boolean;
}

// View Modal Component
export interface ViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    loading: boolean;
}
// Category Item Component
export interface CategoryItemProps {
    category: Category;
    level: number;
    expandedCategories: number[];
    onToggleExpand: (id: number) => void;
    onView: (category: Category) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    subCategories: SubCategory[];
    productCategories: ProductCategory[];
    viewMode: 'hierarchy' | 'all';
    loading: boolean;
}