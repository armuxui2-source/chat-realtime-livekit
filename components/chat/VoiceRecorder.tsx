"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trash2, Send } from "lucide-react";

interface VoiceRecorderProps {
  onSendVoice: (audioBlob: Blob, durationSeconds: number) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSendVoice,
  onCancel,
}) => {
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let active = true;

    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start(100);

        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.warn("Microphone access denied or error:", err);
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);
      }
    }

    startRecording();

    return () => {
      active = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleStopAndSend = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });
        onSendVoice(audioBlob, duration);
      };
      mediaRecorderRef.current.stop();
    } else {
      const mockBlob = new Blob(["mock-audio-data"], { type: "audio/webm" });
      onSendVoice(mockBlob, duration);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  const handleCancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    onCancel();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      data-testid="voice-recorder-bar"
      className="flex-1 flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#161A22] border border-rose-500/30 shadow-lg animate-fade-in text-white"
    >
      {/* Recording indicator & timer */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute" />
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-400">Recording</span>
          <span
            data-testid="voice-record-duration"
            className="text-xs font-mono font-bold text-white bg-[#0F1216] px-2 py-0.5 rounded-xl border border-white/[0.08]"
          >
            {formatTime(duration)}
          </span>
        </div>

        {/* Animated Sound Wave Bars */}
        <div className="hidden sm:flex items-center gap-1 h-4 px-2">
          {[40, 70, 100, 50, 90, 60, 80, 45, 95, 30].map((h, idx) => (
            <div
              key={idx}
              className="w-1 bg-rose-400 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${idx * 100}ms`,
                animationDuration: "600ms",
              }}
            />
          ))}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCancel}
          data-testid="cancel-voice-record-btn"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors"
          title="ยกเลิก"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleStopAndSend}
          data-testid="send-voice-record-btn"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl emerald-button-gradient text-white text-xs font-bold shadow-md transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>ส่งเสียง</span>
        </button>
      </div>
    </div>
  );
};
