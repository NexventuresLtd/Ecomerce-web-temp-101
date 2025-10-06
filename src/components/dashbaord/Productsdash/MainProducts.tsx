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
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const limit = 100;

    const fetchProducts = useCallback(async () => {
        // Prevent multiple simultaneous calls
        if (!hasMore || loading) return;

        if (skip == 0) setLoading(true);
        try {
            const currentSkip = skip; // snapshot current skip to prevent race condition
            const response = await mainAxios.get(`/products/?skip=${currentSkip}&limit=${limit}`);
            const newData = response.data;

            if (newData.length < limit) setHasMore(false);

            // Avoid duplicates by filtering new ones
            setProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const filtered = newData.filter((p: any) => !existingIds.has(p.id));
                return [...prev, ...filtered];
            });

            setSkip(prev => prev + limit);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [skip, hasMore, loading]);

    useEffect(() => {
        fetchProducts(); // initial fetch

        const interval = setInterval(() => {
            if (hasMore && !loading) {
                fetchProducts();
            }
        }, 100); // background fetch every 1 second

        return () => clearInterval(interval);
    }, [fetchProducts, hasMore, loading]);


    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (!sortConfig) return 0;

        const aValue = a[sortConfig.key as keyof Product];
        const bValue = b[sortConfig.key as keyof Product];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // const displayedProducts = sortedProducts.slice(0, entriesPerPage);

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
            await fetchProducts();
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
    // Add these state variables at the top of your ProductManagement component
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages
    const totalPages = Math.ceil(filteredProducts.length / entriesPerPage);

    // Update displayedProducts calculation to use pagination
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const displayedProducts = sortedProducts.slice(startIndex, endIndex);

    // Reset to page 1 when search term changes or entries per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, entriesPerPage]);

    // Your table and footer code here...

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
                                {Array.from({ length: 500 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num * 10}>{num * 10}</option>
                                ))}
                            </select>
                            <span className="text-gray-700 text-sm font-medium">entries</span>
                        </div>

                        <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                            Total: <span className="font-semibold text-blue-700">{filteredProducts.length}</span> products
                        </div>
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
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium"
                        >
                            <Plus size={18} />
                            Add Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Container */}

            <ViewProdTable SortIcon={SortIcon} loading={loading}
                displayedProducts={displayedProducts}
                handleSort={handleSort} setCurrentPage={setCurrentPage}
                setViewingProduct={setViewingProduct}
                setEditingProduct={setEditingProduct} handleDelete={handleDelete}
                formatRWF={formatRWF} searchTerm={searchTerm} products={products}
                filteredProducts={filteredProducts} currentPage={currentPage}
                entriesPerPage={entriesPerPage} totalPages={totalPages} hasMore={hasMore}
                setShowAddForm={setShowAddForm}
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
                            await fetchProducts();
                            setShowAddForm(false);
                            setEditingProduct(null);
                            setLoading(false);
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