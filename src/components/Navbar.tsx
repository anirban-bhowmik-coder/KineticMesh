import React from 'react';
import { ShieldCheck, Activity, Terminal, Cpu, FileText, Sparkles, Plus, Globe } from 'lucide-react';

interface NavbarProps {
  onOpenPitch: () => void;
  onReset: () => void;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPitch, onReset, hasResult }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#05070d]/85 backdrop-blur-xl border-b border-white/[0.07] specular-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Architecture */}
        <div 
          onClick={onReset}
          className="flex items-center space-x-3 cursor-pointer group select-none"
          id="brand-header"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-white/[0.12] flex items-center justify-center relative overflow-hidden shadow-md group-hover:border-sky-400/50 transition-all duration-300">
            <Cpu className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-sky-400/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-slate-100 font-mono text-base sm:text-lg group-hover:text-sky-300 transition-colors">
                KINETIC<span className="text-sky-400">MESH</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 font-semibold">
                v2.5
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              Autonomous Decision Intelligence
            </p>
          </div>
        </div>

        {/* Real-time System Telemetry Status */}
        <div className="hidden md:flex items-center space-x-5 text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/[0.05]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold tracking-wider text-[11px]">MESH_ONLINE</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/[0.05] text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Gemini 3.6 Flash</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/[0.05] text-[11px]">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Search Grounded</span>
          </div>
        </div>

        {/* Global Quick Actions */}
        <div className="flex items-center space-x-2.5">
          {hasResult && (
            <button
              onClick={onReset}
              className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 flex items-center space-x-1.5 shadow-sm active:scale-[0.98]"
              id="new-investigation-btn"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>New Inquiry</span>
            </button>
          )}

          <button
            onClick={onOpenPitch}
            className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/15 text-sky-200 border border-sky-400/30 hover:border-sky-400/50 transition-all duration-200 flex items-center space-x-1.5 shadow-sm active:scale-[0.98]"
            id="pitch-deck-btn"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Pitch & Architecture</span>
            <span className="sm:hidden">Pitch</span>
          </button>
        </div>

      </div>
    </header>
  );
};
