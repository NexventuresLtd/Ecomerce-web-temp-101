import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Package, 
  CreditCard,
  ToggleLeft,
  ToggleRight,
  Eye,
  ShoppingCart
} from 'lucide-react';
import mainAxios from '../../../Instance/mainAxios';

interface ProductColor {
  name: string;
  hex: string;
}

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  wishlist_color: ProductColor[];
  product_color: ProductColor[];
  delivery: string;
  price_at_time: number;
  created_at: string;
  total_item_price: number;
}

interface Wishlist {
  id: number;
  user_id: number;
  fname: string;
  lname: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  items: WishlistItem[];
  total_items: number;
  total_price: number;
}

const WishlistAdmin: React.FC = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const response = await mainAxios.get('/wishlist/all');
      const wishlistsData = response.data.wishlists || [];
      setWishlists(wishlistsData);
    } catch (error) {
      console.error('Error fetching wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeWishlistItem = async (wishlistId: number, itemId: number) => {
    if (!window.confirm('Are you sure you want to remove this item from the wishlist?')) {
      return;
    }

    try {
      await mainAxios.delete(`/wishlist/delete/${itemId}`);
      // Update local state
      setWishlists(prev => prev.map(wishlist => 
        wishlist.id === wishlistId 
          ? {
              ...wishlist,
              items: wishlist.items.filter(item => item.id !== itemId),
              total_items: wishlist.total_items - (wishlist.items.find(item => item.id === itemId)?.quantity || 0),
              total_price: wishlist.total_price - (wishlist.items.find(item => item.id === itemId)?.total_item_price || 0)
            }
          : wishlist
      ));
    } catch (error) {
      console.error('Error removing wishlist item:', error);
      alert('Failed to remove wishlist item');
    }
  };

  const toggleWishlistStatus = async (wishlistId: number, currentStatus: boolean) => {
    try {
      await mainAxios.put(`/wishlist/toggle/${wishlistId}`, null, {
        params: { is_active: !currentStatus }
      });
      
      // Update local state
      setWishlists(prev => prev.map(wishlist => 
        wishlist.id === wishlistId 
          ? { ...wishlist, is_active: !currentStatus }
          : wishlist
      ));
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      alert('Failed to update wishlist status');
    }
  };

  const viewWishlistDetails = (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
    setShowDetailsModal(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWishlists = wishlists.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(wishlists.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading wishlists...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Wishlist Management</h2>
          <p className="text-gray-600 mt-1">
            Total {wishlists.length} wishlist{wishlists.length !== 1 ? 's' : ''} • {' '}
            {wishlists.reduce((sum, w) => sum + w.total_items, 0)} total items
          </p>
        </div>
        <button
          onClick={fetchWishlists}
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
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Wishlists</p>
              <p className="text-2xl font-bold text-blue-600">{wishlists.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Total Items</p>
              <p className="text-2xl font-bold text-green-600">
                {wishlists.reduce((sum, w) => sum + w.total_items, 0)}
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
                {formatCurrency(wishlists.reduce((sum, w) => sum + w.total_price, 0))}
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
                {new Set(wishlists.map(w => w.user_id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wishlist Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Info
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
            {currentWishlists.map((wishlist) => (
              <tr key={wishlist.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">ID: {wishlist.id}</p>
                    <p className="text-sm text-gray-600">{wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {wishlist.fname} {wishlist.lname}
                    </p>
                    <p className="text-sm text-gray-600">{wishlist.email}</p>
                    <p className="text-xs text-gray-500">UID: {wishlist.user_id}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {wishlist.total_items} items
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      {formatCurrency(wishlist.total_price)}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleWishlistStatus(wishlist.id, wishlist.is_active)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        wishlist.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {wishlist.is_active ? (
                        <ToggleRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-1" />
                      )}
                      {wishlist.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(wishlist.created_at)}
                </td>
                <td className="px-4 py-4 space-x-2">
                  <button
                    onClick={() => viewWishlistDetails(wishlist)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
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
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No wishlists found.</p>
        </div>
      )}

      {/* Wishlist Details Modal */}
      {showDetailsModal && selectedWishlist && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Wishlist Details - {selectedWishlist.fname} {selectedWishlist.lname}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name:</span> {selectedWishlist.fname} {selectedWishlist.lname}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedWishlist.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedWishlist.phone}</p>
                    <p><span className="text-gray-600">User ID:</span> {selectedWishlist.user_id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Wishlist Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Total Items:</span> {selectedWishlist.total_items}</p>
                    <p><span className="text-gray-600">Total Value:</span> {formatCurrency(selectedWishlist.total_price)}</p>
                    <p><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        selectedWishlist.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedWishlist.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p><span className="text-gray-600">Created:</span> {formatDate(selectedWishlist.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <h4 className="font-medium text-gray-900 mb-4">Wishlist Items ({selectedWishlist.items.length})</h4>
              <div className="space-y-4">
                {selectedWishlist.items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                          <span className="text-sm text-gray-500">ID: {item.product_id}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Price:</span>
                            <span className="ml-2 font-medium">{formatCurrency(item.price_at_time)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {formatCurrency(item.total_item_price)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Delivery:</span>
                            <span className="ml-2 font-medium">{item.delivery}</span>
                          </div>
                        </div>

                        {/* Colors */}
                        {item.wishlist_color && item.wishlist_color.length > 0 && (
                          <div className="mt-2">
                            <span className="text-gray-600 text-sm">Selected Colors:</span>
                            <div className="flex gap-1 mt-1">
                              {item.wishlist_color.map((color, index) => (
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
                        onClick={() => removeWishlistItem(selectedWishlist.id, item.id)}
                        className="ml-4 flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedWishlist.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items in this wishlist
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
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

export default WishlistAdmin;