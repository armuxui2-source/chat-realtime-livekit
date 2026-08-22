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
      className="my-2 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 font-mono text-xs shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 border-b border-slate-700/50">
        <span className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
          <Code2 className="w-3.5 h-3.5" />
          <span>{language}</span>
        </span>

        <button
          type="button"
          onClick={handleCopy}
          data-testid="copy-code-btn"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors text-[10px]"
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
      <div className="p-3 overflow-x-auto custom-scrollbar flex gap-3 text-slate-200">
        <div className="select-none text-slate-500 text-right pr-2 border-r border-slate-700/40 font-mono text-[11px] leading-relaxed">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="font-mono text-[11px] leading-relaxed flex-1">
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};
