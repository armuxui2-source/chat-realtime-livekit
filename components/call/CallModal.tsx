"use client";

import React, { useState, useEffect, useRef } from "react";
import "@livekit/components-styles";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
  useTracks,
  ParticipantTile,
  ControlBar,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Maximize2,
  Minimize2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { ActiveCallState } from "@/hooks/useCallSignaling";
import { UserProfile } from "@/types/chat";

interface CallModalProps {
  activeCall: ActiveCallState | null;
  currentUser: UserProfile | null;
  onHangup: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  activeCall,
  currentUser,
  onHangup,
}) => {
  const [token, setToken] = useState<string>("");
  const [wsUrl, setWsUrl] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (!activeCall || !currentUser) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchToken = async () => {
      try {
        const query = new URLSearchParams({
          room: activeCall.roomName,
          username: currentUser.username,
          displayName: currentUser.display_name,
        });

        const res = await fetch(`/api/livekit-token?${query.toString()}`);
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.token) {
          setToken(data.token);
          setWsUrl(data.wsUrl);
          setIsConfigured(data.isConfigured);
        } else {
          setError(data.error || "Failed to fetch LiveKit token");
          setIsConfigured(false);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Network error");
        setIsConfigured(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchToken();

    return () => {
      isMounted = false;
    };
  }, [activeCall, currentUser]);

  if (!activeCall || !currentUser) return null;

  return (
    <div
      data-testid="call-modal"
      className={`fixed z-50 transition-all duration-300 font-prompt select-none ${
        isFullscreen
          ? "inset-0 bg-[#0F1216]"
          : "inset-2 md:inset-8 rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] bg-[#0F1216] backdrop-blur-2xl"
      } flex flex-col text-white`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#161A22] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-white font-bold text-base">
              {activeCall.callType === "video" ? "วิดีโอคอล (Video Call)" : "โทรเสียง (Audio Call)"}
            </h3>
            <p className="text-xs text-slate-400">สนทนากับ {activeCall.partnerDisplayName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? "ออกจากเต็มจอ" : "เต็มจอ"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onHangup}
            data-testid="hangup-btn"
            className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/30 transition-all active:scale-95"
          >
            <PhoneOff className="w-4 h-4" />
            <span>วางสาย</span>
          </button>
        </div>
      </div>

      {/* Main Call View Area */}
      <div className="flex-1 relative overflow-hidden bg-[#0F1216] flex items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin" />
            <p className="text-sm text-slate-300">กำลังเชื่อมต่อสัญญาณเสียงและวิดีโอระดับ HD...</p>
          </div>
        ) : isConfigured && token && wsUrl ? (
          <LiveKitRoom
            video={activeCall.callType === "video"}
            audio={true}
            token={token}
            serverUrl={wsUrl}
            data-lk-theme="default"
            onDisconnected={onHangup}
            className="w-full h-full flex flex-col justify-between"
          >
            <CustomLiveKitConference callType={activeCall.callType} onHangup={onHangup} />
            <RoomAudioRenderer />
          </LiveKitRoom>
        ) : (
          <StandaloneMediaTester
            callType={activeCall.callType}
            partnerName={activeCall.partnerDisplayName}
            onHangup={onHangup}
            errorMessage={error}
          />
        )}
      </div>
    </div>
  );
};

function CustomLiveKitConference({
  callType,
  onHangup,
}: {
  callType: "audio" | "video";
  onHangup: () => void;
}) {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        {tracks.length > 0 ? (
          tracks.map((trackRef) => (
            <div
              key={trackRef.participant.identity + trackRef.source}
              className="relative w-full h-full rounded-2xl overflow-hidden bg-[#161A22] border border-white/[0.08] shadow-md flex items-center justify-center"
            >
              <ParticipantTile trackRef={trackRef} className="w-full h-full object-cover" />
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center mb-3 text-emerald-400 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <p className="font-semibold text-xs">กำลังรอผู้สนทนาเปิดกล้อง/ไมค์...</p>
          </div>
        )}
      </div>

      {/* Built-in LiveKit Control Bar */}
      <div className="flex items-center justify-center py-3 bg-[#161A22]/90 backdrop-blur-md rounded-2xl mx-4 mb-2 border border-white/[0.08] shadow-lg">
        <ControlBar
          controls={{
            camera: callType === "video",
            microphone: true,
            screenShare: true,
            chat: false,
            leave: true,
          }}
          onDeviceError={(err) => console.error("Device error:", err)}
        />
      </div>
    </div>
  );
}

function StandaloneMediaTester({
  callType,
  partnerName,
  onHangup,
  errorMessage,
}: {
  callType: "audio" | "video";
  partnerName: string;
  onHangup: () => void;
  errorMessage: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(callType === "video");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startLocalStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Could not access camera/mic:", err);
      }
    };

    startLocalStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((t) => (t.enabled = !micEnabled));
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCam = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((t) => (t.enabled = !camEnabled));
      setCamEnabled(!camEnabled);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-[#0F1216] rounded-3xl overflow-hidden text-white font-prompt">
      {/* Background / Main Stream (Partner View) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-700 to-slate-800 flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-emerald-500/20">
              {partnerName.charAt(0).toUpperCase()}
            </div>
            {/* Animated Call Pulse Ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400/40 animate-ping" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-white mb-1">{partnerName}</h4>
            <p className="text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {callType === "video" ? "กำลังเชื่อมต่อวิดีโอคอล..." : "กำลังสนทนาสายเสียง..."}
            </p>
          </div>
        </div>

        {/* Floating Self-PIP Camera (Instagram / Messenger Top-Right Corner) */}
        <div
          data-testid="self-camera-pip"
          className="absolute top-2 right-2 w-28 h-40 sm:w-36 sm:h-52 rounded-2xl overflow-hidden bg-[#161A22] border-2 border-white/20 shadow-2xl flex items-center justify-center transition-all hover:scale-105"
        >
          {camEnabled ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 p-2 text-center text-slate-400">
              <VideoOff className="w-6 h-6 text-slate-500" />
              <span className="text-[10px]">กล้องปิดอยู่</span>
            </div>
          )}
          <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-medium text-white">
            คุณ (Self)
          </div>
        </div>
      </div>

      {/* Floating Bottom Control Bar (Instagram / Messenger Circle Buttons) */}
      <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-[#161A22]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl z-10 mb-2">
        {/* Toggle Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          data-testid="toggle-mic-btn"
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
            micEnabled
              ? "bg-white/[0.08] hover:bg-white/[0.15] text-white"
              : "bg-rose-600 text-white"
          }`}
          title={micEnabled ? "ปิดไมค์ (Mute)" : "เปิดไมค์ (Unmute)"}
        >
          {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Toggle Cam Button */}
        <button
          type="button"
          onClick={toggleCam}
          data-testid="toggle-cam-btn"
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
            camEnabled
              ? "bg-white/[0.08] hover:bg-white/[0.15] text-white"
              : "bg-rose-600 text-white"
          }`}
          title={camEnabled ? "ปิดกล้อง (Turn off Video)" : "เปิดกล้อง (Turn on Video)"}
        >
          {camEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Red Hangup Button */}
        <button
          type="button"
          onClick={onHangup}
          data-testid="hangup-call-action-btn"
          className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 transition-all active:scale-90"
          title="วางสาย (End Call)"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
