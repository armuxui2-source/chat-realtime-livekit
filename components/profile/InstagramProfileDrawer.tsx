"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  Settings,
  Edit3,
  Copy,
  Link as LinkIcon,
  Search,
  QrCode,
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
  Smartphone,
  CheckCircle2,
  Download,
  Share2,
  UserCheck,
  UserX,
  Sparkles,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface InstagramProfileDrawerProps {
  currentUser: UserProfile;
  bookmarkedCount?: number;
  onClose?: () => void;
  onOpenBookmarks?: () => void;
  onOpenCallHistory?: () => void;
  onOpenAddFriends?: () => void;
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
  onOpenAddFriends,
  onUpdateProfile,
  onLogout,
}) => {
  const { themeMode, changeTheme } = useTheme();

  const [view, setView] = useState<
    "profile" | "edit" | "notifications" | "privacy" | "qr_code" | "activity"
  >("profile");

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

  // Activity Mock State
  const [friendRequests, setFriendRequests] = useState([
    { id: "fr1", username: "somchai", name: "สมชาย ยอดรัก", time: "10 นาทีที่แล้ว" },
    { id: "fr2", username: "alex", name: "Alex Dev", time: "1 ชม. ที่แล้ว" },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyProfileLink = () => {
    const link = `https://ticketapp.io/@${currentUser.username}`;
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(link);
      triggerToast("คัดลอกลิงก์โปรไฟล์แล้ว: " + link);
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
      className="w-full h-full bg-[#161A22] text-white flex flex-col font-prompt select-none overflow-y-auto custom-scrollbar"
    >
      {/* Header Bar */}
      <div className="h-14 px-4 border-b border-white/[0.07] flex items-center justify-between shrink-0 bg-[#0F1216]/90 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {view !== "profile" && (
            <button
              onClick={() => setView("profile")}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="ย้อนกลับ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm font-bold text-white tracking-tight">
            {view === "profile" && "ข้อมูลโปรไฟล์ผู้ใช้งาน"}
            {view === "edit" && "แก้ไขข้อมูลโปรไฟล์"}
            {view === "qr_code" && "คิวอาร์โค้ดส่วนตัว"}
            {view === "activity" && "กิจกรรม & การแจ้งเตือน"}
            {view === "notifications" && "ศูนย์การแจ้งเตือน & เสียง"}
            {view === "privacy" && "ความเป็นส่วนตัว & บัญชีผู้ใช้"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {view === "profile" && (
            <button
              onClick={() => setView("activity")}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors relative"
              title="กิจกรรม & การแจ้งเตือน"
            >
              <Bell className="w-4 h-4" strokeWidth={1.8} />
              {friendRequests.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              )}
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: CLEAN PROFILE OVERVIEW (3 FROSTED GLASS PILL ACTIONS)             */}
      {/* ========================================================================= */}
      {view === "profile" && (
        <div className="p-5 space-y-5 animate-fade-in">
          {/* User Card */}
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#0F1216] border border-white/[0.07] shadow-xl relative">
            <div className="relative mb-3">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${getAvatarColor(
                  currentUser.username
                )} flex items-center justify-center text-white text-2xl font-black shadow-lg ring-2 ring-emerald-500/30`}
              >
                {currentUser.display_name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0F1216] ${
                  currentUser.status === "busy"
                    ? "bg-rose-500"
                    : currentUser.status === "away"
                    ? "bg-amber-500"
                    : currentUser.status === "offline"
                    ? "bg-slate-400"
                    : "bg-emerald-500 shadow-[0_0_10px_#22c55e]"
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

            <p className="text-xs text-slate-300 mt-3.5 leading-relaxed bg-white/[0.04] p-3 rounded-2xl border border-white/[0.05] w-full text-center">
              {currentUser.custom_status || "พร้อมร่วมงานและสื่อสารแบบเรียลไทม์"}
            </p>

            {/* THE 3 FROSTED GLASS ACTION BUTTONS */}
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              {/* Button 1 (Left): Search & Add Friends */}
              <button
                onClick={() => (onOpenAddFriends ? onOpenAddFriends() : setView("activity"))}
                className="py-2.5 px-2 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500/30 text-slate-800 dark:text-white text-xs font-medium transition-all flex flex-col items-center justify-center gap-1.5 group active:scale-95 shadow-xs"
                title="ค้นหาเพื่อนและแอดเพื่อน"
              >
                <Search className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 transition-colors" strokeWidth={1.8} />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-white transition-colors">ค้นหาเพื่อน</span>
              </button>

              {/* Button 2 (Center): Copy Profile Link */}
              <button
                onClick={handleCopyProfileLink}
                className="py-2.5 px-2 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500/30 text-slate-800 dark:text-white text-xs font-medium transition-all flex flex-col items-center justify-center gap-1.5 group active:scale-95 shadow-xs"
                title="คัดลอกลิงก์โปรไฟล์"
              >
                <LinkIcon className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 transition-colors" strokeWidth={1.8} />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-white transition-colors">คัดลอกลิงก์</span>
              </button>

              {/* Button 3 (Right): Personal QR Code */}
              <button
                onClick={() => setView("qr_code")}
                className="py-2.5 px-2 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 border border-slate-200/80 dark:border-white/[0.08] hover:border-emerald-500/30 text-slate-800 dark:text-white text-xs font-medium transition-all flex flex-col items-center justify-center gap-1.5 group active:scale-95 shadow-xs"
                title="คิวอาร์โค้ดส่วนตัว"
              >
                <QrCode className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 transition-colors" strokeWidth={1.8} />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-white transition-colors">คิวอาร์โค้ด</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Full Action Button */}
          <button
            onClick={() => setView("edit")}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4 text-slate-300" strokeWidth={1.8} />
            <span>แก้ไขข้อมูลโปรไฟล์</span>
          </button>

          {/* Functional Menu Categories — ALL FROSTED GLASS MONOCHROME STYLING */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              การตั้งค่าและกิจกรรมระบบ
            </p>

            {/* 1. Notifications Hub */}
            <button
              onClick={() => setView("notifications")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors">
                  <Bell className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">ศูนย์การแจ้งเตือน & เสียง</p>
                  <p className="text-[10px] text-slate-400">
                    {dndDuration === "off" ? "เสียงและป็อปอัปเปิดใช้งาน" : `โหมดห้ามรบกวน (${dndDuration})`}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </button>

            {/* 2. Privacy & Account */}
            <button
              onClick={() => setView("privacy")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors">
                  <Shield className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">ความเป็นส่วนตัว & บัญชี</p>
                  <p className="text-[10px] text-slate-400">สถานะออนไลน์, อุปกรณ์, และความปลอดภัย</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </button>

            {/* 3. Bookmarks */}
            {onOpenBookmarks && (
              <button
                onClick={onOpenBookmarks}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors">
                    <Bookmark className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">ข้อความที่บันทึกไว้ (Bookmarks)</p>
                    <p className="text-[10px] text-slate-400">{bookmarkedCount} รายการ</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </button>
            )}

            {/* 4. Call Logs */}
            {onOpenCallHistory && (
              <button
                onClick={onOpenCallHistory}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors">
                    <PhoneCall className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">ประวัติการโทร & WebRTC</p>
                    <p className="text-[10px] text-slate-400">รายการสายโทรเข้าและวิดีโอคอล</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </button>
            )}

            {/* 5. Theme Switcher (Day / Night / Auto Mode) */}
            <div className="p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">ธีมและการแสดงผล (Theme Mode)</p>
                  <p className="text-[10px] text-slate-400">สลับโหมดสว่าง / มืด หรือตามระบบอัตโนมัติ</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => changeTheme("auto")}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    themeMode === "auto"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold"
                      : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>อัตโนมัติ</span>
                </button>

                <button
                  type="button"
                  onClick={() => changeTheme("light")}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    themeMode === "light"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold"
                      : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>สว่าง (Day)</span>
                </button>

                <button
                  type="button"
                  onClick={() => changeTheme("dark")}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    themeMode === "dark"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold"
                      : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>มืด (Night)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: PERSONAL QR CODE CARD (FIGMA FROSTED GLASS SPEC)                   */}
      {/* ========================================================================= */}
      {view === "qr_code" && (
        <div className="p-5 space-y-5 animate-fade-in flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-[280px] p-6 rounded-3xl glass-emerald-card flex flex-col items-center space-y-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${getAvatarColor(
                currentUser.username
              )} flex items-center justify-center text-white text-xl font-black shadow-lg ring-2 ring-emerald-400/40`}
            >
              {currentUser.display_name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{currentUser.display_name}</h4>
              <p className="text-xs text-emerald-300 font-mono">@{currentUser.username}</p>
            </div>

            {/* Clean Frosted QR Code Box */}
            <div className="p-4 rounded-2xl bg-white flex items-center justify-center shadow-xl">
              <QrCode className="w-40 h-40 text-slate-950" strokeWidth={1.5} />
            </div>

            <p className="text-[11px] text-slate-300">
              สแกน QR Code นี้เพื่อเพิ่มเพื่อนและเริ่มแชทได้ทันที
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
            <button
              onClick={() => triggerToast("บันทึก QR Code ลงในเครื่องแล้ว!")}
              className="py-2.5 px-3 rounded-2xl emerald-button-gradient text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Download className="w-4 h-4 text-white" strokeWidth={2} />
              <span>บันทึกรูป</span>
            </button>
            <button
              onClick={handleCopyProfileLink}
              className="py-2.5 px-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Share2 className="w-4 h-4 text-slate-300" strokeWidth={1.8} />
              <span>แชร์ลิงก์</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: ACTIVITY & SOCIAL NOTIFICATIONS (FRIEND REQUESTS & STORY VIEWS)     */}
      {/* ========================================================================= */}
      {view === "activity" && (
        <div className="p-5 space-y-4 animate-fade-in">
          {/* Section 1: Friend Requests */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              คำขอเป็นเพื่อนใหม่ ({friendRequests.length})
            </p>

            {friendRequests.length > 0 ? (
              friendRequests.map((fr) => (
                <div
                  key={fr.id}
                  className="p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                          fr.username
                        )} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {fr.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{fr.name}</p>
                        <p className="text-[10px] text-slate-400">@{fr.username} · {fr.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setFriendRequests((prev) => prev.filter((r) => r.id !== fr.id));
                        triggerToast(`ยอมรับคำขอเป็นเพื่อนจาก ${fr.name} แล้ว!`);
                      }}
                      className="py-2 px-3 rounded-xl emerald-button-gradient text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>ยอมรับ</span>
                    </button>
                    <button
                      onClick={() => {
                        setFriendRequests((prev) => prev.filter((r) => r.id !== fr.id));
                        triggerToast(`ปฏิเสธคำขอจาก ${fr.name}`);
                      }}
                      className="py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>ปฏิเสธ</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 px-1">ไม่มีคำขอเป็นเพื่อนใหม่ในขณะนี้</p>
            )}
          </div>

          {/* Section 2: Story Views Activity */}
          <div className="space-y-2.5 pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              ผู้เข้าชมสตอรี่ (Story Activity)
            </p>

            <div className="p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Alex Dev และอีก 14 คน</p>
                  <p className="text-[10px] text-slate-400">เข้าชมสตอรี่ล่าสุดของคุณ · 35 นาทีที่แล้ว</p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25">
                +15 วิว
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: EDIT PROFILE FORM                                                   */}
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
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
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
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-slate-400 text-xs font-mono cursor-not-allowed"
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
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-emerald-500 resize-none leading-relaxed transition-colors"
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
                  className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                    editStatus === st.id
                      ? "bg-emerald-500/15 border-emerald-500/40 text-white font-bold"
                      : "bg-[#0F1216] border-white/[0.08] text-slate-400 hover:text-white"
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
            className="w-full py-3.5 px-4 rounded-2xl emerald-button-gradient text-white font-bold text-xs shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกการแก้ไขโปรไฟล์</span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* VIEW: NOTIFICATIONS CATEGORIES HUB                                        */}
      {/* ========================================================================= */}
      {view === "notifications" && (
        <div className="p-5 space-y-4 animate-fade-in">
          {/* Section 1: Do Not Disturb Mode */}
          <div className="p-4 rounded-2xl bg-[#0F1216] border border-white/[0.07] space-y-2">
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
                      ? "emerald-button-gradient text-white"
                      : "bg-white/[0.05] border-white/[0.08] text-slate-400 hover:text-white"
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
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center">
                  {msgSound ? <Volume2 className="w-4 h-4 text-emerald-400" strokeWidth={1.8} /> : <VolumeX className="w-4 h-4 text-slate-500" strokeWidth={1.8} />}
                </div>
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
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center">
                  {callSound ? <Volume2 className="w-4 h-4 text-emerald-400" strokeWidth={1.8} /> : <VolumeX className="w-4 h-4 text-slate-500" strokeWidth={1.8} />}
                </div>
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
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">แชทส่วนตัว (Direct Messages)</p>
                  <p className="text-[10px] text-slate-400">{dmNotif ? "แจ้งเตือนทุกข้อความ" : "ปิดการแจ้งเตือน"}</p>
                </div>
              </div>
              <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${dmNotif ? "bg-emerald-600" : "bg-slate-700"}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${dmNotif ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </button>

            <div className="p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center">
                  <Users className="w-4 h-4" strokeWidth={1.8} />
                </div>
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
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-white/[0.04] border-white/[0.08] text-slate-400"
                  }`}
                >
                  ทุกข้อความ
                </button>
                <button
                  type="button"
                  onClick={() => setChannelNotifMode("mentions")}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    channelNotifMode === "mentions"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-white/[0.04] border-white/[0.08] text-slate-400"
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
      {/* VIEW: PRIVACY & ACCOUNT SETTINGS                                          */}
      {/* ========================================================================= */}
      {view === "privacy" && (
        <div className="p-5 space-y-5 animate-fade-in flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#0F1216] border border-white/[0.07] space-y-1">
              <p className="text-xs font-bold text-white">การควบคุมความเป็นส่วนตัว</p>
              <p className="text-[10px] text-slate-400">จัดการข้อมูลที่ผู้อื่นสามารถมองเห็นได้</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowOnline(!showOnline)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center">
                    {showOnline ? <Eye className="w-4 h-4 text-emerald-400" strokeWidth={1.8} /> : <EyeOff className="w-4 h-4 text-slate-500" strokeWidth={1.8} />}
                  </div>
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
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] hover:bg-white/[0.04] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
                  </div>
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
            <div className="p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">อุปกรณ์ปัจจุบัน</p>
                  <p className="text-[10px] text-slate-400">Desktop Web Browser · Active Now</p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25">
                ใช้งานอยู่
              </span>
            </div>
          </div>

          {/* SAFELY PLACED LOGOUT BUTTON AT THE VERY BOTTOM */}
          <div className="pt-6 border-t border-white/[0.07]">
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
              <span>ออกจากระบบบัญชีนี้ (Log Out)</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 m-4 rounded-2xl glass-emerald-card text-white text-xs font-bold shadow-2xl animate-scale-up text-center">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
