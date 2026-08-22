"use client";

import React, { useState } from "react";
import { UserProfile, Channel, ChatMessage } from "@/types/chat";
import { useSupabaseChat } from "@/hooks/useSupabaseChat";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { MessageSquare, PhoneCall, Video } from "lucide-react";

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
        className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/60 font-prompt select-none"
      >
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <MessageSquare className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">Welcome to Social Solution Chat</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          Select a contact or a channel from the left sidebar to start real-time messaging, audio calls, or HD video meetings.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-md w-full">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-left flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Clear Voice Calls</p>
              <p className="text-[11px] text-slate-400">Opus Audio Codec</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-left flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">HD Video Meet</p>
              <p className="text-[11px] text-slate-400">LiveKit WebRTC</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active target (user or channel)
  const targetUser: UserProfile = selectedUser || {
    id: selectedChannel!.id,
    username: selectedChannel!.id,
    display_name: `#${selectedChannel!.name}`,
    status: "online",
  };

  return (
    <div
      data-testid="chat-container-active"
      className="flex-1 flex flex-col h-full bg-white/40 overflow-hidden min-w-0 font-prompt"
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
