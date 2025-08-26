import React from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../../../../types/HomeCategories';


interface CategoryStatsProps {
  stats: Category['stats'];
  showStats: boolean;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ stats, showStats }) => {
  if (!stats || !showStats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="mt-3 space-y-1"
    >
      <div className="text-xs opacity-75">
        {stats.productCount.toLocaleString()} products
      </div>
      {stats.discount && (
        <div className="text-xs font-semibold text-emerald-600">
          Up to {stats.discount}% off
        </div>
      )}
    </motion.div>
  );
};

export default CategoryStats;