import React from 'react';


import { useAppContext } from '../../../contexts/dashbaord/context';
import { LogOut, Menu, X } from 'lucide-react';
import { logout } from '../../../app/utils/HandelLogout';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import NotificationBell from './NotificationBell';
// Header Component
const Header: React.FC = () => {
  const { currentView, isSidebarOpen, setSidebarOpen } = useAppContext();
  const { user } = useCurrentUser();

  const getPageTitle = (view: any): string => {
    switch (view) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return 'Manage Products';
      case 'categories': return 'Manage Categories';
      case 'users': return 'User Management';
      case 'orders': return 'Order Management';
      case 'wishlists': return 'User Wishlists';
      case 'carts': return 'User Carts';
      case 'announcements': return 'Announcements';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen?.(!isSidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{getPageTitle(currentView)}</h1>
        </div>
        <div className="flex items-center gap-2">
          {user?.is_super_admin && <NotificationBell />}
          <button onClick={() => logout()} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header