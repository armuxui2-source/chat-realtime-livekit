"use client";

import React, { useState } from "react";
import { UserProfile, Channel, ChannelMember } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  Phone,
  Video,
  UserPlus,
  Play,
  Image as ImageIcon,
  Film,
  Music,
  Share2,
  Bookmark,
  ChevronLeft,
  X,
  Sparkles,
} from "lucide-react";

interface RightDetailsPanelProps {
  selectedUser: UserProfile | null;
  selectedChannel: Channel | null;
  channelMembers: ChannelMember[];
  availableUsers: UserProfile[];
  onAddMember: (username: string) => void;
  onStartCall: (type: "audio" | "video") => void;
  onClose?: () => void;
}

export const RightDetailsPanel: React.FC<RightDetailsPanelProps> = ({
  selectedUser,
  selectedChannel,
  channelMembers,
  onAddMember,
  onStartCall,
  onClose,
}) => {
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const isChannel = !!selectedChannel;

  const displayName = isChannel
    ? `#${selectedChannel.name}`
    : selectedUser?.display_name || "User";

  const username = isChannel ? selectedChannel.id : selectedUser?.username || "";

  const mockAudios = [
    { id: "a1", name: "Voice Note - Sync #1", duration: "03:40", artist: "Alex Dev" },
    { id: "a2", name: "Client Feedback Audio", duration: "02:56", artist: "Sarah Miller" },
    { id: "a3", name: "Sprint Planning Record", duration: "04:29", artist: "Somchai" },
  ];

  const mockPhotos = [
    { id: "p1", color: "from-slate-100 to-slate-200" },
    { id: "p2", color: "from-emerald-50 to-teal-100" },
    { id: "p3", color: "from-blue-50 to-indigo-100" },
    { id: "p4", color: "from-amber-50 to-orange-100" },
    { id: "p5", color: "from-rose-50 to-pink-100" },
    { id: "p6", color: "from-purple-50 to-violet-100" },
  ];

  const mockVideos = [
    { id: "v1", title: "Project Sync Recording", duration: "03:40", color: "from-slate-800 to-slate-950" },
    { id: "v2", title: "Product Demo Video", duration: "01:50", color: "from-slate-900 to-black" },
  ];

  return (
    <aside
      data-testid="right-details-panel"
      className="w-full md:w-80 lg:w-88 shrink-0 flex flex-col h-full bg-[#FFFFFF] border-l border-[#E2E8F0] p-5 select-none overflow-y-auto custom-scrollbar"
    >
      {/* Mobile Back / Close Header */}
      {onClose && (
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 md:hidden">
          <button
            onClick={onClose}
            data-testid="mobile-close-details-btn"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-900 p-1 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Chat</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
        <div className="relative mb-3">
          <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
            <div
              className={`w-16 h-16 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                username
              )} flex items-center justify-center text-white text-xl font-bold shadow-sm`}
            >
              {displayName.replace("#", "").charAt(0).toUpperCase()}
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <h3
          data-testid="details-panel-name"
          className="text-sm font-bold text-slate-900 leading-tight"
        >
          {displayName}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 font-normal">
          {isChannel ? "Team Discussion Channel" : "Graphics Designer / Engineer"}
        </p>

        {/* Quick Action Buttons */}
        <div className="flex items-center justify-center gap-2 mt-3.5">
          <button
            type="button"
            onClick={() => onStartCall("audio")}
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-all"
            title="Audio Call"
          >
            <Phone className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => onStartCall("video")}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-all shadow-sm"
            title="Video Call"
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-all"
            title="Bookmark"
          >
            <Bookmark className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-all"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Bento Stats Metrics */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3.5 border-t border-slate-100 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
            <p className="text-sm font-bold text-slate-900">80</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total Chats</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
            <p className="text-sm font-bold text-emerald-600">54</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Completed</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
            <p className="text-sm font-bold text-slate-900">80</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">In Progress</p>
          </div>
        </div>
      </div>

      {/* Categorized Attachment Media */}
      <div className="space-y-5 pt-4">
        {/* 1. Attachment Audios */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span>Attachment Audios</span>
            </span>
            <button className="text-[11px] font-semibold text-slate-500 hover:text-slate-900">
              View all
            </button>
          </div>

          <div className="space-y-1.5">
            {mockAudios.map((audio) => (
              <div
                key={audio.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {audio.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {audio.artist}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                  {audio.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Attachment Photos */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span>Attachment Photos</span>
            </span>
            <button className="text-[11px] font-semibold text-slate-500 hover:text-slate-900">
              View all
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {mockPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`h-14 rounded-xl bg-gradient-to-tr ${photo.color} border border-slate-200/80 shadow-sm hover:scale-105 transition-transform cursor-pointer flex items-center justify-center text-slate-400`}
              >
                <ImageIcon className="w-4 h-4 opacity-40" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Attachment Videos */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span>Attachment Videos</span>
            </span>
            <button className="text-[11px] font-semibold text-slate-500 hover:text-slate-900">
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {mockVideos.map((video) => (
              <div
                key={video.id}
                className={`relative h-18 rounded-xl bg-gradient-to-tr ${video.color} p-2 flex flex-col justify-between shadow-sm hover:scale-105 transition-transform cursor-pointer text-white`}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center self-center my-auto">
                  <Play className="w-2.5 h-2.5 ml-0.5 fill-current text-white" />
                </div>
                <div className="flex items-center justify-between text-[9px] font-medium opacity-90">
                  <span className="truncate max-w-[70px]">{video.title}</span>
                  <span className="px-1 py-0.5 rounded bg-black/50 font-mono">{video.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Members (if Channel Mode) */}
        {isChannel && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">
                Channel Members ({channelMembers.length})
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newMemberUsername.trim()) {
                  onAddMember(newMemberUsername.trim());
                  setNewMemberUsername("");
                }
              }}
              className="flex gap-1.5 mb-2.5"
            >
              <input
                type="text"
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
                placeholder="Username to add..."
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-1">
              {channelMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${getAvatarColor(
                        member.user_id
                      )} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {member.user_id.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      @{member.user_id}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
