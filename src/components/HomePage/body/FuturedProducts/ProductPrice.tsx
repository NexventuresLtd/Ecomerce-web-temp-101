import React from 'react';
import type { Product } from '../../../../types/Product/ProductType';
import { RWF } from '../../../../app/priceConver';


interface ProductPriceProps {
  product: Product;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ product }) => {
  return (
    <div className="flex items-center gap-3 mb-1">
      <span className="text-lg font-bold text-gray-900">
        {RWF.format(product.price)}
      </span>
      {product.originalPrice && (
        <span className="text-sm text-gray-500 line-through">
          {RWF.format(product.originalPrice)}
        </span>
      )}
    </div>
  );
};

export default ProductPrice;