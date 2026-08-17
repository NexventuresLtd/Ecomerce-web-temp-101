import React from 'react';
import { Heart } from 'lucide-react';


const WishlistAdmin: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Wishlists</h1>
          <p className="text-sm text-gray-500">Monitor active user wishlists and saved items.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-pink-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Wishlist Management Overview</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Customer wishlist activity is automatically tracked across active user accounts and aggregated in the main admin dashboard overview.
        </p>
      </div>
    </div>
  );
};

export default WishlistAdmin;
