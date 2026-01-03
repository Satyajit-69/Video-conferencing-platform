import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  Clock,
  Calendar,
  Copy,
  ExternalLink,
  Play,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AssistantPanel from "../components/assistant/AssistantPanel";

export default function Dashboard() {
  const { user, welcomeMode } = useAuth();
  const navigate = useNavigate();

  const [meetingCode, setMeetingCode] = useState("");
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------
  // FETCH MEETINGS FROM DB
  // --------------------------------------
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://video-conferencing-platform-98jv.onrender.com/api/meetings/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!data.success) return;

        const now = new Date();

        setUpcomingMeetings(
          data.meetings.filter(
            (m) => new Date(m.date) >= now
          )
        );

        setRecentMeetings(
          data.meetings.filter(
            (m) => new Date(m.date) < now
          )
        );
      } catch (err) {
        console.error("Dashboard meeting fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // --------------------------------------
  // ACTION HANDLERS
  // --------------------------------------
  const handleJoinMeeting = () => {
    if (!meetingCode.trim()) return;
    navigate(`/meetingroom/${meetingCode}`);
  };

  const handleCreateMeeting = () => {
    navigate("/create-meeting");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Meeting link copied!");
  };

  // --------------------------------------
  // DYNAMIC WELCOME TEXT
  // --------------------------------------
  const headingText =
    welcomeMode === "register"
      ? `Welcome, ${user?.name || "User"} 🎉`
      : `Welcome back, ${user?.name || "User"} 👋`;

  const subText =
    welcomeMode === "register"
      ? "Start your first meeting now!"
      : "Ready for your next meeting?";

  // --------------------------------------
  // UI
  // --------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 pt-4">

        {/* Welcome */}
        <div className="mb-10 mt-12 pt-4">
          <h1 className="text-4xl font-bold mb-1 flex items-center gap-2">
            {headingText}
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-600/20 text-purple-400">
              AI
            </span>
          </h1>
          <p className="text-slate-400">{subText}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Start New Meeting</h3>
                <p className="text-slate-400 text-sm">Create a hosted meeting</p>
              </div>
            </div>
            <button
              onClick={handleCreateMeeting}
              className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Create Meeting
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <ExternalLink className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Join Meeting</h3>
                <p className="text-slate-400 text-sm">Enter meeting code</p>
              </div>
            </div>

            <div className="flex gap-3">
              <input
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
                placeholder="Meeting code"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
              />
              <button
                onClick={handleJoinMeeting}
                className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Upcoming Meetings</h2>

          {loading ? (
            <p className="text-slate-400">Loading meetings...</p>
          ) : upcomingMeetings.length === 0 ? (
            <p className="text-slate-400">No upcoming meetings.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {upcomingMeetings.map((m) => (
                <div
                  key={m._id}
                  className="bg-slate-900/50 p-5 rounded-xl border border-slate-800"
                >
                  <h3 className="font-bold text-lg mb-1">
                    {m.meetingTitle || "Untitled Meeting"}
                  </h3>
                  <div className="text-sm text-slate-400 flex gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    {new Date(m.date).toLocaleString()}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/meetingroom/${m.meetingCode}`)
                      }
                      className="flex-1 bg-blue-600 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" /> Join
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/meetingroom/${m.meetingCode}`
                        )
                      }
                      className="p-2 bg-slate-800 rounded-lg"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Meetings */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Meetings</h2>

          {recentMeetings.length === 0 ? (
            <p className="text-slate-400">No past meetings.</p>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {recentMeetings.map((m) => (
                <div
                  key={m._id}
                  className="p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">
                      {m.meetingTitle || "Untitled Meeting"}
                    </h3>
                    <div className="text-sm text-slate-400 flex gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(m.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Host
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded">
                    {m.meetingCode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <AssistantPanel />
    </div>
  );
}
