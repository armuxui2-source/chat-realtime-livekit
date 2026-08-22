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

  if (!isOpen) return null;

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(`https://ticketapp.io/u/${currentUser.username}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendRequest = (targetUsername: string) => {
    onAddFriend(targetUsername);
    setAddedUsernames((prev) => [...prev, targetUsername]);
  };

  const suggestedUsers = [
    { username: "design_lead", name: "Natasha Romanoff", role: "UI/UX Specialist" },
    { username: "ai_researcher", name: "David Kim", role: "LLM Engineer" },
    { username: "cloud_arch", name: "Pattarapon S.", role: "DevOps Architect" },
  ];

  return (
    <div
      data-testid="add-friend-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-md font-prompt select-none animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                เพิ่มเพื่อน & เชื่อมต่อโซเชียล
              </h2>
              <p className="text-[11px] text-slate-400">ค้นหาเพื่อนด้วยชื่อผู้ใช้ หรือ QR Code</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="p-3 bg-slate-50 border-b border-slate-100">
          <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-200/70 text-xs font-medium">
            <button
              onClick={() => setActiveTab("search")}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "search"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>ค้นหา</span>
            </button>

            <button
              onClick={() => setActiveTab("qr")}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "qr"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "requests"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
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
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="ระบุ Username เช่น alex_dev..."
                className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                disabled={!searchUsername.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-[11px] disabled:opacity-40"
              >
                เพิ่มเพื่อน
              </button>
            </form>

            {/* Suggested Connections */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>แนะนำสำหรับคุณ</span>
              </p>

              {suggestedUsers.map((user) => {
                const isAdded = addedUsernames.includes(user.username);
                return (
                  <div
                    key={user.username}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                          user.username
                        )} flex items-center justify-center text-white text-xs font-bold shadow-xs`}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-400">@{user.username} · {user.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendRequest(user.username)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isAdded
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
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
            <div className="w-48 h-48 mx-auto bg-slate-900 rounded-3xl p-4 flex flex-col items-center justify-center shadow-xl border border-slate-800 text-white relative">
              <QrCode className="w-28 h-28 text-white mb-2" strokeWidth={1.5} />
              <p className="text-xs font-bold tracking-tight">@{currentUser.username}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">{currentUser.display_name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                ให้เพื่อนสแกน QR Code นี้เพื่อเพิ่มเพื่อนทันที
              </p>
            </div>

            <button
              onClick={handleCopyProfileLink}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "คัดลอกลิงก์โปรไฟล์แล้ว!" : "คัดลอกลิงก์โปรไฟล์"}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Pending Friend Requests */}
        {activeTab === "requests" && (
          <div className="p-5 space-y-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Somchai PM</p>
                  <p className="text-[11px] text-slate-400">@somchai · ส่งคำขอเมื่อ 1 ชม. ที่แล้ว</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => alert("ยอมรับคำขอเป็นเพื่อนเรียบร้อย")}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
                >
                  ยอมรับ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
