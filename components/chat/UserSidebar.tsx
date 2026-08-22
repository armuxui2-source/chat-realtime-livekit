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

interface UserSidebarProps {
  currentUser: UserProfile;
  contacts: UserProfile[];
  channels: Channel[];
  selectedUser: UserProfile | null;
  selectedChannel: Channel | null;
  onSelectUser: (user: UserProfile) => void;
  onSelectChannel: (channel: Channel) => void;
  onOpenCreateChannel: () => void;
  onOpenCreateLiveKitRoom: () => void;
  onOpenEditProfile?: () => void;
  onOpenBookmarks?: () => void;
  onOpenCallHistory?: () => void;
  onLogout?: () => void;
  unreadCount?: number;
  bookmarkedCount?: number;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  currentUser,
  contacts,
  channels,
  selectedUser,
  selectedChannel,
  onSelectUser,
  onSelectChannel,
  onOpenCreateChannel,
  onOpenCreateLiveKitRoom,
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
        return "bg-slate-300";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <aside
      data-testid="left-navigation-sidebar"
      className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col h-full bg-white border-r border-slate-200/80 select-none min-w-0"
    >
      {/* Header & Search Bar */}
      <div className="p-3.5 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Chats</h1>
          <button
            onClick={() => (activeTab === "dm" ? setShowAddContact(!showAddContact) : onOpenCreateChannel())}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            data-testid="contact-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="px-3.5 py-1.5 shrink-0">
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-medium">
          <button
            type="button"
            data-testid="tab-dm"
            onClick={() => setActiveTab("dm")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              activeTab === "dm"
                ? "bg-white text-slate-900 font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-700" strokeWidth={2} />
            <span>Direct</span>
          </button>
          <button
            type="button"
            data-testid="tab-channels"
            onClick={() => setActiveTab("channels")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              activeTab === "channels"
                ? "bg-white text-slate-900 font-semibold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-700" strokeWidth={2} />
            <span>Channels ({channels.length})</span>
          </button>
        </div>
      </div>

      {/* Add Custom Contact Box */}
      {showAddContact && activeTab === "dm" && (
        <div className="px-3.5 py-2 shrink-0">
          <form
            onSubmit={handleAddCustomContact}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-2"
          >
            <input
              type="text"
              value={newContactUsername}
              onChange={(e) => setNewContactUsername(e.target.value)}
              placeholder="Username..."
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="px-2.5 py-1 rounded-lg text-[11px] text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-semibold shadow-xs"
              >
                Start Chat
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Conversations List */}
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
                  className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left group ${
                    isSelected
                      ? "bg-slate-100 text-slate-900"
                      : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-xs`}
                    >
                      {user.display_name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusDot(
                        user.status
                      )}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {user.display_name}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        9:24 am
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      Let&apos;s sync on the new project updates...
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
                  className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all text-left group ${
                    isSelected
                      ? "bg-slate-100 text-slate-900"
                      : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    {channel.is_private ? (
                      <Lock className="w-4 h-4 text-slate-600" strokeWidth={2} />
                    ) : (
                      <Hash className="w-4 h-4 text-slate-600" strokeWidth={2} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        #{channel.name}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        1 min
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {channel.description || "Team discussion"}
                    </p>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* Quick LiveKit Meeting Button */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        <button
          onClick={onOpenCreateLiveKitRoom}
          data-testid="quick-create-meet-room-btn"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-all active:scale-95 shadow-xs"
        >
          <Video className="w-4 h-4 text-emerald-400" strokeWidth={2} />
          <span>New Meeting</span>
        </button>
      </div>
    </aside>
  );
};
