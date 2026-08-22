"use client";

import React from "react";
import { ExternalLink, Globe } from "lucide-react";

interface LinkPreviewCardProps {
  url: string;
}

export const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({ url }) => {
  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {}

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      data-testid="link-preview-card"
      className="my-2 flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-left group shadow-sm font-prompt select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
          <Globe className="w-5 h-5" />
        </div>
        <div className="min-w-0 truncate">
          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
            {hostname}
          </p>
          <p className="text-[11px] text-slate-400 truncate max-w-xs">{url}</p>
        </div>
      </div>

      <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2">
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </a>
  );
};
