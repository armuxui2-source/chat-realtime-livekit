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
      className="h-16 px-4 md:px-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl flex items-center justify-between shrink-0 select-none font-prompt"
    >
      {/* Target user or Channel info */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Mobile Back Button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            data-testid="mobile-back-to-conversations"
            className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
            title="Back to conversations"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {isChannel ? (
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
            {selectedChannel.is_private ? <Lock className="w-4 h-4 text-amber-500" /> : <Hash className="w-5 h-5 text-blue-500" />}
          </div>
        ) : selectedUser ? (
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getAvatarColor(
                selectedUser.username
              )} flex items-center justify-center text-white text-sm font-bold shadow-sm`}
            >
              {selectedUser.display_name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
        ) : null}

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-800 leading-tight flex items-center gap-1.5 min-w-0">
            <span data-testid="chat-header-display-name" className="truncate max-w-[90px] sm:max-w-none">
              {isChannel ? `#${selectedChannel.name}` : selectedUser?.display_name}
            </span>
            <span
              className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 ${
                isChannel
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              }`}
            >
              {isChannel ? "Group" : "Online"}
            </span>
            {pinnedCount > 0 && (
              <span
                data-testid="pinned-count-badge"
                className="hidden sm:flex text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium items-center gap-1 shrink-0"
              >
                <Pin className="w-2.5 h-2.5" />
                <span>{pinnedCount} Pinned</span>
              </span>
            )}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[120px] sm:max-w-none">
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
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
            <input
              type="text"
              data-testid="in-chat-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search in chat..."
              autoFocus
              className="pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-44 md:w-56 shadow-sm"
            />
            <button
              onClick={() => {
                setShowSearchInput(false);
                onSearchChange("");
              }}
              className="p-1 rounded-lg absolute right-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearchInput(true)}
            data-testid="toggle-chat-search-btn"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            title="Search conversation"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Audio Call */}
        <button
          onClick={() => onStartCall("audio")}
          data-testid="chat-header-audio-call-btn"
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-all shadow-sm active:scale-95 group shrink-0"
          title={isChannel ? "Group Audio Call" : "Audio Call"}
        >
          <Phone className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">{isChannel ? "Group Call" : "Call"}</span>
        </button>

        {/* Video Call */}
        <button
          onClick={() => onStartCall("video")}
          data-testid="chat-header-video-call-btn"
          className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-all shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
          title={isChannel ? "Group Video Call" : "Video Call"}
        >
          <Video className="w-4 h-4" />
          <span className="hidden sm:inline">{isChannel ? "Group Meet" : "Video Call"}</span>
        </button>

        {/* Toggle Right Details Panel */}
        <button
          onClick={onToggleDetailsPanel}
          data-testid="toggle-details-panel-btn"
          className={`p-2 rounded-xl transition-all shrink-0 ${
            showDetailsPanel
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
          }`}
          title="Details & Media"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
