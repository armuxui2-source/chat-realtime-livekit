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
  Bookmark,
  Forward,
  MoreVertical,
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
  onToggleBookmark,
  onOpenLightbox,
  onOpenForward,
}) => {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
    setActiveMenuId(null);
  };

  const handleSaveEdit = (msgId: string) => {
    if (editContent.trim()) {
      onEditMessage(msgId, editContent.trim());
    }
    setEditingMessageId(null);
  };

  const filteredMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.content.toLowerCase().includes(q) ||
      (m.file_name && m.file_name.toLowerCase().includes(q))
    );
  });

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
      className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5 custom-scrollbar select-none bg-[#0B0D11]"
    >
      {/* Messages Feed */}
      {filteredMessages.map((msg) => {
        const isMe = msg.sender_id === currentUser.username;
        const formattedTime = formatMessageTime(msg.created_at);
        const isEditing = editingMessageId === msg.id;
        const isBookmarked = bookmarkedIds.includes(msg.id);
        const codeBlock = parseCodeBlock(msg.content);
        const urlMatch = extractUrl(msg.content);
        const previewUrl = extractUrl(msg.content);

        return (
          <div
            key={msg.id}
            id={`msg-${msg.id}`}
            data-testid={`chat-message-${msg.id}`}
            className={`flex items-end gap-2 group relative transition-all duration-300 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* Action Toolbar on Hover */}
            {!msg.is_deleted && (
              <div
                className={`absolute top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-1 bg-[#161A22] border border-white/[0.08] p-1 rounded-2xl shadow-xl ${
                  isMe ? "right-0" : "left-0"
                }`}
              >
                {/* Reactions */}
                <div className="flex items-center gap-0.5 border-r border-white/10 pr-1 mr-0.5">
                  {["👍", "❤️", "🔥", "🎉"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => onToggleReaction?.(msg.id, emoji)}
                      className="p-1 rounded-lg hover:bg-white/10 text-xs transition-transform active:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    onSetReply({
                      id: msg.id,
                      senderName: isMe ? currentUser.display_name : selectedUser.display_name,
                      content: msg.content,
                    })
                  }
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                  title="ตอบกลับ"
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenForward?.(msg)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                  title="ส่งต่อ"
                >
                  <Forward className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onToggleBookmark?.(msg)}
                  className={`p-1 rounded-lg hover:bg-white/10 ${
                    bookmarkedIds.includes(msg.id) ? "text-emerald-400" : "text-slate-400 hover:text-white"
                  }`}
                  title="บันทึก"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                {isMe && (
                  <>
                    <button
                      onClick={() => {
                        setEditingMessageId(msg.id);
                        setEditContent(msg.content);
                      }}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                      title="แก้ไข"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMessage?.(msg.id)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400"
                      title="ลบข้อความ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Receiver Avatar */}
            {!isMe && (
              <div
                className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                  selectedUser.username
                )} flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-1 shadow-sm ring-1 ring-white/10`}
              >
                {selectedUser.display_name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Bubble Container */}
            <div className={`flex flex-col max-w-[85%] sm:max-w-md ${isMe ? "items-end" : "items-start"}`}>
              {/* Bubble Body */}
              <div
                className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed relative ${
                  msg.is_deleted
                    ? "bg-white/5 text-slate-500 italic border border-white/5"
                    : isMe
                    ? "bg-[#16A34A] text-white rounded-br-xs shadow-lg shadow-emerald-950/40"
                    : "bg-[#1E232B] border border-white/[0.07] text-white rounded-bl-xs shadow-md"
                }`}
              >
                {/* Quoted Reply */}
                {msg.reply_to_sender && !msg.is_deleted && (
                  <div className={`mb-1.5 p-2 rounded-xl text-xs border-l-2 ${
                    isMe ? "bg-white/10 border-white/60 text-slate-200" : "bg-slate-50 border-slate-400 text-slate-600"
                  }`}>
                    <span className="font-semibold block text-[11px]">
                      @{msg.reply_to_sender}
                    </span>
                    <span className="truncate block text-[11px] opacity-90">
                      {msg.reply_to_content}
                    </span>
                  </div>
                )}

                {/* Attached Image */}
                {msg.file_url && msg.message_type === "image" && !msg.is_deleted && (
                  <div
                    onClick={() => onOpenLightbox?.(msg.file_url!, msg.file_name)}
                    data-testid="message-image-attachment"
                    className="mb-1.5 overflow-hidden rounded-xl cursor-pointer"
                    title="Click to view full image"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.file_url}
                      alt={msg.file_name || "Attachment"}
                      className="w-full max-h-56 object-cover"
                    />
                  </div>
                )}

                {/* Attached File */}
                {msg.file_url && msg.message_type === "file" && !msg.is_deleted && (
                  <div className={`mb-1.5 flex items-center justify-between p-2.5 rounded-xl border ${
                    isMe ? "bg-white/10 border-white/20 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold truncate max-w-[140px]">
                        {msg.file_name || "Attachment File"}
                      </span>
                    </div>
                    <a
                      href={msg.file_url}
                      download={msg.file_name}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-lg hover:bg-white/10 shrink-0 ml-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Audio Voice Message */}
                {msg.message_type === "audio" && msg.file_url && !msg.is_deleted && (
                  <AudioMessageBubble audioUrl={msg.file_url} isMe={isMe} />
                )}

                {/* Content */}
                {msg.is_deleted ? (
                  <span>Message removed</span>
                ) : isEditing ? (
                  <div className="space-y-1.5 min-w-[200px]">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-1">
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
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : codeBlock ? (
                  <div>
                    {codeBlock.before && <p className="mb-1.5">{codeBlock.before}</p>}
                    <CodeSnippetBlock code={codeBlock.code} language={codeBlock.language} />
                    {codeBlock.after && <p className="mt-1.5">{codeBlock.after}</p>}
                  </div>
                ) : (
                  <div>
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    {urlMatch && <LinkPreviewCard url={urlMatch} />}
                  </div>
                )}

                {/* Meta info: Time + Read Receipts */}
                <div
                  className={`flex items-center gap-1 justify-end mt-1 text-[10px] ${
                    isMe ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {msg.is_edited && !msg.is_deleted && (
                    <span className="italic text-[9px] opacity-75">edited</span>
                  )}
                  <span>{formattedTime}</span>
                  {isMe && !msg.is_deleted && (
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
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
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border transition-all ${
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

            {/* Clean Subtle Action Trigger (More Menu) */}
            {!msg.is_deleted && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity relative">
                <button
                  type="button"
                  onClick={() => setActiveMenuId(activeMenuId === msg.id ? null : msg.id)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {activeMenuId === msg.id && (
                  <div className="absolute bottom-full mb-1 right-0 bg-white border border-slate-200 shadow-lg rounded-xl p-1 z-30 min-w-[120px] text-xs space-y-0.5">
                    <button
                      type="button"
                      data-testid="reply-message-btn"
                      onClick={() => {
                        onSetReply({
                          id: msg.id,
                          senderName: isMe ? currentUser.display_name : selectedUser.display_name,
                          content: msg.content || (msg.file_name ? `[File] ${msg.file_name}` : "[Voice Note]"),
                        });
                        setActiveMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-left"
                    >
                      <Reply className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reply</span>
                    </button>

                    {onToggleBookmark && (
                      <button
                        type="button"
                        data-testid="bookmark-message-btn"
                        onClick={() => {
                          onToggleBookmark(msg);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-left"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isBookmarked ? "Unsave" : "Save"}</span>
                      </button>
                    )}

                    {onOpenForward && (
                      <button
                        type="button"
                        data-testid="forward-message-btn"
                        onClick={() => {
                          onOpenForward(msg);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-left"
                      >
                        <Forward className="w-3.5 h-3.5 text-slate-400" />
                        <span>Forward</span>
                      </button>
                    )}

                    {isMe && msg.message_type === "text" && (
                      <button
                        type="button"
                        data-testid="edit-message-btn"
                        onClick={() => handleStartEdit(msg)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-left"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit</span>
                      </button>
                    )}

                    {isMe && (
                      <button
                        type="button"
                        data-testid="delete-message-btn"
                        onClick={() => {
                          onDeleteMessage(msg.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center gap-1.5 text-slate-400 text-xs pl-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[11px] text-slate-500">{selectedUser.display_name} is typing...</span>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};
