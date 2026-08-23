"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";
import {
  UserPlus,
  Search,
  QrCode,
  Users,
  X,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from "lucide-react";

interface AddFriendModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  contacts: UserProfile[];
  onClose: () => void;
  onAddFriend: (username: string) => void;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  currentUser,
  contacts,
  onClose,
  onAddFriend,
}) => {
  const [activeTab, setActiveTab] = useState<"search" | "qr" | "requests">("search");
  const [searchUsername, setSearchUsername] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedUsernames, setAddedUsernames] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyProfileLink = () => {
    const link = `https://ticketapp.io/@${currentUser.username}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    triggerToast("คัดลอกลิงก์โปรไฟล์แล้ว!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendRequest = (targetUsername: string) => {
    onAddFriend(targetUsername);
    setAddedUsernames((prev) => [...prev, targetUsername]);
    triggerToast(`ส่งคำขอเป็นเพื่อนถึง @${targetUsername} เรียบร้อย!`);
  };

  const suggestedUsers = [
    { username: "natasha", name: "Natasha Romanoff", role: "UI/UX Specialist" },
    { username: "david_kim", name: "David Kim", role: "LLM Engineer" },
    { username: "pattarapon", name: "Pattarapon S.", role: "DevOps Architect" },
  ];

  return (
    <div
      data-testid="add-friend-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-prompt select-none animate-fade-in text-white"
    >
      <div className="relative w-full max-w-md bg-[#161A22]/95 rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#0F1216]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-emerald-400 flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                เพิ่มเพื่อน & เชื่อมต่อสมาชิก
              </h2>
              <p className="text-xs text-slate-400">ค้นหาเพื่อนด้วย Username หรือ QR Code</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="p-3 bg-[#0F1216]/50 border-b border-white/[0.07]">
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-xs font-medium">
            <button
              onClick={() => setActiveTab("search")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "search"
                  ? "emerald-button-gradient text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>ค้นหา</span>
            </button>

            <button
              onClick={() => setActiveTab("qr")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "qr"
                  ? "emerald-button-gradient text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "requests"
                  ? "emerald-button-gradient text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>คำขอ (1)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Search Form & Suggestions */}
        {activeTab === "search" && (
          <div className="p-5 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchUsername.trim()) {
                  handleSendRequest(searchUsername.trim().toLowerCase());
                  setSearchUsername("");
                }
              }}
              className="relative"
            >
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="ระบุ Username เช่น alex_dev..."
                className="w-full pl-9 pr-24 py-2.5 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!searchUsername.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl emerald-button-gradient text-white font-bold text-[11px] disabled:opacity-40 shadow-sm"
              >
                เพิ่มเพื่อน
              </button>
            </form>

            {/* Suggested Connections */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>แนะนำสำหรับคุณ</span>
              </p>

              {suggestedUsers.map((user) => {
                const isAdded = addedUsernames.includes(user.username);
                return (
                  <div
                    key={user.username}
                    className="p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                          user.username
                        )} flex items-center justify-center text-white text-xs font-bold shadow-md`}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400">@{user.username} · {user.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendRequest(user.username)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isAdded
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "emerald-button-gradient text-white shadow-sm active:scale-95"
                      }`}
                    >
                      {isAdded ? "ส่งคำขอแล้ว" : "เพิ่มเพื่อน"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: My Personal QR Code */}
        {activeTab === "qr" && (
          <div className="p-6 text-center space-y-4">
            <div className="w-52 h-52 mx-auto rounded-3xl p-4 flex flex-col items-center justify-center shadow-2xl glass-emerald-card text-white relative">
              <div className="p-3 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-2">
                <QrCode className="w-32 h-32 text-slate-950" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-bold text-emerald-300 font-mono">@{currentUser.username}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{currentUser.display_name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                ให้เพื่อนสแกน QR Code นี้เพื่อเพิ่มเพื่อนและเริ่มแชทได้ทันที
              </p>
            </div>

            <button
              onClick={handleCopyProfileLink}
              className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs border border-white/[0.08] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "คัดลอกลิงก์โปรไฟล์แล้ว!" : "คัดลอกลิงก์โปรไฟล์"}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Pending Friend Requests */}
        {activeTab === "requests" && (
          <div className="p-5 space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#0F1216] border border-white/[0.07] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Somchai PM</p>
                  <p className="text-[11px] text-slate-400">@somchai · ส่งคำขอเมื่อ 1 ชม. ที่แล้ว</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => triggerToast("ยอมรับคำขอเป็นเพื่อนจาก Somchai PM เรียบร้อย")}
                  className="px-3 py-1.5 rounded-xl emerald-button-gradient text-white font-bold text-xs shadow-sm active:scale-95"
                >
                  ยอมรับ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="p-3 m-4 rounded-2xl glass-emerald-card text-white text-xs font-bold shadow-xl animate-scale-up text-center">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
