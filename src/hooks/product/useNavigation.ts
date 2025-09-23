import { useNavigate } from 'react-router-dom';
import { encodeId } from '../../app/products/id_encrypter';

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToProduct = (productId: string) => {
    const newID = encodeId(parseInt(productId))
    window.location.href = (`/product/${newID}`);
  };
  const navigateToProductCategory = (category: any) => {
    const newID = encodeId(category)
    // alert(newID)
    window.location.href = (`/products/${newID}`);
  };

  const navigateToProducts = () => {
    navigate('/products');
  };

  return {
    navigateToProductCategory,
    navigateToProduct,
    navigateToProducts
  };
};