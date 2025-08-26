import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import type { Product } from '../../types/Product/ProductType';

interface TutorialVideoProps {
  product: Product;
}

const TutorialVideo: React.FC<TutorialVideoProps> = ({ product }) => {
  const [showVideo, setShowVideo] = useState(true);

  if (!product.tutorialVideo) return null;

  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Product Tutorial</h3>
        <motion.button
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          onClick={() => setShowVideo(!showVideo)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-5 h-5 inline mr-2" />
          {showVideo ? 'Hide Video' : 'Watch Tutorial'}
        </motion.button>
      </div>
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <iframe
              src={product.tutorialVideo}
              className="w-full h-96"
              frameBorder="0"
              allowFullScreen
              title="Product Tutorial"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TutorialVideo;