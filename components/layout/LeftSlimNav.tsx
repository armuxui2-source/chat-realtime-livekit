"use client";

import React from "react";
import { UserProfile } from "@/types/chat";
import {
  LayoutGrid,
  MessageSquare,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Bookmark,
  PhoneCall,
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
      className="w-16 lg:w-56 shrink-0 flex flex-col h-full bg-slate-50/70 border-r border-slate-200/60 p-2.5 lg:p-4 select-none font-prompt items-center lg:items-stretch"
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-center lg:justify-start gap-2.5 px-1 lg:px-2 py-3 mb-2 lg:mb-4 w-full">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <div className="hidden lg:block min-w-0">
          <h1 className="text-sm font-bold text-slate-800 tracking-tight leading-tight truncate">
            Social Solution
          </h1>
        </div>
      </div>

      {/* User Profile Card with Peach Ring */}
      <div
        onClick={onOpenEditProfile}
        data-testid="user-profile-button"
        className="flex flex-col items-center text-center p-2 lg:p-3 mb-4 lg:mb-6 rounded-2xl bg-white/80 border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all group w-full"
        title="คลิกเพื่อแก้ไขโปรไฟล์"
      >
        <div className="relative mb-1 lg:mb-2">
          {/* Peach/Rose Accent Ring */}
          <div className="p-0.5 lg:p-1 rounded-full bg-gradient-to-tr from-rose-200 via-pink-100 to-amber-100 shadow-sm">
            <div
              className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-gradient-to-tr ${getAvatarColor(
                currentUser.username
              )} flex items-center justify-center text-white text-sm lg:text-lg font-bold shadow-inner`}
            >
              {currentUser.display_name.charAt(0).toUpperCase()}
            </div>
          </div>
          <span
            className={`absolute bottom-0 right-0 lg:bottom-1 lg:right-1 w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full border-2 border-white ${
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
        <h2 className="hidden lg:block text-xs font-bold text-slate-800 truncate w-full group-hover:text-blue-600 transition-colors">
          {currentUser.display_name}
        </h2>
        <p className="hidden lg:block text-[10px] text-slate-400 truncate w-full mt-0.5">
          @{currentUser.username}
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5 px-0 lg:px-1 w-full">
        {/* Messages */}
        <button
          type="button"
          data-testid="nav-messages"
          className="w-full flex items-center justify-center lg:justify-between p-2.5 lg:px-3 lg:py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold text-xs transition-all shadow-sm relative"
          title="Messages"
        >
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden lg:inline">Messages</span>
          </div>
          {unreadCount > 0 && (
            <span className="lg:static absolute -top-1 -right-1 px-1.5 lg:px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] lg:text-[10px] font-bold shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Call History */}
        {onOpenCallHistory && (
          <button
            type="button"
            data-testid="open-call-history-btn"
            onClick={onOpenCallHistory}
            className="w-full flex items-center justify-center lg:justify-start gap-2.5 p-2.5 lg:px-3 lg:py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 text-xs font-medium transition-colors"
            title="Call History"
          >
            <PhoneCall className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline">Call History</span>
          </button>
        )}

        {/* Bookmarks */}
        {onOpenBookmarks && (
          <button
            type="button"
            data-testid="open-bookmarks-btn"
            onClick={onOpenBookmarks}
            className="w-full flex items-center justify-center lg:justify-between p-2.5 lg:px-3 lg:py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 text-xs font-medium transition-colors relative"
            title="Saved / Drafts"
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span className="hidden lg:inline">Saved / Drafts</span>
            </div>
            {bookmarkedCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        )}

        {/* Settings */}
        {onOpenEditProfile && (
          <button
            type="button"
            data-testid="open-edit-profile-btn"
            onClick={onOpenEditProfile}
            className="w-full flex items-center justify-center lg:justify-start gap-2.5 p-2.5 lg:px-3 lg:py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/80 text-xs font-medium transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline">Settings</span>
          </button>
        )}
      </div>

      {/* Logout Footer */}
      <div className="pt-3 border-t border-slate-200/60 px-0 lg:px-1 w-full">
        <button
          type="button"
          data-testid="logout-button"
          onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start gap-2.5 p-2 lg:px-3 lg:py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:inline">Log out</span>
        </button>
      </div>
    </nav>
  );
};
