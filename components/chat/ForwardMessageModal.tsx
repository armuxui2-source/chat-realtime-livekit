"use client";

import React, { useState } from "react";
import { UserProfile, Channel, ChatMessage } from "@/types/chat";
import { Forward, X, Search, Users, Hash, Check } from "lucide-react";
import { getAvatarColor } from "@/lib/utils";

interface ForwardMessageModalProps {
  isOpen: boolean;
  message: ChatMessage | null;
  contacts: UserProfile[];
  channels: Channel[];
  currentUser: UserProfile;
  onClose: () => void;
  onForward: (target: UserProfile | Channel, message: ChatMessage) => void;
}

export const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  isOpen,
  message,
  contacts,
  channels,
  currentUser,
  onClose,
  onForward,
}) => {
  const [search, setSearch] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<UserProfile | Channel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !message) return null;

  const filteredContacts = contacts.filter(
    (c) =>
      c.username !== currentUser.username &&
      (c.display_name.toLowerCase().includes(search.toLowerCase()) ||
        c.username.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredChannels = channels.filter(
    (ch) =>
      ch.name.toLowerCase().includes(search.toLowerCase()) ||
      (ch.description && ch.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) return;

    setIsSubmitting(true);
    onForward(selectedTarget, message);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      data-testid="forward-message-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in font-prompt select-none text-white"
    >
      <div className="relative w-full max-w-md bg-[#161A22]/95 border border-white/[0.08] rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-emerald-400 flex items-center justify-center shadow-sm">
              <Forward className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">ส่งต่อข้อความ</h2>
              <p className="text-xs text-slate-400">เลือกผู้รับหรือกลุ่มที่ต้องการส่งต่อ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Snippet Card */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] text-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            ข้อความต้นฉบับ:
          </span>
          <p className="line-clamp-2 italic text-slate-300 leading-relaxed">
            {message.content || (message.file_name ? `[ไฟล์] ${message.file_name}` : "[บันทึกเสียง]")}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาผู้ติดต่อหรือกลุ่ม..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-48 overflow-y-auto space-y-1 p-1 bg-[#0F1216] border border-white/[0.08] rounded-2xl custom-scrollbar">
            {/* Contacts */}
            <p className="text-[10px] font-bold uppercase text-slate-400 px-2 pt-1">
              ผู้ติดต่อ (Contacts)
            </p>
            {filteredContacts.map((contact) => {
              const isSelected =
                selectedTarget &&
                "username" in selectedTarget &&
                selectedTarget.username === contact.username;

              return (
                <button
                  key={contact.username}
                  type="button"
                  data-testid={`forward-target-${contact.username}`}
                  onClick={() => setSelectedTarget(contact)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? "bg-emerald-500/15 text-white font-bold border border-emerald-500/40"
                      : "hover:bg-white/[0.04] text-slate-300 border border-transparent"
                  }`}
                >
                  <div
                    data-testid={`forward-target-user-${contact.username}`}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <div
                      className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                        contact.username
                      )} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {contact.display_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{contact.display_name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}

            {/* Channels */}
            <p className="text-[10px] font-bold uppercase text-slate-400 px-2 pt-2">
              กลุ่มแชนแนล (Channels)
            </p>
            {filteredChannels.map((channel) => {
              const isSelected =
                selectedTarget &&
                "name" in selectedTarget &&
                selectedTarget.id === channel.id;

              return (
                <button
                  key={channel.id}
                  type="button"
                  data-testid={`forward-target-${channel.id}`}
                  onClick={() => setSelectedTarget(channel)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? "bg-emerald-500/15 text-white font-bold border border-emerald-500/40"
                      : "hover:bg-white/[0.04] text-slate-300 border border-transparent"
                  }`}
                >
                  <div
                    data-testid={`forward-target-channel-${channel.name.toLowerCase()}`}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <div className="w-7 h-7 rounded-xl bg-white/[0.06] flex items-center justify-center text-emerald-400 border border-white/[0.08]">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">#{channel.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
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
              data-testid="confirm-forward-btn"
              disabled={!selectedTarget || isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl emerald-button-gradient disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Forward className="w-4 h-4" />
              <span>ส่งต่อเดี๋ยวนี้</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
