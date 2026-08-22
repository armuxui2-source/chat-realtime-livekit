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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-fade-in font-prompt select-none"
    >
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Forward className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">ส่งต่อข้อความ</h2>
              <p className="text-xs text-slate-400">เลือกผู้รับหรือกลุ่มที่ต้องการส่งต่อ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Snippet Card */}
        <div className="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            ข้อความต้นฉบับ:
          </span>
          <p className="line-clamp-2 italic text-slate-700 leading-relaxed">
            {message.content || (message.file_name ? `[ไฟล์] ${message.file_name}` : "[บันทึกเสียง]")}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาผู้ติดต่อหรือกลุ่ม..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
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
                      ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                      : "hover:bg-slate-50 text-slate-700 border border-transparent"
                  }`}
                >
                  <div
                    data-testid={`forward-target-user-${contact.username}`}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarColor(
                        contact.username
                      )} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {contact.display_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{contact.display_name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
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
                      ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                      : "hover:bg-slate-50 text-slate-700 border border-transparent"
                  }`}
                >
                  <div
                    data-testid={`forward-target-channel-${channel.name.toLowerCase()}`}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">#{channel.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              );
            })}
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
              data-testid="confirm-forward-btn"
              disabled={!selectedTarget || isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
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
