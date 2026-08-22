# Real-time WebRTC Chat & LiveKit Calling App 🚀

Web Application สำหรับระบบแชทข้อความแบบเรียลไทม์ โทรเสียง (Voice Call) และวิดีโอคอล (Video Call) ความหน่วงต่ำ พัฒนาด้วยเทคโนโลยีระดับโมเดิร์น:
- **Frontend & Fullstack**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons, ฟอนต์ Prompt
- **Media Engine**: LiveKit WebRTC SDK (`@livekit/components-react`, `livekit-client`, `livekit-server-sdk`)
- **Database & Signaling**: Supabase (PostgreSQL, Realtime Broadcast & Presence)

---

## 🛠️ โครงสร้างไฟล์ในโปรเจกต์

```
d:/โปรเจค/แชท/
├── app/
│   ├── api/
│   │   └── livekit-token/
│   │       └── route.ts          # API Endpoint สร้าง JWT Token สำหรับเข้าร่วมห้อง LiveKit
│   ├── globals.css               # สไตล์ Glassmorphism และ Tailwind Theme
│   ├── layout.tsx                # Layout หลัก + Google Font "Prompt"
│   └── page.tsx                  # หน้าจอแอปพลิเคชันหลัก (Dashboard)
├── components/
│   ├── auth/
│   │   └── AuthModal.tsx         # ระบบเข้าสู่ระบบ / สลับโปรไฟล์ทดสอบ
│   ├── call/
│   │   ├── CallModal.tsx         # หน้าต่างโทรเสียง / วิดีโอคอล LiveKit
│   │   └── IncomingCallDialog.tsx# ป๊อปอัปแจ้งเตือนสายเรียกเข้า
│   └── chat/
│       ├── ChatContainer.tsx     # กล่องแชทหลัก
│       ├── ChatHeader.tsx        # ส่วนหัวแชท + ปุ่มโทรเสียง/วิดีโอ
│       ├── MessageInput.tsx      # กล่องพิมพ์ข้อความ + อีโมจิ
│       ├── MessageList.tsx       # รายการข้อความ + Typing Indicator
│       └── UserSidebar.tsx       # รายชื่อผู้ติดต่อและสถานะออนไลน์
├── hooks/
│   ├── useAuth.ts                # จัดการสถานะผู้ใช้และ Presence
│   ├── useCallSignaling.ts       # จัดการสัญญาณโทรเข้า-ออก
│   └── useSupabaseChat.ts        # จัดการส่งข้อความและประวัติแชท
├── lib/
│   ├── supabase/
│   │   └── client.ts             # Supabase Client
│   └── utils.ts                  # Helper functions & Sound FX
├── supabase/
│   └── schema.sql                # SQL Database Schema & RLS Policies
├── .env.example                  # ตัวอย่าง Environment Variables
└── package.json
```

---

## ⚡ วิธีเริ่มต้นใช้งาน (Quick Start)

### 1. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` ที่โฟลเดอร์ root ของโปรเจกต์:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# LiveKit Configuration (LiveKit Cloud)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### 2. รัน SQL Schema บน Supabase (ครั้งแรก)
นำเนื้อหาในไฟล์ [supabase/schema.sql](file:///d:/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%80%E0%B8%88%E0%B8%84/%E0%B9%81%E0%B8%8A%E0%B8%97/supabase/schema.sql) ไปวางและรันใน **Supabase SQL Editor**

### 3. รันโปรเจกต์
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

## 🧪 การทดสอบ 2 บัญชีพร้อมกัน (Dual Tab Testing)
1. เปิดแท็บปกติ เข้าสู่ระบบด้วยโปรไฟล์ `Sarah Miller`
2. เปิดแท็บไม่ระบุตัวตน (Incognito) เข้าสู่ระบบด้วยโปรไฟล์ `Alex Dev`
3. ส่งข้อความแชทไปมาระหว่างกัน
4. กดปุ่ม **"โทรเสียง"** หรือ **"วิดีโอคอล"** เพื่อทดสอบสายเรียกเข้าและระบบ LiveKit Room
