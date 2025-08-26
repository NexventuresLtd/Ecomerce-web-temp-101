import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import type { Product } from '../../types/Product/ProductType';


interface ProductCTAProps {
  product: Product;
  selectedColor: string;
  onAddToCart: (product: Product, quantity: number, color: string) => void;
}

const ProductCTA: React.FC<ProductCTAProps> = ({ product, selectedColor, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
          <button
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
            onClick={() => setQuantity(Math.min(product.instock, quantity + 1))}
          >
            +
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex space-x-4">
        <motion.button
          className="flex-1 bg-primary text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.instock === 0}
        >
          <ShoppingCart className="w-5 h-5 inline mr-2" />
          Add to Cart
        </motion.button>
        <motion.button
          className="flex-1 bg-secondary text-white py-4 px-6 rounded-xl font-semibold hover:bg-secondary/90 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Buy Now
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <motion.button
          className={`flex-1 border-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
          onClick={() => setIsWishlisted(!isWishlisted)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Heart className={`w-5 h-5 inline mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </motion.button>
        <motion.button
          className="border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:border-gray-400 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-5 h-5 inline mr-2" />
          Share
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCTA;