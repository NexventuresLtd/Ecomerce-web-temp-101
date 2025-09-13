import React, { useState, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, Star, ArrowLeft, ShoppingBag } from 'lucide-react';
import Footer from '../../components/SharedComp/footer';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';

import { productsData } from '../../constants/ProductsData/ProductData';
import { RWF } from '../../app/priceConver';
import { useNavigation } from '../../hooks/product/useNavigation';
import type { Product } from '../../types/Product/producttypeAdmin';

// Cart Item Interface
interface CartItem extends Product {
    quantity: number;
    deliveryFee: number; // Added deliveryFee to the interface
}

// Mock Cart Data
const cartData: CartItem[] = productsData.slice(0, 3).map(product => ({
    ...product,
    quantity: 1,
    selectedColor: product.colors?.[0] || { name: 'Default', hex: '#000000', stock: 0 },
    deliveryFee: 5.99 // Example delivery fee
}));

// Cart Actions
type CartAction =
    | { type: 'UPDATE_QUANTITY'; id: number; quantity: number } // Changed to number
    | { type: 'REMOVE_ITEM'; id: number } // Changed to number

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
    switch (action.type) {
        case 'UPDATE_QUANTITY':
            return state.map(item =>
                item.id === action.id ? { ...item, quantity: Math.max(0, action.quantity) } : item
            ).filter(item => item.quantity > 0);

        case 'REMOVE_ITEM':
            return state.filter(item => item.id !== action.id);

        default:
            return state;
    }
};

// CartItem Component
const CartItem: React.FC<{
    item: CartItem;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}> = ({ item, onUpdateQuantity, onRemove }) => {
    const [isHovered, setIsHovered] = useState(false);

    const primaryImage = item.images?.find(img => img.is_primary)?.url || item.images?.[0]?.url || '';
    const displayImage = isHovered && item.hover_image ? item.hover_image : primaryImage;
    const { navigateToProduct } = useNavigation();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg border border-gray-200 mb-4"
        >
            <div className="flex flex-col md:flex-row gap-4 cursor-pointer" >
                {/* Product Image */}
                <div
                    onClick={() => navigateToProduct(item.id.toString())}
                    className="relative w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img
                        src={displayImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-all duration-300"
                    />
                    {item.is_new && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            New
                        </span>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>

                            {/* Rating and Reviews */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm text-gray-700 ml-1">{item.rating || 0}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600">{item.reviews_count || 0} reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-2">
                                <span className="text-xl font-bold text-gray-900">
                                    {item.price ? RWF.format(item.price) : 'Price not available'}
                                </span>
                                {item.original_price && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {RWF.format(item.original_price)}
                                    </span>
                                )}
                                {item.discount && (
                                    <span className="text-sm text-green-600">-{item.discount}%</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                Stock: <span className={(item.instock || 0) > 10 ? "text-green-600" : "text-orange-600"}>
                                    {item.instock || 0} available
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Color Selection */}
                    {item.colors && item.colors.length > 0 && (
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Color:</label>
                            <div className="flex gap-2">
                                {item.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        className={`w-8 h-8 rounded-full border-2 border-gray-800
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity and Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Quantity:</label>
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                                <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                    disabled={item.quantity >= (item.instock || 0)}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => onRemove(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove item"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// CartSummary Component
const CartSummary: React.FC<{ items: CartItem[] }> = ({ items }) => {
    const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => {
        if (item.original_price && item.discount) {
            return sum + ((item.original_price - (item.price || 0)) * item.quantity);
        }
        return sum;
    }, 0);
    const deliveryFee = items.reduce((sum, item) => sum + item.deliveryFee, 0);
    const total = subtotal + deliveryFee;

    return (
        <div className="bg-white p-6 pt-20 rounded-lg border border-gray-200 sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-medium">{RWF.format(subtotal)}</span>
                </div>

                {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{RWF.format(totalDiscount)}</span>
                    </div>
                )}

                <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium">
                        {deliveryFee === 0 ? 'Free' : RWF.format(deliveryFee)}
                    </span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{RWF.format(total)}</span>
                </div>
            </div>

            <button className="w-full bg-primary cursor-pointer text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3">
                Proceed to Checkout
            </button>

            <button onClick={() => window.location.href = '/products'} className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
            </button>
        </div>
    );
};

// Main ShoppingCartPage Component
const ShoppingCartPage: React.FC = () => {
    const [cartItems, dispatch] = useReducer(cartReducer, cartData);

    const handleUpdateQuantity = (id: number, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
    };

    const handleRemoveItem = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', id });
    };


    // Empty State
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
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
                        <button onClick={() => window.location.href = '/products'} className="bg-primary cursor-pointer text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            Start Shopping
                        </button>
                    </motion.div>
                </div>
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
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}

                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary items={cartItems} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ShoppingCartPage;