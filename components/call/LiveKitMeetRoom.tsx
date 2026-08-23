"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ConnectionStateToast,
} from "@livekit/components-react";
import "@livekit/components-styles";

export interface ConnectionDetails {
  serverUrl: string;
  roomName: string;
  participantToken: string;
  participantName: string;
}
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Clock,
  Loader2,
  Radio,
  ExternalLink,
} from "lucide-react";
import { getAvatarColor } from "@/lib/utils";
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
  const [isPiP, setIsPiP] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(callType === "audio");
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calleeDisplayName = targetName || `ห้อง: ${roomName}`;

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
      className={`fixed z-50 transition-all duration-300 select-none font-prompt ${
        isPiP
          ? "bottom-4 right-4 w-72 sm:w-80 h-48 rounded-2xl shadow-2xl border border-emerald-500/40 bg-[#0B0D11] overflow-hidden"
          : isFullscreen
          ? "inset-0 bg-[#0B0D11]"
          : "inset-2 md:inset-6 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0B0D11]"
      } flex flex-col text-white`}
    >
      {/* Top Floating Glass Header */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-5 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr ${getAvatarColor(
                calleeDisplayName
              )} flex items-center justify-center text-white font-bold text-xs shadow-md ring-2 ring-white/20`}
            >
              {calleeDisplayName.replace("#", "").charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0B0D11] animate-pulse" />
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-sm flex items-center gap-2">
              <span className="truncate max-w-[120px] sm:max-w-none">{calleeDisplayName}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                LiveKit
              </span>
            </h3>
            {/* Call Duration Timer */}
            <div
              data-testid="call-duration-timer"
              className="flex items-center gap-1 text-[11px] text-white/80 font-mono mt-0.5"
            >
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Header Action Toggles (PiP / Fullscreen / Hangup) */}
        <div className="flex items-center gap-1.5">
          {/* PiP Minimize Toggle */}
          <button
            onClick={() => setIsPiP(!isPiP)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all"
            title={isPiP ? "ขยายเต็มหน้าจอ" : "ย่อเป็น PiP หน้าต่างลอย"}
          >
            {isPiP ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          {!isPiP && (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all"
              title={isFullscreen ? "ขนาดปกติ" : "เต็มจอ"}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {isPiP && (
            <button
              onClick={handleHangup}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md"
              title="วางสาย"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Center Video / Calling Screen */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#0B0D11]">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-center z-10 p-4">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-300 font-medium">
              กำลังเชื่อมต่อสัญญาณ WebRTC SFU Cloud...
            </p>
          </div>
        ) : connectionDetails?.participantToken ? (
          <LiveKitRoom
            video={!isVideoMuted}
            audio={!isMuted}
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
          <div className="flex flex-col items-center justify-center gap-4 z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-pulse absolute -inset-4" />
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-tr ${getAvatarColor(
                  calleeDisplayName
                )} flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-white/10 relative z-10`}
              >
                {calleeDisplayName.replace("#", "").charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-lg font-bold text-white">{calleeDisplayName}</h2>
              <p className="text-xs text-emerald-400 font-medium mt-1">กำลังโทรออก LiveKit Audio...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Capsule (Hidden in PiP mode) */}
      {!isPiP && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center px-4">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#12161F]/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isMuted
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={isMuted ? "เปิดไมค์" : "ปิดไมค์"}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoMuted(!isVideoMuted)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isVideoMuted
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={isVideoMuted ? "เปิดกล้อง" : "ปิดกล้อง"}
            >
              {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                !isSpeakerOn
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={isSpeakerOn ? "ปิดเสียงลำโพง" : "เปิดลำโพง"}
            >
              {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Hangup Red Circle Button */}
            <button
              onClick={handleHangup}
              data-testid="hangup-call-btn"
              className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all active:scale-95 ml-1"
              title="วางสาย"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
