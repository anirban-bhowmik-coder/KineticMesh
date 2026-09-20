import React, { useRef, useEffect } from 'react';
import { Search, Sparkles, CornerDownLeft, AlertCircle, RefreshCw, Terminal } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presets';
import { PresetScenario } from '../types';

interface InvestigationConsoleProps {
  query: string;
  setQuery: (q: string) => void;
  onExecute: () => void;
  loading: boolean;
  onSelectPreset: (preset: PresetScenario) => void;
}

export const InvestigationConsole: React.FC<InvestigationConsoleProps> = ({
  query,
  setQuery,
  onExecute,
  loading,
  onSelectPreset,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = query.length;
  const isTooShort = query.trim().length > 0 && query.trim().length < 10;
  const isTooLong = charCount > 2500;
  const isValid = query.trim().length >= 10 && !isTooLong;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (isValid && !loading) {
          onExecute();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isValid, loading, onExecute]);

  return (
    <div 
      className="glass-panel specular-top rounded-2xl p-5 sm:p-7 shadow-2xl relative transition-all duration-300" 
      id="investigation-console"
    >
      {/* Console Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-white/[0.08] flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            Investigation Objective Console
          </span>
        </div>
        
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className={`${isTooLong ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
            {charCount} / 2500
          </span>
          <span className="hidden sm:inline-flex items-center space-x-1 text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-white/[0.06] text-[10px]">
            <kbd className="font-mono bg-slate-800 px-1 py-0.2 rounded text-slate-200">⌘</kbd>
            <span>+</span>
            <kbd className="font-mono bg-slate-800 px-1 py-0.2 rounded text-slate-200">Enter</kbd>
            <span className="ml-1 text-slate-400">to execute</span>
          </span>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="mb-4 flex items-center space-x-2 overflow-x-auto pb-1.5 text-xs font-mono scrollbar-none">
        <span className="text-slate-400 text-[11px] whitespace-nowrap flex items-center space-x-1">
          <Terminal className="w-3 h-3 text-sky-400" />
          <span>Preset Scenarios:</span>
        </span>
        {PRESET_SCENARIOS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPreset(p)}
            className="px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/[0.06] hover:border-sky-500/40 whitespace-nowrap transition-all duration-150 text-[11px] shadow-sm active:scale-[0.98]"
            id={`chip-${p.id}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Textarea Input */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="State a high-stakes strategic, technical, or economic decision objective... (e.g., Should an enterprise migrate from AWS multi-region to on-prem colocation?)"
          rows={3}
          disabled={loading}
          aria-label="Investigation objective inquiry"
          className="w-full bg-[#030610]/90 border border-white/[0.1] rounded-xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-400/80 focus:ring-2 focus:ring-sky-400/20 transition-all font-mono resize-y leading-relaxed shadow-inner"
          id="query-input"
        />

        {isTooShort && (
          <div className="mt-2 flex items-center space-x-2 text-amber-400 text-xs font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Please formulate a detailed inquiry (minimum 10 characters).</span>
          </div>
        )}

        {isTooLong && (
          <div className="mt-2 flex items-center space-x-2 text-rose-400 text-xs font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Inquiry exceeds maximum allowed limit of 2500 characters.</span>
          </div>
        )}
      </div>

      {/* Footer Controls & Execution Trigger */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
        <div className="text-xs text-slate-400 font-mono flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>Pipeline: Orchestrator → Researcher → Verifier (Loop) → Decision Maker</span>
        </div>

        <button
          onClick={onExecute}
          disabled={!isValid || loading}
          className={`px-7 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center space-x-2.5 select-none ${
            loading
              ? "bg-slate-900 text-slate-400 cursor-not-allowed border border-white/[0.06]"
              : isValid
              ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-sky-500/25 active:scale-[0.98]"
              : "bg-slate-900 text-slate-400 cursor-not-allowed border border-white/[0.05]"
          }`}
          id="execute-investigation-btn"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
              <span>Consensus Deliberating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>DELIBERATE & INVESTIGATE</span>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
