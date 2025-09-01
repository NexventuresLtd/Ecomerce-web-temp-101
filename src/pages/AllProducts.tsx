import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Star,
    ShoppingCart,
    Eye,
    Search,
    SlidersHorizontal,
    X,
    Check,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Navbar from '../components/SharedComp/navabaritems/NavBar';
import Footer from '../components/SharedComp/footer';
import { ownerData, productsData } from '../constants/ProductsData/ProductData';
import { RWF } from '../app/priceConver';
import Offers from '../components/HomePage/body/Offers/OurOffers';
import { useNavigation } from '../hooks/product/useNavigation';

// Types
interface ProductColor {
    name: string;
    value: string;
    image?: string;
}

interface ProductImage {
    isprimary: boolean;
    image?: string;
}

interface Product {
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


// Sample Data


const products: Product[] = productsData

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

// Product Card Component
interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const primaryImage = product.images.find(img => img.isprimary)?.image || '';
    const displayImage = isHovered && product.hoverImage ? product.hoverImage : primaryImage;
    const { navigateToProduct } = useNavigation();
    return (
        <motion.div
            onClick={() => navigateToProduct(product.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all duration-300 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <img
                    src={displayImage}
                    alt={product.title}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                        </span>
                    )}
                    {product.isFeatured && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Featured
                        </span>
                    )}
                    {product.discount && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Owner Info Tooltip */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 rounded-lg p-2 flex items-center gap-2 text-xs">
                        <img
                            src={ownerData[0].image}
                            alt={ownerData[0].name}
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-700 font-medium">{ownerData[0].name}</span>
                        {ownerData[0].isverified && (
                            <Check className="w-3 h-3 text-blue-500" />
                        )}
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviewsCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-semibold text-gray-900">
                        {RWF.format(product.price)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            {RWF.format(product.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mb-3">
                    {product.instock > 0 ? (
                        <span className="text-sm text-green-600">
                            {product.instock} in stock
                        </span>
                    ) : (
                        <span className="text-sm text-red-600">Out of stock</span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                        disabled={product.instock === 0}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </button>
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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFiltersChange, isOpen, onClose }) => {
    const categories = Array.from(new Set(products.map(p => p.category)));
    const brands = Array.from(new Set(products.map(p => p.brand)));
    const maxPrice = Math.max(...products.map(p => p.price));

    const updateFilters = (key: keyof FilterState, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const toggleCategory = (category: string) => {
        const updated = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        updateFilters('categories', updated);
    };

    const toggleBrand = (brand: string) => {
        const updated = filters.brands.includes(brand)
            ? filters.brands.filter(b => b !== brand)
            : [...filters.brands, brand];
        updateFilters('brands', updated);
    };

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

            {/* Brands */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Brands</h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label key={brand} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{brand}</span>
                        </label>
                    ))}
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

// Pagination Component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === page
                        ? 'bg-primary text-white border-blue-600'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

// Main All Products Page Component
const AllProductsPage: React.FC = () => {
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        brands: [],
        priceRange: [0, Math.max(...products.map(p => p.price))],
        minRating: 0,
        inStockOnly: false
    });

    const [currentSort, setCurrentSort] = useState<SortOption>('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const itemsPerPage = 12;

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            // Search filter
            if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
                return false;
            }

            // Brand filter
            if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
                return false;
            }

            // Price filter
            if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
                return false;
            }

            // Rating filter
            if (product.rating < filters.minRating) {
                return false;
            }

            // Stock filter
            if (filters.inStockOnly && product.instock <= 0) {
                return false;
            }

            return true;
        });

        // Sort products
        switch (currentSort) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'featured':
            default:
                filtered.sort((a, b) => {
                    if (a.isFeatured !== b.isFeatured) {
                        return b.isFeatured ? 1 : -1;
                    }
                    return b.rating - a.rating;
                });
                break;
        }

        return filtered;
    }, [filters, currentSort, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters, currentSort, searchQuery]);



    return (
        <>
            <Navbar />
            <div className="min-h-screen max-w-full md:max-w-11/12 m-auto">
                <div className="flex">
                    <div className="h-[calc(100vh-64px)]">
                        {/* Filter Sidebar */}
                        <FilterSidebar
                            filters={filters}
                            onFiltersChange={setFilters}
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 lg:ml-0 h-[calc(100vh-64px)] overflow-y-auto">
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
                                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                                    </p>
                                    {(filters.categories.length > 0 || filters.brands.length > 0 || filters.minRating > 0 || filters.inStockOnly || searchQuery) && (
                                        <button
                                            onClick={() => {
                                                setFilters({
                                                    categories: [],
                                                    brands: [],
                                                    priceRange: [0, Math.max(...products.map(p => p.price))],
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
                                {paginatedProducts.length > 0 ? (
                                    <motion.div
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {paginatedProducts.map((product, index) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                index={index}
                                            />
                                        ))}
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
                                                        priceRange: [0, Math.max(...products.map(p => p.price))],
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

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Offers />
            <Footer />
        </>
    );
};

export default AllProductsPage;