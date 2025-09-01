import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductBadges from './ProductBadges';
import ProductActions from './ProductActions';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import ProductCTA from './ProductCTA';
import type { Product } from '../../../../types/Product/ProductType';

interface ProductCardProps {
  product: Product;
  index: number;
  onProductClick: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onProductClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(
    product.images.find(img => img.isprimary)?.image || product.images[0]?.image || ''
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.hoverImage) {
      setCurrentImage(product.hoverImage);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const primaryImage = product.images.find(img => img.isprimary)?.image || product.images[0]?.image || '';
    setCurrentImage(primaryImage);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative "
      >
        <div className='relative h-64'>

          {/* Product Image Section */}
          <ProductImage
            product={product}
            isHovered={isHovered}
            currentImage={currentImage}
          />
          <ProductBadges product={product} />
          <ProductActions product={product} isHovered={isHovered} />
        </div>


        {/* CTA Button */}
        <div className="px-6 pb-6">
          {/* Product Info Section */}
          <ProductInfo product={product} onProductClick={onProductClick} />
          <ProductCTA product={product} onProductClick={onProductClick} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;