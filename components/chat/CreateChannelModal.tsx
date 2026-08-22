"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/chat";
import { Hash, Users, Lock, Globe, X, Plus, Check } from "lucide-react";
import { getAvatarColor } from "@/lib/utils";

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: UserProfile[];
  onCreateChannel: (
    name: string,
    description: string,
    isPrivate: boolean,
    memberUsernames: string[]
  ) => Promise<void>;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  availableUsers,
  onCreateChannel,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleUser = (username: string) => {
    setSelectedUsernames((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateChannel(name, description, isPrivate, selectedUsernames);
      setName("");
      setDescription("");
      setSelectedUsernames([]);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="create-channel-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-fade-in font-prompt select-none"
    >
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                สร้างกลุ่มแชนแนลใหม่
              </h2>
              <p className="text-xs text-slate-400">สร้างพื้นที่พูดคุยและประชุมทีม</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Channel Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ชื่อแชนแนล (Channel Name)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                #
              </span>
              <input
                type="text"
                data-testid="channel-name-input"
                value={name}
                onChange={(e) =>
                  setName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                }
                placeholder="general, project-alpha"
                required
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              คำอธิบาย (Description)
            </label>
            <input
              type="text"
              data-testid="channel-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เป้าหมายหรือรายละเอียดของกลุ่ม..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Privacy Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ความเป็นส่วนตัว (Privacy)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="channel-privacy-public"
                onClick={() => setIsPrivate(false)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  !isPrivate
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Globe className="w-4 h-4 text-blue-500" />
                <span>สาธารณะ (Public)</span>
              </button>

              <button
                type="button"
                data-testid="channel-privacy-private"
                onClick={() => setIsPrivate(true)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isPrivate
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Lock className="w-4 h-4 text-amber-500" />
                <span>ส่วนตัว (Private)</span>
              </button>
            </div>
          </div>

          {/* Member Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>เชิญสมาชิกเริ่มต้น ({selectedUsernames.length})</span>
              <span className="text-[10px] text-slate-400">เลือกจากรายชื่อ</span>
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1 p-1 bg-slate-50 border border-slate-200 rounded-xl custom-scrollbar">
              {availableUsers.map((user) => {
                const isSelected = selectedUsernames.includes(user.username);
                return (
                  <button
                    key={user.username}
                    type="button"
                    data-testid={`invite-member-${user.username}`}
                    onClick={() => toggleUser(user.username)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "hover:bg-white text-slate-700"
                    }`}
                  >
                    <div
                      data-testid={`select-member-${user.username}`}
                      className="flex items-center gap-2 min-w-0"
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-tr ${getAvatarColor(
                          user.username
                        )} flex items-center justify-center text-white text-[9px] font-bold`}
                      >
                        {user.display_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{user.display_name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
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
              data-testid="create-channel-confirm-btn"
              disabled={!name.trim() || isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span data-testid="submit-create-channel-btn">{isSubmitting ? "กำลังสร้าง..." : "สร้างแชนแนล"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
