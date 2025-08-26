
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScrollToHash from "./hooks/ScrollController";
import AnimatedLoginPage from "./pages/LoginPage";
import { getUserInfo } from "./app/Localstorage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/authentication" element={getUserInfo?<HomePage />:<AnimatedLoginPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}