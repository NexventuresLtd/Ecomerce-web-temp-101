import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../types/Product/ProductType';


interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images.find(img => img.isprimary)?.image || product.images[0]?.image;
  const displayImage = isHovered && product.hoverImage ? product.hoverImage : 
                      product.images[selectedImage]?.image || primaryImage;

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Image */}
      <div 
        className="relative bg-white rounded-2xl overflow-hidden aspect-square"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            New
          </div>
        )}
        {product.discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {product.images.map((image, index) => (
          <motion.button
            key={index}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImage === index ? 'border-blue-500' : 'border-gray-200'
            }`}
            onClick={() => setSelectedImage(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={image.image}
              alt={`${product.title} ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductImageGallery;