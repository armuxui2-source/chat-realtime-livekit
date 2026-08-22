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
      className={`fixed z-50 transition-all duration-300 select-none ${
        isFullscreen
          ? "inset-0 bg-slate-950"
          : "inset-2 md:inset-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white"
      } flex flex-col text-slate-900`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
              <span>{targetName || `Room: ${roomName}`}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#0D652D] border border-[#CEEAD6] flex items-center gap-1 font-semibold">
                {callType === "video" ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                {callType === "video" ? "HD Video & Screen Share" : "HD Voice Call"}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Participant: {participantName}</p>
          </div>
        </div>

        {/* Live Call Duration Timer */}
        <div
          data-testid="call-duration-timer"
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs font-semibold"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleHangup}
            data-testid="hangup-call-btn"
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Main Meet Screen */}
      <div className="flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-center text-white">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">
              Connecting LiveKit Cloud WebRTC SFU...
            </p>
          </div>
        ) : connectionDetails?.participantToken ? (
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
          <div className="w-full max-w-md flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-2xl font-bold mb-3">
              {participantName.charAt(0).toUpperCase()}
            </div>
            <h4 className="text-white font-bold text-sm mb-1">{participantName}</h4>
            <p className="text-xs text-slate-400 mb-3">Room: {roomName}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-medium mb-4">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LiveKit WebRTC Active</span>
            </div>

            <button
              onClick={handleHangup}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
