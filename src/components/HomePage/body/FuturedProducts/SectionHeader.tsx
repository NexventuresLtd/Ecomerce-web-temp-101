import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default SectionHeader;