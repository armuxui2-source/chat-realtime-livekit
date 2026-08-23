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
      className="my-2 flex items-center justify-between p-3 rounded-2xl bg-[#161A22] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#1E232B] transition-all text-left group shadow-md font-prompt select-none text-white"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
          <Globe className="w-4 h-4" />
        </div>
        <div className="min-w-0 truncate">
          <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
            {hostname}
          </p>
          <p className="text-[11px] text-slate-400 truncate max-w-xs">{url}</p>
        </div>
      </div>

      <div className="p-1.5 rounded-xl bg-white/[0.06] group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0 ml-2">
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </a>
  );
};
