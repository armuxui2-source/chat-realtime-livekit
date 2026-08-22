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

  // Mock waveform bars count for smooth visual display
  const bars = [4, 8, 14, 18, 10, 6, 12, 16, 20, 14, 8, 12, 18, 10, 6, 14, 18, 12, 6, 10, 16, 8, 4];

  return (
    <div
      data-testid="audio-message-bubble"
      className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm font-prompt select-none max-w-sm"
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Blue Circular Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlayPause}
        data-testid="audio-play-pause-btn"
        className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 transition-transform active:scale-95"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 ml-0.5 fill-current" />
        )}
      </button>

      {/* Waveform Visualizer & Scrubber */}
      <div className="flex-1 min-w-0 flex items-center gap-1">
        <div className="flex-1 flex items-center gap-0.5 h-6">
          {bars.map((height, idx) => {
            const isPlayed = (idx / bars.length) * 100 <= progress;
            return (
              <div
                key={idx}
                style={{ height: `${height}px` }}
                className={`w-1 rounded-full transition-colors ${
                  isPlayed ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
          {formatSeconds(duration || 0)}
        </span>
      </div>

      {/* Speed multiplier button */}
      <button
        type="button"
        onClick={cycleSpeed}
        data-testid="audio-speed-btn"
        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-mono font-bold shrink-0 transition-colors"
        title="Playback Speed"
      >
        {playbackRate}x
      </button>
    </div>
  );
};
