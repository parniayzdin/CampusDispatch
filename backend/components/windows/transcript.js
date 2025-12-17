"use client";

import { Mic, User, Bot, Clock } from "lucide-react";

function TranscriptMessage({ msg }) {
  const isSystem = msg.role === "system";
  const isAI = msg.role === "ai";

  return (
    <div
      className={`flex gap-2 text-[0.7rem] ${
        isSystem ? "text-slate-500" : "text-slate-200"
      }`}
    >
      <div className="mt-[2px]">
        {isAI ? (
          <Bot className="w-3 h-3 text-sky-300" strokeWidth={1} />
        ) : isSystem ? (
          <Clock className="w-3 h-3" strokeWidth={1} />
        ) : (
          <User className="w-3 h-3 text-emerald-300" strokeWidth={1} />
        )}
      </div>

      <div className="flex-1">
        <p className="leading-relaxed">
          {msg.text}
        </p>
        {msg.time && (
          <p className="text-[0.6rem] text-slate-500 mt-0.5">
            {msg.time}
          </p>
        )}
      </div>
    </div>
  );
}

function TranscriptPanel({ transcript }) {
  const messages = transcript || [];

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border-t border-slate-800">
      <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between uppercase text-[0.7rem] tracking-wide">
        <p className="text-slate-300 flex items-center gap-2">
          <Mic className="w-3 h-3" strokeWidth={1} />
          Live Transcript
        </p>
        <span className="text-slate-500 text-[0.6rem] uppercase">
          Streaming
        </span>
      </div>

      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-slate-500 text-[0.65rem]">
            Transcript will appear here as the report is received.
          </p>
        )}

        {messages.map((msg, idx) => (
          <TranscriptMessage key={idx} msg={msg} />
        ))}
      </div>

      <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[0.6rem] text-slate-500">
        <span className="flex items-center gap-1">
          <Mic className="w-3 h-3" strokeWidth={1} />
          Audio capture active
        </span>
        <span>
          {messages.length} entries
        </span>
      </div>
    </div>
  );
}

TranscriptPanel.defaultProps = {
  transcript: [],
};

export default TranscriptPanel;
