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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in font-prompt select-none"
    >
      <div className="relative w-full max-w-md bg-[#161A22]/95 border border-white/[0.08] rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-emerald-400 flex items-center justify-center shadow-sm">
              <Hash className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                สร้างกลุ่มแชนแนลใหม่
              </h2>
              <p className="text-xs text-slate-400">สร้างพื้นที่พูดคุยและประชุมทีม</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Channel Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              ชื่อแชนแนล (Channel Name)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
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
                className="w-full pl-8 pr-3.5 py-2.5 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              คำอธิบาย (Description)
            </label>
            <input
              type="text"
              data-testid="channel-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เป้าหมายหรือรายละเอียดของกลุ่ม..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Privacy Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              ความเป็นส่วนตัว (Privacy)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="channel-privacy-public"
                onClick={() => setIsPrivate(false)}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all ${
                  !isPrivate
                    ? "bg-emerald-500/15 border-emerald-500/40 text-white font-bold"
                    : "bg-[#0F1216] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>สาธารณะ (Public)</span>
              </button>

              <button
                type="button"
                data-testid="channel-privacy-private"
                onClick={() => setIsPrivate(true)}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all ${
                  isPrivate
                    ? "bg-emerald-500/15 border-emerald-500/40 text-white font-bold"
                    : "bg-[#0F1216] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>ส่วนตัว (Private)</span>
              </button>
            </div>
          </div>

          {/* Member Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>เชิญสมาชิกเริ่มต้น ({selectedUsernames.length})</span>
              <span className="text-[10px] text-slate-400">เลือกจากรายชื่อ</span>
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1 p-1 bg-[#0F1216] border border-white/[0.08] rounded-2xl custom-scrollbar">
              {availableUsers.map((user) => {
                const isSelected = selectedUsernames.includes(user.username);
                return (
                  <button
                    key={user.username}
                    type="button"
                    data-testid={`invite-member-${user.username}`}
                    onClick={() => toggleUser(user.username)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                      isSelected
                        ? "bg-white/[0.08] text-white font-bold"
                        : "hover:bg-white/[0.04] text-slate-300"
                    }`}
                  >
                    <div
                      data-testid={`select-member-${user.username}`}
                      className="flex items-center gap-2.5 min-w-0"
                    >
                      <div
                        className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${getAvatarColor(
                          user.username
                        )} flex items-center justify-center text-white text-[9px] font-bold`}
                      >
                        {user.display_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{user.display_name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.07]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-400 hover:text-white transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              data-testid="create-channel-confirm-btn"
              disabled={!name.trim() || isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl emerald-button-gradient disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all active:scale-95"
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
