import React, { useState, useEffect } from "react";
import { 
  Video, Menu, X, User, LayoutDashboard, 
  Settings, LogOut, Home, Sparkles, CreditCard,
  Search
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  // 🔥 Detect if user is inside a meeting room
  const inMeeting = window.location.pathname.startsWith("/meeting");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", show: !inMeeting },
    { label: "Features", href: "/#features", show: !inMeeting },
    { label: "Pricing", href: "/#pricing", show: !inMeeting },
    { label: "About", href: "/#about", show: !inMeeting },
  ];

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, link: "/dashboard" },
    { label: "Profile", icon: <User className="w-5 h-5" />, link: "/profile" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, link: "/settings" },
    { label: "Billing", icon: <CreditCard className="w-5 h-5" />, link: "/billing" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed w-full z-[999] transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white hidden sm:block">
                Confer<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">X</span>
              </span>
            </a>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.filter(link => link.show).map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium text-sm relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Search Button - Desktop Only */}
              {!inMeeting && (
                <button className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white text-sm">
                  <Search className="w-4 h-4" />
                  <span className="hidden xl:inline">Search</span>
                </button>
              )}

              {/* Auth Buttons - Desktop */}
              {!inMeeting && !isAuthenticated && (
                <div className="hidden md:flex items-center gap-3">
                  <a
                    href="/login"
                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
                  >
                    Sign Up
                  </a>
                </div>
              )}

              {/* User Menu Button */}
              {isAuthenticated && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30"
                >
                  <User className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></span>
                </button>
              )}

              {/* Mobile Menu Button */}
              {!inMeeting && (
                <button
                  className="md:hidden w-10 h-10 flex items-center justify-center text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {!inMeeting && (
          <div
            className={`md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-slate-700/50 overflow-hidden transition-all duration-300 ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.filter(link => link.show).map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-slate-700/50 space-y-2">
                  <a
                    href="/login"
                    className="block px-4 py-3 text-center text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </div>
              )}

              {/* Mobile Quick Actions */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-slate-700/50 flex items-center justify-around">
                  <button
                    onClick={() => {
                      setDrawerOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-xs">Account</span>
                  </button>
                  <a
                    href="/dashboard"
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-xs">Dashboard</span>
                  </a>
                  <a
                    href="/settings"
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-xs">Settings</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* BACKDROP */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] animate-fadeIn"
        ></div>
      )}

      {/* RIGHT DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-slate-900/98 backdrop-blur-xl border-l border-slate-700/50 z-[999]
          transform transition-transform duration-300 shadow-2xl
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="relative p-6 border-b border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
              <p className="text-sm text-slate-400">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-400">Meetings</p>
              <p className="text-lg font-bold text-white">24</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-400">Hours</p>
              <p className="text-lg font-bold text-white">48</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-400">Credits</p>
              <p className="text-lg font-bold text-blue-400">150</p>
            </div>
          </div>
        </div>

        {/* MENU LIST */}
        <div className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
          {menuItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              className="flex items-center gap-4 p-4 rounded-xl text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group relative overflow-hidden"
              onClick={() => setDrawerOpen(false)}
            >
              <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-all"></span>
              <span className="text-slate-400 group-hover:text-white transition-colors">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}

          {/* Premium Banner */}
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="text-white font-semibold">Upgrade to Pro</h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">Unlock unlimited meetings and advanced features</p>
            <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white text-sm font-medium transition-all transform hover:scale-105">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
          <button
            onClick={() => {
              logout();
              setDrawerOpen(false);
            }}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;