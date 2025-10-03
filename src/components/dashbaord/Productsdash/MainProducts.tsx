import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Edit,
    Trash2,
    Plus,
    X,
    Check,
    Upload,
    Star,
    ChevronLeft,
    ChevronRight,
    Loader,
    Palette,
    Package,
    Tag,
    Calendar,
    ImageIcon,
    Eye,
    ChevronUp,
    ChevronDown,
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
    is_new: string;
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
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className={`p-2 rounded-lg border-2 transition-all ${currentColor.hex === color.hex ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300'}`}
                                    >
                                        <div className="w-8 h-8 rounded-md" style={{ backgroundColor: color.hex }} />
                                        <div className="text-xs mt-1 text-gray-600 truncate">{color.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex items-center gap-2 flex-1">
                                <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentColor.hex }} />
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
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
                            <div className="w-10 h-10 rounded-lg border border-gray-300" style={{ backgroundColor: color.hex }} />
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
        if (index === 0) return;
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

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors hover:border-blue-400">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="product-images"
                    disabled={loading}
                />
                <label htmlFor="product-images" className="cursor-pointer block">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <div className="text-gray-600">
                        <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-sm text-gray-500 mt-2">PNG, JPG, WEBP up to 10MB each</div>
                </label>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((file, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                    Primary
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setPrimaryImage(index)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                                        title="Set as primary"
                                    >
                                        <Star size={16} className="text-yellow-600" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                    title="Remove image"
                                >
                                    <X size={16} className="text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {existingImages.length > 0 && (
                <div className="border-t pt-6 mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">Existing Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {existingImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}${image.url}`}
                                    alt={image.alt_text || `Product image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                />
                                {image.is_primary && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
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

// Product Detail View Component
const ProductDetailView: React.FC<{
    product: Product;
    onClose: () => void;
    formatRWF: (amount: number) => string;
}> = ({ product, onClose, formatRWF }) => {
    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
    const imageUrl = primaryImage?.url ? `${import.meta.env.VITE_API_BASE_URL}${primaryImage.url}` : '';

    return (
        <div className="fixed inset-0 bg-black/40  flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">{product.title}</h2>
                        <p className="text-gray-600 mt-1">Product Details</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                                {imageUrl && (
                                    <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                )}
                            </div>
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                    {product.images.slice(0, 4).map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${import.meta.env.VITE_API_BASE_URL}${image.url}`}
                                            alt={`${product.title} ${index + 1}`}
                                            className="w-full h-20 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <p className="text-gray-600 mt-1">{product.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Category</label>
                                            <p className="text-gray-600 mt-1">{product.category?.name || 'No category'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Status</label>
                                            <p className="text-gray-600 mt-1 capitalize">{product.is_new}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Stock</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Price</label>
                                        <p className="text-xl font-semibold text-gray-900 mt-1">{formatRWF(product.price)}</p>
                                        {product.original_price && product.original_price > product.price && (
                                            <p className="text-sm text-gray-500 line-through">{formatRWF(product.original_price)}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Stock</label>
                                        <p className={`text-lg font-semibold mt-1 ${product.instock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.instock} units
                                        </p>
                                    </div>
                                </div>
                                {product.discount && product.discount > 0 && (
                                    <div className="mt-2">
                                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                                            {product.discount}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {product.delivery_fee && (
                                        <div>
                                            <label className="font-medium text-gray-700">Delivery</label>
                                            <p className="text-gray-600 mt-1">{product.delivery_fee}</p>
                                        </div>
                                    )}
                                    {product.warranty && (
                                        <div>
                                            <label className="font-medium text-gray-700">Warranty</label>
                                            <p className="text-gray-600 mt-1">{product.warranty}</p>
                                        </div>
                                    )}
                                    {product.returnDay && (
                                        <div>
                                            <label className="font-medium text-gray-700">Return Policy</label>
                                            <p className="text-gray-600 mt-1">{product.returnDay}</p>
                                        </div>
                                    )}
                                    {product.brock && (
                                        <div>
                                            <label className="font-medium text-gray-700">Additional Info</label>
                                            <p className="text-gray-600 mt-1">{product.brock}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="font-medium text-gray-700">Created</label>
                                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="font-medium text-gray-700">Last Updated</label>
                                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(product.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {product.tags.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Tags</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {product.tags.map((tag, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.features.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Features</label>
                                        <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
                                            {product.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
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

            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price.toString());
            submitData.append('instock', formData.instock.toString());
            submitData.append('category_id', formData.category_id.toString());
            submitData.append('is_new', formData.is_new.toString());
            submitData.append('is_featured', formData.is_featured.toString());
            submitData.append('is_active', formData.is_active.toString());

            if (formData.original_price) submitData.append('original_price', formData.original_price.toString());
            if (formData.discount) submitData.append('discount', formData.discount.toString());
            if (formData.delivery_fee) submitData.append('delivery_fee', formData.delivery_fee);
            if (formData.brock) submitData.append('brock', formData.brock);
            if (formData.returnDay) submitData.append('returnDay', formData.returnDay);
            if (formData.warranty) submitData.append('warranty', formData.warranty);
            if (formData.tutorial_video) submitData.append('tutorial_video', formData.tutorial_video);

            if (formData.tags.length > 0) submitData.append('tags', JSON.stringify(formData.tags));
            if (formData.features.length > 0) submitData.append('features', JSON.stringify(formData.features));
            if (formData.colors.length > 0) submitData.append('colors', JSON.stringify(formData.colors));

            formData.images.forEach((image) => {
                submitData.append('images', image);
            });

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-gray-600 mt-1">Complete all steps to {product ? 'edit' : 'add'} a product</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex justify-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-4 lg:space-x-8 overflow-x-auto">
                        {steps.map((stepItem, index) => {
                            const Icon = stepItem.icon;
                            const isCompleted = stepItem.number < step;
                            const isCurrent = stepItem.number === step;

                            return (
                                <div key={stepItem.number} className="flex items-center flex-shrink-0">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                                            isCurrent ? 'border-blue-600 text-blue-600 bg-blue-50' :
                                                'border-gray-300 text-gray-400'
                                            }`}>
                                            {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                                        </div>
                                        <span className={`ml-2 font-medium text-sm ${isCurrent || isCompleted ? 'text-blue-600' : 'text-gray-400'
                                            }`}>
                                            {stepItem.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-6 h-0.5 mx-3 ${stepItem.number < step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

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
                            <MediaAndTagsStep formData={formData} onChange={setFormData} loading={loading} />
                        )}
                        {step === 3 && (
                            <ColorsStep formData={formData} onChange={setFormData} loading={loading} />
                        )}
                        {step === 4 && (
                            <ImagesStep formData={formData} onChange={setFormData} product={product} loading={loading} />
                        )}
                    </div>
                </div>

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
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

// Form Steps (BasicInfoStep, MediaAndTagsStep, ColorsStep, ImagesStep remain the same as in original code)
// I'll include them for completeness:

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
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Category</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Main Category</label>
                                <select
                                    value={selectedMain || ''}
                                    onChange={(e) => onMainChange(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product title"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product description"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (RWF) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter current price"
                                    required
                                    disabled={loading}
                                />
                                {formData.price && (
                                    <p className="text-sm text-green-600 mt-1">
                                        {formatRWF(Number(formData.price))}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (RWF)</label>
                                <input
                                    type="number"
                                    name="original_price"
                                    value={formData.original_price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter original price"
                                    disabled={loading}
                                />
                                {formData.original_price && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {formatRWF(Number(formData.original_price))}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter discount percentage"
                                    min="0"
                                    max="100"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Stock & Status</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                                <input
                                    type="number"
                                    name="instock"
                                    value={formData.instock}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter stock quantity"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={loading}
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Active</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Status</label>
                                <select
                                    name="is_new"
                                    value={formData.is_new}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    disabled={loading}
                                >
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                    <option value="refurbished">Refurbished</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee</label>
                    <select
                        name="delivery_fee"
                        value={formData.delivery_fee}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        disabled={loading}
                    >
                        <option value="">Select delivery option</option>
                        {deliveryOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
                    <select
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        disabled={loading}
                    >
                        <option value="">Select warranty</option>
                        {warrantyOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy</label>
                    <select
                        name="returnDay"
                        value={formData.returnDay}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        disabled={loading}
                    >
                        <option value="">Select return policy</option>
                        {returnOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                <textarea
                    name="brock"
                    value={formData.brock}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter any additional product information"
                    disabled={loading}
                />
            </div>
        </div>
    );
};

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

    const handleRemoveTag = (index: number) => {
        onChange({
            ...formData,
            tags: formData.tags.filter((_: string, i: number) => i !== index)
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

    const handleRemoveFeature = (index: number) => {
        onChange({
            ...formData,
            features: formData.features.filter((_: string, i: number) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Product Tags</h3>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                placeholder="Enter a tag"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={loading}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                disabled={loading || !currentTag.trim()}
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(index)}
                                        className="text-blue-600 hover:text-blue-800"
                                        disabled={loading}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Tutorial Video</h3>
                    <input
                        type="url"
                        name="tutorial_video"
                        value={formData.tutorial_video}
                        onChange={(e) => onChange({ ...formData, tutorial_video: e.target.value })}
                        placeholder="Enter YouTube or video URL"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <p className="text-sm text-gray-500">Enter a URL for product tutorial or demonstration video</p>
                </div>
            </div>
            <EnhancedTextEditor
                value={formData.features.join('\n')}
                onChange={(value) => onChange({ ...formData, features: value.split('\n').filter((f: string) => f.trim()) })}
                placeholder="Enter product features, specifications, and benefits..."
                loading={loading}
                label="Product features"
                required
            />

        </div>
    );
};

const ColorsStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    loading: boolean;
}> = ({ formData, onChange, loading }) => {
    const handleColorsChange = (colors: Array<{ name: string; hex: string; stock: number }>) => {
        onChange({ ...formData, colors });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Palette className="text-blue-600 mt-0.5" size={20} />
                    <div>
                        <h3 className="text-blue-800 font-medium">Color Variations</h3>
                        <p className="text-blue-600 text-sm mt-1">
                            Add color variations for your product. Each color can have its own stock quantity.
                        </p>
                    </div>
                </div>
            </div>

            <ColorPicker
                colors={formData.colors}
                onColorsChange={handleColorsChange}
                loading={loading}
            />
        </div>
    );
};

const ImagesStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    product?: Product;
    loading: boolean;
}> = ({ formData, onChange, product, loading }) => {
    const handleImagesChange = (images: File[]) => {
        onChange({ ...formData, images });
    };

    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <ImageIcon className="text-yellow-600 mt-0.5" size={20} />
                    <div>
                        <h3 className="text-yellow-800 font-medium">Product Images</h3>
                        <p className="text-yellow-600 text-sm mt-1">
                            The first image will be set as primary. You can reorder by setting another image as primary.
                            {!product && " At least one image is required to create a product."}
                        </p>
                    </div>
                </div>
            </div>

            <ImageManager
                images={formData.images}
                existingImages={formData.existing_images}
                onImagesChange={handleImagesChange}
                loading={loading}
            />
        </div>
    );
};

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

    // Fetch products only once on component mount
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await mainAxios.get(`/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            <button onClick={() => handleSort('price')} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                                                <span>Price</span>
                                                <SortIcon columnKey="price" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            <button onClick={() => handleSort('instock')} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                                                <span>Stock</span>
                                                <SortIcon columnKey="instock" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
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
                                            <td colSpan={7} className="px-6 py-16 text-center">
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
                                            const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                                            const imageUrl = primaryImage?.url ? `${import.meta.env.VITE_API_BASE_URL}${primaryImage.url}` : '';

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className="hover:bg-gray-50 transition-colors duration-150 group"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                                                            #{product.id}
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
                                                                : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {product.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                                {product.is_new}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 max-w-xs">
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
                                        Showing <span className="font-semibold">
                                            {Math.min((currentPage - 1) * entriesPerPage + 1, filteredProducts.length)}
                                        </span> to{' '}
                                        <span className="font-semibold">
                                            {Math.min(currentPage * entriesPerPage, filteredProducts.length)}
                                        </span> of{' '}
                                        <span className="font-semibold">{filteredProducts.length}</span> products
                                        {searchTerm && (
                                            <span className="text-gray-400">
                                                {' '}(filtered from <span className="font-semibold">{products.length}</span> total)
                                            </span>
                                        )}
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