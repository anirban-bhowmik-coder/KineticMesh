import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, Clock, Terminal, Activity, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { AgentStage, AgentTelemetryEvent } from '../types';

interface LiveInvestigationProgressProps {
  currentStage: AgentStage;
  traceLogs: string[];
  activeStep: number;
  latestEvent?: AgentTelemetryEvent | null;
}

export const LiveInvestigationProgress: React.FC<LiveInvestigationProgressProps> = ({
  currentStage,
  traceLogs,
  activeStep,
  latestEvent,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 100) / 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [traceLogs.length]);

  const stageMeta: Record<string, { title: string; color: string; badge: string }> = {
    ORCHESTRATING: {
      title: "STAGE 01 // ORCHESTRATION & EMPIRICAL DECOMPOSITION",
      color: "text-sky-400",
      badge: "VECTORS_DECOMPOSITION",
    },
    RESEARCHING: {
      title: "STAGE 02 // EMPIRICAL GROUNDING & CITATION HARVEST",
      color: "text-blue-400",
      badge: "SEARCH_GROUNDING",
    },
    VERIFYING: {
      title: "STAGE 03 // EPISTEMIC AUDIT & CONTRADICTION CHECK",
      color: "text-amber-400",
      badge: "TRUTH_STATE_AUDIT",
    },
    FEEDBACK_LOOP: {
      title: "STAGE 03.5 // DYNAMIC VERIFICATION FEEDBACK LOOP",
      color: "text-amber-300",
      badge: "DYNAMIC_FEEDBACK_PASS_02",
    },
    SYNTHESIZING: {
      title: "STAGE 04 // DEFENDED STANCE & RISK ENVELOPE SYNTHESIS",
      color: "text-emerald-400",
      badge: "EXECUTIVE_SYNTHESIS",
    },
    COMPLETE: {
      title: "STAGE 05 // CONSENSUS REACHED & AUDIT SEALED",
      color: "text-emerald-400",
      badge: "DELIBERATION_SEALED",
    },
    ERROR: {
      title: "PIPELINE ADAPTATION IN PROGRESS",
      color: "text-rose-400",
      badge: "FAULT_RECOVERY",
    },
  };

  const activeMeta = stageMeta[currentStage] || {
    title: "CONSENSUS MESH ACTIVE",
    color: "text-sky-400",
    badge: "DELIBERATING",
  };

  const currentStatusMessage = latestEvent?.message || "Coordinating multi-agent consensus graph...";

  return (
    <div 
      className="glass-panel specular-top rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4" 
      id="live-progress-panel"
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-sky-400/30 flex items-center justify-center shadow-md">
            <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono font-bold tracking-wider ${activeMeta.color}`}>
                {activeMeta.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/[0.06] text-slate-400">
                {latestEvent?.status || activeMeta.badge}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-sans pt-0.5 font-medium">
              {currentStatusMessage}
            </p>
          </div>
        </div>

        {/* Real Backend Telemetry Badges & Elapsed Counter */}
        <div className="flex items-center space-x-2">
          {latestEvent?.iteration && latestEvent.iteration > 1 && (
            <div className="flex items-center space-x-1.5 text-xs font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 text-amber-300">
              <Activity className="w-3.5 h-3.5" />
              <span>PASS {latestEvent.iteration}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-white/[0.06] text-slate-300 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>ELAPSED: {elapsed.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Live Stream Logs */}
      <div className="bg-[#030610]/95 rounded-xl p-3.5 border border-white/[0.06] font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto space-y-1.5 scrollbar-thin shadow-inner">
        <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.05] pb-1.5 mb-1.5 text-[10px]">
          <span className="flex items-center space-x-1.5">
            <Terminal className="w-3 h-3 text-sky-400" />
            <span className="font-semibold text-slate-300">REAL-TIME AGENT TELEMETRY</span>
          </span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>EVENT STREAM ACTIVE</span>
          </span>
        </div>
        {traceLogs.length > 0 ? (
          traceLogs.map((log, i) => (
            <div key={i} className="leading-relaxed flex items-start space-x-2">
              <span className="text-sky-500 select-none">›</span>
              <span className={log.includes("FEEDBACK") || log.includes("PASS 2") ? "text-amber-300 font-semibold" : ""}>
                {log}
              </span>
            </div>
          ))
        ) : (
          <div className="text-slate-500 italic text-[11px]">Connecting to backend telemetry event stream...</div>
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
