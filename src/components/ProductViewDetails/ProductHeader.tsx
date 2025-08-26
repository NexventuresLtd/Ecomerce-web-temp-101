import React from 'react';
import { Star } from 'lucide-react';
import type { Product } from '../../types/Product/ProductType';


interface ProductHeaderProps {
  product: Product;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {product.tags.map((tag) => (
          <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-gray-600">({product.reviewsCount} reviews)</span>
        </div>
        <span className="text-gray-600">Brand: {product.brand}</span>
      </div>
    </div>
  );
};

export default ProductHeader;