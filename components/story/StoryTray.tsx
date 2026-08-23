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
      className="flex items-center gap-4 px-4 py-3.5 overflow-x-auto custom-scrollbar select-none bg-transparent border-b border-[#DBDBDB] dark:border-[#262626] shrink-0"
    >
      {/* 1. Add Story (Instagram My Story with + Badge) */}
      <div
        onClick={onAddStory}
        data-testid="add-story-btn"
        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
      >
        <div className="relative">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-tr ${getAvatarColor(
              currentUser.username
            )} flex items-center justify-center text-white text-sm font-bold shadow-xs ring-1 ring-black/10 dark:ring-white/20 group-hover:scale-105 transition-transform`}
          >
            {currentUser.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#0095F6] border-2 border-white dark:border-black text-white flex items-center justify-center shadow-xs">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
        <span className="text-[11px] font-normal text-slate-700 dark:text-slate-300 truncate max-w-[64px]">
          สตอรี่ของคุณ
        </span>
      </div>

      {/* 2. Friends Stories with Signature Instagram Gradient Ring */}
      {stories.map((story, index) => (
        <div
          key={story.id}
          data-testid={`story-item-${story.id}`}
          onClick={() => onOpenStory(index)}
          className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
        >
          <div className="p-[2.5px] rounded-full ig-gradient-ring shadow-xs group-hover:scale-105 transition-transform">
            <div className="p-[2px] rounded-full bg-white dark:bg-black">
              <div
                className={`w-13 h-13 rounded-full bg-gradient-to-tr ${
                  story.gradient || getAvatarColor(story.userName)
                } flex items-center justify-center text-white text-xs font-bold`}
              >
                {story.userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-normal text-slate-700 dark:text-slate-300 truncate max-w-[64px]">
            {story.userName.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
};
