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