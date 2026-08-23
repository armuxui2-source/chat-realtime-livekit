"use client";

import React, { useState } from "react";
import { UserProfile, Channel, ChannelMember, ChatMessage, CallLog } from "@/types/chat";
import { getAvatarColor, formatMessageTime } from "@/lib/utils";
import {
  Phone,
  Video,
  UserPlus,
  ChevronLeft,
  X,
  FileText,
  Image as ImageIcon,
  Check,
  Edit3,
  Bookmark,
  Bell,
  Settings,
  ShieldCheck,
  Clock,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  ArrowUpRight,
  Trash2,
  Mic,
  Activity,
  User,
} from "lucide-react";

export type RightPanelMode =
  | "details"
  | "edit_profile"
  | "call_history"
  | "bookmarks"
  | "notifications"
  | "settings";

interface RightDetailsPanelProps {
  mode?: RightPanelMode;
  currentUser: UserProfile;
  selectedUser: UserProfile | null;
  selectedChannel: Channel | null;
  channelMembers: ChannelMember[];
  availableUsers: UserProfile[];
  bookmarkedMessages?: ChatMessage[];
  onModeChange?: (mode: RightPanelMode) => void;
  onUpdateProfile?: (data: {
    display_name: string;
    status: "online" | "busy" | "away" | "offline";
    customStatus?: string;
  }) => void;
  onRemoveBookmark?: (messageId: string) => void;
  onJumpToMessage?: (messageId: string) => void;
  onAddMember: (username: string) => void;
  onStartCall: (type: "audio" | "video") => void;
  onClose?: () => void;
}

export const RightDetailsPanel: React.FC<RightDetailsPanelProps> = ({
  mode = "details",
  currentUser,
  selectedUser,
  selectedChannel,
  channelMembers,
  bookmarkedMessages = [],
  onModeChange,
  onUpdateProfile,
  onRemoveBookmark,
  onJumpToMessage,
  onAddMember,
  onStartCall,
  onClose,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<"media" | "files" | "members">("media");
  const [newMemberUsername, setNewMemberUsername] = useState("");

  // Edit profile state
  const [editName, setEditName] = useState(currentUser.display_name);
  const [editBio, setEditBio] = useState("Lead Product Designer & Engineer");
  const [editStatus, setEditStatus] = useState<"online" | "busy" | "away" | "offline">(
    currentUser.status === "in_call" ? "busy" : (currentUser.status || "online")
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isChannel = !!selectedChannel;
  const displayName = isChannel
    ? `#${selectedChannel.name}`
    : selectedUser?.display_name || currentUser.display_name;
  const username = isChannel ? selectedChannel.id : selectedUser?.username || currentUser.username;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onUpdateProfile?.({
      display_name: editName.trim(),
      status: editStatus,
      customStatus: editBio.trim(),
    });
    triggerToast("บันทึกการตั้งค่าโปรไฟล์เรียบร้อยแล้ว");
    onModeChange?.("details");
  };

  // Mock Call Logs
  const mockCallLogs: CallLog[] = [
    {
      id: "c1",
      caller_id: "alex",
      receiver_id: currentUser.username,
      call_type: "video",
      status: "completed",
      duration_seconds: 342,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "c2",
      caller_id: "somchai",
      receiver_id: currentUser.username,
      call_type: "audio",
      status: "missed",
      duration_seconds: 0,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "c3",
      caller_id: currentUser.username,
      receiver_id: "alex",
      call_type: "video",
      status: "completed",
      duration_seconds: 520,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  // Mock Notifications
  const mockNotifications = [
    {
      id: "n1",
      title: "กล่าวถึงคุณใน #general",
      body: "@alex กล่าวถึงคุณ: 'รบกวนตรวจทานโค้ด WebRTC ด้วยครับ'",
      time: "5 นาทีที่แล้ว",
      unread: true,
    },
    {
      id: "n2",
      title: "สายที่ไม่ได้รับจาก Somchai PM",
      body: "พยายามติดต่อทางเสียงเมื่อ 2 ชม. ที่แล้ว",
      time: "2 ชม. ที่แล้ว",
      unread: false,
    },
    {
      id: "n3",
      title: "ระบบอัปเดตเวอร์ชัน 2.0",
      body: "รองรับ Supercar Dark Mode และ LiveKit PiP Mode เรียบร้อย",
      time: "1 วันที่แล้ว",
      unread: false,
    },
  ];

  return (
    <aside
      data-testid="right-details-panel"
      className="w-full h-full bg-[#12161F] border-l border-white/10 p-5 select-none overflow-y-auto custom-scrollbar flex flex-col justify-between text-white relative font-prompt"
    >
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            {mode !== "details" && (
              <button
                onClick={() => onModeChange?.("details")}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors mr-1"
                title="ย้อนกลับ"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="text-sm font-bold text-white leading-tight">
              {mode === "details" && (isChannel ? "ข้อมูลช่องสนทนา" : "ข้อมูลผู้ใช้งาน")}
              {mode === "edit_profile" && "ตั้งค่าโปรไฟล์ส่วนตัว"}
              {mode === "call_history" && "ประวัติการโทร & WebRTC"}
              {mode === "bookmarks" && "ข้อความที่บันทึกไว้"}
              {mode === "notifications" && "ศูนย์การแจ้งเตือน"}
              {mode === "settings" && "การตั้งค่าระบบ"}
            </h3>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              data-testid="close-details-btn"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: DEFAULT CONTEXT DETAILS (PROFILE & SHARED MEDIA)                  */}
        {/* ========================================================================= */}
        {mode === "details" && (
          <div className="space-y-5 animate-fade-in">
            {/* User Profile Card */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-white/10">
              <div className="relative mb-3">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${getAvatarColor(
                    username
                  )} flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-white/10`}
                >
                  {displayName.replace("#", "").charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#12161F]" />
              </div>

              <h4 className="text-base font-bold text-white">{displayName}</h4>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {isChannel ? selectedChannel.description || "Public channel" : `@${username}`}
              </p>

              {/* Quick Call Actions */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => onStartCall("audio")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-medium">โทรเสียง</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartCall("video")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-all">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium">วิดีโอคอล</span>
                </button>

                <button
                  type="button"
                  onClick={() => onModeChange?.("edit_profile")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium">แก้ไข</span>
                </button>
              </div>
            </div>

            {/* Shared Media Tabs */}
            <div>
              <div className="flex border-b border-white/10 mb-3 text-xs">
                <button
                  onClick={() => setActiveMediaTab("media")}
                  className={`pb-2 px-3 font-semibold transition-all border-b-2 ${
                    activeMediaTab === "media"
                      ? "border-emerald-500 text-emerald-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  รูปภาพ/สื่อ
                </button>
                <button
                  onClick={() => setActiveMediaTab("files")}
                  className={`pb-2 px-3 font-semibold transition-all border-b-2 ${
                    activeMediaTab === "files"
                      ? "border-emerald-500 text-emerald-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  ไฟล์เอกสาร
                </button>
                {isChannel && (
                  <button
                    onClick={() => setActiveMediaTab("members")}
                    className={`pb-2 px-3 font-semibold transition-all border-b-2 ${
                      activeMediaTab === "members"
                        ? "border-emerald-500 text-emerald-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    สมาชิก ({channelMembers.length})
                  </button>
                )}
              </div>

              {activeMediaTab === "media" && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                </div>
              )}

              {activeMediaTab === "files" && (
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">Architecture_Spec.pdf</p>
                      <p className="text-[10px] text-slate-400">2.4 MB · เมื่อวานนี้</p>
                    </div>
                  </div>
                </div>
              )}

              {activeMediaTab === "members" && isChannel && (
                <div className="space-y-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newMemberUsername.trim()) {
                        onAddMember(newMemberUsername.trim());
                        setNewMemberUsername("");
                      }
                    }}
                    className="flex gap-1.5 mb-3"
                  >
                    <input
                      type="text"
                      value={newMemberUsername}
                      onChange={(e) => setNewMemberUsername(e.target.value)}
                      placeholder="ระบุ Username..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="space-y-1">
                    {channelMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs"
                      >
                        <span className="font-bold text-white">@{member.user_id}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: INLINE PROFILE EDITOR                                             */}
        {/* ========================================================================= */}
        {mode === "edit_profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-4 animate-fade-in">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                ชื่อที่ใช้แสดง (Display Name)
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                ประวัติหรือบทบาท (Bio / Role)
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D11] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                สถานะการทำงาน (Status)
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "online", title: "ออนไลน์ (Online)", color: "bg-emerald-500" },
                  { id: "busy", title: "กำลังยุ่ง (Do Not Disturb)", color: "bg-rose-500" },
                  { id: "away", title: "ไม่อยู่ชั่วคราว (Away)", color: "bg-amber-500" },
                  { id: "offline", title: "ออฟไลน์ (Invisible)", color: "bg-slate-400" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setEditStatus(st.id as "online" | "busy" | "away" | "offline")}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      editStatus === st.id
                        ? "bg-emerald-600/20 border-emerald-500 text-white font-bold"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                      <span className="text-xs">{st.title}</span>
                    </div>
                    {editStatus === st.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกการเปลี่ยนแปลง</span>
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: CALL HISTORY                                                      */}
        {/* ========================================================================= */}
        {mode === "call_history" && (
          <div className="space-y-2.5 animate-fade-in">
            {mockCallLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                      log.caller_id
                    )} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {log.caller_id.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">@{log.caller_id}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      {log.status === "missed" ? (
                        <span className="text-rose-400 flex items-center gap-1">
                          <PhoneMissed className="w-3 h-3" />
                          <span>สายไม่ได้รับ</span>
                        </span>
                      ) : log.caller_id === currentUser.username ? (
                        <span className="text-blue-400 flex items-center gap-1">
                          <PhoneOutgoing className="w-3 h-3" />
                          <span>โทรออก</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <PhoneIncoming className="w-3 h-3" />
                          <span>โทรเข้า</span>
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatMessageTime(log.created_at)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onStartCall(log.call_type as "audio" | "video")}
                  className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-all"
                  title="โทรซ้ำ"
                >
                  {log.call_type === "video" ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: NOTIFICATIONS CENTER                                              */}
        {/* ========================================================================= */}
        {mode === "notifications" && (
          <div className="space-y-2.5 animate-fade-in">
            {mockNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-2xl border transition-all ${
                  notif.unread
                    ? "bg-emerald-950/30 border-emerald-500/40"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{notif.title}</span>
                  <span className="text-[10px] text-slate-400">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{notif.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: BOOKMARKS / SAVED ITEMS                                           */}
        {/* ========================================================================= */}
        {mode === "bookmarks" && (
          <div className="space-y-2.5 animate-fade-in">
            {bookmarkedMessages.length > 0 ? (
              bookmarkedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">@{msg.sender_id}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onJumpToMessage?.(msg.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                        title="ไปยังข้อความ"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveBookmark?.(msg.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-3">{msg.content}</p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
                <p className="text-xs">ยังไม่มีข้อความที่บันทึกไว้</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg animate-scale-up text-center mt-4">
          {toastMessage}
        </div>
      )}
    </aside>
  );
};
