"use client";

import React, { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface MediaLightboxModalProps {
  isOpen: boolean;
  mediaUrl: string | null;
  mediaName?: string;
  onClose: () => void;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  isOpen,
  mediaUrl,
  mediaName,
  onClose,
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !mediaUrl) return null;

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div
      data-testid="media-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-prompt select-none text-white"
    >
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 max-w-4xl mx-auto p-3.5 rounded-3xl bg-[#161A22]/95 border border-white/[0.08] shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-white truncate max-w-sm">
            {mediaName || "รูปภาพ / สื่อมัลติมีเดีย"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] transition-colors"
            title="ซูมเข้า"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] transition-colors"
            title="ซูมออก"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] transition-colors"
            title="หมุนรูปภาพ"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Download button */}
          <a
            href={mediaUrl}
            download={mediaName || "download"}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-2xl emerald-button-gradient text-white transition-colors shadow-sm"
            title="ดาวน์โหลดไฟล์"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors ml-1"
            title="ปิดหน้าต่าง"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Viewer Container */}
      <div className="relative max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt={mediaName || "lightbox-preview"}
          data-testid="lightbox-image"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: "transform 0.2s ease-out",
          }}
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/[0.08]"
        />
      </div>
    </div>
  );
};
