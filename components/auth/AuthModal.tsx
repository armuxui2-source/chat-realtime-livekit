"use client";

import React, { useState } from "react";
import {
  Command,
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
      gradient: "from-slate-800 to-slate-900",
    },
    {
      username: "alex",
      name: "Alex Dev",
      role: "Full-stack Lead",
      icon: Code,
      gradient: "from-slate-700 to-slate-900",
    },
    {
      username: "somchai",
      name: "สมชาย ยอดรัก",
      role: "Project Manager",
      icon: Briefcase,
      gradient: "from-emerald-700 to-teal-900",
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-md my-auto rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-2xl text-slate-900">
        {/* App Logo & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-sm mb-3 text-white">
            <Command className="w-6 h-6" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Ticketapp
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#0D652D] border border-[#CEEAD6]">
              Organiser
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            Next-gen real-time workspace with LiveKit audio & video meetings
          </p>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            <span>Select Workspace Profile</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {sampleAccounts.map((acc) => {
              const IconComponent = acc.icon;
              return (
                <button
                  key={acc.username}
                  data-testid={`quick-login-${acc.username}`}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  disabled={isSubmitting}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-400 hover:bg-slate-100 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${acc.gradient} flex items-center justify-center text-white shadow-sm`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        @{acc.username} · {acc.role}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">or custom username</span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        {/* Custom Username Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs text-slate-700 font-semibold block mb-1">
              Username
            </label>
            <input
              type="text"
              data-testid="username-input"
              placeholder="e.g. alex_lead, sarah_design"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 font-semibold block mb-1">
              Display Name
            </label>
            <input
              type="text"
              data-testid="display-name-input"
              placeholder="e.g. Alex Henderson"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
          </div>

          <button
            type="submit"
            data-testid="login-submit-btn"
            disabled={!username.trim() || isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>{isSubmitting ? "Entering workspace..." : "Continue to Workspace"}</span>
          </button>
        </form>

        {/* Security badge */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>LiveKit Cloud WebRTC & Supabase Realtime Engine</span>
        </div>
      </div>
    </div>
  );
};
