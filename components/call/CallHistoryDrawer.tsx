"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, CallLog } from "@/types/chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  X,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video,
  Clock,
} from "lucide-react";
import { formatMessageTime, getAvatarColor } from "@/lib/utils";

interface CallHistoryDrawerProps {
  isOpen: boolean;
  currentUser: UserProfile;
  contacts: UserProfile[];
  onClose: () => void;
  onRedial: (target: UserProfile, type: "audio" | "video") => void;
}

export const CallHistoryDrawer: React.FC<CallHistoryDrawerProps> = ({
  isOpen,
  currentUser,
  contacts,
  onClose,
  onRedial,
}) => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [filter, setFilter] = useState<"all" | "missed">("all");

  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const fetchLogs = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from("call_logs")
            .select("*")
            .or(`caller_id.eq.${currentUser.username},receiver_id.eq.${currentUser.username}`)
            .order("created_at", { ascending: false })
            .limit(30);

          if (data && data.length > 0) {
            setCallLogs(data as CallLog[]);
            return;
          }
        } catch (e) {
          console.warn("Fetch call logs error:", e);
        }
      }

      // Default Mock Logs for smooth offline testing
      const mockLogs: CallLog[] = [
        {
          id: "call-1",
          caller_id: "alex",
          receiver_id: currentUser.username,
          call_type: "video",
          status: "completed",
          duration_seconds: 245,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "call-2",
          caller_id: "somchai",
          receiver_id: currentUser.username,
          call_type: "audio",
          status: "missed",
          duration_seconds: 0,
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "call-3",
          caller_id: currentUser.username,
          receiver_id: "alex",
          call_type: "video",
          status: "completed",
          duration_seconds: 512,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setCallLogs(mockLogs);
    };

    fetchLogs();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const filteredLogs = callLogs.filter((log) => {
    if (filter === "missed") return log.status === "missed";
    return true;
  });

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return "ไม่ได้สนทนา";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} นาที ${secs} วินาที`;
  };

  return (
    <div
      data-testid="call-history-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white/95 border-l border-slate-200 backdrop-blur-2xl p-6 shadow-2xl flex flex-col font-prompt select-none animate-slide-left text-slate-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">ประวัติการโทร (Call History)</h2>
            <p className="text-xs text-slate-400">บันทึกสายโทรเสียงและวิดีโอคอล</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-2 p-1 my-4 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-medium shrink-0">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`py-1.5 rounded-lg transition-all ${
            filter === "all"
              ? "bg-white text-slate-800 shadow-sm font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ทั้งหมด ({callLogs.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("missed")}
          className={`py-1.5 rounded-lg transition-all ${
            filter === "missed"
              ? "bg-white text-rose-600 shadow-sm font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          สายที่ไม่ได้รับ
        </button>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
        {filteredLogs.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
            <Phone className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs">ไม่มีประวัติการโทร</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isOutgoing = log.caller_id === currentUser.username;
            const otherUsername = isOutgoing ? log.receiver_id : log.caller_id;
            const otherUser = contacts.find((c) => c.username === otherUsername) || {
              id: otherUsername,
              username: otherUsername,
              display_name: otherUsername,
              status: "online" as const,
            };

            return (
              <div
                key={log.id}
                data-testid={`call-log-item-${log.id}`}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 transition-all flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-tr ${getAvatarColor(
                      otherUsername
                    )} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                  >
                    {otherUser.display_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {otherUser.display_name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      {log.status === "missed" ? (
                        <span className="flex items-center gap-1 text-rose-500 font-medium">
                          <PhoneMissed className="w-3 h-3" />
                          <span>สายไม่ได้รับ</span>
                        </span>
                      ) : isOutgoing ? (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <PhoneOutgoing className="w-3 h-3" />
                          <span>โทรออก</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <PhoneIncoming className="w-3 h-3" />
                          <span>โทรเข้า</span>
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatMessageTime(log.created_at)}</span>
                    </div>
                    {log.duration_seconds > 0 && (
                      <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatDuration(log.duration_seconds)}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Redial Buttons */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRedial(otherUser, "audio");
                    }}
                    data-testid={`redial-audio-${log.id}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors shadow-sm"
                    title="โทรเสียง"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRedial(otherUser, "video");
                    }}
                    data-testid={`redial-video-${log.id}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors shadow-sm"
                    title="วิดีโอคอล"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
