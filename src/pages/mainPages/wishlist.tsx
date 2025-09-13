import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import Footer from '../../components/SharedComp/footer';

import { productsData } from '../../constants/ProductsData/ProductData';
import { useNavigation } from '../../hooks/product/useNavigation';
import { RWF } from '../../app/priceConver';
import type { Product } from '../../types/Product/producttypeAdmin';

// Mock Data
const wishlistData: Product[] = productsData.filter(product => product.is_featured).slice(0, 4);

// WishlistItem Component
interface WishlistItemProps {
    product: Product;
    onRemove: (id: number) => void;
    onMoveToCart: (id: number) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ product, onRemove, onMoveToCart }) => {
    const [currentImage, setCurrentImage] = useState(product.images?.[0]?.url || '');
    const { navigateToProduct } = useNavigation();

    const discountedPrice = product.original_price 
        ? product.original_price - (product.original_price * (product.discount || 0) / 100) 
        : product.price || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-300"
        >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <motion.img
                    src={currentImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => product.hover_image && setCurrentImage(product.hover_image)}
                    onMouseLeave={() => setCurrentImage(product.images?.[0]?.url || '')}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_new && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                            New
                        </span>
                    )}
                    {product.is_featured && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                            Featured
                        </span>
                    )}
                    {product.discount && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-3 right-3 bg-white rounded p-2 hover:bg-red-50 transition-colors group"
                >
                    <X className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                </button>

                {/* Stock Status */}
                <div className="absolute bottom-3 left-3">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${(product.instock || 0) > 10
                        ? 'bg-green-100 text-green-800'
                        : (product.instock || 0) > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {(product.instock || 0) > 0 ? `${product.instock} in stock` : 'Out of stock'}
                    </span>
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4 space-y-3">
                {/* Product Title & Description */}
                <div>
                    <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                        {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                    </p>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{product.rating || 0}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews_count || 0} reviews)</span>
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Colors:</span>
                        <div className="flex gap-1">
                            {product.colors.slice(0, 4).map((color, index) => (
                                <div
                                    key={index}
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                            {product.colors.length > 4 && (
                                <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                                    <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        {RWF.format(discountedPrice)}
                    </span>
                    {product.original_price && (
                        <span className="text-sm text-gray-500 line-through">
                            {RWF.format(product.original_price)}
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onMoveToCart(product.id)}
                        disabled={(product.instock || 0) === 0}
                        className="flex-1 bg-gray-900 text-white py-2 px-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-3 h-3" />
                        <span className="text-sm">Move to Cart</span>
                    </motion.button>
                    <motion.button
                        onClick={() => navigateToProduct(product.id.toString())}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                        <Eye className="w-3 h-3 text-gray-600" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// WishlistGrid Component
interface WishlistGridProps {
    products: Product[];
    onRemove: (id: number) => void;
    onMoveToCart: (id: number) => void;
}

const WishlistGrid: React.FC<WishlistGridProps> = ({ products, onRemove, onMoveToCart }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
                {products.map((product) => (
                    <WishlistItem
                        key={product.id}
                        product={product}
                        onRemove={onRemove}
                        onMoveToCart={onMoveToCart}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

// Empty State Component
const EmptyWishlist: React.FC<{ onBrowseProducts: () => void }> = ({ onBrowseProducts }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
        >
            <div className="mb-6">
                <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your wishlist is empty
                </h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm">
                    Start shopping and save your favorites! Discover amazing products and add them to your wishlist.
                </p>
            </div>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBrowseProducts}
                className="bg-gray-900 text-white py-2 px-6 rounded font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
                <span className="text-sm">Browse Products</span>
            </motion.button>
        </motion.div>
    );
};

// Main WishlistPage Component
const WishlistPage: React.FC = () => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>(wishlistData);

    const handleRemoveItem = (id: number) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const handleMoveToCart = (id: number) => {
        // In a real app, this would add to cart and optionally remove from wishlist
        console.log(`Moving product ${id} to cart`);
        // For demo, we'll just remove from wishlist after adding to cart
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const handleBrowseProducts = () => {
        // In a real app, this would navigate to the products page
        console.log('Navigate to products page');
        window.location.href = '/products';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-b border-gray-100"
            >
                <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            My Wishlist
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                            Keep track of products you love and want to purchase later.
                            {wishlistItems.length > 0 && ` You have ${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved.`}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {wishlistItems.length > 0 ? (
                    <WishlistGrid
                        products={wishlistItems}
                        onRemove={handleRemoveItem}
                        onMoveToCart={handleMoveToCart}
                    />
                ) : (
                    <EmptyWishlist onBrowseProducts={handleBrowseProducts} />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default WishlistPage;