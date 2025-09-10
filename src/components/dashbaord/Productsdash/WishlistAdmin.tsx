import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  image?: string;
}

interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product?: ProductDetails;
}

const WishlistAdmin: React.FC = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const response = await mainAxios.get('/api/wishlist/all');
      const wishlistsData = response.data.wishlists || [];
      
      // If you want to fetch product details, you could do it here
      // This is optional based on your API structure
      setWishlists(wishlistsData);
    } catch (error) {
      console.error('Error fetching wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeWishlist = async (wishlistId: number) => {
    if (!window.confirm('Are you sure you want to remove this wishlist entry?')) {
      return;
    }

    try {
      await mainAxios.delete(`/api/wishlist/delete/${wishlistId}`);
      setWishlists(wishlists.filter(wishlist => wishlist.id !== wishlistId));
    } catch (error) {
      console.error('Error removing wishlist:', error);
      alert('Failed to remove wishlist entry');
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWishlists = wishlists.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(wishlists.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Wishlist Management</h2>
        <button
          onClick={fetchWishlists}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wishlist ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentWishlists.map((wishlist) => (
              <tr key={wishlist.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{wishlist.id}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{wishlist.user_id}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{wishlist.product_id}</td>
                <td className="px-4 py-4">
                  {wishlist.product ? (
                    <div className="flex items-center space-x-3">
                      {wishlist.product.image ? (
                        <img
                          src={wishlist.product.image}
                          alt={wishlist.product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Image className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {wishlist.product.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${wishlist.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No details available</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(wishlist.created_at)}
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  <button
                    onClick={() => removeWishlist(wishlist.id)}
                    className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {wishlists.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No wishlist entries found.</p>
        </div>
      )}
    </div>
  );
};

export default WishlistAdmin;