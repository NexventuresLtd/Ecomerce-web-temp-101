import React from 'react';
import { categoriesData } from '../../../constants/HomeCategories/categories';
import CategoryCard from './categoryComps/CategoryCard';

const CategorySection: React.FC = () => {
  if (!categoriesData || categoriesData.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoriesData.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              showStats={true}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
