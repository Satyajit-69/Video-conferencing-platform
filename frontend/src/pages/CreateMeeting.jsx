import React, { useState } from 'react';
import { 
  Video, Users, Calendar, Clock, Copy, Check, 
  ArrowRight, Sparkles, Globe, Lock, ChevronDown,
  User, Briefcase, GraduationCap, Coffee, MessageSquare
} from 'lucide-react';

export default function CreateMeeting() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    hostName: '',
    meetingTitle: '',
    meetingPurpose: '',
    duration: '30',
    isPublic: true,
    password: ''
  });
  const [copied, setCopied] = useState(false);
  const [generatedRoomId] = useState(generateRoomId());

  const purposes = [
    { icon: Briefcase, label: 'Business Meeting', value: 'business' },
    { icon: Users, label: 'Team Collaboration', value: 'team' },
    { icon: GraduationCap, label: 'Educational', value: 'education' },
    { icon: Coffee, label: 'Casual Chat', value: 'casual' },
    { icon: MessageSquare, label: 'Interview', value: 'interview' },
    { icon: Sparkles, label: 'Other', value: 'other' }
  ];

  function generateRoomId() {
    return Math.random().toString(36).substring(2, 10);
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/meetingroom/${generatedRoomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

const handleStartMeeting = () => {
  const meetingData = {
    roomId: generatedRoomId,
    hostName: formData.hostName,
    meetingTitle: formData.meetingTitle,
    meetingPurpose: formData.meetingPurpose,
    duration: formData.duration,
    createdAt: new Date().toISOString(),
    isHost: true,
  };

  // Save locally
  localStorage.setItem(
    `meeting_${generatedRoomId}`,
    JSON.stringify(meetingData)
  );

  // Redirect
  window.location.href = `/meetingroom/${generatedRoomId}`;
};



  const isStepOneValid = formData.hostName.trim() && formData.meetingTitle.trim();
  const isStepTwoValid = formData.meetingPurpose;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-center p-6">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">ConferX</h1>
          </div>
          <p className="text-slate-400 text-lg">Create your meeting in seconds</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-400' : 'text-slate-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-blue-500' : 'bg-slate-800'}`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <span className="hidden sm:inline font-medium">Meeting Info</span>
          </div>
          <div className={`h-1 w-16 rounded-full transition-all ${step >= 2 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-400' : 'text-slate-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-blue-500' : 'bg-slate-800'}`}>
              {step > 2 ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <span className="hidden sm:inline font-medium">Purpose</span>
          </div>
          <div className={`h-1 w-16 rounded-full transition-all ${step >= 3 ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-400' : 'text-slate-600'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? 'bg-blue-500' : 'bg-slate-800'}`}>
              3
            </div>
            <span className="hidden sm:inline font-medium">Ready</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          {/* Step 1: Meeting Info */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-3xl font-bold mb-2">Let's set up your meeting</h2>
                <p className="text-slate-400">Tell us a bit about yourself and the meeting</p>
              </div>

              {/* Host Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <User className="w-4 h-4 inline mr-2" />
                  Your Name (Host)
                </label>
                <input
                  type="text"
                  value={formData.hostName}
                  onChange={(e) => handleChange('hostName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Meeting Title */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <Video className="w-4 h-4 inline mr-2" />
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={formData.meetingTitle}
                  onChange={(e) => handleChange('meetingTitle', e.target.value)}
                  placeholder="e.g., Team Weekly Sync"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Expected Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>

              {/* Privacy */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleChange('isPublic', true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.isPublic ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/30'}`}
                >
                  <Globe className={`w-6 h-6 mx-auto mb-2 ${formData.isPublic ? 'text-blue-400' : 'text-slate-400'}`} />
                  <p className="font-semibold">Public</p>
                  <p className="text-xs text-slate-400">Anyone with link can join</p>
                </button>
                <button
                  onClick={() => handleChange('isPublic', false)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${!formData.isPublic ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 bg-slate-800/30'}`}
                >
                  <Lock className={`w-6 h-6 mx-auto mb-2 ${!formData.isPublic ? 'text-purple-400' : 'text-slate-400'}`} />
                  <p className="font-semibold">Private</p>
                  <p className="text-xs text-slate-400">Password protected</p>
                </button>
              </div>

              {!formData.isPublic && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Meeting Password
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter a password"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!isStepOneValid}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 group"
              >
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Step 2: Purpose */}
          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-3xl font-bold mb-2">What's this meeting about?</h2>
                <p className="text-slate-400">Help us customize your experience</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {purposes.map((purpose) => {
                  const Icon = purpose.icon;
                  const isSelected = formData.meetingPurpose === purpose.value;
                  return (
                    <button
                      key={purpose.value}
                      onClick={() => handleChange('meetingPurpose', purpose.value)}
                      className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'}`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      <p className="font-semibold text-sm">{purpose.label}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!isStepTwoValid}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Ready to Start */}
          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-2">All Set! 🎉</h2>
                <p className="text-slate-400">Your meeting room is ready</p>
              </div>

              {/* Meeting Summary */}
              <div className="bg-slate-800/50 rounded-xl p-6 space-y-4 border border-slate-700">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">Host</p>
                    <p className="font-semibold">{formData.hostName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">Meeting Title</p>
                    <p className="font-semibold">{formData.meetingTitle}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">Duration</p>
                    <p className="font-semibold">{formData.duration === 'unlimited' ? 'Unlimited' : `${formData.duration} minutes`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {formData.isPublic ? (
                    <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">Privacy</p>
                    <p className="font-semibold">{formData.isPublic ? 'Public Meeting' : 'Private (Password Protected)'}</p>
                  </div>
                </div>
              </div>

              {/* Room Link */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Meeting Room Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/meetingroom/${generatedRoomId}`}
                    readOnly
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 font-mono text-sm"
                  />
                  <button
                    onClick={copyRoomLink}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all hover:scale-105 flex items-center gap-2"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Share this link with participants</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleStartMeeting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 group shadow-lg shadow-green-500/30"
                >
                  <Video className="w-5 h-5" />
                  Start Meeting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          By starting a meeting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-slide-up { animation: slideUp 0.5s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite; animation-delay: 3s; }
        .animate-bounce-slow { animation: bounceSlow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}