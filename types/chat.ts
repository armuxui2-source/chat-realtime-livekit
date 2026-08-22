export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  status: "online" | "offline" | "busy" | "in_call" | "away";
  last_seen?: string;
}

export interface MessageReaction {
  [icon: string]: string[]; // e.g. { "thumbs-up": ["sarah", "alex"], "heart": ["somchai"] }
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_by: string;
  is_private: boolean;
  created_at: string;
  member_count?: number;
}

export interface ChannelMember {
  id?: string;
  channel_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  profile?: UserProfile;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id?: string; // Optional for channel messages
  channel_id?: string;  // Optional for 1:1 messages
  content: string;
  message_type: "text" | "image" | "file" | "call_log" | "audio";
  created_at: string;
  is_read?: boolean;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  reply_to_id?: string;
  reply_to_content?: string;
  reply_to_sender?: string;
  reactions?: MessageReaction;
  is_edited?: boolean;
  is_deleted?: boolean;
  is_pinned?: boolean;
}

export interface CallSignalPayload {
  type: "CALL_REQUEST" | "CALL_ACCEPT" | "CALL_REJECT" | "CALL_END";
  roomName: string;
  caller: UserProfile;
  receiverUsername: string;
  callType: "audio" | "video";
  timestamp: number;
}

export interface CallLog {
  id: string;
  caller_id: string;
  receiver_id: string;
  channel_id?: string;
  call_type: "audio" | "video";
  status: "completed" | "missed" | "rejected";
  duration_seconds: number;
  created_at: string;
}
