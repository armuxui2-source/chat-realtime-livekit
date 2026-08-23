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
        className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#000000] text-slate-900 dark:text-white select-none font-prompt"
      >
        <div className="w-24 h-24 rounded-full border-2 border-slate-900 dark:border-white flex items-center justify-center mb-4">
          <MessageSquare className="w-12 h-12 stroke-[1.5]" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">
          ข้อความของคุณ (Your Messages)
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-5 leading-relaxed">
          ส่งรูปภาพและข้อความส่วนตัวถึงเพื่อนหรือกลุ่มสนทนาแบบเรียลไทม์
        </p>

        <button
          type="button"
          onClick={() => {}}
          className="px-4 py-2 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          ส่งข้อความ
        </button>
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
