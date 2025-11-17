import React, { useState, useEffect } from 'react';
import { Video, Menu, X } from 'lucide-react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all  text-white duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>   
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">        
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">ConferX</span>
        </div>

        {/* DESKTOP MENU */}
        <div className=" md:flex items-center gap-8 text-white">
          <a href="/" className="hover:text-blue-400 transition">Home</a>
          <a href="/#features" className="hover:text-blue-400 transition">Features</a>
          <a href="/#pricing" className="hover:text-blue-400 transition">Pricing</a>
          <a href="/#about" className="hover:text-blue-400 transition">About</a>

          {/* SIMPLE LOGIN + SIGNUP */}
          <a href="/login" className="hover:text-blue-400 transition">Login</a>

          <a
            href="/register"
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
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

            <a href="/login" className="hover:text-blue-400 transition">Login</a>

            <a
              href="/register"
              className="bg-blue-600 px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar ;