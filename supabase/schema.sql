-- ==============================================================================
-- SUPABASE COMPLETE DATABASE SCHEMA FOR REAL-TIME CHAT, CHANNELS & LIVEKIT
-- ==============================================================================

-- 1. Profiles Table (เก็บข้อมูลผู้ใช้งานและสถานะออนไลน์)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'busy', 'in_call', 'away')),
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Channels Table (เก็บห้องแชทกลุ่ม)
CREATE TABLE IF NOT EXISTS public.channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Channel Members Table (สมาชิกในแต่ละห้อง)
CREATE TABLE IF NOT EXISTS public.channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(channel_id, user_id)
);

-- 4. Messages Table (เก็บข้อความทั้ง 1:1 และ Channel)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT NOT NULL,
  receiver_id TEXT,
  channel_id TEXT REFERENCES public.channels(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'call_log', 'audio')),
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  reply_to_id TEXT,
  reply_to_content TEXT,
  reply_to_sender TEXT,
  reactions JSONB DEFAULT '{}'::jsonb,
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes สำหรับสืบค้นข้อความอย่างรวดเร็ว
CREATE INDEX IF NOT EXISTS idx_messages_direct ON public.messages(sender_id, receiver_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON public.messages(channel_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_pinned ON public.messages(channel_id, receiver_id, is_pinned);

-- 5. Call Logs Table (เก็บประวัติการโทรเสียงและวิดีโอ)
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name TEXT NOT NULL,
  caller_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  channel_id TEXT,
  call_type TEXT NOT NULL CHECK (call_type IN ('audio', 'video')),
  status TEXT NOT NULL CHECK (status IN ('missed', 'completed', 'declined', 'cancelled', 'rejected')),
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read and write on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write on channels" ON public.channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write on channel_members" ON public.channel_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write on messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write on call_logs" ON public.call_logs FOR ALL USING (true) WITH CHECK (true);

-- 7. เปิด Realtime สำหรับตาราง
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_logs;

-- 8. สร้าง Storage Buckets สำหรับจัดเก็บไฟล์และเสียง (ถ้าเปิดใช้ Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('voice-notes', 'voice-notes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for chat attachments" 
ON storage.objects FOR ALL 
USING (bucket_id IN ('chat-attachments', 'voice-notes'))
WITH CHECK (bucket_id IN ('chat-attachments', 'voice-notes'));
