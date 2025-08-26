// components/StatsDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import type { HeroSlide } from '../../../../types/HomeHero';


interface StatsDisplayProps {
  stats: HeroSlide['stats'];
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="flex items-center gap-6 text-sm text-slate-300"
    >
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium text-white">{stats.rating}</span>
        <span>({stats.reviews.toLocaleString()} reviews)</span>
      </div>
      <div className="flex items-center gap-1">
        <ShoppingBag className="w-4 h-4 text-secondary" />
        <span className="font-medium text-white">{stats.sales}</span>
        <span>sold</span>
      </div>
    </motion.div>
  );
};

export default StatsDisplay;