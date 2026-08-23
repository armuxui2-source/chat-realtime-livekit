"use client";

import React, { useState } from "react";
import { Code2, Copy, Check } from "lucide-react";

interface CodeSnippetBlockProps {
  code: string;
  language?: string;
}

export const CodeSnippetBlock: React.FC<CodeSnippetBlockProps> = ({
  code,
  language = "javascript",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div
      data-testid="code-snippet-block"
      className="my-2.5 rounded-2xl overflow-hidden bg-[#0F1216] border border-white/[0.08] font-mono text-xs shadow-xl text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161A22] border-b border-white/[0.07]">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
          <Code2 className="w-3.5 h-3.5" />
          <span>{language}</span>
        </span>

        <button
          type="button"
          onClick={handleCopy}
          data-testid="copy-code-btn"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors text-[10px] font-bold"
          title="คัดลอกโค้ด"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">คัดลอกแล้ว</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>คัดลอก</span>
            </>
          )}
        </button>
      </div>

      {/* Code with Line Numbers */}
      <div className="p-3.5 overflow-x-auto custom-scrollbar flex gap-3 text-slate-200">
        <div className="select-none text-slate-500 text-right pr-2 border-r border-white/[0.08] font-mono text-[11px] leading-relaxed">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="font-mono text-[11px] leading-relaxed flex-1 text-slate-200">
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};
