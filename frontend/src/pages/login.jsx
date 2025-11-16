import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Navbar from "../utils/Navbar";
import Footer from "../utils/Footer";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
        
        <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-800 p-10 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT: Illustration */}
          <div className="flex justify-center items-center">
            <img
              src="/assets/auth2.svg"
              alt="Login Illustration"
              className="w-[90%] drop-shadow-2xl"
            />
          </div>

          {/* RIGHT: Login Form */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 mb-8 text-sm">
              Enter your credentials to continue
            </p>

            <form className="space-y-4">
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

              {/* SUBMIT */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition">
                Sign In
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-4">
              Don’t have an account?{" "}
              <a className="text-blue-400 font-semibold hover:underline" href="/register">
                Sign Up
              </a>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default LoginPage;
