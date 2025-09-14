import { useNavigate } from 'react-router-dom';
import { encodeId } from '../../app/products/id_encrypter';

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToProduct = (productId: string) => {
    const newID = encodeId(parseInt(productId))
    window.location.href = (`/product/${newID}`);
  };

  const navigateToProducts = () => {
    navigate('/products');
  };

  return {
    navigateToProduct,
    navigateToProducts
  };
};