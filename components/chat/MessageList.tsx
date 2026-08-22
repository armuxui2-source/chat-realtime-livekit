"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, UserProfile } from "@/types/chat";
import { formatMessageTime, getAvatarColor } from "@/lib/utils";
import {
  CheckCheck,
  Reply,
  Smile,
  Edit2,
  Trash2,
  FileText,
  Download,
  ThumbsUp,
  Heart,
  Laugh,
  CheckCircle2,
  Check,
  Pin,
  PinOff,
  Search,
  Bookmark,
  Forward,
} from "lucide-react";
import { ReplyContext } from "@/hooks/useSupabaseChat";
import { AudioMessageBubble } from "./AudioMessageBubble";
import { CodeSnippetBlock } from "./CodeSnippetBlock";
import { LinkPreviewCard } from "./LinkPreviewCard";

interface MessageListProps {
  messages: ChatMessage[];
  currentUser: UserProfile;
  selectedUser: UserProfile;
  isTyping: boolean;
  searchQuery?: string;
  bookmarkedIds?: string[];
  onSetReply: (reply: ReplyContext) => void;
  onToggleReaction: (messageId: string, icon: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onTogglePin?: (messageId: string) => void;
  onToggleBookmark?: (message: ChatMessage) => void;
  onOpenLightbox?: (url: string, name?: string) => void;
  onOpenForward?: (message: ChatMessage) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  selectedUser,
  isTyping,
  searchQuery = "",
  bookmarkedIds = [],
  onSetReply,
  onToggleReaction,
  onEditMessage,
  onDeleteMessage,
  onTogglePin,
  onToggleBookmark,
  onOpenLightbox,
  onOpenForward,
}) => {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [activeReactionMenuId, setActiveReactionMenuId] = useState<string | null>(null);

  const availableReactions = [
    { name: "thumbs-up", icon: ThumbsUp, label: "Like" },
    { name: "heart", icon: Heart, label: "Love" },
    { name: "laugh", icon: Laugh, label: "Laugh" },
    { name: "check", icon: CheckCircle2, label: "Done" },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setEditContent(msg.content);
  };

  const handleSaveEdit = (msgId: string) => {
    if (editContent.trim()) {
      onEditMessage(msgId, editContent.trim());
    }
    setEditingMessageId(null);
  };

  // Filter messages by search query
  const filteredMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.content.toLowerCase().includes(q) ||
      (m.file_name && m.file_name.toLowerCase().includes(q))
    );
  });

  const pinnedMessages = messages.filter((m) => m.is_pinned && !m.is_deleted);

  const parseCodeBlock = (content: string) => {
    const match = content.match(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
    if (!match) return null;
    return {
      language: match[1] || "text",
      code: match[2].trim(),
      before: content.substring(0, match.index).trim(),
      after: content.substring((match.index || 0) + match[0].length).trim(),
    };
  };

  const extractUrl = (content: string) => {
    const match = content.match(/(https?:\/\/[^\s]+)/g);
    return match ? match[0] : null;
  };

  return (
    <div
      data-testid="message-list-container"
      className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar select-none font-prompt bg-slate-50/30"
    >
      {/* Pinned Sticky Banner */}
      {pinnedMessages.length > 0 && (
        <div
          data-testid="pinned-message-banner"
          className="sticky top-0 z-20 mb-3 p-3 rounded-2xl bg-white/95 border border-amber-200/80 shadow-md backdrop-blur-md flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
              <Pin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">
                  Pinned Messages
                </span>
                {pinnedMessages.length > 1 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    +{pinnedMessages.length - 1} more
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">
                {pinnedMessages[0].content || (pinnedMessages[0].file_name ? `[File] ${pinnedMessages[0].file_name}` : "[Voice Note]")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onTogglePin && onTogglePin(pinnedMessages[0].id)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 ml-2"
            title="Unpin message"
          >
            <PinOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Realtime Search Results Banner */}
      {searchQuery.trim() && (
        <div
          data-testid="search-results-banner"
          className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-700 font-medium flex items-center justify-between"
        >
          <span>ผลการค้นหาสำหรับ &quot;{searchQuery}&quot; ({filteredMessages.length} ข้อความ)</span>
        </div>
      )}

      {/* Messages Feed */}
      {filteredMessages.map((msg) => {
        const isMe = msg.sender_id === currentUser.username;
        const formattedTime = formatMessageTime(msg.created_at);
        const isEditing = editingMessageId === msg.id;
        const isBookmarked = bookmarkedIds.includes(msg.id);
        const codeBlock = parseCodeBlock(msg.content);
        const urlMatch = extractUrl(msg.content);

        return (
          <div
            key={msg.id}
            id={`msg-${msg.id}`}
            data-testid={`message-item-${msg.id}`}
            className={`group flex items-end gap-3 transition-all relative ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar for Incoming Messages */}
            {!isMe && (
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-tr ${getAvatarColor(
                  selectedUser.username
                )} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
              >
                {selectedUser.display_name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
              {/* Sender Name in Group Chat */}
              {!isMe && (
                <span className="text-[11px] font-semibold text-slate-500 mb-1 px-1">
                  {selectedUser.display_name}
                </span>
              )}

              {/* Message Bubble Body */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed relative ${
                  msg.is_deleted
                    ? "bg-slate-100 text-slate-400 italic border border-slate-200"
                    : isMe
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 rounded-br-sm"
                    : "bg-white border border-slate-200/80 text-slate-800 shadow-sm rounded-bl-sm"
                }`}
              >
                {/* Pinned Tag on Bubble */}
                {msg.is_pinned && !msg.is_deleted && (
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold mb-1">
                    <Pin className="w-3 h-3" />
                    <span>Pinned</span>
                  </div>
                )}

                {/* Quoted Reply */}
                {msg.reply_to_sender && !msg.is_deleted && (
                  <div className={`mb-2 p-2 rounded-xl text-xs border-l-2 ${
                    isMe ? "bg-blue-700/60 border-white/60 text-white" : "bg-slate-50 border-blue-500 text-slate-600"
                  }`}>
                    <span className="font-bold block">
                      @{msg.reply_to_sender}
                    </span>
                    <span className="truncate block opacity-90">
                      {msg.reply_to_content}
                    </span>
                  </div>
                )}

                {/* Attached Image */}
                {msg.file_url && msg.message_type === "image" && !msg.is_deleted && (
                  <div
                    onClick={() => onOpenLightbox?.(msg.file_url!, msg.file_name)}
                    data-testid="message-image-attachment"
                    className="mb-2 overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer group"
                    title="Click to view full image"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.file_url}
                      alt={msg.file_name || "Attachment"}
                      className="w-full max-h-60 object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* Attached File */}
                {msg.file_url && msg.message_type === "file" && !msg.is_deleted && (
                  <div className={`mb-2 flex items-center justify-between p-3 rounded-xl border ${
                    isMe ? "bg-blue-700/40 border-white/20" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                      <div className="min-w-0 truncate">
                        <p className="font-medium text-xs truncate">
                          {msg.file_name || "Document"}
                        </p>
                        <p className="text-[10px] opacity-70">Attachment</p>
                      </div>
                    </div>
                    <a
                      href={msg.file_url}
                      target="_blank"
                      rel="noreferrer"
                      download={msg.file_name}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors shrink-0 ml-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Voice Note / Audio Message */}
                {msg.file_url && (msg.message_type === "audio" || msg.file_type?.startsWith("audio/")) && !msg.is_deleted && (
                  <div className="mb-2">
                    <AudioMessageBubble audioUrl={msg.file_url} isMe={isMe} />
                  </div>
                )}

                {/* Content or Inline Edit */}
                {isEditing ? (
                  <div className="flex flex-col gap-2 my-1">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingMessageId(null)}
                        className="px-2 py-0.5 rounded text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(msg.id)}
                        className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px] text-white font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>บันทึก</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  msg.content && (
                    <div className="space-y-1.5">
                      {codeBlock ? (
                        <>
                          {codeBlock.before && (
                            <p className="whitespace-pre-wrap break-words">{codeBlock.before}</p>
                          )}
                          <CodeSnippetBlock
                            code={codeBlock.code}
                            language={codeBlock.language}
                          />
                          {codeBlock.after && (
                            <p className="whitespace-pre-wrap break-words">{codeBlock.after}</p>
                          )}
                          {urlMatch && (
                            <LinkPreviewCard url={urlMatch} />
                          )}
                        </>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap break-words leading-relaxed">
                            {msg.content.split(/(@[a-zA-Z0-9_\u0E00-\u0E7F\s]+)/g).map((part, i) =>
                              part.startsWith("@") ? (
                                <span
                                  key={i}
                                  data-testid="mention-highlight"
                                  className={`font-semibold px-1.5 py-0.5 rounded-md ${
                                    isMe ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                                  }`}
                                >
                                  {part}
                                </span>
                              ) : (
                                part
                              )
                            )}
                          </p>
                          {urlMatch && (
                            <LinkPreviewCard url={urlMatch} />
                          )}
                        </>
                      )}
                    </div>
                  )
                )}

                {/* Footer Time & Status */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    isMe ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {msg.is_edited && <span>(แก้ไขแล้ว)</span>}
                  <span>{formattedTime}</span>
                  {isMe && !msg.is_deleted && <CheckCheck className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Hover Actions Toolbar */}
              {!msg.is_deleted && (
                <div
                  className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 mt-1 p-1 rounded-xl bg-white border border-slate-200 shadow-sm ${
                    isMe ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Reaction Button */}
                  <div className="relative">
                    <button
                      type="button"
                      data-testid={`react-btn-${msg.id}`}
                      onClick={() =>
                        setActiveReactionMenuId(
                          activeReactionMenuId === msg.id ? null : msg.id
                        )
                      }
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors"
                      title="Add Reaction"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>

                    {activeReactionMenuId === msg.id && (
                      <div className="absolute bottom-full left-0 mb-1 flex items-center gap-1 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xl z-30 animate-scale-up">
                        {availableReactions.map((r) => {
                          const IconComp = r.icon;
                          return (
                            <button
                              key={r.name}
                              data-testid={`reaction-option-${r.name}`}
                              type="button"
                              onClick={() => {
                                onToggleReaction(msg.id, r.name);
                                setActiveReactionMenuId(null);
                              }}
                              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-transform active:scale-125"
                              title={r.label}
                            >
                              <IconComp className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Reply Button */}
                  <button
                    type="button"
                    data-testid={`reply-btn-${msg.id}`}
                    onClick={() =>
                      onSetReply({
                        id: msg.id,
                        senderName: isMe
                          ? currentUser.display_name
                          : selectedUser.display_name,
                        content: msg.content || (msg.file_name ? `[File] ${msg.file_name}` : ""),
                      })
                    }
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Reply"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>

                  {/* Bookmark Button */}
                  {onToggleBookmark && (
                    <button
                      type="button"
                      data-testid={`bookmark-btn-${msg.id}`}
                      onClick={() => onToggleBookmark(msg)}
                      className={`p-1 rounded-lg hover:bg-slate-100 transition-colors ${
                        isBookmarked
                          ? "text-amber-500 bg-amber-50"
                          : "text-slate-400 hover:text-amber-500"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Pin Button */}
                  {onTogglePin && (
                    <button
                      type="button"
                      data-testid={`pin-btn-${msg.id}`}
                      onClick={() => onTogglePin(msg.id)}
                      className={`p-1 rounded-lg hover:bg-slate-100 transition-colors ${
                        msg.is_pinned
                          ? "text-amber-500 bg-amber-50"
                          : "text-slate-400 hover:text-amber-500"
                      }`}
                      title={msg.is_pinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Forward Button */}
                  {onOpenForward && !msg.is_deleted && (
                    <button
                      type="button"
                      data-testid={`forward-btn-${msg.id}`}
                      onClick={() => onOpenForward(msg)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Forward"
                    >
                      <Forward className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Edit Button (Sender only) */}
                  {isMe && !msg.file_url && (
                    <button
                      type="button"
                      data-testid={`edit-btn-${msg.id}`}
                      onClick={() => handleStartEdit(msg)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete Button (Sender only) */}
                  {isMe && (
                    <button
                      type="button"
                      data-testid={`delete-btn-${msg.id}`}
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Reaction Pills */}
              {msg.reactions && Object.keys(msg.reactions).length > 0 && !msg.is_deleted && (
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {Object.entries(msg.reactions).map(([iconName, users]) => {
                    if (users.length === 0) return null;
                    const matchedIcon = availableReactions.find((r) => r.name === iconName);
                    const IconComp = matchedIcon ? matchedIcon.icon : ThumbsUp;
                    const hasReacted = users.includes(currentUser.username);

                    return (
                      <button
                        key={iconName}
                        type="button"
                        data-testid={`reaction-pill-${msg.id}-${iconName}`}
                        onClick={() => onToggleReaction(msg.id, iconName)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium transition-all active:scale-95 ${
                          hasReacted
                            ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                        title={users.join(", ")}
                      >
                        <IconComp className="w-3 h-3" />
                        <span>{users.length}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-2 text-slate-500 text-xs animate-fade-in">
          <div
            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarColor(
              selectedUser.username
            )} flex items-center justify-center text-white text-[10px] font-bold`}
          >
            {selectedUser.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 flex items-center gap-1 shadow-sm">
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          <span className="text-[11px]">{selectedUser.display_name} is typing...</span>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};
