"use client";

import React from "react";
import { ChatMessage } from "@/types/chat";
import { formatMessageTime, getAvatarColor } from "@/lib/utils";
import { Bookmark, X, ArrowUpRight, Trash2, FileText, Mic } from "lucide-react";

interface BookmarksDrawerProps {
  isOpen: boolean;
  bookmarkedMessages: ChatMessage[];
  onClose: () => void;
  onRemoveBookmark: (messageId: string) => void;
  onJumpToMessage: (messageId: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  bookmarkedMessages,
  onClose,
  onRemoveBookmark,
  onJumpToMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      data-testid="bookmarks-drawer"
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/20 backdrop-blur-sm animate-fade-in font-prompt select-none"
    >
      <div className="w-full max-w-md h-full bg-white/95 border-l border-slate-200 p-6 flex flex-col shadow-2xl backdrop-blur-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                ข้อความที่บันทึกไว้ (Bookmarks)
              </h2>
              <p className="text-xs text-slate-400">
                {bookmarkedMessages.length} รายการที่บันทึกไว้
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
          {bookmarkedMessages.length > 0 ? (
            bookmarkedMessages.map((msg) => (
              <div
                key={msg.id}
                data-testid={`bookmark-card-${msg.id}`}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 transition-all space-y-2 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-tr ${getAvatarColor(
                        msg.sender_id
                      )} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {msg.sender_id.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      @{msg.sender_id}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatMessageTime(msg.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onJumpToMessage(msg.id)}
                      data-testid={`jump-bookmark-btn-${msg.id}`}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      title="ไปยังข้อความนี้"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(msg.id)}
                      data-testid={`remove-bookmark-btn-${msg.id}`}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="ลบออกจากรายการบันทึก"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content preview */}
                {msg.content && (
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {msg.content}
                  </p>
                )}

                {msg.file_url && msg.message_type === "image" && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.file_url}
                      alt="Bookmark attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {msg.file_url && msg.message_type === "audio" && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-xs text-blue-600">
                    <Mic className="w-4 h-4 text-blue-500" />
                    <span className="text-[11px] font-medium">บันทึกเสียง (Voice Note)</span>
                  </div>
                )}

                {msg.file_url && msg.message_type === "file" && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-[11px] truncate">{msg.file_name || "Document"}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <Bookmark className="w-10 h-10 mb-2 opacity-30 text-amber-500" />
              <p className="text-xs font-medium">ยังไม่มีข้อความที่บันทึกไว้</p>
              <p className="text-[11px] text-slate-400 mt-1">
                คลิกไอคอน Bookmark ที่ข้อความเพื่อบันทึก
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
