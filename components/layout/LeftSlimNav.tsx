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
  friendRequestsCount?: number;
  missedCallsCount?: number;
  bookmarkedCount?: number;
  onOpenEditProfile?: () => void;
  onOpenBookmarks?: () => void;
  onOpenCallHistory?: () => void;
  onOpenAddFriends?: () => void;
  onLogout: () => void;
}

export const LeftSlimNav: React.FC<LeftSlimNavProps> = ({
  currentUser,
  unreadCount = 0,
  friendRequestsCount = 0,
  missedCallsCount = 0,
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
        <div className="flex flex-col items-center gap-2.5 w-full">
          {/* Chat Messages */}
          <button
            type="button"
            data-testid="nav-messages"
            className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center relative transition-all group shadow-xs border border-emerald-500/30"
            title="แชทข้อความ"
          >
            <MessageSquare className="w-5 h-5" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center ring-2 ring-white dark:ring-[#0F1216] shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Add Friends / Discovery */}
          {onOpenAddFriends && (
            <button
              type="button"
              data-testid="open-add-friends-btn"
              onClick={onOpenAddFriends}
              className="w-10 h-10 rounded-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-center transition-all relative group"
              title="เพิ่มเพื่อน & คำขอเป็นเพื่อน"
            >
              <UserPlus className="w-5 h-5" strokeWidth={1.8} />
              {friendRequestsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center ring-2 ring-white dark:ring-[#0F1216] shadow-xs">
                  {friendRequestsCount}
                </span>
              )}
            </button>
          )}

          {/* Call Logs & WebRTC */}
          {onOpenCallHistory && (
            <button
              type="button"
              data-testid="open-call-history-btn"
              onClick={onOpenCallHistory}
              className="w-10 h-10 rounded-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-center transition-all relative group"
              title="ประวัติการโทร & สายที่ไม่ได้รับ"
            >
              <PhoneCall className="w-5 h-5" strokeWidth={1.8} />
              {missedCallsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0F1216]" />
              )}
            </button>
          )}

          {/* Bookmarks */}
          {onOpenBookmarks && (
            <button
              type="button"
              data-testid="open-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="w-10 h-10 rounded-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-center transition-all relative group"
              title="ข้อความที่บันทึกไว้"
            >
              <Bookmark className="w-5 h-5" strokeWidth={1.8} />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0F1216]" />
              )}
            </button>
          )}

          {/* Settings */}
          {onOpenEditProfile && (
            <button
              type="button"
              data-testid="open-settings-btn"
              onClick={onOpenEditProfile}
              className="w-10 h-10 rounded-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-center transition-all group"
              title="การตั้งค่าระบบ"
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
            className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${getAvatarColor(
              currentUser.username
            )} flex items-center justify-center text-white text-xs font-bold shadow-xs ring-1 ring-black/5 dark:ring-white/10 group-hover:ring-emerald-500 transition-all`}
          >
            {currentUser.display_name.charAt(0).toUpperCase()}
          </div>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#0F1216] ${
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
