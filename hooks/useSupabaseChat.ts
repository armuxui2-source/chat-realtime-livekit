"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { UserProfile, ChatMessage, MessageReaction, Channel } from "@/types/chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { playNotificationSound, showDesktopNotification } from "@/lib/utils";

export interface ReplyContext {
  id: string;
  senderName: string;
  content: string;
}

export function useSupabaseChat(
  currentUser: UserProfile | null,
  selectedUser: UserProfile | null,
  selectedChannel: Channel | null = null
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ReplyContext | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isChannelMode = !!selectedChannel;

  // โหลดประวัติข้อความ
  useEffect(() => {
    if (!currentUser || (!selectedUser && !selectedChannel)) {
      setMessages([]);
      return;
    }

    const conversationKey = isChannelMode
      ? `channel::${selectedChannel.id}`
      : [currentUser.username, selectedUser!.username].sort().join("::");

    if (!isSupabaseConfigured) {
      try {
        const saved = localStorage.getItem(`chat_history_${conversationKey}`);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          setMessages([
            {
              id: "intro-1",
              sender_id: isChannelMode ? "system" : selectedUser!.username,
              receiver_id: isChannelMode ? undefined : currentUser.username,
              channel_id: isChannelMode ? selectedChannel.id : undefined,
              content: isChannelMode
                ? `ยินดีต้อนรับสู่ห้อง #${selectedChannel.name}! เริ่มต้นการสนทนากับทีมได้เลย`
                : `สวัสดีครับคุณ ${currentUser.display_name} ยินดีที่ได้คุยกันครับ!`,
              message_type: "text",
              created_at: new Date(Date.now() - 60000).toISOString(),
              reactions: {},
            },
          ]);
        }
      } catch (e) {
        console.error("Local chat history load error:", e);
      }
      return;
    }

    // โหลดประวัติจาก Supabase Database
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        let query = supabase.from("messages").select("*");

        if (isChannelMode) {
          query = query.eq("channel_id", selectedChannel.id);
        } else {
          query = query.or(
            `and(sender_id.eq.${currentUser.username},receiver_id.eq.${selectedUser!.username}),and(sender_id.eq.${selectedUser!.username},receiver_id.eq.${currentUser.username})`
          );
        }

        const { data, error } = await query
          .order("created_at", { ascending: true })
          .limit(100);

        if (error) throw error;
        if (data) {
          setMessages(data as ChatMessage[]);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();

    // ซับสไครบ์ข้อความแบบ Realtime
    const channel = supabase
      .channel(`chat-${conversationKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMsg = payload.new as ChatMessage;
            let isRelevant = false;

            if (isChannelMode) {
              isRelevant = newMsg.channel_id === selectedChannel.id;
            } else {
              isRelevant =
                (newMsg.sender_id === selectedUser!.username &&
                  newMsg.receiver_id === currentUser.username) ||
                (newMsg.sender_id === currentUser.username &&
                  newMsg.receiver_id === selectedUser!.username);
            }

            if (isRelevant) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });

              if (newMsg.sender_id !== currentUser.username) {
                playNotificationSound("message");
                showDesktopNotification(`ข้อความใหม่จาก @${newMsg.sender_id}`, {
                  body: newMsg.content || (newMsg.file_name ? `[ไฟล์] ${newMsg.file_name}` : "ส่งข้อความใหม่"),
                });
              }
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedMsg = payload.new as ChatMessage;
            setMessages((prev) =>
              prev.map((m) => (m.id === updatedMsg.id ? { ...m, ...updatedMsg } : m))
            );
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: string })?.id;
            if (oldId) {
              setMessages((prev) => prev.filter((m) => m.id !== oldId));
            }
          }
        }
      )
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (!isChannelMode && payload.sender === selectedUser!.username) {
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 2500);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [currentUser, selectedUser, selectedChannel, isChannelMode]);

  // ฟังก์ชันอัปโหลดไฟล์/รูปภาพ
  const uploadAttachment = useCallback(
    async (file: File): Promise<{ url: string; name: string; type: string } | null> => {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        if (isSupabaseConfigured) {
          const { error: uploadError } = await supabase.storage
            .from("chat-attachments")
            .upload(filePath, file);

          if (uploadError) {
            console.warn("Storage upload warning, fallback to local data url:", uploadError);
          } else {
            const { data } = supabase.storage.from("chat-attachments").getPublicUrl(filePath);
            return {
              url: data.publicUrl,
              name: file.name,
              type: file.type.startsWith("image/") ? "image" : "file",
            };
          }
        }

        // Fallback Data URL for instant preview/offline
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              url: reader.result as string,
              name: file.name,
              type: file.type.startsWith("image/") ? "image" : "file",
            });
          };
          reader.readAsDataURL(file);
        });
      } catch (err) {
        console.error("Upload error:", err);
        return null;
      }
    },
    []
  );

  // ฟังก์ชันส่งข้อความ
  const sendMessage = useCallback(
    async (
      content: string,
      attachment?: { url: string; name: string; type: string } | null
    ) => {
      if ((!content.trim() && !attachment) || !currentUser || (!selectedUser && !selectedChannel))
        return;

      const messageType = attachment ? (attachment.type === "image" ? "image" : "file") : "text";

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender_id: currentUser.username,
        receiver_id: isChannelMode ? undefined : selectedUser!.username,
        channel_id: isChannelMode ? selectedChannel!.id : undefined,
        content: content.trim(),
        message_type: messageType,
        created_at: new Date().toISOString(),
        file_url: attachment?.url,
        file_name: attachment?.name,
        file_type: attachment?.type,
        reply_to_id: replyingTo?.id,
        reply_to_sender: replyingTo?.senderName,
        reply_to_content: replyingTo?.content,
        reactions: {},
        is_edited: false,
        is_deleted: false,
      };

      // Optimistic UI Update
      setMessages((prev) => [...prev, newMsg]);
      setReplyingTo(null);

      // บันทึกลง Supabase Database
      if (isSupabaseConfigured) {
        try {
          await supabase.from("messages").insert([
            {
              id: newMsg.id,
              sender_id: newMsg.sender_id,
              receiver_id: newMsg.receiver_id,
              channel_id: newMsg.channel_id,
              content: newMsg.content,
              message_type: newMsg.message_type,
              file_url: newMsg.file_url,
              file_name: newMsg.file_name,
              file_type: newMsg.file_type,
              reply_to_id: newMsg.reply_to_id,
              reply_to_sender: newMsg.reply_to_sender,
              reply_to_content: newMsg.reply_to_content,
              reactions: newMsg.reactions,
            },
          ]);
        } catch (err) {
          console.error("Supabase insert message error:", err);
        }
      }
    },
    [currentUser, selectedUser, selectedChannel, isChannelMode, replyingTo]
  );

  // ฟังก์ชันส่งข้อความเสียง (Voice Message)
  const sendVoiceMessage = useCallback(
    async (audioBlob: Blob, durationSeconds: number) => {
      if (!currentUser || (!selectedUser && !selectedChannel)) return;

      const fileName = `voice_${Date.now()}.webm`;
      let audioUrl = "";

      if (isSupabaseConfigured) {
        try {
          const { error: uploadError } = await supabase.storage
            .from("chat-attachments")
            .upload(`voice-notes/${fileName}`, audioBlob, {
              contentType: "audio/webm",
              upsert: true,
            });

          if (!uploadError) {
            const { data } = supabase.storage
              .from("chat-attachments")
              .getPublicUrl(`voice-notes/${fileName}`);
            audioUrl = data.publicUrl;
          }
        } catch (err) {
          console.warn("Audio upload to Supabase failed, using Blob URL fallback:", err);
        }
      }

      if (!audioUrl) {
        audioUrl = URL.createObjectURL(audioBlob);
      }

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender_id: currentUser.username,
        receiver_id: isChannelMode ? undefined : selectedUser!.username,
        channel_id: isChannelMode ? selectedChannel!.id : undefined,
        content: `ข้อความเสียง (${durationSeconds} วินาที)`,
        message_type: "audio",
        created_at: new Date().toISOString(),
        file_url: audioUrl,
        file_name: fileName,
        file_type: "audio/webm",
        reactions: {},
        is_edited: false,
        is_deleted: false,
      };

      // Optimistic UI Update
      setMessages((prev) => [...prev, newMsg]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from("messages").insert([
            {
              id: newMsg.id,
              sender_id: newMsg.sender_id,
              receiver_id: newMsg.receiver_id,
              channel_id: newMsg.channel_id,
              content: newMsg.content,
              message_type: "audio",
              file_url: newMsg.file_url,
              file_name: newMsg.file_name,
              file_type: newMsg.file_type,
              reactions: {},
            },
          ]);
        } catch (err) {
          console.error("Supabase insert voice message error:", err);
        }
      }
    },
    [currentUser, selectedUser, selectedChannel, isChannelMode]
  );

  // ฟังก์ชันเพิ่ม/สลับ Reaction บนข้อความ
  const toggleReaction = useCallback(
    async (messageId: string, icon: string) => {
      if (!currentUser) return;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;

          const currentReactions: MessageReaction = { ...(msg.reactions || {}) };
          const userList = currentReactions[icon] ? [...currentReactions[icon]] : [];
          const userIndex = userList.indexOf(currentUser.username);

          if (userIndex > -1) {
            userList.splice(userIndex, 1);
          } else {
            userList.push(currentUser.username);
          }

          if (userList.length === 0) {
            delete currentReactions[icon];
          } else {
            currentReactions[icon] = userList;
          }

          if (isSupabaseConfigured) {
            supabase
              .from("messages")
              .update({ reactions: currentReactions })
              .eq("id", messageId)
              .then();
          }

          return {
            ...msg,
            reactions: currentReactions,
          };
        })
      );
    },
    [currentUser]
  );

  // ฟังก์ชันแก้ไขข้อความ
  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: newContent.trim(), is_edited: true }
            : msg
        )
      );

      if (isSupabaseConfigured) {
        try {
          await supabase
            .from("messages")
            .update({ content: newContent.trim(), is_edited: true })
            .eq("id", messageId);
        } catch (err) {
          console.error("Edit message error:", err);
        }
      }
    },
    []
  );

  // ฟังก์ชันลบข้อความ (Soft delete)
  const deleteMessage = useCallback(
    async (messageId: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: "ข้อความนี้ถูกลบแล้ว",
                is_deleted: true,
                file_url: undefined,
              }
            : msg
        )
      );

      if (isSupabaseConfigured) {
        try {
          await supabase
            .from("messages")
            .update({
              content: "ข้อความนี้ถูกลบแล้ว",
              is_deleted: true,
              file_url: null,
            })
            .eq("id", messageId);
        } catch (err) {
          console.error("Delete message error:", err);
        }
      }
    },
    []
  );

  // ฟังก์ชันปักหมุด / ถอนหมุดข้อความ (Pin / Unpin)
  const togglePinMessage = useCallback(
    async (messageId: string) => {
      setMessages((prev) => {
        const target = prev.find((m) => m.id === messageId);
        const nextState = !target?.is_pinned;

        if (isSupabaseConfigured) {
          supabase
            .from("messages")
            .update({ is_pinned: nextState })
            .eq("id", messageId)
            .then();
        }

        return prev.map((msg) =>
          msg.id === messageId ? { ...msg, is_pinned: nextState } : msg
        );
      });
    },
    []
  );

  // ส่งสถานะกำลังพิมพ์ (Direct message only)
  const sendTypingSignal = useCallback(() => {
    if (!currentUser || !selectedUser || isChannelMode || !isSupabaseConfigured) return;

    const conversationKey = [currentUser.username, selectedUser.username].sort().join("::");
    const channel = supabase.channel(`chat-${conversationKey}`);
    channel.send({
      type: "broadcast",
      event: "typing",
      payload: { sender: currentUser.username },
    });
  }, [currentUser, selectedUser, isChannelMode]);

  return {
    messages,
    isTyping,
    isLoadingMessages,
    replyingTo,
    setReplyingTo,
    sendMessage,
    sendVoiceMessage,
    uploadAttachment,
    toggleReaction,
    editMessage,
    deleteMessage,
    togglePinMessage,
    sendTypingSignal,
  };
}
