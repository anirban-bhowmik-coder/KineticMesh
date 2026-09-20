import React from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, FileText, Sparkles, Layers, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { DecisionResult } from '../types';

interface DecisionTabProps {
  decision: DecisionResult;
}

export const DecisionTab: React.FC<DecisionTabProps> = ({ decision }) => {
  const confPercent = Math.round(decision.model_assessed_confidence * 100);

  return (
    <div className="space-y-6" id="tab-content-decision">
      
      {/* 1. Defended Recommendation Banner */}
      <div className="glass-panel-elevated specular-top rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Soft atmospheric backlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-sky-300 uppercase">
              Consensus Recommendation // Defended Stance
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-slate-950/80 border border-white/[0.08] text-slate-300">
              Audit ID: {decision.investigation_id}
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-100 font-mono tracking-tight leading-snug">
          {decision.recommendation}
        </h2>
      </div>

      {/* 2. Confidence & Primary Reasons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Model-Assessed Confidence Card */}
        <div className="glass-panel specular-top rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                Model-Assessed Confidence
              </span>
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>

            {/* Circular Gauge Representation */}
            <div className="flex items-center space-x-5 my-3">
              <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Gauge background track */}
                  <path
                    className="text-slate-800/80"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Gauge animated progress stroke */}
                  <path
                    className="text-sky-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${confPercent}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-bold font-mono text-slate-100">{confPercent}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-sky-300 tracking-wider">
                  {confPercent >= 85 ? "HIGH CORROBORATION" : "MODERATE CORROBORATION"}
                </span>
                <p className="text-xs text-slate-400 leading-snug font-sans">
                  Derived from cross-source corroboration strength and empirical ground fidelity.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Passes Completed: {decision.iterations_run}</span>
            <span>Claims Evaluated: {decision.evidence_items.length}</span>
          </div>
        </div>

        {/* Primary Justification Reasons (2 cols on lg) */}
        <div className="lg:col-span-2 glass-panel specular-top rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
              Primary Justification Premises
            </h3>
          </div>

          <div className="space-y-3">
            {decision.primary_reasons.map((reason, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-white/[0.06] hover:border-white/[0.12] transition-colors rounded-xl p-4 flex items-start space-x-3.5 text-xs leading-relaxed text-slate-200"
              >
                <span className="font-mono text-sky-400 font-bold text-xs mt-0.5 select-none bg-sky-500/10 px-2 py-0.5 rounded border border-sky-400/20">
                  0{idx + 1}
                </span>
                <span className="font-sans leading-relaxed pt-0.5">{reason}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Risks & Structural Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Identified Risks */}
        <div className="glass-panel specular-top rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
              Identified Risk Factors & Failure Modes
            </h3>
          </div>
          <div className="space-y-2.5">
            {decision.risks.map((risk, idx) => (
              <div
                key={idx}
                className="bg-amber-500/[0.04] border border-amber-500/15 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed flex items-start space-x-2.5 font-sans"
              >
                <span className="text-amber-400 font-bold select-none">•</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Structural Assumptions */}
        <div className="glass-panel specular-top rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
              Underlying Assumptions & Boundary Conditions
            </h3>
          </div>
          <div className="space-y-2.5">
            {decision.assumptions.map((assumption, idx) => (
              <div
                key={idx}
                className="bg-sky-500/[0.04] border border-sky-500/15 rounded-xl p-3 text-xs text-sky-200/90 leading-relaxed flex items-start space-x-2.5 font-sans"
              >
                <span className="text-sky-400 font-bold select-none">•</span>
                <span>{assumption}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Actionable Next Steps */}
      <div className="glass-panel specular-top rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
            Actionable Execution Sequence (Next Steps)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {decision.next_steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-white/[0.06] hover:border-white/[0.12] transition-colors rounded-xl p-4 space-y-2"
            >
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                PHASE 0{idx + 1}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
