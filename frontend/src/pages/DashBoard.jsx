import React, { useState } from "react";
import { 
  Video, Plus, Users, Clock, Calendar, Copy, ExternalLink, LogOut, Settings, Play 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [meetingCode, setMeetingCode] = useState("");

  const { user, logout } = useAuth(); // access logged user

  const upcomingMeetings = [
    { id: 1, title: "Team Standup", time: "10:00 AM", date: "Today", participants: 5, roomId: "abc-123" },
    { id: 2, title: "Client Presentation", time: "2:00 PM", date: "Today", participants: 8, roomId: "xyz-991" },
    { id: 3, title: "Project Review", time: "11:00 AM", date: "Tomorrow", participants: 6, roomId: "rev-778" }
  ];

  const recentMeetings = [
    { id: 1, title: "UI Design Review", date: "Jan 14, 2025", duration: "45 min", participants: 4 },
    { id: 2, title: "Sprint Planning", date: "Jan 12, 2025", duration: "1h 20min", participants: 7 }
  ];

  const handleJoinMeeting = () => {
    if (!meetingCode.trim()) return;
    window.location.href = `/meeting/${meetingCode}`;
  };

  const handleCreateMeeting = () => {
    const newId = Math.random().toString(36).substring(2, 10);
    window.location.href = `/meeting/${newId}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Meeting link copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      
      {/* Top Navbar */}
      <nav className="bg-slate-900/70 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ConferX</span>
          </div>

          <div className="flex items-center gap-5 text-slate-300">
            <button className="hover:text-white transition">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={logout} className="hover:text-white transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-1">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-slate-400">Ready for your next meeting?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">

          {/* New Meeting */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-blue-500/40 transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Start New Meeting</h3>
                <p className="text-slate-400 text-sm">Instant meeting now</p>
              </div>
            </div>
            <button
              onClick={handleCreateMeeting}
              className="w-full py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Start Meeting
            </button>
          </div>

          {/* Join Meeting */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-purple-500/40 transition">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Join Meeting</h3>
                <p className="text-slate-400 text-sm">Enter meeting code</p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Meeting code"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-purple-500 outline-none"
              />
              <button
                onClick={handleJoinMeeting}
                className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Upcoming Meetings */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
            <button className="text-blue-400 text-sm hover:text-blue-300">View all</button>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {upcomingMeetings.map((m) => (
              <div key={m.id} className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-blue-500/40 transition group">
                
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{m.title}</h3>
                    <div className="flex gap-2 text-sm text-slate-400 mt-1">
                      <Clock className="w-4 h-4" />
                      {m.time} • {m.date}
                    </div>
                  </div>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded">
                    {m.roomId}
                  </span>
                </div>

                <div className="flex items-center text-sm text-slate-400 mb-4">
                  <Users className="w-4 h-4 mr-2" /> {m.participants} participants
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => (window.location.href = `/meeting/${m.roomId}`)}
                    className="flex-1 bg-blue-600 py-2 rounded-lg text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Join
                  </button>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/meeting/${m.roomId}`)}
                    className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Recent Meetings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Meetings</h2>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {recentMeetings.map((m) => (
              <div key={m.id} className="p-5 flex justify-between items-center hover:bg-slate-800/40 transition">

                <div>
                  <h3 className="font-medium">{m.title}</h3>
                  <div className="flex gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {m.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {m.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {m.participants}
                    </span>
                  </div>
                </div>

                <button className="text-blue-400 text-sm hover:text-blue-300">
                  View Details
                </button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
