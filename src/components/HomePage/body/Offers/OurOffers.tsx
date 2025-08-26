import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../../../../types/Product/ProductType';
import { productsData } from '../../../../constants/ProductsData/ProductData';
import { useNavigation } from '../../../../hooks/product/useNavigation';


// Skeleton Loader Component
const SkeletonLoader: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-100 rounded-2xl overflow-hidden"
        >
            <div className="animate-pulse">
                <div className="bg-gray-300 h-48 w-full"></div>
                <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded-2xl"></div>
                </div>
            </div>
        </motion.div>
    );
};

// Offer Card Component
interface OfferCardProps {
    product: Product;
    index: number;
    onProductClick: (productId: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ product, index, onProductClick }) => {
    const primaryImage = product.images.find(img => img.isprimary)?.image || product.images[0]?.image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 group cursor-pointer"
            onClick={() => onProductClick(product.id)}
        >
            <div className="relative overflow-hidden">
                <img
                    src={primaryImage}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                    </div>
                )}
                {product.isNew && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        NEW
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                            Rwf {product.price}
                        </span>
                        {product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center text-yellow-400">
                        <span className="text-sm text-gray-600 ml-1">
                            {product.rating} ({product.reviewsCount})
                        </span>
                    </div>
                </div>

                <button className="w-full bg-primary hover:bg-blue-700 text-white font-semibold rounded-2xl px-6 py-3 transition-colors duration-300">
                    Shop Now
                </button>
            </div>
        </motion.div>
    );
};

// Main Offers Component
const Offers: React.FC = () => {
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>(productsData.slice(0, 4));
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(3);
    const { navigateToProduct } = useNavigation();

    const loadMoreProducts = async () => {
        if (currentIndex >= productsData.length) return;

        setIsLoading(true);

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const nextProducts = productsData.slice(currentIndex, currentIndex + 3);
        setDisplayedProducts(prev => [...prev, ...nextProducts]);
        setCurrentIndex(prev => prev + 4);
        setIsLoading(false);
    };

    const handleProductClick = (productId: string) => {
        navigateToProduct(productId);
    };

    const hasMoreProducts = currentIndex < productsData.length;

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Special Offers
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Grab them before they're gone! Limited time deals on your favorite products.
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {displayedProducts.map((product, index) => (
                        <OfferCard
                            key={product.id}
                            product={product}
                            index={index}
                            onProductClick={handleProductClick}
                        />
                    ))}

                    {/* Skeleton Loaders */}
                    <AnimatePresence>
                        {isLoading && (
                            <>
                                <SkeletonLoader />
                                <SkeletonLoader />
                                <SkeletonLoader />
                                <SkeletonLoader />
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Load More Button */}
                {(hasMoreProducts || isLoading) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <button
                            onClick={loadMoreProducts}
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/80 disabled:bg-primary/20 text-white font-semibold rounded-2xl px-8 py-3 transition-colors duration-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Loading...' : 'Load More Offers'}
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Offers;