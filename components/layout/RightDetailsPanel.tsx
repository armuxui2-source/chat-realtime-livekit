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
  Download,
  Share2,
  Bookmark,
  ChevronLeft,
  X,
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
  availableUsers,
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

  // Mock attachments for the rich gallery display matching the reference UI
  const mockAudios = [
    { id: "a1", name: "It Ain't Me", duration: "03:40" },
    { id: "a2", name: "Scared to Be Lonely", duration: "02:56" },
    { id: "a3", name: "I Feel It Coming (feat. Daft Punk)", duration: "04:29" },
  ];

  const mockPhotos = [
    { id: "p1", color: "from-blue-200 to-indigo-300" },
    { id: "p2", color: "from-rose-200 to-pink-300" },
    { id: "p3", color: "from-amber-200 to-orange-300" },
    { id: "p4", color: "from-emerald-200 to-teal-300" },
    { id: "p5", color: "from-purple-200 to-violet-300" },
    { id: "p6", color: "from-cyan-200 to-sky-300" },
  ];

  const mockVideos = [
    { id: "v1", title: "Project Sync Recording", duration: "03:40", color: "from-amber-700 to-slate-900" },
    { id: "v2", title: "Product Demo Video", duration: "01:50", color: "from-blue-700 to-slate-900" },
  ];

  return (
    <aside
      data-testid="right-details-panel"
      className="w-full md:w-80 lg:w-88 shrink-0 flex flex-col h-full bg-white/95 md:bg-white/70 border-l border-slate-200/60 p-5 select-none font-prompt overflow-y-auto custom-scrollbar"
    >
      {/* Mobile Back / Close Header */}
      {onClose && (
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 md:hidden">
          <button
            onClick={onClose}
            data-testid="mobile-close-details-btn"
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 p-1 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>กลับไปที่แชท</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Profile Header with Peach Ring */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-slate-200/60">
        <div className="relative mb-3">
          <div className="p-1.5 rounded-full bg-gradient-to-tr from-rose-200 via-pink-100 to-amber-100 shadow-md">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-tr ${getAvatarColor(
                username
              )} flex items-center justify-center text-white text-2xl font-bold shadow-inner`}
            >
              {displayName.replace("#", "").charAt(0).toUpperCase()}
            </div>
          </div>
          <span className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
        </div>

        <h3
          data-testid="details-panel-name"
          className="text-base font-bold text-slate-800 leading-tight"
        >
          {displayName}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {isChannel ? "Team Discussion Channel" : "Graphics Designer / Engineer"}
        </p>

        {/* Quick Action Circle Buttons */}
        <div className="flex items-center justify-center gap-2.5 mt-4">
          <button
            type="button"
            onClick={() => onStartCall("audio")}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all shadow-sm"
            title="Audio Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onStartCall("video")}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all shadow-sm"
            title="Video Call"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 flex items-center justify-center transition-all shadow-sm"
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-all shadow-sm"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Stats Metrics */}
        <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-slate-100 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-bold text-slate-800">80</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total Chats</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-bold text-blue-600">54</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Completed</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-bold text-amber-600">80</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">In Progress</p>
          </div>
        </div>
      </div>

      {/* Categorized Attachment Media */}
      <div className="space-y-6 pt-5">
        {/* 1. Attachment Audios */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-blue-500" />
              <span>Attachment Audios</span>
            </span>
            <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>

          <div className="space-y-2">
            {mockAudios.map((audio) => (
              <div
                key={audio.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <Play className="w-3 h-3 ml-0.5 fill-current" />
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate group-hover:text-blue-600">
                    {audio.name}
                  </p>
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
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
              <span>Attachment Photos</span>
            </span>
            <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {mockPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`h-16 rounded-2xl bg-gradient-to-tr ${photo.color} border border-white shadow-sm hover:scale-105 transition-transform cursor-pointer flex items-center justify-center text-slate-500/40`}
              >
                <ImageIcon className="w-5 h-5 opacity-50" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Attachment Videos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-indigo-500" />
              <span>Attachment Videos</span>
            </span>
            <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {mockVideos.map((video) => (
              <div
                key={video.id}
                className={`relative h-20 rounded-2xl bg-gradient-to-tr ${video.color} p-2 flex flex-col justify-between shadow-sm hover:scale-105 transition-transform cursor-pointer text-white`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-600/80 backdrop-blur-sm flex items-center justify-center self-center my-auto">
                  <Play className="w-3 h-3 ml-0.5 fill-current text-white" />
                </div>
                <div className="flex items-center justify-between text-[9px] font-medium opacity-90">
                  <span className="truncate max-w-[80px]">{video.title}</span>
                  <span className="px-1 py-0.5 rounded bg-black/40 font-mono">{video.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Members (if Channel Mode) */}
        {isChannel && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Channel Members / สมาชิกกลุ่ม ({channelMembers.length})
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
              className="flex gap-1 mb-3"
            >
              <input
                type="text"
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
                placeholder="Username to add..."
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-1.5">
              {channelMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-tr ${getAvatarColor(
                        member.user_id
                      )} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {member.user_id.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-slate-800 truncate">
                      @{member.user_id}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-semibold">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
