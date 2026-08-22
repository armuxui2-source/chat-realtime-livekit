"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  User,
  X,
  Check,
  ChevronRight,
  ShieldCheck,
  Bell,
  Sparkles,
  ArrowLeft,
  Activity,
  Edit3,
  CheckCircle,
} from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onUpdateProfile: (data: {
    display_name: string;
    status: "online" | "busy" | "away" | "offline";
    customStatus?: string;
  }) => void;
}

type ActiveDrawerType = "details" | "status" | "notifications" | "security" | null;

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdateProfile,
}) => {
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawerType>(null);
  const [displayName, setDisplayName] = useState(currentUser.display_name);
  const [status, setStatus] = useState<"online" | "busy" | "away" | "offline">(
    currentUser.status === "in_call" ? "busy" : (currentUser.status || "online")
  );
  const [customBio, setCustomBio] = useState("Graphics Designer / Full-Stack Engineer");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotif, setDesktopNotif] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    onUpdateProfile({
      display_name: displayName.trim(),
      status,
      customStatus: customBio.trim(),
    });
    setActiveDrawer(null);
    triggerToast("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
  };

  const handleSaveStatus = (newStatus: "online" | "busy" | "away" | "offline") => {
    setStatus(newStatus);
    onUpdateProfile({
      display_name: displayName.trim(),
      status: newStatus,
      customStatus: customBio.trim(),
    });
    setActiveDrawer(null);
    triggerToast(`อัปเดตสถานะเป็น ${getStatusLabel(newStatus)} สำเร็จ`);
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case "busy":
        return "กำลังยุ่ง (Do Not Disturb)";
      case "away":
        return "ไม่อยู่ชั่วคราว (Away)";
      case "offline":
        return "ออฟไลน์ (Invisible)";
      default:
        return "ออนไลน์ (Active Now)";
    }
  };

  const getStatusDot = (s: string) => {
    switch (s) {
      case "busy":
        return "bg-rose-500";
      case "away":
        return "bg-amber-500";
      case "offline":
        return "bg-slate-300";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <div
      data-testid="edit-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/40 backdrop-blur-md font-prompt select-none animate-fade-in"
    >
      {/* Main Card Hub Modal Container */}
      <div className="relative w-full max-w-2xl h-[90vh] max-h-[720px] bg-[#F8F9FA] rounded-3xl border border-slate-200/80 shadow-2xl flex flex-col overflow-hidden text-slate-900">
        
        {/* Hub Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                ศูนย์การตั้งค่าโปรไฟล์ผู้ใช้
              </h2>
              <p className="text-xs text-slate-400">
                จัดการข้อมูลส่วนตัว สถานะ และสิทธิ์การใช้งาน
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hub Body: Scrollable Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">
          
          {/* Card 0: Main User Profile Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative shrink-0">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${getAvatarColor(
                  currentUser.username
                )} flex items-center justify-center text-white text-2xl font-bold shadow-md`}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(
                  status
                )}`}
              />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                    {displayName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">@{currentUser.username}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] text-[#0D652D] border border-[#CEEAD6] text-xs font-semibold self-center sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pro Member</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {customBio}
              </p>
            </div>
          </div>

          {/* Cards Section Title */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              หมวดหมู่การตั้งค่า (คลิกเพื่อแก้ไข)
            </p>
          </div>

          {/* Grid of Interactive Setting Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Card 1: ข้อมูลส่วนตัว (Personal Details) */}
            <div
              onClick={() => setActiveDrawer("details")}
              data-testid="card-edit-details"
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-400 shadow-xs cursor-pointer transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    แก้ไขชื่อ & ข้อมูลผู้ใช้
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">ชื่อแสดง, ประวัติส่วนตัว</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Card 2: สถานะการทำงาน (Status) */}
            <div
              onClick={() => setActiveDrawer("status")}
              data-testid="card-edit-status"
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-400 shadow-xs cursor-pointer transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    สถานะการทำงาน (Status)
                  </h4>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    {getStatusLabel(status).split(" ")[0]}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Card 3: การแจ้งเตือน & เสียง (Notifications) */}
            <div
              onClick={() => setActiveDrawer("notifications")}
              data-testid="card-edit-notifications"
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-400 shadow-xs cursor-pointer transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    การแจ้งเตือน & เสียงเตือน
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Push Notif, เสียงข้อความเข้า</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Card 4: ความปลอดภัย & เซิร์ฟเวอร์ (Security) */}
            <div
              onClick={() => setActiveDrawer("security")}
              data-testid="card-edit-security"
              className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-400 shadow-xs cursor-pointer transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    ความปลอดภัย & LiveKit
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">WebRTC Cloud, เข้ารหัสสนทนา</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE-OVER DRAWER (สไลด์ออกมาเมื่อกดการ์ด)                                  */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 bg-white z-20 flex flex-col transition-transform duration-300 ease-out ${
            activeDrawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
            <button
              onClick={() => setActiveDrawer(null)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded-xl hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับไปหน้าการ์ด</span>
            </button>
            <h3 className="text-sm font-bold text-slate-900">
              {activeDrawer === "details" && "แก้ไขข้อมูลส่วนตัว"}
              {activeDrawer === "status" && "เลือกสถานะการทำงาน"}
              {activeDrawer === "notifications" && "ตั้งค่าการแจ้งเตือน"}
              {activeDrawer === "security" && "ความปลอดภัยและระบบเชื่อมต่อ"}
            </h3>
            <button
              onClick={() => setActiveDrawer(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content Views */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            
            {/* View 1: Edit Details Form */}
            {activeDrawer === "details" && (
              <form onSubmit={handleSaveDetails} className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    ชื่อที่ใช้แสดง (Display Name)
                  </label>
                  <input
                    type="text"
                    data-testid="input-edit-displayname"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder="ระบุชื่อของคุณ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    ประวัติหรือตำแหน่งหน้าที่ (Bio / Role)
                  </label>
                  <textarea
                    value={customBio}
                    onChange={(e) => setCustomBio(e.target.value)}
                    rows={3}
                    placeholder="เช่น Graphic Designer / Lead Engineer..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  data-testid="save-profile-details-btn"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </button>
              </form>
            )}

            {/* View 2: Status Selection */}
            {activeDrawer === "status" && (
              <div className="space-y-2.5 max-w-md mx-auto">
                {[
                  { id: "online", title: "ออนไลน์ (Online)", desc: "พร้อมรับสายและข้อความสนทนา", color: "bg-emerald-500" },
                  { id: "busy", title: "กำลังยุ่ง (Do Not Disturb)", desc: "ปิดเสียงแจ้งเตือนชั่วคราว", color: "bg-rose-500" },
                  { id: "away", title: "ไม่อยู่ชั่วคราว (Away)", desc: "ออกไปทำธุระ จะกลับมาเร็วๆ นี้", color: "bg-amber-500" },
                  { id: "offline", title: "ออฟไลน์ (Invisible)", desc: "ซ่อนสถานะการออนไลน์", color: "bg-slate-400" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSaveStatus(item.id as "online" | "busy" | "away" | "offline")}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      status === item.id
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${item.color}`} />
                      <div>
                        <p className="text-xs font-bold">{item.title}</p>
                        <p className={`text-[11px] ${status === item.id ? "text-slate-300" : "text-slate-400"}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    {status === item.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
            )}

            {/* View 3: Notifications Settings */}
            {activeDrawer === "notifications" && (
              <div className="space-y-3.5 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">เสียงแจ้งเตือนข้อความเข้า</p>
                    <p className="text-[11px] text-slate-400">เล่นเสียงแจ้งเตือนเมื่อมีแชทใหม่</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      triggerToast(`เปลี่ยนสถานะเสียงเตือนเป็น ${!soundEnabled ? "เปิด" : "ปิด"}`);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      soundEnabled ? "bg-slate-900" : "bg-slate-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">การแจ้งเตือนบนหน้าจอ (Push Notification)</p>
                    <p className="text-[11px] text-slate-400">แสดงข้อความแจ้งเตือนที่มุมจอระบบ</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDesktopNotif(!desktopNotif);
                      triggerToast(`เปลี่ยนสถานะการแจ้งเตือนหน้าจอเป็น ${!desktopNotif ? "เปิด" : "ปิด"}`);
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      desktopNotif ? "bg-slate-900" : "bg-slate-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      desktopNotif ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* View 4: Security & LiveKit */}
            {activeDrawer === "security" && (
              <div className="space-y-3.5 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">LiveKit Cloud WebRTC SFU</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                      การโทรและวิดีโอคอลทั้งหมดเชื่อมต่อไปยังเซิร์ฟเวอร์คลาวด์ พร้อมระบบเข้ารหัสข้อมูลเสียงและภาพแบบ End-to-End
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-900 mb-1">สถานะฐานข้อมูล Supabase</p>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Realtime Publication Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Action Feedback Toast */}
        {showToast && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-medium shadow-2xl flex items-center gap-2 animate-scale-up">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
