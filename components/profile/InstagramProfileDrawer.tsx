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
  Camera,
  ChevronLeft,
  X,
  User,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface InstagramProfileDrawerProps {
  currentUser: UserProfile;
  bookmarkedCount?: number;
  onClose?: () => void;
  onOpenBookmarks?: () => void;
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
  onUpdateProfile,
  onLogout,
}) => {
  const [view, setView] = useState<"profile" | "edit" | "settings">("profile");

  // Real Edit State
  const [editName, setEditName] = useState(currentUser.display_name);
  const [editBio, setEditBio] = useState(
    currentUser.custom_status || "พร้อมร่วมงานและสื่อสารแบบเรียลไทม์"
  );
  const [editStatus, setEditStatus] = useState<"online" | "busy" | "away" | "offline">(
    currentUser.status === "in_call" ? "busy" : (currentUser.status || "online")
  );

  // Settings State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(true);
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
    triggerToast("บันทึกการตั้งค่าโปรไฟล์เรียบร้อยแล้ว");
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
            {view === "profile" && "โปรไฟล์ผู้ใช้งาน"}
            {view === "edit" && "แก้ไขข้อมูลโปรไฟล์"}
            {view === "settings" && "การตั้งค่าระบบ & แจ้งเตือน"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {view === "profile" ? (
            <button
              onClick={() => setView("settings")}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="การตั้งค่าระบบ"
            >
              <Settings className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setView("profile")}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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
      {/* VIEW 1: CLEAN PROFILE VIEW (REAL SYSTEM DATA ONLY)                        */}
      {/* ========================================================================= */}
      {view === "profile" && (
        <div className="p-5 space-y-5 animate-fade-in">
          {/* User Avatar & Name Center Card */}
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

            {/* Custom Bio / Status Note */}
            <p className="text-xs text-slate-300 mt-3.5 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5 w-full text-center">
              {currentUser.custom_status || "พร้อมร่วมงานและสื่อสารแบบเรียลไทม์"}
            </p>
          </div>

          {/* Action Buttons: Edit Profile & Copy Username */}
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

          {/* System Shortcuts: Bookmarks & Settings */}
          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              เมนูระบบ
            </p>

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
                    <p className="text-[10px] text-slate-400">{bookmarkedCount} รายการที่บันทึก</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            )}

            <button
              onClick={() => setView("settings")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">การแจ้งเตือน & เสียง</p>
                  <p className="text-[10px] text-slate-400">ตั้งค่าเสียงเตือนและ Push Notifications</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Logout Button */}
          <div className="pt-3">
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-2xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ (Log Out)</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: EDIT PROFILE FORM (ACTUAL APP SYSTEM FIELDS)                      */}
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
      {/* VIEW 3: SETTINGS & NOTIFICATIONS                                          */}
      {/* ========================================================================= */}
      {view === "settings" && (
        <div className="p-5 space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/10 space-y-1">
            <p className="text-xs font-bold text-white">การแจ้งเตือนและการทำงาน</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              จัดการเสียงแจ้งเตือนข้อความเข้าและสถานะการติดต่อ
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">เสียงแจ้งเตือน (Sound Alert)</p>
                  <p className="text-[10px] text-slate-400">
                    {soundEnabled ? "เปิดเสียงเตือนเมื่อมีข้อความ" : "ปิดเสียงเตือน"}
                  </p>
                </div>
              </div>
              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  soundEnabled ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    soundEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </button>

            <button
              onClick={() => setNotifEnabled(!notifEnabled)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-white">Push Notifications</p>
                  <p className="text-[10px] text-slate-400">
                    {notifEnabled ? "เปิดรับการแจ้งเตือนบนเดสก์ท็อป" : "ปิดการแจ้งเตือน"}
                  </p>
                </div>
              </div>
              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  notifEnabled ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
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
