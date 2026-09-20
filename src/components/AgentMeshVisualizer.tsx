import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  ShieldCheck, 
  BrainCircuit, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  Cpu,
  Activity,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentStage } from '../types';

interface AgentMeshVisualizerProps {
  currentStage: AgentStage;
  activeStep: number; // 0=idle, 1=orch, 2=research, 3=verifier, 4=decision, 5=complete
  iterationCount?: number;
}

export const AgentMeshVisualizer: React.FC<AgentMeshVisualizerProps> = ({
  currentStage,
  activeStep,
  iterationCount = 1,
}) => {
  const [inspectedAgentId, setInspectedAgentId] = useState<string | null>(null);
  const isLoopActive = currentStage === "FEEDBACK_LOOP" || iterationCount > 1;

  const agents = [
    {
      id: "orch",
      stepNumber: 1,
      name: "Orchestrator",
      role: "Strategic Scoping",
      desc: "Decomposes inquiries into 3 empirical vectors",
      icon: Compass,
      badge: "Decomposition",
      accent: "cyan",
      spec: {
        task: "Query Decomposition",
        runtime: "Kernel Thread #01",
        input: "User Strategic Objective",
        output: "Empirical Vectors (Economic, Tech, Regulatory)",
      }
    },
    {
      id: "res",
      stepNumber: 2,
      name: "Researcher",
      role: "Empirical Grounding",
      desc: "Live Google Search grounding & data extraction",
      icon: Search,
      badge: "Search Grounded",
      accent: "sky",
      spec: {
        task: "Live Web Grounding",
        runtime: "Kernel Thread #02",
        input: "Decomposed Vector Queries",
        output: "Corroborated Claims & Web Citations",
      }
    },
    {
      id: "ver",
      stepNumber: 3,
      name: "Verifier",
      role: "Epistemic Rigor",
      desc: "Cross-checks claims & isolates contradictions",
      icon: ShieldCheck,
      badge: "Truth State",
      accent: "amber",
      spec: {
        task: "Cross-Corroboration & Discrepancy Isolation",
        runtime: "Kernel Thread #03",
        input: "Grounding Extraction Docket",
        output: "Truth States & Loop Trigger Evaluator",
      }
    },
    {
      id: "dec",
      stepNumber: 4,
      name: "Decision Maker",
      role: "Defended Synthesis",
      desc: "Synthesizes defensible stance & risks",
      icon: BrainCircuit,
      badge: "Confidence Weighted",
      accent: "emerald",
      spec: {
        task: "Executive Synthesis & Risk Deliberation",
        runtime: "Kernel Thread #04",
        input: "Verified Epistemic Triad",
        output: "Defended Recommendation & Phased Steps",
      }
    },
  ];

  const getNodeStatus = (stepNumber: number) => {
    if (activeStep === 0) return "IDLE";
    if (activeStep === stepNumber) {
      if (stepNumber === 3 && currentStage === "FEEDBACK_LOOP") return "FEEDBACK_LOOP";
      return "COMPUTING";
    }
    if (activeStep > stepNumber) return "RESOLVED";
    return "QUEUED";
  };

  const getStatusTelemetry = (status: string, stepNumber: number) => {
    switch (status) {
      case "COMPUTING":
        if (stepNumber === 1) return "VECTORS_ACTIVE (3/3)";
        if (stepNumber === 2) return "GOOGLE_SEARCH_GROUND";
        if (stepNumber === 3) return "CROSS_EXAMINING";
        return "SYNTHESIZING_DEFENSE";
      case "FEEDBACK_LOOP":
        return `LOOP_PASS_0${iterationCount}_ACTIVE`;
      case "RESOLVED":
        return "DOCKET_SEALED";
      case "QUEUED":
        return "WAITING_DEPENDENCY";
      default:
        return "STANDBY";
    }
  };

  return (
    <div 
      className="w-full glass-panel-elevated specular-top rounded-2xl p-5 sm:p-7 relative overflow-hidden transition-all duration-300 shadow-2xl"
      id="agent-mesh-visualizer"
    >
      {/* Subtle atmospheric vignette */}
      <div className="absolute top-0 right-1/4 w-96 h-64 bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Mesh Header & Operational Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900/90 border border-white/[0.08] flex items-center justify-center shadow-inner">
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-100 uppercase">
                Autonomous Agent Topology
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-white/[0.05]">
                4-NODE ARCHITECTURE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans tracking-wide">
              Real-time multi-agent computational coordination & verification consensus graph
            </p>
          </div>
        </div>

        {/* Dynamic Telemetry Status */}
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <div className="flex items-center space-x-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/[0.06]">
            <span className="text-slate-400">Feedback Loop:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              isLoopActive
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 glow-subtle-amber"
                : "bg-slate-900 text-slate-400 border border-white/[0.06]"
            }`}>
              {isLoopActive ? `PASS ${iterationCount} (ACTIVE)` : "STANDBY (PASS 1)"}
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/[0.06]">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Pipeline:</span>
            <span className="text-slate-200 font-medium">
              {activeStep === 0 ? "READY" : activeStep === 5 ? "CONCLUDED" : `STAGE 0${activeStep}/04`}
            </span>
          </div>
        </div>
      </div>

      {/* Computational Interconnect Bus (Architectural visual connection lines) */}
      <div className="hidden lg:block relative mb-6 px-6">
        <div className="h-1.5 w-full bg-slate-900/90 rounded-full border border-white/[0.05] relative overflow-hidden flex items-center">
          {/* Active progress rail */}
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ 
              width: activeStep === 0 ? "0%" : activeStep === 5 ? "100%" : `${(activeStep / 4) * 100}%` 
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Animated data packet pulses along active bus */}
          {activeStep > 0 && activeStep < 5 && (
            <motion.div
              className="absolute top-0 bottom-0 w-16 bg-white/40 blur-sm rounded-full pointer-events-none"
              animate={{ x: ["-100%", "800%"] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            />
          )}
        </div>

        {/* Feedback loop return trace indicator */}
        {isLoopActive && (
          <motion.div 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 flex items-center justify-center space-x-2 text-[10px] font-mono text-amber-300"
          >
            <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
            <span>Telemetry Bus // Bi-directional return rail active (Verifier → Researcher re-query loop)</span>
          </motion.div>
        )}
      </div>

      {/* The 4 Computational Agent Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {agents.map((agent) => {
          const status = getNodeStatus(agent.stepNumber);
          const Icon = agent.icon;
          const isActive = status === "COMPUTING" || status === "FEEDBACK_LOOP";
          const isResolved = status === "RESOLVED";
          const isInspected = inspectedAgentId === agent.id;
          const telemetryText = getStatusTelemetry(status, agent.stepNumber);

          return (
            <div
              key={agent.id}
              onClick={() => setInspectedAgentId(isInspected ? null : agent.id)}
              className={`group cursor-pointer rounded-xl p-4 sm:p-5 border transition-all duration-300 relative flex flex-col justify-between select-none ${
                isActive
                  ? "bg-slate-900/90 border-sky-500/40 glow-subtle-cyan shadow-xl ring-1 ring-sky-500/20"
                  : isResolved
                  ? "bg-slate-900/50 border-emerald-500/30 hover:border-emerald-500/50 text-slate-200"
                  : "bg-slate-950/40 border-white/[0.05] hover:border-white/[0.12] text-slate-400"
              }`}
              id={`agent-node-${agent.id}`}
            >
              {/* Subtle top edge highlight */}
              <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />

              {/* Node Top Header */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  {/* Node Icon Box with realistic mechanical border */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                    isActive
                      ? "bg-sky-500/10 border-sky-400/40 text-sky-300 shadow-sm shadow-sky-500/20"
                      : isResolved
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-900/80 border-white/[0.06] text-slate-400"
                  }`}>
                    {isResolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                    )}
                  </div>

                  {/* Status Indicator Chip */}
                  <div className="flex items-center space-x-1.5">
                    {isActive && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                      </span>
                    )}
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
                      isActive
                        ? "bg-sky-500/15 text-sky-300 border-sky-400/30"
                        : isResolved
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : "bg-slate-900/80 text-slate-400 border-white/[0.05]"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Node Metadata & Labels */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>THREAD 0{agent.stepNumber}</span>
                    <span className="text-slate-400">{agent.role}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 font-mono tracking-wide flex items-center justify-between">
                    <span>{agent.name}</span>
                    <span className="text-[10px] font-normal text-slate-400 group-hover:text-slate-300 transition-colors">
                      {isInspected ? "Collapse" : "Inspect"}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                    {agent.desc}
                  </p>
                </div>
              </div>

              {/* Node Telemetry Footer */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                <span className={`truncate max-w-[140px] font-medium ${
                  isActive ? "text-sky-300 animate-pulse" : isResolved ? "text-emerald-400" : "text-slate-400"
                }`}>
                  {telemetryText}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/[0.06] text-slate-400">
                  {agent.badge}
                </span>
              </div>

              {/* Collapsible Inspection Panel (Micro-HUD) */}
              <AnimatePresence>
                {isInspected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="mt-3 pt-3 border-t border-white/[0.08] text-[10px] font-mono space-y-1.5 text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-white/[0.04]"
                  >
                    <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.05] pb-1">
                      <span>COMPUTE SPEC</span>
                      <span className="text-sky-400">{agent.spec.runtime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Task: </span>
                      <span className="text-slate-200">{agent.spec.task}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Input: </span>
                      <span className="text-slate-300">{agent.spec.input}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Output: </span>
                      <span className="text-slate-300">{agent.spec.output}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Dynamic Feedback Loop Banner (Subtle, purposeful atmospheric alert) */}
      <AnimatePresence>
        {isLoopActive && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 bg-amber-500/[0.08] border border-amber-500/25 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-amber-200 shadow-inner"
          >
            <div className="flex items-center space-x-2.5">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span className="font-semibold tracking-wide">
                DYNAMIC VERIFICATION FEEDBACK LOOP ENGAGED // PASS {iterationCount}
              </span>
            </div>
            <span className="text-[11px] text-amber-300/80 font-sans">
              Contradiction or uncertainty threshold triggered targeted secondary empirical verification.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
