import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  ExternalLink, 
  Database, 
  HelpCircle as QuestionIcon, 
  Lightbulb, 
  BookmarkCheck,
  Filter
} from 'lucide-react';
import { DecisionResult, GroundedClaim, VerificationStatus } from '../types';

interface EvidenceGapsTabProps {
  decision: DecisionResult;
}

export const EvidenceGapsTab: React.FC<EvidenceGapsTabProps> = ({ decision }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredClaims = decision.evidence_items.filter((claim) => {
    if (filter === 'ALL') return true;
    return claim.verification_status.toUpperCase() === filter.toUpperCase();
  });

  const isSafeHttpUrl = (url?: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>VERIFIED</span>
          </span>
        );
      case 'Conflicting':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>CONFLICTING</span>
          </span>
        );
      case 'Uncertain':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <HelpCircle className="w-3 h-3" />
            <span>UNCERTAIN</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-slate-400 border border-white/[0.06]">
            <XCircle className="w-3 h-3" />
            <span>UNSUPPORTED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" id="tab-content-evidence">
      
      {/* 1. EPISTEMIC TRIAD (Facts vs Inferences vs Uncertainties) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* FACTS */}
        <div className="glass-panel specular-top rounded-2xl p-5 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center space-x-2">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Corroborated Facts
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25 font-bold">
              {decision.facts.length}
            </span>
          </div>
          <div className="space-y-2">
            {decision.facts.map((f, i) => (
              <div key={i} className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/[0.05] font-sans">
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* INFERENCES */}
        <div className="glass-panel specular-top rounded-2xl p-5 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Logical Inferences
              </span>
            </div>
            <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/25 font-bold">
              {decision.inferences.length}
            </span>
          </div>
          <div className="space-y-2">
            {decision.inferences.map((inf, i) => (
              <div key={i} className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/[0.05] font-sans">
                {inf}
              </div>
            ))}
          </div>
        </div>

        {/* UNCERTAINTIES & GAPS */}
        <div className="glass-panel specular-top rounded-2xl p-5 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center space-x-2">
              <QuestionIcon className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Uncertainties & Gaps
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/25 font-bold">
              {decision.uncertainties.length}
            </span>
          </div>
          <div className="space-y-2">
            {decision.uncertainties.map((u, i) => (
              <div key={i} className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/[0.04] p-3 rounded-xl border border-amber-500/20 font-sans">
                {u}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. GROUNDED CLAIMS DOCKET */}
      <div className="glass-panel specular-top rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
        
        {/* Docket Header & Interactive Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-white/[0.08] flex items-center justify-center">
              <Database className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Grounded Claims Docket ({decision.evidence_items.length})
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400 text-[11px]">Filter:</span>
            {['ALL', 'VERIFIED', 'CONFLICTING', 'UNCERTAIN'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all duration-150 select-none ${
                  filter === status
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm shadow-sky-500/30'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-white/[0.06] active:scale-[0.98]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Claims Cards */}
        <div className="space-y-3.5">
          {filteredClaims.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-slate-400 bg-slate-950/40 rounded-xl border border-white/[0.05]">
              No claims match current filter "{filter}".
            </div>
          ) : (
            filteredClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-slate-950/60 border border-white/[0.06] hover:border-white/[0.14] rounded-xl p-5 space-y-3.5 transition-all duration-200 shadow-sm"
                id={`claim-${claim.id}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sky-400 font-semibold tracking-wider bg-sky-500/10 px-2 py-0.5 rounded border border-sky-400/20">
                    {claim.id}
                  </span>
                  {getStatusBadge(claim.verification_status)}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {claim.claim_text}
                </p>

                {/* Verifier Note */}
                <div className="bg-[#030610] border border-white/[0.06] rounded-lg p-3 text-xs font-mono text-slate-400">
                  <span className="text-slate-300 font-semibold uppercase">Verifier Note: </span>
                  <span className="text-slate-300 font-sans">{claim.verification_note}</span>
                </div>

                {/* Grounding Source Citations Chips */}
                {claim.sources && claim.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-slate-400">Citations:</span>
                    {claim.sources.map((src, idx) => {
                      const safe = isSafeHttpUrl(src.url);
                      return safe ? (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center space-x-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-sky-300 hover:text-sky-200 border border-white/[0.08] hover:border-sky-400/40 transition-all duration-150 max-w-xs truncate shadow-sm active:scale-[0.98]"
                        >
                          <span className="truncate">{src.title || src.url}</span>
                          <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                        </a>
                      ) : (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-400 border border-white/[0.08] max-w-xs truncate"
                        >
                          <span className="truncate">{src.title || 'Citation'}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
