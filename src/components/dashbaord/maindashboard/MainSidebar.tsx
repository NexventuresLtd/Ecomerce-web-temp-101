import React from 'react';
import {
    LayoutDashboard,
    Package,
    Tag,
    Heart,
    ShoppingBag,
    Video,
    Users,
    Sliders,
    Receipt,
    Truck,
    Building2,
    Megaphone,
    UserCircle,
} from 'lucide-react';
import type { ViewType } from '../../../types/dashboard/mainDashbaord';
import { useAppContext } from '../../../contexts/dashbaord/context';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useDashboardNotifications } from '../../../hooks/useDashboardNotifications';

// Sidebar Component
export const Sidebar: React.FC = () => {
    const { currentView, setCurrentView, isSidebarOpen, setSidebarOpen } = useAppContext();
    const { role, user } = useCurrentUser();
    const isSuperAdmin = !!user?.is_super_admin;
    // Unseen events per tab, shared with the header bell.
    const { unseenByView } = useDashboardNotifications();

    const menuItems =
    role === "admin" ?
    [
        { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products' as ViewType, label: 'Products', icon: Package },
        { id: 'categories' as ViewType, label: 'Categories', icon: Tag },
        // { id: 'report' as ViewType, label: 'Report', icon: Dock },
        // Users & Transactions carry sensitive/financial data — super admin only.
        ...(isSuperAdmin ? [{ id: 'users' as ViewType, label: 'Users', icon: Users }] : []),
        { id: 'wishlists' as ViewType, label: 'Wishlists', icon: Heart },
        { id: 'carts' as ViewType, label: 'Carts', icon: ShoppingBag },
        ...(isSuperAdmin ? [{ id: 'orders' as ViewType, label: 'Transactions', icon: Receipt }] : []),
        { id: 'deliveries' as ViewType, label: 'Deliveries', icon: Truck },
        { id: 'pickups' as ViewType, label: 'Pickups', icon: Building2 },
        { id: 'vlog' as ViewType, label: 'Vlog', icon: Video },
        { id: 'slide' as ViewType, label: 'Slider', icon: Sliders },
        { id: 'authSliders' as ViewType, label: 'Login/Register Slider', icon: Sliders },
        { id: 'announcements' as ViewType, label: 'Announcements', icon: Megaphone },
        { id: 'profile' as ViewType, label: 'Profile', icon: UserCircle },
    ]:
    [
        { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products' as ViewType, label: 'Products', icon: Package },
        // { id: 'categories' as ViewType, label: 'Categories', icon: Tag },
        { id: 'wishlists' as ViewType, label: 'Wishlists', icon: Heart },
        { id: 'carts' as ViewType, label: 'Carts', icon: ShoppingBag },
        { id: 'vlog' as ViewType, label: 'Vlog', icon: Video },
        { id: 'profile' as ViewType, label: 'Profile', icon: UserCircle },
    ];

    const handleItemClick = (viewId: ViewType) => {
        if (setCurrentView) {
            setCurrentView(viewId);
        }
        // Close sidebar on mobile after selection
        if (window.innerWidth < 1024) {
            if (setSidebarOpen) {
                setSidebarOpen(false);
            }
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen && setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:z-auto
      `}>
                <a
                    href="/"
                    className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    title="Go to homepage"
                >
                    <img src="/Umukamezilogo.jpg" alt="Umukamezi" className="h-9 w-9 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 leading-tight">Admin Panel</h2>
                        <p className="text-xs text-gray-500">Back to store</p>
                    </div>
                </a>

                <nav className="mt-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const count = unseenByView[item.id] ?? 0;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className={`
                  w-full flex items-center gap-3 px-6 py-3 text-left transition-colors
                  ${currentView === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                `}
                            >
                                <Icon size={20} />
                                <span className="font-medium flex-1">{item.label}</span>
                                {count > 0 && (
                                    <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                        {count > 99 ? '99+' : count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};
export default Sidebar;