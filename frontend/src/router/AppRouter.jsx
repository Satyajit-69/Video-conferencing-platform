import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Landing from "../pages/LandingPage";
import LoginPage from "../pages/login";
import Register from "../pages/Register";
import Navbar from "../utils/Navbar";
import Footer from "../utils/Footer";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/DashBoard";
import VideoMeeting from "../pages/VideoMeeting";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}

function MainRoutes() {
  const location = useLocation();

  // 👇 Hide navbar & footer when meeting is open
  const hideLayout = location.pathname.startsWith("/meetingroom/");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>

        {/* DEFAULT ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* VIDEO MEETING ROUTE */}
        <Route path="/meetingroom/:id" element={<VideoMeeting />} />

        {/* 404 PAGE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}
