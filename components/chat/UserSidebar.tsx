"use client";

import React, { useState } from "react";
import { UserProfile, Channel } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  Search,
  Plus,
  SquarePen,
  ChevronDown,
  Lock,
  Hash,
  MessageSquare,
  Users,
} from "lucide-react";
import { StoryTray } from "../story/StoryTray";
import { StoryItem } from "../story/StoryViewerModal";

interface UserSidebarProps {
  currentUser: UserProfile;
  contacts: UserProfile[];
  channels: Channel[];
  selectedUser: UserProfile | null;
  selectedChannel: Channel | null;
  onSelectUser: (user: UserProfile) => void;
  onSelectChannel: (channel: Channel) => void;
  onOpenCreateChannel: () => void;
  onOpenCreateLiveKitRoom?: () => void;
  unreadCounts?: Record<string, number>;
  stories?: StoryItem[];
  onOpenStory?: (index: number) => void;
  onAddStory?: () => void;
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
  unreadCounts = {},
  stories = [],
  onOpenStory,
  onAddStory,
}) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"dm" | "channels">("dm");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactUsername, setNewContactUsername] = useState("");

  const filteredContacts = contacts.filter((c) =>
    c.display_name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactUsername.trim()) return;

    const fakeUser: UserProfile = {
      id: `custom-${Date.now()}`,
      username: newContactUsername.trim(),
      display_name: newContactUsername.trim(),
      status: "online",
      avatar_url: "",
    };
    onSelectUser(fakeUser);
    setNewContactUsername("");
    setShowAddContact(false);
  };

  return (
    <aside
      data-testid="left-navigation-sidebar"
      className="w-full md:w-80 lg:w-[350px] shrink-0 flex flex-col h-full bg-white dark:bg-[#000000] border-r border-[#DBDBDB] dark:border-[#262626] select-none min-w-0 font-prompt text-slate-900 dark:text-white"
    >
      {/* 1. Instagram Direct Header */}
      <div className="p-4 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
              {currentUser.username || "messages"}
              <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </h1>
          </div>
          <button
            onClick={() => (activeTab === "dm" ? setShowAddContact(!showAddContact) : onOpenCreateChannel())}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#262626] transition-all"
            title="เริ่มแชทใหม่ (New Message)"
          >
            <SquarePen className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* 2. Instagram Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            data-testid="contact-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาข้อความ..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#EFEFEF] dark:bg-[#262626] border-none text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      {/* 3. Instagram-Style Top Story Tray */}
      {stories.length > 0 && onOpenStory && (
        <StoryTray
          currentUser={currentUser}
          stories={stories}
          onOpenStory={onOpenStory}
          onAddStory={onAddStory}
        />
      )}

      {/* 4. Instagram Direct Sub-Tabs */}
      <div className="px-4 shrink-0 border-b border-[#DBDBDB] dark:border-[#262626]">
        <div className="flex items-center gap-6 text-xs font-semibold">
          <button
            type="button"
            data-testid="tab-dm"
            onClick={() => setActiveTab("dm")}
            className={`py-3 transition-all relative ${
              activeTab === "dm"
                ? "text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white -mb-[1px]"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            กล่องข้อความหลัก (Primary)
          </button>
          <button
            type="button"
            data-testid="tab-channels"
            onClick={() => setActiveTab("channels")}
            className={`py-3 transition-all relative ${
              activeTab === "channels"
                ? "text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white -mb-[1px]"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            ทั่วไป ({channels.length})
          </button>
        </div>
      </div>

      {/* Add Custom Contact Box */}
      {showAddContact && activeTab === "dm" && (
        <div className="px-4 py-2 shrink-0">
          <form
            onSubmit={handleAddCustomContact}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] shadow-sm space-y-2"
          >
            <input
              type="text"
              value={newContactUsername}
              onChange={(e) => setNewContactUsername(e.target.value)}
              placeholder="ระบุชื่อ Username..."
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-[#DBDBDB] dark:border-[#262626] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="px-2.5 py-1 rounded-lg text-[11px] text-slate-500"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#0095F6] text-white hover:bg-[#1877F2] transition-colors"
              >
                เริ่มแชท
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Conversations Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
        {activeTab === "dm" ? (
          <>
            {filteredContacts.map((user) => {
              const isSelected = selectedUser?.username === user.username && !selectedChannel;
              const gradient = getAvatarColor(user.username);

              return (
                <button
                  key={user.id}
                  data-testid={`contact-item-${user.username}`}
                  onClick={() => onSelectUser(user)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 transition-all text-left group ${
                    isSelected
                      ? "bg-[#EFEFEF] dark:bg-[#262626] text-slate-900 dark:text-white"
                      : "hover:bg-[#FAFAFA] dark:hover:bg-[#121212] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-13 h-13 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-sm font-bold shadow-xs`}
                    >
                      {user.display_name.charAt(0).toUpperCase()}
                    </div>
                    {user.status === "online" && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-black bg-[#10B981]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user.display_name}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5 space-x-1 truncate">
                      <span className="truncate max-w-[140px]">ข้อความสนทนาล่าสุด...</span>
                      <span>·</span>
                      <span className="shrink-0">2 ชม.</span>
                    </div>
                  </div>

                  {(unreadCounts[user.username] || 0) > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0095F6] shrink-0 ml-1" />
                  )}
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
                  className={`w-full flex items-center gap-3.5 px-4 py-3 transition-all text-left group ${
                    isSelected
                      ? "bg-[#EFEFEF] dark:bg-[#262626] text-slate-900 dark:text-white"
                      : "hover:bg-[#FAFAFA] dark:hover:bg-[#121212] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="w-13 h-13 rounded-full bg-[#EFEFEF] dark:bg-[#262626] border border-[#DBDBDB] dark:border-[#363636] flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                    {channel.is_private ? (
                      <Lock className="w-5 h-5 text-amber-500" strokeWidth={2} />
                    ) : (
                      <Hash className="w-6 h-6" strokeWidth={2} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      #{channel.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
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
