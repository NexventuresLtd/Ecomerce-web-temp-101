import React from 'react';
import type { Product } from '../../../../types/Product/ProductType';

interface ProductFeaturesProps {
  product: Product;
}

const ProductFeatures: React.FC<ProductFeaturesProps> = ({ product }) => {
  if (!product.features || product.features.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-1">
        {product.features.slice(0, 3).map((feature, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductFeatures;