import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({ 
  onPrev, 
  onNext, 
  canScrollPrev, 
  canScrollNext 
}) => {
  return (
    <div className="flex gap-2 mt-8 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPrev}
        disabled={!canScrollPrev}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
          ${canScrollPrev 
            ? 'bg-slate-900 text-white hover:bg-slate-800' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={!canScrollNext}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
          ${canScrollNext 
            ? 'bg-slate-900 text-white hover:bg-slate-800' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default CarouselControls;