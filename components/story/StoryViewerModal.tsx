"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import { X, Heart, Send, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface StoryItem {
  id: string;
  userId: string;
  userName: string;
  mediaUrl: string;
  caption: string;
  timestamp: string;
  gradient: string;
}

interface StoryViewerModalProps {
  isOpen: boolean;
  stories: StoryItem[];
  initialIndex?: number;
  onClose: () => void;
  onReplyStory?: (story: StoryItem, message: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  stories,
  initialIndex = 0,
  onClose,
  onReplyStory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  // Story Auto-Advance Timer (5 seconds per story)
  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // ~5 seconds for 100%
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, stories.length, onClose]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplyStory?.(currentStory, replyText.trim());
    setReplyText("");
    onClose();
  };

  return (
    <div
      data-testid="story-viewer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl font-prompt select-none animate-fade-in"
    >
      {/* Container Story Box (Instagram Phone Ratio) */}
      <div className="relative w-full max-w-sm aspect-[9/16] max-h-[85vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between text-white">
        
        {/* Background Gradient & Story Card */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentStory.gradient} flex items-center justify-center p-6 text-center`}
        >
          <div className="space-y-4 max-w-xs">
            <div className="w-20 h-20 rounded-full mx-auto bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center text-3xl font-bold shadow-lg">
              {currentStory.userName.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-white drop-shadow-md">
              {currentStory.caption}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instagram Story</span>
            </span>
          </div>
        </div>

        {/* Top Header: Progress Segments & User Info */}
        <div className="relative z-20 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
          {/* Progress Bars */}
          <div className="flex gap-1.5 mb-3">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width:
                      idx < currentIndex
                        ? "100%"
                        : idx === currentIndex
                        ? `${progress}%`
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-tr ${getAvatarColor(
                  currentStory.userId
                )} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/60 shadow-sm`}
              >
                {currentStory.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  {currentStory.userName}
                </p>
                <p className="text-[10px] text-white/70">{currentStory.timestamp}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Left / Right Tap Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-20 bottom-24 w-1/3 z-10 opacity-0 hover:opacity-100 flex items-center justify-start pl-2 transition-opacity"
        >
          <div className="p-2 rounded-full bg-black/40 text-white">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-20 bottom-24 w-1/3 z-10 opacity-0 hover:opacity-100 flex items-center justify-end pr-2 transition-opacity"
        >
          <div className="p-2 rounded-full bg-black/40 text-white">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* Bottom Reply Bar */}
        <div className="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`ตอบกลับ ${currentStory.userName}...`}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs text-white placeholder-white/60 focus:outline-none focus:bg-white/30"
            />

            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                isLiked
                  ? "bg-rose-600 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-full bg-white text-slate-900 disabled:opacity-40 shadow-sm transition-all active:scale-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
