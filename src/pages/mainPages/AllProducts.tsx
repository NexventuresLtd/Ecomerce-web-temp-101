import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Star,
    Search,
    SlidersHorizontal,
    X,
    ShoppingCartIcon,
    Loader2,
    ChevronRight,
    Folder,
    FolderOpen
} from 'lucide-react';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import Footer from '../../components/SharedComp/footer';
import { RWF } from '../../app/priceConver';
import { useNavigation } from '../../hooks/product/useNavigation';
import { handleClickWhatsapp } from '../../app/ProductWhasapp';
import SkeletonLoader from '../../components/Skeltons/Product';
import type { Product } from '../../types/Product/producttypeAdmin';
import { productApi } from '../../app/products/allProductgeter';
import { useParams, useSearchParams } from 'react-router-dom';
import { decodeId } from '../../app/products/id_encrypter';
// import Suggestions from './Suggestions';
import { categoryApi } from '../../app/dashcategory/category';
import { isMainCategory, getMainCategoryId, mainCategoryIds } from '../../constants/NabarMain/navLinks';

// Filter Types
interface FilterState {
    main_categories: number[]; // Changed to number[] for category IDs
    sub_categories: number[];
    product_categories: number[];
    priceRange: [number, number];
    minRating: number;
    inStockOnly: boolean;
}

// Sort Types - Added 'oldest' option
type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'oldest' | 'rating' | 'featured';

// Category Types
interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent_id?: number;
    sub_categories?: Category[];
    product_categories?: Category[];
    type?: 'main' | 'sub' | 'product';
}

// Product Card Component
interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [showDescription, setShowDescription] = useState(false);
    const primaryImage = product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url || '';
    const { navigateToProduct } = useNavigation();

    return (
        <motion.div
            className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 group cursor-pointer"
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
            onClick={() => navigateToProduct(product.id.toString())}
        >
            <div className="relative overflow-hidden bg-white">
                <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${primaryImage}`}
                    alt={product.title}
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount !== 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                    </div>
                )}
                {product.is_new && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        NEW
                    </div>
                )}

                <AnimatePresence>
                    {showDescription && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 bg-opacity-70 flex flex-col items-center justify-center gap-3 p-4"
                        >
                            <p className="text-white text-lg text-center font-medium">
                                {product.title}
                            </p>
                            <p className="text-white text-sm text-center text-wrap line-clamp-2">
                                {product.description}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.title}
                </h3>

                <div className="flex items-center justify-between mb-4 w-full">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                            {product.price ? RWF.format(product.price) : 'Price not available'}
                        </span>
                        {product.original_price && (
                            <span className="text-sm text-gray-500 line-through">
                                {RWF.format(product.original_price)}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`${(product.instock || 0) < 1 ? 'bg-red-500' : 'bg-primary'} text-white px-3 py-1 rounded-full text-sm w-fit ml-auto mb-2 font-semibold`}>
                    {(product.instock || 0) < 1 ? 'Out of Stock' : `${product.instock} in Stock`}
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={(product.instock || 0) < 1}
                        onClick={() => navigateToProduct(product.id.toString())}
                        className={`${(product.instock || 0) < 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} w-full bg-yellow-500 text-xs text-white font-semibold rounded-lg px-3 py-3 transition-colors duration-300 flex items-center justify-center gap-2`}>
                        <ShoppingCartIcon size={18} />
                        Shop Now
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 px-3 rounded-lg text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 bg-teal-600 hover:bg-primary/90 cursor-pointer
                  `}
                        onClick={() =>
                            handleClickWhatsapp(
                                '',
                                '',
                                `*🛒 Product Inquiry*
     
     ━━━━━━━━━━━━━━━━━━━
     👋 *Hello,*  
     I'm interested in one of your products listed on your store. Please find the details below 👇  
     
     📦 *Product:* ${product.title}
     💰 *Price:* ${product.price ? RWF.format(product.price) + ' RWF' : 'Not available'}
     📝 *Description:* ${product.description ? product.description.slice(0, 120) + '...' : 'No description provided.'}
     🔗 *View Product:* ${import.meta.env.VITE_API_BASE_URL}/products/share/product/${product.id}
     
     ━━━━━━━━━━━━━━━━━━━
     📩 *Kindly get back to me with more details or availability.*
     Thank you! 🙏`
                            )
                        }
                    >
                        <>
                            <ShoppingCartIcon size={18} />
                            Whatsapp
                        </>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Sort Dropdown Component - Updated with oldest option
interface SortDropdownProps {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'featured', label: 'Featured' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' }
    ];

    const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Newest First';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-400 transition-colors"
            >
                <span className="text-sm font-medium text-gray-700">Sort by: {currentLabel}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-full z-20"
                    >
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onSortChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentSort === option.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Fixed Price Range Slider Component with Working Dragging
interface PriceRangeSliderProps {
    priceRange: [number, number];
    onPriceRangeChange: (range: [number, number]) => void;
    maxPrice: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
    priceRange,
    onPriceRangeChange,
    maxPrice
}) => {
    const [localRange, setLocalRange] = useState<[number, number]>(priceRange);
    const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const rangeRef = useRef<[number, number]>(priceRange);

    // Keep ref in sync
    useEffect(() => {
        rangeRef.current = localRange;
    }, [localRange]);

    // Sync with parent when priceRange prop changes
    useEffect(() => {
        setLocalRange(priceRange as [number, number]);
    }, [priceRange]);

    // Update parent filter whenever localRange changes
    useEffect(() => {
        if (localRange[0] !== priceRange[0] || localRange[1] !== priceRange[1]) {
            const timeoutId = setTimeout(() => {
                onPriceRangeChange(localRange);
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [localRange, priceRange, onPriceRangeChange]);

    // === DRAG LOGIC ===
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !activeThumb || !sliderRef.current) return;

        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        const percentage = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const newValue = Math.round(percentage * maxPrice);
        const currentRange = rangeRef.current;

        let newRange: [number, number];
        if (activeThumb === 'min') {
            const minValue = Math.min(newValue, currentRange[1] - 1000);
            newRange = [Math.max(0, minValue), currentRange[1]];
        } else {
            const maxValue = Math.max(newValue, currentRange[0] + 1000);
            newRange = [currentRange[0], Math.min(maxPrice, maxValue)];
        }

        setLocalRange(newRange as [number, number]);
    }, [isDragging, activeThumb, maxPrice]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setActiveThumb(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveThumb(thumb);
        setIsDragging(true);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    // === TRACK CLICK & HOVER ===
    const handleTrackClick = (e: React.MouseEvent) => {
        if (!sliderRef.current || isDragging) return;

        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        const percentage = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const clickedValue = Math.round(percentage * maxPrice);
        const [minVal, maxVal] = localRange;

        const newRange = Math.abs(clickedValue - minVal) < Math.abs(clickedValue - maxVal)
            ? [Math.min(clickedValue, maxVal - 1000), maxVal]
            : [minVal, Math.max(clickedValue, minVal + 1000)];

        setLocalRange(newRange as [number, number]);
    };

    const handleMouseMoveOnTrack = (e: React.MouseEvent) => {
        if (!sliderRef.current || isDragging) return;

        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        const percentage = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const hoverPrice = Math.round(percentage * maxPrice);
        setHoverValue(hoverPrice);
    };

    const handleMouseLeave = () => {
        setHoverValue(null);
    };

    // Input handlers
    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= 0 && value <= localRange[1] - 1000) {
            const newRange: [number, number] = [value, localRange[1]];
            setLocalRange(newRange as [number, number]);
        }
    };

    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= localRange[0] + 1000 && value <= maxPrice) {
            const newRange: [number, number] = [localRange[0], value];
            setLocalRange(newRange as [number, number]);
        }
    };

    // Quick selection buttons
    const quickRanges = [
        { label: "Under 10k", range: [0, 10000] as [number, number] },
        { label: "10k - 50k", range: [10000, 50000] as [number, number] },
        { label: "50k - 100k", range: [50000, 100000] as [number, number] },
        { label: "100k - 500k", range: [100000, 500000] as [number, number] },
        { label: "500k+", range: [500000, maxPrice] as [number, number] },
    ];

    const handleQuickRangeSelect = (range: [number, number]) => {
        setLocalRange(range as [number, number]);
    };

    const minPercentage = (localRange[0] / maxPrice) * 100;
    const maxPercentage = (localRange[1] / maxPrice) * 100;
    const hoverPercentage = hoverValue ? (hoverValue / maxPrice) * 100 : null;

    return (
        <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>

            {/* Quick Selection Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
                {quickRanges.map((quickRange, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuickRangeSelect(quickRange.range)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${localRange[0] === quickRange.range[0] && localRange[1] === quickRange.range[1]
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        {quickRange.label}
                    </button>
                ))}
            </div>

            {/* Price Inputs */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RWF</span>
                        <input
                            type="number"
                            value={localRange[0]}
                            onChange={handleMinInputChange}
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max={localRange[1] - 1000}
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RWF</span>
                        <input
                            type="number"
                            value={localRange[1]}
                            onChange={handleMaxInputChange}
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min={localRange[0] + 1000}
                            max={maxPrice}
                        />
                    </div>
                </div>
            </div>

            {/* Dual Range Slider with Working Dragging */}
            <div className="relative py-6">
                {/* Hover Tooltip */}
                {hoverValue !== null && !isDragging && (
                    <div
                        className="absolute bottom-full mb-2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none z-30 transition-all duration-150"
                        style={{
                            left: `${hoverPercentage}%`,
                        }}
                    >
                        {RWF.format(hoverValue)}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                )}

                {/* Slider Track Container */}
                <div
                    ref={sliderRef}
                    className="relative h-2 bg-gray-300 rounded-full cursor-pointer"
                    onMouseMove={handleMouseMoveOnTrack}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleTrackClick}
                >
                    {/* Selected Range */}
                    <div
                        className="absolute h-2 bg-blue-600 rounded-full"
                        style={{
                            left: `${minPercentage}%`,
                            width: `${maxPercentage - minPercentage}%`
                        }}
                    />

                    {/* Min Thumb - DRAGGABLE */}
                    <div
                        className={`absolute top-1/2 w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg transform -translate-y-1/2 cursor-grab active:cursor-grabbing transition-all ${activeThumb === 'min' ? 'scale-125 ring-4 ring-blue-200 z-30' : 'hover:scale-110 z-20'
                            }`}
                        style={{
                            left: `${minPercentage}%`,
                        }}
                        onMouseDown={handleMouseDown('min')}
                    />

                    {/* Max Thumb - DRAGGABLE */}
                    <div
                        className={`absolute top-1/2 w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg transform -translate-y-1/2 cursor-grab active:cursor-grabbing transition-all ${activeThumb === 'max' ? 'scale-125 ring-4 ring-blue-200 z-30' : 'hover:scale-110 z-20'
                            }`}
                        style={{
                            left: `${maxPercentage}%`,
                        }}
                        onMouseDown={handleMouseDown('max')}
                    />

                    {/* Active Thumb Tooltip */}
                    {isDragging && activeThumb && (
                        <div
                            className="absolute bottom-full mb-3 transform -translate-x-1/2 bg-blue-600 text-white text-sm py-1 px-3 rounded-lg pointer-events-none z-40 font-semibold shadow-lg"
                            style={{
                                left: activeThumb === 'min' ? `${minPercentage}%` : `${maxPercentage}%`
                            }}
                        >
                            {RWF.format(activeThumb === 'min' ? localRange[0] : localRange[1])}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-blue-600"></div>
                        </div>
                    )}
                </div>

                {/* Price Labels */}
                <div className="flex justify-between text-sm text-gray-600 mt-4">
                    <span>{"-->"}{RWF.format(localRange[0])} </span>
                    <span>{"<--"} {RWF.format(maxPrice)}</span>
                </div>
            </div>

            {/* Selected Range Display */}
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">
                    <strong>Active Filter:</strong> RWF {RWF.format(localRange[0])} - RWF {RWF.format(localRange[1])}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                    Products will update automatically as you adjust the range
                </p>
            </div>

            {/* Clear Filter Button */}
            {(localRange[0] > 0 || localRange[1] < maxPrice) && (
                <button
                    onClick={() => {
                        const defaultRange: [number, number] = [0, maxPrice];
                        setLocalRange(defaultRange as [number, number]);
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                    Clear Price Filter
                </button>
            )}

            {/* Instructions */}
            <div className="text-xs text-gray-500 text-center">
                💡 <strong>Drag the blue handles</strong> to adjust prices • Click anywhere on the track to jump • Use inputs for precise control
            </div>
        </div>
    );
};

// Category Item Component
interface CategoryItemProps {
    category: Category;
    level: number;
    selectedCategories: FilterState;
    onCategorySelect: (categoryId: number, categoryType: 'main' | 'sub' | 'product') => void;
    expandedCategories: number[];
    onToggleExpand: (categoryId: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    level,
    selectedCategories,
    onCategorySelect,
    expandedCategories,
    onToggleExpand
}) => {
    const hasChildren = (category.sub_categories && category.sub_categories.length > 0) ||
        (category.product_categories && category.product_categories.length > 0);
    const isExpanded = expandedCategories.includes(category.id);

    // Determine category type based on level and structure
    const getCategoryType = (): 'main' | 'sub' | 'product' => {
        if (level === 0) return 'main';
        if (category.product_categories && category.product_categories.length > 0) return 'sub';
        return 'product';
    };

    const categoryType = getCategoryType();
    const isSelected = selectedCategories.main_categories.includes(category.id) ||
        selectedCategories.sub_categories.includes(category.id) ||
        selectedCategories.product_categories.includes(category.id);

    const paddingLeft = `${level * 16}px`;

    const handleToggle = () => {
        if (hasChildren) {
            onToggleExpand(category.id);
        }
    };

    const handleSelect = () => {
        onCategorySelect(category.id, categoryType);
    };

    return (
        <div className="select-none">
            <div
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ paddingLeft }}
            >
                {/* Expand/Collapse Button */}
                {hasChildren && (
                    <button
                        onClick={handleToggle}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        <ChevronRight
                            size={14}
                            className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    </button>
                )}

                {/* Folder Icon for categories with children */}
                {hasChildren && (
                    isExpanded ?
                        <FolderOpen size={16} className="text-blue-600 flex-shrink-0" /> :
                        <Folder size={16} className="text-gray-500 flex-shrink-0" />
                )}

                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleSelect}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                />

                {/* Category Name with Type Badge */}
                <div className="flex items-center gap-2 flex-1">
                    <span
                        className={`text-sm truncate ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                        onClick={handleSelect}
                    >
                        {category.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryType === 'main' ? 'bg-purple-100 text-purple-800' :
                        categoryType === 'sub' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {categoryType}
                    </span>
                </div>
            </div>

            {/* Child Categories */}
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Sub Categories */}
                        {category.sub_categories?.map((subCategory) => (
                            <CategoryItem
                                key={subCategory.id}
                                category={subCategory}
                                level={level + 1}
                                selectedCategories={selectedCategories}
                                onCategorySelect={onCategorySelect}
                                expandedCategories={expandedCategories}
                                onToggleExpand={onToggleExpand}
                            />
                        ))}

                        {/* Product Categories */}
                        {category.product_categories?.map((productCategory) => (
                            <CategoryItem
                                key={productCategory.id}
                                category={productCategory}
                                level={level + 1}
                                selectedCategories={selectedCategories}
                                onCategorySelect={onCategorySelect}
                                expandedCategories={expandedCategories}
                                onToggleExpand={onToggleExpand}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Filter Sidebar Component
interface FilterSidebarProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    categoriesLoading: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    onFiltersChange,
    isOpen,
    onClose,
    categories,
    categoriesLoading
}) => {
    const maxPrice = 100000000;
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const updateFilters = (key: keyof FilterState, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const handleCategorySelect = (categoryId: number, categoryType: 'main' | 'sub' | 'product') => {
        const key = `${categoryType}_categories` as keyof FilterState;
        const currentArray = filters[key] as any[];

        const updated = currentArray.includes(categoryId)
            ? currentArray.filter(id => id !== categoryId)
            : [...currentArray, categoryId];

        updateFilters(key, updated);
    };

    const handlePriceRangeChange = (range: [number, number]) => {
        updateFilters('priceRange', range);
    };

    const handleToggleExpand = (categoryId: number) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const sidebarContent = (
        <div className="space-y-6">
            <div className="flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Categories */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                    {categoriesLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    )}
                </div>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                    {categoriesLoading ? (
                        <div className="space-y-2">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="ml-2 h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                                </div>
                            ))}
                        </div>
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                level={0}
                                selectedCategories={filters}
                                onCategorySelect={handleCategorySelect}
                                expandedCategories={expandedCategories}
                                onToggleExpand={handleToggleExpand}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No categories available</p>
                    )}
                </div>

                {/* Selected Categories Summary */}
                {(filters.main_categories.length > 0 || filters.sub_categories.length > 0 || filters.product_categories.length > 0) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Selected Categories:</h4>
                        <div className="space-y-1">
                            {filters.main_categories.length > 0 && (
                                <div className="text-xs text-blue-700">
                                    Main: {filters.main_categories.length} selected
                                </div>
                            )}
                            {filters.sub_categories.length > 0 && (
                                <div className="text-xs text-green-700">
                                    Sub: {filters.sub_categories.length} selected
                                </div>
                            )}
                            {filters.product_categories.length > 0 && (
                                <div className="text-xs text-blue-700">
                                    Product: {filters.product_categories.length} selected
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Price Range Slider */}
            <PriceRangeSlider
                priceRange={filters.priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                maxPrice={maxPrice}
            />

            {/* Rating */}
            <div className='hidden'>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.minRating === rating}
                                onChange={() => updateFilters('minRating', rating)}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-2 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                                <span className="ml-1 text-sm text-gray-700">& up</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={filters.inStockOnly}
                        onChange={(e) => updateFilters('inStockOnly', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">In stock only</span>
                </label>
            </div>

            {/* Clear Filters */}
            <button
                onClick={() => {
                    onFiltersChange({
                        main_categories: [],
                        sub_categories: [],
                        product_categories: [],
                        priceRange: [0, maxPrice],
                        minRating: 0,
                        inStockOnly: false
                    });
                    setExpandedCategories([]);
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
                Clear All Filters
            </button>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={onClose}
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            className="lg:hidden fixed left-0 top-0 w-80 h-full bg-white z-50 p-6 overflow-y-auto"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// Load More Button Component
interface LoadMoreButtonProps {
    isLoading: boolean;
    hasMore: boolean;
    onClick: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ isLoading, hasMore, onClick }) => {
    if (!hasMore) return null;

    return (
        <div className="text-center mt-8">
            <button
                onClick={onClick}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-2xl px-8 py-3 transition-colors duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Loading...' : 'Load More Products'}
            </button>
        </div>
    );
};

// Search API function
const searchProducts = async (query: string, skip: number = 0, limit: number = 100) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
        );

        if (!response.ok) {
            throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        return {
            products: data.products || [],
            total_count: data.total_results || 0,
            corrected_query: data.corrected_query,
            suggestions: data.suggestions || []
        };
    } catch (error) {
        console.error('Search API error:', error);
        throw error;
    }
};

// Main All Products Page Component
const AllProductsPage: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [skip, setSkip] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
    const [correctedQuery, setCorrectedQuery] = useState<string>('');
    const limit: number = 100;
    console.log(searchSuggestions, error)

    // Default state: no filters, newest first sorting
    const [filters, setFilters] = useState<FilterState>({
        main_categories: [], // Now stores category IDs as numbers
        sub_categories: [],
        product_categories: [],
        priceRange: [0, 100000000],
        minRating: 0,
        inStockOnly: false
    });

    const [currentSort, setCurrentSort] = useState<SortOption>('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Get URL parameters
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const params = useParams(); // Get all route parameters

    // Debug: Check what parameters are available
    console.log('🔍 All route parameters:', params);
    console.log('🔍 Search params:', {
        category: searchParams.get('category'),
        search: searchParams.get('search')
    });

    // Extract search query from route parameters
    const searchQueryFromRoute = params.query || params.search || params.term || params.q || '';

    // Handle search parameter from route - COMPREHENSIVE FIX
    useEffect(() => {
        console.log('🔍 Route parameters analysis:', {
            allParams: params,
            extractedQuery: searchQueryFromRoute,
            currentSearchState: searchQuery
        });

        if (searchQueryFromRoute && searchQueryFromRoute.trim()) {
            console.log('🎯 Setting search query from URL route:', searchQueryFromRoute);
            setSearchQuery(searchQueryFromRoute);
        }
    }, [searchQueryFromRoute]);

    // Also handle initial load to ensure search is triggered
    useEffect(() => {
        if (searchQuery && searchQuery.trim()) {
            console.log('🚀 Initial search query detected, should trigger search:', searchQuery);
            // The searchQuery change will automatically trigger loadProducts via the useEffect dependency
        }
    }, [searchQuery]);

    // Handle category parameter from query string - FIXED: ONLY SELECT DEEPEST CATEGORY
    useEffect(() => {
        if (categoryParam) {
            console.log('Category query parameter:', categoryParam);

            // Check if it's a main category name from navigation
            if (isMainCategory(categoryParam)) {
                console.log('Found main category name:', categoryParam);

                const categoryId = getMainCategoryId(categoryParam);
                if (categoryId) {
                    const newFilters: FilterState = {
                        main_categories: [categoryId], // Store the category ID for main categories
                        sub_categories: [],
                        product_categories: [],
                        priceRange: [0, 100000000],
                        minRating: 0,
                        inStockOnly: false
                    };

                    console.log('Setting filters from main category name:', newFilters);
                    setFilters(newFilters);
                }
            } else {
                // Handle encoded category path (e.g., http://127.0.0.1:5173/products?category=2w92Pv1B/KMvD0v1j/3nvZX90b)
                console.log('Treating as encoded category path');
                const pathSegments = categoryParam.split('/');
                console.log('Category path segments:', pathSegments);

                const decodedSegments = pathSegments.map(segment => {
                    try {
                        return decodeId(segment);
                    } catch (error) {
                        console.warn('Failed to decode segment:', segment, error);
                        return segment;
                    }
                });

                console.log('Decoded category segments:', decodedSegments);

                const newFilters: FilterState = {
                    main_categories: [],
                    sub_categories: [],
                    product_categories: [],
                    priceRange: [0, 100000000],
                    minRating: 0,
                    inStockOnly: false
                };

                // FIXED LOGIC: Only select the deepest category level
                if (decodedSegments.length >= 3) {
                    // If we have 3 segments (main/sub/product), select ONLY the product category
                    const productCategoryId = Number(decodedSegments[2]);
                    if (!isNaN(productCategoryId)) {
                        newFilters.product_categories = [productCategoryId];
                        console.log(`Selecting ONLY product category: ${productCategoryId}`);
                    }
                } else if (decodedSegments.length === 2) {
                    // If we have 2 segments (main/sub), select ONLY the sub category
                    const subCategoryId = Number(decodedSegments[1]);
                    if (!isNaN(subCategoryId)) {
                        newFilters.sub_categories = [subCategoryId];
                        console.log(`Selecting ONLY sub category: ${subCategoryId}`);
                    }
                } else if (decodedSegments.length === 1) {
                    // If we have 1 segment, it's a main category - select ONLY the main category
                    const mainCategoryId = Number(decodedSegments[0]);
                    if (!isNaN(mainCategoryId)) {
                        // Check if this ID corresponds to a main category in our mapping
                        const isMainCat = mainCategoryIds.includes(mainCategoryId);

                        if (isMainCat) {
                            // It's a main category - use the ID directly
                            newFilters.main_categories = [mainCategoryId];
                            console.log(`Selecting ONLY main category ID directly: ${mainCategoryId}`);
                        } else {
                            // It's another type of category - use the mapping logic
                            const mappedId = mainCategoryIds[mainCategoryId - 1];
                            if (mappedId) {
                                newFilters.main_categories = [mappedId];
                                console.log(`Mapped category ID ${mainCategoryId} to main category ID: ${mappedId}`);
                            } else {
                                newFilters.main_categories = [mainCategoryId];
                                console.log(`Selecting ONLY category ID directly (no mapping available): ${mainCategoryId}`);
                            }
                        }
                    }
                }

                console.log('Setting filters from category path (deepest level only):', newFilters);
                setFilters(newFilters);
            }
        }
    }, [categoryParam, categories]);

    // Load categories from API with proper hierarchy
    const loadCategories = useCallback(async (): Promise<void> => {
        try {
            setCategoriesLoading(true);

            const hierarchy = await categoryApi.getFullHierarchy();

            if (hierarchy && hierarchy.length > 0) {
                setCategories(hierarchy);
            } else {
                const mainCategories = await categoryApi.getMainCategories();

                if (mainCategories && mainCategories.length > 0) {
                    const hierarchy: Category[] = [];

                    for (const mainCat of mainCategories) {
                        const subCategories = await categoryApi.getSubCategories();
                        const filteredSubs = subCategories.filter((sub: any) => sub.main_category_id === mainCat.id);

                        const mainCategoryWithSubs: Category = {
                            ...mainCat,
                            sub_categories: []
                        };

                        for (const subCat of filteredSubs) {
                            const productCategories = await categoryApi.getProductCategories();
                            const filteredProducts = productCategories.filter((prod: any) => prod.sub_category_id === subCat.id);

                            mainCategoryWithSubs.sub_categories!.push({
                                ...subCat,
                                product_categories: filteredProducts
                            });
                        }

                        hierarchy.push(mainCategoryWithSubs);
                    }

                    setCategories(hierarchy);
                } else {
                    setCategories([]);
                }
            }
        } catch (err: any) {
            console.error("Failed to load categories:", err);
            setCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    }, []);

    // Load products from API - FIXED for proper sorting and category filtering
    const loadProducts = useCallback(async (loadMore: boolean = false): Promise<void> => {
        try {
            const currentSkip = loadMore ? skip : 0;

            if (loadMore) {
                setLoadingMore(true);
            } else {
                setInitialLoading(true);
                setSkip(0);
            }

            let response;

            // Use search endpoint if search query exists
            if (searchQuery.trim()) {
                console.log('Using search endpoint for query:', searchQuery);
                response = await searchProducts(searchQuery, currentSkip, limit);
                setSearchSuggestions(response.suggestions || []);
                setCorrectedQuery(response.corrected_query || '');
            } else {
                // Use regular products endpoint with filters
                const params: Record<string, any> = {
                    skip: currentSkip.toString(),
                    limit: limit.toString(),
                };

                // Add sorting - INCLUDES OLDEST OPTION
                if (currentSort === 'newest') {
                    params.sort_by = 'created_at';
                    params.sort_order = 'desc';
                } else if (currentSort === 'oldest') {
                    params.sort_by = 'created_at';
                    params.sort_order = 'asc';
                } else if (currentSort === 'price-asc') {
                    params.sort_by = 'price';
                    params.sort_order = 'asc';
                } else if (currentSort === 'price-desc') {
                    params.sort_by = 'price';
                    params.sort_order = 'desc';
                } else if (currentSort === 'rating') {
                    params.sort_by = 'rating';
                    params.sort_order = 'desc';
                } else if (currentSort === 'featured') {
                    params.sort_by = 'is_featured';
                    params.sort_order = 'desc';
                }

                // Add category hierarchy filters - ONLY THE DEEPEST CATEGORY LEVEL
                if (filters.product_categories.length > 0) {
                    // If product categories are selected, only filter by product categories
                    params.product_category_id = filters.product_categories;
                    console.log('Filtering by ONLY product categories:', filters.product_categories);
                } else if (filters.sub_categories.length > 0) {
                    // If sub categories are selected (but no product categories), only filter by sub categories
                    params.sub_category_id = filters.sub_categories;
                    console.log('Filtering by ONLY sub categories:', filters.sub_categories);
                } else if (filters.main_categories.length > 0) {
                    // If only main categories are selected, filter by main categories
                    params.main_category_id = filters.main_categories;
                    console.log('Filtering by ONLY main categories:', filters.main_categories);
                }

                // Add price range filter
                if (filters.priceRange[1] < 100000000 || filters.priceRange[0] > 0) {
                    params.price_min = filters.priceRange[0].toString();
                    params.price_max = filters.priceRange[1].toString();
                }

                // Add in-stock filter
                if (filters.inStockOnly) {
                    params.instock_min = '1';
                }

                // Add rating filter
                if (filters.minRating > 0) {
                    params.rating_min = filters.minRating.toString();
                }

                console.log('API Request Params with deepest category filtering:', params);
                response = await productApi.getProducts(currentSkip, limit, params);
            }

            const newProducts: Product[] = response.products || [];
            const total = response.total_count || 0;

            console.log('API Response with deepest category selection:', {
                productsCount: newProducts.length,
                totalCount: total,
                hasMore: newProducts.length === limit,
                currentSkip,
                isSearch: !!searchQuery.trim(),
                categoryParam,
                filtersApplied: {
                    main: filters.main_categories,
                    sub: filters.sub_categories.length,
                    product: filters.product_categories.length,
                    priceRange: filters.priceRange
                }
            });

            setAllProducts(prev => {
                if (!loadMore) {
                    return newProducts;
                }

                // Merge and remove duplicates
                const existingIds = new Set(prev.map(p => p.id));
                const filteredNew = newProducts.filter(p => !existingIds.has(p.id));
                return [...prev, ...filteredNew];
            });

            setTotalCount(total);
            setSkip(currentSkip + limit);
            setHasMore(newProducts.length === limit);

        } catch (err: any) {
            setError(err.message || "Failed to fetch products");
            console.error('API Error:', err);
        } finally {
            setInitialLoading(false);
            setLoadingMore(false);
        }
    }, [skip, limit, filters, currentSort, searchQuery, categoryParam]);

    // Initial data load
    useEffect(() => {
        const initializeData = async () => {
            await loadCategories();
            await loadProducts(false);
        };

        initializeData();
    }, []);

    // Reload products when filters, sort, or search change
    useEffect(() => {
        console.log('Filters changed, reloading products:', filters);
        setAllProducts([]);
        setHasMore(true);
        loadProducts(false);
    }, [filters, currentSort, searchQuery]);

    // Load more products
    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        await loadProducts(true);
    }, [loadingMore, hasMore, loadProducts]);

    // Filter and sort products (client-side fallback) - INCLUDES OLDEST SORTING
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...allProducts];

        // Apply client-side filtering as fallback
        if (filters.priceRange[1] < 100000000 || filters.priceRange[0] > 0) {
            filtered = filtered.filter(product => {
                const productPrice = product.price || 0;
                return productPrice >= filters.priceRange[0] && productPrice <= filters.priceRange[1];
            });
        }

        if (filters.minRating > 0) {
            filtered = filtered.filter(product =>
                (product.rating || 0) >= filters.minRating
            );
        }

        if (filters.inStockOnly) {
            filtered = filtered.filter(product =>
                (product.instock || 0) > 0
            );
        }

        // Apply sorting - INCLUDES OLDEST OPTION
        switch (currentSort) {
            case 'price-asc':
                filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'featured':
                filtered.sort((a, b) => {
                    if (a.is_featured !== b.is_featured) {
                        return a.is_featured ? -1 : 1;
                    }
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                break;
            default:
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
        }

        return filtered;
    }, [allProducts, filters, currentSort, searchQuery]);

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return (
            filters.main_categories.length > 0 ||
            filters.sub_categories.length > 0 ||
            filters.product_categories.length > 0 ||
            filters.minRating > 0 ||
            filters.inStockOnly ||
            searchQuery ||
            filters.priceRange[1] < 100000000 ||
            filters.priceRange[0] > 0
        );
    }, [filters, searchQuery]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Get category display name for title - SIMPLIFIED
    const getCategoryDisplayName = () => {
        if (categoryParam) {
            // For main categories, just return the name directly
            if (isMainCategory(categoryParam)) {
                return categoryParam;
            }

            // For encoded paths, try to get the display name
            try {
                const pathSegments = categoryParam.split('/');
                const decodedSegments = pathSegments.map(segment => {
                    try {
                        return decodeId(segment);
                    } catch {
                        return segment;
                    }
                });

                // Get category names from your categories data
                const getCategoryName = (id: number): string => {
                    const category = categories.find(cat => cat.id === id);
                    return category?.name || `Category ${id}`;
                };

                if (decodedSegments.length === 1) {
                    return getCategoryName(Number(decodedSegments[0]));
                } else if (decodedSegments.length === 2) {
                    return `${getCategoryName(Number(decodedSegments[0]))} → ${getCategoryName(Number(decodedSegments[1]))}`;
                } else if (decodedSegments.length >= 3) {
                    return `${getCategoryName(Number(decodedSegments[0]))} → ${getCategoryName(Number(decodedSegments[1]))} → ${getCategoryName(Number(decodedSegments[2]))}`;
                }
            } catch (error) {
                console.error('Error getting category display name:', error);
            }
        }
        return 'Category';
    };
    getCategoryDisplayName()
    return (
        <>
            <Navbar />
            <div className="min-h-screen max-w-full m-auto">
                <div className="flex">
                    <div className="h-[calc(100vh-64px)]">
                        {/* Filter Sidebar */}
                        <FilterSidebar
                            filters={filters}
                            onFiltersChange={setFilters}
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 lg:ml-0 h-[calc(100vh-64px)] overflow-y-auto" id='main_content'>
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-6">
                            <div className="max-w-full mx-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                            {searchQuery
                                                ? `Search Results for "${searchQuery}"`
                                                : categoryParam
                                                    ? `Filtered Products `
                                                    : 'All Products'
                                            }
                                        </h1>
                                        <p className="text-gray-600 mt-1">
                                            {searchQuery
                                                ? `Found ${totalCount} products matching your search`
                                                : categoryParam
                                                    ? `Browse ${totalCount} products `
                                                    : 'Discover amazing products from verified sellers'
                                            }
                                        </p>
                                        {correctedQuery && (
                                            <p className="text-sm text-blue-600 mt-1">
                                                Did you mean: <strong>{correctedQuery}</strong>?
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="lg:hidden bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:border-gray-400 transition-colors"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        <span>Filters</span>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Results Header */}
                        <div className="px-4 lg:px-8 py-4 bg-white border-b border-gray-200">
                            <div className="max-w-full mx-auto flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-600">
                                        Showing {filteredAndSortedProducts.length} of {totalCount} products
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={() => {
                                                setFilters({
                                                    main_categories: [],
                                                    sub_categories: [],
                                                    product_categories: [],
                                                    priceRange: [0, 100000000],
                                                    minRating: 0,
                                                    inStockOnly: false
                                                });
                                                setSearchQuery('');
                                                setCorrectedQuery('');
                                                setSearchSuggestions([]);
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                                <SortDropdown
                                    currentSort={currentSort}
                                    onSortChange={setCurrentSort}
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="px-4 lg:px-8 py-8">
                            <div className="max-w-full mx-auto">
                                {initialLoading && allProducts.length === 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                                        {[...Array(12)].map((_, index) => (
                                            <SkeletonLoader key={index} />
                                        ))}
                                    </div>
                                ) : filteredAndSortedProducts.length > 0 ? (
                                    <>
                                        <motion.div
                                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
                                        >
                                            {filteredAndSortedProducts.map((product, index) => (
                                                <ProductCard
                                                    key={`${product.id}-${index}`}
                                                    product={product}
                                                    index={index}
                                                />
                                            ))}
                                        </motion.div>

                                        {/* Show skeleton loaders when loading more */}
                                        {loadingMore && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-8">
                                                {[...Array(8)].map((_, index) => (
                                                    <SkeletonLoader key={`skeleton-${index}`} />
                                                ))}
                                            </div>
                                        )}

                                        {/* Load More Button */}
                                        <LoadMoreButton
                                            isLoading={loadingMore}
                                            hasMore={hasMore}
                                            onClick={handleLoadMore}
                                        />
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-16"
                                    >
                                        <div className="max-w-md mx-auto">
                                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No products found
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Try adjusting your search or filter criteria to find what you're looking for.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setFilters({
                                                        main_categories: [],
                                                        sub_categories: [],
                                                        product_categories: [],
                                                        priceRange: [0, 100000000],
                                                        minRating: 0,
                                                        inStockOnly: false
                                                    });
                                                    setSearchQuery('');
                                                    setCorrectedQuery('');
                                                    setSearchSuggestions([]);
                                                }}
                                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* End of results message */}
                                {!hasMore && filteredAndSortedProducts.length > 0 && (
                                    <div className="text-center mt-12 py-8 border-t border-gray-200">
                                        <p className="text-gray-600">You've reached the end of the products list.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Suggestions /> */}
            <Footer />
        </>
    );
};

export default AllProductsPage;