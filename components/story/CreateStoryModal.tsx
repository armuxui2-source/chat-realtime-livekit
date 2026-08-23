"use client";

import React, { useState, useRef } from "react";
import { UserProfile } from "@/types/chat";
import { StoryItem } from "./StoryViewerModal";
import {
  X,
  Upload,
  Type,
  Music,
  MapPin,
  Sparkles,
  Globe,
  Users,
  Star,
  Check,
} from "lucide-react";

interface CreateStoryModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onPublishStory: (newStory: StoryItem) => void;
}

const GRADIENT_PRESETS = [
  { id: "emerald", name: "Emerald Deep", class: "from-emerald-600 via-teal-700 to-slate-900" },
  { id: "violet", name: "Sunset Violet", class: "from-purple-600 via-pink-600 to-rose-900" },
  { id: "cyber", name: "Cyber Midnight", class: "from-blue-600 via-indigo-700 to-slate-950" },
  { id: "amber", name: "Amber Glow", class: "from-amber-600 via-orange-600 to-red-900" },
  { id: "obsidian", name: "Obsidian Dark", class: "from-slate-800 via-zinc-900 to-black" },
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onPublishStory,
}) => {
  const [mode, setMode] = useState<"text" | "media">("text");
  const [caption, setCaption] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [locationTag, setLocationTag] = useState("กรุงเทพมหานคร");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [musicTag, setMusicTag] = useState("Lofi Chill Beats");
  const [showMusicInput, setShowMusicInput] = useState(false);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "close_friends">("public");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setMediaPreviewUrl(preview);
    setMode("media");
  };

  const handlePublish = () => {
    if (!caption.trim() && !mediaPreviewUrl) return;

    const newStory: StoryItem = {
      id: `story-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.display_name,
      mediaUrl: mediaPreviewUrl || "",
      caption: caption.trim() || "สตอรี่ใหม่ของฉัน",
      timestamp: "เมื่อสักครู่",
      gradient: selectedGradient.class,
    };

    onPublishStory(newStory);
    onClose();
    // Reset state
    setCaption("");
    setMediaPreviewUrl(null);
    setMode("text");
  };

  return (
    <div
      data-testid="create-story-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-prompt select-none animate-fade-in"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161A22]/98 border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 flex items-center justify-between border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">สร้างสตอรี่ใหม่ (24 ชม.)</h2>
              <p className="text-[11px] text-slate-400">แบ่งปันช่วงเวลาของคุณกับเพื่อนๆ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0F1216] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                mode === "text"
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Type className="w-4 h-4" />
              <span>ข้อความ & สีพื้นหลัง</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                mode === "media"
                  ? "bg-white/[0.08] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>อัปโหลดรูปภาพ</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Interactive Live Story Preview Canvas */}
          <div
            className={`relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/[0.1] shadow-inner flex flex-col justify-between p-4 bg-gradient-to-tr ${
              mode === "text" ? selectedGradient.class : "bg-black"
            }`}
          >
            {/* Background Media Image if uploaded */}
            {mode === "media" && mediaPreviewUrl && (
              <img
                src={mediaPreviewUrl}
                alt="Story preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            {/* Top Preview Header: User Info & Tags */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white shadow-xs">
                    {currentUser.display_name}
                  </p>
                  <p className="text-[10px] text-white/80">เมื่อสักครู่</p>
                </div>
              </div>

              {/* Tags Display */}
              <div className="flex items-center gap-1.5">
                {locationTag && (
                  <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white flex items-center gap-1 border border-white/10">
                    <MapPin className="w-2.5 h-2.5 text-amber-400" />
                    <span className="truncate max-w-[80px]">{locationTag}</span>
                  </span>
                )}
                {musicTag && (
                  <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white flex items-center gap-1 border border-white/10">
                    <Music className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    <span className="truncate max-w-[80px]">{musicTag}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Center: Story Caption / Text */}
            <div className="relative z-10 my-auto text-center px-4">
              <p className="text-sm sm:text-base font-bold text-white drop-shadow-md leading-relaxed whitespace-pre-wrap">
                {caption || (mode === "text" ? "พิมพ์ข้อความสตอรี่ของคุณที่นี่..." : "")}
              </p>
            </div>

            {/* Bottom Progress Bar Demo */}
            <div className="relative z-10 w-full h-1 rounded-full bg-white/30 overflow-hidden">
              <div className="w-1/2 h-full bg-white rounded-full" />
            </div>
          </div>

          {/* Caption Textarea Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              ข้อความบรรยายสตอรี่ (Caption)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="เขียนแคปชั่น เล่าเรื่องราวของคุณวันนี้..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0F1216] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          {/* Gradient Selector (Only in Text Mode) */}
          {mode === "text" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                เลือกชุดสีพื้นหลังสตอรี่
              </label>
              <div className="flex items-center gap-2.5">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedGradient(preset)}
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${
                      preset.class
                    } flex items-center justify-center transition-all ${
                      selectedGradient.id === preset.id
                        ? "ring-2 ring-emerald-400 scale-110 shadow-lg"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    title={preset.name}
                  >
                    {selectedGradient.id === preset.id && (
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location & Music Tag Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <button
                type="button"
                onClick={() => setShowLocationInput(!showLocationInput)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0F1216] border border-white/[0.08] hover:bg-white/[0.04] text-xs text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>ตำแหน่ง</span>
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[70px]">{locationTag}</span>
              </button>
              {showLocationInput && (
                <input
                  type="text"
                  value={locationTag}
                  onChange={(e) => setLocationTag(e.target.value)}
                  placeholder="ระบุสถานที่..."
                  className="mt-1.5 w-full px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-amber-400"
                />
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowMusicInput(!showMusicInput)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0F1216] border border-white/[0.08] hover:bg-white/[0.04] text-xs text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-emerald-400" />
                  <span>เพลง</span>
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[70px]">{musicTag}</span>
              </button>
              {showMusicInput && (
                <input
                  type="text"
                  value={musicTag}
                  onChange={(e) => setMusicTag(e.target.value)}
                  placeholder="ระบุชื่อเพลง..."
                  className="mt-1.5 w-full px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              )}
            </div>
          </div>

          {/* Privacy & Audience Setting */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              ความเป็นส่วนตัว (ผู้ที่มองเห็นสตอรี่นี้)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPrivacy("public")}
                className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  privacy === "public"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-[#0F1216] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>สาธารณะ</span>
              </button>

              <button
                type="button"
                onClick={() => setPrivacy("friends")}
                className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  privacy === "friends"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-[#0F1216] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <Users className="w-3 h-3" />
                <span>เพื่อน</span>
              </button>

              <button
                type="button"
                onClick={() => setPrivacy("close_friends")}
                className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  privacy === "close_friends"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-[#0F1216] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                <Star className="w-3 h-3 text-emerald-400" />
                <span>เพื่อนสนิท</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-white/[0.07] flex items-center justify-end gap-3 bg-[#0F1216]/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!caption.trim() && !mediaPreviewUrl}
            className="px-5 py-2.5 rounded-xl emerald-button-gradient disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>แชร์สตอรี่ของคุณ (24 ชม.)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
