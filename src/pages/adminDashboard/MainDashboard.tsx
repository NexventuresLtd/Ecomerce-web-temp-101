import React from 'react';

import { useAppContext } from '../../contexts/dashbaord/context';
import Header from '../../components/dashbaord/maindashboard/MainHeader';
import Sidebar from '../../components/dashbaord/maindashboard/MainSidebar';
import CategoriesView from '../../components/dashbaord/maindashboard/categoryManagent';
import ProductManagement from '../../components/dashbaord/Productsdash/MainProducts';
import WishlistAdmin from '../../components/dashbaord/Productsdash/WishlistAdmin';
import CartAdmin from '../../components/dashbaord/Productsdash/CartAdmin';
import Overview from '../../components/dashbaord/maindashboard/overview';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import VlogManager from '../../components/dashbaord/vlog/Vlog';
import DashboardReport from '../../components/dashbaord/maindashboard/DashbaordReport';
import UsersManagement from '../../components/dashbaord/UsersManagement';
import HeroSliderManager from '../../components/dashbaord/slider/sliderManage';
import AuthSliderManager from '../../components/dashbaord/slider/authSliderManage';
import AdminOrders from '../../components/dashbaord/Productsdash/AdminOrders';
import AdminDeliveries from '../../components/dashbaord/Productsdash/AdminDeliveries';
import AnnouncementManager from '../../components/dashbaord/AnnouncementManager';
import AdminProfile from '../../components/dashbaord/maindashboard/AdminProfile';

// Main Content Component
const MainContent: React.FC = () => {
    const { currentView } = useAppContext();
    const { user } = useCurrentUser();
    // Every admin gets the same dashboard; money (revenue, transactions,
    // reports) is the one thing reserved for the super admin. The Overview
    // hides its financial blocks itself, and the guarded views below fall
    // back to the dashboard rather than rendering a 403.
    const isSuperAdmin = !!user?.is_super_admin;
    const DashboardHome = Overview;

    const renderView = () => {
        switch (currentView) {
            case "dashboard":
                return <DashboardHome />;
            case "products":
                return <ProductManagement />;
            case "categories":
                return <CategoriesView />;
            case "users":
                return <UsersManagement />;
            case "vlog":
                return <VlogManager />;
            case "report":
                return isSuperAdmin ? <DashboardReport /> : <DashboardHome />;
            case "wishlists":
                return <WishlistAdmin />;
            case "carts":
                return <CartAdmin />;
            case "orders":
                return isSuperAdmin ? <AdminOrders /> : <DashboardHome />;
            case "deliveries":
                return <AdminDeliveries deliveryTypeFilter="delivery" />;
            case "pickups":
                return <AdminDeliveries deliveryTypeFilter="pickup" />;
            case "slide":
                return <HeroSliderManager/>
            case "authSliders":
                return <AuthSliderManager/>
            case "announcements":
                return <AnnouncementManager />
            case "profile":
                return <AdminProfile />
            default:
                return <DashboardHome />;
        }
    };


    return (
        <>
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto pb-60">
                        {renderView()}
                    </main>
                </div>
            </div>
        </>
    );
};
export default MainContent;
