
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScrollToHash from "./hooks/ScrollController";
import AnimatedLoginPage from "./pages/LoginPage";
import { getUserInfo } from "./app/Localstorage";
import ViewProductDetails from "./pages/ViewProductDetails";
import AllProducts from "./pages/AllProducts";
import AboutPage from "./pages/AboutUs";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ViewProductDetails />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/authentication" element={getUserInfo?<HomePage />:<AnimatedLoginPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}