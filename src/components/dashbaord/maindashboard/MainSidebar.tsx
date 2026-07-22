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
} from 'lucide-react';
import type { ViewType } from '../../../types/dashboard/mainDashbaord';
import { useAppContext } from '../../../contexts/dashbaord/context';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

// Sidebar Component
export const Sidebar: React.FC = () => {
    const { currentView, setCurrentView, isSidebarOpen, setSidebarOpen } = useAppContext();
    const { role } = useCurrentUser();

    const menuItems =
    role === "admin" ?
    [
        { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products' as ViewType, label: 'Products', icon: Package },
        { id: 'categories' as ViewType, label: 'Categories', icon: Tag },
        // { id: 'report' as ViewType, label: 'Report', icon: Dock },
        { id: 'users' as ViewType, label: 'Users', icon: Users },
        { id: 'wishlists' as ViewType, label: 'Wishlists', icon: Heart },
        { id: 'carts' as ViewType, label: 'Carts', icon: ShoppingBag },
        { id: 'orders' as ViewType, label: 'Transactions', icon: Receipt },
        { id: 'deliveries' as ViewType, label: 'Deliveries', icon: Truck },
        { id: 'pickups' as ViewType, label: 'Pickups', icon: Building2 },
        { id: 'vlog' as ViewType, label: 'Vlog', icon: Video },
        { id: 'slide' as ViewType, label: 'Slider', icon: Sliders },
        { id: 'announcements' as ViewType, label: 'Announcements', icon: Megaphone },
    ]:
    [
        { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products' as ViewType, label: 'Products', icon: Package },
        // { id: 'categories' as ViewType, label: 'Categories', icon: Tag },
        { id: 'wishlists' as ViewType, label: 'Wishlists', icon: Heart },
        { id: 'carts' as ViewType, label: 'Carts', icon: ShoppingBag },
        { id: 'vlog' as ViewType, label: 'Vlog', icon: Video },
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
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
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
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};
export default Sidebar;