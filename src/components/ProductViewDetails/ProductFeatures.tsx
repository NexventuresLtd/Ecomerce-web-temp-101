import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProductFeaturesProps {
  features: string[];
}

const ProductFeatures: React.FC<ProductFeaturesProps> = ({ features }) => {
  if (!features.length) return null;

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h3 className="text-xl font-bold text-gray-800">Key Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductFeatures;