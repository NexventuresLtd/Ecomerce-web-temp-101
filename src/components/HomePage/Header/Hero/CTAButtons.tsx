// components/CTAButtons.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTAButtonsProps {
  primary: string;
  secondary: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

const CTAButtons: React.FC<CTAButtonsProps> = ({ 
  primary, 
  onPrimaryClick, 
  onSecondaryClick 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 40 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex flex-col justify-center sm:flex-row gap-4"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPrimaryClick}
        className="group bg-secondary hidden text-white px-8 py-4 rounded-2xl font-semibold  items-center justify-center gap-2 transition-colors duration-200"
      >
        {primary}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 " />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSecondaryClick}
        className="cursor-pointer text-white px-8 py-3 rounded-2xl font-semibold transition-colors duration-200 border border-slate-600 hover:bg-slate-600"
      >
        view
      </motion.button>
    </motion.div>
  );
};

export default CTAButtons;