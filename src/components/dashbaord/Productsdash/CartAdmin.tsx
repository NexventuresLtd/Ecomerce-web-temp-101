import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  PhoneCall, 
  ShoppingCart,
  User,
  CreditCard,
  Package,
  ToggleLeft,
  ToggleRight,
  Trash2,
  MessageCircle
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';
import { RWF } from '../../../app/priceConver';
import { handleClickWhatsapp } from '../../../app/ProductWhasapp';

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  price_at_time: number;
  created_at: string;
  total_item_price: number;
  color?: Array<{ name: string; hex: string }>;
  delivery?: string;
}

interface Cart {
  id: number;
  user_id: number;
  fname: string;
  lname: string;
  phone?: string;
  email: string;
  is_active: boolean;
  created_at: string;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

const CartAdmin: React.FC = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const response = await mainAxios.get('/cart/all');
      setCarts(response.data.carts || []);
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCartStatus = async (cartId: number, currentStatus: boolean) => {
    try {
      await mainAxios.put(`/cart/toggle/${cartId}`, null, {
        params: { is_active: !currentStatus }
      });
      setCarts(carts.map(cart =>
        cart.id === cartId ? { ...cart, is_active: !currentStatus } : cart
      ));
    } catch (error) {
      console.error('Error toggling cart status:', error);
    }
  };

  const removeCartItem = async (cartId: number, itemId: number) => {
    if (!window.confirm('Are you sure you want to remove this item from the cart?')) {
      return;
    }

    try {
      await mainAxios.delete(`/cart/delete/${itemId}`);
      // Update local state
      setCarts(prev => prev.map(cart => 
        cart.id === cartId 
          ? {
              ...cart,
              items: cart.items.filter(item => item.id !== itemId),
              total_items: cart.total_items - (cart.items.find(item => item.id === itemId)?.quantity || 0),
              total_price: cart.total_price - (cart.items.find(item => item.id === itemId)?.total_item_price || 0)
            }
          : cart
      ));

      // Update selected cart if it's the one being modified
      if (selectedCart && selectedCart.id === cartId) {
        setSelectedCart(prev => prev ? {
          ...prev,
          items: prev.items.filter(item => item.id !== itemId),
          total_items: prev.total_items - (prev.items.find(item => item.id === itemId)?.quantity || 0),
          total_price: prev.total_price - (prev.items.find(item => item.id === itemId)?.total_item_price || 0)
        } : null);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      alert('Failed to remove cart item');
    }
  };

  const viewCartDetails = async (cart: Cart) => {
    try {
      // If items are not already loaded, fetch them
      if (!cart.items || cart.items.length === 0) {
        const response = await mainAxios.get(`/cart/${cart.id}`);
        setSelectedCart(response.data);
      } else {
        setSelectedCart(cart);
      }
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const closeModal = () => {
    setSelectedCart(null);
    setShowDetailsModal(false);
  };

  const handleWhatsAppMessage = (cart: Cart) => {
    const itemsList = cart.items.map(item => 
      `• ${item.product_name} (Qty: ${item.quantity}) - ${RWF.format(item.total_item_price)}`
    ).join('\n');

    const message = `🛒 Hello ${cart.fname}, here is your cart summary:\n\n${itemsList}\n\nTotal items: ${cart.total_items}\nTotal price: ${RWF.format(cart.total_price)}\n\nThank you for shopping with us!`;

    handleClickWhatsapp("Cart Information", cart.phone || "250781691713", message);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCarts = carts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(carts.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading carts...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Cart Management</h2>
          <p className="text-gray-600 mt-1">
            Total {carts.length} cart{carts.length !== 1 ? 's' : ''} • {' '}
            {carts.reduce((sum, c) => sum + c.total_items, 0)} total items
          </p>
        </div>
        <button
          onClick={fetchCarts}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Carts</p>
              <p className="text-2xl font-bold text-blue-600">{carts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Total Items</p>
              <p className="text-2xl font-bold text-green-600">
                {carts.reduce((sum, c) => sum + c.total_items, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                {RWF.format(carts.reduce((sum, c) => sum + c.total_price, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <User className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-900">Active Users</p>
              <p className="text-2xl font-bold text-orange-600">
                {new Set(carts.map(c => c.user_id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cart Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items & Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCarts.map((cart) => (
              <tr key={cart.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">ID: {cart.id}</p>
                    <p className="text-sm text-gray-600">{cart.items?.length || 0} item{cart.items?.length !== 1 ? 's' : ''}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cart.fname} {cart.lname}
                    </p>
                    <p className="text-sm text-gray-600">{cart.email}</p>
                    {cart.phone && (
                      <div 
                        onClick={() => handleWhatsAppMessage(cart)}
                        className="text-xs text-blue-600 flex items-center gap-1 mt-1 cursor-pointer hover:underline"
                      >
                        <PhoneCall className="w-3 h-3" />
                        {cart.phone}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">UID: {cart.user_id}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cart.total_items} items
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      {RWF.format(cart.total_price)}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleCartStatus(cart.id, cart.is_active)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        cart.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {cart.is_active ? (
                        <ToggleRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-1" />
                      )}
                      {cart.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(cart.created_at)}
                </td>
                <td className="px-4 py-4 space-x-2 flex xl:flex-row gap-3">
                  <button
                    onClick={() => viewCartDetails(cart)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  {cart.phone && (
                    <button
                      onClick={() => handleWhatsAppMessage(cart)}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </button>
                  )}
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

      {carts.length === 0 && !loading && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No carts found.</p>
        </div>
      )}

      {/* Cart Details Modal */}
      {showDetailsModal && selectedCart && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cart Details - {selectedCart.fname} {selectedCart.lname}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Cart ID: {selectedCart.id} • User ID: {selectedCart.user_id}
              </p>
            </div>

            <div className="p-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedCart.fname} {selectedCart.lname}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedCart.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedCart.phone || 'Not provided'}</p>
                    <p><span className="text-gray-600">User ID:</span> {selectedCart.user_id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cart Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Total Items:</span> {selectedCart.total_items}</p>
                    <p><span className="text-gray-600">Total Value:</span> {RWF.format(selectedCart.total_price)}</p>
                    <p><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedCart.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCart.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p><span className="text-gray-600">Created:</span> {formatDate(selectedCart.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <h4 className="font-medium text-gray-900 mb-4">
                Cart Items ({selectedCart.items?.length || 0})
              </h4>
              <div className="space-y-4">
                {selectedCart.items?.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                          <span className="text-sm text-gray-500">ID: {item.product_id}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Unit Price:</span>
                            <span className="ml-2 font-medium">{RWF.format(item.price_at_time)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {RWF.format(item.total_item_price)}
                            </span>
                          </div>
                          {item.delivery && (
                            <div>
                              <span className="text-gray-600">Delivery:</span>
                              <span className="ml-2 font-medium">{item.delivery}</span>
                            </div>
                          )}
                        </div>

                        {/* Colors */}
                        {item.color && item.color.length > 0 && (
                          <div className="mt-2">
                            <span className="text-gray-600 text-sm">Selected Colors:</span>
                            <div className="flex gap-1 mt-1">
                              {item.color.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-4 h-4 rounded-full border border-gray-200"
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-500">
                          Added on {formatDate(item.created_at)}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeCartItem(selectedCart.id, item.id)}
                        className="ml-4 flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(!selectedCart.items || selectedCart.items.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No items in this cart
                </div>
              )}

              {/* Cart Total */}
              {selectedCart.items && selectedCart.items.length > 0 && (
                <div className="flex justify-between items-center p-4 border-t border-gray-200 mt-6">
                  <div>
                    <p className="font-semibold text-gray-900">Cart Total</p>
                    <p className="text-sm text-gray-600">{selectedCart.total_items} items</p>
                  </div>
                  <p className="font-bold text-2xl text-green-600">
                    {RWF.format(selectedCart.total_price)}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              {selectedCart.phone && (
                <button
                  onClick={() => handleWhatsAppMessage(selectedCart)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send WhatsApp
                </button>
              )}
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