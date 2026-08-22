"use client";

import React, { useState } from "react";
import { UserProfile, Channel, ChannelMember } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  Phone,
  Video,
  UserPlus,
  ChevronLeft,
  X,
  FileText,
  Image as ImageIcon,
  Link2,
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
  const [activeTab, setActiveTab] = useState<"media" | "files" | "members">("media");
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const isChannel = !!selectedChannel;

  const displayName = isChannel
    ? `#${selectedChannel.name}`
    : selectedUser?.display_name || "User";

  const username = isChannel ? selectedChannel.id : selectedUser?.username || "";

  return (
    <aside
      data-testid="right-details-panel"
      className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col h-full bg-white border-l border-slate-200/80 p-5 select-none overflow-y-auto custom-scrollbar"
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
            <span>Back</span>
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
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-tr ${getAvatarColor(
              username
            )} flex items-center justify-center text-white text-xl font-bold shadow-sm`}
          >
            {displayName.replace("#", "").charAt(0).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        <h3
          data-testid="details-panel-name"
          className="text-sm font-bold text-slate-900 leading-tight"
        >
          {displayName}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {isChannel ? selectedChannel.description || "Public channel" : `@${username}`}
        </p>

        {/* Quick Call Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => onStartCall("audio")}
            className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all">
              <Phone className="w-4 h-4" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-medium">Audio</span>
          </button>

          <button
            type="button"
            onClick={() => onStartCall("video")}
            className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition-all">
              <Video className="w-4 h-4 text-emerald-400" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-medium">Video</span>
          </button>
        </div>
      </div>

      {/* Shared Content Tabs */}
      <div className="pt-4 flex-1">
        <div className="flex border-b border-slate-100 mb-3 text-xs">
          <button
            onClick={() => setActiveTab("media")}
            className={`pb-2 px-3 font-semibold transition-all border-b-2 ${
              activeTab === "media"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`pb-2 px-3 font-semibold transition-all border-b-2 ${
              activeTab === "files"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Files
          </button>
          {isChannel && (
            <button
              onClick={() => setActiveTab("members")}
              className={`pb-2 px-3 font-semibold transition-all border-b-2 ${
                activeTab === "members"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Members ({channelMembers.length})
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "media" && (
          <div className="grid grid-cols-3 gap-1.5">
            <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <FileText className="w-4 h-4 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 truncate">Project_Summary.pdf</p>
                <p className="text-[10px] text-slate-400">1.2 MB · Yesterday</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && isChannel && (
          <div className="space-y-2">
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
                placeholder="Username to invite..."
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-1">
              {channelMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                      {member.user_id.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate font-medium text-slate-800">
                      @{member.user_id}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
