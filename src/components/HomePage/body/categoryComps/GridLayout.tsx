import React from 'react';
import { motion, type Variants } from 'framer-motion';
import CategoryCard from './CategoryCard';
import type { Category } from '../../../../types/HomeCategories';

interface GridLayoutProps {
  categories: Category[];
  showStats: boolean;
  onCategoryClick: (category: Category) => void;
}

const GridLayout: React.FC<GridLayoutProps> = ({ 
  categories, 
  showStats, 
  onCategoryClick 
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div key={category.id} className="h-full">
            <CategoryCard
              category={category}
              index={index}
              showStats={showStats}
              onClick={onCategoryClick}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GridLayout;