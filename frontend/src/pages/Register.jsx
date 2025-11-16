import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Navbar from "../utils/Navbar";
import Footer from "../utils/Footer";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
        
        <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-800 p-10 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT: Illustration */}
          <div className="flex justify-center items-center">
            <img
              src="/assets/auth1.svg"
              alt="Register Illustration"
              className="w-[90%] drop-shadow-2xl"
            />
          </div>

          {/* RIGHT: Register Form */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400 mb-8 text-sm">
              Join us and start your journey
            </p>

            <form className="space-y-4">
              {/* FULL NAME */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-12 py-3 text-white placeholder-slate-500 text-sm"
                />
              </div>

              {/* EMAIL */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-12 py-3 text-white placeholder-slate-500 text-sm"
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-12 py-3 text-white placeholder-slate-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-12 py-3 text-white placeholder-slate-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirm ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* SIGNUP BUTTON */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition">
                Create Account
              </button>
            </form>

            {/* LINK: Already have an account */}
            <p className="text-center text-xs text-slate-400 mt-4">
              Already have an account?{" "}
              <a className="text-blue-400 font-semibold hover:underline" href="/login">
                Sign In
              </a>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Register;
