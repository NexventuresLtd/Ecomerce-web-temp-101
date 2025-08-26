import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import {
    Camera,
    Computer,
    Headphones,
    Gamepad2,
    Tablet,
    Sun,
    Smartphone,
    Zap,
    Sparkles,
    TrendingUp,
    ArrowRight,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// TypeScript Interfaces
interface Category {
    id: number;
    name: string;
    description?: string;
    icon: React.ComponentType<any>;
    bgColor: string;
    textColor: string;
    hoverBg: string;
    link: string;
    badge?: {
        text: string;
        type: 'new' | 'trending' | 'hot';
        color: string;
    };
    stats?: {
        productCount: number;
        discount?: number;
    };
    bgImage?: string;
    overlayImage?: string;
}

interface CategorySectionProps {
    title?: string;
    subtitle?: string;
    viewMode?: 'grid' | 'carousel';
    showStats?: boolean;
    className?: string;
}

// Category Data with background and overlay images
const categoriesData: Category[] = [
    {
        id: 1,
        name: "Cameras",
        description: "Professional photography equipment",
        icon: Camera,
        bgColor: "bg-slate-900/70",
        textColor: "text-white",
        hoverBg: "hover:bg-slate-800",
        link: "#",
        badge: {
            text: "New",
            type: "new",
            color: "bg-green-500"
        },
        stats: {
            productCount: 1247,
            discount: 15
        },
        bgImage: "https://cdn.mos.cms.futurecdn.net/e6fe0b52a9313bb44ff751df4ec7ac39.jpg",
        overlayImage: "https://www.iphotography.com/wp-content/uploads/2023/06/Best-Cameras-for-Professional-Photography-6.jpg"
    },
    {
        id: 2,
        name: "Computers",
        description: "High-performance computing devices",
        icon: Computer,
        bgColor: "bg-blue-200/70",
        textColor: "text-blue-900",
        hoverBg: "hover:bg-blue-200",
        link: "#",
        badge: {
            text: "Trending",
            type: "trending",
            color: "bg-blue-500"
        },
        stats: {
            productCount: 2847,
            discount: 20
        },
        bgImage: "https://image.made-in-china.com/318f0j00IaRGcfzFVhki/6%E6%9C%8814%E6%97%A5%281%29.mp4.webp",
        overlayImage: "https://cdn.thewirecutter.com/wp-content/media/2024/11/cheapgaminglaptops-2048px-7981.jpg?auto=webp&quality=75&crop=1.91:1&width=1200"
    },
    {
        id: 3,
        name: "Pro Audio",
        description: "Professional audio equipment",
        icon: Headphones,
        bgColor: "bg-purple-200/70",
        textColor: "text-purple-900",
        hoverBg: "hover:bg-purple-200",
        link: "#",
        badge: {
            text: "Hot",
            type: "hot",
            color: "bg-red-500"
        },
        stats: {
            productCount: 856,
            discount: 10
        },
        bgImage: "https://www.yamaha.com/2/proaudio/images/main.jpg",
        overlayImage: "https://assets.proaudiotechnology.com/images/all_speakers2_alt_sm.png?crc=527762960"
    },
    {
        id: 4,
        name: "Pro Games",
        description: "Professional gaming gear",
        icon: Gamepad2,
        bgColor: "bg-indigo-200/70",
        textColor: "text-indigo-900",
        hoverBg: "hover:bg-indigo-200",
        link: "#",
        stats: {
            productCount: 1247
        },
        bgImage: "https://cdn.shopify.com/s/files/1/0401/9539/1653/files/SuperConsoleX2Pro-3systemin1.webp?v=1716435791",
        overlayImage: "https://www.kinhank-retrogame.com/cdn/shop/files/SuperConsoleX2Pro-main.webp?v=1716428705"
    },
    {
        id: 5,
        name: "Tablet",
        description: "Latest tablets and accessories",
        icon: Tablet,
        bgColor: "bg-amber-100/70",
        textColor: "text-amber-900",
        hoverBg: "hover:bg-amber-200",
        link: "#",
        badge: {
            text: "New",
            type: "new",
            color: "bg-green-500"
        },
        stats: {
            productCount: 987,
            discount: 25
        },
        bgImage: "https://cdn.mos.cms.futurecdn.net/BuGDmGGkiM3sqMP6i6FEXf.jpg",
        overlayImage: "https://cdn.thewirecutter.com/wp-content/media/2024/05/protablets-2048px-232431.jpg?auto=webp&quality=75&width=1024"
    },
    {
        id: 6,
        name: "Lighting",
        description: "Professional lighting equipment",
        icon: Sun,
        bgColor: "bg-yellow-100/70",
        textColor: "text-yellow-900",
        hoverBg: "hover:bg-yellow-200",
        link: "#",
        stats: {
            productCount: 567
        },
        bgImage: "https://mimolive.com/wp-content/uploads/2020/12/studio-lights.jpeg",
        overlayImage: "https://www.cirrolite.com/files/Gibraltar_The-Hub-2.jpg"
    },
    {
        id: 7,
        name: "Phone",
        description: "Latest smartphones and accessories",
        icon: Smartphone,
        bgColor: "bg-green-200/70",
        textColor: "text-green-900",
        hoverBg: "hover:bg-green-200",
        link: "#",
        badge: {
            text: "Hot",
            type: "hot",
            color: "bg-red-500"
        },
        stats: {
            productCount: 2109,
            discount: 30
        },
        bgImage: "https://www.theboardresults.in/wp-content/uploads/2022/08/iPhone-14-pro-max-Price.jpg",
        overlayImage: "https://images-na.ssl-images-amazon.com/images/I/618E1CfbObL._SL250_.jpg"
    },
    {
        id: 8,
        name: "Other Accessories",
        description: "Various tech accessories",
        icon: Zap,
        bgColor: "bg-gray-100/70",
        textColor: "text-gray-900",
        hoverBg: "hover:bg-gray-200",
        link: "#",
        badge: {
            text: "Trending",
            type: "trending",
            color: "bg-blue-500"
        },
        stats: {
            productCount: 3456
        },
        bgImage: "https://www.aaxatech.com/products/landing/images/workswith.jpg",
        overlayImage: "https://ae01.alicdn.com/kf/Sb89cd8fe90bc4d9cad768a72cf73cc49Y.jpg_640x640q90.jpg"
    }
];

// Badge Component
const CategoryBadge: React.FC<{ badge: Category['badge'] }> = ({ badge }) => {
    if (!badge) return null;

    const iconMap = {
        new: Sparkles,
        trending: TrendingUp,
        hot: Sparkles
    };

    const Icon = iconMap[badge.type];

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
            }}
            className={`absolute top-1 right-1 ${badge.color} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 whitespace-nowrap`}
        >
            <Icon className="w-3 h-3" />
            {badge.text}
        </motion.div>
    );
};

// Stats Component
const CategoryStats: React.FC<{ stats: Category['stats']; showStats: boolean }> = ({ stats, showStats }) => {
    if (!stats || !showStats) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-3 space-y-1"
        >
            <div className="text-xs opacity-75">
                {stats.productCount.toLocaleString()} products
            </div>
            {stats.discount && (
                <div className="text-xs font-semibold text-emerald-600">
                    Up to {stats.discount}% off
                </div>
            )}
        </motion.div>
    );
};

// Background Image Component
const CategoryBackground: React.FC<{
    bgImage?: string;
    bgColor: string;
    name: string;
}> = ({ bgImage, bgColor, name }) => {
    if (bgImage) {
        return (
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={bgImage}
                    alt={`${name} background`}
                    className="w-full h-full object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-40"
                />
                <div className={`absolute inset-0 ${bgColor} opacity-80`}></div>
            </div>
        );
    }

    return <div className={`absolute inset-0 ${bgColor} z-0`}></div>;
};

// Overlay Image Component
const CategoryOverlay: React.FC<{
    overlayImage?: string;
    name: string;
}> = ({ overlayImage, name }) => {
    if (!overlayImage) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-2 right-2 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        >
            <img
                src={overlayImage}
                alt={`${name} overlay`}
                className="w-24 h-24 object-contain"
            />
        </motion.div>
    );
};

// Category Card Component
const CategoryCard: React.FC<{
    category: Category;
    index: number;
    showStats: boolean;
    onClick: (category: Category) => void;
}> = ({ category, index, showStats, onClick }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: index * 0.1
            }
        }
    };

    const hoverVariants: Variants = {
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10
            }
        }
    };

    const iconVariants: Variants = {
        hover: {
            scale: 1.1,
            rotate: 5,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10
            }
        }
    };

    const Icon = category.icon;

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover="hover"
            className="relative group cursor-pointer h-full"
            onClick={() => onClick(category)}
        >
            <motion.div
                variants={hoverVariants}
                className={`
          relative overflow-hidden rounded-2xl p-6 transition-all duration-300 h-full
          ${category.hoverBg} ${category.textColor}
          border border-gray-200/50 group-hover:border-gray-300/50
          flex flex-col
        `}
            >
                {/* Background */}
                <CategoryBackground
                    bgImage={category.bgImage}
                    bgColor={category.bgColor}
                    name={category.name}
                />

                {/* Overlay Image */}
                <CategoryOverlay
                    overlayImage={category.overlayImage}
                    name={category.name}
                />

                <CategoryBadge badge={category.badge} />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4 flex-grow">
                    {/* Icon */}
                    <motion.div
                        variants={iconVariants}
                        className="relative"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Icon className="w-8 h-8" />
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-2 flex-grow flex flex-col justify-center">
                        <h3 className="text-xl font-bold group-hover:scale-105 transition-transform duration-200">
                            {category.name}
                        </h3>
                        {category.description && (
                            <p className="text-sm opacity-80 leading-relaxed">
                                {category.description}
                            </p>
                        )}
                        <CategoryStats stats={category.stats} showStats={showStats} />
                    </div>

                    {/* Arrow Icon */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="absolute bottom-4 right-4 text-current opacity-0 group-hover:opacity-60 transition-all duration-200"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Carousel Controls Component
const CarouselControls: React.FC<{
    onPrev: () => void;
    onNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
}> = ({ onPrev, onNext, canScrollPrev, canScrollNext }) => {
    return (
        <div className="flex gap-2 mt-8 justify-center">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPrev}
                disabled={!canScrollPrev}
                className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
          ${canScrollPrev
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
        `}
            >
                <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                disabled={!canScrollNext}
                className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
          ${canScrollNext
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
        `}
            >
                <ChevronRight className="w-5 h-5" />
            </motion.button>
        </div>
    );
};

// Section Header Component
const SectionHeader: React.FC<{
    title: string;
    subtitle: string;
}> = ({ title, subtitle }) => {
    const titleVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-12"
        >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {title}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {subtitle}
            </p>
        </motion.div>
    );
};

// Grid Layout Component
const GridLayout: React.FC<{
    categories: Category[];
    showStats: boolean;
    onCategoryClick: (category: Category) => void;
}> = ({ categories, showStats, onCategoryClick }) => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <div key={category.id} className="h-full">
                        <CategoryCard
                            category={category}
                            index={index}
                            showStats={showStats}
                            onClick={onCategoryClick}
                        />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// Carousel Layout Component
const CarouselLayout: React.FC<{
    categories: Category[];
    showStats: boolean;
    onCategoryClick: (category: Category) => void;
    itemsPerView: number;
    currentIndex: number;
    onPrev: () => void;
    onNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
}> = ({
    categories,
    showStats,
    onCategoryClick,
    itemsPerView,
    currentIndex,
    onPrev,
    onNext,
    canScrollPrev,
    canScrollNext
}) => {
        const containerVariants: Variants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3
                }
            }
        };

        const carouselRef = useRef<HTMLDivElement>(null);

        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="overflow-hidden" ref={carouselRef}>
                    <motion.div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
                        }}
                    >
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className="flex-shrink-0 px-3"
                                style={{ width: `${100 / itemsPerView}%` }}
                            >
                                <div className="h-full">
                                    <CategoryCard
                                        category={category}
                                        index={index}
                                        showStats={showStats}
                                        onClick={onCategoryClick}
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
                <CarouselControls
                    onPrev={onPrev}
                    onNext={onNext}
                    canScrollPrev={canScrollPrev}
                    canScrollNext={canScrollNext}
                />
            </motion.div>
        );
    };

// Main Category Section Component
const CategorySection: React.FC<CategorySectionProps> = ({
    title = "Shop by Category",
    subtitle = "Discover our wide range of products across different categories",
    viewMode = 'grid',
    showStats = true,
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);

    // Responsive items per view
    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1);
            } else if (window.innerWidth < 768) {
                setItemsPerView(2);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(3);
            } else {
                setItemsPerView(4);
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    const canScrollPrev = currentIndex > 0;
    const canScrollNext = currentIndex < categoriesData.length - itemsPerView;

    const handlePrevious = () => {
        if (canScrollPrev) {
            setCurrentIndex(prev => Math.max(0, prev - 1));
        }
    };

    const handleNext = () => {
        if (canScrollNext) {
            setCurrentIndex(prev => Math.min(categoriesData.length - itemsPerView, prev + 1));
        }
    };

    const handleCategoryClick = (category: Category) => {
        console.log('Navigating to:', category.link);
        // Here you would implement actual navigation
    };

    return (
        <section className={`py-16 px-4 bg-slate-50 ${className}`}>
            <div className="max-w-full md:max-w-11/12 mx-auto">
                <SectionHeader title={title} subtitle={subtitle} />

                {viewMode === 'grid' ? (
                    <GridLayout
                        categories={categoriesData}
                        showStats={showStats}
                        onCategoryClick={handleCategoryClick}
                    />
                ) : (
                    <CarouselLayout
                        categories={categoriesData}
                        showStats={showStats}
                        onCategoryClick={handleCategoryClick}
                        itemsPerView={itemsPerView}
                        currentIndex={currentIndex}
                        onPrev={handlePrevious}
                        onNext={handleNext}
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                )}
            </div>
        </section>
    );
};

export default CategorySection;