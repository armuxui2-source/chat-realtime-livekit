"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Command,
  MessageSquare,
  Video,
  Radio,
  CheckCircle2,
  Lock,
  RefreshCw,
  Palette,
  Code,
  Briefcase,
} from "lucide-react";
import { UserProfile } from "@/types/chat";

interface AuthModalProps {
  onLogin: (username: string, displayName: string) => Promise<UserProfile>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [authMethod, setAuthMethod] = useState<"phone" | "google" | "quick">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpStep, setOtpStep] = useState<"input-phone" | "input-otp">("input-phone");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState("884219");

  // Sample workspace dev profiles
  const sampleAccounts = [
    {
      username: "sarah",
      name: "Sarah Miller",
      role: "Lead Product Designer",
      icon: Palette,
      gradient: "from-emerald-600 to-teal-800",
    },
    {
      username: "alex",
      name: "Alex Dev",
      role: "Senior Full-Stack Engineer",
      icon: Code,
      gradient: "from-blue-600 to-indigo-800",
    },
    {
      username: "somchai",
      name: "สมชาย ยอดรัก",
      role: "Product Manager",
      icon: Briefcase,
      gradient: "from-amber-600 to-orange-800",
    },
  ];

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === "input-otp" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, timerSeconds]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(randomOtp);
    setOtpStep("input-otp");
    setTimerSeconds(60);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const entered = otpCode.join("");
    if (entered.length < 6) return;
    setIsSubmitting(true);
    try {
      const formattedName = `User ${phoneNumber.slice(-4) || "Mobile"}`;
      const safeUsername = `u_${phoneNumber.replace(/\D/g, "").slice(-8) || "user"}`;
      await onLogin(safeUsername, formattedName);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFillOtp = () => {
    setOtpCode(simulatedOtp.split(""));
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await onLogin("google_user", "Google Workspace User");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (acc: { username: string; name: string }) => {
    setIsSubmitting(true);
    try {
      await onLogin(acc.username, acc.name);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#07080B] font-prompt select-none overflow-y-auto"
    >
      {/* Split Hero Card Container (Desktop 2-Column Split) */}
      <div className="relative w-full max-w-5xl h-auto md:h-[640px] rounded-3xl border border-white/10 bg-[#12161F] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 text-white">
        
        {/* Left Pane: Creative Hero Visual (Desktop Showcase) */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[#171D28] via-[#12161F] to-[#0B0D11] border-r border-white/10 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl" />

          {/* Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Command className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">Ticketapp</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REALTIME
                </span>
              </div>
              <p className="text-xs text-slate-400">Enterprise Social & WebRTC Platform</p>
            </div>
          </div>

          {/* Interactive Feature Cards Display */}
          <div className="relative z-10 space-y-3.5 my-auto">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Supabase Realtime Stream</p>
                <p className="text-[11px] text-slate-400">ส่งข้อความ สตอรี่ และอัปเดตรีลไทม์ระดับมิลลิวินาที</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">LiveKit Cloud WebRTC SFU</p>
                <p className="text-[11px] text-slate-400">สนทนาวิดีโอคอล คุยสายเสียงคมชัด พร้อมโหมด PiP</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instagram-Style Stories</p>
                <p className="text-[11px] text-slate-400">สตอรี่ 24 ชั่วโมง พร้อมตอบกลับและดูคนดูแบบสดๆ</p>
              </div>
            </div>
          </div>

          {/* Bottom Security Guarantee */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encryption & OAuth 2.0 Security</span>
          </div>
        </div>

        {/* Right Pane: Login Form & Tab Switcher */}
        <div className="flex flex-col justify-between p-6 sm:p-10 bg-[#12161F] overflow-y-auto custom-scrollbar">
          <div>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                เข้าสู่ระบบ / ยินดีต้อนรับ
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                เลือกรูปแบบการเข้าใช้งานเพื่อเริ่มต้นสนทนาแบบเรียลไทม์
              </p>
            </div>

            {/* Auth Method Segmented Tabs */}
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#0B0D11] border border-white/10 text-xs font-medium mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("phone");
                  setOtpStep("input-phone");
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === "phone"
                    ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>เบอร์โทร</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod("google")}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === "google"
                    ? "bg-white text-slate-900 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod("quick")}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === "quick"
                    ? "bg-slate-700 text-white font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ทดสอบ</span>
              </button>
            </div>

            {/* TAB 1: Phone + In-App Simulated OTP Flow */}
            {authMethod === "phone" && (
              <div>
                {otpStep === "input-phone" ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        หมายเลขโทรศัพท์ (Mobile Phone Number)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                          +66
                        </span>
                        <input
                          type="tel"
                          data-testid="phone-input"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="89 123 4567"
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#0B0D11] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!phoneNumber.trim()}
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <span>รับรหัสยืนยัน OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Simulated In-App OTP Hint Banner */}
                    <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-bold">รหัส OTP จำลองในระบบ: <span className="font-mono text-white text-sm bg-emerald-900/80 px-2 py-0.5 rounded-lg border border-emerald-500/40">{simulatedOtp}</span></p>
                          <p className="text-[10px] text-emerald-400 mt-0.5">ระบบทดสอบ OTP 6 หลักอัตโนมัติ ไม่เสียค่า SMS</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoFillOtp}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 transition-all shrink-0 ml-2"
                      >
                        กรอกให้อัตโนมัติ
                      </button>
                    </div>

                    {/* 6-Digit OTP Input Grid */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-2 text-center">
                        กรอกรหัส 6 หลักที่ได้รับสำหรับเบอร์ (+66 {phoneNumber})
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {otpCode.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            className="w-full h-12 text-center text-lg font-bold font-mono rounded-xl bg-[#0B0D11] border border-white/15 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>นับเวลาถอยหลัง: {timerSeconds} วินาที</span>
                      <button
                        type="button"
                        onClick={() => setOtpStep("input-phone")}
                        className="text-emerald-400 hover:underline"
                      >
                        เปลี่ยนเบอร์โทร
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpCode.join("").length < 6 || isSubmitting}
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmitting ? "กำลังตรวจสอบ..." : "ยืนยันและเข้าสู่ระบบ"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Google One-Click OAuth */}
            {authMethod === "google" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 text-center">
                  เชื่อมต่อด้วยบัญชี Google เพื่อใช้งานระบบทันที
                </p>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.54 0 2.93.56 4.02 1.48l3.02-3.02C17.22 1.83 14.77 1 12 1 7.48 1 3.63 3.6 1.76 7.39l3.66 2.84C6.3 7.38 8.92 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.71-4.92 3.71-8.7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.42 14.77c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.76 7.39C.64 9.6 0 12.08 0 14.77s.64 5.17 1.76 7.38l3.66-2.84z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.08 0-5.7-2.38-6.58-5.23L1.76 16.48C3.63 20.4 7.48 23.5 12 23.5z"
                    />
                  </svg>
                  <span>เข้าสู่ระบบด้วย Google Workspace</span>
                </button>
              </div>
            )}

            {/* TAB 3: Quick Dev Workspace Profiles */}
            {authMethod === "quick" && (
              <div className="space-y-2.5">
                {sampleAccounts.map((acc) => {
                  const IconComp = acc.icon;
                  return (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => handleQuickLogin(acc)}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0D11] border border-white/10 hover:border-emerald-500/50 hover:bg-[#171D28] transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${acc.gradient} flex items-center justify-center text-white font-bold shadow-md`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {acc.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            @{acc.username} · {acc.role}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
            <span>Powered by Next.js 14, LiveKit Cloud & Supabase Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
