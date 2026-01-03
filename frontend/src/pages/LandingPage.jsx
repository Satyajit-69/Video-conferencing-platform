import React, { useState, useEffect } from 'react';
import { Video, Users, Shield, Zap, Globe, Star, ArrowRight, Play, Check, Menu, X, Sparkles } from 'lucide-react';

export default function VideoConferencingLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  
  const words = ['Limits', 'Boundaries', 'Compromise', 'Barriers'];
  const fullText = words[wordIndex];

  // Typewriter effect
  useEffect(() => {
    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText('');
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, fullText, wordIndex, words.length]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
  

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950 z-10"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-float-delayed"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 text-sm backdrop-blur-xl animate-slide-down">
                <Star className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                <span>Trusted by 10M+ users worldwide</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="animate-slide-right inline-block">Meet Without</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block min-h-[1.2em]">
                  {displayedText}
                  <span className="animate-blink">|</span>
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 animate-slide-up">
                The most reliable video conferencing platform for teams of all sizes. Crystal clear quality, enterprise security, unlimited possibilities.
              </p>

              <div className="flex flex-wrap gap-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition hover:scale-105 flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border border-slate-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition hover:scale-105 flex items-center gap-2 backdrop-blur-xl">
                  <Play className="w-5 h-5" /> Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {stats.map((stat, i) => (
                  <div 
                    key={i} 
                    className="backdrop-blur-xl bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 animate-slide-up hover:scale-105 transition-transform"
                    style={{animationDelay: `${0.3 + i * 0.1}s`}}
                  >
                    <div className="text-3xl font-bold text-blue-400">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-left">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-700 rounded-full w-32 mb-2 animate-pulse"></div>
                      <div className="h-2 bg-slate-700/70 rounded-full w-20 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-bounce-slow">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <span className="text-xs text-green-400 font-semibold">Live</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-110 cursor-pointer group overflow-hidden animate-fade-in"
                      style={{animationDelay: `${i * 0.1}s`}}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full group-hover:scale-110 transition-transform duration-300 animate-pulse"
                          style={{ animationDelay: `${i * 0.3}s` }}
                        ></div>
                      </div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-slate-300 border border-slate-700">
                        User {i + 1}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 font-semibold">Recording</span>
                    <span className="text-sm text-slate-500">•</span>
                    <span className="text-sm text-slate-400 font-mono">42:18</span>
                  </div>
                  <div className="flex items-center gap-2">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-400">Everything you need for seamless collaboration</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 animate-slide-up"
                  style={{animationDelay: `${i * 0.1}s`}}
                  onMouseEnter={() => setActiveFeature(i)}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 ${activeFeature === i ? 'scale-110 rotate-12' : ''}`}>
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
       {/* AI ASSISTANT SECTION */}
<section id="ai-assistant" className="py-28 px-6 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900 relative overflow-hidden">
  {/* Glow blobs */}
  <div className="absolute top-20 left-10 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl animate-float"></div>
  <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float-delayed"></div>

  <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-14 items-center">
    
    {/* LEFT CONTENT */}
    <div className="space-y-8 animate-slide-right">
      <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 text-sm backdrop-blur-xl">
        <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
        <span>AI-Powered Assistant</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold leading-tight">
        Meet Your <br />
        <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Smart Meeting Assistant
        </span>
      </h2>

      <p className="text-lg text-slate-300">
        ConferX AI is your personal productivity companion.  
        It understands context, remembers conversations, and assists you
        throughout your meetings — just like a real teammate.
      </p>

      <ul className="space-y-4">
        {[
          "💬 Ask questions during live meetings",
          "🧠 Remembers past conversations securely",
          "⚡ Instant, context-aware responses",
          "🔐 Private per-user AI memory",
          "📈 Boosts productivity & focus"
        ].map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-slate-200 animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <Check className="w-5 h-5 text-green-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-4 pt-4">
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
          Try AI Assistant
        </button>
        <button className="border border-slate-600 px-6 py-3 rounded-xl hover:bg-slate-800 transition">
          Learn More
        </button>
      </div>
    </div>

    {/* RIGHT ASSISTANT PREVIEW */}
    <div className="relative animate-slide-left">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl">
          <div className="flex items-center gap-2 text-white font-semibold">
            🤖 ConferX Assistant
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white/80 rounded-full"></div>
            <div className="w-3 h-3 bg-white/60 rounded-full"></div>
            <div className="w-3 h-3 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Chat body */}
        <div className="p-4 space-y-3 text-sm h-72 overflow-hidden">
          <div className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg w-fit">
            Hi 👋 How can I help you today?
          </div>

          <div className="bg-purple-600 text-white px-3 py-2 rounded-lg w-fit ml-auto">
            What is my name?
          </div>

          <div className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg w-fit">
            Your name is <strong>Satyajit</strong>.
          </div>

          <div className="bg-purple-600 text-white px-3 py-2 rounded-lg w-fit ml-auto">
            Summarize today’s meeting
          </div>

          <div className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg w-fit">
            You discussed UI improvements, AI integration, and deployment status.
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-slate-700 p-3 flex gap-2">
          <input
            disabled
            placeholder="Ask something..."
            className="flex-1 bg-slate-800 px-3 py-2 rounded-lg text-slate-400 text-sm"
          />
          <button className="bg-purple-600 px-4 rounded-lg text-white">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-slate-400">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-slide-up ${i === 1 ? 'border-blue-500 shadow-2xl shadow-blue-500/20 md:scale-105' : 'border-slate-700'}`}
                style={{animationDelay: `${i * 0.15}s`}}
              >
                {i === 1 && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4 animate-bounce-slow">
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
                    <li key={j} className="flex items-center gap-2 animate-fade-in" style={{animationDelay: `${(i * 0.15) + (j * 0.05)}s`}}>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${i === 1 ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50' : 'border border-slate-600 hover:bg-slate-800'}`}>
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden animate-slide-up hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full filter blur-3xl animate-float"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full filter blur-3xl animate-float-delayed"></div>
            </div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Meetings?</h2>
              <p className="text-xl mb-8 text-blue-100">Join millions of teams already using ConferX</p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-110 inline-flex items-center gap-2">
                Start Your Free Trial <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-slide-right {
          animation: slideRight 0.6s ease-out;
        }

        .animate-slide-left {
          animation: slideLeft 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }

        .animate-blink {
          animation: blink 1s step-end infinite;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}