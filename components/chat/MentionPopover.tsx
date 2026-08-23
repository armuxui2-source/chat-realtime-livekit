"use client";

import React from "react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import { AtSign } from "lucide-react";

interface MentionPopoverProps {
  users: UserProfile[];
  filterQuery: string;
  onSelectUser: (user: UserProfile) => void;
}

export const MentionPopover: React.FC<MentionPopoverProps> = ({
  users,
  filterQuery,
  onSelectUser,
}) => {
  const filteredUsers = users.filter(
    (u) =>
      u.display_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (filteredUsers.length === 0) return null;

  return (
    <div
      data-testid="mention-popover"
      className="absolute bottom-full left-4 mb-2 w-64 max-h-48 overflow-y-auto rounded-2xl bg-[#161A22]/95 border border-white/[0.08] shadow-2xl p-1.5 z-40 custom-scrollbar font-prompt animate-scale-up select-none backdrop-blur-2xl text-white"
    >
      <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-white/[0.07] flex items-center gap-1.5">
        <AtSign className="w-3 h-3 text-emerald-400" />
        <span>Mention Member</span>
      </div>

      <div className="space-y-1 mt-1">
        {filteredUsers.map((user) => (
          <button
            key={user.username}
            type="button"
            data-testid={`mention-item-${user.username}`}
            onClick={() => onSelectUser(user)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
          >
            <div
              className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                user.username
              )} flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm`}
            >
              {user.display_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 truncate">
              <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                {user.display_name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">@{user.username}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
