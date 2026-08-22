"use client";

import React from "react";
import { UserProfile } from "@/types/chat";
import {
  MessageSquare,
  Settings,
  LogOut,
  Bookmark,
  PhoneCall,
  Sparkles,
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
      className="w-16 lg:w-60 shrink-0 flex flex-col h-full bg-[#FFFFFF] border-r border-[#E2E8F0] p-3 lg:p-4 select-none items-center lg:items-stretch justify-between"
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-center lg:justify-between px-1 py-2 mb-4 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm shrink-0">
              <Command className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="hidden lg:block min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                  Ticketapp
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#0D652D] border border-[#CEEAD6]">
                  PRO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Bento Card */}
        <div
          onClick={onOpenEditProfile}
          data-testid="user-profile-button"
          className="flex items-center gap-3 p-2 lg:p-2.5 mb-5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all group w-full"
          title="Click to edit profile"
        >
          <div className="relative shrink-0">
            <div
              className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                currentUser.username
              )} flex items-center justify-center text-white text-xs lg:text-sm font-bold shadow-sm`}
            >
              {currentUser.display_name.charAt(0).toUpperCase()}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                currentUser.status === "busy"
                  ? "bg-rose-500"
                  : currentUser.status === "away"
                  ? "bg-amber-500"
                  : currentUser.status === "offline"
                  ? "bg-slate-400"
                  : "bg-emerald-500"
              }`}
            />
          </div>
          <div className="hidden lg:block min-w-0 flex-1 text-left">
            <h2 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {currentUser.display_name}
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              @{currentUser.username}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1 w-full">
          <button
            type="button"
            data-testid="nav-messages"
            className="w-full flex items-center justify-center lg:justify-between px-3 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs shadow-sm transition-all relative"
            title="Messages"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
              <span className="hidden lg:inline font-semibold">Messages</span>
            </div>
            {unreadCount > 0 && (
              <span className="lg:static absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {onOpenCallHistory && (
            <button
              type="button"
              data-testid="open-call-history-btn"
              onClick={onOpenCallHistory}
              className="w-full flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-all"
              title="Call History"
            >
              <PhoneCall className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
              <span className="hidden lg:inline">Calls & Meet</span>
            </button>
          )}

          {onOpenBookmarks && (
            <button
              type="button"
              data-testid="open-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="w-full flex items-center justify-center lg:justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-all relative"
              title="Saved Items"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
                <span className="hidden lg:inline">Saved Notes</span>
              </div>
              {bookmarkedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          )}

          {onOpenEditProfile && (
            <button
              type="button"
              data-testid="open-edit-profile-btn"
              onClick={onOpenEditProfile}
              className="w-full flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-all"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
              <span className="hidden lg:inline">Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* Logout Footer */}
      <div className="pt-3 border-t border-slate-100 w-full">
        <button
          type="button"
          data-testid="logout-button"
          onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
          title="Log out"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          <span className="hidden lg:inline">Sign out</span>
        </button>
      </div>
    </nav>
  );
};
