"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  Image as ImageIcon,
  FileText,
  MapPin,
  AtSign,
  Code2,
  Mic,
  X,
} from "lucide-react";
import { UserProfile } from "@/types/chat";
import { ReplyContext } from "@/hooks/useSupabaseChat";
import { VoiceRecorder } from "./VoiceRecorder";
import { MentionPopover } from "./MentionPopover";

interface MessageInputProps {
  replyingTo: ReplyContext | null;
  availableUsers?: UserProfile[];
  onCancelReply: () => void;
  onSendMessage: (content: string) => void;
  onUploadAttachment: (file: File) => Promise<unknown>;
  onSendVoiceNote: (audioBlob: Blob, durationSeconds: number) => Promise<void>;
  onTyping: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  replyingTo,
  availableUsers = [],
  onCancelReply,
  onSendMessage,
  onUploadAttachment,
  onSendVoiceNote,
  onTyping,
}) => {
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const attachMenuRef = useRef<HTMLDivElement | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [content]);

  // Click outside to close attach menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(e.target as Node)
      ) {
        setShowAttachMenu(false);
      }
    }
    if (showAttachMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAttachMenu]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!content.trim()) return;
    onSendMessage(content.trim());
    setContent("");
    setShowMentionPopover(false);
    setShowAttachMenu(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttachMenu(false);
    await onUploadAttachment(file);
    e.target.value = "";
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    onTyping();

    const cursor = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursor);
    const atMatch = textBeforeCursor.match(/@([a-zA-Z0-9_\u0E00-\u0E7F]*)$/);

    if (atMatch) {
      setMentionFilter(atMatch[1]);
      setShowMentionPopover(true);
    } else {
      setShowMentionPopover(false);
    }
  };

  const handleInsertCodeBlock = () => {
    setShowAttachMenu(false);
    setContent((prev) => prev + "\n```typescript\n// Write code here\n```\n");
    textareaRef.current?.focus();
  };

  const handleShareLocation = () => {
    setShowAttachMenu(false);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          onSendMessage(`📍 ตำแหน่งที่ตั้ง: ${mapUrl}`);
        },
        () => {
          onSendMessage("📍 ตำแหน่งที่ตั้ง: กรุงเทพมหานคร, ประเทศไทย (13.7563, 100.5018)");
        }
      );
    } else {
      onSendMessage("📍 ตำแหน่งที่ตั้ง: กรุงเทพมหานคร, ประเทศไทย (13.7563, 100.5018)");
    }
  };

  return (
    <div
      data-testid="message-input-container"
      className="p-3 sm:p-4 bg-[#161A22] border-t border-white/[0.07] relative font-prompt select-none"
    >
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        data-testid="file-upload-input"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*,video/*"
        ref={imageInputRef}
        data-testid="image-upload-input"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Floating Plus Quick Actions Popover Menu */}
      {showAttachMenu && (
        <div
          ref={attachMenuRef}
          data-testid="attach-actions-menu"
          className="absolute bottom-full left-4 mb-3 w-56 p-2 rounded-2xl bg-[#161A22]/98 border border-white/[0.08] shadow-2xl backdrop-blur-2xl animate-scale-up z-50 space-y-1 text-white"
        >
          <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-white/[0.06]">
            แนบไฟล์ & กิจกรรม
          </p>

          <button
            type="button"
            onClick={() => {
              imageInputRef.current?.click();
              setShowAttachMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-200 hover:text-white transition-colors text-left text-xs font-semibold group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span>รูปภาพ & วิดีโอ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
              setShowAttachMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-200 hover:text-white transition-colors text-left text-xs font-semibold group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span>เอกสาร & ไฟล์</span>
          </button>

          <button
            type="button"
            onClick={handleShareLocation}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-200 hover:text-white transition-colors text-left text-xs font-semibold group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <span>แชร์ตำแหน่งที่ตั้ง</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setContent((prev) => prev + "@");
              setShowAttachMenu(false);
              setShowMentionPopover(true);
              textareaRef.current?.focus();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-200 hover:text-white transition-colors text-left text-xs font-semibold group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <AtSign className="w-4 h-4" />
            </div>
            <span>กล่าวถึงสมาชิก (@)</span>
          </button>

          <button
            type="button"
            onClick={handleInsertCodeBlock}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-200 hover:text-white transition-colors text-left text-xs font-semibold group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            <span>บล็อกโค้ดคำสั่ง</span>
          </button>
        </div>
      )}

      {/* Mention Auto-Complete Popover */}
      {showMentionPopover && (
        <MentionPopover
          users={availableUsers}
          filterQuery={mentionFilter}
          onSelectUser={(user) => {
            const cursor = textareaRef.current?.selectionStart || content.length;
            const textBefore = content.slice(0, cursor);
            const textAfter = content.slice(cursor);
            const updatedBefore = textBefore.replace(/@([a-zA-Z0-9_\u0E00-\u0E7F]*)$/, `@${user.username} `);
            setContent(updatedBefore + textAfter);
            setShowMentionPopover(false);
            textareaRef.current?.focus();
          }}
        />
      )}

      {/* Replying Banner Bar */}
      {replyingTo && (
        <div
          data-testid="reply-preview-bar"
          className="mb-2.5 flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-xs animate-fade-in"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-emerald-400 font-bold shrink-0">ตอบกลับ:</span>
            <span className="font-bold text-white shrink-0">
              {replyingTo.senderName}
            </span>
            <span className="text-slate-400 truncate">
              {replyingTo.content}
            </span>
          </div>

          <button
            type="button"
            onClick={onCancelReply}
            data-testid="cancel-reply-btn"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Recorder Overlay vs Regular Capsule Input */}
      {isRecording ? (
        <VoiceRecorder
          onCancel={() => setIsRecording(false)}
          onSendVoice={async (blob, duration) => {
            setIsRecording(false);
            await onSendVoiceNote(blob, duration);
          }}
        />
      ) : (
        <div className="flex items-center gap-2.5">
          {/* Floating Capsule Input Bar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#0F1216] border border-white/[0.08] focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            {/* Single Plus Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              data-testid="attach-menu-toggle-btn"
              className={`p-2 rounded-xl transition-all ${
                showAttachMenu
                  ? "bg-emerald-500/20 text-emerald-400 rotate-45"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
              title="แนบรูปภาพ ไฟล์ หรือกิจกรรม (+)"
            >
              <Plus className="w-4 h-4" strokeWidth={2.2} />
            </button>

            {/* Textarea Input */}
            <textarea
              ref={textareaRef}
              data-testid="message-textarea"
              value={content}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์ข้อความที่นี่..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none max-h-28 leading-relaxed py-1"
            />

            {/* Voice Message Mic Button */}
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              data-testid="voice-record-btn"
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-white/[0.06] transition-colors"
              title="บันทึกข้อความเสียง"
            >
              <Mic className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>

          {/* Emerald Green Circular Action Button */}
          <button
            type="button"
            onClick={handleSend}
            data-testid="send-message-btn"
            disabled={!content.trim()}
            className="w-11 h-11 rounded-full emerald-button-gradient disabled:opacity-30 text-white flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-lg"
            title="ส่งข้อความ"
          >
            <Send className="w-4 h-4 ml-0.5" strokeWidth={2.2} />
          </button>
        </div>
      )}
    </div>
  );
};
