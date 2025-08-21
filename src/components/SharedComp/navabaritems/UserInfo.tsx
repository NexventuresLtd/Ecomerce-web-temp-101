import { Heart, Menu, ShoppingCart, User, X } from "lucide-react";
import LanguageDropdown from "./LanguageChanger";

interface SecondNavProps {
    isMenuOpen: boolean
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>
    showMenu?: boolean
}
export default function UserInfo({ isMenuOpen, setIsMenuOpen, setActiveDropdown, showMenu }: SecondNavProps) {
    return (
        <>
            <div className="flex items-center space-x-6">

                {/* Cart */}
                <div className={`${showMenu ? 'hidden xl:flex' : 'flex xl:hidden'} items-center space-x-1 gap-2`}>
                    <div className="flex flex-col items-start sm:items-center ">
                        <ShoppingCart className="w-6 h-6 text-gray-600" />
                        <span className="hidden sm:inline text-xs">My Cart</span>
                    </div>
                    <div className="flex flex-col items-start sm:items-center">
                        <Heart className="w-6 h-6 text-gray-600" />
                        <span className="hidden sm:inline text-xs ">Wishlist</span>
                    </div>
                </div>
                <div className={`${showMenu ? 'hidden xl:flex' : 'flex xl:hidden'}  items-center space-x-2`}>
                    <User className="w-5 h-5 text-gray-600" />
                    <div className="text-xs cursor-pointer hover:underline" onClick={() => window.location.href = '/authentication'}>
                        <div className="text-gray-600">Hello, Log In</div>
                        <div className="font-semibold">Account & Orders</div>
                    </div>
                </div>
                <div className={`${showMenu ? 'hidden xl:flex' : 'flex xl:hidden'} `}>
                    {/* Language Dropdown */}
                    <LanguageDropdown />
                </div>


                {/* Mobile menu button */}
                <button
                    onClick={() => {
                        setIsMenuOpen(!isMenuOpen);
                        if (isMenuOpen) setActiveDropdown(null);
                    }}
                    className="xl:hidden p-2"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
        </>
    )
}
