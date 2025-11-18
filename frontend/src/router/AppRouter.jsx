import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/LandingPage";
import LoginPage from "../pages/login";
import Register from "../pages/Register";
import Navbar from "../utils/Navbar";
import Footer from "../utils/Footer";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/DashBoard";
import VideoMeeting from "../pages/VideoMeeting";
import MeetingRoom from "../pages/MeetingRoom";   // <-- IMPORTANT

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* DEFAULT ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* MEETING ROUTE */}
        <Route path="/meeting/:roomId" element={<MeetingRoom />} />

        {/* TEMP TEST ROUTE FOR VIDEO MEETING UI */}
        <Route path="/meetingroom" element={<VideoMeeting />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
