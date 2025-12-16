import { ChevronDown } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mainNavItems } from '../../../constants/NabarMain/navLinks';
import { GenerateDropdownContent } from '../../../hooks/NavbarHooks/NavMenu';
import UserInfo from './UserInfo';
import { encodeId } from '../../../app/products/id_encrypter';

interface ThirdMenuNavProps {
    activeDropdown: string | null;
    isMobile: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
    handleClickOutside?: (event: any) => void;
}

const ThirdMenuNav: React.FC<ThirdMenuNavProps> = ({ 
    activeDropdown, 
    isMobile, 
    setActiveDropdown, 
    isMenuOpen, 
    setIsMenuOpen, 

}) => {
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Clear timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleItemHover = (itemName: string) => {
        if (!isMobile && mainNavItems.find(item => item.title === itemName)?.hasDropdown) {
            // Clear any pending close timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            setActiveDropdown(itemName);
        }
    };

    const handleItemLeave = () => {
        // Delay closing dropdown to allow moving cursor to dropdown
        if (!isMobile) {
            timerRef.current = setTimeout(() => {
                setActiveDropdown(null);
            }, 150);
        }
    };

    const handleDropdownHover = () => {
        // Clear timer when hovering over dropdown
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    const handleDropdownLeave = () => {
        if (!isMobile) {
            setActiveDropdown(null);
        }
    };

    // Handle main category click - use query parameters (YOUR ORIGINAL LOGIC)
    const handleMainCategoryClick = (categoryTitle: string) => {
        const categoryMap: { [key: string]: number } = {
            'Camera': 1,
            'Lenses': 2,
            'Computer': 3,
            'Pro Audio': 4,
            'Lighting': 5,
            'Phone': 6,
            'Other Accessories': 7,
        };
        
        const categoryId = categoryMap[categoryTitle];
        if (categoryId) {
            const encodedId = encodeId(categoryId);
            // Use query parameter instead of path parameter
            navigate(`/products?category=${encodedId}`);
        } else {
            navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
        }
        
        setActiveDropdown(null);
        setIsMenuOpen(false);
    };

    // Handle subcategory click - use query parameters (YOUR ORIGINAL LOGIC)
    const handleSubCategoryClick = (categoryData: string) => {
        // categoryData format: "mainId/subId/productId" (already encoded)
        navigate(`/products?category=${categoryData}`);
        setActiveDropdown(null);
        setIsMenuOpen(false);
    };

    // Handle nav item click (YOUR ORIGINAL LOGIC)
    const handleNavItemClick = (item: any) => {
        if (item.hasDropdown) {
            handleMainCategoryClick(item.title);
        } else if (item.href) {
            if (item.href.startsWith('http') || item.href.startsWith('/')) {
                window.location.href = item.href;
            } else {
                navigate(item.href);
            }
        }
    };

    // Handle mobile dropdown toggle (NEW - for mobile only)
    const handleMobileDropdownToggle = (itemTitle: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (activeDropdown === itemTitle) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(itemTitle);
        }
    };



    const UpdatedDropdownContent = ({ itemName }: { itemName: string }) => {
        return (
            <div 
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    const categoryLink = target.closest('a[data-category-path]');
                    if (categoryLink) {
                        const categoryPath = categoryLink.getAttribute('data-category-path');
                        if (categoryPath) {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSubCategoryClick(categoryPath);
                        }
                    }
                }}
                className="max-h-[70vh] overflow-y-auto"
            >
                <GenerateDropdownContent itemName={itemName} />
            </div>
        );
    };

    return (
        <div className={`${isMobile ? 'bg-white' : 'bg-primary'} relative`}>
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-0">
                {/* Desktop Navigation - EXACTLY AS YOUR ORIGINAL */}
                <div className="hidden xl:flex relative">
                    <div className="flex w-full xl:justify-between 2xl:justify-center 2xl:gap-10">
                        {mainNavItems.map((item) => (
                            <div
                                key={item.title}
                                className="relative"
                                onMouseEnter={() => handleItemHover(item.title)}
                                onMouseLeave={handleItemLeave}
                            >
                                <button
                                    onClick={() => handleNavItemClick(item)}
                                    className="flex items-center py-3 px-2 cursor-pointer text-white hover:bg-slate-700 transition-colors duration-200 text-sm"
                                >
                                    {item.name || item.title}
                                    {item.hasDropdown && <ChevronDown className="ml-0 w-4 h-4" />}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Single Fixed Position Dropdown */}
                    <div
                        ref={dropdownContainerRef}
                        className={`absolute left-0 top-full w-full bg-white rounded-b-2xl shadow-lg z-50 transition-all duration-200 ease-in-out ${
                            activeDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                        }`}
                        onMouseEnter={handleDropdownHover}
                        onMouseLeave={handleDropdownLeave}
                    >
                        {activeDropdown && <UpdatedDropdownContent itemName={activeDropdown} />}
                    </div>
                </div>

                {/* Mobile Navigation - UPDATED FOR BETTER UX */}
                {isMenuOpen && (
                    <div className="xl:hidden bg-white shadow-lg max-h-[85vh] overflow-y-auto">
                        <div className="px-4 py-2 space-y-0">
                            {mainNavItems.map((item) => (
                                <div key={item.title} className="border-b border-gray-100 last:border-b-0">
                                    {item.hasDropdown ? (
                                        <div className="flex flex-col">
                                            <div className="flex items-center">
                                                {/* Category Name - Navigates on click (like desktop) */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMainCategoryClick(item.title);
                                                    }}
                                                    className="flex-1 text-left px-3 py-4 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-150 font-medium"
                                                >
                                                    {item.name || item.title}
                                                </button>
                                                
                                                {/* Dropdown Icon - Toggles dropdown */}
                                                <button
                                                    onClick={(e) => handleMobileDropdownToggle(item.title, e)}
                                                    className="px-4 py-4 text-gray-500 hover:text-gray-700 flex items-center"
                                                >
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-200 ${
                                                            activeDropdown === item.title ? 'transform rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                            
                                            {/* Dropdown Content */}
                                            {activeDropdown === item.title && (
                                                <div className="px-3 pb-3 bg-gray-50 max-h-[50vh] overflow-y-auto">
                                                    <UpdatedDropdownContent itemName={item.title} />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleNavItemClick(item)}
                                            className="block w-full text-left px-3 py-4 text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            {item.name || item.title}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* User Info */}
                        <div className="px-4 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
                            <UserInfo 
                                isMenuOpen={isMenuOpen} 
                                showMenu={false} 
                                setIsMenuOpen={setIsMenuOpen} 
                                setActiveDropdown={setActiveDropdown} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThirdMenuNav;