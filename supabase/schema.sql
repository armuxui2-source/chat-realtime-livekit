-- ==============================================================================
-- TICKETAPP REALTIME & LIVEKIT MASTER DATABASE SCHEMA (POSTGRESQL + SUPABASE)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (User Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'busy', 'away', 'offline', 'in_call')),
  bio TEXT DEFAULT 'Ready to collaborate',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on username and status
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- 3. Conversations Table (Channels, DMs, Groups)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL DEFAULT 'direct' CHECK (type IN ('direct', 'group', 'channel')),
  name TEXT,
  description TEXT,
  avatar_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_type ON public.conversations(type);

-- 4. Conversation Members
CREATE TABLE IF NOT EXISTS public.conversation_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_members_profile ON public.conversation_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_conv_members_conv ON public.conversation_members(conversation_id);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  receiver_id TEXT,
  channel_id TEXT,
  content TEXT DEFAULT '',
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'file', 'code', 'video')),
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  reply_to_sender TEXT,
  reply_to_content TEXT,
  reactions JSONB DEFAULT '{}'::jsonb,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_channel ON public.messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- 6. Call Logs Table (LiveKit WebRTC Call Logs)
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  caller_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  call_type TEXT NOT NULL DEFAULT 'audio' CHECK (call_type IN ('audio', 'video')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('missed', 'completed', 'declined', 'cancelled')),
  duration_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_logs_caller_receiver ON public.call_logs(caller_id, receiver_id);

-- 7. Stories Table (Instagram-style Stories)
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'gradient')),
  caption TEXT,
  gradient TEXT DEFAULT 'from-indigo-600 to-purple-800',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON public.stories(expires_at);

-- 8. Story Views Table
CREATE TABLE IF NOT EXISTS public.story_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  viewer_username TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, viewer_username)
);

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mention', 'message', 'call', 'friend_request', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read);

-- 10. Enable Supabase Realtime for Messages and Call Logs
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE call_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE stories;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 11. Storage Buckets (Execute in Supabase SQL Editor if buckets not created)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('voice-notes', 'voice-notes', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
