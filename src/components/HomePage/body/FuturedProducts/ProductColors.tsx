import React from 'react';
import type { Product } from '../../../../types/Product/ProductType';


interface ProductColorsProps {
  product: Product;
}

const ProductColors: React.FC<ProductColorsProps> = ({ product }) => {
  if (!product.colors || product.colors.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        {product.colors.map((color, idx) => (
          <div
            key={idx}
            className="w-4 h-4 rounded-full border-2 border-gray-200"
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductColors;