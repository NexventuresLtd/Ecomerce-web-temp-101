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

// Filter Types
interface FilterState {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    inStockOnly: boolean;
}

// Sort Types
type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'featured';

// Main Product Management Component
const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'desc' });
    
    // Database pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        priceRange: [0, 1000000],
        minRating: 0,
        inStockOnly: false
    });

    const [currentSort, setCurrentSort] = useState<SortOption>('newest');

    const fetchProducts = useCallback(async (page: number = 1) => {
        setLoading(true);
        
        try {
            const skip = (page - 1) * entriesPerPage;
            
            // Build query parameters based on filters and pagination
            const queryParams = new URLSearchParams({
                skip: skip.toString(),
                limit: entriesPerPage.toString(),
                sort_by: currentSort === 'newest' ? 'created_at' : 
                        currentSort === 'price-asc' ? 'price' :
                        currentSort === 'price-desc' ? 'price' : 'created_at',
                sort_order: currentSort === 'price-desc' ? 'desc' : 'asc'
            });

            // Add price range filter
            if (filters.priceRange[1] < 1000000) {
                queryParams.append('price_min', '0');
                queryParams.append('price_max', filters.priceRange[1].toString());
            }

            // Add in-stock filter
            if (filters.inStockOnly) {
                queryParams.append('instock_min', '1');
            }

            // Add rating filter
            if (filters.minRating > 0) {
                queryParams.append('rating_min', filters.minRating.toString());
            }

            // Add search query
            if (searchTerm) {
                queryParams.append('search', searchTerm);
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

    // Load products when filters, sort, search, or page changes
    useEffect(() => {
        setCurrentPage(1); // Reset to first page when filters change
    }, [filters, currentSort, searchTerm, entriesPerPage]);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, fetchProducts]);

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
            // Reload current page after deletion
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
        filters.minRating > 0 ||
        filters.inStockOnly ||
        filters.priceRange[1] < 1000000;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
                <p className="text-gray-600">Manage your product inventory and listings</p>
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
                                onClick={() => setFilters({
                                    categories: [],
                                    priceRange: [0, 1000000],
                                    minRating: 0,
                                    inStockOnly: false
                                })}
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-2 rounded-lg"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white"
                            />
                        </div>
                        
                        {/* Sort Dropdown */}
                        <select
                            value={currentSort}
                            onChange={(e) => setCurrentSort(e.target.value as SortOption)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            {/* <option value="rating">Highest Rated</option> */}
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
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price Range Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Price: {formatRWF(filters.priceRange[1])}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1000000"
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
                            <span>Rwf 1M</span>
                        </div>
                    </div>

                    {/* Rating Filter */}
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

                    {/* Stock Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Status
                        </label>
                        <select
                            value={filters.inStockOnly ? 'in_stock' : 'all'}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                inStockOnly: e.target.value === 'in_stock'
                            }))}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Products</option>
                            <option value="in_stock">In Stock Only</option>
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
                            // Reload current page after save
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