import React from 'react';

import { useAppContext } from '../../contexts/dashbaord/context';
import Header from '../../components/dashbaord/maindashboard/MainHeader';
import Sidebar from '../../components/dashbaord/maindashboard/MainSidebar';
import CategoriesView from '../../components/dashbaord/maindashboard/categoryManagent';
import ProductManagement from '../../components/dashbaord/Productsdash/MainProducts';
import WishlistAdmin from '../../components/dashbaord/Productsdash/WishlistAdmin';
import CartAdmin from '../../components/dashbaord/Productsdash/CartAdmin';
import Overview from '../../components/dashbaord/maindashboard/overview';
import RestrictedOverview from '../../components/dashbaord/maindashboard/RestrictedOverview';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import VlogManager from '../../components/dashbaord/vlog/Vlog';
import DashboardReport from '../../components/dashbaord/maindashboard/DashbaordReport';
import UsersManagement from '../../components/dashbaord/UsersManagement';
import HeroSliderManager from '../../components/dashbaord/slider/sliderManage';
import AdminOrders from '../../components/dashbaord/Productsdash/AdminOrders';
import AdminDeliveries from '../../components/dashbaord/Productsdash/AdminDeliveries';
import AnnouncementManager from '../../components/dashbaord/AnnouncementManager';
import SMSBroadcastManager from '../../components/dashbaord/SMSBroadcastManager';

// Main Content Component
const MainContent: React.FC = () => {
    const { currentView } = useAppContext();
    const { user } = useCurrentUser();
    // The full stats/notifications dashboard is reserved for the super admin —
    // every other admin only gets revenue + role assignment.
    const DashboardHome = user?.is_super_admin ? Overview : RestrictedOverview;

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
                return <DashboardReport />;
            case "wishlists":
                return <WishlistAdmin />;
            case "carts":
                return <CartAdmin />;
            case "orders":
                return <AdminOrders />;
            case "deliveries":
                return <AdminDeliveries deliveryTypeFilter="delivery" />;
            case "pickups":
                return <AdminDeliveries deliveryTypeFilter="pickup" />;
            case "slide":
                return <HeroSliderManager/>
            case "announcements":
                return <AnnouncementManager />
            case "sms_broadcast":
                return <SMSBroadcastManager />
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
