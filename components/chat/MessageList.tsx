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
      className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar select-none bg-[#F8F9FA]"
    >
      {/* Pinned Sticky Banner */}
      {pinnedMessages.length > 0 && (
        <div
          data-testid="pinned-message-banner"
          className="sticky top-0 z-20 mb-3 p-2.5 rounded-2xl bg-white border border-amber-200/80 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
              <Pin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
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
            <PinOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Realtime Search Results Banner */}
      {searchQuery.trim() && (
        <div
          data-testid="search-results-banner"
          className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium flex items-center justify-between"
        >
          <span>Search results for &quot;{searchQuery}&quot; ({filteredMessages.length} messages)</span>
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
            className={`group flex items-end gap-2.5 transition-all relative ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar for Incoming Messages */}
            {!isMe && (
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                  selectedUser.username
                )} flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm`}
              >
                {selectedUser.display_name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className={`flex flex-col max-w-[82%] md:max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
              {/* Sender Name in Group Chat */}
              {!isMe && (
                <span className="text-[11px] font-semibold text-slate-500 mb-1 px-1">
                  {selectedUser.display_name}
                </span>
              )}

              {/* Message Bubble Body */}
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed relative ${
                  msg.is_deleted
                    ? "bg-slate-100 text-slate-400 italic border border-slate-200"
                    : isMe
                    ? "bg-slate-900 text-white shadow-sm rounded-tr-sm font-medium"
                    : "bg-white border border-slate-200/90 text-slate-900 shadow-sm rounded-tl-sm font-medium"
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
                    isMe ? "bg-slate-800 border-slate-400 text-slate-200" : "bg-slate-50 border-slate-400 text-slate-600"
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
                    className="mb-2 overflow-hidden rounded-xl border border-slate-200 shadow-sm cursor-pointer group"
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
                  <div className={`mb-2 flex items-center justify-between p-2.5 rounded-xl border ${
                    isMe ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold truncate max-w-[150px]">
                        {msg.file_name || "Attachment File"}
                      </span>
                    </div>
                    <a
                      href={msg.file_url}
                      download={msg.file_name}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-lg hover:bg-white/10 text-emerald-400 shrink-0 ml-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Audio Voice Message Bubble */}
                {msg.message_type === "audio" && msg.file_url && !msg.is_deleted && (
                  <AudioMessageBubble audioUrl={msg.file_url} isMe={isMe} />
                )}

                {/* Message Text Content or Code Snippet */}
                {msg.is_deleted ? (
                  <span>ข้อความนี้ถูกลบแล้ว</span>
                ) : isEditing ? (
                  <div className="space-y-2 min-w-[200px]">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-slate-500 text-left"
                      rows={2}
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingMessageId(null)}
                        className="px-2 py-1 rounded-lg text-[10px] text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(msg.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold shadow-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : codeBlock ? (
                  <div>
                    {codeBlock.before && <p className="mb-2">{codeBlock.before}</p>}
                    <CodeSnippetBlock code={codeBlock.code} language={codeBlock.language} />
                    {codeBlock.after && <p className="mt-2">{codeBlock.after}</p>}
                  </div>
                ) : (
                  <div>
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    {urlMatch && <LinkPreviewCard url={urlMatch} />}
                  </div>
                )}

                {/* Bottom Meta info: Time + Read Receipts + Edited Tag */}
                <div
                  className={`flex items-center gap-1.5 justify-end mt-1 text-[10px] ${
                    isMe ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {msg.is_edited && !msg.is_deleted && (
                    <span className="italic text-[9px] opacity-75">edited</span>
                  )}
                  <span>{formattedTime}</span>
                  {isMe && !msg.is_deleted && (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
              </div>

              {/* Message Reactions Badges */}
              {msg.reactions && Object.keys(msg.reactions).length > 0 && !msg.is_deleted && (
                <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                  {Object.entries(msg.reactions).map(([reactionKey, users]) => {
                    if (!users || users.length === 0) return null;
                    const hasMyReaction = users.includes(currentUser.username);
                    const matchingConfig = availableReactions.find((r) => r.name === reactionKey);
                    const IconComponent = matchingConfig?.icon || ThumbsUp;

                    return (
                      <button
                        key={reactionKey}
                        type="button"
                        onClick={() => onToggleReaction(msg.id, reactionKey)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${
                          hasMyReaction
                            ? "bg-slate-100 border-slate-300 text-slate-900 font-bold"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <IconComponent className="w-2.5 h-2.5" />
                        <span>{users.length}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Hover Floating Action Bar */}
            {!msg.is_deleted && (
              <div
                className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 p-1 rounded-full bg-white border border-slate-200 shadow-md absolute -top-3 z-10 ${
                  isMe ? "right-4" : "left-12"
                }`}
              >
                {/* Reply */}
                <button
                  type="button"
                  data-testid="reply-message-btn"
                  onClick={() =>
                    onSetReply({
                      id: msg.id,
                      senderName: isMe ? currentUser.display_name : selectedUser.display_name,
                      content: msg.content || (msg.file_name ? `[File] ${msg.file_name}` : "[Voice Note]"),
                    })
                  }
                  className="p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Reply"
                >
                  <Reply className="w-3 h-3" />
                </button>

                {/* Bookmark */}
                {onToggleBookmark && (
                  <button
                    type="button"
                    data-testid="bookmark-message-btn"
                    onClick={() => onToggleBookmark(msg)}
                    className={`p-1 rounded-full transition-colors ${
                      isBookmarked
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                  >
                    <Bookmark className="w-3 h-3" fill={isBookmarked ? "currentColor" : "none"} />
                  </button>
                )}

                {/* Pin */}
                {onTogglePin && (
                  <button
                    type="button"
                    data-testid="pin-message-btn"
                    onClick={() => onTogglePin(msg.id)}
                    className={`p-1 rounded-full transition-colors ${
                      msg.is_pinned
                        ? "text-amber-600 hover:bg-amber-50"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                    title={msg.is_pinned ? "Unpin message" : "Pin message"}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                )}

                {/* Forward */}
                {onOpenForward && (
                  <button
                    type="button"
                    data-testid="forward-message-btn"
                    onClick={() => onOpenForward(msg)}
                    className="p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Forward Message"
                  >
                    <Forward className="w-3 h-3" />
                  </button>
                )}

                {/* Emoji Reaction Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveReactionMenuId(activeReactionMenuId === msg.id ? null : msg.id)
                    }
                    className="p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Add Reaction"
                  >
                    <Smile className="w-3 h-3" />
                  </button>

                  {/* Reaction Popup Menu */}
                  {activeReactionMenuId === msg.id && (
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-white border border-slate-200 shadow-lg z-20">
                      {availableReactions.map((r) => {
                        const Icon = r.icon;
                        return (
                          <button
                            key={r.name}
                            type="button"
                            onClick={() => {
                              onToggleReaction(msg.id, r.name);
                              setActiveReactionMenuId(null);
                            }}
                            className="p-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                            title={r.label}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Edit Message (Only for Me) */}
                {isMe && !msg.is_deleted && msg.message_type === "text" && (
                  <button
                    type="button"
                    data-testid="edit-message-btn"
                    onClick={() => handleStartEdit(msg)}
                    className="p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}

                {/* Delete Message (Only for Me) */}
                {isMe && !msg.is_deleted && (
                  <button
                    type="button"
                    data-testid="delete-message-btn"
                    onClick={() => onDeleteMessage(msg.id)}
                    className="p-1 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-2 text-slate-400 text-xs pl-2 animate-fade-in">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[11px] font-medium">{selectedUser.display_name} is typing...</span>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};
