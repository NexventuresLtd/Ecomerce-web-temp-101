import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { productsData } from '../../constants/ProductsData/ProductData';
import type { Product } from '../../types/Product/producttypeAdmin';


export const useProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = () => {
      try {
        setLoading(true);
        const foundProduct = productsData.find(p => p.id === Number(productId));
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};