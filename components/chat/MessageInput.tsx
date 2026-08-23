"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Mic,
  AtSign,
  X,
  Code,
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
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [content]);

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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    setContent((prev) => prev + "\n```typescript\n// Write code here\n```\n");
    textareaRef.current?.focus();
  };

  return (
    <div
      ref={inputContainerRef}
      className="relative z-30 p-3 sm:p-4 bg-[#12161F] border-t border-white/10 select-none text-white font-prompt"
    >
      {/* Mention Picker Popover */}
      {showMentionPopover && (
        <MentionPopover
          users={availableUsers}
          filterQuery={mentionFilter}
          onSelectUser={(user) => {
            if (!textareaRef.current) return;
            const cursor = textareaRef.current.selectionStart;
            const textBefore = content.slice(0, cursor);
            const textAfter = content.slice(cursor);
            const replaced = textBefore.replace(
              /@([a-zA-Z0-9_\u0E00-\u0E7F]*)$/,
              `@${user.display_name} `
            );
            setContent(replaced + textAfter);
            setShowMentionPopover(false);
          }}
        />
      )}

      {/* Reply Context Banner */}
      {replyingTo && (
        <div data-testid="replying-banner" className="mb-2 flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-emerald-400 truncate">
              ตอบกลับ @{replyingTo.senderName}:
            </span>
            <span className="text-slate-300 truncate">{replyingTo.content}</span>
          </div>
          <button
            type="button"
            data-testid="cancel-reply-btn"
            onClick={onCancelReply}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Recorder Overlay */}
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
          {/* Floating Capsule Input Bar */}
          <div className="flex-1 flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl bg-[#0B0D11] border border-white/10 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-testid="attach-file-btn"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="แนบไฟล์ / รูปภาพ"
            >
              <Paperclip className="w-4 h-4" strokeWidth={1.8} />
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              data-testid="file-upload-input"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Insert Code Block Button */}
            <button
              type="button"
              onClick={handleInsertCodeBlock}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="แทรกบล็อกโค้ด (Code Snippet)"
            >
              <Code className="w-4 h-4" strokeWidth={1.8} />
            </button>

            {/* Quick @ Mention trigger */}
            <button
              type="button"
              data-testid="quick-mention-btn"
              onClick={() => {
                setContent((prev) => prev + "@");
                setShowMentionPopover(true);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="กล่าวถึงสมาชิก (@)"
            >
              <AtSign className="w-4 h-4" strokeWidth={1.8} />
            </button>

            {/* Textarea Input */}
            <textarea
              ref={textareaRef}
              data-testid="message-textarea"
              value={content}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์ข้อความที่นี่, กด Enter เพื่อส่ง..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none max-h-28 leading-relaxed"
            />

            {/* Voice Message Mic Button */}
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              data-testid="voice-record-btn"
              className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-white/10 transition-colors"
              title="บันทึกข้อความเสียง"
            >
              <Mic className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>

          {/* Emerald Green Send Button */}
          <button
            type="button"
            onClick={handleSend}
            data-testid="send-message-btn"
            disabled={!content.trim()}
            className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-all active:scale-95 shrink-0"
            title="ส่งข้อความ"
          >
            <Send className="w-4 h-4 ml-0.5" strokeWidth={2.2} />
          </button>
        </div>
      )}
    </div>
  );
};
