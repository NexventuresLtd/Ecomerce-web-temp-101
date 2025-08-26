import React from 'react';
import { motion, } from 'framer-motion';
import { Calendar, Star, Package, VerifiedIcon } from 'lucide-react';
import type { Product, Owner } from '../../types/Product/ProductType';
import { useNavigation } from '../../hooks/product/useNavigation';
import { useProduct } from '../../hooks/product/useProduct';

interface OwnerProfileProps {
    owner: Owner;
    products: Product[];
}

const OwnerProfile: React.FC<OwnerProfileProps> = ({ owner, products }) => {
    const { navigateToProduct } = useNavigation();
      const { product } = useProduct();
    const relatedProducts = products.filter(p => p.id !== product?.id).slice(0, 4);
    const joinDate = new Date(owner.JoinedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    return (
        <motion.div
            className="bg-white border border-gray-100 rounded-2xl p-8 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            {/* Header */}
            <div className="border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-bold text-gray-900">Other Product From This Account</h3>
                <p className="text-gray-600 mt-1">Verified seller information and product catalog</p>
            </div>

            {/* Seller Profile */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6">
                <div className="flex items-start space-x-5">
                    <div className="relative">
                        <img
                            src={owner.image}
                            alt={`${owner.name}'s profile`}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-white"
                        />
                        {owner.isverified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                <VerifiedIcon className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-xl font-bold text-gray-900 truncate">{owner.name}</h4>
                            {owner.isverified && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                    Verified Seller
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-3 truncate">{owner.email}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2 text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Member since {joinDate}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500">
                                <Package className="w-4 h-4" />
                                <span>{products.length} Products Listed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seller Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                        {products.length}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Total Products</div>
                </div>
                <div className="text-center p-4 bg-green-50/50 border border-green-100 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                        {Math.round(products.reduce((acc, p) => acc + p.rating, 0) / products.length * 10) / 10 || 0}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Avg Rating</div>
                </div>
                <div className="text-center p-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                        {products.filter(p => p.isFeatured).length}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Featured Items</div>
                </div>
            </div>

            {/* Other Products */}
            {relatedProducts.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-gray-900">More from this seller</h4>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                            View All ({products.length})
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedProducts.map((product) => (
                            <motion.div
                                onClick={() => navigateToProduct(product.id)}
                                key={product.id}
                                className="group bg-gray-50/50 cursor-pointer border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-all duration-200"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex space-x-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.images[0]?.image}
                                            alt={product.title}
                                            className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-semibold text-sm text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                                            {product.title}
                                        </h5>

                                        <div className="flex items-center space-x-1 mb-2">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            <span className="text-xs text-gray-600">{product.rating}</span>
                                            <span className="text-xs text-gray-400">({product.reviewsCount})</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-gray-900">Rwf {product.price}</span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-gray-500 line-through">
                                                        Rwf {product.originalPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {product.isNew && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default OwnerProfile;