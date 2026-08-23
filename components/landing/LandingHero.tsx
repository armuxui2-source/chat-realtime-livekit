"use client";

import React, { useState } from "react";
import {
  Command,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Video,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  Calendar,
  Lock,
  Phone,
  Mail,
  ChevronRight,
  Globe,
  Radio,
} from "lucide-react";
import { UserProfile } from "@/types/chat";

interface LandingHeroProps {
  onOpenLogin: () => void;
  onQuickLogin: (username: string, displayName: string) => Promise<UserProfile>;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenLogin,
  onQuickLogin,
}) => {
  const [activeTab, setActiveTab] = useState<"features" | "livekit" | "security">("features");

  return (
    <div
      data-testid="landing-hero-container"
      className="min-h-screen w-screen bg-[#FAFAF9] text-slate-900 font-prompt overflow-y-auto selection:bg-emerald-500 selection:text-white"
    >
      {/* 1. Floating Capsule Top Navigation Bar (Pinterest Bento Reference Style) */}
      <header className="sticky top-0 z-40 w-full flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-900/5 max-w-4xl w-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Command className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900">
              Ticketapp
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              ความสามารถ (Features)
            </a>
            <a href="#media-calls" className="hover:text-slate-900 transition-colors">
              WebRTC SFU Cloud
            </a>
            <a href="#security" className="hover:text-slate-900 transition-colors">
              ความปลอดภัย (Security)
            </a>
            <a href="#reviews" className="hover:text-slate-900 transition-colors">
              เสียงตอบรับ
            </a>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLogin}
              data-testid="landing-login-btn"
              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>เข้าสู่ระบบ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      </header>

      {/* 2. Main Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16 text-center">
        {/* Soft Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ticketapp Realtime Ultra-Fast Engine</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
        </div>

        {/* Hero Title with Highlighted Pill (Exact Pinterest Style) */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-3xl mx-auto">
          A chat & communication platform that works like an{" "}
          <span className="inline-block px-3.5 py-1 rounded-2xl bg-emerald-100/80 text-emerald-800 border border-emerald-300/40 text-2xl sm:text-5xl lg:text-6xl font-black">
            Organiser
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ยกระดับการสื่อสารในองค์กรด้วยระบบแชทเรียลไทม์ความเร็วสูง วิดีโอคอลคมชัดระดับ HD แบบ
          All-in-One สตอรี่ 24 ชั่วโมง และระบบการจัดการโปรไฟล์มาตรฐานสากล
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenLogin}
            data-testid="hero-get-started-btn"
            className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xl shadow-slate-900/15 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>เริ่มต้นใช้งานฟรี</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onQuickLogin("sarah", "Sarah Miller")}
            data-testid="hero-quick-demo-btn"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200/90 shadow-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>ทดลองเล่น Live Demo ทันที</span>
          </button>
        </div>

        {/* 3. 3 Bento Step Feature Cards (Exact Pinterest Reference) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Fast Setup */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 flex flex-col justify-between group hover:border-emerald-500/50 transition-all hover:shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                STEP 1
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                สร้างห้องสนทนาและเชื่อมต่อทันที
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                สร้างกลุ่มงาน แชทส่วนตัว หรือเปิด Channel เฉพาะโปรเจกต์ได้ในไม่กี่วินาที
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Supabase Realtime</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Card 2: HD Voice & Video Calls */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 flex flex-col justify-between group hover:border-emerald-500/50 transition-all hover:shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                STEP 2
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                โทรเสียง & วิดีโอคอล SFU HD
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                สัญญาณคมชัดสูง ดีเลย์ต่ำ รองรับการย่อหน้าต่างเป็น PiP Floating Mode คุยไปแชทไปพร้อมกัน
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>HD Voice & Video SFU</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Card 3: Stories & Social Discovery */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 flex flex-col justify-between group hover:border-emerald-500/50 transition-all hover:shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                STEP 3
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                สตอรี่ & กิจกรรมอัปเดตเรียลไทม์
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                แชร์ช่วงเวลาสำคัญ 24 ชม. ด้วยสตอรี่ ตอบกลับในแชทได้ทันที พร้อม QR Code เพิ่มเพื่อน
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Social Experience</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* 4. Client Testimonial & Social Proof (Pinterest Reference) */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-900 text-white shadow-2xl text-center max-w-3xl mx-auto relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-base ring-4 ring-slate-800 mb-3">
              S
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed max-w-xl italic">
              “ระบบ Ticketapp ออกแบบมาได้มืออาชีพ สวยงาม และใช้งานง่ายมาก ระบบสื่อสารสายสด
              และแชททำงานเรียลไทม์ได้เร็วและเสถียรที่สุด”
            </p>
            <div className="mt-3">
              <p className="text-xs font-bold text-white">Sarah Miller</p>
              <p className="text-[11px] text-slate-400">Lead Product Designer & Tech Lead</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-slate-900" />
            <span className="font-bold text-slate-900">Ticketapp Realtime Platform</span>
          </div>
          <p>© 2026 Ticketapp Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
