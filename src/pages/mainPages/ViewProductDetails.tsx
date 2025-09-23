import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    ShoppingCart,
    Star,
    Plus,
    Minus,
    ChevronLeft,
    ChevronRight,
    Truck,
    Shield,
    RefreshCw,
    Check,
    Play,
    X,
    Award,
    Download,
} from 'lucide-react';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import Offers from '../../components/HomePage/body/Offers/OurOffers';
import Footer from '../../components/SharedComp/footer';
import { RWF } from '../../app/priceConver';
import { useProduct } from '../../hooks/product/useProduct';
import { cartApi } from '../../app/products/cart';
import { wishlistService } from '../../app/products/wishlistService';

const ProductViewPage: React.FC = () => {
    const { product, loading, error } = useProduct();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<any | null>(null);
    const [selecteddelivery, setselectedDelivery] = useState<any | null>("City Center → Free");
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [isHovering, setIsHovering] = useState(false);
    const [load, setLoading] = useState(false);
    const [erroring, seterroring] = useState(null);
    const [success, setesucess] = useState<string | null>(null);

    const handleAddToCart = async (id: any, quantity: any, color: any, delivery: any) => {
        console.log(color, delivery)
        try {
            setLoading(true);
            const response = await cartApi.addToCart(id, quantity, color, delivery);
            if (response.status == 200) {
                setesucess("cart created sucessfull")
                window.location.href ="/shopping-cart"
            }
            // you can also add toast/notification here
        } catch (error: any) {
            seterroring(error?.response?.data?.detail)
            console.error("Error adding to cart:", error?.response?.data?.detail);
        } finally {
            setLoading(false);
        }
    };
    const handleAddToWish = async (id: any, quantity?: any, color?: any, delivery?: any) => {
        console.log(color, delivery)
        try {
            setLoading(true);
            const response: any = await wishlistService.addToWishlist(id, quantity, color, delivery);
            // console.log(response)
            if (response.status == 200) {
                setIsWishlisted(isWishlisted)
                setesucess("wishList added sucessfull")
                window.location.href ="/wish-list"
            }
            // you can also add toast/notification here
        } catch (error: any) {
            seterroring(error?.response?.data?.detail)
            console.error("Error adding to cart:", error?.response?.data?.detail);
        } finally {
            setLoading(false);
        }
    };

    const shareRef = useRef<HTMLDivElement>(null);

    // Set default color once product is loaded
    useEffect(() => {
        if (product && product.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    // Handle quantity change
    const updateQuantity = (action: 'increase' | 'decrease') => {
        if (!product) return;

        if (action === 'increase' && quantity < (product.instock || 0)) {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Handle image navigation
    const navigateImage = (direction: 'next' | 'prev') => {
        if (!product || !product.images) return;

        if (direction === 'next') {
            setSelectedImageIndex(prev =>
                prev === product.images!.length - 1 ? 0 : prev + 1
            );
        } else {
            setSelectedImageIndex(prev =>
                prev === 0 ? product.images!.length - 1 : prev - 1
            );
        }
    };

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
                setShowShareMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Generate star rating
    const renderStars = (rating: number = 0) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : i < rating
                        ? 'fill-yellow-200 text-yellow-400'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    // Show loading state
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading product...</p>
                    </div>
                </div>
            </>
        );
    }

    // Show error state
    if (error || !product) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 text-lg">{error || 'Product not found'}</p>
                        <a href="/" className="text-primary hover:underline mt-4 inline-block">
                            Return to home
                        </a>
                    </div>
                </div>
            </>
        );
    }

    // Get the selected color object
    const selectedColorObj = product.colors?.find(color => color.name === selectedColor) || product.colors?.[0];

    return (
        <>
            <Navbar />
            {erroring && <div onClick={() => seterroring(null)} className="fixed flex gap-3 cursor-pointer top-60 right-20 shadow-xl bg-red-100 text-red-500 p-3 rounded-lg">
                {erroring}
                <X />
            </div>
            }
            {success && <div onClick={() => setesucess(null)} className="fixed flex gap-3 cursor-pointer top-60 right-20 shadow-xl bg-green-100 text-green-500 p-3 rounded-lg">
                {success}
                <X />
            </div>
            }
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl lg:max-w-full xl:max-w-9/12 mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex text-sm text-gray-600">
                            <a href="/" className="hover:text-blue-600">Home</a>
                            <span className="mx-2">/</span>
                            <a className="hover:text-blue-600">
                                {product.category?.name}
                            </a>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{product.title}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl lg:max-w-full xl:max-w-9/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <motion.div
                                className="relative bg-white rounded-xl shadow-sm overflow-hidden aspect-square"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <div className="relative w-full h-full">
                                    <img
                                        src={product.images?.[selectedImageIndex]?.url || ''}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                    />

                                    {/* Hover Image Overlay */}
                                    <AnimatePresence>
                                        {isHovering && product.hover_image && (
                                            <motion.img
                                                key="hover-image"
                                                src={product.hover_image}
                                                alt={`${product.title} hover view`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Navigation Arrows */}
                                {product.images && product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => navigateImage('prev')}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => navigateImage('next')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.is_new && (
                                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                                            NEW
                                        </span>
                                    )}
                                </div>

                                {/* Video Play Button */}
                                {product.tutorial_video && (
                                    <button
                                        onClick={() => setShowVideoModal(true)}
                                        className="absolute bottom-4 right-4 p-3 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <Play className="w-5 h-5" />
                                    </button>
                                )}
                            </motion.div>

                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImageIndex === index
                                                ? 'border-blue-500 scale-105'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${product.title} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Hover indicator */}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity hover:opacity-100"></div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Brand & Title */}
                            <div>
                                <p className="text-primary font-medium text-sm uppercase tracking-wide">
                                    {product.category?.name}
                                </p>
                                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                                    {product.title}
                                </h1>
                            </div>

                            {/* Rating & Reviews */}
                            <div className=" items-center gap-4 hidden">
                                <div className="flex items-center gap-1 ">
                                    {renderStars(product.rating)}
                                    <span className="text-sm text-gray-600 ml-1">
                                        {product.rating}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    ({product.reviews_count} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-gray-900">
                                    {product.price ? RWF.format(product.price) : 'Price not available'}
                                </span>
                                {product.original_price && (
                                    <span className="text-xl text-gray-500 line-through">
                                        {RWF.format(product.original_price)}
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${(product.instock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                <span className={`text-sm font-medium ${(product.instock || 0) > 0 ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                    {(product.instock || 0) > 0
                                        ? `${product.instock} in stock`
                                        : 'Out of stock'
                                    }
                                </span>
                            </div>

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                                        Color: {selectedColorObj?.name}
                                    </h3>
                                    <div className="flex gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${selectedColor?.name === color.name
                                                    ? 'border-primary scale-130'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity('decrease')}
                                            disabled={quantity <= 1}
                                            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity('increase')}
                                            disabled={quantity >= (product.instock || 0)}
                                            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        Max: {product.instock}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        handleAddToCart(product.id, quantity, selectedColor, selecteddelivery)
                                    }}
                                    disabled={load || (product.instock || 0) === 0}
                                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {load ? "Loading" : "Add to Cart"}
                                </button>

                                <button
                                    onClick={() => handleAddToWish(product.id, quantity, selectedColor, selecteddelivery)}
                                    className={`p-3 rounded-lg border transition-all duration-200 ${isWishlisted
                                        ? 'border-red-300 bg-red-50 text-red-600'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-600'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>

                                <div className="relative" ref={shareRef}>
                                    <button
                                        onClick={() => {
                                            const imageUrl = product.images?.[0]?.url || ''; // get the image URL with fallback
                                            const link = document.createElement("a");
                                            link.href = imageUrl;
                                            link.download = "Umukamezi-product-image.jpg"; // you can customize the filename
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                        className="p-3 rounded-lg border border-gray-300 hover:border-gray-400 text-gray-600 transition-colors"
                                    >
                                        <Download size={20} />
                                    </button>

                                    <AnimatePresence>
                                        {showShareMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border p-2 min-w-[200px] z-10"
                                            >
                                                {/* Share menu content */}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="sharethis-inline-share-buttons"></div>
                            {/* Delivery Info */}
                            <div className="border-t pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium">Delivery</p>
                                            <select onChange={(e) => setselectedDelivery(e.target.value)} className="text-gray-600 py-2 w-fit border-0 outline-0 cursor-pointer">
                                                <option value={"free"}>City Center → Free</option>
                                                <option value={2000}>In Kigali → 2,000 RFW</option>
                                                <option value={5000}>Out of Kigali → 5,000 RFW</option>
                                                <option value={0}>Outside Rwanda → Negotiable</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-medium">Warranty</p>
                                            <p className="text-gray-600">{product.warranty || '2 month'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-orange-600" />
                                        <div>
                                            <p className="font-medium">Returns</p>
                                            <p className="text-gray-600">{product.returnDay || '30 Days'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full transition-colors hover:bg-gray-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="mt-16">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8">
                                {['description', 'tutorial', 'features', 'condition', 'brock', 'warranty', 'delivery'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="py-8">
                            {activeTab === 'description' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="prose max-w-none"
                                >
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description}
                                    </p>
                                </motion.div>
                            )}

                            {activeTab === 'features' && product.features && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {product.features.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-3 bg-white w-fit px-3 cursor-pointer hover:bg-secondary/10 rounded-2xl">
                                                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="hover:text-gray-500">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                </motion.div>
                            )}

                            {activeTab === 'condition' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12"
                                >
                                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600">{product.is_new ? 'New Condition' : 'Used Condition'}</p>
                                </motion.div>
                            )}

                            {activeTab === 'tutorial' && product.tutorial_video && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="aspect-video w-full max-w-full"
                                >
                                    <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                                        <iframe
                                            src={product.tutorial_video}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Product Tutorial"
                                        ></iframe>
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === "brock" && (product.brock || "Umukamezi")}
                            {activeTab === "warranty" && (product.warranty || "2 month")}
                            {activeTab === "delivery" && (product.delivery_fee ? `${product.delivery_fee}` : "1 day")}
                        </div>
                    </div>
                </div>

                {/* Video Modal */}
                <AnimatePresence>
                    {showVideoModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                            onClick={() => setShowVideoModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white rounded-xl p-4 max-w-4xl w-full aspect-video relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowVideoModal(false)}
                                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                                    <iframe
                                        src={product.tutorial_video}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Product Tutorial"
                                    ></iframe>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
            <Offers />
            <Footer />
        </>
    );
};

export default ProductViewPage;