"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface AudioMessageBubbleProps {
  audioUrl: string;
  isMe: boolean;
}

export const AudioMessageBubble: React.FC<AudioMessageBubbleProps> = ({
  audioUrl,
  isMe,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => console.warn("Audio play error:", err));
      setIsPlaying(true);
    }
  };

  const cycleSpeed = () => {
    const audio = audioRef.current;
    const rates = [1, 1.5, 2];
    setPlaybackRate((prev) => {
      const nextRate = rates[(rates.indexOf(prev) + 1) % rates.length];
      if (audio) {
        audio.playbackRate = nextRate;
      }
      return nextRate;
    });
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const bars = [4, 8, 14, 18, 10, 6, 12, 16, 20, 14, 8, 12, 18, 10, 6, 14, 18, 12, 6, 10, 16, 8, 4];

  return (
    <div
      data-testid="audio-message-bubble"
      className={`flex items-center gap-2.5 p-2.5 rounded-2xl border select-none max-w-xs sm:max-w-sm ${
        isMe
          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
          : "bg-white text-slate-900 border-slate-200 shadow-sm"
      }`}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlayPause}
        data-testid="audio-play-pause-btn"
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          isMe
            ? "bg-white text-slate-900 hover:bg-slate-100"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
        )}
      </button>

      {/* Waveform Visualizer & Scrubber */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <div className="flex-1 flex items-center gap-0.5 h-5">
          {bars.map((height, idx) => {
            const isPlayed = (idx / bars.length) * 100 <= progress;
            return (
              <div
                key={idx}
                style={{ height: `${height}px` }}
                className={`w-0.5 sm:w-1 rounded-full transition-colors ${
                  isPlayed
                    ? isMe
                      ? "bg-emerald-400"
                      : "bg-slate-900"
                    : isMe
                    ? "bg-slate-700"
                    : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>

        {/* Duration */}
        <span
          className={`text-[10px] font-mono shrink-0 ${
            isMe ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {formatSeconds(duration || 0)}
        </span>
      </div>

      {/* Speed multiplier button */}
      <button
        type="button"
        onClick={cycleSpeed}
        data-testid="audio-speed-btn"
        className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold shrink-0 transition-colors ${
          isMe
            ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
        title="Playback Speed"
      >
        {playbackRate}x
      </button>
    </div>
  );
};
