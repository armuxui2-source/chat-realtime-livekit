"use client";

import React, { useState } from "react";
import { UserProfile, Channel } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import { Phone, Video, Info, Hash, Lock, Search, Pin, X, ChevronLeft } from "lucide-react";

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
  pinnedCount = 0,
  searchQuery,
  onSearchChange,
  onToggleDetailsPanel,
  onStartCall,
  onBack,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const isChannel = !!selectedChannel;

  return (
    <header
      data-testid="chat-header"
      className="h-16 px-4 md:px-6 border-b border-[#E2E8F0] bg-white flex items-center justify-between shrink-0 select-none"
    >
      {/* Target user or Channel info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            data-testid="mobile-back-to-conversations"
            className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Back to conversations"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {isChannel ? (
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-sm">
            {selectedChannel.is_private ? (
              <Lock className="w-4 h-4 text-amber-600" strokeWidth={1.75} />
            ) : (
              <Hash className="w-5 h-5 text-slate-700" strokeWidth={1.75} />
            )}
          </div>
        ) : selectedUser ? (
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                selectedUser.username
              )} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
            >
              {selectedUser.display_name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
        ) : null}

        <div className="min-w-0">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight flex items-center gap-2 min-w-0">
            <span data-testid="chat-header-display-name" className="truncate max-w-[120px] sm:max-w-none">
              {isChannel ? `#${selectedChannel.name}` : selectedUser?.display_name}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                isChannel
                  ? "bg-slate-100 text-slate-700 border border-slate-200"
                  : "bg-[#E6F4EA] text-[#0D652D] border border-[#CEEAD6]"
              }`}
            >
              {isChannel ? "Group" : "Online"}
            </span>
            {pinnedCount > 0 && (
              <span
                data-testid="pinned-count-badge"
                className="hidden sm:flex text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium items-center gap-1 shrink-0"
              >
                <Pin className="w-2.5 h-2.5" />
                <span>{pinnedCount} Pinned</span>
              </span>
            )}
          </h2>
          <p className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-none mt-0.5">
            {isChannel
              ? selectedChannel.description || "Team channel discussion"
              : `@${selectedUser?.username}`}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* In-Chat Search */}
        {showSearchInput ? (
          <div className="relative flex items-center animate-scale-up">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" strokeWidth={1.75} />
            <input
              type="text"
              data-testid="in-chat-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search in conversation..."
              autoFocus
              className="pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 w-44 md:w-56"
            />
            <button
              onClick={() => {
                setShowSearchInput(false);
                onSearchChange("");
              }}
              className="p-1 rounded-lg absolute right-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearchInput(true)}
            data-testid="toggle-chat-search-btn"
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200/80"
            title="Search conversation"
          >
            <Search className="w-4 h-4" strokeWidth={1.75} />
          </button>
        )}

        {/* Audio Call */}
        <button
          onClick={() => onStartCall("audio")}
          data-testid="chat-header-audio-call-btn"
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all border border-slate-200/80 active:scale-95 group shrink-0"
          title={isChannel ? "Group Audio Call" : "Audio Call"}
        >
          <Phone className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.75} />
          <span className="hidden sm:inline">{isChannel ? "Group Call" : "Call"}</span>
        </button>

        {/* Video Call */}
        <button
          onClick={() => onStartCall("video")}
          data-testid="chat-header-video-call-btn"
          className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm active:scale-95 shrink-0"
          title={isChannel ? "Group Video Call" : "Video Call"}
        >
          <Video className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
          <span className="hidden sm:inline">{isChannel ? "Group Meet" : "Video Call"}</span>
        </button>

        {/* Toggle Right Details Panel */}
        <button
          onClick={onToggleDetailsPanel}
          data-testid="toggle-details-panel-btn"
          className={`p-2 rounded-xl transition-all shrink-0 border ${
            showDetailsPanel
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Details & Media"
        >
          <Info className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
};
