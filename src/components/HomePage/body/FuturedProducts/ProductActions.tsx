import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Play } from 'lucide-react';
import type { Product } from '../../../../types/Product/ProductType';



interface ProductActionsProps {
  product: Product;
  isHovered: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product, isHovered }) => {
  return (
    <motion.div
      className="absolute top-4 right-4 flex flex-col gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHovered ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
        <Heart size={18} className="text-gray-600" />
      </button>
      <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
        <Eye size={18} className="text-gray-600" />
      </button>
      {product.tutorialVideo && (
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Play size={18} className="text-gray-600" />
        </button>
      )}
    </motion.div>
  );
};

export default ProductActions;