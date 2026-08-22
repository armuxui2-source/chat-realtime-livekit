"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseChannels } from "@/hooks/useSupabaseChannels";
import { useCallSignaling } from "@/hooks/useCallSignaling";
import { UserProfile, Channel, ChatMessage } from "@/types/chat";
import { AuthModal } from "@/components/auth/AuthModal";
import { LeftSlimNav } from "@/components/layout/LeftSlimNav";
import { UserSidebar } from "@/components/chat/UserSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { RightDetailsPanel } from "@/components/layout/RightDetailsPanel";
import { CreateChannelModal } from "@/components/chat/CreateChannelModal";
import { LiveKitMeetRoom } from "@/components/call/LiveKitMeetRoom";
import { IncomingCallDialog } from "@/components/call/IncomingCallDialog";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { BookmarksDrawer } from "@/components/chat/BookmarksDrawer";
import { CallHistoryDrawer } from "@/components/call/CallHistoryDrawer";
import { ForwardMessageModal } from "@/components/chat/ForwardMessageModal";
import { MediaLightboxModal } from "@/components/chat/MediaLightboxModal";
import { requestNotificationPermission } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Video, X } from "lucide-react";

export default function Home() {
  const { currentUser, onlineUsers, isLoading, loginUser, logout, setCurrentUser } = useAuth();
  const {
    channels,
    selectedChannel,
    setSelectedChannel,
    channelMembers,
    createChannel,
    addMemberToChannel,
  } = useSupabaseChannels(currentUser);

  const {
    incomingCall,
    activeCall,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  } = useCallSignaling(currentUser);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(true);
  const [mobileView, setMobileView] = useState<"sidebar" | "chat" | "details">("sidebar");

  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isCallHistoryOpen, setIsCallHistoryOpen] = useState(false);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<ChatMessage[]>([]);

  // Forwarding State
  const [forwardingMessage, setForwardingMessage] = useState<ChatMessage | null>(null);
  const [isForwardOpen, setIsForwardOpen] = useState(false);

  // Lightbox State
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; name?: string } | null>(null);

  // LiveKit Meeting State
  const [activeCallRoom, setActiveCallRoom] = useState<{
    roomName: string;
    callType: "audio" | "video";
    targetName: string;
  } | null>(null);

  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [customRoomName, setCustomRoomName] = useState("");

  // Request browser desktop push notification permission on login
  useEffect(() => {
    if (currentUser) {
      requestNotificationPermission();
    }
  }, [currentUser]);

  // Set default selection to Alex Dev for immediate rich view on desktop
  useEffect(() => {
    if (onlineUsers.length > 0 && !selectedUser && !selectedChannel) {
      setSelectedUser(onlineUsers[0]);
    }
  }, [onlineUsers, selectedUser, selectedChannel]);

  const handleSelectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setSelectedChannel(null);
    setMobileView("chat");
  };

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setSelectedUser(null);
    setMobileView("chat");
  };

  const handleToggleBookmark = (msg: ChatMessage) => {
    setBookmarkedMessages((prev) => {
      const exists = prev.some((m) => m.id === msg.id);
      if (exists) {
        return prev.filter((m) => m.id !== msg.id);
      } else {
        return [...prev, msg];
      }
    });
  };

  const handleUpdateProfile = (data: {
    display_name: string;
    status: "online" | "busy" | "away" | "offline";
    customStatus?: string;
  }) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      display_name: data.display_name,
      status: data.status,
    };
    setCurrentUser(updated);
  };

  const handleStartCall = (
    target: UserProfile | Channel,
    type: "audio" | "video"
  ) => {
    if ("name" in target) {
      // Group Channel
      setActiveCallRoom({
        roomName: `channel-${target.id}`,
        callType: type,
        targetName: `#${target.name}`,
      });
    } else {
      // 1-on-1 Direct Call
      startCall(target, type);
      setActiveCallRoom({
        roomName: `call-${[currentUser?.username, target.username].sort().join("-")}`,
        callType: type,
        targetName: target.display_name,
      });
    }
  };

  const handleForwardMessage = async (
    target: UserProfile | Channel,
    msg: ChatMessage
  ) => {
    if (!currentUser || !isSupabaseConfigured) return;

    try {
      const isTargetChannel = "name" in target;
      await supabase.from("messages").insert({
        sender_id: currentUser.username,
        receiver_id: isTargetChannel ? null : target.username,
        channel_id: isTargetChannel ? target.id : null,
        content: msg.content ? `[Forwarded]: ${msg.content}` : "",
        message_type: msg.message_type,
        file_url: msg.file_url,
        file_name: msg.file_name,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Forward message error:", e);
    }
  };

  const handleCreateInstantMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomName.trim()) return;
    setActiveCallRoom({
      roomName: customRoomName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""),
      callType: "video",
      targetName: `Meeting Room: ${customRoomName.trim()}`,
    });
    setIsCreateRoomOpen(false);
    setCustomRoomName("");
  };

  const handleAcceptIncomingCall = () => {
    if (!incomingCall) return;
    acceptCall();
    setActiveCallRoom({
      roomName: incomingCall.roomName,
      callType: incomingCall.callType,
      targetName: incomingCall.caller.display_name,
    });
  };

  if (isLoading) {
    return (
      <div
        data-testid="app-loading"
        className="h-screen w-screen flex flex-col items-center justify-center text-slate-800 font-prompt"
      >
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-medium">Preparing Social Solution Suite...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthModal onLogin={loginUser} />;
  }

  return (
    <main className="h-[100dvh] w-screen flex items-center justify-center p-0 md:p-3 lg:p-6 overflow-hidden font-prompt">
      {/* Floating Glassmorphic Container Shell */}
      <div
        data-testid="main-dashboard"
        className="floating-app-shell w-full h-full max-w-[100vw] lg:max-w-[1720px] rounded-none md:rounded-3xl flex overflow-hidden border-0 md:border md:border-white/80"
      >
        {/* Column 1: Slim Left Navigation & Profile (Visible on Tablet & Desktop) */}
        <div className="hidden md:flex shrink-0">
          <LeftSlimNav
            currentUser={currentUser}
            unreadCount={2}
            bookmarkedCount={bookmarkedMessages.length}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenBookmarks={() => setIsBookmarksOpen(true)}
            onOpenCallHistory={() => setIsCallHistoryOpen(true)}
            onLogout={logout}
          />
        </div>

        {/* Column 2: Conversation / Contact List */}
        <div
          className={`${
            mobileView === "sidebar" ? "flex w-full" : "hidden"
          } md:flex md:w-72 lg:w-80 shrink-0 h-full min-w-0`}
        >
          <UserSidebar
            currentUser={currentUser}
            contacts={onlineUsers}
            channels={channels}
            selectedUser={selectedUser}
            selectedChannel={selectedChannel}
            onSelectUser={handleSelectUser}
            onSelectChannel={handleSelectChannel}
            onOpenCreateChannel={() => setIsCreateChannelOpen(true)}
            onOpenCreateLiveKitRoom={() => setIsCreateRoomOpen(true)}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenBookmarks={() => setIsBookmarksOpen(true)}
            onOpenCallHistory={() => setIsCallHistoryOpen(true)}
            onLogout={logout}
            unreadCount={2}
            bookmarkedCount={bookmarkedMessages.length}
          />
        </div>

        {/* Column 3: Main Chat Feed */}
        <div
          className={`${
            mobileView === "chat" ? "flex w-full" : "hidden"
          } md:flex flex-1 h-full min-w-0`}
        >
          <ChatContainer
            currentUser={currentUser}
            selectedUser={selectedUser}
            selectedChannel={selectedChannel}
            showDetailsPanel={showDetailsPanel}
            availableUsers={onlineUsers}
            bookmarkedIds={bookmarkedMessages.map((m) => m.id)}
            onToggleBookmark={handleToggleBookmark}
            onOpenLightbox={(url, name) => setLightboxMedia({ url, name })}
            onOpenForward={(msg) => {
              setForwardingMessage(msg);
              setIsForwardOpen(true);
            }}
            onToggleDetailsPanel={() => {
              if (typeof window !== "undefined" && window.innerWidth < 1280) {
                setMobileView(mobileView === "details" ? "chat" : "details");
              } else {
                setShowDetailsPanel(!showDetailsPanel);
              }
            }}
            onStartCall={handleStartCall}
            onBack={() => setMobileView("sidebar")}
          />
        </div>

        {/* Column 4: Right Profile & Categorized Attachments Panel */}
        <div
          className={`${
            mobileView === "details" ? "flex w-full" : "hidden"
          } ${showDetailsPanel ? "xl:flex" : "xl:hidden"} w-full xl:w-80 shrink-0 h-full min-w-0`}
        >
          {(selectedUser || selectedChannel) && (
            <RightDetailsPanel
              selectedUser={selectedUser}
              selectedChannel={selectedChannel}
              channelMembers={channelMembers}
              availableUsers={onlineUsers}
              onAddMember={(username) => {
                if (selectedChannel) addMemberToChannel(selectedChannel.id, username);
              }}
              onStartCall={(type) => {
                if (selectedChannel) handleStartCall(selectedChannel, type);
                else if (selectedUser) handleStartCall(selectedUser, type);
              }}
              onClose={() => setMobileView("chat")}
            />
          )}
        </div>
      </div>

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        availableUsers={onlineUsers}
        onCreateChannel={async (name, desc, isPrivate, members) => {
          await createChannel(name, desc, isPrivate, members);
        }}
      />

      {/* Edit Profile & Presence Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        currentUser={currentUser}
        onClose={() => setIsEditProfileOpen(false)}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        bookmarkedMessages={bookmarkedMessages}
        onClose={() => setIsBookmarksOpen(false)}
        onRemoveBookmark={(id) =>
          setBookmarkedMessages((prev) => prev.filter((m) => m.id !== id))
        }
        onJumpToMessage={(id) => {
          setIsBookmarksOpen(false);
          const el = document.getElementById(`msg-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("ring-2", "ring-blue-500");
            setTimeout(() => el.classList.remove("ring-2", "ring-blue-500"), 2000);
          }
        }}
      />

      {/* Call History Drawer */}
      <CallHistoryDrawer
        isOpen={isCallHistoryOpen}
        currentUser={currentUser}
        contacts={onlineUsers}
        onClose={() => setIsCallHistoryOpen(false)}
        onRedial={(target, type) => handleStartCall(target, type)}
      />

      {/* Forward Message Modal */}
      <ForwardMessageModal
        isOpen={isForwardOpen}
        message={forwardingMessage}
        contacts={onlineUsers}
        channels={channels}
        currentUser={currentUser}
        onClose={() => setIsForwardOpen(false)}
        onForward={handleForwardMessage}
      />

      {/* Media Lightbox Viewer Modal */}
      <MediaLightboxModal
        isOpen={!!lightboxMedia}
        mediaUrl={lightboxMedia?.url || null}
        mediaName={lightboxMedia?.name}
        onClose={() => setLightboxMedia(null)}
      />

      {/* Incoming Call Popup Modal */}
      <IncomingCallDialog
        incomingCall={incomingCall}
        onAccept={handleAcceptIncomingCall}
        onReject={rejectCall}
      />

      {/* Active LiveKit Video Meet & Call Modal */}
      {activeCallRoom && (
        <LiveKitMeetRoom
          roomName={activeCallRoom.roomName}
          participantName={currentUser.username}
          targetName={activeCallRoom.targetName}
          callType={activeCallRoom.callType}
          onLeave={() => {
            setActiveCallRoom(null);
            endCall();
          }}
        />
      )}

      {/* Create LiveKit Meeting Modal */}
      {isCreateRoomOpen && (
        <div
          data-testid="create-livekit-room-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-fade-in font-prompt"
        >
          <div className="relative w-full max-w-sm rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">เปิดห้องประชุมวิดีโอ</h3>
                  <p className="text-[11px] text-slate-400">LiveKit WebRTC Meeting</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateRoomOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInstantMeeting} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  ชื่อห้องประชุม (Room Name)
                </label>
                <input
                  type="text"
                  data-testid="room-name-input"
                  value={customRoomName}
                  onChange={(e) => setCustomRoomName(e.target.value)}
                  placeholder="เช่น team-sync, marketing-review"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoomOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  data-testid="join-room-confirm-btn"
                  disabled={!customRoomName.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  เริ่มการประชุมทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
