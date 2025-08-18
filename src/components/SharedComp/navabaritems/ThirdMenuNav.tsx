import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { mainNavItems } from '../../../constants/NabarMain/navLinks';
import { generateDropdownContent } from '../../../hooks/NavbarHooks/NavMenu';
import UserInfo from './UserInfo';
interface ThirdMenuNavProps {
    activeDropdown: string | null;
    isMobile: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
}

const ThirdMenuNav: React.FC<ThirdMenuNavProps> = ({ activeDropdown, isMobile, setActiveDropdown, isMenuOpen, setIsMenuOpen }) => {
    const dropdownContainerRef = useRef<HTMLDivElement>(null);

    const handleItemHover = (itemName: string) => {
        if (!isMobile && mainNavItems.find(item => item.name === itemName)?.hasDropdown) {
            setActiveDropdown(itemName);
        }
    };

    const handleMobileClick = (itemName: string) => {
        if (isMobile) {
            setActiveDropdown(activeDropdown === itemName ? null : itemName);
        }
    };

    return (
        <>
            <div className={`${isMobile ? 'bg-white' : 'bg-primary'} relative`}>
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex relative">
                        <div className="flex w-full">
                            {mainNavItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => handleItemHover(item.name)}
                                // onMouseLeave={handleItemLeave}
                                >
                                    <button
                                        onClick={() => handleMobileClick(item.name)}
                                        className="flex items-center px-4 py-3 cursor-pointer text-white hover:bg-slate-700 transition-colors duration-200 text-sm font-medium"
                                    >
                                        {item.name}
                                        {item.hasDropdown && <ChevronDown className="ml-1 w-4 h-4" />}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Single Fixed Position Dropdown */}
                        <div
                            ref={dropdownContainerRef}
                            className={`absolute left-0 top-full w-full bg-gray-100 rounded-b-2xl z-20 transition-opacity duration-200 ${activeDropdown ? 'opacity-100 visible' : 'opacity-10 invisible'
                                }`}
                        >
                            {activeDropdown && generateDropdownContent(activeDropdown)}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="xl:hidden bg-white">

                            <div className="px-4 py-2 space-y-1">
                                {mainNavItems.map((item) => (
                                    <div key={item.name} className="border-b border-gray-100">
                                        {item.hasDropdown ? (
                                            <>
                                                <button
                                                    onClick={() => handleMobileClick(item.name)}
                                                    className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:text-green-600"
                                                >
                                                    <span>{item.name}</span>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? 'transform rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {activeDropdown === item.name && (
                                                    <div className="px-3 py-2 bg-gray-50">
                                                        {generateDropdownContent(item.name)}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <a
                                                href={item.href}
                                                className="block px-3 py-3 text-gray-700 hover:text-green-600"
                                            >
                                                {item.name}
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
