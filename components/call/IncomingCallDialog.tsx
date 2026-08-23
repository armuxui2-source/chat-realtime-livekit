"use client";

import React from "react";
import { Phone, Video, PhoneOff, User } from "lucide-react";
import { CallSignalPayload } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";

interface IncomingCallDialogProps {
  incomingCall: CallSignalPayload | null;
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallDialog: React.FC<IncomingCallDialogProps> = ({
  incomingCall,
  onAccept,
  onReject,
}) => {
  if (!incomingCall) return null;

  const isVideo = incomingCall.callType === "video";
  const avatarGradient = getAvatarColor(incomingCall.caller.username);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in font-prompt select-none text-white">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.08] bg-[#161A22]/95 p-8 shadow-2xl backdrop-blur-2xl text-center">
        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-pulse">
          {isVideo ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
          <span>สายเรียกเข้า ({isVideo ? "วิดีโอคอล" : "โทรเสียง"})</span>
        </div>

        {/* Caller Avatar with Pulsing Rings */}
        <div className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
          <div className="absolute -inset-2 rounded-full border border-emerald-400/40 animate-pulse" />
          <div
            className={`relative w-24 h-24 rounded-2xl bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-white text-3xl font-black shadow-lg ring-2 ring-emerald-500/40`}
          >
            {incomingCall.caller.display_name.charAt(0).toUpperCase() || <User className="w-10 h-10" />}
          </div>
        </div>

        {/* Caller Info */}
        <h3 className="text-xl font-bold text-white mb-1">
          {incomingCall.caller.display_name}
        </h3>
        <p className="text-xs text-slate-400 mb-8 font-mono">
          @{incomingCall.caller.username} กำลังโทรหาคุณ...
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-8">
          {/* Reject */}
          <button
            onClick={onReject}
            className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-md">
              <PhoneOff className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover:text-rose-400">ปฏิเสธ</span>
          </button>

          {/* Accept */}
          <button
            onClick={onAccept}
            className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="w-16 h-16 rounded-full emerald-button-gradient flex items-center justify-center text-white transition-all shadow-lg animate-bounce">
              {isVideo ? <Video className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
            </div>
            <span className="text-xs font-bold text-emerald-400">รับสาย</span>
          </button>
        </div>
      </div>
    </div>
  );
};
