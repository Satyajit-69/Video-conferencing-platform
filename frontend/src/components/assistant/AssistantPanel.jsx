import { useState } from "react";
import { Bot, X } from "lucide-react";
import { AI_ENABLED } from "../../lib/utils";

export default function AssistantPanel() {
  const [open, setOpen] = useState(false);

  // 🟢 COLLAPSED ICON STATE
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-xl flex items-center justify-center z-50"
        title="Open AI Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
      </button>
    );
  }

  // 🟣 EXPANDED PANEL STATE
  return (
    <div className="fixed bottom-6 right-6 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            🤖 ConferX Assistant
          </h3>
          <p className="text-xs text-slate-400">
            AI-powered meeting assistant
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 text-sm text-slate-300 space-y-2">
        <p>• Meeting summaries</p>
        <p>• Action items</p>
        <p>• Smart Q&A</p>

        <button
          disabled={!AI_ENABLED}
          className={`mt-4 w-full py-2 rounded-lg text-sm ${
            AI_ENABLED
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
        >
          {AI_ENABLED ? "Ask Assistant" : "AI Disabled (Credits Required)"}
        </button>
      </div>
    </div>
  );
}
