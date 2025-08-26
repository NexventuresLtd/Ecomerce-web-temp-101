import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '../../../../types/Product/ProductType';
import { useNavigation } from '../../../../hooks/product/useNavigation';
import { productsData } from '../../../../constants/ProductsData/ProductData';




// ProductCard Component
interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
    const { navigateToProduct } = useNavigation();
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(product.images[0]?.image || '');

    const primaryImage = product.images.find(img => img.isprimary)?.image || product.images[0]?.image || '';
    const hoverImage = product.hoverImage || primaryImage;

    const handleProductClick = () => {
        navigateToProduct(product.id);
    };

    const getBgColorClasses = (bgColor?: string) => {
        switch (bgColor) {
            case 'bg-primary': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
            case 'bg-secondary': return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
            case 'bg-accent': return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
            case 'bg-third': return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
            default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
        }
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            viewport={{ once: true }}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            className={`group cursor-pointer hover:border-2 rounded-2xl overflow-hidden transition-all duration-300 ${getBgColorClasses(product.bgColor)}`}
            onClick={handleProductClick}
        >
            {/* Product Image */}
            <div className="relative overflow-hidden bg-white">
                {product.isNew && (
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white ${product.bgColor === 'bg-primary' ? 'bg-blue-500' :
                        product.bgColor === 'bg-secondary' ? 'bg-purple-500' :
                            product.bgColor === 'bg-accent' ? 'bg-emerald-500' :
                                product.bgColor === 'bg-third' ? 'bg-orange-500' : 'bg-primary'
                        }`}>
                        New
                    </div>
                )}
                {product.discount && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                        -{product.discount}%
                    </div>
                )}

                <img
                    src={currentImage}
                    alt={product.title}
                    className={`w-full h-64 object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={() => setImageLoaded(true)}
                    onMouseEnter={() => setCurrentImage(hoverImage)}
                    onMouseLeave={() => setCurrentImage(primaryImage)}
                />

                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
            </div>

            {/* Product Info */}
            <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={`${i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                        />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewsCount})
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {product.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.instock > 10
                        ? 'bg-green-100 text-green-600'
                        : product.instock > 0
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                        {product.instock > 10 ? 'In Stock' :
                            product.instock > 0 ? `Only ${product.instock} left` : 'Out of Stock'}
                    </span>
                </div>

                {/* CTA Button */}
                <button
                    className={`w-full px-4 py-3 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] ${product.bgColor === 'bg-primary' ? 'bg-blue-600 hover:bg-blue-700' :
                        product.bgColor === 'bg-secondary' ? 'bg-purple-600 hover:bg-purple-700' :
                            product.bgColor === 'bg-accent' ? 'bg-emerald-600 hover:bg-emerald-700' :
                                product.bgColor === 'bg-third' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-primary hover:bg-primary/80'
                        }`}
                    disabled={product.instock === 0}
                >
                    <ShoppingCart size={18} />
                    {product.instock === 0 ? 'Out of Stock' : 'Shop Now'}
                </button>
            </div>
        </motion.div>
    );
};

// Main LatestProducts Component
const LatestProducts: React.FC = () => {
    const { navigateToProducts } = useNavigation();

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-full md:max-w-11/12 mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 flex justify-between items-center"
                >
                    <div className='text-left'>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Latest Arrivals
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Check out our newest products carefully curated for quality and innovation
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={navigateToProducts}
                        className="px-8 py-3 text-third rounded-2xl font-semibold cursor-pointer transition-colors duration-300"
                    >
                        View All Products
                    </motion.button>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {productsData.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestProducts;