import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={titleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        {title}
      </h2>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default SectionHeader;