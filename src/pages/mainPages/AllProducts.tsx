import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Star,
    Search,
    SlidersHorizontal,
    X,
    ShoppingCartIcon
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

// Filter Types
interface FilterState {
    categories: string[];
    brands: string[];
    priceRange: [number, number];
    minRating: number;
    inStockOnly: boolean;
}

// Sort Types
type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'featured';

// Product Card Component matching the Offers component structure
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
                    <div className="absolute hidden top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                    </div>
                )}
                {product.is_new && (
                    <div className="absolute hidden top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        NEW
                    </div>
                )}

                {/* Description overlay on hover */}
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
        { value: 'featured', label: 'Featured' },
        { value: 'newest', label: 'Newest First' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' }
    ];

    const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Featured';

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

// Filter Sidebar Component
interface FilterSidebarProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFiltersChange, isOpen, onClose, products }) => {
    const categories = Array.from(new Set(products.map(p => p.category?.name || '').filter(Boolean)));
    const maxPrice = Math.max(...products.map(p => p.price || 0), 100000);

    const updateFilters = (key: keyof FilterState, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const toggleCategory = (category: string) => {
        const updated = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        updateFilters('categories', updated);
    };
    let { category } = useParams<{ category: string }>();
    const [newcategory, setNewCategory] = useState<any>("")
    useEffect(() => {
        if (category) {
            const ds = decodeId(category)
            setNewCategory(ds)
            toggleCategory(newcategory)
            console.log("no:", newcategory)
        }
    }, [newcategory]);

    const sidebarContent = (
        <div className=" space-y-6">
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
                <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(category)}
                                onChange={() => toggleCategory(category)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                    <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={filters.priceRange[1]}
                        onChange={(e) => updateFilters('priceRange', [0, Number(e.target.value)])}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Rwf 0</span>
                        <span>Rwf {RWF.format(filters.priceRange[1])}</span>
                    </div>
                </div>
            </div>

            {/* Rating */}
            <div>
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
                onClick={() => onFiltersChange({
                    categories: [],
                    brands: [],
                    priceRange: [0, maxPrice],
                    minRating: 0,
                    inStockOnly: false
                })}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
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
                className="bg-primary hover:bg-primary/80 disabled:bg-primary/20 text-white font-semibold rounded-2xl px-8 py-3 transition-colors duration-300 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Loading...' : 'Load More Products'}
            </button>
        </div>
    );
};

// Main All Products Page Component
const AllProductsPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMoreProducts, setHasMoreProducts] = useState<boolean>(true);
    const [skip, setSkip] = useState<number>(0);
    const limit: number = 600;
    console.log(error)
    // console.log(error)
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        brands: [],
        priceRange: [0, 100000],
        minRating: 0,
        inStockOnly: false
    });

    const [currentSort, setCurrentSort] = useState<SortOption>('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(12);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);

    // Load products from API (sorted by id DESC)
    const loadProducts = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await productApi.getProducts(skip, limit);
            let newProducts: Product[] = response.products || response;

            // Sort by ID descending
            newProducts = newProducts.sort((a, b) => b.id - a.id);

            setAllProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const filteredNew = newProducts.filter(p => !existingIds.has(p.id));

                // Combine and maintain overall DESC order
                const combined = [...prev, ...filteredNew];
                return combined.sort((a, b) => b.id - a.id);
            });

            setSkip(prev => prev + limit);

            // Stop loading if fewer items returned
            if (newProducts.length < limit) {
                setHasMoreProducts(false);
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, [skip, limit]);

    // Initial data load
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);


    // Update max price when products are loaded
    useEffect(() => {
        if (allProducts.length > 0) {
            const maxPrice = Math.max(...allProducts.map(p => p.price || 0), 100000);
            setFilters(prev => ({
                ...prev,
                priceRange: [0, maxPrice]
            }));
        }
    }, [allProducts]);

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = allProducts.filter(product => {
            // Search filter
            if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category?.name || '')) {
                return false;
            }

            // Price filter
            const productPrice = product.price || 0;
            if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
                return false;
            }

            // Rating filter
            const productRating = product.rating || 0;
            if (productRating < filters.minRating) {
                return false;
            }

            // Stock filter
            const productStock = product.instock || 0;
            if (filters.inStockOnly && productStock <= 0) {
                return false;
            }

            return true;
        });

        // Sort products
        switch (currentSort) {
            case 'price-asc':
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'newest':
                filtered.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'featured':
            default:
                // filtered.sort((a, b) => {
                //     if (a.is_featured !== b.is_featured) {
                //         return b.is_featured ? 1 : -1;
                //     }
                //     return (b.rating || 0) - (a.rating || 0);
                // });
                break;
        }

        return filtered;
    }, [allProducts, filters, currentSort, searchQuery]);

    // Reset display count when filters change
    useEffect(() => {
        setDisplayCount(12);
    }, [filters, currentSort, searchQuery]);

    // Displayed products based on display count
    const displayedProducts = filteredAndSortedProducts;
    const hasMoreFilteredProducts = displayCount < filteredAndSortedProducts.length;

    // Load more products function
    const loadMoreProducts = useCallback(async () => {
        if (isLoadingMore || !hasMoreFilteredProducts) return;

        // setIsLoadingMore(true);
        // Simulate loading time
        // await new Promise(resolve => setTimeout(resolve, 10));
        // setDisplayCount(prev => prev + 12);
        // setIsLoadingMore(false);
    }, [isLoadingMore, hasMoreFilteredProducts]);

    // Load more products from API when needed
    const loadMoreApiProducts = useCallback(async () => {
        if (isLoadingMore || !hasMoreProducts) return;

        setIsLoadingMore(true);
        await loadProducts();
        setIsLoadingMore(false);
    }, [isLoadingMore, hasMoreProducts, loadProducts]);

    useEffect(() => {
        if (!autoLoadEnabled) return;

        const container = document.getElementById('main_content');
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            // Load more when within 20% of bottom
            if (scrollTop + clientHeight >= scrollHeight - clientHeight * 0.1) {
                if (hasMoreFilteredProducts) {
                    loadMoreProducts();
                } else if (hasMoreProducts) {
                    loadMoreApiProducts();
                }
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [autoLoadEnabled, loadMoreProducts, loadMoreApiProducts, hasMoreFilteredProducts, hasMoreProducts]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen max-w-full m-auto ">
                <div className="flex ">
                    <div className="h-[calc(100vh-64px)]">
                        {/* Filter Sidebar */}
                        <FilterSidebar
                            filters={filters}
                            onFiltersChange={setFilters}
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            products={allProducts}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 lg:ml-0 h-[calc(100vh-64px)] overflow-y-auto " id='main_content'>
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
                                        className="lg-hidden bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:border-gray-400 transition-colors"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        <span>Filters</span>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="relative max-w-md hidden">
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
                                        Showing {Math.min(displayedProducts.length, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                                    </p>
                                    {(filters.categories.length > 0 || filters.brands.length > 0 || filters.minRating > 0 || filters.inStockOnly || searchQuery) && (
                                        <button
                                            onClick={() => {
                                                setFilters({
                                                    categories: [],
                                                    brands: [],
                                                    priceRange: [0, Math.max(...allProducts.map(p => p.price || 0), 100000)],
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
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={autoLoadEnabled}
                                            onChange={(e) => setAutoLoadEnabled(e.target.checked)}
                                            className="mr-2"
                                        />
                                        Auto-load
                                    </label>
                                    <SortDropdown
                                        currentSort={currentSort}
                                        onSortChange={setCurrentSort}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="px-4 lg:px-8 py-8">
                            <div className="max-w-full mx-auto">
                                {loading && allProducts.length === 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                        {[...Array(12)].map((_, index) => (
                                            <SkeletonLoader key={index} />
                                        ))}
                                    </div>
                                ) : displayedProducts.length > 0 ? (
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {displayedProducts.map((product, index) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                index={index}
                                            />
                                        ))}
                                        {/* Skeleton Loaders */}
                                        {isLoadingMore && <>
                                            {[...Array(12)].map((_, index) => (
                                                <SkeletonLoader key={index} />
                                            ))}
                                        </>}

                                    </motion.div>
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
                                                        categories: [],
                                                        brands: [],
                                                        priceRange: [0, Math.max(...allProducts.map(p => p.price || 0), 100000)],
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

                                {/* Load More Button - Only show if auto-load is disabled */}
                                {!autoLoadEnabled && (
                                    <LoadMoreButton
                                        isLoading={isLoadingMore}
                                        hasMore={hasMoreFilteredProducts || hasMoreProducts}
                                        onClick={() => {
                                            if (hasMoreFilteredProducts) {
                                                loadMoreProducts();
                                            } else if (hasMoreProducts) {
                                                loadMoreApiProducts();
                                            }
                                        }}
                                    />
                                )}

                                {/* End of results message */}
                                {!hasMoreFilteredProducts && !hasMoreProducts && displayedProducts.length > 0 && (
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