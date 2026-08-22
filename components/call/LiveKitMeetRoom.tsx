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
  VideoOff,
  Mic,
  MicOff,
  Share2,
  Volume2,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getAvatarColor } from "@/lib/utils";

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
        isFullscreen
          ? "inset-0 bg-slate-950"
          : "inset-2 md:inset-6 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950"
      } flex flex-col text-white`}
    >
      {/* Top Floating Glass Header (Instagram / Messenger Header Style) */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-tr ${getAvatarColor(
                calleeDisplayName
              )} flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/20`}
            >
              {calleeDisplayName.replace("#", "").charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
          </div>

          <div>
            <h3 className="text-sm md:text-base font-bold text-white leading-tight drop-shadow-sm flex items-center gap-2">
              <span>{calleeDisplayName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                LiveKit WebRTC
              </span>
            </h3>
            {/* Call Duration Timer */}
            <div
              data-testid="call-duration-timer"
              className="flex items-center gap-1.5 text-xs text-white/80 font-mono mt-0.5"
            >
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all active:scale-95"
          title={isFullscreen ? "ย่อหน้าต่าง" : "ขยายเต็มจอ"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Center Video / Calling Screen (IG/Messenger Immersive View) */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
        
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-center z-10">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <p className="text-sm text-slate-300 font-medium">
              กำลังเชื่อมต่อสัญญาณ WebRTC SFU Cloud...
            </p>
          </div>
        ) : connectionDetails?.participantToken ? (
          // Production LiveKit SFU Video Conference
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
          // Instagram / Messenger Calling Screen with Pulse Rings
          <div className="flex flex-col items-center justify-center p-6 text-center z-10">
            {/* Animated Pulse Rings */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute w-44 h-44 rounded-full bg-emerald-500/10 animate-ping opacity-75" />
              <div className="absolute w-36 h-36 rounded-full bg-emerald-500/20 animate-pulse" />
              
              <div
                className={`relative w-28 h-28 rounded-full bg-gradient-to-tr ${getAvatarColor(
                  calleeDisplayName
                )} flex items-center justify-center text-white text-4xl font-extrabold shadow-2xl ring-4 ring-white/30`}
              >
                {calleeDisplayName.replace("#", "").charAt(0).toUpperCase()}
              </div>
            </div>

            <h4 className="text-xl font-extrabold text-white mb-1">{calleeDisplayName}</h4>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 justify-center mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>การสนทนาเสียงคุณภาพสูง (Opus Audio 48kHz)</span>
            </p>
            <p className="text-xs text-slate-400">ห้อง: {roomName}</p>
          </div>
        )}

        {/* Floating Self-Camera PIP Card (มุมขวาบนเหมือน Instagram/FaceTime) */}
        {!loading && (
          <div
            className="absolute top-20 right-4 md:right-6 w-24 sm:w-32 aspect-3/4 rounded-2xl bg-slate-900/90 border border-white/20 shadow-2xl overflow-hidden z-20 flex flex-col items-center justify-center backdrop-blur-md"
            title="กล้องของคุณ (Self View)"
          >
            {isVideoMuted ? (
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr ${getAvatarColor(
                    participantName
                  )} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {participantName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] text-slate-400">ปิดกล้อง</span>
              </div>
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs text-emerald-400">
                <span>Self Camera</span>
              </div>
            )}
            <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white/80">
              คุณ
            </span>
          </div>
        )}
      </div>

      {/* Floating Bottom Control Capsule (Instagram / Messenger / FaceTime Pill Bar) */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center px-4">
        <div className="flex items-center gap-3 md:gap-4 px-5 py-3 rounded-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
          
          {/* Mute Mic Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            data-testid="call-toggle-mic"
            className={`p-3 rounded-full transition-all active:scale-95 ${
              isMuted
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={isMuted ? "เปิดไมค์" : "ปิดไมค์"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video On/Off Toggle */}
          <button
            onClick={() => setIsVideoMuted(!isVideoMuted)}
            data-testid="call-toggle-video"
            className={`p-3 rounded-full transition-all active:scale-95 ${
              isVideoMuted
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title={isVideoMuted ? "เปิดกล้อง" : "ปิดกล้อง"}
          >
            {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Speaker Toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3 rounded-full transition-all active:scale-95 ${
              isSpeakerOn
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
            }`}
            title={isSpeakerOn ? "ลำโพงเปิดอยู่" : "ปิดเสียงลำโพง"}
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Screen Share */}
          <button
            onClick={() => alert("ระบบรองรับการแชร์หน้าจอผ่าน LiveKit Conference")}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
            title="แชร์หน้าจอ"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Hangup Red Circle Button (เหมือนปุ่มสีแดงใน IG/Messenger/FaceTime) */}
          <button
            onClick={handleHangup}
            data-testid="hangup-call-btn"
            className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 transition-all active:scale-90 flex items-center justify-center ml-2"
            title="วางสาย"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
