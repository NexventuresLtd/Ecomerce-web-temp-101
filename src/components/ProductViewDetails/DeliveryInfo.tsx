import React from 'react';
import { Truck, Shield, RefreshCw } from 'lucide-react';
import type { Product } from '../../types/Product/ProductType';

interface DeliveryInfoProps {
  product: Product;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ product }) => {
  return (
    <div className="border-t pt-6 space-y-3">
      <div className="flex items-center space-x-3">
        <Truck className="w-5 h-5 text-green-600" />
        <span className="text-gray-700">
          {product.deliveryFee === 0 ? 'Free delivery' : `Delivery fee: Rwf ${product.deliveryFee}`}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <Shield className="w-5 h-5 text-blue-600" />
        <span className="text-gray-700">2-year warranty included</span>
      </div>
      <div className="flex items-center space-x-3">
        <RefreshCw className="w-5 h-5 text-purple-600" />
        <span className="text-gray-700">30-day return policy</span>
      </div>
    </div>
  );
};

export default DeliveryInfo;