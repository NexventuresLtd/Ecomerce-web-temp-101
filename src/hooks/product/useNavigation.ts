import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const navigateToProducts = () => {
    navigate('/product');
  };

  return {
    navigateToProduct,
    navigateToProducts
  };
};