import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, Star, ArrowLeft, ShoppingBag, X, MessageCircle, Phone, CreditCardIcon } from 'lucide-react';
import Footer from '../../components/SharedComp/footer';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import { RWF } from '../../app/priceConver';
import { useNavigation } from '../../hooks/product/useNavigation';
import mainAxios from '../../Instance/mainAxios';


// Interfaces based on API response
interface CartItem {
    cart_item_id: number;
    product_id: number;
    product_name: string;
    product_image: { url: string; is_primary: boolean }[];
    current_price: number;
    price_at_time: number;
    quantity: number;
    item_total: number;
    in_stock: number;
    max_available: number;
    delivery_fee: string;
}

interface CartResponse {
    cart_id: number;
    user_id: number;
    items: CartItem[];
    total_items: number;
    total_price: number;
    cart_status: boolean;
    created_at: string;
}

// Payment method types
type PaymentMethod = 'momo' | 'card' | 'whatsapp';

// Custom alert component
const CustomAlert: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}> = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
        type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
            'bg-blue-100 border-blue-400 text-blue-700';

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 border ${bgColor} px-4 py-3 rounded shadow-md z-50 flex items-center justify-between max-w-md`}
        >
            <p>{message}</p>
            <button onClick={onClose} className="ml-4">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// Payment Method Modal
const PaymentMethodModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (method: PaymentMethod) => void;
    total: number;
}> = ({ isOpen, onClose, onSelect, total }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg max-w-md w-full p-6"
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h3>
                <p className="text-gray-600 mb-6">Total: {RWF.format(total)}</p>

                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => onSelect('momo')}
                        className="w-full p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
                        disabled
                    >
                        <div className="flex items-center justify-between">
                            <div className='flex gap-2'>
                                <Phone size={20} />
                                <span>Mobile Money (Momo)</span>
                            </div>
                            <span className="text-gray-400 text-sm">Coming soon</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onSelect('card')}
                        className="w-full p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
                        disabled
                    >
                        <div className="flex items-center justify-between">
                            <div className='flex gap-2'>
                                <CreditCardIcon size={20} />
                                <span>Credit/Debit Card</span>
                            </div>
                            <span className="text-gray-400 text-sm">Coming soon</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onSelect('whatsapp')}
                        className="w-full p-4 border border-green-300 rounded-lg text-left hover:bg-green-50 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png' className='aspect-square h-8' />
                            <span>WhatsApp</span>
                        </div>
                        <MessageCircle className="w-5 h-5 text-green-600" />
                    </button>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// CartItem Component
const CartItem: React.FC<{
    item: CartItem;
    onUpdateQuantity: (cartItemId: number, quantity: number) => void;
    onRemove: (cartItemId: number) => void;
}> = ({ item, onUpdateQuantity, onRemove }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { navigateToProduct } = useNavigation();

    const primaryImage = item.product_image?.find(img => img.is_primary)?.url ||
        item.product_image?.[0]?.url || '';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg border border-gray-200 mb-4"
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Product Image */}
                <div
                    onClick={() => navigateToProduct(item.product_id.toString())}
                    className="relative w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img
                        src={primaryImage}
                        alt={item.product_name}
                        className="w-full h-full object-cover transition-all duration-300"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product_name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Delivery: {item.delivery_fee}</p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-2">
                                <span className="text-xl font-bold text-gray-900">
                                    {RWF.format(item.current_price)}
                                </span>
                                {item.price_at_time !== item.current_price && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {RWF.format(item.price_at_time)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                Stock: <span className={item.in_stock > 10 ? "text-green-600" : "text-orange-600"}>
                                    {item.in_stock - item.quantity} available
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Quantity:</label>
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                                <button
                                    onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                    disabled={item.quantity >= item.max_available}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">
                                {RWF.format(item.item_total)}
                            </span>
                            <button
                                onClick={() => onRemove(item.cart_item_id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Remove item"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// CartSummary Component
const CartSummary: React.FC<{
    items: CartItem[];
    totalPrice: number;
    onCheckout: () => void;
    isLoading?: boolean;
}> = ({ items, totalPrice, onCheckout, isLoading = false }) => {
    return (
        <div className="bg-white p-6 pt-20 rounded-lg border border-gray-200 sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-600">Items ({items.length})</span>
                    <span className="font-medium">{RWF.format(totalPrice)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{RWF.format(totalPrice)}</span>
                </div>
            </div>

            <button
                onClick={onCheckout}
                disabled={isLoading || items.length === 0}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <button
                onClick={() => window.location.href = '/products'}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
            </button>
        </div>
    );
};

// Main ShoppingCartPage Component
const ShoppingCartPage: React.FC = () => {
    const [cartData, setCartData] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await mainAxios.get('/cart/my-cart');
            setCartData(response.data);
        } catch (error: any) {
            console.error('Error fetching cart:', error);
            if (error.response?.status === 404) {
                setCartData(null);
            } else {
                showAlert('Failed to load cart', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId: number, quantity: number) => {
        if (quantity < 1) return;

        try {
            setUpdating(true);
            await mainAxios.put(`/cart/update/${cartItemId}?quantity=${quantity}`);
            showAlert('Quantity updated successfully', 'success');
            fetchCart(); // Refresh cart data
        } catch (error: any) {
            console.error('Error updating quantity:', error);
            if (error.response?.status === 404) {
                showAlert('Item not found in cart', 'error');
            } else {
                showAlert('Failed to update quantity', 'error');
            }
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (cartItemId: number) => {
        try {
            setUpdating(true);
            await mainAxios.delete(`/cart/delete/${cartItemId}`);
            showAlert('Item removed from cart', 'success');
            fetchCart(); // Refresh cart data
        } catch (error: any) {
            console.error('Error removing item:', error);
            if (error.response?.status === 404) {
                showAlert('Item not found in cart', 'error');
            } else {
                showAlert('Failed to remove item', 'error');
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleCheckout = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSelect = (method: PaymentMethod) => {
        if (method === 'whatsapp') {
            // Redirect to WhatsApp with order details
            const message = `Hello! I would like to place an order. Order ID: ${cartData?.cart_id}, Total: ${RWF.format(cartData?.total_price || 0)}`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        }
        setShowPaymentModal(false);
    };

    const showAlert = (message: string, type: 'success' | 'error' | 'info') => {
        setAlert({ message, type });
    };

    const closeAlert = () => {
        setAlert(null);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty State or Cart not found
    if (!cartData || cartData.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
                        <p className="text-gray-600">Review your items and proceed to checkout</p>
                    </div>

                    {/* Empty State */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
                        <button
                            onClick={() => window.location.href = '/products'}
                            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </motion.div>
                </div>
                <Footer />
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={closeAlert} />}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
                    <p className="text-gray-600">Review your items and proceed to checkout</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <AnimatePresence>
                            {cartData.items.map((item) => (
                                <CartItem
                                    key={item.cart_item_id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeItem}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            items={cartData.items}
                            totalPrice={cartData.total_price}
                            onCheckout={handleCheckout}
                            isLoading={updating}
                        />
                    </div>
                </div>
            </div>
            <Footer />

            {/* Payment Method Modal */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handlePaymentSelect}
                total={cartData.total_price}
            />

            {/* Custom Alert */}
            {alert && <CustomAlert message={alert.message} type={alert.type} onClose={closeAlert} />}
        </div>
    );
};

export default ShoppingCartPage