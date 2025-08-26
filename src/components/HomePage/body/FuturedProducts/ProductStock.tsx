import React from 'react';
import type { Product } from '../../../../types/Product/ProductType';

interface ProductStockProps {
  product: Product;
}

const ProductStock: React.FC<ProductStockProps> = ({ product }) => {
  const getStockStatus = () => {
    if (product.instock === 0) {
      return <span className="text-red-600 text-sm font-medium">Out of Stock</span>;
    } else if (product.instock < 10) {
      return <span className="text-orange-600 text-sm font-medium">Low Stock</span>;
    } else {
      return <span className="text-green-600 text-sm font-medium">In Stock</span>;
    }
  };

  return (
    <div className="mb-4">
      {getStockStatus()}
    </div>
  );
};

export default ProductStock;