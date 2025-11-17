import React, { useState, useEffect } from 'react';
import { Video, Users, Shield, Zap, Globe, Star, ArrowRight, Play, Check, Menu, X, Sparkles } from 'lucide-react';
import Footer from '../utils/Footer';
import Navbar from '../utils/Navbar';

export default function VideoConferencingLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Video, title: "Crystal Clear HD", desc: "4K video quality with advanced noise cancellation" },
    { icon: Users, title: "Unlimited Participants", desc: "Host meetings with thousands of attendees" },
    { icon: Shield, title: "Bank-Level Security", desc: "End-to-end encryption for all your calls" },
    { icon: Zap, title: "Lightning Fast", desc: "Connect instantly with zero lag or delays" }
  ];

  const stats = [
    { number: "10M+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Countries" },
    { number: "4.9/5", label: "User Rating" }
  ];

  const plans = [
    { name: "Starter", price: "Free", features: ["Up to 100 participants", "40-minute limit", "HD video quality", "Screen sharing"] },
    { name: "Professional", price: "$12", features: ["Unlimited participants", "No time limits", "4K video quality", "Cloud recording", "Custom branding", "Priority support"] },
    { name: "Enterprise", price: "Custom", features: ["Dedicated infrastructure", "Advanced analytics", "SSO integration", "24/7 phone support", "SLA guarantee", "Custom integrations"] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">

      {/* Hero Section with Image Background */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1920&q=80"
            alt="Video conference background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 text-sm backdrop-blur-xl">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Trusted by 10M+ users worldwide</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Meet Without
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Limits</span>
              </h1>
              
              <p className="text-xl text-slate-300">
                The most reliable video conferencing platform for teams of all sizes. Crystal clear quality, enterprise security, unlimited possibilities.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border border-slate-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition flex items-center gap-2 backdrop-blur-xl">
                  <Play className="w-5 h-5" /> Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {stats.map((stat, i) => (
                  <div key={i} className="backdrop-blur-xl bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-3xl font-bold text-blue-400">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl">
                {/* Video Conference Header */}
                <div className="flex items-center justify-between mb-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-700 rounded-full w-32 mb-2 animate-pulse"></div>
                      <div className="h-2 bg-slate-700/70 rounded-full w-20 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400 font-semibold">Live</span>
                    </div>
                  </div>
                </div>
                
                {/* Main Video Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden"
                    >
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* User Avatar */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full group-hover:scale-110 transition-transform duration-300"
                          style={{ 
                            animation: `pulse 2s infinite ${i * 0.3}s` 
                          }}
                        ></div>
                      </div>
                      
                      {/* Microphone indicator */}
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Name tag */}
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-slate-300 border border-slate-700">
                        User {i + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Control Bar */}
                <div className="flex items-center justify-between bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 font-semibold">Recording</span>
                    <span className="text-sm text-slate-500">•</span>
                    <span className="text-sm text-slate-400 font-mono">42:18</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Control buttons */}
                    <div className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                      <Video className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                      <Users className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/30">
                      <X className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Participant count */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>6 participants in call</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-400">Everything you need for seamless collaboration</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition cursor-pointer ${activeFeature === i ? 'border-blue-500 shadow-xl shadow-blue-500/20' : ''}`}
                  onMouseEnter={() => setActiveFeature(i)}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image Features Section */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 text-sm mb-6 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>See It In Action</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience the Difference</h2>
            <p className="text-xl text-slate-400">Watch how ConferX transforms your meetings</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Image Demo 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl overflow-hidden group-hover:border-blue-500/50 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80"
                  alt="Crystal Clear Quality"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Crystal Clear Quality</h3>
                  <p className="text-slate-400">Experience 4K video with AI-powered noise cancellation</p>
                </div>
              </div>
            </div>

            {/* Image Demo 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl overflow-hidden group-hover:border-purple-500/50 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80"
                  alt="Seamless Collaboration"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Seamless Collaboration</h3>
                  <p className="text-slate-400">Connect with unlimited participants from anywhere</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Image Demo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl overflow-hidden group-hover:border-blue-500/50 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                  alt="Enterprise Ready"
                  className="w-full h-full min-h-96 object-cover"
                />
                <div className="p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-sm mb-6 w-fit">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Enterprise Ready</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">Built for Business</h3>
                  <p className="text-lg text-slate-400 mb-6">
                    Bank-level security, 99.9% uptime, and dedicated support for your team's success.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-slate-300">End-to-end encryption</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-slate-300">SOC 2 & GDPR compliant</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-slate-300">24/7 dedicated support</span>
                    </li>
                  </ul>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 w-fit">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-slate-400">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-8 hover:border-blue-500 transition ${i === 1 ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-105' : 'border-slate-700'}`}
              >
                {i === 1 && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-slate-400">/month</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition ${i === 1 ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50' : 'border border-slate-600 hover:bg-slate-800'}`}>
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Meetings?</h2>
              <p className="text-xl mb-8 text-blue-100">Join millions of teams already using ConferX</p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2">
                Start Your Free Trial <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}