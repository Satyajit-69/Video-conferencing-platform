import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { AI_ENABLED } from "../../lib/utils";

export default function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Send message to backend
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

const res = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/api/assistant/chat`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ message: input }),
  }
);


      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "No response from AI." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ AI service unavailable." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 COLLAPSED STATE
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-xl flex items-center justify-center z-50"
      >
        <Bot className="w-6 h-6 text-white" />
      </button>
    );
  }

  // 🟣 EXPANDED PANEL
  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          🤖 ConferX Assistant
        </h3>
        <button onClick={() => setOpen(false)}>
          <X className="w-5 h-5 text-slate-400 hover:text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[85%] px-3 py-2 rounded-lg ${
              msg.role === "user"
                ? "ml-auto bg-purple-600 text-white"
                : "mr-auto bg-slate-800 text-slate-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-slate-400 text-xs">Assistant is typing...</div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!AI_ENABLED}
          placeholder={
            AI_ENABLED ? "Ask something..." : "AI disabled (credits required)"
          }
          className="flex-1 px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm outline-none disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!AI_ENABLED || loading}
          className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
