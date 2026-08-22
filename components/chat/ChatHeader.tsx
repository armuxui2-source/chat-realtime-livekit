"use client";

import React from "react";
import { UserProfile, Channel } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import { Phone, Video, Info, Hash, Lock, ChevronLeft } from "lucide-react";

interface ChatHeaderProps {
  selectedUser: UserProfile | null;
  selectedChannel: Channel | null;
  showDetailsPanel: boolean;
  pinnedCount?: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleDetailsPanel: () => void;
  onStartCall: (type: "audio" | "video") => void;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  selectedChannel,
  showDetailsPanel,
  onToggleDetailsPanel,
  onStartCall,
  onBack,
}) => {
  const isChannel = !!selectedChannel;

  return (
    <header
      data-testid="chat-header"
      className="h-16 px-4 md:px-5 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0 select-none z-10"
    >
      {/* Target user or Channel info */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            data-testid="mobile-back-to-conversations"
            className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {isChannel ? (
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            {selectedChannel.is_private ? (
              <Lock className="w-4 h-4 text-slate-600" strokeWidth={2} />
            ) : (
              <Hash className="w-5 h-5 text-slate-700" strokeWidth={2} />
            )}
          </div>
        ) : selectedUser ? (
          <div className="relative shrink-0">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getAvatarColor(
                selectedUser.username
              )} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
            >
              {selectedUser.display_name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
        ) : null}

        <div className="min-w-0">
          <h2
            data-testid="chat-header-display-name"
            className="text-sm font-bold text-slate-900 leading-tight truncate"
          >
            {isChannel ? `#${selectedChannel.name}` : selectedUser?.display_name}
          </h2>
          <p className="text-xs text-emerald-600 font-medium leading-none mt-0.5">
            {isChannel ? `${selectedChannel.member_count || 3} members` : "Active now"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onStartCall("audio")}
          data-testid="chat-header-audio-call-btn"
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-all active:scale-95"
          title="Voice Call"
        >
          <Phone className="w-4 h-4" strokeWidth={2} />
        </button>

        <button
          onClick={() => onStartCall("video")}
          data-testid="chat-header-video-call-btn"
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-all active:scale-95"
          title="Video Call"
        >
          <Video className="w-4 h-4" strokeWidth={2} />
        </button>

        <button
          onClick={onToggleDetailsPanel}
          data-testid="toggle-details-panel-btn"
          className={`p-2.5 rounded-xl transition-all ${
            showDetailsPanel
              ? "bg-slate-100 text-slate-900"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Details"
        >
          <Info className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
};
