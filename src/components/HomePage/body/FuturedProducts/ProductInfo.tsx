import React from 'react';
import ProductRating from './ProductRating';
import ProductFeatures from './ProductFeatures';
import ProductColors from './ProductColors';
import ProductPrice from './ProductPrice';
import ProductStock from './ProductStock';
import type { Product } from '../../../../types/Product/ProductType';

interface ProductInfoProps {
  product: Product;
  onProductClick: (productId: string) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onProductClick }) => {
  const handleTitleClick = () => {
    onProductClick(product.id);
  };

  return (
    <div className="p-6">
      <div className="">
        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          {product.category}
        </span>
      </div>

      <h3 
        className="font-bold text-sm text-gray-900 line-clamp-2 cursor-pointer hover:text-primary"
        onClick={handleTitleClick}
      >
        {product.title}
      </h3>

      <p className="text-gray-600 text-xs mb-4 line-clamp-2">
        {product.description}
      </p>

      <ProductRating product={product} />
      <ProductFeatures product={product} />
      <ProductColors product={product} />
      <ProductPrice product={product} />
      <ProductStock product={product} />
    </div>
  );
};

export default ProductInfo;