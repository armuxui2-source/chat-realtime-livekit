"use client";

import React from "react";
import { UserProfile } from "@/types/chat";
import {
  MessageSquare,
  Settings,
  LogOut,
  Bookmark,
  PhoneCall,
  Command,
  UserPlus,
} from "lucide-react";
import { getAvatarColor } from "@/lib/utils";

interface LeftSlimNavProps {
  currentUser: UserProfile;
  unreadCount?: number;
  bookmarkedCount?: number;
  onOpenEditProfile?: () => void;
  onOpenBookmarks?: () => void;
  onOpenCallHistory?: () => void;
  onOpenAddFriends?: () => void;
  onLogout: () => void;
}

export const LeftSlimNav: React.FC<LeftSlimNavProps> = ({
  currentUser,
  unreadCount = 2,
  bookmarkedCount = 0,
  onOpenEditProfile,
  onOpenBookmarks,
  onOpenCallHistory,
  onOpenAddFriends,
  onLogout,
}) => {
  return (
    <nav
      data-testid="left-slim-navigation"
      className="w-16 shrink-0 flex flex-col h-full bg-[#0F1216] border-r border-white/[0.07] p-2.5 select-none items-center justify-between z-20 font-prompt"
    >
      {/* Brand Logo & Top Actions */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div
          className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
          title="Ticketapp"
        >
          <Command className="w-5 h-5" strokeWidth={2.2} />
        </div>

        <div className="w-8 border-t border-white/[0.08] my-1" />

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            type="button"
            data-testid="nav-messages"
            className="w-10 h-10 rounded-2xl emerald-button-gradient text-white flex items-center justify-center relative transition-all group shadow-md"
            title="แชทข้อความ"
          >
            <MessageSquare className="w-5 h-5" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F1216] animate-pulse" />
            )}
          </button>

          {onOpenAddFriends && (
            <button
              type="button"
              data-testid="open-add-friends-btn"
              onClick={onOpenAddFriends}
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all"
              title="เพิ่มเพื่อน & ค้นหา"
            >
              <UserPlus className="w-5 h-5" strokeWidth={1.8} />
            </button>
          )}

          {onOpenCallHistory && (
            <button
              type="button"
              data-testid="open-call-history-btn"
              onClick={onOpenCallHistory}
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all"
              title="ประวัติการโทร & WebRTC"
            >
              <PhoneCall className="w-5 h-5" strokeWidth={1.8} />
            </button>
          )}

          {onOpenBookmarks && (
            <button
              type="button"
              data-testid="open-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all relative"
              title="ข้อความที่บันทึก"
            >
              <Bookmark className="w-5 h-5" strokeWidth={1.8} />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0F1216]" />
              )}
            </button>
          )}

          {onOpenEditProfile && (
            <button
              type="button"
              data-testid="open-edit-profile-btn"
              onClick={onOpenEditProfile}
              className="w-10 h-10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all"
              title="ตั้งค่าโปรไฟล์"
            >
              <Settings className="w-5 h-5" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      {/* Profile & Logout at Bottom */}
      <div className="flex flex-col items-center gap-3 w-full">
        <button
          onClick={onOpenEditProfile}
          data-testid="user-profile-button"
          className="relative group"
          title={`ตั้งค่าโปรไฟล์ (${currentUser.display_name})`}
        >
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
              currentUser.username
            )} flex items-center justify-center text-white text-xs font-bold shadow-md ring-1 ring-white/20 group-hover:ring-emerald-500 transition-all`}
          >
            {currentUser.display_name.charAt(0).toUpperCase()}
          </div>
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#0F1216] ${
              currentUser.status === "busy"
                ? "bg-rose-500"
                : currentUser.status === "away"
                ? "bg-amber-500"
                : currentUser.status === "offline"
                ? "bg-slate-500"
                : "bg-emerald-500"
            }`}
          />
        </button>

        <button
          onClick={onLogout}
          className="w-10 h-10 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-all"
          title="ออกจากระบบ"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.8} />
        </button>
      </div>
    </nav>
  );
};
