"use client";

import React, { useState } from "react";
import { UserProfile, Channel } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  Search,
  MessageSquare,
  Users,
  Plus,
  Hash,
  Lock,
  Video,
} from "lucide-react";
import { StoryTray } from "@/components/story/StoryTray";
import { StoryItem } from "@/components/story/StoryViewerModal";

interface UserSidebarProps {
  currentUser: UserProfile;
  contacts: UserProfile[];
  channels: Channel[];
  stories?: StoryItem[];
  selectedUser: UserProfile | null;
  selectedChannel: Channel | null;
  onSelectUser: (user: UserProfile) => void;
  onSelectChannel: (channel: Channel) => void;
  onOpenCreateChannel: () => void;
  onOpenCreateLiveKitRoom: () => void;
  onOpenStory?: (index: number) => void;
  onAddStory?: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  currentUser,
  contacts,
  channels,
  stories = [],
  selectedUser,
  selectedChannel,
  onSelectUser,
  onSelectChannel,
  onOpenCreateChannel,
  onOpenCreateLiveKitRoom,
  onOpenStory,
  onAddStory,
}) => {
  const [activeTab, setActiveTab] = useState<"dm" | "channels">("dm");
  const [search, setSearch] = useState("");
  const [newContactUsername, setNewContactUsername] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);

  const filteredContacts = contacts.filter(
    (c) =>
      c.display_name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  const filteredChannels = channels.filter(
    (ch) =>
      ch.name.toLowerCase().includes(search.toLowerCase()) ||
      (ch.description && ch.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactUsername.trim()) return;
    const clean = newContactUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (clean === currentUser.username) return;

    const newContact: UserProfile = {
      id: clean,
      username: clean,
      display_name: newContactUsername.trim(),
      status: "online",
      last_seen: new Date().toISOString(),
    };

    onSelectUser(newContact);
    setNewContactUsername("");
    setShowAddContact(false);
  };

  const getStatusDot = (status?: string) => {
    switch (status) {
      case "busy":
        return "bg-rose-500";
      case "away":
        return "bg-amber-500";
      case "offline":
        return "bg-slate-500";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <aside
      data-testid="left-navigation-sidebar"
      className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col h-full bg-[#12161F] border-r border-white/10 select-none min-w-0 font-prompt text-white"
    >
      {/* Top Header & Search Bar */}
      <div className="p-4 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <h1 className="text-base font-bold text-white tracking-tight">ข้อความสนทนา</h1>
          <button
            onClick={() => (activeTab === "dm" ? setShowAddContact(!showAddContact) : onOpenCreateChannel())}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="เริ่มแชทใหม่"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" strokeWidth={2} />
          <input
            type="text"
            data-testid="contact-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาข้อความ, สมาชิก, ช่อง..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#0B0D11] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Instagram-Style Top Story Tray */}
      {stories.length > 0 && onOpenStory && (
        <StoryTray
          currentUser={currentUser}
          stories={stories}
          onOpenStory={onOpenStory}
          onAddStory={onAddStory}
        />
      )}

      {/* Segmented Tab Controls */}
      <div className="px-4 py-2 shrink-0">
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0B0D11] border border-white/10 text-xs font-medium">
          <button
            type="button"
            data-testid="tab-dm"
            onClick={() => setActiveTab("dm")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl transition-all ${
              activeTab === "dm"
                ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ส่วนตัว (Direct)</span>
          </button>
          <button
            type="button"
            data-testid="tab-channels"
            onClick={() => setActiveTab("channels")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl transition-all ${
              activeTab === "channels"
                ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>กลุ่ม ({channels.length})</span>
          </button>
        </div>
      </div>

      {/* Add Custom Contact Box */}
      {showAddContact && activeTab === "dm" && (
        <div className="px-4 py-2 shrink-0">
          <form
            onSubmit={handleAddCustomContact}
            className="p-3 rounded-2xl bg-[#0B0D11] border border-white/10 shadow-sm space-y-2"
          >
            <input
              type="text"
              value={newContactUsername}
              onChange={(e) => setNewContactUsername(e.target.value)}
              placeholder="ระบุชื่อ Username..."
              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="px-2.5 py-1 rounded-lg text-[11px] text-slate-400"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow-xs"
              >
                เริ่มแชท
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Conversations Feed */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar py-1">
        {activeTab === "dm" ? (
          <>
            {filteredContacts.map((user) => {
              const isSelected = selectedUser?.username === user.username && !selectedChannel;
              const gradient = getAvatarColor(user.username);

              return (
                <button
                  key={user.username}
                  data-testid={`contact-item-${user.username}`}
                  onClick={() => onSelectUser(user)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group ${
                    isSelected
                      ? "bg-emerald-600/15 border border-emerald-500/40 text-white"
                      : "hover:bg-white/5 text-slate-300 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-md ring-1 ring-white/20`}
                    >
                      {user.display_name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#12161F] ${getStatusDot(
                        user.status
                      )}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">
                        {user.display_name}
                      </p>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                        9:24
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      ข้อความสนทนาล่าสุด...
                    </p>
                  </div>
                </button>
              );
            })}
          </>
        ) : (
          <>
            {filteredChannels.map((channel) => {
              const isSelected = selectedChannel?.id === channel.id;

              return (
                <button
                  key={channel.id}
                  data-testid={`channel-item-${channel.id}`}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group ${
                    isSelected
                      ? "bg-emerald-600/15 border border-emerald-500/40 text-white"
                      : "hover:bg-white/5 text-slate-300 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#0B0D11] border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                    {channel.is_private ? (
                      <Lock className="w-4 h-4 text-amber-400" strokeWidth={2} />
                    ) : (
                      <Hash className="w-5 h-5" strokeWidth={2} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">
                        #{channel.name}
                      </p>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                        1 นาที
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {channel.description || "ช่องสนทนากลุ่ม"}
                    </p>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>
    </aside>
  );
};
