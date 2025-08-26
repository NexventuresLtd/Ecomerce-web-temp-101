import React from 'react';
import type { Product } from '../../../../types/Product/ProductType';


interface ProductBadgesProps {
  product: Product;
}

const ProductBadges: React.FC<ProductBadgesProps> = ({ product }) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      {product.isNew && (
        <span className="bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
          New
        </span>
      )}
      {product.isFeatured && (
        <span className="bg-secondary text-white px-2 py-1 text-xs font-semibold rounded-full">
          Featured
        </span>
      )}
      {product.discount && (
        <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
          -{product.discount}%
        </span>
      )}
    </div>
  );
};

export default ProductBadges;