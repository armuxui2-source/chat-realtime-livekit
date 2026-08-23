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
      className="flex items-center gap-3.5 px-4 py-3 overflow-x-auto custom-scrollbar select-none bg-[#0B0D11]/60 border-b border-white/10 shrink-0"
    >
      {/* 1. Add My Story Button */}
      <div
        onClick={onAddStory}
        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
      >
        <div className="relative">
          <div
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr ${getAvatarColor(
              currentUser.username
            )} flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md ring-2 ring-white/10 group-hover:ring-emerald-500 transition-all`}
          >
            {currentUser.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-600 border-2 border-[#0B0D11] text-white flex items-center justify-center shadow-sm">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
        <span className="text-[10px] font-medium text-slate-300 truncate max-w-[60px]">
          สตอรี่ของคุณ
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
