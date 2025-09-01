import React from 'react';
import { Star } from 'lucide-react';
import type { Product } from '../../../../types/Product/ProductType';

interface ProductRatingProps {
  product: Product;
}

const ProductRating: React.FC<ProductRatingProps> = ({ product }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center">
        {renderStars(product.rating)}
      </div>
      <span className="text-xs text-gray-500">
        ({product.reviewsCount.toLocaleString()})
      </span>
    </div>
  );
};

export default ProductRating;