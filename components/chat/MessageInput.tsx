"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Mic,
  AtSign,
  X,
  Sparkles,
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
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        100
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
      if (inputContainerRef.current) {
        const rect = inputContainerRef.current.getBoundingClientRect();
        setPopoverPosition({
          top: rect.top - 210,
          left: rect.left + 20,
        });
      }
    } else {
      setShowMentionPopover(false);
    }
  };

  const handleSelectMention = (user: UserProfile) => {
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
  };

  return (
    <div
      ref={inputContainerRef}
      className="relative z-30 p-3.5 bg-white border-t border-[#E2E8F0] select-none"
    >
      {/* Mention Picker Popover */}
      {showMentionPopover && (
        <MentionPopover
          users={availableUsers}
          filterQuery={mentionFilter}
          onSelectUser={handleSelectMention}
        />
      )}

      {/* Reply Context Banner */}
      {replyingTo && (
        <div data-testid="replying-banner" className="mb-2 flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-slate-900 truncate">
              Replying to @{replyingTo.senderName}:
            </span>
            <span className="text-slate-500 truncate">{replyingTo.content}</span>
          </div>
          <button
            type="button"
            data-testid="cancel-reply-btn"
            onClick={onCancelReply}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
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
          <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-testid="attach-file-btn"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" strokeWidth={1.75} />
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              data-testid="file-upload-input"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Quick @ Mention trigger */}
            <button
              type="button"
              data-testid="quick-mention-btn"
              onClick={() => {
                setContent((prev) => prev + "@");
                setShowMentionPopover(true);
                if (inputContainerRef.current) {
                  const rect = inputContainerRef.current.getBoundingClientRect();
                  setPopoverPosition({
                    top: rect.top - 210,
                    left: rect.left + 50,
                  });
                }
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Mention member"
            >
              <AtSign className="w-4 h-4" strokeWidth={1.75} />
            </button>

            {/* Textarea Input */}
            <textarea
              ref={textareaRef}
              data-testid="message-textarea"
              value={content}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Write a message, type @ to mention..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none max-h-24 leading-relaxed"
            />

            {/* Voice Message Mic Button */}
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              data-testid="voice-record-btn"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* Dark Slate Send Button */}
          <button
            type="button"
            onClick={handleSend}
            data-testid="send-message-btn"
            disabled={!content.trim()}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white flex items-center justify-center shadow-sm transition-all active:scale-95 shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4 ml-0.5" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
};
