import { useNavigate } from 'react-router-dom';
import { encodeId } from '../../app/products/id_encrypter';

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToProduct = (id: number | string) => {
    const encoded = encodeId(id);
    navigate(`/product/${encoded}`);
  };

  const navigateToProducts = () => {
    navigate('/products');
  };

  return { navigate, navigateToProduct, navigateToProducts };
};

