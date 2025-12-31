"use client";

import "regenerator-runtime/runtime";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import IncidentHeatmap from "@/components/IncidentHeatmap";


function randomId() {
  return crypto?.randomUUID?.() || String(Date.now());
}

function nowIso() {
  return new Date().toISOString();
}

function generateCaseNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `CDL-${n}`;
}

export default function Dictaphone() {
  const [segments, setSegments] = useState([]);
  const [firstClick, setFirstClick] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [caseId, setCaseId] = useState(null);
  const [caseNumber, setCaseNumber] = useState("Pending");

  const intervalIdRef = useRef(null);
  const previousTranscriptRef = useRef("");

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (!listening) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    if (!startTime) setStartTime(Date.now());

    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    const id = setInterval(() => {
      if (!transcript || startTime === null) return;

      const elapsed = Number(((Date.now() - startTime) / 1000).toFixed(2));
      const prevLen = previousTranscriptRef.current.length;
      const newChunk = transcript.slice(prevLen).trim();

      if (!newChunk) return;

      const nextSeg = {
        id: randomId(),
        text: newChunk,
        timestamp: elapsed,
        at: nowIso(),
      };

      setSegments((prev) => [...prev, nextSeg]);

      if (caseId) {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/transcripts/${caseId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ segments: [nextSeg] }),
        }).catch(() => {});
      }

      previousTranscriptRef.current = transcript;
    }, Math.random() * 1200 + 600);

    intervalIdRef.current = id;

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [listening, transcript, startTime, caseId]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  async function createIncidentShell() {
    const payload = {
      title: "Incoming report (voice)",
      type: "safety.other",
      severity: 1,
      location_text: "",
      ai_summary: "",
      ai_entities: { source: "voice" },
    };

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const res = await fetch(`${base}/incidents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create incident");
    const data = await res.json();

    setCaseId(data.id);
    setCaseNumber(generateCaseNumber());
    return data.id;
  }

  async function startRecording() {
    if (firstClick) {
      try {
        await createIncidentShell();
      } catch {
        setCaseNumber("Pending");
      }
      setFirstClick(false);
    }
    SpeechRecognition.startListening({ continuous: true });
  }

  function stopRecording() {
    SpeechRecognition.stopListening();
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }

  function resetAll() {
    resetTranscript();
    setSegments([]);
    previousTranscriptRef.current = "";
    setStartTime(null);
    setCaseId(null);
    setCaseNumber("Pending");
    setFirstClick(true);
  }

  return (
    <div className="flex flex-col gap-3 border border-slate-800 rounded p-4 bg-slate-950/60">
      <div className="flex items-center justify-between">
        <div className="uppercase text-[0.7rem] tracking-wide text-slate-400">
          Dictation Console
        </div>
        <div className="text-[0.7rem] text-slate-300">
          Case: <span className="font-medium">{caseNumber}</span>
        </div>
      </div>

    {/* Heatmap block */}
    <div className="rounded border border-slate-800 bg-slate-950/70 p-3">
        <p className="uppercase text-[0.65rem] tracking-wide text-slate-500">
            Incident Hotspots (WebGL)
        </p>
        <div className="mt-2">
        <IncidentHeatmap />
        </div>
    </div>

      <div className="flex items-center justify-between text-[0.7rem] text-slate-400">
        <span>Microphone: {listening ? "ON" : "OFF"}</span>
        <span>Segments: {segments.length}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={startRecording}
          className="h-9 px-3 rounded-md border border-slate-700/70 bg-slate-900/70 text-slate-100 text-sm hover:bg-slate-900"
        >
          Start
        </button>
        <button
          onClick={stopRecording}
          className="h-9 px-3 rounded-md border border-slate-700/70 bg-slate-900/40 text-slate-100 text-sm hover:bg-slate-900"
        >
          Stop
        </button>
        <button
          onClick={resetAll}
          className="h-9 px-3 rounded-md border border-slate-700/70 bg-slate-900/20 text-slate-100 text-sm hover:bg-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="rounded border border-slate-800 bg-slate-950/70 p-3">
        <p className="uppercase text-[0.65rem] tracking-wide text-slate-500">
          Live Transcript
        </p>
        <p className="mt-2 text-sm text-slate-100 whitespace-pre-wrap">
          {transcript || "…"}
        </p>
      </div>

      <div className="rounded border border-slate-800 bg-slate-950/70 p-3">
        <p className="uppercase text-[0.65rem] tracking-wide text-slate-500">
          Timestamped Segments
        </p>
        <div className="mt-2 space-y-2">
          {segments.length === 0 && (
            <p className="text-[0.75rem] text-slate-500">No segments yet.</p>
          )}
          {segments.map((s) => (
            <div key={s.id} className="text-[0.75rem] text-slate-200">
              <span className="text-slate-500">{s.timestamp}s</span>{" "}
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
