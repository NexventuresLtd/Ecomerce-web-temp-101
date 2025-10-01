import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { categoryApi } from '../../../app/dashcategory/category';
import { productApi } from '../../../app/products/allProductgeter';

import type { ProductCategory } from '../../../types/dashboard/category';
import { RWF } from '../../../app/priceConver';
import { Modal } from './modalProd';
import { ProductForm } from './ProductForm';
import { ImageManager } from './ImageManager';
import type { Product } from '../../../types/Product/producttypeAdmin';

// Main Product List Component
const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [showForm, setShowForm] = useState(false);
    const [showImageManager, setShowImageManager] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    // const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedProductId2, setSelectedProductId2] = useState<Product | null>(null);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productApi.getProducts();
            setProducts(response.products || response);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const productCats = await categoryApi.getProductCategories();
            setCategories(productCats);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productApi.deleteProduct(id);
            await loadProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handleManageImages = (product: Product) => {
        setSelectedProductId2(product);
        setShowImageManager(true);
    };

    const handleFormSubmit = async (data: Product) => {
        try {
            setFormLoading(true);

            // Convert base64 images to the format expected by the API
            const formattedData = {
                ...data,
                images: data.images?.map(img => ({
                    id: (img as any).id ?? 0,
                    url: img.url,
                    is_primary: img.is_primary
                }))
            };
            console.log(formattedData)
            if (editingProduct) {
                await productApi.updateProduct(editingProduct.id, formattedData);
            } else {
                await productApi.createProduct(formattedData);
            }

            setShowForm(false);
            await loadProducts();
        } catch (error) {
            console.error('Failed to save product:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && product.is_active) ||
            (filterStatus === 'inactive' && !product.is_active);

        const matchesCategory = filterCategory === 'all' ||
            product.category_id.toString() === filterCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                <button
                    onClick={handleCreateProduct}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} className="mr-2" />
                    Add Product
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {/* Grid Header */}
                    <div className="grid grid-cols-5 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="px-6 py-3">Product</div>
                        <div className="px-6 py-3">Price</div>
                        <div className="px-6 py-3">Stock</div>
                        <div className="px-6 py-3">Status</div>
                        <div className="px-6 py-3">Actions</div>
                    </div>

                    {/* Grid Body */}
                    <div className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="grid grid-cols-5 items-center hover:bg-gray-50"
                            >

                                {/* Product */}
                                <div className="px-6 py-4 flex items-center">
                                    {product.images?.find(img => img.is_primary) ? (
                                        <>
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}/${product.images.find(img => img.is_primary)?.url}`}
                                                alt={product.title}
                                                className="h-26 w-26 object-cover rounded"
                                            />
                                        </>
                                    ) : (
                                        <div className="h-26 w-26 bg-gray-200 rounded flex items-center justify-center">
                                            <ImageIcon size={16} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {product.category?.name || 'No category'}
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="px-6 py-4 text-sm text-gray-900">
                                    {RWF.format(product.price || 0)}
                                    {product.original_price && product.original_price > (product.price || 0) && (
                                        <div className="text-sm text-red-600 line-through">
                                            {RWF.format(product.original_price)}
                                        </div>
                                    )}
                                </div>

                                {/* Stock */}
                                <div className="px-6 py-4 text-sm text-gray-900">
                                    {product.instock}
                                </div>

                                {/* Status */}
                                <div className="px-6 py-4">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="px-6 py-4 text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleManageImages(product)}
                                        className="text-blue-600 hover:text-blue-900"
                                        title="Manage Images"
                                    >
                                        <ImageIcon size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="text-blue-600 hover:text-blue-900"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                            ? 'No products match your filters'
                            : 'No products found'}
                    </div>
                )}
            </div>


            {/* Modals */}
            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={editingProduct ? 'Edit Product' : 'Create Product'}
                size="xl"
            >
                <ProductForm
                    isEditing={editingProduct ? true : false}
                    product={editingProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowForm(false)}
                    loading={formLoading}
                />
            </Modal>

            <Modal
                isOpen={showImageManager}
                onClose={() => setShowImageManager(false)}
                title="Manage Product Images"
                size="xl"
            >
                {selectedProductId2 && (
                    <ImageManager
                        productId={selectedProductId2}
                        onClose={() => setShowImageManager(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProductList;