import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ScheduleMeeting() {
  const navigate = useNavigate();

  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingPurpose, setMeetingPurpose] = useState("");
  const [duration, setDuration] = useState("30");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleScheduleMeeting = async () => {
    if (!meetingTitle || !meetingPurpose || !scheduledAt) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/meetings/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            meetingTitle,
            meetingPurpose,
            duration,
            isPublic: true,
            scheduledAt, // 🔥 future date
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert("Failed to schedule meeting");
        return;
      }

      alert("Meeting scheduled successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Schedule a Meeting</h1>

        <input
          type="text"
          placeholder="Meeting Title"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-slate-800 rounded-lg"
        />

        <input
          type="text"
          placeholder="Meeting Purpose"
          value={meetingPurpose}
          onChange={(e) => setMeetingPurpose(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-slate-800 rounded-lg"
        />

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-slate-800 rounded-lg"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </select>

        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full mb-6 px-4 py-3 bg-slate-800 rounded-lg"
        />

        <button
          onClick={handleScheduleMeeting}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold"
        >
          Schedule Meeting
        </button>
      </div>
    </div>
  );
}
