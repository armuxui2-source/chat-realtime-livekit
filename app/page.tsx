"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseChannels } from "@/hooks/useSupabaseChannels";
import { useCallSignaling } from "@/hooks/useCallSignaling";
import { UserProfile, Channel, ChatMessage } from "@/types/chat";
import { LandingHero } from "@/components/landing/LandingHero";
import { AuthModal } from "@/components/auth/AuthModal";
import { LeftSlimNav } from "@/components/layout/LeftSlimNav";
import { UserSidebar } from "@/components/chat/UserSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { RightDetailsPanel, RightPanelMode } from "@/components/layout/RightDetailsPanel";
import { CreateChannelModal } from "@/components/chat/CreateChannelModal";
import { LiveKitMeetRoom } from "@/components/call/LiveKitMeetRoom";
import { IncomingCallDialog } from "@/components/call/IncomingCallDialog";
import { ForwardMessageModal } from "@/components/chat/ForwardMessageModal";
import { MediaLightboxModal } from "@/components/chat/MediaLightboxModal";
import { StoryViewerModal, StoryItem } from "@/components/story/StoryViewerModal";
import { AddFriendModal } from "@/components/friends/AddFriendModal";
import { requestNotificationPermission } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  MessageSquare,
  Radio,
  PhoneCall,
  Settings,
  UserPlus,
  Video,
  X,
} from "lucide-react";

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
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("details");
  const [mobileView, setMobileView] = useState<"sidebar" | "chat" | "details">("sidebar");

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storyInitialIndex, setStoryInitialIndex] = useState(0);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<ChatMessage[]>([]);

  // Demo Stories
  const sampleStories: StoryItem[] = [
    {
      id: "s1",
      userId: "alex",
      userName: "Alex Dev",
      mediaUrl: "",
      caption: "🚀 LiveKit WebRTC Cloud & PiP Mode ใช้งานได้ราบรื่นมาก!",
      timestamp: "2 ชม. ที่แล้ว",
      gradient: "from-indigo-600 via-purple-700 to-slate-900",
    },
    {
      id: "s2",
      userId: "sarah",
      userName: "Sarah Miller",
      mediaUrl: "",
      caption: "✨ ออกแบบดีไซน์ใหม่สไตล์ Supercar Luxury Dark Mode เสร็จแล้วนะคะ",
      timestamp: "4 ชม. ที่แล้ว",
      gradient: "from-emerald-600 via-teal-700 to-slate-900",
    },
    {
      id: "s3",
      userId: "somchai",
      userName: "สมชาย ยอดรัก",
      mediaUrl: "",
      caption: "☕ พักดื่มกาแฟก่อนเริ่ม Sprint Planning บ่ายนี้ครับ",
      timestamp: "5 ชม. ที่แล้ว",
      gradient: "from-amber-600 via-orange-700 to-slate-900",
    },
  ];

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

  const handleOpenPanelMode = (mode: RightPanelMode) => {
    setRightPanelMode(mode);
    setShowDetailsPanel(true);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileView("details");
    }
  };

  const handleToggleBookmark = (message: ChatMessage) => {
    setBookmarkedMessages((prev) => {
      const exists = prev.some((m) => m.id === message.id);
      if (exists) {
        return prev.filter((m) => m.id !== message.id);
      } else {
        return [...prev, message];
      }
    });
  };

  const handleForwardMessage = async (
    target: UserProfile | Channel,
    msgToForward: ChatMessage
  ) => {
    if (!currentUser) return;
    const isChan = "member_count" in target;
    if (isSupabaseConfigured) {
      try {
        await supabase.from("messages").insert({
          sender_id: currentUser.username,
          receiver_id: isChan ? null : (target as UserProfile).username,
          channel_id: isChan ? (target as Channel).id : null,
          content: msgToForward.content,
          message_type: msgToForward.message_type || "text",
        });
      } catch (err) {
        console.warn("Forward message failed:", err);
      }
    }
    setIsForwardOpen(false);
  };

  const handleUpdateProfile = (data: {
    display_name: string;
    status: "online" | "busy" | "away" | "offline";
    customStatus?: string;
  }) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      display_name: data.display_name,
      status: data.status,
    };
    setCurrentUser(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("chat_user_profile", JSON.stringify(updated));
    }
  };

  const handleStartCall = (
    target: UserProfile | Channel,
    type: "audio" | "video" = "video"
  ) => {
    const isChan = "member_count" in target;
    const targetDisplay = isChan ? `#${(target as Channel).name}` : (target as UserProfile).display_name;
    const room = isChan
      ? `chan-${(target as Channel).id}`
      : [currentUser?.username || "user", (target as UserProfile).username]
          .sort()
          .join("-");

    setActiveCallRoom({
      roomName: room,
      callType: type,
      targetName: targetDisplay,
    });

    if (!isChan && "username" in target) {
      startCall(target as UserProfile, type);
    }
  };

  const handleCreateInstantMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomName.trim() || !currentUser) return;
    const cleanRoom = customRoomName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setActiveCallRoom({
      roomName: cleanRoom,
      callType: "video",
      targetName: `ห้องประชุม #${cleanRoom}`,
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
        className="h-screen w-screen flex flex-col items-center justify-center bg-[#07080B] text-white font-prompt"
      >
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-medium">กำลังเตรียมระบบ Ticketapp Realtime Suite...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <LandingHero
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onQuickLogin={loginUser}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={loginUser}
        />
      </>
    );
  }

  return (
    <main className="h-[100dvh] w-screen flex overflow-hidden font-prompt bg-[#0F1216] text-white">
      {/* 3-Tier Responsive Container Shell (Desktop 3-Column Tri-Pane / Tablet 2-Column / Mobile 1-Column) - True Full Edge-to-Edge */}
      <div
        data-testid="main-dashboard"
        className="w-full h-full flex flex-col md:flex-row overflow-hidden"
      >
        {/* Main Content Tri-Pane Columns Container (Flex-1 Min-H-0) */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row w-full h-full overflow-hidden">
          {/* Column 1: Slim Left Navigation Rail (Visible on Tablet & Desktop) */}
          <div className="hidden md:flex shrink-0">
            <LeftSlimNav
              currentUser={currentUser}
              unreadCount={2}
              bookmarkedCount={bookmarkedMessages.length}
              onOpenEditProfile={() => handleOpenPanelMode("edit_profile")}
              onOpenBookmarks={() => handleOpenPanelMode("bookmarks")}
              onOpenCallHistory={() => handleOpenPanelMode("call_history")}
              onOpenAddFriends={() => setIsAddFriendOpen(true)}
              onLogout={logout}
            />
          </div>

          {/* Column 2: Conversation / Contact List (Desktop Left Column: 280px - 320px) */}
          <div
            className={`${
              mobileView === "sidebar" ? "flex w-full" : "hidden"
            } md:flex md:w-72 lg:w-80 shrink-0 h-full min-w-0`}
          >
            <UserSidebar
              currentUser={currentUser}
              contacts={onlineUsers}
              channels={channels}
              stories={sampleStories}
              selectedUser={selectedUser}
              selectedChannel={selectedChannel}
              onSelectUser={handleSelectUser}
              onSelectChannel={handleSelectChannel}
              onOpenCreateChannel={() => setIsCreateChannelOpen(true)}
              onOpenCreateLiveKitRoom={() => setIsCreateRoomOpen(true)}
              onOpenStory={(idx) => {
                setStoryInitialIndex(idx);
                setIsStoryViewerOpen(true);
              }}
              onAddStory={() => {
                setStoryInitialIndex(0);
                setIsStoryViewerOpen(true);
              }}
            />
          </div>

          {/* Column 3: Main Chat Feed (Center Column: Fluid Flex-1) */}
          <div
            className={`${
              mobileView === "chat" ? "flex w-full" : "hidden"
            } md:flex flex-1 h-full min-w-0 flex-col bg-[#0F1216]`}
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
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setMobileView(mobileView === "details" ? "chat" : "details");
                } else {
                  setShowDetailsPanel(!showDetailsPanel);
                  setRightPanelMode("details");
                }
              }}
              onStartCall={handleStartCall}
              onBack={() => setMobileView("sidebar")}
            />
          </div>

          {/* Column 4: Right Contextual Detail & Zero-Center-Modals Slide Drawer (Desktop Right Column: 320px - 360px) */}
          <div
            className={`${
              mobileView === "details" ? "flex w-full" : "hidden"
            } ${showDetailsPanel ? "lg:flex" : "lg:hidden"} w-full lg:w-80 xl:w-96 shrink-0 h-full min-w-0`}
          >
            <RightDetailsPanel
              mode={rightPanelMode}
              currentUser={currentUser}
              selectedUser={selectedUser}
              selectedChannel={selectedChannel}
              channelMembers={channelMembers}
              availableUsers={onlineUsers}
              bookmarkedMessages={bookmarkedMessages}
              onModeChange={(m) => setRightPanelMode(m)}
              onUpdateProfile={handleUpdateProfile}
              onRemoveBookmark={(id) =>
                setBookmarkedMessages((prev) => prev.filter((m) => m.id !== id))
              }
              onJumpToMessage={(id) => {
                setMobileView("chat");
                const el = document.getElementById(`msg-${id}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  el.classList.add("ring-2", "ring-emerald-500");
                  setTimeout(() => el.classList.remove("ring-2", "ring-emerald-500"), 2000);
                }
              }}
              onAddMember={(username) => {
                if (selectedChannel) addMemberToChannel(selectedChannel.id, username);
              }}
              onStartCall={(type) => {
                if (selectedChannel) handleStartCall(selectedChannel, type);
                else if (selectedUser) handleStartCall(selectedUser, type);
              }}
              onOpenAddFriends={() => setIsAddFriendOpen(true)}
              onClose={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setMobileView("chat");
                } else {
                  setShowDetailsPanel(false);
                }
              }}
            />
          </div>
        </div>

        {/* Permanent Mobile & PWA Bottom Navigation Bar (< 768px) */}
        <nav
          data-testid="mobile-bottom-nav"
          className="md:hidden flex items-center justify-around h-16 bg-[#161A22] border-t border-white/[0.08] px-2 select-none shrink-0 z-40 pb-safe"
        >
          <button
            type="button"
            onClick={() => setMobileView("sidebar")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              mobileView === "sidebar" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">แชท</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddFriendOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-emerald-400 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[10px]">เพิ่มเพื่อน</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPanelMode("call_history")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              rightPanelMode === "call_history" && mobileView === "details"
                ? "text-emerald-400 font-bold"
                : "text-slate-400"
            }`}
          >
            <PhoneCall className="w-5 h-5" />
            <span className="text-[10px]">การโทร</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPanelMode("edit_profile")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              rightPanelMode === "edit_profile" && mobileView === "details"
                ? "text-emerald-400 font-bold"
                : "text-slate-400"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">ตั้งค่า</span>
          </button>
        </nav>
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

      {/* Story Viewer Modal (Instagram Stories) */}
      <StoryViewerModal
        isOpen={isStoryViewerOpen}
        stories={sampleStories}
        onClose={() => setIsStoryViewerOpen(false)}
        onReplyStory={(story, message) => {
          const target = onlineUsers.find((u) => u.username === story.userId);
          if (target) {
            handleSelectUser(target);
          }
        }}
      />

      {/* Add Friends & Discovery Modal */}
      <AddFriendModal
        isOpen={isAddFriendOpen}
        currentUser={currentUser}
        contacts={onlineUsers}
        onClose={() => setIsAddFriendOpen(false)}
        onAddFriend={(targetUsername) => {
          console.log("Friend request sent to:", targetUsername);
        }}
      />

      {/* Incoming Call Popup Modal */}
      <IncomingCallDialog
        incomingCall={incomingCall}
        onAccept={handleAcceptIncomingCall}
        onReject={rejectCall}
      />

      {/* Active LiveKit Video Meet & Call Modal (with PiP Mode) */}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-prompt"
        >
          <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#12161F] p-6 shadow-2xl backdrop-blur-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">เปิดห้องประชุมวิดีโอ</h3>
                  <p className="text-[11px] text-slate-400">LiveKit WebRTC Cloud</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateRoomOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInstantMeeting} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  ชื่อห้องประชุม (Room Name)
                </label>
                <input
                  type="text"
                  data-testid="room-name-input"
                  value={customRoomName}
                  onChange={(e) => setCustomRoomName(e.target.value)}
                  placeholder="เช่น team-sync, marketing-review"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoomOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  data-testid="join-room-confirm-btn"
                  disabled={!customRoomName.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 disabled:opacity-50"
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
