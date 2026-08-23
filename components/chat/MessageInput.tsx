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
  Heart,
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

      {/* Floating Plus Quick Actions Popover Menu (Strict Monochrome Glassmorphism - Zero Rainbow Badges) */}
      {showAttachMenu && (
        <div
          ref={attachMenuRef}
          data-testid="attach-actions-menu"
          className="absolute bottom-full left-4 mb-3 w-60 p-1.5 rounded-2xl bg-[#161A22]/98 border border-white/[0.08] shadow-2xl backdrop-blur-2xl animate-scale-up z-50 space-y-0.5 text-white"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-white/[0.06] mb-1">
            แนบไฟล์ & กิจกรรม
          </div>

          {/* Item 1: Photos & Videos */}
          <button
            type="button"
            onClick={() => {
              imageInputRef.current?.click();
              setShowAttachMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all text-left text-xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
              <ImageIcon className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <span className="font-medium">รูปภาพ & วิดีโอ</span>
          </button>

          {/* Item 2: Documents & Files */}
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
              setShowAttachMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all text-left text-xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
              <FileText className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <span className="font-medium">เอกสาร & ไฟล์</span>
          </button>

          {/* Item 3: Share Location */}
          <button
            type="button"
            onClick={handleShareLocation}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all text-left text-xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
              <MapPin className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <span className="font-medium">แชร์ตำแหน่งที่ตั้ง</span>
          </button>

          {/* Item 4: Mention @ */}
          <button
            type="button"
            onClick={() => {
              setContent((prev) => prev + "@");
              setShowAttachMenu(false);
              setShowMentionPopover(true);
              textareaRef.current?.focus();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all text-left text-xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
              <AtSign className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <span className="font-medium">กล่าวถึงสมาชิก (@)</span>
          </button>

          {/* Item 5: Code Snippet */}
          <button
            type="button"
            onClick={handleInsertCodeBlock}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all text-left text-xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
              <Code2 className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <span className="font-medium">บล็อกโค้ดคำสั่ง</span>
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
        <div className="flex items-center gap-2">
          {/* Instagram Direct Floating Capsule Pill Input */}
          <div className="flex-1 flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#DBDBDB] dark:border-[#363636] bg-white dark:bg-black focus-within:border-slate-400 dark:focus-within:border-slate-600 transition-all">
            {/* Smile / Quick Action Button */}
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              data-testid="attach-menu-toggle-btn"
              className="p-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shrink-0"
              title="แนบรูปภาพหรือกิจกรรม (+)"
            >
              <Plus className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Textarea Input */}
            <textarea
              ref={textareaRef}
              data-testid="message-textarea"
              value={content}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="ส่งข้อความ..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none max-h-28 leading-relaxed py-0.5"
            />

            {/* Right Action Icons (Mic, Image, Heart when empty / Send when text entered) */}
            {content.trim() ? (
              <button
                type="button"
                onClick={handleSend}
                data-testid="send-message-btn"
                className="text-[#0095F6] hover:text-[#1877F2] font-bold text-sm px-2 py-0.5 transition-colors shrink-0"
                title="ส่งข้อความ"
              >
                ส่ง
              </button>
            ) : (
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 shrink-0">
                {/* Voice Message Mic */}
                <button
                  type="button"
                  onClick={() => setIsRecording(true)}
                  data-testid="voice-record-btn"
                  className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="บันทึกข้อความเสียง"
                >
                  <Mic className="w-5 h-5" strokeWidth={1.8} />
                </button>

                {/* Photos & Media */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="ส่งรูปภาพ"
                >
                  <ImageIcon className="w-5 h-5" strokeWidth={1.8} />
                </button>

                {/* Send Heart ❤️ */}
                <button
                  type="button"
                  onClick={() => onSendMessage("❤️")}
                  className="p-1 hover:text-rose-500 transition-colors"
                  title="ส่งหัวใจ"
                >
                  <Heart className="w-5 h-5" strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
