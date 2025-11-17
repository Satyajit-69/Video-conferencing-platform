import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/LandingPage";
import LoginPage from "../pages/login";
import Register from "../pages/Register";
import Navbar from "../utils/Navbar";
import Footer from "../utils/Footer";
import NotFound from "../pages/NotFound";
import Dashboard from "@/pages/DashBoard";
export default function AppRouter() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        {/* DEFAULT ROUTE */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />

        {/* AUTH ROUTES */}
         <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* MAIN APP ROUTES */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/meeting/:roomId" element={<Meeting />} /> */ }

        {/* 404 */}
        <Route path="*" element = {<NotFound />} />
      </Routes >
      <Footer />
    </BrowserRouter>
  );
}
