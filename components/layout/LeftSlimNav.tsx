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
} from "lucide-react";
import { getAvatarColor } from "@/lib/utils";

interface LeftSlimNavProps {
  currentUser: UserProfile;
  unreadCount?: number;
  bookmarkedCount?: number;
  onOpenEditProfile?: () => void;
  onOpenBookmarks?: () => void;
  onOpenCallHistory?: () => void;
  onLogout: () => void;
}

export const LeftSlimNav: React.FC<LeftSlimNavProps> = ({
  currentUser,
  unreadCount = 2,
  bookmarkedCount = 0,
  onOpenEditProfile,
  onOpenBookmarks,
  onOpenCallHistory,
  onLogout,
}) => {
  return (
    <nav
      data-testid="left-slim-navigation"
      className="w-16 shrink-0 flex flex-col h-full bg-slate-900 border-r border-slate-800 p-2.5 select-none items-center justify-between z-20"
    >
      {/* Brand Logo & Top Actions */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div
          className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-sm cursor-pointer"
          title="Ticketapp"
        >
          <Command className="w-5 h-5" strokeWidth={2.2} />
        </div>

        <div className="w-8 border-t border-slate-800 my-1" />

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            type="button"
            data-testid="nav-messages"
            className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center relative transition-all group"
            title="Messages"
          >
            <MessageSquare className="w-5 h-5" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            )}
          </button>

          {onOpenCallHistory && (
            <button
              type="button"
              data-testid="open-call-history-btn"
              onClick={onOpenCallHistory}
              className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all"
              title="Calls & Meet"
            >
              <PhoneCall className="w-5 h-5" strokeWidth={1.8} />
            </button>
          )}

          {onOpenBookmarks && (
            <button
              type="button"
              data-testid="open-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all relative"
              title="Saved Items"
            >
              <Bookmark className="w-5 h-5" strokeWidth={1.8} />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              )}
            </button>
          )}

          {onOpenEditProfile && (
            <button
              type="button"
              data-testid="open-edit-profile-btn"
              onClick={onOpenEditProfile}
              className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all"
              title="Settings"
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
          title={`Edit Profile (${currentUser.display_name})`}
        >
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
              currentUser.username
            )} flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-800 group-hover:ring-slate-600 transition-all`}
          >
            {currentUser.display_name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
        </button>

        <button
          type="button"
          data-testid="logout-button"
          onClick={onLogout}
          className="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 flex items-center justify-center transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.8} />
        </button>
      </div>
    </nav>
  );
};
