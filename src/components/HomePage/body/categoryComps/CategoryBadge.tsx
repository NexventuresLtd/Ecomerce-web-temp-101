import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import type { Category } from '../../../../types/HomeCategories';


interface CategoryBadgeProps {
  badge: Category['badge'];
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ badge }) => {
  if (!badge) return null;

  const iconMap = {
    new: Sparkles,
    trending: TrendingUp,
    hot: Sparkles
  };

  const Icon = iconMap[badge.type];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2 
      }}
      className={`absolute top-1 right-1 ${badge.color} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 whitespace-nowrap`}
    >
      <Icon className="w-3 h-3" />
      {badge.text}
    </motion.div>
  );
};

export default CategoryBadge;