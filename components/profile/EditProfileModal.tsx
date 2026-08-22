"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import { User, X, Check, Smile, Circle } from "lucide-react";

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

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdateProfile,
}) => {
  const [displayName, setDisplayName] = useState(currentUser.display_name);
  const [status, setStatus] = useState<"online" | "busy" | "away" | "offline">(
    currentUser.status === "in_call" ? "busy" : (currentUser.status || "online")
  );
  const [customStatus, setCustomStatus] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    onUpdateProfile({
      display_name: displayName.trim(),
      status,
      customStatus: customStatus.trim(),
    });
    onClose();
  };

  const statusOptions: {
    id: "online" | "busy" | "away" | "offline";
    label: string;
    color: string;
  }[] = [
    { id: "online", label: "ออนไลน์ (Online)", color: "bg-emerald-500" },
    { id: "busy", label: "กำลังยุ่ง (Do Not Disturb)", color: "bg-rose-500" },
    { id: "away", label: "ไม่อยู่ชั่วคราว (Away)", color: "bg-amber-500" },
    { id: "offline", label: "ออฟไลน์ (Invisible)", color: "bg-slate-400" },
  ];

  return (
    <div
      data-testid="edit-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-fade-in font-prompt select-none"
    >
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                ตั้งค่าโปรไฟล์ & สถานะ
              </h2>
              <p className="text-xs text-slate-400">แก้ไขข้อมูลและสถานะการทำงาน</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar Display */}
        <div className="flex items-center gap-4 my-5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-tr ${getAvatarColor(
              currentUser.username
            )} flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0`}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-400">@{currentUser.username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ชื่อที่แสดง (Display Name)
            </label>
            <input
              type="text"
              data-testid="profile-display-name-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              สถานะการใช้งาน (Presence Status)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  data-testid={`status-option-${opt.id}`}
                  onClick={() => setStatus(opt.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    status === opt.id
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Status Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ข้อความสถานะกำหนดเอง (Custom Status)
            </label>
            <div className="relative">
              <input
                type="text"
                data-testid="profile-custom-status-input"
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value)}
                placeholder="เช่น กำลังประชุม, เดินทางไปพบลูกค้า..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              data-testid="save-profile-btn"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกการเปลี่ยนแปลง</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
