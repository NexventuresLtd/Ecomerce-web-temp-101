// components/HeroImage.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroImageProps {
  currentSlide: number;
  imageUrl: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ currentSlide, imageUrl }) => {
  const imageVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img 
            src={imageUrl} 
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroImage;