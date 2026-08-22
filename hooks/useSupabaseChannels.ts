"use client";

import { useState, useEffect, useCallback } from "react";
import { Channel, ChannelMember, UserProfile } from "@/types/chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

const DEFAULT_CHANNELS: Channel[] = [
  {
    id: "general",
    name: "ห้องพูดคุยทั่วไป (General)",
    description: "ช่องสนทนารวมสำหรับทีมทั้งหมด",
    created_by: "sarah",
    is_private: false,
    created_at: new Date().toISOString(),
    member_count: 3,
  },
  {
    id: "dev-engineering",
    name: "ทีมพัฒนาและวิศวกรรม",
    description: "พูดคุยเรื่องสถาปัตยกรรมและโค้ด",
    created_by: "alex",
    is_private: false,
    created_at: new Date().toISOString(),
    member_count: 2,
  },
];

export const useSupabaseChannels = (currentUser: UserProfile | null) => {
  const [channels, setChannels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channelMembers, setChannelMembers] = useState<ChannelMember[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);

  // Fetch channels list from Supabase
  const fetchChannels = useCallback(async () => {
    if (!currentUser) return;
    setIsLoadingChannels(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("channels")
          .select("*")
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          setChannels(data as Channel[]);
          return;
        }
      } catch (err) {
        console.warn("Fetch channels fallback warning:", err);
      } finally {
        setIsLoadingChannels(false);
      }
    }

    // Fallback default channels
    setChannels(DEFAULT_CHANNELS);
    setIsLoadingChannels(false);
  }, [currentUser]);

  // Fetch members of currently selected channel
  const fetchMembers = useCallback(
    async (channelId: string) => {
      if (!isSupabaseConfigured) {
        setChannelMembers([
          { channel_id: channelId, user_id: "sarah", role: "admin", joined_at: new Date().toISOString() },
          { channel_id: channelId, user_id: "alex", role: "member", joined_at: new Date().toISOString() },
          { channel_id: channelId, user_id: "somchai", role: "member", joined_at: new Date().toISOString() },
        ]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("channel_members")
          .select("*")
          .eq("channel_id", channelId);

        if (!error && data) {
          setChannelMembers(data as ChannelMember[]);
        }
      } catch (err) {
        console.warn("Fetch channel members error:", err);
      }
    },
    []
  );

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    if (selectedChannel) {
      fetchMembers(selectedChannel.id);
    } else {
      setChannelMembers([]);
    }
  }, [selectedChannel, fetchMembers]);

  // Realtime subscription for channels & members
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channelSub = supabase
      .channel("public:channels_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "channels" },
        () => {
          fetchChannels();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "channel_members" },
        () => {
          if (selectedChannel) fetchMembers(selectedChannel.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSub);
    };
  }, [fetchChannels, selectedChannel, fetchMembers]);

  // Create Channel
  const createChannel = useCallback(
    async (
      name: string,
      description: string,
      isPrivate: boolean,
      initialMemberUsernames: string[]
    ) => {
      if (!currentUser) return null;

      const channelId = `ch-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const newChannel: Channel = {
        id: channelId,
        name: name.trim(),
        description: description.trim(),
        created_by: currentUser.username,
        is_private: isPrivate,
        created_at: new Date().toISOString(),
        member_count: initialMemberUsernames.length + 1,
      };

      // Optimistic update
      setChannels((prev) => [...prev, newChannel]);
      setSelectedChannel(newChannel);

      if (isSupabaseConfigured) {
        try {
          await supabase.from("channels").insert({
            id: newChannel.id,
            name: newChannel.name,
            description: newChannel.description,
            created_by: newChannel.created_by,
            is_private: newChannel.is_private,
          });

          // Insert creator as admin
          await supabase.from("channel_members").insert({
            channel_id: newChannel.id,
            user_id: currentUser.username,
            role: "admin",
          });

          // Insert initial members
          const membersToInsert = initialMemberUsernames
            .filter((u) => u !== currentUser.username)
            .map((u) => ({
              channel_id: newChannel.id,
              user_id: u,
              role: "member" as const,
            }));

          if (membersToInsert.length > 0) {
            await supabase.from("channel_members").insert(membersToInsert);
          }
        } catch (err) {
          console.warn("Supabase createChannel error:", err);
        }
      }

      return newChannel;
    },
    [currentUser]
  );

  // Add Member to Channel
  const addMemberToChannel = useCallback(
    async (channelId: string, username: string, role: "admin" | "member" = "member") => {
      const newMember: ChannelMember = {
        channel_id: channelId,
        user_id: username,
        role,
        joined_at: new Date().toISOString(),
      };

      setChannelMembers((prev) => [...prev, newMember]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from("channel_members").insert({
            channel_id: channelId,
            user_id: username,
            role,
          });
        } catch (err) {
          console.warn("Add member error:", err);
        }
      }
    },
    []
  );

  return {
    channels,
    selectedChannel,
    setSelectedChannel,
    channelMembers,
    isLoadingChannels,
    createChannel,
    addMemberToChannel,
    refetchChannels: fetchChannels,
  };
};
