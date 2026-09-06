import { Heart, Menu, ShoppingCart, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserInfo } from "../../../app/Localstorage";
import mainAxios from "../../../Instance/mainAxios";
import { getGuestCartId } from "../../../app/utils/guestCart";
import { CART_UPDATED, WISHLIST_UPDATED } from "../../../app/utils/countEvents";
import { resolveImageUrl } from "../../../app/utils/resolveImageUrl";

interface SecondNavProps {
    isMenuOpen: boolean
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>
    showMenu?: boolean
}

export default function UserInfo({ isMenuOpen, setIsMenuOpen, setActiveDropdown }: SecondNavProps) {
    const [cartCount, setCartCount] = useState(0);
    const [wishCount, setWishCount] = useState(0);

    // Admins land in the admin dashboard, everyone else in their own dashboard.
    const goToDashboard = () => {
        window.location.href = getUserInfo?.role === 'admin' ? '/admin-dashboard' : '/profile';
    };

    // Guests have both a cart and a wishlist, so there's one code path for
    // everyone. guest_id always goes along: the server prefers the authenticated
    // user and only falls back to it, and an expired token counts as no user —
    // branching on a token merely being *present* used to blank both badges.
    const fetchCounts = async () => {
        const guestId = getGuestCartId();
        try {
            const [cartRes, wishRes] = await Promise.all([
                mainAxios.get(`/cart/my-cart?guest_id=${guestId}`, { skipAuthRedirect: true } as any),
                mainAxios.get(`/wishlist/my-wishlist?guest_id=${guestId}`, { skipAuthRedirect: true } as any),
            ]);
            setCartCount(cartRes.data?.total_items ?? 0);
            setWishCount(wishRes.data?.total_items ?? 0);
        } catch {
            // silently ignore — network hiccup
        }
    };

    useEffect(() => {
        fetchCounts();

        // Re-check when the tab regains focus, so a change made in another tab
        // (or on a page that navigated away with a full load) shows up here.
        const onVisible = () => {
            if (document.visibilityState === 'visible') fetchCounts();
        };
        window.addEventListener(CART_UPDATED, fetchCounts);
        window.addEventListener(WISHLIST_UPDATED, fetchCounts);
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            window.removeEventListener(CART_UPDATED, fetchCounts);
            window.removeEventListener(WISHLIST_UPDATED, fetchCounts);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, []);

    return (
        <>
            <div className="flex items-center space-x-6">

                {/* Cart & Wishlist icons with count badges — always visible, including mobile */}
                <div className="flex items-center space-x-1 gap-2">
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
                <div className="hidden sm:flex items-center space-x-2">
                    {!getUserInfo ? <>
                        <User className="w-5 h-5 text-gray-600" />
                        <div className="text-xs cursor-pointer hover:underline" onClick={() => window.location.href = '/login'}>
                            <div className="text-gray-600">Hello, Log In</div>
                            <div className="font-semibold">Account & Orders</div>
                        </div>
                    </> :
                        <>
                            <div onClick={goToDashboard} className="h-10 w-10 rounded-full bg-black cursor-pointer text-white overflow-hidden flex capitalize justify-center items-center font-bold">
                                {getUserInfo?.profile_pic ? <img src={resolveImageUrl(getUserInfo?.profile_pic)} alt={getUserInfo?.email?.charAt(0)} className="h-full w-full" /> :<>{getUserInfo?.fname?.charAt(0).toUpperCase()} {getUserInfo?.lname?.charAt(0).toUpperCase()}</>}
                            </div>
                            <div className="text-xs cursor-pointer hover:underline" onClick={goToDashboard}>
                                <div className="text-gray-600">{getUserInfo?.fname?.slice(0, 7)} {getUserInfo?.lname?.slice(0, 7)}</div>
                                <div className="font-semibold">{getUserInfo?.email?.slice(0, 12)}...</div>
                            </div>
                        </>
                    }
                </div>
                {/* Compact login/account icon for narrow mobile widths where the text block above is hidden */}
                <div
                    className="flex sm:hidden items-center cursor-pointer"
                    onClick={() => (getUserInfo ? goToDashboard() : (window.location.href = '/login'))}
                >
                    {!getUserInfo ? (
                        <User className="w-6 h-6 text-gray-600" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-black text-white overflow-hidden flex capitalize justify-center items-center font-bold text-xs">
                            {getUserInfo?.profile_pic ? <img src={resolveImageUrl(getUserInfo?.profile_pic)} alt={getUserInfo?.email?.charAt(0)} className="h-full w-full" /> :<>{getUserInfo?.fname?.charAt(0).toUpperCase()}</>}
                        </div>
                    )}
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
