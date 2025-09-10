import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  title?: string;
  image?: string;
}

interface Cart {
  id: number;
  user_id: number;
  items_count: number;
  total_value: number;
  is_active: boolean;
  created_at: string;
  items?: CartItem[];
}

const CartAdmin: React.FC = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const response = await mainAxios.get('/api/cart/all');
      setCarts(response.data.carts || []);
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCartStatus = async (cartId: number, currentStatus: boolean) => {
    try {
      await mainAxios.put(`/api/cart/toggle/${cartId}`, {
        is_active: !currentStatus
      });
      setCarts(carts.map(cart => 
        cart.id === cartId ? { ...cart, is_active: !currentStatus } : cart
      ));
    } catch (error) {
      console.error('Error toggling cart status:', error);
    }
  };

  const viewCartItems = async (cart: Cart) => {
    try {
      // If items are not already loaded, fetch them
      if (!cart.items) {
        const response = await mainAxios.get(`/api/cart/${cart.id}/items`);
        setSelectedCart({ ...cart, items: response.data.items });
      } else {
        setSelectedCart(cart);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const closeModal = () => {
    setSelectedCart(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCarts = carts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(carts.length / itemsPerPage);

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
        <h2 className="text-2xl font-semibold text-gray-800">Cart Management</h2>
        <button
          onClick={fetchCarts}
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
                Cart ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {currentCarts.map((cart) => (
              <tr key={cart.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{cart.id}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{cart.user_id}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{cart.items_count}</td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  ${cart.total_value.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      cart.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {cart.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(cart.created_at)}
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewCartItems(cart)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleCartStatus(cart.id, cart.is_active)}
                      className={`px-3 py-1 rounded text-xs ${
                        cart.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {cart.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
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

      {/* Modal for cart items */}
      {selectedCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Cart Items - Cart #{selectedCart.id}
              </h3>
            </div>
            <div className="p-6">
              {selectedCart.items?.length ? (
                <div className="space-y-4">
                  {selectedCart.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-800">{item.title || `Product ${item.product_id}`}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No items in this cart.</p>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartAdmin;