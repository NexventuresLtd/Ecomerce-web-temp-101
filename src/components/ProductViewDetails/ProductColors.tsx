import React from 'react';
import { motion } from 'framer-motion';
import type { ProductColor } from '../../types/Product/ProductType';



interface ProductColorsProps {
  colors: ProductColor[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ProductColors: React.FC<ProductColorsProps> = ({
  colors,
  selectedColor,
  onColorSelect
}) => {
  if (!colors.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Available Colors</h3>
      <div className="flex space-x-3">
        {colors.map((color) => (
          <motion.button
            key={color.name}
            className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
              selectedColor === color.name ? 'border-blue-500 scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorSelect(color.name)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={color.name}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600">Selected: {selectedColor}</p>
    </div>
  );
};

export default ProductColors;