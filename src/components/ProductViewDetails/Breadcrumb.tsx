import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Product } from '../../types/Product/ProductType';


interface BreadcrumbProps {
  product: Product;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ product }) => {
  return (
    <motion.div 
      className="bg-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-full md:max-w-11/12 mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Umukamezi</span>
          <ChevronRight className="w-4 h-4" />
          <span>{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">{product.title}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Breadcrumb;