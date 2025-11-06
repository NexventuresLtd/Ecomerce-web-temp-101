import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
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

const ThirdMenuNav: React.FC<ThirdMenuNavProps> = ({ activeDropdown, isMobile, setActiveDropdown, isMenuOpen, setIsMenuOpen, handleClickOutside }) => {
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleItemHover = (itemName: string) => {
        if (!isMobile && mainNavItems.find(item => item.title === itemName)?.hasDropdown) {
            setActiveDropdown(itemName);
        }
    };

    // Handle main category click - use query parameters
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

    // Handle subcategory click - use query parameters
    const handleSubCategoryClick = (categoryData: string) => {
        // categoryData format: "mainId/subId/productId" (already encoded)
        navigate(`/products?category=${categoryData}`);
        setActiveDropdown(null);
        setIsMenuOpen(false);
    };

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

    const UpdatedDropdownContent = ({ itemName }: { itemName: string }) => {
        return (
            <div onClick={(e) => {
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
            }}>
                <GenerateDropdownContent itemName={itemName} />
            </div>
        );
    };

    return (
        <>
            <div className={`${isMobile ? 'bg-white' : 'bg-primary'} relative`}>
                <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-0">
                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex relative">
                        <div className="flex w-full xl:justify-between 2xl:justify-center 2xl:gap-10 ">
                            {mainNavItems.map((item) => (
                                <div
                                    key={item.title}
                                    className="relative"
                                    onMouseEnter={() => handleItemHover(item.title)}
                                >
                                    <button
                                        onClick={() => handleNavItemClick(item)}
                                        className="flex items-center py-3 px-2 cursor-pointer text-white hover:bg-slate-700 transition-colors duration-200 text-sm "
                                    >
                                        {item.name}
                                        {item.hasDropdown && <ChevronDown className="ml-0 w-4 h-4" />}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Single Fixed Position Dropdown */}
                        <div
                            onMouseLeave={(e) => handleClickOutside?.(e)}
                            ref={dropdownContainerRef}
                            className={`absolute left-0 top-full w-full bg-white rounded-b-2xl z-20 transition-opacity duration-200 ${activeDropdown ? 'opacity-100 visible' : 'opacity-10 invisible'
                                }`}
                        >
                            {activeDropdown && <UpdatedDropdownContent itemName={activeDropdown} />}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="xl:hidden bg-white">
                            <div className="px-4 py-2 space-y-1">
                                {mainNavItems.map((item) => (
                                    <div key={item.title} className="border-b border-gray-100">
                                        {item.hasDropdown ? (
                                            <>
                                                <button
                                                    onClick={() => handleNavItemClick(item)}
                                                    className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:text-green-600"
                                                >
                                                    <span>{item.title}</span>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform ${activeDropdown === item.title ? 'transform rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {activeDropdown === item.title && (
                                                    <div className="px-3 py-2 bg-gray-50">
                                                        <UpdatedDropdownContent itemName={item.title} />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleNavItemClick(item)}
                                                className="block w-full text-left px-3 py-3 text-gray-700 hover:text-green-600"
                                            >
                                                {item.title}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-5">
                                <UserInfo isMenuOpen={isMenuOpen} showMenu={false} setIsMenuOpen={setIsMenuOpen} setActiveDropdown={setActiveDropdown} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ThirdMenuNav;