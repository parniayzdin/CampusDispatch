// app/intake/page.js
"use client";

import "regenerator-runtime/runtime";
import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import usePostTranscript from "@/hooks/postTranscript";
import usePutCallLog from "@/hooks/putCallLog";

export default function CampusIntakeRecorder() {
  const [segments, setSegments] = useState([]);
  //flag so we only create a new "call log" the first time the user hits start
  const [firstClick, setFirstClick] = useState(true);
  const [startTime, setStartTime] = useState(null);

  const intervalIdRef = useRef(null);
  const previousTranscriptRef = useRef(""); 
  const lastTimestampRef = useRef(0); 

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const postTranscriptMutation = usePostTranscript();
  const { mutate: putLog, data: createdLog } = usePutCallLog();

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4">
        <p>Browser doesn&apos;t support speech recognition.</p>
      </div>
    );
  }

  function generateRandomPhoneNumber() {
    const phoneNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    return phoneNumber.toString();
  }

  function startRecording() {
    if (firstClick) {
      putLog({
        name: "",
        phone_number: generateRandomPhoneNumber(),
        address: "",
        city: "",
        location_description: "",
        description: "",
        type: "campus.general", 
        priority: "normal",
        response_type: "MAINTENANCE", 
        response_status: "NEW",
      });
      setFirstClick(false);
    }

    SpeechRecognition.startListening({ continuous: true });
  }

  useEffect(() => {
    if (listening) {
      if (!startTime) setStartTime(Date.now());

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }

      const id = setInterval(() => {
        if (transcript && startTime !== null) {
          const elapsedTimeSeconds = parseFloat(
            ((Date.now() - startTime) / 1000).toFixed(2)
          );

          // figure out what part of the transcript is new since last time
          const previousLength = previousTranscriptRef.current.length;
          const newTranscript = transcript;
          const newChunk = newTranscript.slice(previousLength).trim();

          if (newChunk) {
            setSegments((prev) => [
              ...prev,
              { text: newChunk, timestamp: elapsedTimeSeconds },
            ]);

            if (createdLog != null) {
              postTranscriptMutation.mutate({
                logID: createdLog.id,
                transcript: [
                  ...segments,
                  { text: newChunk, timestamp: elapsedTimeSeconds },
                ],
              });
            }

            previousTranscriptRef.current = newTranscript;
            lastTimestampRef.current = elapsedTimeSeconds;
          }
        }
      }, Math.random() * 1200 + 600); // ~0.6–1.8s

      intervalIdRef.current = id;
    } else if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [listening, transcript, startTime, createdLog]);

  return (
    <div className="flex flex-col gap-4 p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">
        Campus Call Intake Recorder
      </h1>
      <p className="text-slate-500">
        Use this to capture a non-emergency campus call and auto-build a
        timestamped transcript.
      </p>

      <div className="mt-4 space-y-2">
        <p>
          Microphone:{" "}
          <span className={listening ? "text-green-500" : "text-red-500"}>
            {listening ? "on" : "off"}
          </span>
        </p>

        <div className="flex gap-3">
          <button
            onClick={startRecording}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Start recording
          </button>
          <button
            onClick={SpeechRecognition.stopListening}
            className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-800"
          >
            Stop
          </button>
          <button
            onClick={() => {
              resetTranscript();
              setSegments([]);
              previousTranscriptRef.current = "";
              lastTimestampRef.current = 0;
              setStartTime(null);
              setFirstClick(true);
            }}
            className="px-4 py-2 rounded border border-slate-500 hover:bg-slate-800"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Live transcript</h2>
        <p className="text-sm text-slate-400 mb-2">
          (This is the raw transcript from the browser. The backend gets the
          chunked version with timestamps.)
        </p>
        <div className="p-3 rounded bg-slate-900 border border-slate-700 min-h-[80px]">
          {transcript || <span className="text-slate-500">Waiting for audio…</span>}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Segments with timestamps</h2>
        {segments.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No segments yet — hit Start and talk for a bit.
          </p>
        ) : (
          <ul className="space-y-1 text-sm font-mono">
            {segments.map((seg, idx) => (
              <li key={idx}>
                <span className="text-emerald-400">
                  [{seg.timestamp.toFixed(2)}s]
                </span>{" "}
                {seg.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
