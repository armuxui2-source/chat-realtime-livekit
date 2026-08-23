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
      className="h-16 px-4 md:px-5 border-b border-white/10 bg-[#12161F] flex items-center justify-between shrink-0 select-none z-10 text-white font-prompt"
    >
      {/* Target user or Channel info */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            data-testid="mobile-back-to-conversations"
            className="md:hidden p-2 -ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="ย้อนกลับ"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {isChannel ? (
          <div className="w-10 h-10 rounded-xl bg-[#0B0D11] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
            {selectedChannel.is_private ? (
              <Lock className="w-4 h-4 text-amber-400" strokeWidth={2} />
            ) : (
              <Hash className="w-5 h-5 text-emerald-400" strokeWidth={2} />
            )}
          </div>
        ) : selectedUser ? (
          <div className="relative shrink-0">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getAvatarColor(
                selectedUser.username
              )} flex items-center justify-center text-white text-xs font-bold shadow-md ring-1 ring-white/20`}
            >
              {selectedUser.display_name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#12161F]" />
          </div>
        ) : null}

        <div className="min-w-0">
          <h2
            data-testid="chat-header-display-name"
            className="text-sm font-bold text-white leading-tight truncate"
          >
            {isChannel ? `#${selectedChannel.name}` : selectedUser?.display_name}
          </h2>
          <p className="text-xs text-emerald-400 font-medium leading-none mt-0.5">
            {isChannel ? `${selectedChannel.member_count || 3} สมาชิก` : "กำลังใช้งาน (Active now)"}
          </p>
        </div>
      </div>

      {/* Action Buttons (Voice, Video, Notification Bell, Info Drawer) */}
      <div className="flex items-center gap-1.5">
        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            data-testid="chat-header-notif-btn"
            className="p-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            title="การแจ้งเตือน"
          >
            <Bell className="w-4 h-4" strokeWidth={2} />
          </button>
        )}

        <button
          onClick={() => onStartCall("audio")}
          data-testid="chat-header-audio-call-btn"
          className="p-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
          title="โทรเสียง"
        >
          <Phone className="w-4 h-4" strokeWidth={2} />
        </button>

        <button
          onClick={() => onStartCall("video")}
          data-testid="chat-header-video-call-btn"
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          title="วิดีโอคอล"
        >
          <Video className="w-4 h-4" strokeWidth={2} />
        </button>

        <button
          onClick={onToggleDetailsPanel}
          data-testid="toggle-details-panel-btn"
          className={`p-2.5 rounded-xl transition-all ${
            showDetailsPanel
              ? "bg-white/15 text-white"
              : "text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
          title="รายละเอียด & เมนูสไลด์"
        >
          <Info className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
};
