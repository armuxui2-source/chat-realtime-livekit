"use client";

import React from "react";
import { UserProfile } from "@/types/chat";
import { StoryItem } from "./StoryViewerModal";
import { Plus } from "lucide-react";
import { getAvatarColor } from "@/lib/utils";

interface StoryTrayProps {
  currentUser: UserProfile;
  stories: StoryItem[];
  onOpenStory: (index: number) => void;
  onAddStory?: () => void;
}

export const StoryTray: React.FC<StoryTrayProps> = ({
  currentUser,
  stories,
  onOpenStory,
  onAddStory,
}) => {
  return (
    <div
      data-testid="story-tray"
      className="flex items-center gap-3.5 px-4 py-3 overflow-x-auto custom-scrollbar select-none bg-transparent border-b border-slate-200/80 dark:border-white/10 shrink-0"
    >
      {/* 1. Add My Story Button (Clean Circle with Dark Charcoal Plus) */}
      <div
        onClick={onAddStory}
        data-testid="add-story-btn"
        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
      >
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-slate-300 dark:border-white/20 bg-slate-100/90 dark:bg-white/[0.04] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:border-emerald-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all shadow-xs">
          <Plus className="w-6 h-6 stroke-[2.2]" />
        </div>
        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[64px]">
          เพิ่มสตอรี่
        </span>
      </div>

      {/* 2. Friend Story Avatars with Instagram Colorful Gradient Ring */}
      {stories.map((story, index) => (
        <div
          key={story.id}
          data-testid={`story-item-${story.id}`}
          onClick={() => onOpenStory(index)}
          className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
        >
          {/* Instagram Gradient Ring */}
          <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md group-hover:scale-105 transition-transform">
            <div className="p-[2px] rounded-full bg-[#0B0D11]">
              <div
                className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr ${story.gradient} flex items-center justify-center text-white text-xs sm:text-sm font-bold`}
              >
                {story.userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-medium text-slate-300 truncate max-w-[62px]">
            {story.userName.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
};
