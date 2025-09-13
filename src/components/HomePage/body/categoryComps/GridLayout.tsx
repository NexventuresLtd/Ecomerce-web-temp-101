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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8 mx-auto max-w-5xl 2xl:max-w-full">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="h-full pb-5 transform scale-90 sm:scale-90 md:scale-95 lg:scale-95 xl:scale-90 2xl:scale-90"
          >
            <CategoryCard
              category={category}
              index={index}
              showStats={showStats}
              onClick={onCategoryClick}
            />
            <div className='text-center font-bold text-lg uppercase p-1 text-primary'>
              {category.name}
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
};

export default GridLayout;