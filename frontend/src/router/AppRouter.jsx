import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/LandingPage";
import LoginPage from "../pages/login";
import Register from "../pages/Register";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT ROUTE */}
        <Route path="/" element={<Landing />} />

        {/* AUTH ROUTES */}
         <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* MAIN APP ROUTES */}
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meeting/:roomId" element={<Meeting />} /> */}

        {/* 404 */}
        {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}
