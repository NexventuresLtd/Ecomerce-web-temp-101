// ProductManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Image as ImageIcon,
    Star,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Upload,
    Tag,
    Package,

    Loader,
    Palette,
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';
import { categoryApi } from '../../../app/dashcategory/category';
import EnhancedTextEditor from './Enhanced';

// Types
interface ProductImage {
    url: string;
    is_primary: boolean;
    alt_text?: string;
    thumbnail?: string;
}

interface CategoryInfo {
    id: number;
    name: string;
    slug: string;
    image?: string;
}

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    original_price?: number;
    discount?: number;
    rating: number;
    is_new: boolean;
    is_featured: boolean;
    is_active: boolean;
    reviews_count: number;
    instock: number;
    delivery_fee?: string;
    brock?: string;
    returnDay?: string;
    warranty?: string;
    hover_image?: string;
    owner_id?: number;
    tutorial_video?: string;
    tags: string[];
    features: string[];
    colors: Array<{ name: string; hex: string; stock: number }>;
    category_id?: number;
    images: ProductImage[];
    created_at: string;
    updated_at: string;
    category?: CategoryInfo;
}

interface CategoryHierarchy {
    mainCategories: any[];
    subCategories: any[];
    productCategories: any[];
}

interface ProductFilters {
    search: any;
    category: any;
    minPrice: any;
    maxPrice: any;
    inStock: any;
    isNew: any;
    isFeatured: any;
    sortBy: any;
}

// Color Picker Component
const ColorPicker: React.FC<{
    colors: Array<{ name: string; hex: string; stock: number }>;
    onColorsChange: (colors: Array<{ name: string; hex: string; stock: number }>) => void;
    loading?: boolean;
}> = ({ colors, onColorsChange, loading = false }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentColor, setCurrentColor] = useState({ name: '', hex: '#3B82F6', stock: 0 });

    const predefinedColors = [
        { name: 'Red', hex: '#EF4444' },
        { name: 'Blue', hex: '#3B82F6' },
        { name: 'Green', hex: '#10B981' },
        { name: 'Yellow', hex: '#F59E0B' },
        { name: 'Purple', hex: '#8B5CF6' },
        { name: 'Pink', hex: '#EC4899' },
        { name: 'Indigo', hex: '#6366F1' },
        { name: 'Gray', hex: '#6B7280' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
    ];

    const handleAddColor = () => {
        if (currentColor.name.trim() && currentColor.stock >= 0) {
            onColorsChange([...colors, { ...currentColor }]);
            setCurrentColor({ name: '', hex: '#3B82F6', stock: 0 });
            setShowAddForm(false);
        }
    };

    const handleRemoveColor = (index: number) => {
        onColorsChange(colors.filter((_, i) => i !== index));
    };

    // const updateColor = (index: number, field: string, value: string | number) => {
    //     const updatedColors = [...colors];
    //     updatedColors[index] = { ...updatedColors[index], [field]: value };
    //     onColorsChange(updatedColors);
    // };

    const selectPredefinedColor = (color: { name: string; hex: string }) => {
        setCurrentColor({ ...currentColor, name: color.name, hex: color.hex });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Color Variations</label>
                <button
                    type="button"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                    <Plus size={16} />
                    Add Color
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-gray-50 rounded-lg space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color Name</label>
                                <input
                                    type="text"
                                    value={currentColor.name}
                                    onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                                    placeholder="Enter color name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    value={currentColor.stock || ''}
                                    onChange={(e) => setCurrentColor({ ...currentColor, stock: parseInt(e.target.value) || 0 })}
                                    placeholder="Enter stock quantity"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Color</label>
                            <div className="grid grid-cols-5 gap-2">
                                {predefinedColors.map((color, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => selectPredefinedColor(color)}
                                        className={`p-2 rounded-lg border-2 transition-all ${currentColor.hex === color.hex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'
                                            }`}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-md"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <div className="text-xs mt-1 text-gray-600 truncate">{color.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex items-center gap-2 flex-1">
                                <div
                                    className="w-8 h-8 rounded border border-gray-300"
                                    style={{ backgroundColor: currentColor.hex }}
                                />
                                <span className="text-sm text-gray-600 font-mono">{currentColor.hex}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400"
                                disabled={loading || !currentColor.name.trim()}
                            >
                                Add Color
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {colors.map((color, index) => (
                    <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div
                                className="w-10 h-10 rounded-lg border border-gray-300"
                                style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">{color.name}</div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="font-mono">{color.hex}</span>
                                    <span>{color.stock} in stock</span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            disabled={loading}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {colors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Palette size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No colors added yet</p>
                    <p className="text-sm">Click "Add Color" to create color variations</p>
                </div>
            )}
        </div>
    );
};

// Image Manager Component
const ImageManager: React.FC<{
    images: File[];
    existingImages?: ProductImage[];
    onImagesChange: (images: File[]) => void;
    loading?: boolean;
}> = ({ images, existingImages = [], onImagesChange, loading = false }) => {
    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;
        const newImages = Array.from(files);
        onImagesChange([...images, ...newImages]);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
    };

    const setPrimaryImage = (index: number) => {
        if (index === 0) return; // Already primary

        const newImages = [...images];
        const [primaryImage] = newImages.splice(index, 1);
        newImages.unshift(primaryImage);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                <span className="text-sm text-gray-500">{images.length} images selected</span>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors hover:border-primary/50">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="product-images"
                    disabled={loading}
                />
                <label
                    htmlFor="product-images"
                    className="cursor-pointer block"
                >
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <div className="text-gray-600">
                        <span className="text-primary font-medium">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                        PNG, JPG, WEBP up to 10MB each
                    </div>
                </label>
            </div>

            {/* Uploaded Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((file, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg shadow-sm"
                            />

                            {/* Primary Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                                    Primary
                                </div>
                            )}

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setPrimaryImage(index)}
                                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                                        title="Set as primary"
                                    >
                                        <Star size={16} className="text-yellow-600" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                                    title="Remove image"
                                >
                                    <X size={16} className="text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Existing Images for Edit Mode */}
            {existingImages.length > 0 && (
                <div className="border-t pt-6 mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">Existing Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {existingImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}${image.url}`}
                                    alt={image.alt_text || `Product image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg shadow-sm"
                                />
                                {image.is_primary && (
                                    <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                                        Primary
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {images.length === 0 && existingImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <ImageIcon size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No images uploaded yet</p>
                    <p className="text-sm">Upload product images to get started</p>
                </div>
            )}
        </div>
    );
};

// Main Product Management Component
const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filters, setFilters] = useState<ProductFilters>({
        search: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        inStock: null,
        isNew: null,
        isFeatured: null,
        sortBy: null
    });
    const [pagination, setPagination] = useState({
        skip: 0,
        limit: 12,
        total: 0
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await mainAxios.get(`/products?skip=${pagination.skip}&limit=${pagination.limit}`);
            setProducts(response.data);
            // console.log("alebi", response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.skip, pagination.limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            !filters.search ||
            product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.description.toLowerCase().includes(filters.search.toLowerCase());

        const matchesCategory =
            !filters.category || product.category?.name === filters.category;

        const matchesPrice =
            (filters.minPrice == null && filters.maxPrice == null) ||
            (product.price >= (filters.minPrice ?? 0) &&
                product.price <= (filters.maxPrice ?? Infinity));

        const matchesStock =
            !filters.inStock || product.instock > 0;

        const matchesNew =
            !filters.isNew || product.is_new;

        const matchesFeatured =
            !filters.isFeatured || product.is_featured;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesStock &&
            matchesNew &&
            matchesFeatured
        );
    });

    // console.log("filteredProducts", filteredProducts);
    // console.log("products", products);
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (filters.sortBy) {
            case 'price_low':
                return a.price - b.price;
            case 'price_high':
                return b.price - a.price;
            case 'name':
                return a.title.localeCompare(b.title);
            case 'newest':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    const formatRWF = (amount: number) => {
        return new Intl.NumberFormat('rw-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50/30 p-4 lg:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">Product Management</h1>
                <p className="text-gray-600">Manage your product catalog and inventory</p>
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                    <SearchFilter
                        filters={filters}
                        onFiltersChange={setFilters}
                    />
                    <ProductFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        formatRWF={formatRWF}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddForm(true)}
                    className="w-full lg:w-auto bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors font-medium"
                >
                    <Plus size={20} />
                    Add Product
                </motion.button>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <ProductGrid
                        products={sortedProducts}
                        onEdit={setEditingProduct}
                        onDelete={async (id) => {
                            try {
                                await mainAxios.delete(`/products/${id}`);
                                fetchProducts();
                            } catch (error) {
                                console.error('Error deleting product:', error);
                            }
                        }}
                        formatRWF={formatRWF}
                    />

                    <Pagination
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        totalItems={filteredProducts.length}
                    />
                </>
            )}

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
                        }}
                        formatRWF={formatRWF}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Search and Filter Component
const SearchFilter: React.FC<{
    filters: ProductFilters;
    onFiltersChange: (filters: ProductFilters) => void;
}> = ({ filters, onFiltersChange }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                />
            </div>

            <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
            </select>
        </div>
    );
};

// Advanced Filters Component
const ProductFilters: React.FC<{
    filters: ProductFilters;
    onFiltersChange: (filters: ProductFilters) => void;
    formatRWF: (amount: number) => string;
}> = ({ filters, onFiltersChange, formatRWF }) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 w-full sm:w-auto justify-center"
            >
                <Filter size={20} />
                Filters
            </motion.button>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50"
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range: {formatRWF(filters.minPrice)} - {formatRWF(filters.maxPrice)}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => onFiltersChange({ ...filters, minPrice: Number(e.target.value) })}
                                        className="flex-1 px-3 w-full py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary"
                                        placeholder="Min"
                                    />
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => onFiltersChange({ ...filters, maxPrice: Number(e.target.value) })}
                                        className="flex-1 px-3 w-full py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStock}
                                        onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.isNew}
                                        onChange={(e) => onFiltersChange({ ...filters, isNew: e.target.checked })}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">New Products</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.isFeatured}
                                        onChange={(e) => onFiltersChange({ ...filters, isFeatured: e.target.checked })}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Product Grid Component
const ProductGrid: React.FC<{
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    formatRWF: (amount: number) => string;
}> = ({ products, onEdit, onDelete, formatRWF }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    formatRWF={formatRWF}
                />
            ))}
        </div>
    );
};

// Product Card Component
const ProductCard: React.FC<{
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    formatRWF: (amount: number) => string;
}> = ({ product, onEdit, onDelete, formatRWF }) => {
    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
    const imageUrl = primaryImage?.url ? `${import.meta.env.VITE_API_BASE_URL}${primaryImage.url}` : '';
    console.log("product", primaryImage.url);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {product.is_new && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            New
                        </span>
                    )}
                    {product.is_featured && (
                        <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                        </span>
                    )}
                    {product.discount && product.discount > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                    <button
                        onClick={() => onEdit(product)}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 pr-2">{product.title}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0 hidden">
                        <Star size={14} className="text-yellow-400 fill-current " />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                            {formatRWF(product.price)}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatRWF(product.original_price)}
                            </span>
                        )}
                    </div>
                    <div className={`text-sm font-medium ${product.instock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.instock > 0 ? `${product.instock} in stock` : 'Out of stock'}
                    </div>
                </div>

                {product.category && (
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span className="bg-gray-100 px-2 py-1 rounded">{product.category.name}</span>
                        <span>{new Date(product.created_at).toLocaleDateString()}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Pagination Component
const Pagination: React.FC<{
    pagination: { skip: number; limit: number; total: number };
    onPaginationChange: (pagination: any) => void;
    totalItems: number;
}> = ({ pagination, onPaginationChange, totalItems }) => {
    const totalPages = Math.ceil(totalItems / pagination.limit);
    const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
                Showing {pagination.skip + 1}-{Math.min(pagination.skip + pagination.limit, totalItems)} of {totalItems}
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPaginationChange({
                        ...pagination,
                        skip: Math.max(0, pagination.skip - pagination.limit)
                    })}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => onPaginationChange({
                                ...pagination,
                                skip: (page - 1) * pagination.limit
                            })}
                            className={`w-10 h-10 rounded-lg border transition-colors ${currentPage === page
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPaginationChange({
                        ...pagination,
                        skip: pagination.skip + pagination.limit
                    })}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

// Multi-step Product Form
const ProductForm: React.FC<{
    product?: Product;
    onClose: () => void;
    onSave: () => void;
    formatRWF: (amount: number) => string;
}> = ({ product, onClose, onSave, formatRWF }) => {
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState<CategoryHierarchy>({
        mainCategories: [],
        subCategories: [],
        productCategories: []
    });
    const [selectedMain, setSelectedMain] = useState<number | null>(null);
    const [selectedSub, setSelectedSub] = useState<number | null>(null);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: product?.title || '',
        description: product?.description || '',
        price: product?.price || '',
        original_price: product?.original_price || '',
        discount: product?.discount || '',
        is_new: product?.is_new || false,
        is_featured: product?.is_featured || false,
        is_active: product?.is_active !== undefined ? product.is_active : true,
        instock: product?.instock || '',
        delivery_fee: product?.delivery_fee || '',
        brock: product?.brock || '',
        returnDay: product?.returnDay || '',
        warranty: product?.warranty || '',
        tutorial_video: product?.tutorial_video || '',
        category_id: product?.category_id || '',
        tags: product?.tags || [],
        features: product?.features || [],
        colors: product?.colors || [],
        images: [] as File[],
        existing_images: product?.images || []
    });

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);
                const main = await categoryApi.getMainCategories();
                const sub = await categoryApi.getSubCategories();
                const productCats = await categoryApi.getProductCategories();
                const hierarchy: CategoryHierarchy = {
                    mainCategories: main,
                    subCategories: sub,
                    productCategories: productCats
                };
                setCategories(hierarchy);

                if (product && product.category_id) {
                    const productCat = productCats.find((pc: any) => pc.id === product.category_id);
                    if (productCat) {
                        setSelectedSub(productCat.sub_category_id);
                        const subCat = sub.find((s: any) => s.id === productCat.sub_category_id);
                        if (subCat) {
                            setSelectedMain(subCat.main_category_id);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, [product]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const submitData = new FormData();

            // Add basic fields
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price.toString());
            submitData.append('instock', formData.instock.toString());
            submitData.append('category_id', formData.category_id.toString());
            submitData.append('is_new', formData.is_new.toString());
            submitData.append('is_featured', formData.is_featured.toString());
            submitData.append('is_active', formData.is_active.toString());

            // Add optional fields
            if (formData.original_price) submitData.append('original_price', formData.original_price.toString());
            if (formData.discount) submitData.append('discount', formData.discount.toString());
            if (formData.delivery_fee) submitData.append('delivery_fee', formData.delivery_fee);
            if (formData.brock) submitData.append('brock', formData.brock);
            if (formData.returnDay) submitData.append('returnDay', formData.returnDay);
            if (formData.warranty) submitData.append('warranty', formData.warranty);
            if (formData.tutorial_video) submitData.append('tutorial_video', formData.tutorial_video);

            // Add JSON fields
            if (formData.tags.length > 0) submitData.append('tags', JSON.stringify(formData.tags));
            if (formData.features.length > 0) submitData.append('features', JSON.stringify(formData.features));
            if (formData.colors.length > 0) submitData.append('colors', JSON.stringify(formData.colors));

            // Add images
            formData.images.forEach((image) => {
                submitData.append('images', image);
            });

            // For updates, specify to keep existing images
            if (product) {
                submitData.append('keep_existing_images', 'true');
            }

            if (product) {
                await mainAxios.put(`/products/${product.id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await mainAxios.post('/products', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            onSave();
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Basic Info', icon: Package },
        { number: 2, title: 'Media & Tags', icon: Tag },
        { number: 3, title: 'Colors', icon: Palette },
        { number: 4, title: 'Images', icon: ImageIcon }
    ];

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-gray-600 mt-1">Complete all steps to {product ? 'edit' : 'add'} a product</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center space-x-4 lg:space-x-8 overflow-x-auto">
                        {steps.map((stepItem, index) => {
                            const Icon = stepItem.icon;
                            const isCompleted = stepItem.number < step;
                            const isCurrent = stepItem.number === step;

                            return (
                                <div key={stepItem.number} className="flex items-center flex-shrink-0">
                                    <div className="flex items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted
                                                ? 'bg-primary border-primary text-white'
                                                : isCurrent
                                                    ? 'border-primary text-primary bg-primary/10'
                                                    : 'border-gray-300 text-gray-400'
                                                }`}
                                        >
                                            {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                                        </div>
                                        <span
                                            className={`ml-2 font-medium text-sm ${isCurrent || isCompleted ? 'text-primary' : 'text-gray-400'
                                                }`}
                                        >
                                            {stepItem.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`w-6 h-0.5 mx-3 ${stepItem.number < step ? 'bg-primary' : 'bg-gray-300'
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {step === 1 && (
                            <BasicInfoStep
                                formData={formData}
                                onChange={setFormData}
                                categories={categories}
                                selectedMain={selectedMain}
                                selectedSub={selectedSub}
                                onMainChange={setSelectedMain}
                                onSubChange={setSelectedSub}
                                categoriesLoading={categoriesLoading}
                                loading={loading}
                                formatRWF={formatRWF}
                            />
                        )}
                        {step === 2 && (
                            <MediaAndTagsStep
                                formData={formData}
                                onChange={setFormData}
                                loading={loading}
                            />
                        )}
                        {step === 3 && (
                            <ColorsStep
                                formData={formData}
                                onChange={setFormData}
                                loading={loading}
                            />
                        )}
                        {step === 4 && (
                            <ImagesStep
                                formData={formData}
                                onChange={setFormData}
                                product={product}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-white">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || (!product && formData.images.length === 0)}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        {product ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        {product ? 'Update Product' : 'Create Product'}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Step 1: Basic Information
const BasicInfoStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    categories: CategoryHierarchy;
    selectedMain: number | null;
    selectedSub: number | null;
    onMainChange: (id: number | null) => void;
    onSubChange: (id: number | null) => void;
    categoriesLoading: boolean;
    loading: boolean;
    formatRWF: (amount: number) => string;
}> = ({ formData, onChange, categories, selectedMain, selectedSub, onMainChange, onSubChange, categoriesLoading, loading, formatRWF }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        onChange({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const deliveryOptions = [
        "City Center → Free",
        "In Kigali → 2,000 RWF",
        "Out of Kigali → 5,000 RWF",
        "Outside Rwanda → Negotiable"
    ];

    const warrantyOptions = [
        ...Array.from({ length: 10 }, (_, i) => `${i + 1} Month`),
        ...Array.from({ length: 5 }, (_, i) => `${i + 1} Year`)
    ];

    const returnOptions = [
        "Not Applied",
        ...Array.from({ length: 7 }, (_, i) => `${i + 1} ${i === 0 ? "day" : "days"}`),
        ...Array.from({ length: 4 }, (_, i) => `${i + 1} ${i === 0 ? "week" : "weeks"}`),
        ...Array.from({ length: 6 }, (_, i) => `${i + 1} Month`)
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Category Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Category</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Main Category</label>
                                <select
                                    value={selectedMain || ''}
                                    onChange={(e) => onMainChange(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    disabled={categoriesLoading || loading}
                                >
                                    <option value="">Select Main Category</option>
                                    {categories.mainCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                                <select
                                    value={selectedSub || ''}
                                    onChange={(e) => onSubChange(e.target.value ? parseInt(e.target.value) : null)}
                                    disabled={!selectedMain || categoriesLoading || loading}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                >
                                    <option value="">Select Sub Category</option>
                                    {categories.subCategories
                                        .filter(sub => sub.main_category_id === selectedMain)
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Category *</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    disabled={!selectedSub || categoriesLoading || loading}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    required
                                >
                                    <option value="">Select Product Category</option>
                                    {categories.productCategories
                                        .filter(pc => pc.sub_category_id === selectedSub)
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                                disabled={loading}
                                placeholder="Enter product name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={8}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                                disabled={loading}
                                placeholder="Enter product description"
                            />
                        </div>
                        {/* Status Flags */}
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900">Status</h3>
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_new"
                                        checked={formData.is_new}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        disabled={loading}
                                    />
                                    <span className="ml-3 text-sm text-gray-700">Mark as New Product</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        disabled={loading}
                                    />
                                    <span className="ml-3 text-sm text-gray-700">Mark as Featured Product</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        disabled={loading}
                                    />
                                    <span className="ml-3 text-sm text-gray-700">Product is Active</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Pricing & Stock</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (RWF) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="100"
                                    min="0"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                    disabled={loading}
                                    placeholder="Enter price"
                                />
                                {formData.price && (
                                    <p className="text-sm text-primary font-medium mt-2">{formatRWF(Number(formData.price))}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (RWF)</label>
                                <input
                                    type="number"
                                    name="original_price"
                                    value={formData.original_price}
                                    onChange={handleChange}
                                    step="100"
                                    min="0"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={loading}
                                    placeholder="Enter original price"
                                />
                                {formData.original_price && (
                                    <p className="text-sm text-gray-600 mt-2">{formatRWF(Number(formData.original_price))}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">In Stock *</label>
                                <input
                                    type="number"
                                    name="instock"
                                    value={formData.instock}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                    disabled={loading}
                                    placeholder="Enter stock quantity"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={loading}
                                    placeholder="Enter discount percentage"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee</label>
                                <select
                                    name="delivery_fee"
                                    value={formData.delivery_fee}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    disabled={loading}
                                >
                                    <option value="">Select Delivery Option</option>
                                    {deliveryOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
                                <select
                                    name="warranty"
                                    value={formData.warranty}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    disabled={loading}
                                >
                                    <option value="">Select Warranty</option>
                                    <option value="no warranty">No Warranty</option>
                                    {warrantyOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy</label>
                                <select
                                    name="returnDay"
                                    value={formData.returnDay}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    disabled={loading}
                                >
                                    <option value="">Select Return Policy</option>
                                    {returnOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brock</label>
                                <input
                                    type="text"
                                    name="brock"
                                    value={formData.brock}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={loading}
                                    placeholder="Additional information"
                                />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

// Step 2: Media & Additional Information
const MediaAndTagsStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    loading: boolean;
}> = ({ formData, onChange, loading }) => {
    const [currentTag, setCurrentTag] = useState('');
    const [currentFeature, setCurrentFeature] = useState('');

    const handleAddTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            onChange({
                ...formData,
                tags: [...formData.tags, currentTag.trim()]
            });
            setCurrentTag('');
        }
    };

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        } else if (e.key === ',' || e.key === ';') {
            e.preventDefault();
            const tags = currentTag.split(/[,;]/).map(tag => tag.trim()).filter(tag => tag);
            if (tags.length > 0) {
                onChange({
                    ...formData,
                    tags: [...formData.tags, ...tags]
                });
                setCurrentTag('');
            }
        }
    };

    const handleRemoveTag = (index: number) => {
        onChange({
            ...formData,
            tags: formData.tags.filter((_: any, i: number) => i !== index)
        });
    };

    const handleAddFeature = () => {
        if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
            onChange({
                ...formData,
                features: [...formData.features, currentFeature.trim()]
            });
            setCurrentFeature('');
        }
    };

    const handleFeatureInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddFeature();
        } else if (e.key === ',' || e.key === ';') {
            e.preventDefault();
            const features = currentFeature.split(/[,;]/).map(feature => feature.trim()).filter(feature => feature);
            if (features.length > 0) {
                onChange({
                    ...formData,
                    features: [...formData.features, ...features]
                });
                setCurrentFeature('');
            }
        }
    };

    const handleRemoveFeature = (index: number) => {
        onChange({
            ...formData,
            features: formData.features.filter((_: any, i: number) => i !== index)
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Left Column - Tags */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Tags</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyDown={handleTagInput}
                                    placeholder="Add tags (comma separated or press Enter)"
                                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors font-medium"
                                    disabled={loading || !currentTag.trim()}
                                >
                                    Add
                                </button>
                            </div>

                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag: string, index: number) => (
                                        <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(index)}
                                                className="text-primary hover:text-primary/70 transition-colors"
                                                disabled={loading}
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tutorial Video */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tutorial Video</h3>
                        <div className="space-y-3">
                            <input
                                type="url"
                                name="tutorial_video"
                                value={formData.tutorial_video}
                                onChange={(e) => onChange({ ...formData, tutorial_video: e.target.value })}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="https://example.com/video.mp4"
                                disabled={loading}
                            />
                            <p className="text-sm text-gray-500">Add a link to a product tutorial or demonstration video</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Features */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Features</h3>
                        <div className="space-y-4 ">
                            <div className="flex gap-3">
                                <textarea
                                    value={currentFeature}
                                    onChange={(e) => setCurrentFeature(e.target.value)}
                                    onKeyDown={handleFeatureInput}
                                    placeholder="Add features (comma separated or press Enter)"
                                    className="flex-1 px-3 py-3 hidden border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={loading}
                                    rows={3}
                                />
                                <EnhancedTextEditor
                                    value={formData.features.join('\n')}
                                    onChange={(value) => onChange({ ...formData, features: value.split('\n').filter((f: string) => f.trim()) })}
                                    placeholder="Enter product features, specifications, and benefits..."
                                    loading={loading}
                                    label="Product features"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="px-6 py-3 hidden bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors font-medium"
                                    disabled={loading || !currentFeature.trim()}
                                >
                                    Add
                                </button>
                            </div>

                            {formData.features.length > 0 && (
                                <div className="space-y-2">
                                    {formData.features.map((feature: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                        >
                                            <span className="text-green-800 font-medium">{feature}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(index)}
                                                className="text-green-600 hover:text-green-800 transition-colors p-1"
                                                disabled={loading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty States */}
            {formData.tags.length === 0 && formData.features.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                    <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Add Tags & Features</h3>
                    <p className="text-gray-500">Enhance your product with relevant tags and key features</p>
                </div>
            )}
        </div>
    );
};

// Step 3: Colors & Variations
const ColorsStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    loading: boolean;
}> = ({ formData, onChange, loading }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Color Variations</h3>
                <p className="text-gray-600 mb-6">Add color options and their stock quantities for your product</p>
            </div>

            <ColorPicker
                colors={formData.colors}
                onColorsChange={(colors) => onChange({ ...formData, colors })}
                loading={loading}
            />
        </div>
    );
};

// Step 4: Product Images
const ImagesStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    product?: Product;
    loading: boolean;
}> = ({ formData, onChange, product, loading }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Product Images</h3>
                <p className="text-gray-600">Upload high-quality images of your product. The first image will be set as primary.</p>
            </div>

            <ImageManager
                images={formData.images}
                existingImages={formData.existing_images}
                onImagesChange={(images) => onChange({ ...formData, images })}
                loading={loading}
            />

            {!product && formData.images.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-yellow-800 text-sm">
                            <strong>Note:</strong> At least one product image is required to create a new product.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;