import { Heart, Menu, ShoppingCart, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserInfo, token } from "../../../app/Localstorage";
import mainAxios from "../../../Instance/mainAxios";

interface SecondNavProps {
    isMenuOpen: boolean
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>
    showMenu?: boolean
}

export default function UserInfo({ isMenuOpen, setIsMenuOpen, setActiveDropdown, showMenu }: SecondNavProps) {
    const [cartCount, setCartCount] = useState(0);
    const [wishCount, setWishCount] = useState(0);

    const fetchCounts = async () => {
        if (!token) return;
        try {
            const [cartRes, wishRes] = await Promise.all([
                mainAxios.get('/cart/my-cart'),
                mainAxios.get('/wishlist/my-wishlist'),
            ]);
            setCartCount(cartRes.data?.total_items ?? 0);
            setWishCount(wishRes.data?.total_items ?? 0);
        } catch {
            // silently ignore — user may not be logged in
        }
    };

    useEffect(() => {
        fetchCounts();
        window.addEventListener('cartUpdated', fetchCounts);
        window.addEventListener('wishlistUpdated', fetchCounts);
        return () => {
            window.removeEventListener('cartUpdated', fetchCounts);
            window.removeEventListener('wishlistUpdated', fetchCounts);
        };
    }, []);

    return (
        <>
            <div className="flex items-center space-x-6">

                {/* Cart & Wishlist icons with count badges */}
                <div className={`${showMenu ? 'hidden xl:flex' : 'flex xl:hidden'} items-center space-x-1 gap-2`}>
                    <div onClick={() => window.location.href = '/shopping-cart'}
                        className="relative flex flex-col items-start sm:items-center cursor-pointer">
                        <ShoppingCart className="w-6 h-6 text-gray-600" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                        <span className="hidden sm:inline text-xs">My Cart</span>
                    </div>
                    <div onClick={() => window.location.href = '/wish-list'}
                        className="relative flex cursor-pointer flex-col items-start sm:items-center">
                        <Heart className="w-6 h-6 text-gray-600" />
                        {wishCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                                {wishCount > 99 ? '99+' : wishCount}
                            </span>
                        )}
                        <span className="hidden sm:inline text-xs">Wishlist</span>
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
