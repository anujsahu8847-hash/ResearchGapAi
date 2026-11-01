import React from 'react';
import { Sparkles, Cpu, BookOpen, Layers, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { getExportCSVUrl } from '../api';

export default function Navbar({ ollamaStatus, stats, onQuickIngest, isIngesting }) {
  return (
    <header className="h-16 shrink-0 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white tracking-tight">ResearchGap <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span></h1>
            <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">v1.0</span>
          </div>
          <p className="text-[11px] text-slate-400">Academic Literature Intelligence & Gap Discovery</p>
        </div>
      </div>

      {/* System Status and Actions */}
      <div className="flex items-center gap-4">
        {/* Ollama / LLM Engine Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">LLM:</span>
          {ollamaStatus?.available ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ollama ({ollamaStatus.current_model})
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium" title="Ollama daemon is offline. Using ResearchGap's built-in grounded synthesis engine.">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Built-in Academic Engine
            </span>
          )}
        </div>

        {/* Papers count badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Papers Indexed: <strong className="text-white">{stats?.uploaded_papers_count ?? 3}</strong></span>
        </div>

        {/* Export CSV */}
        <a
          href={getExportCSVUrl()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
          download="researchgap_library.csv"
          title="Export Library Metadata & Methodologies to CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV</span>
        </a>

        {/* Ingest Sample Papers Button */}
        <button
          onClick={onQuickIngest}
          disabled={isIngesting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-medium text-white shadow-md shadow-indigo-600/20 disabled:opacity-50 transition"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isIngesting ? "Indexing Samples..." : "Ingest Sample Papers"}</span>
        </button>
      </div>
    </header>
  );
}
