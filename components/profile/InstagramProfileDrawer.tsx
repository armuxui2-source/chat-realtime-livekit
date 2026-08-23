"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  Settings,
  Edit3,
  Share2,
  Bookmark,
  Bell,
  Lock,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  Grid,
  Heart,
  Radio,
  Sparkles,
  Camera,
  ExternalLink,
  ChevronLeft,
  X,
} from "lucide-react";

interface InstagramProfileDrawerProps {
  currentUser: UserProfile;
  onClose?: () => void;
  onUpdateProfile?: (data: {
    display_name: string;
    status: "online" | "busy" | "away" | "offline";
    customStatus?: string;
  }) => void;
  onLogout: () => void;
}

export const InstagramProfileDrawer: React.FC<InstagramProfileDrawerProps> = ({
  currentUser,
  onClose,
  onUpdateProfile,
  onLogout,
}) => {
  const [view, setView] = useState<"profile" | "edit" | "settings">("profile");
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");

  // Edit form state
  const [editName, setEditName] = useState(currentUser.display_name);
  const [editBio, setEditBio] = useState("✨ Lead Product Designer & WebRTC Specialist\n🚀 Building modern realtime apps");
  const [editWebsite, setEditWebsite] = useState("https://ticketapp.io/@" + currentUser.username);
  const [editStatus, setEditStatus] = useState<"online" | "busy" | "away" | "offline">(
    currentUser.status === "in_call" ? "busy" : (currentUser.status || "online")
  );

  // Settings state
  const [isPrivate, setIsPrivate] = useState(false);
  const [showActiveStatus, setShowActiveStatus] = useState(true);
  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    triggerToast("บันทึกการแก้ไขโปรไฟล์เรียบร้อยแล้ว");
    setView("profile");
  };

  const highlights = [
    { id: "h1", name: "🚀 Launch", gradient: "from-blue-600 to-indigo-800" },
    { id: "h2", name: "🎨 UI Design", gradient: "from-emerald-600 to-teal-800" },
    { id: "h3", name: "☕ Life", gradient: "from-amber-600 to-orange-800" },
    { id: "h4", name: "💻 WebRTC", gradient: "from-purple-600 to-pink-800" },
  ];

  return (
    <div
      data-testid="instagram-profile-drawer"
      className="w-full h-full bg-[#0B0D11] text-white flex flex-col font-prompt select-none overflow-y-auto custom-scrollbar"
    >
      {/* Top Header Bar */}
      <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#12161F]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {view !== "profile" && (
            <button
              onClick={() => setView("profile")}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm font-bold text-white tracking-tight">
            {view === "profile" && `@${currentUser.username}`}
            {view === "edit" && "แก้ไขโปรไฟล์ (Edit Profile)"}
            {view === "settings" && "การตั้งค่าและความเป็นส่วนตัว"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {view === "profile" ? (
            <button
              onClick={() => setView("settings")}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="การตั้งค่า"
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
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: INSTAGRAM-STYLE PROFILE FEED & STATS                             */}
      {/* ========================================================================= */}
      {view === "profile" && (
        <div className="p-4 sm:p-5 space-y-5 animate-fade-in">
          {/* Header Row: Avatar + Stats */}
          <div className="flex items-center justify-between gap-4">
            {/* Story Gradient Ring Avatar */}
            <div className="relative group cursor-pointer shrink-0">
              <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg">
                <div className="p-[2px] rounded-full bg-[#0B0D11]">
                  <div
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr ${getAvatarColor(
                      currentUser.username
                    )} flex items-center justify-center text-white text-xl sm:text-2xl font-black`}
                  >
                    {currentUser.display_name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setView("edit")}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-600 text-white border-2 border-[#0B0D11] shadow-md hover:bg-emerald-500 transition-colors"
                title="เปลี่ยนรูปโปรไฟล์"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stats Row (Instagram Posts / Followers / Following) */}
            <div className="flex-1 flex items-center justify-around text-center">
              <div>
                <span className="block text-sm sm:text-base font-black text-white">24</span>
                <span className="text-[11px] text-slate-400 font-medium">โพสต์</span>
              </div>
              <div>
                <span className="block text-sm sm:text-base font-black text-white">1,480</span>
                <span className="text-[11px] text-slate-400 font-medium">ผู้ติดตาม</span>
              </div>
              <div>
                <span className="block text-sm sm:text-base font-black text-white">392</span>
                <span className="text-[11px] text-slate-400 font-medium">กำลังติดตาม</span>
              </div>
            </div>
          </div>

          {/* User Bio & Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white leading-tight">
                {currentUser.display_name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                {currentUser.status || "online"}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Product Designer & Tech Lead</p>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line pt-1">
              {editBio}
            </p>
            <a
              href={editWebsite}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 pt-1 font-mono"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{editWebsite.replace("https://", "")}</span>
            </a>
          </div>

          {/* Action Buttons (Edit Profile / Share Profile) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setView("edit")}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>แก้ไขโปรไฟล์</span>
            </button>
            <button
              onClick={() => triggerToast("คัดลอกลิงก์โปรไฟล์แล้ว!")}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>แชร์โปรไฟล์</span>
            </button>
          </div>

          {/* Story Highlights (Instagram Highlights Tray) */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              สตอรี่ไฮไลท์ (Highlights)
            </p>
            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1">
              {highlights.map((hl) => (
                <div key={hl.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                  <div className="p-[2px] rounded-full border border-white/20 group-hover:border-emerald-500 transition-colors">
                    <div
                      className={`w-13 h-13 rounded-full bg-gradient-to-tr ${hl.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                    >
                      {hl.name.split(" ")[0]}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[58px]">
                    {hl.name.split(" ")[1] || hl.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Tab Navigation (Posts / Saved / Tagged) */}
          <div className="pt-3 border-t border-white/10">
            <div className="grid grid-cols-3 text-center">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  activeTab === "posts"
                    ? "border-white text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>โพสต์</span>
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  activeTab === "saved"
                    ? "border-white text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>บันทึกไว้</span>
              </button>
              <button
                onClick={() => setActiveTab("tagged")}
                className={`py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  activeTab === "tagged"
                    ? "border-white text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>ถูกใจ</span>
              </button>
            </div>

            {/* Media Grid Placeholder (Instagram 3x3 Grid) */}
            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: INSTAGRAM EDIT PROFILE FORM                                       */}
      {/* ========================================================================= */}
      {view === "edit" && (
        <form onSubmit={handleSaveProfile} className="p-5 space-y-4 animate-fade-in">
          {/* Avatar Change */}
          <div className="flex flex-col items-center pb-2">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-tr ${getAvatarColor(
                currentUser.username
              )} flex items-center justify-center text-white text-2xl font-black shadow-lg ring-2 ring-white/20 mb-2`}
            >
              {currentUser.display_name.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              เปลี่ยนรูปโปรไฟล์
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              ชื่อ (Name)
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12161F] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              ชื่อผู้ใช้ (Username)
            </label>
            <input
              type="text"
              value={currentUser.username}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              ประวัติ (Bio)
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12161F] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              ลิงก์ (Links)
            </label>
            <input
              type="url"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12161F] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">
              สถานะการทำงาน (Status)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "online", title: "ออนไลน์", color: "bg-emerald-500" },
                { id: "busy", title: "กำลังยุ่ง", color: "bg-rose-500" },
                { id: "away", title: "ไม่อยู่", color: "bg-amber-500" },
                { id: "offline", title: "ออฟไลน์", color: "bg-slate-400" },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setEditStatus(st.id as "online" | "busy" | "away" | "offline")}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    editStatus === st.id
                      ? "bg-emerald-600/20 border-emerald-500 text-white font-bold"
                      : "bg-[#12161F] border-white/10 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${st.color}`} />
                    <span>{st.title}</span>
                  </div>
                  {editStatus === st.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกการแก้ไขโปรไฟล์</span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: INSTAGRAM SETTINGS & PRIVACY CENTER                               */}
      {/* ========================================================================= */}
      {view === "settings" && (
        <div className="p-5 space-y-4 animate-fade-in">
          {/* Account Center Banner */}
          <div className="p-4 rounded-2xl bg-[#12161F] border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              ศูนย์บัญชี Ticketapp
            </span>
            <p className="text-xs font-bold text-white">จัดการการตั้งค่าบัญชีของคุณ</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              รหัสผ่าน, ความปลอดภัย, ข้อมูลส่วนตัว และการตั้งค่าการแจ้งเตือน
            </p>
          </div>

          {/* Settings Section: How you use Ticketapp */}
          <div className="space-y-1 pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              การใช้งานของคุณ
            </p>

            <button
              onClick={() => setNotificationsMuted(!notificationsMuted)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#12161F] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">การแจ้งเตือน (Notifications)</p>
                  <p className="text-[10px] text-slate-400">
                    {notificationsMuted ? "ปิดเสียงเตือนทั้งหมด" : "เปิดใช้งานตามปกติ"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#12161F] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-white">ความเป็นส่วนตัวของบัญชี</p>
                  <p className="text-[10px] text-slate-400">
                    {isPrivate ? "บัญชีส่วนตัว (Private)" : "บัญชีสาธารณะ (Public)"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => setShowActiveStatus(!showActiveStatus)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#12161F] border border-white/10 hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-white">สถานะออนไลน์ (Active Status)</p>
                  <p className="text-[10px] text-slate-400">
                    {showActiveStatus ? "แสดงสถานะเปิดใช้งาน" : "ซ่อนสถานะ"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ (Log Out)</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 m-4 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg animate-scale-up text-center">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
