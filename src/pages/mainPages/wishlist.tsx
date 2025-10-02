import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, X, Eye, Plus, Minus, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import Footer from '../../components/SharedComp/footer';

import { useNavigation } from '../../hooks/product/useNavigation';
import { RWF } from '../../app/priceConver';
import { wishlistService, type WishlistItem, type WishlistResponse } from '../../app/products/wishlistService';

// WishlistItem Component
interface WishlistItemProps {
  item: WishlistItem;
  onRemove: (id: number) => void;
  onMoveToCart: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const WishlistItemComponent: React.FC<WishlistItemProps> = ({ 
  item, 
  onRemove, 
  onMoveToCart,
  onUpdateQuantity 
}) => {
//   const [currentImage, setCurrentImage] = useState(item.product_image?.[0] || '');
  const [quantity, setQuantity] = useState(item.quantity);
  const { navigateToProduct } = useNavigation();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.max_available) return;
    
    setQuantity(newQuantity);
    onUpdateQuantity(item.wishlist_item_id, newQuantity);
  };

  const mainImage = Array.isArray(item.product_image) 
    ? item.product_image[0].url 
    : item.product_image;

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
          src={`${import.meta.env.VITE_API_BASE_URL}${mainImage}`}
          alt={item.product_name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />

        {/* Stock Status */}
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs px-2 py-1 rounded font-medium ${
            item.in_stock > 10
              ? 'bg-green-100 text-green-800'
              : item.in_stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {item.in_stock > 0 ? `${item.in_stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.wishlist_item_id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-red-50 transition-colors group shadow-sm"
        >
          <X className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Product Title */}
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
            {item.product_name}
          </h3>
        </div>

        {/* Delivery Option */}
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Delivery: {item.delivery}</span>
        </div>

        {/* Colors */}
        {item.wishlist_color && item.wishlist_color.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Colors:</span>
            <div className="flex gap-1">
              {item.wishlist_color.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Quantity:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-medium w-8 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= item.max_available}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {RWF.format(item.price_at_time * quantity)}
            </span>
            {item.current_price !== item.price_at_time && (
              <span className="text-sm text-gray-500 line-through">
                {RWF.format(item.current_price * quantity)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {RWF.format(item.price_at_time)} each
          </span>
        </div>

        {/* Delivery Fee */}
        {item.delivery_fee > 0 && (
          <div className="text-xs text-gray-500">
            + {RWF.format(item.delivery_fee)} delivery fee
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMoveToCart(item.wishlist_item_id)}
            disabled={item.in_stock === 0}
            className="flex-1 bg-gray-900 text-white py-2 px-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-3 h-3" />
            <span className="text-sm">Move to Cart</span>
          </motion.button>
          <motion.button
            onClick={() => navigateToProduct(item.product_id.toString())}
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
  items: WishlistItem[];
  onRemove: (id: number) => void;
  onMoveToCart: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const WishlistGrid: React.FC<WishlistGridProps> = ({ items, onRemove, onMoveToCart, onUpdateQuantity }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <AnimatePresence>
        {items.map((item) => (
          <WishlistItemComponent
            key={item.wishlist_item_id}
            item={item}
            onRemove={onRemove}
            onMoveToCart={onMoveToCart}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Wishlist Summary Component
interface WishlistSummaryProps {
  totalItems: number;
  totalPrice: number;
}

const WishlistSummary: React.FC<WishlistSummaryProps> = ({ totalItems, totalPrice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 border border-gray-100 mb-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Wishlist Summary</h3>
          <p className="text-gray-600 text-sm">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">{RWF.format(totalPrice)}</p>
        </div>
      </div>
    </motion.div>
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

// Loading Component
const WishlistLoading: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="text-gray-600 mt-4">Loading your wishlist...</p>
    </div>
  );
};

// Error Component
const WishlistError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="mb-6">
        <Heart className="w-20 h-20 text-red-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to load wishlist
        </h3>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          There was an error loading your wishlist. Please try again.
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRetry}
        className="bg-gray-900 text-white py-2 px-6 rounded font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
      >
        <span className="text-sm">Try Again</span>
      </motion.button>
    </motion.div>
  );
};

// Main WishlistPage Component
const WishlistPage: React.FC = () => {
  const [wishlistData, setWishlistData] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load wishlist on component mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishlistService.getMyWishlist();
      setWishlistData(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load wishlist');
      console.error('Error loading wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (wishlistItemId: number) => {
    try {
      await wishlistService.removeFromWishlist(wishlistItemId);
      // Update local state
      if (wishlistData) {
        setWishlistData({
          ...wishlistData,
          items: wishlistData.items.filter(item => item.wishlist_item_id !== wishlistItemId),
          total_items: wishlistData.total_items - (wishlistData.items.find(item => item.wishlist_item_id === wishlistItemId)?.quantity || 0),
          total_price: wishlistData.total_price - (wishlistData.items.find(item => item.wishlist_item_id === wishlistItemId)?.item_total || 0)
        });
      }
    } catch (err: any) {
      console.error('Error removing item from wishlist:', err);
      // Reload wishlist to sync with server
      loadWishlist();
    }
  };

  const handleMoveToCart = async (wishlistItemId: number) => {
    try {
      await wishlistService.moveToCart(wishlistItemId);
      // Remove from local state after moving to cart
      if (wishlistData) {
        setWishlistData({
          ...wishlistData,
          items: wishlistData.items.filter(item => item.wishlist_item_id !== wishlistItemId),
          total_items: wishlistData.total_items - (wishlistData.items.find(item => item.wishlist_item_id === wishlistItemId)?.quantity || 0),
          total_price: wishlistData.total_price - (wishlistData.items.find(item => item.wishlist_item_id === wishlistItemId)?.item_total || 0)
        });
      }
    } catch (err: any) {
      console.error('Error moving item to cart:', err);
      alert(err.response?.data?.detail || 'Failed to move item to cart');
    }
  };

  const handleUpdateQuantity = async (wishlistItemId: number, quantity: number) => {
    try {
      const item = wishlistData?.items.find(item => item.wishlist_item_id === wishlistItemId);
      if (!item) return;

      await wishlistService.updateWishlistItem(
        wishlistItemId, 
        quantity, 
        item.delivery, 
        item.wishlist_color
      );

      // Update local state
      if (wishlistData) {
        const updatedItems = wishlistData.items.map(item => 
          item.wishlist_item_id === wishlistItemId 
            ? { 
                ...item, 
                quantity,
                item_total: item.price_at_time * quantity
              }
            : item
        );

        const total_items = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const total_price = updatedItems.reduce((sum, item) => sum + item.item_total, 0);

        setWishlistData({
          ...wishlistData,
          items: updatedItems,
          total_items,
          total_price
        });
      }
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      // Reload wishlist to sync with server
      loadWishlist();
    }
  };

  const handleBrowseProducts = () => {
    window.location.href = '/products';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <WishlistLoading />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <WishlistError onRetry={loadWishlist} />
        </div>
        <Footer />
      </div>
    );
  }

  const hasItems = wishlistData && wishlistData.items && wishlistData.items.length > 0;

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
              {hasItems && ` You have ${wishlistData.total_items} item${wishlistData.total_items !== 1 ? 's' : ''} saved.`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {hasItems ? (
          <>
            <WishlistSummary 
              totalItems={wishlistData.total_items} 
              totalPrice={wishlistData.total_price} 
            />
            <WishlistGrid
              items={wishlistData.items}
              onRemove={handleRemoveItem}
              onMoveToCart={handleMoveToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </>
        ) : (
          <EmptyWishlist onBrowseProducts={handleBrowseProducts} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;