"use client";

import React, { useState, useEffect, useRef } from "react";
import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ConnectionStateToast,
} from "@livekit/components-react";
import { ConnectionDetails } from "@/app/api/connection-details/route";
import {
  PhoneOff,
  Maximize2,
  Minimize2,
  Video,
  Phone,
  AlertCircle,
  Loader2,
  Clock,
  Radio,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface LiveKitMeetRoomProps {
  roomName: string;
  participantName: string;
  targetName?: string;
  callType: "audio" | "video";
  onLeave: () => void;
}

export const LiveKitMeetRoom: React.FC<LiveKitMeetRoomProps> = ({
  roomName,
  participantName,
  targetName,
  callType,
  onLeave,
}) => {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Call duration timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchConnectionDetails = async () => {
      try {
        const params = new URLSearchParams({
          roomName,
          participantName,
        });
        const res = await fetch(`/api/connection-details?${params.toString()}`);
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.participantToken) {
          setConnectionDetails(data);
        } else {
          setError(data.error || "Failed to get LiveKit token");
        }
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : "Network error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConnectionDetails();

    return () => {
      isMounted = false;
    };
  }, [roomName, participantName]);

  const handleHangup = async () => {
    // Save to call_logs in background
    if (isSupabaseConfigured) {
      try {
        await supabase.from("call_logs").insert({
          caller_id: participantName,
          receiver_id: targetName || roomName,
          call_type: callType,
          status: "completed",
          duration_seconds: elapsedSeconds,
        });
      } catch (e) {
        console.warn("Save call log error:", e);
      }
    }
    onLeave();
  };

  return (
    <div
      data-testid="livekit-meeting-container"
      className={`fixed z-50 transition-all duration-300 font-prompt select-none ${
        isFullscreen
          ? "inset-0 bg-slate-900"
          : "inset-2 md:inset-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white/95 backdrop-blur-2xl"
      } flex flex-col text-slate-800`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-slate-800 font-bold text-base flex items-center gap-2">
              <span>{targetName || `ห้อง: ${roomName}`}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1 font-medium">
                {callType === "video" ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                {callType === "video" ? "Video Meet & Screen Share" : "Voice Call"}
              </span>
            </h3>
            <p className="text-xs text-slate-400">ผู้เข้าร่วม: {participantName}</p>
          </div>
        </div>

        {/* Live Call Duration Timer */}
        <div
          data-testid="call-duration-timer"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-emerald-600 font-mono text-xs font-semibold shadow-inner"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isFullscreen ? "ออกจากเต็มจอ" : "เต็มจอ"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleHangup}
            data-testid="hangup-call-btn"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-rose-500/20 transition-all active:scale-95"
          >
            <PhoneOff className="w-4 h-4" />
            <span>วางสาย</span>
          </button>
        </div>
      </div>

      {/* Main Meet Screen */}
      <div className="flex-1 relative overflow-hidden bg-slate-50 flex items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-600 font-medium">
              กำลังเชื่อมต่อห้อง LiveKit Meet & WebRTC SFU...
            </p>
          </div>
        ) : connectionDetails?.participantToken ? (
          // Production Standard LiveKit Meet Room with Screen Sharing
          <LiveKitRoom
            video={callType === "video"}
            audio={true}
            screen={true}
            token={connectionDetails.participantToken}
            serverUrl={connectionDetails.serverUrl}
            data-lk-theme="default"
            onDisconnected={handleHangup}
            className="w-full h-full flex flex-col justify-between"
          >
            <VideoConference />
            <RoomAudioRenderer />
            <ConnectionStateToast />
          </LiveKitRoom>
        ) : (
          // Standalone Hardware & WebRTC Preview Mode
          <div className="w-full max-w-2xl flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-left flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-blue-700 text-sm">
                  พร้อมเชื่อมต่อ LiveKit Cloud หรือ Local LiveKit Server
                </p>
                <p className="text-slate-500">
                  {error || "เพื่อเปิดใช้งาน WebRTC Server ให้ระบุตัวแปรในไฟล์ `.env.local`:"}
                </p>
                <code className="block bg-white p-2.5 rounded-xl border border-slate-200 text-emerald-700 font-mono text-[11px]">
                  LIVEKIT_API_KEY=your_key<br />
                  LIVEKIT_API_SECRET=your_secret<br />
                  NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
                </code>
              </div>
            </div>

            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-white border border-slate-200 flex flex-col items-center justify-center p-6 mb-6 shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/25 mb-4">
                {participantName.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-slate-800 font-bold text-base mb-1">{participantName}</h4>
              <p className="text-xs text-slate-400 mb-2">ห้อง: {roomName}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>WebRTC Screen Sharing & Audio Ready</span>
              </div>
            </div>

            <button
              onClick={handleHangup}
              className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-all active:scale-95 shadow-sm"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
