"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Palette,
  Code,
  Briefcase,
} from "lucide-react";
import { UserProfile } from "@/types/chat";

interface AuthModalProps {
  onLogin: (username: string, displayName: string) => Promise<UserProfile>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleAccounts = [
    {
      username: "sarah",
      name: "Sarah Miller",
      role: "Product Designer",
      icon: Palette,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      username: "alex",
      name: "Alex Dev",
      role: "Full-stack Lead",
      icon: Code,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      username: "somchai",
      name: "สมชาย ยอดรัก",
      role: "Project Manager",
      icon: Briefcase,
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsSubmitting(true);
    try {
      await onLogin(username, displayName || username);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/20 backdrop-blur-md font-prompt overflow-y-auto"
    >
      <div className="relative w-full max-w-md my-auto max-h-[96vh] overflow-y-auto custom-scrollbar rounded-3xl border border-white/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-slate-800">
        {/* App Logo & Title */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3 sm:mb-4">
            <LayoutGrid className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <span>Social Solution</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              WebRTC
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time messaging, audio notes & HD video meetings
          </p>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Quick Login</span>
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {sampleAccounts.map((acc) => {
              const IconComponent = acc.icon;
              return (
                <button
                  key={acc.username}
                  data-testid={`quick-login-${acc.username}`}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  disabled={isSubmitting}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500/50 hover:bg-blue-50/50 transition-all text-left group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-tr ${acc.gradient} flex items-center justify-center text-white shadow-sm`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {acc.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        @{acc.username} · {acc.role}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-4 text-xs text-slate-400">or enter username</span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        {/* Custom Username Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-600 font-semibold block mb-1.5">
              Username
            </label>
            <input
              type="text"
              data-testid="username-input"
              placeholder="e.g. somying, john_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 font-semibold block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              data-testid="display-name-input"
              placeholder="e.g. Somying Sodsai"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            data-testid="login-submit-btn"
            disabled={!username.trim() || isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>{isSubmitting ? "Logging in..." : "Get Started"}</span>
          </button>
        </form>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured with DTLS-SRTP & Supabase TLS</span>
        </div>
      </div>
    </div>
  );
};
