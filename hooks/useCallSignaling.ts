"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { UserProfile, CallSignalPayload } from "@/types/chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { playNotificationSound } from "@/lib/utils";

export interface ActiveCallState {
  roomName: string;
  callType: "audio" | "video";
  partnerUsername: string;
  partnerDisplayName: string;
  isInitiator: boolean;
}

export function useCallSignaling(currentUser: UserProfile | null) {
  const [incomingCall, setIncomingCall] = useState<CallSignalPayload | null>(null);
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  const ringtoneIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // เริ่มส่งเสียงเรียกเข้าเมื่อมี Incoming Call
  useEffect(() => {
    if (incomingCall) {
      playNotificationSound("incoming_call");
      ringtoneIntervalRef.current = setInterval(() => {
        playNotificationSound("incoming_call");
      }, 3000);
    } else {
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
        ringtoneIntervalRef.current = null;
      }
    }
    return () => {
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
      }
    };
  }, [incomingCall]);

  // ซับสไครบ์ Broadcast Signaling Channel
  useEffect(() => {
    if (!currentUser) return;

    // รองรับ Broadcast Channel ทั้งผ่าน Supabase Realtime หรือ LocalStorage (สำหรับเทส Multi-tab โดยไม่ต่อเน็ต)
    const channelName = `signaling-${currentUser.username}`;
    const broadcastChannel = typeof window !== "undefined" && "BroadcastChannel" in window
      ? new BroadcastChannel("webrtc-call-signaling")
      : null;

    // 1. จัดการข้อความ Signaling จาก Local BroadcastChannel
    const handleBroadcastMessage = (event: MessageEvent) => {
      const payload: CallSignalPayload = event.data;
      if (!payload) return;

      if (payload.receiverUsername === currentUser.username) {
        if (payload.type === "CALL_REQUEST") {
          setIncomingCall(payload);
        } else if (payload.type === "CALL_END" || payload.type === "CALL_REJECT") {
          setIncomingCall(null);
          if (activeCall) {
            playNotificationSound("end_call");
            setActiveCall(null);
            setCallStatus("idle");
          }
        }
      }

      if (payload.type === "CALL_ACCEPT" && payload.caller.username === currentUser.username) {
        setCallStatus("connected");
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener("message", handleBroadcastMessage);
    }

    // 2. ซับสไครบ์ Supabase Realtime Channel
    let supabaseChannel: ReturnType<typeof supabase.channel> | null = null;
    if (isSupabaseConfigured) {
      supabaseChannel = supabase.channel(`user-signaling-${currentUser.username}`);
      supabaseChannel
        .on("broadcast", { event: "call_signal" }, ({ payload }: { payload: CallSignalPayload }) => {
          if (payload.receiverUsername === currentUser.username) {
            if (payload.type === "CALL_REQUEST") {
              setIncomingCall(payload);
            } else if (payload.type === "CALL_END" || payload.type === "CALL_REJECT") {
              setIncomingCall(null);
              if (activeCall) {
                playNotificationSound("end_call");
                setActiveCall(null);
                setCallStatus("idle");
              }
            }
          }

          if (payload.type === "CALL_ACCEPT" && payload.caller.username === currentUser.username) {
            setCallStatus("connected");
          }
        })
        .subscribe();
    }

    return () => {
      if (broadcastChannel) {
        broadcastChannel.removeEventListener("message", handleBroadcastMessage);
        broadcastChannel.close();
      }
      if (supabaseChannel) {
        supabaseChannel.unsubscribe();
      }
    };
  }, [currentUser, activeCall]);

  // ฟังก์ชันส่ง Signal ไปยังปลายทาง
  const sendSignal = useCallback(
    async (payload: CallSignalPayload) => {
      // ส่งผ่าน BroadcastChannel
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("webrtc-call-signaling");
        bc.postMessage(payload);
        bc.close();
      }

      // ส่งผ่าน Supabase Realtime
      if (isSupabaseConfigured) {
        const channel = supabase.channel(`user-signaling-${payload.receiverUsername}`);
        await channel.send({
          type: "broadcast",
          event: "call_signal",
          payload,
        });
      }
    },
    []
  );

  // เริ่มต้นโทรหาคู่สนทนา (Outgoing Call)
  const startCall = useCallback(
    async (targetUser: UserProfile, callType: "audio" | "video") => {
      if (!currentUser) return;

      // สร้างชื่อห้องเฉพาะสำหรับคู่สนทนานี้
      const sortedUsers = [currentUser.username, targetUser.username].sort();
      const roomName = `call-${sortedUsers[0]}-${sortedUsers[1]}-${Date.now().toString(36)}`;

      const payload: CallSignalPayload = {
        type: "CALL_REQUEST",
        roomName,
        caller: currentUser,
        receiverUsername: targetUser.username,
        callType,
        timestamp: Date.now(),
      };

      await sendSignal(payload);

      setActiveCall({
        roomName,
        callType,
        partnerUsername: targetUser.username,
        partnerDisplayName: targetUser.display_name,
        isInitiator: true,
      });
      setCallStatus("calling");
    },
    [currentUser, sendSignal]
  );

  // รับสาย (Accept Incoming Call)
  const acceptCall = useCallback(async () => {
    if (!incomingCall || !currentUser) return;

    const payload: CallSignalPayload = {
      type: "CALL_ACCEPT",
      roomName: incomingCall.roomName,
      caller: incomingCall.caller,
      receiverUsername: currentUser.username,
      callType: incomingCall.callType,
      timestamp: Date.now(),
    };

    await sendSignal(payload);

    setActiveCall({
      roomName: incomingCall.roomName,
      callType: incomingCall.callType,
      partnerUsername: incomingCall.caller.username,
      partnerDisplayName: incomingCall.caller.display_name,
      isInitiator: false,
    });
    setCallStatus("connected");
    setIncomingCall(null);
  }, [incomingCall, currentUser, sendSignal]);

  // ปฏิเสธสาย (Reject Incoming Call)
  const rejectCall = useCallback(async () => {
    if (!incomingCall || !currentUser) return;

    const payload: CallSignalPayload = {
      type: "CALL_REJECT",
      roomName: incomingCall.roomName,
      caller: incomingCall.caller,
      receiverUsername: currentUser.username,
      callType: incomingCall.callType,
      timestamp: Date.now(),
    };

    await sendSignal(payload);
    setIncomingCall(null);
  }, [incomingCall, currentUser, sendSignal]);

  // วางสาย / สิ้นสุดการโทร (End Call)
  const endCall = useCallback(async () => {
    if (!activeCall || !currentUser) return;

    playNotificationSound("end_call");

    const payload: CallSignalPayload = {
      type: "CALL_END",
      roomName: activeCall.roomName,
      caller: currentUser,
      receiverUsername: activeCall.partnerUsername,
      callType: activeCall.callType,
      timestamp: Date.now(),
    };

    await sendSignal(payload);
    setActiveCall(null);
    setCallStatus("idle");
  }, [activeCall, currentUser, sendSignal]);

  return {
    incomingCall,
    activeCall,
    callStatus,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  };
}
