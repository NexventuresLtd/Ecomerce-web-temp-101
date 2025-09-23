import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { mainNavItems } from '../../../constants/NabarMain/navLinks';
import { GenerateDropdownContent } from '../../../hooks/NavbarHooks/NavMenu';
import UserInfo from './UserInfo';
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

    const handleItemHover = (itemName: string) => {
        if (!isMobile && mainNavItems.find(item => item.title === itemName)?.hasDropdown) {
            setActiveDropdown(itemName);
          
        }
    };

    const handleMobileClick = (item: any) => {
        if (!item.hasDropdown) {
            window.location.href = item.href
            return
        }
        if (isMobile) {
            setActiveDropdown(activeDropdown === item.title ? null : item.title);
        }
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
                                        onClick={() => handleMobileClick(item)}
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
                            {activeDropdown && <GenerateDropdownContent itemName={activeDropdown} />}
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
                                                    onClick={() => handleMobileClick(item.title)}
                                                    className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:text-green-600"
                                                >
                                                    <span>{item.title}</span>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform ${activeDropdown === item.title ? 'transform rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {activeDropdown === item.title && (
                                                    <div className="px-3 py-2 bg-gray-50">
                                                        <GenerateDropdownContent itemName={item.title} />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <a
                                                href={item.href}
                                                className="block px-3 py-3 text-gray-700 hover:text-green-600"
                                            >
                                                {item.title}
                                            </a>
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
    )
}

export default ThirdMenuNav
