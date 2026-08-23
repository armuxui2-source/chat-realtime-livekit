"use client";

import React, { useState } from "react";
import { UserProfile, Channel, ChatMessage } from "@/types/chat";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { MessageSquare, PhoneCall, Video, Command, Sparkles } from "lucide-react";

interface ChatContainerProps {
  currentUser: UserProfile;
  selectedUser: UserProfile | null;
  selectedChannel: Channel | null;
  showDetailsPanel: boolean;
  availableUsers?: UserProfile[];
  bookmarkedIds?: string[];
  onToggleBookmark?: (message: ChatMessage) => void;
  onOpenLightbox?: (url: string, name?: string) => void;
  onOpenForward?: (message: ChatMessage) => void;
  onToggleDetailsPanel: () => void;
  onStartCall: (target: UserProfile | Channel, type: "audio" | "video") => void;
  onBack?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  currentUser,
  selectedUser,
  selectedChannel,
  showDetailsPanel,
  availableUsers = [],
  bookmarkedIds = [],
  onToggleBookmark,
  onOpenLightbox,
  onOpenForward,
  onToggleDetailsPanel,
  onStartCall,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    messages,
    isTyping,
    replyingTo,
    setReplyingTo,
    sendMessage,
    sendVoiceMessage,
    uploadAttachment,
    toggleReaction,
    editMessage,
    deleteMessage,
    togglePinMessage,
    sendTypingSignal,
  } = useSupabaseChat(currentUser, selectedUser, selectedChannel);

  const pinnedCount = messages.filter((m) => m.is_pinned && !m.is_deleted).length;

  if (!selectedUser && !selectedChannel) {
    return (
      <div
        data-testid="chat-container-empty"
        className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0F1216] text-white select-none"
      >
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-3xl bg-[#161A22] border border-white/[0.08] flex items-center justify-center shadow-lg">
            <Command className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ticketapp Workspace</span>
        </div>

        <h3 className="text-xl font-extrabold text-white mb-2">
          A real-time system that works like an Organiser
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          เลือกรายชื่อสมาชิกหรือช่องสนทนาจากแถบด้านซ้าย เพื่อเริ่มต้นการส่งข้อความ ข้อความเสียง และโทรเสียง/วิดีโอคอลได้ทันที
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
          <div className="p-3.5 rounded-2xl bg-[#161A22] border border-white/[0.08] shadow-sm text-left flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-white/[0.06] text-slate-300 border border-white/[0.08]">
              <PhoneCall className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">HD Voice Calls</p>
              <p className="text-[11px] text-slate-400">Opus Audio Codec</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161A22] border border-white/[0.08] shadow-sm text-left flex items-start gap-2.5">
            <div className="p-2 rounded-xl emerald-button-gradient text-white shadow-sm">
              <Video className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">ห้องประชุมสายสด (Meeting Room)</p>
              <p className="text-[11px] text-slate-400">WebRTC SFU Cloud</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const targetUser: UserProfile = selectedUser || {
    id: selectedChannel!.id,
    username: selectedChannel!.id,
    display_name: `#${selectedChannel!.name}`,
    status: "online",
  };

  return (
    <div
      data-testid="chat-container-active"
      className="flex-1 flex flex-col h-full bg-[#0F1216] overflow-hidden min-w-0"
    >
      <ChatHeader
        selectedUser={selectedUser}
        selectedChannel={selectedChannel}
        showDetailsPanel={showDetailsPanel}
        pinnedCount={pinnedCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleDetailsPanel={onToggleDetailsPanel}
        onStartCall={(type) =>
          onStartCall(selectedChannel || selectedUser!, type)
        }
        onBack={onBack}
      />

      <MessageList
        messages={messages}
        currentUser={currentUser}
        selectedUser={targetUser}
        isTyping={isTyping}
        searchQuery={searchQuery}
        bookmarkedIds={bookmarkedIds}
        onSetReply={setReplyingTo}
        onToggleReaction={toggleReaction}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
        onTogglePin={togglePinMessage}
        onToggleBookmark={onToggleBookmark}
        onOpenLightbox={onOpenLightbox}
        onOpenForward={onOpenForward}
      />

      <MessageInput
        replyingTo={replyingTo}
        availableUsers={availableUsers}
        onCancelReply={() => setReplyingTo(null)}
        onSendMessage={sendMessage}
        onUploadAttachment={uploadAttachment}
        onSendVoiceNote={sendVoiceMessage}
        onTyping={sendTypingSignal}
      />
    </div>
  );
};
