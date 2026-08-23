"use client";

import React from "react";
import { UserProfile, Channel } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import { Phone, Video, Info, Hash, Lock, ChevronLeft, Bell } from "lucide-react";

interface ChatHeaderProps {
  selectedUser: UserProfile | null;
  selectedChannel: Channel | null;
  showDetailsPanel: boolean;
  pinnedCount?: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleDetailsPanel: () => void;
  onOpenNotifications?: () => void;
  onStartCall: (type: "audio" | "video") => void;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  selectedChannel,
  showDetailsPanel,
  onToggleDetailsPanel,
  onOpenNotifications,
  onStartCall,
  onBack,
}) => {
  const isChannel = !!selectedChannel;

  return (
    <header
      data-testid="chat-header"
      className="h-16 px-4 md:px-6 border-b border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-black flex items-center justify-between shrink-0 select-none z-10 text-slate-900 dark:text-white font-prompt"
    >
      {/* Target user or Channel info */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            data-testid="mobile-back-to-conversations"
            className="md:hidden p-2 -ml-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#262626] transition-colors shrink-0"
            title="ย้อนกลับ"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {isChannel ? (
          <div className="w-11 h-11 rounded-full bg-[#EFEFEF] dark:bg-[#262626] border border-[#DBDBDB] dark:border-[#363636] flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
            {selectedChannel.is_private ? (
              <Lock className="w-5 h-5 text-amber-500" strokeWidth={2} />
            ) : (
              <Hash className="w-5 h-5" strokeWidth={2} />
            )}
          </div>
        ) : selectedUser ? (
          <div className="relative shrink-0">
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-tr ${getAvatarColor(
                selectedUser.username
              )} flex items-center justify-center text-white text-sm font-bold shadow-xs`}
            >
              {selectedUser.display_name.charAt(0).toUpperCase()}
            </div>
            {selectedUser.status === "online" && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-black bg-[#10B981]" />
            )}
          </div>
        ) : null}

        <div className="min-w-0">
          <h2
            data-testid="chat-header-display-name"
            className="text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate"
          >
            {isChannel ? `#${selectedChannel.name}` : selectedUser?.display_name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-1">
            {isChannel ? `${selectedChannel.member_count || 3} สมาชิก` : "กำลังใช้งาน (Active now)"}
          </p>
        </div>
      </div>

      {/* Action Buttons (Voice, Video, Info Drawer) */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onStartCall("audio")}
          data-testid="chat-header-audio-call-btn"
          className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#262626] transition-all"
          title="โทรเสียง"
        >
          <Phone className="w-5 h-5" strokeWidth={1.8} />
        </button>

        <button
          onClick={() => onStartCall("video")}
          data-testid="chat-header-video-call-btn"
          className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#262626] transition-all"
          title="วิดีโอคอล"
        >
          <Video className="w-5 h-5" strokeWidth={1.8} />
        </button>

        <button
          onClick={onToggleDetailsPanel}
          data-testid="toggle-details-btn"
          className={`p-2 rounded-full transition-all ${
            showDetailsPanel
              ? "text-[#0095F6] bg-blue-50 dark:bg-blue-950/40"
              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#262626]"
          }`}
          title="ข้อมูลแชท"
        >
          <Info className="w-5 h-5" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
};
