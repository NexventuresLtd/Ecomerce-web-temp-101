import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, X, Verified, Package, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/SharedComp/navabaritems/NavBar';
import Footer from '../components/SharedComp/footer';
import type { Owner, Product } from '../types/Product/ProductType';
import { ownerData, productsData } from '../constants/ProductsData/ProductData';
import { useNavigation } from '../hooks/product/useNavigation';



// Mock Data
const wishlistData: Product[] = productsData.filter(product => product.isFeatured).slice(0, 4)



// WishlistItem Component
interface WishlistItemProps {
    product: Product;
    owner: Owner;
    onRemove: (id: string) => void;
    onMoveToCart: (id: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ product, owner, onRemove, onMoveToCart }) => {
    const [currentImage, setCurrentImage] = useState(product.images[0]?.image);
    const [showTooltip, setShowTooltip] = useState(false);

    const discountedPrice = product.originalPrice ? product.originalPrice - (product.originalPrice * (product.discount || 0) / 100) : product.price;
    const { navigateToProduct } = useNavigation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300"
        >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <motion.img
                    src={currentImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => product.hoverImage && setCurrentImage(product.hoverImage)}
                    onMouseLeave={() => setCurrentImage(product.images[0]?.image)}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            New
                        </span>
                    )}
                    {product.isFeatured && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Featured
                        </span>
                    )}
                    {product.discount && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-red-50 transition-colors group"
                >
                    <X className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                </button>

                {/* Stock Status */}
                <div className="absolute bottom-3 left-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.instock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.instock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {product.instock > 0 ? `${product.instock} in stock` : 'Out of stock'}
                    </span>
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4 space-y-3">
                {/* Owner Info */}
                <div className="relative">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <img
                            src={owner.image}
                            alt={owner.name}
                            className="w-6 h-6 rounded-full border border-gray-200"
                        />
                        <span className="text-sm text-gray-600">{owner.name}</span>
                        {owner.isverified && (
                            <Verified className="w-4 h-4 text-blue-500" />
                        )}
                    </div>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 top-8 left-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap"
                            >
                                <div className="flex items-center gap-2">
                                    <span>{owner.name}</span>
                                    {owner.isverified && <Verified className="w-3 h-3" />}
                                </div>
                                <div className="text-gray-300 mt-1">Joined {new Date(owner.JoinedAt).getFullYear()}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Product Title & Description */}
                <div>
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                        {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                    </p>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviewsCount} reviews)</span>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Colors:</span>
                    <div className="flex gap-1">
                        {product.colors.slice(0, 4).map((color, index) => (
                            <div
                                key={index}
                                className="w-5 h-5 rounded-full border-2 border-gray-200"
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                        {product.colors.length > 4 && (
                            <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                        ${discountedPrice.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onMoveToCart(product.id)}
                        disabled={product.instock === 0}
                        className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Move to Cart
                    </motion.button>
                    <motion.button
                        onClick={() => navigateToProduct(product.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                        <Eye className="w-4 h-4 text-gray-600" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// WishlistGrid Component
interface WishlistGridProps {
    products: Product[];
    owner: Owner;
    onRemove: (id: string) => void;
    onMoveToCart: (id: string) => void;
}

const WishlistGrid: React.FC<WishlistGridProps> = ({ products, owner, onRemove, onMoveToCart }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
                {products.map((product) => (
                    <WishlistItem
                        key={product.id}
                        product={product}
                        owner={owner}
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
                <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Your wishlist is empty
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    Start shopping and save your favorites! Discover amazing products and add them to your wishlist.
                </p>
            </div>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBrowseProducts}
                className="bg-gray-900 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
                <Package className="w-5 h-5" />
                Browse Products
            </motion.button>
        </motion.div>
    );
};

// Main WishlistPage Component
const WishlistPage: React.FC = () => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>(wishlistData);

    const handleRemoveItem = (id: string) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const handleMoveToCart = (id: string) => {
        // In a real app, this would add to cart and optionally remove from wishlist
        console.log(`Moving product ${id} to cart`);
        // For demo, we'll just remove from wishlist after adding to cart
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const handleBrowseProducts = () => {
        // In a real app, this would navigate to the products page
        console.log('Navigate to products page');
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
                <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            My Wishlist
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Keep track of products you love and want to purchase later.
                            {wishlistItems.length > 0 && ` You have ${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved.`}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {wishlistItems.length > 0 ? (
                    <WishlistGrid
                        products={wishlistItems}
                        owner={ownerData[0]}
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