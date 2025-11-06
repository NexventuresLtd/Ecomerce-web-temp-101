import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Star,
    Search,
    SlidersHorizontal,
    X,
    ShoppingCartIcon,
    Loader2,
    ChevronRight,
    Folder,
    FolderOpen
} from 'lucide-react';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import Footer from '../../components/SharedComp/footer';
import { RWF } from '../../app/priceConver';
import { useNavigation } from '../../hooks/product/useNavigation';
import { handleClickWhatsapp } from '../../app/ProductWhasapp';
import SkeletonLoader from '../../components/Skeltons/Product';
import type { Product } from '../../types/Product/producttypeAdmin';
import { productApi } from '../../app/products/allProductgeter';
import { useParams } from 'react-router-dom';
import { decodeId } from '../../app/products/id_encrypter';
import Suggestions from './Suggestions';
import { categoryApi } from '../../app/dashcategory/category';

// Filter Types
interface FilterState {
    main_categories: number[];
    sub_categories: number[];
    product_categories: number[];
    priceRange: [number, number];
    minRating: number;
    inStockOnly: boolean;
}

// Sort Types
type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'featured';

// Category Types
interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent_id?: number;
    sub_categories?: Category[];
    product_categories?: Category[];
    type?: 'main' | 'sub' | 'product';
}

// Product Card Component
interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
    const [showDescription, setShowDescription] = useState(false);
    const primaryImage = product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url || '';
    const { navigateToProduct } = useNavigation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 group cursor-pointer"
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
            onClick={() => navigateToProduct(product.id.toString())}
        >
            <div className="relative overflow-hidden bg-white">
                <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${primaryImage}`}
                    alt={product.title}
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount !== 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                    </div>
                )}
                {product.is_new && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        NEW
                    </div>
                )}

                <AnimatePresence>
                    {showDescription && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 bg-opacity-70 flex flex-col items-center justify-center gap-3 p-4"
                        >
                            <p className="text-white text-lg text-center font-medium">
                                {product.title}
                            </p>
                            <p className="text-white text-sm text-center text-wrap line-clamp-2">
                                {product.description}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.title}
                </h3>

                <div className="flex items-center justify-between mb-4 w-full">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                            {product.price ? RWF.format(product.price) : 'Price not available'}
                        </span>
                        {product.original_price && (
                            <span className="text-sm text-gray-500 line-through">
                                {RWF.format(product.original_price)}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`${(product.instock || 0) < 1 ? 'bg-red-500' : 'bg-primary'} text-white px-3 py-1 rounded-full text-sm w-fit ml-auto mb-2 font-semibold`}>
                    {(product.instock || 0) < 1 ? 'Out of Stock' : `${product.instock} in Stock`}
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={(product.instock || 0) < 1}
                        onClick={() => navigateToProduct(product.id.toString())}
                        className={`${(product.instock || 0) < 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} w-full bg-yellow-500 text-xs text-white font-semibold rounded-lg px-3 py-3 transition-colors duration-300 flex items-center justify-center gap-2`}>
                        <ShoppingCartIcon size={18} />
                        Shop Now
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 px-3 rounded-lg text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 bg-teal-600 hover:bg-primary/90 cursor-pointer
                  `}
                        onClick={() => handleClickWhatsapp('', '', `${import.meta.env.VITE_API_BASE_URL}/products/share/product/${product.id} 
                            Hi, I am interested in your product: ${product.title}. 
                            Price: ${product.price ? RWF.format(product.price) : 'Not available'}.`
                        )}
                    >
                        <>
                            <ShoppingCartIcon size={18} />
                            Whatsapp
                        </>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Sort Dropdown Component
interface SortDropdownProps {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'newest', label: 'Newest First' },
        { value: 'featured', label: 'Featured' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' }
    ];

    const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Newest First';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-400 transition-colors"
            >
                <span className="text-sm font-medium text-gray-700">Sort by: {currentLabel}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-full z-20"
                    >
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onSortChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentSort === option.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Price Range Slider Component with Hover Effect
interface PriceRangeSliderProps {
    priceRange: [number, number];
    onPriceRangeChange: (range: [number, number]) => void;
    maxPrice: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
    priceRange,
    onPriceRangeChange,
    maxPrice
}) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;

        const slider = e.currentTarget;
        const rect = slider.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const newValue = Math.min(maxPrice, Math.max(0, Math.round(percentage * maxPrice)));

        onPriceRangeChange([0, newValue]);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleMouseMove(e);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const slider = e.currentTarget;
        const rect = slider.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const hoverPrice = Math.min(maxPrice, Math.max(0, Math.round(percentage * maxPrice)));
        setHoverValue(hoverPrice);
    };

    const handleMouseLeave = () => {
        setHoverValue(null);
    };

    const percentage = (priceRange[1] / maxPrice) * 100;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
                Price Range - Up to {RWF.format(priceRange[1])}
            </h3>

            <div className="relative">
                {/* Hover Tooltip */}
                {hoverValue !== null && (
                    <div
                        className="absolute bottom-full mb-2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none z-10"
                        style={{ left: `${(hoverValue / maxPrice) * 100}%` }}
                    >
                        {RWF.format(hoverValue)}
                    </div>
                )}

                {/* Slider Track */}
                <div
                    className="relative h-2 bg-gray-200 rounded-lg cursor-pointer"
                    onMouseMove={handleHover}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    {/* Filled Track */}
                    <div
                        className="absolute h-full bg-blue-600 rounded-lg"
                        style={{ width: `${percentage}%` }}
                    />

                    {/* Thumb */}
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                        style={{ left: `${percentage}%`, marginLeft: '-8px' }}
                        onMouseDown={handleMouseDown}
                    />
                </div>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
                <span>Rwf 0</span>
                <span>Rwf {RWF.format(maxPrice)}</span>
            </div>

            {/* Current selection display */}
            <div className="text-center text-xs text-gray-600 bg-blue-50 py-1 rounded">
                Selected: Up to {RWF.format(priceRange[1])}
            </div>
        </div>
    );
};

// Category Item Component
interface CategoryItemProps {
    category: Category;
    level: number;
    selectedCategories: FilterState;
    onCategorySelect: (categoryId: number, categoryType: 'main' | 'sub' | 'product') => void;
    expandedCategories: number[];
    onToggleExpand: (categoryId: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    level,
    selectedCategories,
    onCategorySelect,
    expandedCategories,
    onToggleExpand
}) => {
    const hasChildren = (category.sub_categories && category.sub_categories.length > 0) ||
        (category.product_categories && category.product_categories.length > 0);
    const isExpanded = expandedCategories.includes(category.id);

    // Determine category type based on level and structure
    const getCategoryType = (): 'main' | 'sub' | 'product' => {
        if (level === 0) return 'main';
        if (category.product_categories && category.product_categories.length > 0) return 'sub';
        return 'product';
    };

    const categoryType = getCategoryType();
    const isSelected = selectedCategories.main_categories.includes(category.id) ||
        selectedCategories.sub_categories.includes(category.id) ||
        selectedCategories.product_categories.includes(category.id);

    const paddingLeft = `${level * 16}px`;

    const handleToggle = () => {
        if (hasChildren) {
            onToggleExpand(category.id);
        }
    };

    const handleSelect = () => {
        onCategorySelect(category.id, categoryType);
    };

    return (
        <div className="select-none">
            <div
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ paddingLeft }}
            >
                {/* Expand/Collapse Button */}
                {hasChildren && (
                    <button
                        onClick={handleToggle}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        <ChevronRight
                            size={14}
                            className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    </button>
                )}

                {/* Folder Icon for categories with children */}
                {hasChildren && (
                    isExpanded ?
                        <FolderOpen size={16} className="text-blue-600 flex-shrink-0" /> :
                        <Folder size={16} className="text-gray-500 flex-shrink-0" />
                )}

                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleSelect}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                />

                {/* Category Name with Type Badge */}
                <div className="flex items-center gap-2 flex-1">
                    <span
                        className={`text-sm truncate ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                        onClick={handleSelect}
                    >
                        {category.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryType === 'main' ? 'bg-purple-100 text-purple-800' :
                            categoryType === 'sub' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                        }`}>
                        {categoryType}
                    </span>
                </div>
            </div>

            {/* Child Categories */}
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Sub Categories */}
                        {category.sub_categories?.map((subCategory) => (
                            <CategoryItem
                                key={subCategory.id}
                                category={subCategory}
                                level={level + 1}
                                selectedCategories={selectedCategories}
                                onCategorySelect={onCategorySelect}
                                expandedCategories={expandedCategories}
                                onToggleExpand={onToggleExpand}
                            />
                        ))}

                        {/* Product Categories */}
                        {category.product_categories?.map((productCategory) => (
                            <CategoryItem
                                key={productCategory.id}
                                category={productCategory}
                                level={level + 1}
                                selectedCategories={selectedCategories}
                                onCategorySelect={onCategorySelect}
                                expandedCategories={expandedCategories}
                                onToggleExpand={onToggleExpand}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Filter Sidebar Component
interface FilterSidebarProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    categoriesLoading: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    onFiltersChange,
    isOpen,
    onClose,
    categories,
    categoriesLoading
}) => {
    const maxPrice = 1000000;
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const updateFilters = (key: keyof FilterState, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const handleCategorySelect = (categoryId: number, categoryType: 'main' | 'sub' | 'product') => {
        const key = `${categoryType}_categories` as keyof FilterState;
        const currentArray = filters[key] as number[];

        const updated = currentArray.includes(categoryId)
            ? currentArray.filter(id => id !== categoryId)
            : [...currentArray, categoryId];

        updateFilters(key, updated);
    };

    const handlePriceRangeChange = (range: [number, number]) => {
        updateFilters('priceRange', range);
    };

    const handleToggleExpand = (categoryId: number) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Handle URL category parameter - FIXED DECODING
    const { category } = useParams<{ category: string }>();

    useEffect(() => {
        if (category) {
            try {
                console.log('URL Category parameter:', category);
                const decodedCategory = decodeId(category);
                console.log('Decoded category ID:', decodedCategory);

                if (decodedCategory && !isNaN(decodedCategory)) {
                    // Auto-select the category and determine its type
                    const findCategoryInHierarchy = (cats: Category[], targetId: number): { category: Category, type: 'main' | 'sub' | 'product' } | null => {
                        for (const cat of cats) {
                            if (cat.id === targetId) return { category: cat, type: 'main' };
                            if (cat.sub_categories) {
                                for (const subCat of cat.sub_categories) {
                                    if (subCat.id === targetId) return { category: subCat, type: 'sub' };
                                    if (subCat.product_categories) {
                                        for (const prodCat of subCat.product_categories) {
                                            if (prodCat.id === targetId) return { category: prodCat, type: 'product' };
                                        }
                                    }
                                }
                            }
                        }
                        return null;
                    };

                    const foundCategory = findCategoryInHierarchy(categories, decodedCategory);
                    if (foundCategory) {
                        handleCategorySelect(decodedCategory, foundCategory.type);
                        console.log(`Auto-selected ${foundCategory.type} category:`, foundCategory.category.name);
                    } else {
                        console.warn('Category not found in hierarchy:', decodedCategory);
                    }
                }
            } catch (error) {
                console.error("Error decoding category:", error);
            }
        }
    }, [category, categories]);

    const sidebarContent = (
        <div className="space-y-6">
            <div className="flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Categories */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                    {categoriesLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    )}
                </div>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                    {categoriesLoading ? (
                        <div className="space-y-2">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="ml-2 h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                                </div>
                            ))}
                        </div>
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                level={0}
                                selectedCategories={filters}
                                onCategorySelect={handleCategorySelect}
                                expandedCategories={expandedCategories}
                                onToggleExpand={handleToggleExpand}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No categories available</p>
                    )}
                </div>

                {/* Selected Categories Summary */}
                {(filters.main_categories.length > 0 || filters.sub_categories.length > 0 || filters.product_categories.length > 0) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Selected Categories:</h4>
                        <div className="space-y-1">
                            {filters.main_categories.length > 0 && (
                                <div className="text-xs text-blue-700">
                                    Main: {filters.main_categories.length} selected
                                </div>
                            )}
                            {filters.sub_categories.length > 0 && (
                                <div className="text-xs text-green-700">
                                    Sub: {filters.sub_categories.length} selected
                                </div>
                            )}
                            {filters.product_categories.length > 0 && (
                                <div className="text-xs text-blue-700">
                                    Product: {filters.product_categories.length} selected
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Price Range with Hover Effect */}
            <PriceRangeSlider
                priceRange={filters.priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                maxPrice={maxPrice}
            />

            {/* Rating */}
            <div className='hidden'>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.minRating === rating}
                                onChange={() => updateFilters('minRating', rating)}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-2 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                                <span className="ml-1 text-sm text-gray-700">& up</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={filters.inStockOnly}
                        onChange={(e) => updateFilters('inStockOnly', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">In stock only</span>
                </label>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => {
                    onFiltersChange({
                        main_categories: [],
                        sub_categories: [],
                        product_categories: [],
                        priceRange: [0, maxPrice],
                        minRating: 0,
                        inStockOnly: false
                    });
                    setExpandedCategories([]);
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
                Clear All Filters
            </button>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={onClose}
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            className="lg:hidden fixed left-0 top-0 w-80 h-full bg-white z-50 p-6 overflow-y-auto"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// Load More Button Component
interface LoadMoreButtonProps {
    isLoading: boolean;
    hasMore: boolean;
    onClick: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ isLoading, hasMore, onClick }) => {
    if (!hasMore) return null;

    return (
        <div className="text-center mt-8">
            <button
                onClick={onClick}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-2xl px-8 py-3 transition-colors duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Loading...' : 'Load More Products'}
            </button>
        </div>
    );
};

// Main All Products Page Component
const AllProductsPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [skip, setSkip] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const limit: number = 100;

    // Default state: no filters, newest first sorting
    const [filters, setFilters] = useState<FilterState>({
        main_categories: [],
        sub_categories: [],
        product_categories: [],
        priceRange: [0, 1000000],
        minRating: 0,
        inStockOnly: false
    });

    const [currentSort, setCurrentSort] = useState<SortOption>('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Load categories from API with proper hierarchy
    const loadCategories = useCallback(async (): Promise<void> => {
        try {
            setCategoriesLoading(true);

            // Use the hierarchy endpoint from your API
            const hierarchy = await categoryApi.getFullHierarchy();

            if (hierarchy && hierarchy.length > 0) {
                setCategories(hierarchy);
            } else {
                // Fallback: build hierarchy manually
                const mainCategories = await categoryApi.getMainCategories();

                if (mainCategories && mainCategories.length > 0) {
                    const hierarchy: Category[] = [];

                    for (const mainCat of mainCategories) {
                        // Get sub categories for this main category
                        const subCategories = await categoryApi.getSubCategories();
                        const filteredSubs = subCategories.filter((sub: any) => sub.main_category_id === mainCat.id);

                        const mainCategoryWithSubs: Category = {
                            ...mainCat,
                            sub_categories: []
                        };

                        for (const subCat of filteredSubs) {
                            // Get product categories for this sub category
                            const productCategories = await categoryApi.getProductCategories();
                            const filteredProducts = productCategories.filter((prod: any) => prod.sub_category_id === subCat.id);

                            mainCategoryWithSubs.sub_categories!.push({
                                ...subCat,
                                product_categories: filteredProducts
                            });
                        }

                        hierarchy.push(mainCategoryWithSubs);
                    }

                    setCategories(hierarchy);
                } else {
                    setCategories([]);
                }
            }
        } catch (err: any) {
            console.error("Failed to load categories:", err);
            setCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    }, []);

    // Load products from API - FIXED: Proper query parameter handling
    // In your AllProductsPage component - replace the loadProducts function
    const loadProducts = useCallback(async (loadMore: boolean = false): Promise<void> => {
        try {
            const currentSkip = loadMore ? skip : 0;

            if (loadMore) {
                setLoadingMore(true);
            } else {
                setInitialLoading(true);
                setSkip(0);
            }

            // Build query parameters as object
            const params: Record<string, any> = {
                skip: currentSkip.toString(),
                limit: limit.toString(),
            };

            // Add sorting
            if (currentSort === 'newest') {
                params.sort_by = 'created_at';
                params.sort_order = 'desc';
            } else if (currentSort === 'price-asc') {
                params.sort_by = 'price';
                params.sort_order = 'asc';
            } else if (currentSort === 'price-desc') {
                params.sort_by = 'price';
                params.sort_order = 'desc';
            } else if (currentSort === 'rating') {
                params.sort_by = 'rating';
                params.sort_order = 'desc';
            } else if (currentSort === 'featured') {
                params.sort_by = 'is_featured';
                params.sort_order = 'desc';
            }

            // Add category hierarchy filters
            if (filters.main_categories.length > 0) {
                params.main_category_id = filters.main_categories;
            }

            if (filters.sub_categories.length > 0) {
                params.sub_category_id = filters.sub_categories;
            }

            if (filters.product_categories.length > 0) {
                params.product_category_id = filters.product_categories;
            }

            // Add price range filter
            if (filters.priceRange[1] < 1000000) {
                params.price_min = '0';
                params.price_max = filters.priceRange[1].toString();
            }

            // Add in-stock filter
            if (filters.inStockOnly) {
                params.instock_min = '1';
            }

            // Add rating filter
            if (filters.minRating > 0) {
                params.rating_min = filters.minRating.toString();
            }

            // Add search query
            if (searchQuery) {
                params.search = searchQuery;
            }

            console.log('API Request Params:', params);

            // FIXED: Pass params as object
            const response = await productApi.getProducts(currentSkip, limit, params);

            const newProducts: Product[] = response.products || [];
            const total = response.total_count || 0;

            console.log('API Response:', {
                productsCount: newProducts.length,
                totalCount: total,
                hasMore: newProducts.length === limit,
                currentSkip,
                filtersApplied: {
                    main: filters.main_categories.length,
                    sub: filters.sub_categories.length,
                    product: filters.product_categories.length
                }
            });

            setAllProducts(prev => {
                if (!loadMore) {
                    return newProducts;
                }

                // Merge and remove duplicates
                const existingIds = new Set(prev.map(p => p.id));
                const filteredNew = newProducts.filter(p => !existingIds.has(p.id));
                return [...prev, ...filteredNew];
            });

            setTotalCount(total);
            setSkip(currentSkip + limit);
            setHasMore(newProducts.length === limit);

        } catch (err: any) {
            setError(err.message || "Failed to fetch products");
            console.error('API Error:', err);
        } finally {
            setInitialLoading(false);
            setLoadingMore(false);
        }
    }, [skip, limit, filters, currentSort, searchQuery]);

    // Initial data load
    useEffect(() => {
        const initializeData = async () => {
            await loadCategories();
            await loadProducts(false);
        };

        initializeData();
    }, []);

    // Reload products when filters, sort, or search change
    useEffect(() => {
        setAllProducts([]);
        setHasMore(true);
        loadProducts(false);
    }, [filters, currentSort, searchQuery]);

    // Load more products
    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        await loadProducts(true);
    }, [loadingMore, hasMore, loadProducts]);

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...allProducts];

        // Apply client-side filtering for better UX
        if (filters.priceRange[1] < 1000000) {
            filtered = filtered.filter(product => {
                const productPrice = product.price || 0;
                return productPrice >= filters.priceRange[0] && productPrice <= filters.priceRange[1];
            });
        }

        if (filters.minRating > 0) {
            filtered = filtered.filter(product =>
                (product.rating || 0) >= filters.minRating
            );
        }

        if (filters.inStockOnly) {
            filtered = filtered.filter(product =>
                (product.instock || 0) > 0
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sorting
        switch (currentSort) {
            case 'price-asc':
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'featured':
                filtered.sort((a, b) => {
                    if (a.is_featured !== b.is_featured) {
                        return a.is_featured ? -1 : 1;
                    }
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                break;
            default:
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
        }

        return filtered;
    }, [allProducts, filters, currentSort, searchQuery]);

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return (
            filters.main_categories.length > 0 ||
            filters.sub_categories.length > 0 ||
            filters.product_categories.length > 0 ||
            filters.minRating > 0 ||
            filters.inStockOnly ||
            searchQuery ||
            filters.priceRange[1] < 1000000
        );
    }, [filters, searchQuery]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen max-w-full m-auto">
                <div className="flex">
                    <div className="h-[calc(100vh-64px)]">
                        {/* Filter Sidebar */}
                        <FilterSidebar
                            filters={filters}
                            onFiltersChange={setFilters}
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 lg:ml-0 h-[calc(100vh-64px)] overflow-y-auto" id='main_content'>
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-6">
                            <div className="max-w-full mx-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">All Products</h1>
                                        <p className="text-gray-600 mt-1">
                                            Discover amazing products from verified sellers
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="lg:hidden bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:border-gray-400 transition-colors"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        <span>Filters</span>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Results Header */}
                        <div className="px-4 lg:px-8 py-4 bg-white border-b border-gray-200">
                            <div className="max-w-full mx-auto flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-600">
                                        Showing {filteredAndSortedProducts.length} of {totalCount} products
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={() => {
                                                setFilters({
                                                    main_categories: [],
                                                    sub_categories: [],
                                                    product_categories: [],
                                                    priceRange: [0, 1000000],
                                                    minRating: 0,
                                                    inStockOnly: false
                                                });
                                                setSearchQuery('');
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                                <SortDropdown
                                    currentSort={currentSort}
                                    onSortChange={setCurrentSort}
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="px-4 lg:px-8 py-8">
                            <div className="max-w-full mx-auto">
                                {initialLoading && allProducts.length === 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                        {[...Array(12)].map((_, index) => (
                                            <SkeletonLoader key={index} />
                                        ))}
                                    </div>
                                ) : filteredAndSortedProducts.length > 0 ? (
                                    <>
                                        <motion.div
                                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {filteredAndSortedProducts.map((product, index) => (
                                                <ProductCard
                                                    key={`${product.id}-${index}`}
                                                    product={product}
                                                    index={index}
                                                />
                                            ))}
                                        </motion.div>

                                        {/* Show skeleton loaders when loading more */}
                                        {loadingMore && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-8">
                                                {[...Array(8)].map((_, index) => (
                                                    <SkeletonLoader key={`skeleton-${index}`} />
                                                ))}
                                            </div>
                                        )}

                                        {/* Load More Button */}
                                        <LoadMoreButton
                                            isLoading={loadingMore}
                                            hasMore={hasMore}
                                            onClick={handleLoadMore}
                                        />
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-16"
                                    >
                                        <div className="max-w-md mx-auto">
                                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No products found
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Try adjusting your search or filter criteria to find what you're looking for.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setFilters({
                                                        main_categories: [],
                                                        sub_categories: [],
                                                        product_categories: [],
                                                        priceRange: [0, 1000000],
                                                        minRating: 0,
                                                        inStockOnly: false
                                                    });
                                                    setSearchQuery('');
                                                }}
                                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* End of results message */}
                                {!hasMore && filteredAndSortedProducts.length > 0 && (
                                    <div className="text-center mt-12 py-8 border-t border-gray-200">
                                        <p className="text-gray-600">You've reached the end of the products list.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Suggestions />
            <Footer />
        </>
    );
};

export default AllProductsPage;