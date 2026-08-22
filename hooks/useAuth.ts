"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/types/chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

const LOCAL_STORAGE_KEY = "chat_app_current_user";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // โหลดผู้ใช้งานจาก LocalStorage หรือสร้าง Session เริ่มต้น
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const user = JSON.parse(saved);
        setCurrentUser(user);
      }
    } catch (e) {
      console.error("Error reading saved user:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // บันทึก / เข้าสู่ระบบผู้ใช้งาน
  const loginUser = useCallback(async (username: string, displayName: string) => {
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    const cleanDisplayName = displayName.trim() || cleanUsername;

    const profile: UserProfile = {
      id: cleanUsername,
      username: cleanUsername,
      display_name: cleanDisplayName,
      status: "online",
      last_seen: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    setCurrentUser(profile);

    if (isSupabaseConfigured) {
      try {
        supabase
          .from("profiles")
          .upsert({
            id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            status: "online",
            last_seen: new Date().toISOString(),
          })
          .then();
      } catch (err) {
        console.warn("Supabase upsert profile warning:", err);
      }
    }

    return profile;
  }, []);

  // ออกจากระบบ
  const logout = useCallback(async () => {
    if (currentUser && isSupabaseConfigured) {
      try {
        await supabase.from("profiles").update({ status: "offline" }).eq("username", currentUser.username);
      } catch (e) {
        console.warn("Supabase update offline warning:", e);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCurrentUser(null);
  }, [currentUser]);

  // ซิงค์รายชื่อผู้ใช้ที่ออนไลน์ (ผ่าน Supabase Presence หรือ DB)
  useEffect(() => {
    if (!currentUser) return;

    if (!isSupabaseConfigured) {
      // Demo / Mock contacts สำหรับการทดสอบทันทีโดยไม่ต้องต่อ DB
      const demoUsers: UserProfile[] = [
        {
          id: "sarah",
          username: "sarah",
          display_name: "Sarah Miller (Designer)",
          status: "online" as const,
          last_seen: new Date().toISOString(),
        },
        {
          id: "alex",
          username: "alex",
          display_name: "Alex Dev (Senior Engineer)",
          status: "online" as const,
          last_seen: new Date().toISOString(),
        },
        {
          id: "somchai",
          username: "somchai",
          display_name: "สมชาย ยอดรัก (Product Manager)",
          status: "online" as const,
          last_seen: new Date().toISOString(),
        },
      ].filter((u) => u.username !== currentUser.username);

      setOnlineUsers(demoUsers);
      return;
    }

    const defaultUsers: UserProfile[] = [
      {
        id: "sarah",
        username: "sarah",
        display_name: "Sarah Miller (Designer)",
        status: "online" as const,
        last_seen: new Date().toISOString(),
      },
      {
        id: "alex",
        username: "alex",
        display_name: "Alex Dev (Senior Engineer)",
        status: "online" as const,
        last_seen: new Date().toISOString(),
      },
      {
        id: "somchai",
        username: "somchai",
        display_name: "สมชาย ยอดรัก (Product Manager)",
        status: "online" as const,
        last_seen: new Date().toISOString(),
      },
    ].filter((u) => u.username !== currentUser.username);

    setOnlineUsers(defaultUsers);

    // เมื่อต่อ Supabase แล้ว โหลดรายชื่อผู้ใช้ทั้งหมด
    const fetchUsers = async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .neq("username", currentUser.username);

        if (data && data.length > 0) {
          setOnlineUsers(data as UserProfile[]);
        }
      } catch (e) {
        console.warn("Fetch users error:", e);
      }
    };

    fetchUsers();

    // Supabase Presence / Realtime Channel ติดตามสถานะ
    const presenceChannel = supabase.channel("online-users", {
      config: {
        presence: {
          key: currentUser.username,
        },
      },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const activeUsers: UserProfile[] = [];
        Object.keys(state).forEach((key) => {
          if (key !== currentUser.username && state[key][0]) {
            const userState = state[key][0] as unknown as { profile: UserProfile };
            if (userState?.profile) {
              activeUsers.push(userState.profile);
            }
          }
        });
        if (activeUsers.length > 0) {
          setOnlineUsers((prev) => {
            const map = new Map<string, UserProfile>();
            prev.forEach((u) => map.set(u.username, u));
            activeUsers.forEach((u) => map.set(u.username, u));
            return Array.from(map.values());
          });
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            profile: currentUser,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [currentUser]);

  return {
    currentUser,
    setCurrentUser,
    onlineUsers,
    isLoading,
    loginUser,
    logout,
  };
}
