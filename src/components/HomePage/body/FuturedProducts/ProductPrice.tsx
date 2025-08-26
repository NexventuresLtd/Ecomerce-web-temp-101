import React from 'react';
import type { Product } from '../../../../types/Product/ProductType';


interface ProductPriceProps {
  product: Product;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ product }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl font-bold text-gray-900">
        ${product.price}
      </span>
      {product.originalPrice && (
        <span className="text-lg text-gray-500 line-through">
          ${product.originalPrice}
        </span>
      )}
    </div>
  );
};

export default ProductPrice;