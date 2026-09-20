import React, { useState } from 'react';
import { DecisionResult } from '../types';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  ShieldCheck,
  Search
} from 'lucide-react';

interface RunTraceTabProps {
  decision: DecisionResult;
  traceLogs: string[];
}

export const RunTraceTab: React.FC<RunTraceTabProps> = ({ decision, traceLogs }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = `KINETICMESH DELIBERATION AUDIT DOCKET
Investigation ID: ${decision.investigation_id}
Original Inquiry: ${decision.original_query}
Recommendation: ${decision.recommendation}
Calibrated Confidence: ${(decision.confidence_score * 100).toFixed(1)}%
Passes Run: ${decision.iterations_run}
Grounding Engine: ${decision.audit_metadata?.grounding_mode || 'Institutional Grounding'}
Model: ${decision.audit_metadata?.model_name || 'gemini-3.6-flash'}

PRIMARY REASONS:
${decision.primary_reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

EVALUATED EVIDENCE ITEMS:
${decision.evidence_items.map((e) => `[${e.verification_status.toUpperCase()}] ${e.claim_text} (${e.verification_note})`).join('\n')}

DOWNSIDE RISKS:
${decision.risks.map((r, i) => `• ${r}`).join('\n')}

NEXT STEPS:
${decision.next_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(decision, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kineticmesh-${decision.investigation_id.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compile full trace from active logs or backend execution trace
  const activeTrace = traceLogs.length > 0 
    ? traceLogs 
    : (decision.audit_metadata?.execution_trace || []).map(
        (t) => `[${t.timestamp}] ${t.agent.toUpperCase()} // ${t.message}`
      );

  const groundingLabel = 
    decision.audit_metadata?.grounding_mode === 'live_google_search'
      ? 'Google Search Grounding'
      : decision.audit_metadata?.grounding_mode === 'parametric_grounded'
      ? 'Parametric Benchmark'
      : 'Institutional Grounding';

  const verifiedCount = decision.audit_metadata?.verified_claims_count ?? 
    decision.evidence_items.filter(c => c.verification_status === 'Verified').length;
  const conflictCount = decision.audit_metadata?.conflicting_claims_count ?? 
    decision.evidence_items.filter(c => c.verification_status === 'Conflicting').length;
  const uncertainCount = decision.audit_metadata?.uncertain_claims_count ?? 
    decision.evidence_items.filter(c => c.verification_status === 'Uncertain').length;

  return (
    <div className="space-y-6" id="tab-content-telemetry">
      
      {/* Top Telemetry Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel specular-top rounded-xl p-4 space-y-1 font-mono shadow-md">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Investigation ID</span>
          <div className="text-xs font-bold text-sky-400 truncate">
            {decision.investigation_id}
          </div>
        </div>

        <div className="glass-panel specular-top rounded-xl p-4 space-y-1 font-mono shadow-md">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Consensus Passes</span>
          <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
            <span>{decision.iterations_run} Pass{decision.iterations_run > 1 ? 'es' : ''}</span>
            {decision.iterations_run > 1 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                LOOP RESOLVED
              </span>
            )}
          </div>
        </div>

        <div className="glass-panel specular-top rounded-xl p-4 space-y-1 font-mono shadow-md">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Foundation Model</span>
          <div className="text-xs font-bold text-slate-200 truncate">
            {decision.audit_metadata?.model_name || 'gemini-3.6-flash'}
          </div>
        </div>

        <div className="glass-panel specular-top rounded-xl p-4 space-y-1 font-mono shadow-md">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Grounding Mode</span>
          <div className="text-xs font-bold text-blue-400 truncate">
            {groundingLabel}
          </div>
        </div>
      </div>

      {/* Epistemic Truth Audit Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="glass-panel specular-top rounded-xl p-3.5 flex items-center space-x-3 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300 font-mono">{verifiedCount} Verified Claims</div>
            <div className="text-[10px] text-slate-400">Supported by institutional or search citations</div>
          </div>
        </div>

        <div className="glass-panel specular-top rounded-xl p-3.5 flex items-center space-x-3 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 font-mono">{conflictCount} Contradictions Isolated</div>
            <div className="text-[10px] text-slate-400">Adjudicated during verification loop</div>
          </div>
        </div>

        <div className="glass-panel specular-top rounded-xl p-3.5 flex items-center space-x-3 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-300 font-mono">{uncertainCount} Bounded Uncertainties</div>
            <div className="text-[10px] text-slate-400">Catalogued in risk envelope</div>
          </div>
        </div>
      </div>

      {/* Main Trace & JSON Box */}
      <div className="glass-panel specular-top rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-white/[0.08] flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Execution Trace & Telemetry Stream
            </h3>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleCopySummary}
              className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-150 flex items-center space-x-1.5 shadow-sm active:scale-[0.98]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/15 text-sky-200 border border-sky-400/30 hover:border-sky-400/50 transition-all duration-150 flex items-center space-x-1.5 shadow-sm active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Trace Stream Logs */}
        <div className="bg-[#030610] rounded-xl p-4 border border-white/[0.06] font-mono text-xs text-slate-300 space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin shadow-inner">
          <div className="text-slate-400 text-[10px] pb-1.5 border-b border-white/[0.05] mb-2 font-semibold flex items-center justify-between">
            <span>// AUDIT PIPELINE CHRONOLOGY LOG</span>
            <span className="text-emerald-400">{activeTrace.length} EVENTS RECORDED</span>
          </div>
          {activeTrace.length > 0 ? (
            activeTrace.map((log, i) => (
              <div key={i} className="flex items-start space-x-2.5 leading-relaxed">
                <span className="text-sky-500 select-none">›</span>
                <span className={log.includes("FEEDBACK") || log.includes("PASS 2") ? "text-amber-300 font-semibold" : ""}>
                  {log}
                </span>
              </div>
            ))
          ) : (
            <div className="text-slate-400 italic text-xs">No execution trace events available.</div>
          )}
        </div>

        {/* Raw JSON Preview */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Complete Cryptographic Audit Payload:</span>
            <span className="text-[10px] text-slate-400">application/json</span>
          </div>
          <pre className="bg-[#030610] p-4 rounded-xl border border-white/[0.06] text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60 scrollbar-thin shadow-inner">
            {JSON.stringify(decision, null, 2)}
          </pre>
        </div>
      </div>

    </div>
  );
};
