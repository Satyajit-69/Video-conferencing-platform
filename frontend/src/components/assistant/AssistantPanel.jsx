import { useState } from "react";
import { Bot, X, Send, Maximize2, Minimize2, Minus, RotateCcw, Copy } from "lucide-react";
import { AI_ENABLED } from "../../lib/utils";

export default function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Copy message to clipboard
  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  // 🔹 Clear chat
  const clearChat = () => {
    setMessages([
      { role: "assistant", content: "Hi 👋 How can I help you today?" },
    ]);
  };

  // 🔹 Send message to backend
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/assistant/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: input }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

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
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-xl flex items-center justify-center z-50 transition-all hover:scale-110"
      >
        <Bot size={24} className="text-white" />
      </button>
    );
  }

  // 🟡 MINIMIZED STATE
  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3 flex items-center gap-3 min-w-[250px]">
          <Bot size={20} className="text-purple-400" />
          <span className="text-slate-200 text-sm font-medium flex-1">
            ConferX Assistant
          </span>
          <button
            onClick={() => setMinimized(false)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // 🟣 EXPANDED PANEL (Window Mode)
  return (
    <div
      className={`fixed z-50 transition-all ${
        fullscreen
          ? "inset-0 m-0"
          : "bottom-6 right-6 w-96 h-[600px]"
      }`}
    >
      <div className="h-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Window Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-white" />
            <span className="text-white font-semibold">ConferX Assistant</span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Clear Chat Button */}
            <button
              onClick={clearChat}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Clear chat"
            >
              <RotateCcw size={16} className="text-white" />
            </button>
            
            {/* Minimize Button */}
            <button
              onClick={() => setMinimized(true)}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Minimize"
            >
              <Minus size={16} className="text-white" />
            </button>
            
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreen ? (
                <Minimize2 size={16} className="text-white" />
              ) : (
                <Maximize2 size={16} className="text-white" />
              )}
            </button>
            
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
              title="Close"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`group relative max-w-[80%] px-4 py-2.5 rounded-lg ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                
                {/* Copy Button */}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyMessage(msg.content)}
                    className="absolute -top-2 -right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy message"
                  >
                    <Copy size={12} className="text-slate-300" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 px-4 py-2.5 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span>Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700 bg-slate-900 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!AI_ENABLED}
              placeholder={
                AI_ENABLED
                  ? "Ask something..."
                  : "AI disabled (credits required)"
              }
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-200 text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!AI_ENABLED || loading || !input.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}