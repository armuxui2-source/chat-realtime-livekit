"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Command,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Check,
} from "lucide-react";
import { UserProfile } from "@/types/chat";
import { getAvatarColor } from "@/lib/utils";

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogin: (username: string, displayName: string) => Promise<UserProfile>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = true,
  onClose,
  onLogin,
}) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authMethod, setAuthMethod] = useState<"phone" | "email" | "quick">("phone");

  // Phone + OTP State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpStep, setOtpStep] = useState<"input-phone" | "input-otp">("input-phone");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [simulatedOtp, setSimulatedOtp] = useState("884219");

  // Email / Password State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick dev test profiles
  const sampleAccounts = [
    { username: "sarah", name: "Sarah Miller", role: "Lead Product Designer" },
    { username: "alex", name: "Alex Dev", role: "Senior Engineer" },
    { username: "somchai", name: "สมชาย ยอดรัก", role: "Product Manager" },
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

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(randomOtp);
    setOtpStep("input-otp");
    setTimerSeconds(60);
    setErrorMessage(null);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`modal-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const entered = otpCode.join("");
    if (entered.length < 6) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const formattedName = `User ${phoneNumber.slice(-4) || "Mobile"}`;
      const safeUsername = `u_${phoneNumber.replace(/\D/g, "").slice(-8) || "user"}`;
      await onLogin(safeUsername, formattedName);
      onClose?.();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "การเข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const defaultName = fullName.trim() || email.split("@")[0];
      const safeUser = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
      await onLogin(safeUser || "user", defaultName);
      onClose?.();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "การเข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onLogin("google_user", "Google Workspace User");
      onClose?.();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Google OAuth ไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (acc: { username: string; name: string }) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onLogin(acc.username, acc.name);
      onClose?.();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md font-prompt select-none animate-fade-in"
    >
      <div
        data-testid="auth-modal-card"
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200/80 text-slate-800 animate-scale-up"
      >
        {/* Close Button (if closable) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Command className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {authMode === "signin" ? "เข้าสู่ระบบ Ticketapp" : "สร้างบัญชีผู้ใช้งานใหม่"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === "signin"
              ? "ยินดีต้อนรับกลับ! เข้าสู่ระบบเพื่อสนทนาแบบเรียลไทม์"
              : "เริ่มต้นใช้งานระบบแชทและประชุมสดฟรีวันนี้"}
          </p>
        </div>

        {/* Sign In vs Sign Up Toggle Pills */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold mb-5">
          <button
            type="button"
            onClick={() => setAuthMode("signin")}
            className={`py-2 rounded-xl transition-all ${
              authMode === "signin"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            เข้าสู่ระบบ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("signup")}
            className={`py-2 rounded-xl transition-all ${
              authMode === "signup"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            สมัครสมาชิก (Sign Up)
          </button>
        </div>

        {/* Method Switcher (Phone, Email, Quick) */}
        <div className="flex border-b border-slate-200 mb-5 text-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setOtpStep("input-phone");
            }}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              authMethod === "phone"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>เบอร์โทร & OTP</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("email")}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              authMethod === "email"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>อีเมล & รหัสผ่าน</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("quick")}
            className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              authMethod === "quick"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ทดสอบเร็ว</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* FORM 1: Phone + In-App OTP */}
        {authMethod === "phone" && (
          <div>
            {otpStep === "input-phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    หมายเลขโทรศัพท์มือถือ
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                      +66
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="89 123 4567"
                      required
                      className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-slate-900 font-mono transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!phoneNumber.trim() || isSubmitting}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <span>ส่งรหัส OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold">
                      รหัส OTP จำลอง: <span className="font-mono bg-white px-2 py-0.5 rounded-lg border border-emerald-300 font-bold">{simulatedOtp}</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">ระบบทดสอบ OTP 6 หลักอัตโนมัติ</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(simulatedOtp.split(""))}
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shrink-0 ml-2"
                  >
                    กรอกอัตโนมัติ
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`modal-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-full h-12 text-center text-lg font-bold font-mono rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>นับเวลาถอยหลัง: {timerSeconds}s</span>
                  <button
                    type="button"
                    onClick={() => setOtpStep("input-phone")}
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    เปลี่ยนเบอร์โทร
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpCode.join("").length < 6 || isSubmitting}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? "กำลังตรวจสอบ..." : "ยืนยันรหัส OTP"}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* FORM 2: Email & Password */}
        {authMethod === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {authMode === "signup" && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ชื่อ-นามสกุล (Full Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="เช่น Alex Dev"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-slate-900 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                อีเมล (Work Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-slate-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-slate-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>{authMode === "signin" ? "เข้าสู่ระบบ" : "สร้างบัญชีใหม่"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* FORM 3: Quick Dev Accounts */}
        {authMethod === "quick" && (
          <div className="space-y-2">
            {sampleAccounts.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                disabled={isSubmitting}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                      acc.username
                    )} flex items-center justify-center text-white text-xs font-bold shadow-xs`}
                  >
                    {acc.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{acc.name}</p>
                    <p className="text-[11px] text-slate-500">
                      @{acc.username} · {acc.role}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        )}

        {/* Google OAuth One-Click Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t border-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            หรือ
          </span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2.5"
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
          <span>ดำเนินการต่อด้วยบัญชี Google</span>
        </button>
      </div>
    </div>
  );
};
