import React, { useRef } from 'react';
import { motion, type Variants } from 'framer-motion';

import CategoryCard from './CategoryCard';
import CarouselControls from './CarouselControls';
import type { Category } from '../../../../types/HomeCategories';

interface CarouselLayoutProps {
  categories: Category[];
  showStats: boolean;
  onCategoryClick: (category: Category) => void;
  itemsPerView: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselLayout: React.FC<CarouselLayoutProps> = ({
  categories,
  showStats,
  onCategoryClick,
  itemsPerView,
  currentIndex,
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext
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

  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="overflow-hidden" ref={carouselRef}>
        <motion.div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div className="h-full">
                <CategoryCard
                  category={category}
                  index={index}
                  showStats={showStats}
                  onClick={onCategoryClick}
                />
                <div className='text-center font-bold text-2xl uppercase p-2 text-primary'>{category.name}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <CarouselControls
        onPrev={onPrev}
        onNext={onNext}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
      />
    </motion.div>
  );
};

export default CarouselLayout;