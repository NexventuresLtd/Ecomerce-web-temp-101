import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message = "Product not found" }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Product Not Found</h1>
        <p className="text-gray-600">{message}</p>
        <motion.button
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          Back to Shop
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NotFound;