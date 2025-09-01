import React from 'react';
import { motion } from 'framer-motion';


import ProductCard from './ProductCard';
import { useNavigation } from '../../../../hooks/product/useNavigation';
import { productsData } from '../../../../constants/ProductsData/ProductData';
import SectionHeader from './SectionHeader';

const FeaturedProducts: React.FC = () => {
  const { navigateToProduct, navigateToProducts } = useNavigation();
  const featuredProducts = productsData.filter(product => product.isFeatured);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-4">
        <SectionHeader
          title="Featured Products"
          subtitle="Discover our handpicked selection of premium products that deliver exceptional quality and innovation."
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onProductClick={navigateToProduct}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            onClick={navigateToProducts}
          >
            View All Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;