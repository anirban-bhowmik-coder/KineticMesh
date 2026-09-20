import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Database, Cpu, ChevronRight } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presets';
import { PresetScenario } from '../types';

interface HeroSectionProps {
  onSelectPreset: (preset: PresetScenario) => void;
  onFocusInput: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectPreset, onFocusInput }) => {
  return (
    <div className="py-8 sm:py-14 relative">
      <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
        
        {/* Subtle Category Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] text-slate-300 text-xs font-mono tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>MULTI-AGENT DELIBERATION & LIVE GROUNDING</span>
        </div>

        {/* Core Headline with Cinematic Realism */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight font-mono leading-[1.15]">
          Think through the decision.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-200 to-sky-400">
            Don't just answer it.
          </span>
        </h1>

        {/* Narrative Description */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans">
          KineticMesh replaces hallucinated single-turn AI answers with an auditable four-agent consensus graph. 
          It plans research vectors, retrieves search-grounded citations, cross-examines contradictory claims, 
          and synthesizes defensible decisions with explicit epistemic boundaries.
        </p>

        {/* Fast Action CTA Button */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
          <button
            onClick={onFocusInput}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold tracking-wider transition-all duration-200 shadow-lg shadow-sky-500/20 active:scale-[0.98] flex items-center space-x-2.5"
            id="start-investigation-hero-btn"
          >
            <span>START INVESTIGATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Strategic Scenarios Grid */}
        <div className="pt-6 text-left">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left flex items-center justify-center sm:justify-start space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>Or test drive a strategic decision scenario:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PRESET_SCENARIOS.slice(0, 3).map((preset) => (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="group cursor-pointer p-4 rounded-xl glass-panel-subtle hover:border-sky-500/40 hover:bg-slate-900/80 transition-all duration-300 text-left flex flex-col justify-between select-none relative shadow-lg"
                id={`preset-hero-${preset.id}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-sky-400 font-semibold uppercase tracking-wider">
                      {preset.domain}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 border border-white/[0.06] text-slate-400">
                      {preset.tag}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-sky-200 transition-colors line-clamp-2 leading-snug">
                    {preset.label}
                  </h4>
                </div>
                
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors">
                  <span>Load scenario</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
