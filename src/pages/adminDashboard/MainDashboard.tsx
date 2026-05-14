import React from 'react';

import { useAppContext } from '../../contexts/dashbaord/context';
import Header from '../../components/dashbaord/maindashboard/MainHeader';
import Sidebar from '../../components/dashbaord/maindashboard/MainSidebar';
import CategoriesView from '../../components/dashbaord/maindashboard/categoryManagent';
import ProductManagement from '../../components/dashbaord/Productsdash/MainProducts';
import WishlistAdmin from '../../components/dashbaord/Productsdash/WishlistAdmin';
import CartAdmin from '../../components/dashbaord/Productsdash/CartAdmin';
import Overview from '../../components/dashbaord/maindashboard/overview';
import VlogManager from '../../components/dashbaord/vlog/Vlog';
import DashboardReport from '../../components/dashbaord/maindashboard/DashbaordReport';
import UsersManagement from '../../components/dashbaord/UsersManagement';
import HeroSliderManager from '../../components/dashbaord/slider/sliderManage';
import AdminOrders from '../../components/dashbaord/Productsdash/AdminOrders';
import AdminDeliveries from '../../components/dashbaord/Productsdash/AdminDeliveries';

// Main Content Component
const MainContent: React.FC = () => {
    const { currentView } = useAppContext();

    const renderView = () => {
        switch (currentView) {
            case "dashboard":
                return <Overview />;
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
            default:
                return <Overview />;
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
