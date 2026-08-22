-- ==============================================================================
-- SUPABASE SCHEMA FOR 1:1 REALTIME CHAT & LIVEKIT CALL SIGNALING
-- ==============================================================================

-- 1. Profiles Table (เก็บข้อมูลผู้ใช้งานและสถานะออนไลน์)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'busy', 'in_call')),
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Messages Table (เก็บประวัติข้อความแชท 1:1)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'call_log')),
  created_at TIMESTAMPTZ DEFAULT now(),
  is_read BOOLEAN DEFAULT false
);

-- Index สำหรับค้นหาข้อความรวดเร็ว
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
ON public.messages(sender_id, receiver_id, created_at);

-- 3. Call Logs Table (เก็บประวัติการโทร)
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name TEXT NOT NULL,
  caller_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  call_type TEXT NOT NULL CHECK (call_type IN ('audio', 'video')),
  status TEXT NOT NULL CHECK (status IN ('missed', 'completed', 'declined', 'cancelled')),
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- เปิดใช้งาน Row Level Security (RLS) แบบ Public demo เพื่อให้ใช้งานได้สะดวก
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- สร้าง Policy ให้อ่านและเขียนได้ทุกคน (สำหรับการใช้งาน 1:1 Demo / App)
CREATE POLICY "Public Profiles are viewable and editable by everyone"
ON public.profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Messages are viewable and insertable by everyone"
ON public.messages FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Call logs are viewable and insertable by everyone"
ON public.call_logs FOR ALL USING (true) WITH CHECK (true);

-- 4. เปิด Realtime สำหรับตาราง messages และ profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
