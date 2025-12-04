import { ChevronLeft, ChevronRight, Edit, Eye, ImageIcon, Package, Plus, Star, Trash2 } from "lucide-react";
import type { Product } from "../../../../types/Product/NewProductDataDash";

interface ViewModalProps {
    SortIcon: React.FC<{ columnKey: string }>;
    displayedProducts: Product[];
    handleSort: (key: string) => void;
    loading: boolean;
    setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
    setViewingProduct: React.Dispatch<React.SetStateAction<any | null>>;
    setEditingProduct: React.Dispatch<React.SetStateAction<any | null>>;
    handleDelete: (id: number) => void;
    formatRWF: (amount: number) => string;
    searchTerm: string;
    products: any[];
    filteredProducts: any[];
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    entriesPerPage: number;
    totalPages: number;
    hasMore: boolean;
    totalCount: number;
}

const ViewProdTable = ({
    SortIcon, loading, displayedProducts, handleSort, setCurrentPage, setViewingProduct,
    setEditingProduct, handleDelete, formatRWF, searchTerm, currentPage,
    entriesPerPage, totalPages, setShowAddForm, totalCount
}: ViewModalProps) => {

    // Calculate display range for database pagination
    const startIndex = (currentPage - 1) * entriesPerPage + 1;
    const endIndex = Math.min(currentPage * entriesPerPage, totalCount);

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading products...</p>
                        <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your products</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            <button onClick={() => handleSort('id')} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                                                <span>ID</span>
                                                <SortIcon columnKey="id" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700  tracking-wider">
                                            <button onClick={() => handleSort('price')} className="flex uppercase items-center gap-2 hover:text-gray-900 transition-colors">
                                                <span>Price</span>
                                                <SortIcon columnKey="price" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            <button onClick={() => handleSort('instock')} className="flex uppercase items-center gap-2 hover:text-gray-900 transition-colors">
                                                <span>Stock</span>
                                                <SortIcon columnKey="instock" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 hidden py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Brock
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {displayedProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Package size={64} className="text-gray-300 mb-4" />
                                                    <p className="text-gray-500 text-lg font-medium">No products found</p>
                                                    <p className="text-gray-400 text-sm mt-2">
                                                        {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
                                                    </p>
                                                    {!searchTerm && (
                                                        <button
                                                            onClick={() => setShowAddForm(true)}
                                                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm font-medium"
                                                        >
                                                            <Plus size={16} />
                                                            Add Your First Product
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedProducts.map((product, index) => {
                                            const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
                                            const imageUrl = primaryImage?.url ? `${import.meta.env.VITE_API_BASE_URL}${primaryImage.url}` : '';

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className="hover:bg-gray-50 transition-colors duration-150 group"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                                                            #{index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                                {imageUrl ? (
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={product.title}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                        <ImageIcon size={24} className="text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="font-semibold text-gray-900 truncate mb-1">
                                                                    {product.title}
                                                                </div>
                                                                <div className="text-gray-500 text-sm line-clamp-2">
                                                                    {product.description}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    {product.is_featured && (
                                                                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                            <Star size={12} />
                                                                            Featured
                                                                        </span>
                                                                    )}
                                                                    {product.discount && product.discount > 0 && (
                                                                        <span className="inline-flex bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                                                            {product.discount}% OFF
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-right">
                                                            <div className="font-semibold text-gray-900 text-lg">
                                                                {formatRWF(product.price)}
                                                            </div>
                                                            {product.original_price && product.original_price > product.price && (
                                                                <div className="text-sm text-gray-500 line-through">
                                                                    {formatRWF(product.original_price)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${product.instock > 10
                                                            ? 'bg-green-100 text-green-800'
                                                            : product.instock > 0
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            <div className={`w-2 h-2 rounded-full ${product.instock > 10
                                                                ? 'bg-green-500'
                                                                : product.instock > 0
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-red-500'
                                                                }`}></div>
                                                            {product.instock} in stock
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-2">
                                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${product.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {product.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                                {product.is_new}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap hidden">
                                                        <div className="flex items-center gap-1">
                                                            <Star size={16} className={`${product.rating >= 1 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                            <Star size={16} className={`${product.rating >= 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                            <Star size={16} className={`${product.rating >= 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                            <Star size={16} className={`${product.rating >= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                            <Star size={16} className={`${product.rating >= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                            <span className="text-sm text-gray-600 ml-1">
                                                                ({product.reviews_count || 0})
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 max-w-xs uppercase">
                                                            <span className="text-gray-400 italic">{product.brock}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 max-w-xs uppercase">
                                                            {product.category?.name || (
                                                                <span className="text-gray-400 italic">No category</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setViewingProduct(product)}
                                                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                                                                title="View details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingProduct(product)}
                                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                                title="Edit product"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                                                title="Delete product"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        {displayedProducts.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        Showing <span className="font-semibold">{startIndex}</span> to{' '}
                                        <span className="font-semibold">{endIndex}</span> of{' '}
                                        <span className="font-semibold">{totalCount}</span> products
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                            Previous
                                        </button>

                                        {/* Page Info */}
                                        <div className="text-sm text-gray-600">
                                            Page <span className="font-semibold">{currentPage}</span> of{' '}
                                            <span className="font-semibold">{totalPages}</span>
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default ViewProdTable