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
      className="w-[72px] shrink-0 flex flex-col h-full bg-white dark:bg-black border-r border-[#DBDBDB] dark:border-[#262626] py-5 px-3 select-none items-center justify-between z-20 font-prompt"
    >
      {/* Brand Logo & Top Actions */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 dark:text-white hover:scale-105 transition-transform cursor-pointer"
          title="Ticketapp"
        >
          <Command className="w-6 h-6" strokeWidth={2.2} />
        </div>

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Chat Messages (Active) */}
          <button
            type="button"
            data-testid="nav-messages"
            className="w-12 h-12 rounded-xl text-slate-900 dark:text-white bg-slate-100 dark:bg-[#262626] flex items-center justify-center relative transition-all group"
            title="ข้อความไดเรกต์ (Direct)"
          >
            <MessageSquare className="w-6 h-6" strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ED4956] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-black">
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
              className="w-12 h-12 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] flex items-center justify-center transition-all relative group"
              title="เพิ่มเพื่อน & คำขอเป็นเพื่อน"
            >
              <UserPlus className="w-6 h-6" strokeWidth={1.8} />
              {friendRequestsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ED4956] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-black">
                  {friendRequestsCount}
                </span>
              )}
            </button>
          )}

          {/* Call Logs */}
          {onOpenCallHistory && (
            <button
              type="button"
              data-testid="open-call-history-btn"
              onClick={onOpenCallHistory}
              className="w-12 h-12 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] flex items-center justify-center transition-all relative group"
              title="ประวัติการโทร"
            >
              <PhoneCall className="w-6 h-6" strokeWidth={1.8} />
              {missedCallsCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#ED4956] ring-2 ring-white dark:ring-black" />
              )}
            </button>
          )}

          {/* Bookmarks */}
          {onOpenBookmarks && (
            <button
              type="button"
              data-testid="open-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="w-12 h-12 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] flex items-center justify-center transition-all relative group"
              title="บันทึกไว้"
            >
              <Bookmark className="w-6 h-6" strokeWidth={1.8} />
              {bookmarkedCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#0095F6] ring-2 ring-white dark:ring-black" />
              )}
            </button>
          )}

          {/* Settings */}
          {onOpenEditProfile && (
            <button
              type="button"
              data-testid="open-settings-btn"
              onClick={onOpenEditProfile}
              className="w-12 h-12 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A1A1A] flex items-center justify-center transition-all group"
              title="การตั้งค่า"
            >
              <Settings className="w-6 h-6" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      {/* Profile at Bottom */}
      <div className="flex flex-col items-center gap-3 w-full">
        <button
          onClick={onOpenEditProfile}
          data-testid="user-profile-button"
          className="relative group p-1"
          title={`โปรไฟล์ (${currentUser.display_name})`}
        >
          <div
            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarColor(
              currentUser.username
            )} flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent group-hover:ring-slate-900 dark:group-hover:ring-white transition-all`}
          >
            {currentUser.display_name.charAt(0).toUpperCase()}
          </div>
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
