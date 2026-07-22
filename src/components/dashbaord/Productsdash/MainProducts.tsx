import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

import ViewProdTable from './ViewAllProducts/viewProdTable';
import type { Product } from '../../../types/Product/NewProductDataDash';
import ProductForm from './ViewAllProducts/ProductForm';
import ProductDetailView from './ViewAllProducts/ProductDetailView';
import { categoryApi } from '../../../app/dashcategory/category';
import type { ProductCategory } from '../../../types/dashboard/category';

// Filter Types
type StockStatus = 'all' | 'active' | 'inactive' | 'in_stock' | 'out_of_stock';
type Condition = 'all' | 'new' | 'used';

interface FilterState {
    categories: string[];
    productCategoryId: number | 'all';
    condition: Condition;
    featuredOnly: boolean;
    priceRange: [number, number];
    minPrice: number;
    minRating: number;
    inStockOnly: boolean;
    stockStatus: StockStatus;
}

// Sort Types
type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'featured' | 'oldest';

// Main Product Management Component
const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    
    // Database pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        productCategoryId: 'all',
        condition: 'all',
        featuredOnly: false,
        priceRange: [0, 100000000],
        minPrice: 0,
        minRating: 0,
        inStockOnly: false,
        stockStatus: 'all' as StockStatus,
    });

    const [currentSort, setCurrentSort] = useState<SortOption>('newest');
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);

    // Load categories once for the filter dropdown
    useEffect(() => {
        categoryApi.getProductCategories()
            .then((data: any) => setProductCategories(Array.isArray(data) ? data : []))
            .catch(() => setProductCategories([]));
    }, []);

    const fetchProducts = useCallback(async (page: number = 1, searchQuery: string = searchTerm) => {
        setLoading(true);
        
        try {
            const skip = (page - 1) * entriesPerPage;
            
            // Build query parameters based on filters and pagination
            const queryParams = new URLSearchParams({
                skip: skip.toString(),
                limit: entriesPerPage.toString(),
            });

            // Add sorting parameters - FIXED: Restore dynamic sorting
            if (currentSort === 'newest') {
                queryParams.append('sort_by', 'created_at');
                queryParams.append('sort_order', 'desc');
            } else if (currentSort === 'oldest') {
                queryParams.append('sort_by', 'created_at');
                queryParams.append('sort_order', 'asc');
            } else if (currentSort === 'price-asc') {
                queryParams.append('sort_by', 'price');
                queryParams.append('sort_order', 'asc');
            } else if (currentSort === 'price-desc') {
                queryParams.append('sort_by', 'price');
                queryParams.append('sort_order', 'desc');
            } else if (currentSort === 'featured') {
                queryParams.append('is_featured', 'true');
                queryParams.append('sort_by', 'created_at');
                queryParams.append('sort_order', 'desc');
            } else {
                // Default fallback
                queryParams.append('sort_by', 'created_at');
                queryParams.append('sort_order', 'desc');
            }

            // Add price range filter
            if (filters.minPrice > 0) {
                queryParams.append('price_min', filters.minPrice.toString());
            }
            if (filters.priceRange[1] < 100000000) {
                queryParams.append('price_max', filters.priceRange[1].toString());
            }

            // Stock status filter
            if (filters.stockStatus === 'active')       queryParams.append('is_active', 'true');
            else if (filters.stockStatus === 'inactive') queryParams.append('is_active', 'false');
            else if (filters.stockStatus === 'in_stock') queryParams.append('instock_min', '1');
            else if (filters.stockStatus === 'out_of_stock') { queryParams.append('instock_min', '0'); queryParams.append('instock_max', '0'); }
            else if (filters.inStockOnly)                queryParams.append('instock_min', '1');

            // Category filter
            if (filters.productCategoryId !== 'all') {
                queryParams.append('product_category_id', filters.productCategoryId.toString());
            }

            // Condition filter (new/used)
            if (filters.condition !== 'all') {
                queryParams.append('is_new', filters.condition);
            }

            // Featured filter
            if (filters.featuredOnly) {
                queryParams.set('is_featured', 'true');
            }

            // Add rating filter (keep it in query but it's hidden in UI)
            if (filters.minRating > 0) {
                queryParams.append('rating_min', filters.minRating.toString());
            }

            // Add search query
            if (searchQuery) {
                queryParams.append('search', searchQuery);
            }

            const response = await mainAxios.get(`/products/?${queryParams.toString()}`);
            const responseData = response.data;
            
            const newProducts = responseData.products || [];
            const total = responseData.total_count || 0;

            setProducts(newProducts);
            setTotalCount(total);
            setHasMore(skip + newProducts.length < total);
            
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [entriesPerPage, filters, currentSort, searchTerm]);

    // Handle search submission
    const handleSearch = useCallback(() => {
        setCurrentPage(1);
        fetchProducts(1, searchTerm);
    }, [searchTerm, fetchProducts]);

    // Handle Enter key press in search input
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Load products when filters, sort, or entries change
    useEffect(() => {
        setCurrentPage(1);
        fetchProducts(1);
    }, [filters, currentSort, entriesPerPage]);

    // Load products when page changes
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Apply client-side sorting only (filtering is done server-side)
    const sortedProducts = [...products].sort((a, b) => {
        if (!sortConfig) return 0;

        const aValue = a[sortConfig.key as keyof Product];
        const bValue = b[sortConfig.key as keyof Product];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const formatRWF = (amount: number) => {
        return new Intl.NumberFormat('rw-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await mainAxios.delete(`/products/${id}`);
            await fetchProducts(currentPage);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <ChevronUp size={14} className="text-gray-400" />;
        }
        return sortConfig.direction === 'asc' ?
            <ChevronUp size={14} className="text-blue-600" /> :
            <ChevronDown size={14} className="text-blue-600" />;
    };

    // Calculate total pages for database pagination
    const totalPages = Math.ceil(totalCount / entriesPerPage);

    // Check if any filters are active
    const hasActiveFilters = filters.categories.length > 0 ||
        filters.productCategoryId !== 'all' ||
        filters.condition !== 'all' ||
        filters.featuredOnly ||
        filters.minRating > 0 ||
        filters.inStockOnly ||
        filters.minPrice > 0 ||
        filters.priceRange[1] < 100000000 ||
        filters.stockStatus !== 'all';

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
                <p className="text-gray-600">Manage your product inventory and listings</p>
            </div>

            {/* Stock Status Filter Chips */}
            <div className="mb-4 flex flex-wrap gap-2">
                {([
                    { label: 'All', value: 'all' },
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'In Stock', value: 'in_stock' },
                    { label: 'Out of Stock', value: 'out_of_stock' },
                ] as { label: string; value: StockStatus }[]).map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => { setFilters(f => ({ ...f, stockStatus: opt.value })); setCurrentPage(1); }}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            filters.stockStatus === opt.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                            <span className="text-gray-700 text-sm font-medium">Show</span>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="text-gray-700 text-sm font-medium">entries</span>
                        </div>

                        <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                            Total: <span className="font-semibold text-blue-700">{totalCount}</span> products
                        </div>

                        {/* Filter Status */}
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    setFilters({
                                        categories: [],
                                        productCategoryId: 'all',
                                        condition: 'all',
                                        featuredOnly: false,
                                        priceRange: [0, 100000000],
                                        minPrice: 0,
                                        minRating: 0,
                                        inStockOnly: false,
                                        stockStatus: 'all',
                                    });
                                    setCurrentPage(1);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-2 rounded-lg"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white"
                            />
                            <button
                                onClick={handleSearch}
                                className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium"
                            >
                                <Search size={16} />
                                Search
                            </button>
                        </div>
                        
                        {/* Sort Dropdown - FIXED: Now properly sends sorting parameters to backend */}
                        <select
                            value={currentSort}
                            onChange={(e) => setCurrentSort(e.target.value as SortOption)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium"
                        >
                            <Plus size={18} />
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={filters.productCategoryId}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                productCategoryId: e.target.value === 'all' ? 'all' : Number(e.target.value)
                            }))}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            {productCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Stock Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Status
                        </label>
                        <select
                            value={filters.stockStatus}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                stockStatus: e.target.value as StockStatus
                            }))}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Products</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="in_stock">In Stock Only</option>
                            <option value="out_of_stock">Out of Stock Only</option>
                        </select>
                    </div>

                    {/* Condition Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condition
                        </label>
                        <select
                            value={filters.condition}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                condition: e.target.value as Condition
                            }))}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">New & Used</option>
                            <option value="new">New Only</option>
                            <option value="used">Used Only</option>
                        </select>
                    </div>

                    {/* Featured Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visibility
                        </label>
                        <select
                            value={filters.featuredOnly ? 'featured' : 'all'}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                featuredOnly: e.target.value === 'featured'
                            }))}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Products</option>
                            <option value="featured">Featured Only</option>
                        </select>
                    </div>

                    {/* Min Price Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Price: {formatRWF(filters.minPrice)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100000000"
                            step="10000"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                minPrice: Number(e.target.value)
                            }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Rwf 0</span>
                            <span>Rwf 100M</span>
                        </div>
                    </div>

                    {/* Max Price Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Price: {formatRWF(filters.priceRange[1])}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100000000"
                            step="10000"
                            value={filters.priceRange[1]}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                priceRange: [0, Number(e.target.value)]
                            }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Rwf 0</span>
                            <span>Rwf 100M</span>
                        </div>
                    </div>

                    {/* Rating Filter - kept hidden as before */}
                    <div className='hidden'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Rating
                        </label>
                        <select
                            value={filters.minRating}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                minRating: Number(e.target.value)
                            }))}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={0}>Any Rating</option>
                            <option value={4}>4★ & above</option>
                            <option value={3}>3★ & above</option>
                            <option value={2}>2★ & above</option>
                            <option value={1}>1★ & above</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <ViewProdTable 
                SortIcon={SortIcon} 
                loading={loading}
                displayedProducts={sortedProducts}
                handleSort={handleSort} 
                setCurrentPage={setCurrentPage}
                setViewingProduct={setViewingProduct}
                setEditingProduct={setEditingProduct} 
                handleDelete={handleDelete}
                formatRWF={formatRWF} 
                searchTerm={searchTerm} 
                products={products}
                filteredProducts={products} 
                currentPage={currentPage}
                entriesPerPage={entriesPerPage} 
                totalPages={totalPages} 
                hasMore={hasMore}
                setShowAddForm={setShowAddForm}
                totalCount={totalCount}
            />

            {/* Add/Edit Product Form */}
            <AnimatePresence>
                {(showAddForm || editingProduct) && (
                    <ProductForm
                        product={editingProduct || undefined}
                        onClose={() => {
                            setShowAddForm(false);
                            setEditingProduct(null);
                        }}
                        onSave={async () => {
                            await fetchProducts(currentPage);
                            setShowAddForm(false);
                            setEditingProduct(null);
                        }}
                        formatRWF={formatRWF}
                    />
                )}
            </AnimatePresence>

            {/* Product Detail View */}
            <AnimatePresence>
                {viewingProduct && (
                    <ProductDetailView
                        product={viewingProduct}
                        onClose={() => setViewingProduct(null)}
                        formatRWF={formatRWF}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManagement;