import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon } from 'lucide-react';
import { useNavigation } from '../../../../hooks/product/useNavigation';
import SkeletonLoader from '../../../Skeltons/Product';
import { handleClickWhatsapp } from '../../../../app/ProductWhasapp';
import { RWF } from '../../../../app/priceConver';
import type { Product } from '../../../../types/Product/producttypeAdmin';

// Props interface
interface OffersProps {
    title?: string;
    subtitle?: string;
    showLoadMore?: boolean;
    products?: Product[];
    initialDisplayCount?: number;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;
}

// Offer Card Component
interface OfferCardProps {
    product: Product;
    index: number;
    onProductClick: (productId: number) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ product, index, onProductClick }) => {
    const primaryImage = product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url || '';
    const [showDescription, setShowDescription] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 group cursor-pointer"
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
        >
            <div className="relative overflow-hidden"
                onClick={() => onProductClick(product.id)}
            >
                
                <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${primaryImage}`}
                    alt={product.title}
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount !=0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                    </div>
                )}
                {product.is_new && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        NEW
                    </div>
                )}

                {/* Description overlay on hover */}
                <AnimatePresence>
                    {showDescription && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 bg-opacity-70 flex flex-col items-center justify-center gap-3 p-4"
                        >
                            <p className="text-white text-lg text-center font-medium">
                                {product.title}
                            </p>
                            <p className="text-white text-sm text-center text-wrap line-clamp-2">
                                {product.description}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.title}
                </h3>

                <div className="flex items-center justify-between mb-4 w-full">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                            {product.price ? RWF.format(product.price) : 'Price not available'}
                        </span>
                        {product.original_price && (
                            <span className="text-sm text-gray-500 line-through">
                                {RWF.format(product.original_price)}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`${(product.instock || 0) < 1 ? 'bg-red-500' : 'bg-primary'} text-white px-3 py-1 rounded-full text-sm w-fit ml-auto mb-2 font-semibold`}>
                    {(product.instock || 0) < 1 ? 'Out of Stock' : `${product.instock} in Stock`}
                </div>

                <div className="flex gap-2">
                    <button
                        disabled={(product.instock || 0) < 1}
                        onClick={() => onProductClick(product.id)}
                        className={`${(product.instock || 0) < 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} w-full bg-yellow-500 text-xs text-white font-semibold rounded-lg px-3 py-3 transition-colors duration-300 flex items-center justify-center gap-2`}>
                        <ShoppingCartIcon size={18} />
                        Shop Now
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 px-3 rounded-lg text-xs font-semibold bg-teal-600 transition-colors flex items-center justify-center gap-2 text-green-100 hover:bg-primary/90 cursor-pointer
      `}
                        onClick={() => handleClickWhatsapp(product.title)}
                    >
                        <>
                            <ShoppingCartIcon size={18} />
                            Ask on Whatsapp
                        </>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Main Offers Component
const Offers: React.FC<OffersProps> = ({
    title = "Suggestions For You",
    subtitle = "Grab them before they're gone! Limited time deals on your favorite products.",
    showLoadMore = true,
    products = [],
    initialDisplayCount = 6,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false
}) => {
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>(
        products.slice(0, initialDisplayCount)
    );
    const [currentIndex, setCurrentIndex] = useState(initialDisplayCount);
    const { navigateToProduct, navigateToProducts } = useNavigation();

    // Update displayed products when products prop changes
    React.useEffect(() => {
        setDisplayedProducts(products.slice(0, initialDisplayCount));
        setCurrentIndex(initialDisplayCount);
    }, [products, initialDisplayCount]);

    const loadMoreProducts = async () => {
        if (currentIndex >= products.length || !onLoadMore) return;

        // If we have more products in the current list, show them
        if (currentIndex < products.length) {
            const nextProducts = products.slice(currentIndex, currentIndex + 6);
            setDisplayedProducts(prev => [...prev, ...nextProducts]);
            setCurrentIndex(prev => prev + 6);
        } 
        // If we need to fetch more products from the server
        else if (hasMore && onLoadMore) {
            onLoadMore();
        }
    };

    const handleProductClick = (productId: number) => {
        navigateToProduct(productId.toString());
    };

    const hasMoreProducts = currentIndex < products.length || hasMore;

    return (
        <section className="py-6 bg-gray-50">
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl uppercase font-bold text-gray-900 mb-4">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </motion.div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products available</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mb-12">
                            {displayedProducts.map((product, index) => (
                                <OfferCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    onProductClick={handleProductClick}
                                />
                            ))}

                            {/* Skeleton Loaders for initial loading */}
                            {isLoadingMore && displayedProducts.length === 0 && (
                                <>
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                    <SkeletonLoader />
                                </>
                            )}
                        </div>

                        {/* Load More Button */}
                        {showLoadMore && hasMoreProducts && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                <button
                                    onClick={loadMoreProducts}
                                    disabled={isLoadingMore}
                                    className="bg-primary hover:bg-primary/80 disabled:bg-primary/20 text-white font-semibold rounded-2xl px-8 py-3 transition-colors duration-300 disabled:cursor-not-allowed"
                                >
                                    {isLoadingMore ? 'Loading...' : 'Load More Offers'}
                                </button>
                            </motion.div>
                        )}

                        {/* View All Products Button */}
                        {!showLoadMore && (
                            <motion.div
                                onClick={() => navigateToProducts()}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                <button className="bg-primary cursor-pointer hover:bg-primary/80 text-white font-semibold rounded-2xl px-8 py-3 transition-colors duration-300">
                                    View All Products
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Offers;