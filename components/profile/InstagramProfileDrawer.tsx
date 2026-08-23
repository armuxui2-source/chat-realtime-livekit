"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  Settings,
  Edit3,
  Copy,
  Bookmark,
  Bell,
  Volume2,
  VolumeX,
  Shield,
  LogOut,
  ChevronRight,
  Check,
  ChevronLeft,
  X,
  PhoneCall,
  MessageSquare,
  Users,
  Eye,
  EyeOff,
  Moon,
  Smartphone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface InstagramProfileDrawerProps {
  currentUser: UserProfile;
  bookmarkedCount?: number;
  onClose?: () => void;
  onOpenBookmarks?: () => void;
  onOpenCallHistory?: () => void;
  onUpdateProfile?: (data: {
    display_name: string;
    status: "online" | "busy" | "away" | "offline";
    customStatus?: string;
  }) => void;
  onLogout: () => void;
}

export const InstagramProfileDrawer: React.FC<InstagramProfileDrawerProps> = ({
  currentUser,
  bookmarkedCount = 0,
  onClose,
  onOpenBookmarks,
  onOpenCallHistory,
  onUpdateProfile,
  onLogout,
}) => {
  const [view, setView] = useState<"profile" | "edit" | "notifications" | "privacy">("profile");

  // Edit State
  const [editName, setEditName] = useState(currentUser.display_name);
  const [editBio, setEditBio] = useState(
    currentUser.custom_status || "พร้อมร่วมงานและสื่อสารแบบเรียลไทม์"
  );
  const [editStatus, setEditStatus] = useState<"online" | "busy" | "away" | "offline">(
    currentUser.status === "in_call" ? "busy" : (currentUser.status || "online")
  );

  // Notification Preferences State
  const [msgSound, setMsgSound] = useState(true);
  const [callSound, setCallSound] = useState(true);
  const [dmNotif, setDmNotif] = useState(true);
  const [channelNotifMode, setChannelNotifMode] = useState<"all" | "mentions">("mentions");
  const [dndDuration, setDndDuration] = useState<"off" | "1h" | "8h" | "always">("off");

  // Privacy Preferences State
  const [showOnline, setShowOnline] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyUsername = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(`@${currentUser.username}`);
      triggerToast("คัดลอก Username สำเร็จแล้ว!");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onUpdateProfile?.({
      display_name: editName.trim(),
      status: editStatus,
      customStatus: editBio.trim(),
    });
    triggerToast("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว");
    setView("profile");
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case "busy":
        return "bg-rose-500 text-rose-400 border-rose-500/30";
      case "away":
        return "bg-amber-500 text-amber-400 border-amber-500/30";
      case "offline":
        return "bg-slate-400 text-slate-400 border-slate-500/30";
      default:
        return "bg-emerald-500 text-emerald-400 border-emerald-500/30";
    }
  };

  const getStatusText = (st: string) => {
    switch (st) {
      case "busy":
        return "กำลังยุ่ง (Do Not Disturb)";
      case "away":
        return "ไม่อยู่ชั่วคราว (Away)";
      case "offline":
        return "ออฟไลน์ (Offline)";
      default:
        return "ออนไลน์ (Active now)";
    }
  };

  return (
    <div
      data-testid="instagram-profile-drawer"
      className="w-full h-full bg-[#12161F] text-white flex flex-col font-prompt select-none overflow-y-auto custom-scrollbar"
    >
      {/* Header Bar */}
      <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0B0D11]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {view !== "profile" && (
            <button
              onClick={() => setView("profile")}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="ย้อนกลับ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm font-bold text-white tracking-tight">
            {view === "profile" && "ข้อมูลโปรไฟล์ผู้ใช้งาน"}
            {view === "edit" && "แก้ไขข้อมูลโปรไฟล์"}
            {view === "notifications" && "ศูนย์การแจ้งเตือน & เสียง"}
            {view === "privacy" && "ความเป็นส่วนตัว & บัญชีผู้ใช้"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: CLEAN PROFILE OVERVIEW (NO LOGOUT DISTRACTION)                    */}
      {/* ========================================================================= */}
      {view === "profile" && (
        <div className="p-5 space-y-5 animate-fade-in">
          {/* User Card */}
          <div className="flex flex-col items-center text-center p-5 rounded-3xl bg-[#0B0D11] border border-white/10 shadow-sm relative">
            <div className="relative mb-3">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${getAvatarColor(
                  currentUser.username
                )} flex items-center justify-center text-white text-2xl font-black shadow-lg ring-2 ring-white/15`}
              >
                {currentUser.display_name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0B0D11] ${
                  currentUser.status === "busy"
                    ? "bg-rose-500"
                    : currentUser.status === "away"
                    ? "bg-amber-500"
                    : currentUser.status === "offline"
                    ? "bg-slate-400"
                    : "bg-emerald-500"
                }`}
              />
            </div>

            <h3 className="text-base font-bold text-white leading-tight">
              {currentUser.display_name}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">@{currentUser.username}</p>

            <div className="mt-2.5">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-semibold ${getStatusColor(
                  currentUser.status || "online"
                )}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{getStatusText(currentUser.status || "online")}</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3.5 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5 w-full text-center">
              {currentUser.custom_status || "พร้อมร่วมงานและสื่อสารแบบเรียลไทม์"}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setView("edit")}
              className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไขโปรไฟล์</span>
            </button>
            <button
              onClick={handleCopyUsername}
              className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>คัดลอก ID</span>
            </button>
          </div>

          {/* Functional Menu Categories */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              การตั้งค่าและกิจกรรมระบบ
            </p>

            {/* 1. Notifications Hub */}
            <button
              onClick={() => setView("notifications")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">ศูนย์การแจ้งเตือน & เสียง</p>
                  <p className="text-[10px] text-slate-400">
                    {dndDuration === "off" ? "เสียงและป็อปอัปเปิดใช้งาน" : `โหมดห้ามรบกวน (${dndDuration})`}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 2. Privacy & Account */}
            <button
              onClick={() => setView("privacy")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">ความเป็นส่วนตัว & บัญชี</p>
                  <p className="text-[10px] text-slate-400">สถานะออนไลน์, อุปกรณ์, และความปลอดภัย</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* 3. Bookmarks */}
            {onOpenBookmarks && (
              <button
                onClick={onOpenBookmarks}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">ข้อความที่บันทึกไว้ (Bookmarks)</p>
                    <p className="text-[10px] text-slate-400">{bookmarkedCount} รายการ</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            )}

            {/* 4. Call Logs */}
            {onOpenCallHistory && (
              <button
                onClick={onOpenCallHistory}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">ประวัติการโทร & WebRTC</p>
                    <p className="text-[10px] text-slate-400">รายการสายโทรเข้าและวิดีโอคอล</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: EDIT PROFILE FORM                                                 */}
      {/* ========================================================================= */}
      {view === "edit" && (
        <form onSubmit={handleSaveProfile} className="p-5 space-y-4 animate-fade-in">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              ชื่อที่ใช้แสดง (Display Name)
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0B0D11] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <input
              type="text"
              value={currentUser.username}
              disabled
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              ข้อความสถานะ / ประวัติ (Status Note)
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0B0D11] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              สถานะการทำงาน (Realtime Status)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "online", title: "ออนไลน์ (Online)", color: "bg-emerald-500" },
                { id: "busy", title: "กำลังยุ่ง (Busy)", color: "bg-rose-500" },
                { id: "away", title: "ไม่อยู่ (Away)", color: "bg-amber-500" },
                { id: "offline", title: "ออฟไลน์ (Offline)", color: "bg-slate-400" },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setEditStatus(st.id as "online" | "busy" | "away" | "offline")}
                  className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between ${
                    editStatus === st.id
                      ? "bg-emerald-600/20 border-emerald-500 text-white font-bold"
                      : "bg-[#0B0D11] border-white/10 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${st.color}`} />
                    <span>{st.title.split(" ")[0]}</span>
                  </div>
                  {editStatus === st.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกการแก้ไขโปรไฟล์</span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: NOTIFICATIONS CATEGORIES HUB                                      */}
      {/* ========================================================================= */}
      {view === "notifications" && (
        <div className="p-5 space-y-4 animate-fade-in">
          {/* Section 1: Do Not Disturb Mode */}
          <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/10 space-y-2">
            <p className="text-xs font-bold text-white">โหมดห้ามรบกวน (Do Not Disturb)</p>
            <p className="text-[10px] text-slate-400">ปิดเสียงและการแจ้งเตือนชั่วคราว</p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { id: "off", label: "ปิด" },
                { id: "1h", label: "1 ชม." },
                { id: "8h", label: "8 ชม." },
                { id: "always", label: "ตลอดไป" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDndDuration(d.id as any);
                    triggerToast(`ตั้งค่าโหมดห้ามรบกวน: ${d.label}`);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                    dndDuration === d.id
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-xs"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Sound & Alerts */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              เสียงแจ้งเตือน (Sounds)
            </p>

            <button
              onClick={() => setMsgSound(!msgSound)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                {msgSound ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <div>
                  <p className="text-xs font-bold text-white">เสียงข้อความเข้า (Message Chime)</p>
                  <p className="text-[10px] text-slate-400">{msgSound ? "เปิดเสียง" : "ปิดเสียง"}</p>
                </div>
              </div>
              <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${msgSound ? "bg-emerald-600" : "bg-slate-700"}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${msgSound ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </button>

            <button
              onClick={() => setCallSound(!callSound)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                {callSound ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <div>
                  <p className="text-xs font-bold text-white">เสียงเรียกเข้าการโทร (Call Ringtone)</p>
                  <p className="text-[10px] text-slate-400">{callSound ? "เปิดเสียงเรียกเข้า" : "ปิดเสียงเรียกเข้า"}</p>
                </div>
              </div>
              <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${callSound ? "bg-emerald-600" : "bg-slate-700"}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${callSound ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </button>
          </div>

          {/* Section 3: Message & Group Categories */}
          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              หมวดหมู่ข้อความ (Categories)
            </p>

            <button
              onClick={() => setDmNotif(!dmNotif)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-white">แชทส่วนตัว (Direct Messages)</p>
                  <p className="text-[10px] text-slate-400">{dmNotif ? "แจ้งเตือนทุกข้อความ" : "ปิดการแจ้งเตือน"}</p>
                </div>
              </div>
              <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${dmNotif ? "bg-emerald-600" : "bg-slate-700"}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${dmNotif ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </button>

            <div className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 space-y-2">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-white">แชทกลุ่มและแชนเนล (Channels)</p>
                  <p className="text-[10px] text-slate-400">เลือกประเภทการแจ้งเตือนในห้องกลุ่ม</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setChannelNotifMode("all")}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    channelNotifMode === "all"
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-400"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}
                >
                  ทุกข้อความ
                </button>
                <button
                  type="button"
                  onClick={() => setChannelNotifMode("mentions")}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    channelNotifMode === "mentions"
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-400"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}
                >
                  เฉพาะที่แท็ก (@mentions)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: PRIVACY & ACCOUNT SETTINGS (WITH SAFELY PLACED LOGOUT AT BOTTOM)   */}
      {/* ========================================================================= */}
      {view === "privacy" && (
        <div className="p-5 space-y-5 animate-fade-in flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/10 space-y-1">
              <p className="text-xs font-bold text-white">การควบคุมความเป็นส่วนตัว</p>
              <p className="text-[10px] text-slate-400">จัดการข้อมูลที่ผู้อื่นสามารถมองเห็นได้</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowOnline(!showOnline)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  {showOnline ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                  <div>
                    <p className="text-xs font-bold text-white">แสดงสถานะออนไลน์ (Show Presence)</p>
                    <p className="text-[10px] text-slate-400">{showOnline ? "สมาชิกคนอื่นเห็นว่าคุณออนไลน์" : "ซ่อนสถานะออนไลน์"}</p>
                  </div>
                </div>
                <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${showOnline ? "bg-emerald-600" : "bg-slate-700"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showOnline ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </button>

              <button
                onClick={() => setReadReceipts(!readReceipts)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs font-bold text-white">ใบเสร็จการอ่าน (Read Receipts)</p>
                    <p className="text-[10px] text-slate-400">{readReceipts ? "ส่งเครื่องหมายอ่านแล้วให้คู่สนทนา" : "ปิดใบเสร็จการอ่าน"}</p>
                  </div>
                </div>
                <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${readReceipts ? "bg-emerald-600" : "bg-slate-700"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${readReceipts ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </button>
            </div>

            {/* Active Session info */}
            <div className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-white">อุปกรณ์ปัจจุบัน</p>
                  <p className="text-[10px] text-slate-400">Desktop Web Browser · Active Now</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                ออนไลน์
              </span>
            </div>
          </div>

          {/* SAFELY PLACED LOGOUT BUTTON AT THE VERY BOTTOM OF SECURITY */}
          <div className="pt-6 border-t border-white/10">
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-2xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400 font-medium text-xs transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบบัญชีนี้ (Log Out)</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 m-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-lg animate-scale-up text-center">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
