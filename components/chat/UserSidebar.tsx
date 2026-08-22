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
  LayoutGrid,
  PhoneCall,
  Bookmark,
  Settings,
  LogOut,
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
  onOpenEditProfile,
  onOpenBookmarks,
  onOpenCallHistory,
  onLogout,
  unreadCount = 0,
  bookmarkedCount = 0,
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
      className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col h-full bg-slate-50/40 border-r border-slate-200/60 select-none font-prompt min-w-0"
    >
      {/* Mobile Top Header (Visible only on mobile screen < md) */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-800">Social Solution</span>
        </div>

        {/* Mobile Quick Action Buttons */}
        <div className="flex items-center gap-1">
          {onOpenCallHistory && (
            <button
              onClick={onOpenCallHistory}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              title="ประวัติการโทร"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          )}
          {onOpenBookmarks && (
            <button
              onClick={onOpenBookmarks}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative"
              title="Bookmarks"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          )}
          {onOpenEditProfile && (
            <button
              onClick={onOpenEditProfile}
              className="p-1 rounded-full border border-slate-200 hover:border-blue-400 transition-colors ml-1"
              title="โปรไฟล์ของคุณ"
            >
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarColor(
                  currentUser.username
                )} flex items-center justify-center text-white text-[11px] font-bold`}
              >
                {currentUser.display_name.charAt(0).toUpperCase()}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Minimal Search Bar */}
      <div className="p-4 pb-2 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            data-testid="contact-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Active Users Horizontal Tray (Instagram / Messenger Stories Style) */}
      {contacts.length > 0 && (
        <div className="px-3 py-2 border-b border-slate-200/50 shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1">
            {contacts
              .filter((c) => c.username !== currentUser.username)
              .map((contact) => {
                const isSelected = selectedUser?.username === contact.username && !selectedChannel;
                const gradient = getAvatarColor(contact.username);

                return (
                  <button
                    key={`active-tray-${contact.username}`}
                    type="button"
                    onClick={() => onSelectUser(contact)}
                    className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none"
                    title={`แชทกับ ${contact.display_name}`}
                  >
                    <div
                      className={`relative p-0.5 rounded-full transition-all ${
                        isSelected
                          ? "ring-2 ring-blue-500"
                          : "group-hover:scale-105"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                      >
                        {contact.display_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 max-w-[50px] truncate group-hover:text-blue-600 transition-colors">
                      {contact.display_name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Tabs: Direct vs Groups */}
      <div className="px-4 py-2 shrink-0">
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-200/60 text-xs font-semibold">
          <button
            type="button"
            data-testid="tab-dm"
            onClick={() => setActiveTab("dm")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              activeTab === "dm"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            <span>Direct</span>
          </button>
          <button
            type="button"
            data-testid="tab-channels"
            onClick={() => setActiveTab("channels")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              activeTab === "channels"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>Groups ({channels.length})</span>
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1.5 custom-scrollbar py-2">
        {activeTab === "dm" ? (
          <>
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Contacts ({filteredContacts.length})</span>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                data-testid="toggle-add-contact-btn"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-0.5 text-[11px] font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>

            {showAddContact && (
              <form
                onSubmit={handleAddCustomContact}
                className="p-3 mb-2 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2"
              >
                <input
                  type="text"
                  value={newContactUsername}
                  onChange={(e) => setNewContactUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    className="px-2.5 py-1 rounded-lg text-[10px] text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-[10px] text-white font-medium shadow-sm"
                  >
                    Start Chat
                  </button>
                </div>
              </form>
            )}

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
                      ? "bg-white shadow-md shadow-slate-200/80 border border-slate-100 text-slate-900"
                      : "hover:bg-white/60 text-slate-600 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  {/* Circular Avatar with Status Dot */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                    >
                      {user.display_name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusDot(
                        user.status
                      )}`}
                    />
                  </div>

                  {/* Conversation snippet */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {user.display_name}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1 font-mono">
                        9:24 am
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Let&apos;s meet for dinner later today...
                    </p>
                  </div>
                </button>
              );
            })}
          </>
        ) : (
          <>
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Channels ({filteredChannels.length})</span>
              <button
                onClick={onOpenCreateChannel}
                data-testid="open-create-channel-btn"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-0.5 text-[11px] font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>Create</span>
              </button>
            </div>

            {filteredChannels.map((channel) => {
              const isSelected = selectedChannel?.id === channel.id;

              return (
                <button
                  key={channel.id}
                  data-testid={`channel-item-${channel.id}`}
                  onClick={() => onSelectChannel(channel)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group ${
                    isSelected
                      ? "bg-white shadow-md shadow-slate-200/80 border border-slate-100 text-slate-900"
                      : "hover:bg-white/60 text-slate-600 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    {channel.is_private ? (
                      <Lock className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Hash className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        #{channel.name}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1 font-mono">
                        1 min ago
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {channel.description || "General channel discussion"}
                    </p>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* Quick LiveKit Room Button */}
      <div className="p-3 border-t border-slate-200/60 shrink-0">
        <button
          onClick={onOpenCreateLiveKitRoom}
          data-testid="quick-create-meet-room-btn"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Video className="w-4 h-4" />
          <span>New LiveKit Meeting</span>
        </button>
      </div>
    </aside>
  );
};
