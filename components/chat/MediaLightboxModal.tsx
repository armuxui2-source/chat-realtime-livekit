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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-fade-in font-prompt select-none"
    >
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 max-w-4xl mx-auto p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-slate-800 truncate max-w-sm">
            {mediaName || "รูปภาพ / มีเดีย"}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom Controls */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="ซูมเข้า"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="ซูมออก"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
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
            className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            title="ดาวน์โหลดไฟล์"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors ml-1"
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
          className="max-h-[75vh] max-w-full object-contain rounded-3xl shadow-2xl border border-white"
        />
      </div>
    </div>
  );
};
