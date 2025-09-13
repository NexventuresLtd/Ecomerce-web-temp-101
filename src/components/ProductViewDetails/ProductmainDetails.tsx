import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Breadcrumb from './Breadcrumb';
import ProductImageGallery from './ProductImageGallery';
import ProductHeader from './ProductHeader';
import ProductColors from './ProductColors';
import ProductCTA from './ProductCTA';
import DeliveryInfo from './DeliveryInfo';
import ProductFeatures from './ProductFeatures';
import TutorialVideo from './TutorialVideo';
import OwnerProfile from './OwnerProfile';
import { useProduct } from '../../hooks/product/useProduct';
import NotFound from './NotFound';
import { productsData } from '../../constants/ProductsData/ProductData';


const ProductDetails: React.FC = () => {
  const { product, loading, error } = useProduct();
  const [selectedColor, setSelectedColor] = useState("");

  // Handle add to cart functionality
  const handleAddToCart = (product: any, quantity: number, color: string) => {
    console.log('Adding to cart:', { product, quantity, color });
    // Implement your cart logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <NotFound message={error || "Product not found"} />;
  }

  // Set default color if not set
  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0].name);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb product={product} />
      
      <div className="max-w-full md:max-w-11/12 mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Images */}
          <ProductImageGallery product={product} />

          {/* Right Column - Product Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductHeader product={product} />

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-blue-600">Rwf {product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">Rwf {product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.instock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-medium ${product.instock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.instock > 0 ? `${product.instock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Colors */}
            <ProductColors
              colors={product.colors}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />

            {/* CTA Buttons */}
            <ProductCTA 
              product={product} 
              selectedColor={selectedColor} 
              onAddToCart={handleAddToCart}
            />

            {/* Delivery Info */}
            <DeliveryInfo product={product} />
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <ProductFeatures features={product.features} />
        </div>

        {/* Tutorial Video */}
        <TutorialVideo product={product} />

        {/* Owner Profile Section */}
        <OwnerProfile owner={ownerData[0]} products={productsData} />
      </div>
    </div>
  );
};

export default ProductDetails;