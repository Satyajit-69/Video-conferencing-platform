import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Landing from "../pages/LandingPage";
import LoginPage from "../pages/login";
import Register from "../pages/Register";
import Dashboard from "../pages/DashBoard";
import VideoMeeting from "../pages/VideoMeeting";
import CreateMeeting from "../pages/CreateMeeting";
import NotFound from "../pages/NotFound";

import Navbar from "../utils/Navbar";
import Footer from "../utils/Footer" ;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}

function MainRoutes() {
  const location = useLocation();

  // 👇 Hide layout for full-screen experiences
  const hideLayout =
    location.pathname.startsWith("/meetingroom/") ||
    location.pathname.startsWith("/create-meeting");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* LANDING */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* CREATE MEETING */}
        <Route path="/create-meeting" element={<CreateMeeting />} />

        {/* VIDEO MEETING */}
        <Route path="/meetingroom/:id" element={<VideoMeeting />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}
