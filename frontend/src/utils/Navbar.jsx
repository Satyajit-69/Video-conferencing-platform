import React, { useState, useEffect } from "react";
import { Video, Menu, X, User,LayoutDashboard  } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // <-- IMPORTANT

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth(); // <-- REAL AUTH

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full z-[999] transition-all mb-5 text-white duration-300 ${
          scrolled
            ? "bg-slate-900/80 backdrop-blur-lg border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ConferX</span>
          </div>

          {/* DESKTOP MENU */}
          <div className="md:flex items-center gap-8">
            <a href="/" className="hover:text-blue-400 transition">Home</a>
            <a href="/#features" className="hover:text-blue-400 transition">Features</a>
            <a href="/#pricing" className="hover:text-blue-400 transition">Pricing</a>
            <a href="/#about" className="hover:text-blue-400 transition">About</a>

            {/* IF LOGGED OUT */}
            {!isAuthenticated && (
              <>
                <a href="/login" className="hover:text-blue-400 transition">Login</a>
                <a href="/register" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Sign Up
                </a>
              </>
            )}

            {/* IF LOGGED IN */}
            {isAuthenticated && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-full hover:bg-slate-700 transition"
              >
                <User className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-white/10 text-white">
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="/" className="hover:text-blue-400 transition">Home</a>
              <a href="/#features" className="hover:text-blue-400 transition">Features</a>
              <a href="/#pricing" className="hover:text-blue-400 transition">Pricing</a>
              <a href="/#about" className="hover:text-blue-400 transition">About</a>

              {!isAuthenticated && (
                <>
                  <a href="/login" className="hover:text-blue-400 transition">Login</a>
                  <a
                    href="/register"
                    className="bg-blue-600 px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </a>
                </>
              )}

              {isAuthenticated && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition text-left"
                >
                  <User className="inline-block mr-2" /> Account
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* DRAWER OVERLAY */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/50 z-[998]"
        ></div>
      )}

      {/* RIGHT DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-blue-800/110 border-l border-slate-700 z-[999] transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h1  className="text-lg font-bold text-white">{user?.name || "Your Account"}</h1>
          <button onClick={() => setDrawerOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

         {/* OVERLAY */}
{drawerOpen && (
  <div
    onClick={() => setDrawerOpen(false)}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] animate-fadeIn"
  />
)}

{/* HOTSTAR STYLE RIGHT DRAWER */}
<div
  className={`
    fixed top-0 right-0 h-full w-72 
    bg-[#0B0F18]/95 backdrop-blur-xl
    border-l border-white/10
    z-[999]
    transform transition-all duration-200 
    rounded-l-2xl shadow-2xl
    ${drawerOpen ? "translate-x-0 animate-slideIn" : "translate-x-full"}
  `}
>
  {/* LOGGED IN USER */}
  <div className="p-5 border-b border-white/10 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <User className="text-white" />
    </div>
    <div className="text-white">
      <h2 className="text-lg font-semibold">{user?.name || "My Account"}</h2>
      <p className="text-xs text-slate-400">View & manage your profile</p>
    </div>
  </div>

  {/* MENU ITEMS */}
  <div className="mt-3 px-2 flex flex-col gap-2">
    {[
      { label: "Home", icon: <Video className="w-5 h-5" />, link: "/" },
      { label: "Your DashBoard", icon: <LayoutDashboard  className="w-5 h-5" />, link: "/dashboard" },
      { label: "Profile", icon: <User className="w-5 h-5" />, link: "/profile" },
      { label: "Settings", icon: <Menu className="w-5 h-5" />, link: "/settings" },
    ].map((item, i) => (
      <a
        key={i}
        href={item.link}
        className="
          flex items-center gap-4 p-3 rounded-xl text-slate-300 
          hover:bg-white/10 hover:text-white transition-all duration-200
          group relative
        "
      >
        {/* Glow bar like Hotstar */}
        <span className="
          absolute left-0 top-0 h-full w-1 
          bg-blue-500 rounded-r-full 
          opacity-0 group-hover:opacity-100 transition-all
        "></span>

        {/* icon */}
        <span className="text-white opacity-70 group-hover:opacity-100 transition">
          {item.icon}
        </span>

        {/* text */}
        <span className="font-medium tracking-wide">
          {item.label}
        </span>
      </a>
    ))}
  </div>

  {/* LOGOUT AT BOTTOM */}
  <div className="absolute bottom-5 left-0 w-full px-5">
    <button
      onClick={() => {
        logout();
        setDrawerOpen(false);
      }}
      className="
        w-full py-3 rounded-xl bg-red-600 
        hover:bg-red-700 text-white 
        font-semibold transition-all duration-300
      "
    >
      Logout
    </button>
  </div>
</div>

<style>{`
  .animate-slideIn {
    animation: slideInDrawer 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes slideInDrawer {
    0% { transform: translateX(100%) scale(0.95); opacity: 0.2; }
    60% { transform: translateX(-6px) scale(1); }
    100% { transform: translateX(0); opacity: 1; }
  }

  .animate-fadeIn {
    animation: fadeInOverlay 0.4s ease-out;
  }

  @keyframes fadeInOverlay {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`}</style>

      </div>
    </>
  );
}

export default Navbar;
