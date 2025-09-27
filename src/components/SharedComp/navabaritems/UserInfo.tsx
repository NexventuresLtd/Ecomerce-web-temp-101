import { Heart,  Menu, ShoppingCart, User, X } from "lucide-react";
// import LanguageDropdown from "./LanguageChanger";
import { getUserInfo } from "../../../app/Localstorage";
// import { logout } from "../../../app/utils/HandelLogout";

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
                    <div onClick={() =>
                        window.location.href = '/shopping-cart'
                    } className="flex flex-col items-start sm:items-center curorsor-pointer">
                        <ShoppingCart className="w-6 h-6 text-gray-600" />
                        <span className="hidden sm:inline text-xs">My Cart</span>
                    </div>
                    <div onClick={() => window.location.href = '/wish-list'} className="flex cursor-pointer flex-col items-start sm:items-center">
                        <Heart className="w-6 h-6 text-gray-600" />
                        <span className="hidden sm:inline text-xs ">Wishlist</span>
                    </div>
                </div>
                <div className={`${showMenu ? 'hidden xl:flex' : 'flex xl:hidden'}  items-center space-x-2`}>
                    {!getUserInfo ? <>
                        <User className="w-5 h-5 text-gray-600" />
                        <div className="text-xs cursor-pointer hover:underline" onClick={() => window.location.href = '/authentication'}>
                            <div className="text-gray-600">Hello, Log In</div>
                            <div className="font-semibold">Account & Orders</div>
                        </div>
                    </> :
                        <>
                            <div onClick={() => window.location.href = '/profile'} className="h-10 w-10 rounded-full bg-black cursor-pointer text-white overflow-hidden flex capitalize justify-center items-center font-bold">
                                {getUserInfo?.profile_pic ? <img src={getUserInfo?.profile_pic} alt={getUserInfo?.email?.charAt(0)} className="h-full w-full" /> : <>{getUserInfo?.fname?.charAt(0).toUpperCase()} {getUserInfo?.lname?.charAt(0).toUpperCase()}</>}
                            </div>
                            <div className="text-xs cursor-pointer hover:underline" onClick={() => window.location.href = '/profile'}>
                                <div className="text-gray-600">{getUserInfo?.fname?.slice(0, 7)} {getUserInfo?.lname?.slice(0, 7)}</div>
                                <div className="font-semibold">{getUserInfo?.email?.slice(0, 12)}...</div>
                            </div>
                        </>
                    }
                </div>
                <div className={`${showMenu ? 'hidden xl:flex' : 'flex xl:hidden'} `}>
                    {/* Language Dropdown */}
                    {/* <LanguageDropdown /> */}
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
