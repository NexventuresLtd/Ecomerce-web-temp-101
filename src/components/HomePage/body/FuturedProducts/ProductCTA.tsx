import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../../../../types/Product/ProductType';
import { handleClickWhatsapp } from '../../../../app/ProductWhasapp';

interface ProductCTAProps {
  product: Product;
  onProductClick: (productId: string) => void;
}

const ProductCTA: React.FC<ProductCTAProps> = ({ product, onProductClick }) => {
  const handleClick = () => {
    onProductClick(product.id);
  };

  return (
    <>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-6 rounded-xl text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 ${product.instock === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 cursor-pointer'
            }`}
          disabled={product.instock === 0}
          onClick={handleClick}
        >
          {product.instock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
            </>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-3 rounded-xl text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 bg-green-600 hover:bg-primary/90 cursor-pointer
      `}
          onClick={() => handleClickWhatsapp(product.title)}
        >
          <>
            <ShoppingCart size={18} />
            Ask on Whatsapp
          </>
        </motion.button>
      </div>
    </>
  );
};

export default ProductCTA;