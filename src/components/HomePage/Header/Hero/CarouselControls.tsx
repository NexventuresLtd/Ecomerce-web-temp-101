// components/CarouselControls.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({ 
  currentSlide, 
  totalSlides, 
  onPrev, 
  onNext, 
  onDotClick 
}) => {
  return (
    <div className="flex items-center justify-center w-full gap-13 mt-6">
      <div className="flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDotClick(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentSlide ? 'bg-secondary' : 'bg-slate-600'
              }`}
          />
        ))}
      </div>
      <div className="flex gap-2 justify-between absolute w-full h-[400px]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onPrev}
          className="w-14 h-14 bg-slate-900/40 cursor-pointer hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors duration-200"
        >
          <ChevronLeft className="w-10 h-10" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNext}
          className="w-14 h-14 bg-slate-900/40 cursor-pointer hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors duration-200"
        >
          <ChevronRight className="w-10 h-10" />
        </motion.button>
      </div>
    </div>
  );
};

export default CarouselControls;