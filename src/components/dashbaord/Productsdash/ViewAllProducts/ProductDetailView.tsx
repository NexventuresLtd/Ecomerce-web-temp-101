import React from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Calendar,
} from 'lucide-react';
import type { Product } from '../../../../types/Product/NewProductDataDash';




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
                                            <label className="font-medium text-gray-700">Brock</label>
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
export default ProductDetailView;