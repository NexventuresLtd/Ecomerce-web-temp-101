
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/mainPages/HomePage";
import ScrollToHash from "./hooks/ScrollController";
import AnimatedLoginPage from "./pages/Authentication/LoginPage";
import { getUserInfo } from "./app/Localstorage";
import ViewProductDetails from "./pages/mainPages/ViewProductDetails";
import AllProducts from "./pages/mainPages/AllProducts";
import AboutPage from "./pages/mainPages/AboutUs";
import ShoppingCart from "./pages/mainPages/shoppingCart";
import WishlistPage from "./pages/mainPages/wishlist";
import VlogPage from "./pages/mainPages/Vlog";
import ContactPage from "./pages/mainPages/Contact";
import { AppContext } from "./contexts/dashbaord/context";
import type { AppContextType, ViewType } from "./types/dashboard/mainDashbaord";
import { useEffect, useState } from "react";
import MainContent from "./pages/adminDashboard/MainDashboard";
import UserDashboard from "./pages/Profile";
import NotFound from "./components/ProductViewDetails/NotFound";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Load saved view from memory on mount
  useEffect(() => {
    const savedView = sessionStorage.getItem('adminDashboardView') as ViewType;
    if (savedView) {
      setCurrentView(savedView);
    }
  }, []);

  // Save current view to memory whenever it changes
  useEffect(() => {
    sessionStorage.setItem('adminDashboardView', currentView);
  }, [currentView]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contextValue: AppContextType = {
    currentView,
    setCurrentView,
    isSidebarOpen,
    setSidebarOpen,
  };
  return (
      <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ViewProductDetails />} />
          <Route path="/products/:category" element={<AllProducts />} />
          <Route path="/products/" element={<AllProducts />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/wish-list" element={<WishlistPage />} />
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/vlog" element={<VlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/authentication" element={getUserInfo ? <HomePage /> : <AnimatedLoginPage />} />
          <Route path="/admin-dashboard" element={getUserInfo ? <MainContent /> : <AnimatedLoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>

  );
}