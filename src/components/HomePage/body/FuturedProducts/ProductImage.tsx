import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../../../types/Product/ProductType';


interface ProductImageProps {
  product: Product;
  isHovered: boolean;
  currentImage: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ product, isHovered, currentImage }) => {
  return (
    <div className="relative overflow-hidden aspect-auto h-full w-full">
      <motion.img
        src={currentImage}
        alt={product.title}
        className="w-full h-full object-cover"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default ProductImage;