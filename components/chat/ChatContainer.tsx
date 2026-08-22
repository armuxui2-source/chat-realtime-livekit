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
        className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8F9FA] select-none"
      >
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-center shadow-sm">
            <Command className="w-8 h-8 text-slate-900" strokeWidth={2} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] text-[#0D652D] border border-[#CEEAD6] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ticketapp Workspace</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-2">
          A real-time system that works like an Organiser
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          Select a team member or a project channel from the sidebar to begin instant messaging, voice notes, and LiveKit meetings.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-left flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-900 border border-slate-100">
              <PhoneCall className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">HD Voice Calls</p>
              <p className="text-[11px] text-slate-400">Opus Audio Codec</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-left flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-sm">
              <Video className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">LiveKit Meeting</p>
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
      className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden min-w-0"
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
