import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../types/Product/producttypeAdmin';
import { productApi } from '../../app/products/allProductgeter';
import { decodeId } from '../../app/products/id_encrypter';


export const useProduct = () => {
  let { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }
      const newid = decodeId(productId)

      try {
        setLoading(true);
        setError(null);

        // Fetch product from API
        const response = await productApi.getProduct(newid);

        if (response) {
          setProduct(response);
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        setError((err.status == 404 ? "Product Not Found in our system" : err.message) || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};