import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  Search, 
  Download, 
  Check, 
  Layers, 
  FileText, 
  Activity,
  AlertCircle,
  Terminal,
  Cpu,
  Globe,
  Compass,
  Radar,
  ListOrdered
} from 'lucide-react';

const PRESET_QUERIES = [
  {
    id: "PAYLOAD_01",
    tag: "ENERGY_CAPEX",
    label: "🇪🇸 Iberian Solar & Battery Storage",
    query: "Should a commercial distribution warehouse in Valencia invest in on-site solar PV with battery storage under 2024-2026 Iberian electricity market tariffs?"
  },
  {
    id: "PAYLOAD_02",
    tag: "INFRA_OPEX",
    label: "☁️ AWS Multi-Region vs On-Prem",
    query: "Should a mid-market healthcare SaaS company migrate from AWS multi-region to on-premises colocation to reduce infrastructure OpEx in 2025?"
  },
  {
    id: "PAYLOAD_03",
    tag: "AGENT_AI",
    label: "🤖 Enterprise LLM Architecture",
    query: "Should a global financial consultancy deploy self-hosted open-source models (Llama 3) or proprietary API endpoints (Gemini 2.5) for sensitive client audit workflows?"
  }
];

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('decision'); // 'decision' | 'epistemic' | 'evidence' | 'telemetry'
  const [copied, setCopied] = useState(false);
  const [traceLogs, setTraceLogs] = useState([]);

  const workflowSteps = [
    { code: "01", title: "ORCHESTRATOR", desc: "Decomposing query into 3 domain-specific research vectors", status: "PLANNING" },
    { code: "02", title: "RESEARCHER", desc: "Executing live Google Search grounding with URL metadata provenance", status: "RETRIEVING" },
    { code: "03", title: "VERIFIER", desc: "Cross-corroborating findings & isolating contradictory claims", status: "CHALLENGING" },
    { code: "04", title: "DECISION_MAKER", desc: "Formulating defended recommendation & risk disclosures", status: "SYNTHESIZING" }
  ];

  const addTrace = (msg) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setTraceLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleInvestigate = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setStep(0);
    setTraceLogs([]);

    addTrace("PIPELINE_INIT // Initiating 4-Agent consensus graph.");
    addTrace("ORCHESTRATOR // Analyzing constraints and building research plan.");

    const stepInterval = setInterval(() => {
      setStep((prev) => {
        if (prev === 0) {
          addTrace("RESEARCHER // Querying Google Search Grounding with Gemini.");
          return 1;
        }
        if (prev === 1) {
          addTrace("VERIFIER // Evaluating claim provenance and cross-referencing sources.");
          return 2;
        }
        if (prev === 2) {
          addTrace("DECISION_MAKER // Synthesizing verified evidence and isolating risk factors.");
          return 3;
        }
        return prev;
      });
    }, 1300);

    try {
      const response = await fetch('/api/v1/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      clearInterval(stepInterval);
      setStep(4);
      addTrace(`CONSENSUS_REACHED // Stance: ${data.recommendation.substring(0, 45)}...`);
      addTrace(`EVALUATION_COMPLETE // Audit ID: ${data.investigation_id || 'LOCAL-EXEC'}`);
      setResult(data);
    } catch (err) {
      clearInterval(stepInterval);
      addTrace(`EXECUTION_ERROR // ${err.message}`);
      setError(err.message || 'Deliberation execution interrupted.');
    } finally {
      setLoading(false);
    }
  };

  const copyReportMarkdown = () => {
    if (!result) return;
    const conf = result.model_assessed_confidence ?? result.confidence_score ?? 0.8;
    const md = `# KIRO DEFENDED DECISION REPORT
// INVESTIGATION_ID: ${result.investigation_id || 'N/A'}
// QUERY: ${result.original_query}
// STANCE: ${result.recommendation}
// RELIABILITY_METRIC: ${(conf * 100).toFixed(0)}%
// CYCLES: ${result.iterations_run || 1}

---
### CORE JUSTIFICATION PREMISES
${(result.primary_reasons || []).map((r, i) => `${i + 1}. ${r}`).join('\n')}

---
### EMPIRICAL FACTS (Corroborated)
${(result.facts || []).map(f => `- ${f}`).join('\n')}

---
### LOGICAL INFERENCES
${(result.inferences || []).map(inf => `- ${inf}`).join('\n')}

---
### UNCERTAINTIES & MISSING DATA
${(result.uncertainties || []).map(u => `- ${u}`).join('\n')}

---
### IDENTIFIED RISKS
${(result.risks || []).map(r => `- ${r}`).join('\n')}

---
### RECOMMENDED ACTION STEPS
${(result.next_steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

---
### VERIFIED EVIDENCE LOG
${(result.evidence_items || []).map(e => `[${e.verification_status}] "${e.claim_text}"\nFinding: ${e.verification_note}\nSources: ${(e.sources || []).map(s => s.url).join(', ')}`).join('\n\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            CORROBORATED
          </span>
        );
      case 'Conflicting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] font-bold bg-amber-950/80 text-amber-400 border border-amber-500/50">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            CONFLICT_DETECTED
          </span>
        );
      case 'Uncertain':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] font-bold bg-sky-950/80 text-sky-400 border border-sky-500/40">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            DATA_GAP
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            UNSUPPORTED
          </span>
        );
    }
  };

  const confidenceScore = result ? (result.model_assessed_confidence ?? result.confidence_score ?? 0.8) : 0;

  return (
    <div className="min-h-screen text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Telemetry Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 font-mono font-black text-lg shadow-inner">
              K/
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-tight text-white text-base">KIRO</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  SYSTEM_V2.5
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 hidden sm:block">AUTONOMOUS_DECISION_FRAMEWORK</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 font-mono text-xs text-slate-400 border-r border-slate-800 pr-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                STATUS: READY
              </span>
              <span className="text-slate-600">|</span>
              <span>LATENCY: 14MS</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400">GROUNDING: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                4-AGENT_DAG
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Console Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        {/* Tactical Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs tracking-wider">
            <Radar className="w-3.5 h-3.5 animate-spin" />
            GROUNDED_EVIDENCE_SYSTEM
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Don't just get an answer. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-mono">
              Get a decision you can defend.
            </span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto font-sans">
            Autonomous multi-agent consensus architecture. KIRO gathers search-grounded evidence, isolates contradictory claims, and delivers auditable recommendations.
          </p>
        </div>

        {/* Terminal Input Station */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl mb-10 glow-emerald">
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>inquiry_console.sh</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
          </div>

          <form onSubmit={handleInvestigate} className="p-6 sm:p-8 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="text-slate-600">//</span> 01. ENTER_OBJECTIVE
                </span>
                <span>TOKEN_LIMIT: 1000</span>
              </div>
              <textarea
                rows={3}
                className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm resize-none shadow-inner"
                placeholder="Enter strategic, capital, or regulatory problem to investigate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Tactical Scenario Chips */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-slate-600">//</span> PRE-CONFIGURED_PAYLOADS:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {PRESET_QUERIES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setQuery(preset.query)}
                    className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mb-1">
                      <span>{preset.id}</span>
                      <span className="group-hover:text-emerald-400 transition-colors">{preset.tag}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-300 group-hover:text-white">
                      {preset.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>GOOGLE_SEARCH_GROUNDING_READY</span>
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    EXECUTING_PIPELINE...
                  </>
                ) : (
                  <>
                    INITIALIZE_INVESTIGATION
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Stepper Lifecycle */}
          {loading && (
            <div className="p-6 sm:p-8 bg-slate-900/40 border-t border-slate-850 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  AGENT_CONSENSUS_LIFECYCLE
                </span>
                <span className="text-slate-500">BOUNDED_FEEDBACK_PASS: 01</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workflowSteps.map((agent, index) => {
                  const isDone = step > index;
                  const isCurrent = step === index;
                  return (
                    <div
                      key={agent.code}
                      className={`p-4 rounded-xl border font-mono transition-all ${
                        isCurrent
                          ? "bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/5"
                          : isDone
                          ? "bg-slate-950/80 border-slate-850 text-slate-400"
                          : "bg-slate-950/40 border-slate-900 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold ${isCurrent ? "text-emerald-400" : isDone ? "text-slate-200" : "text-slate-600"}`}>
                          [{agent.code}] {agent.title}
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed font-sans text-slate-400">{agent.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-950/40 border-t border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Deck */}
        {result && (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 border border-slate-800 p-2 rounded-xl">
              <div className="flex items-center gap-1.5 w-full sm:w-auto font-mono text-xs">
                <button
                  onClick={() => setActiveTab('decision')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'decision'
                      ? "bg-emerald-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  [01] SYNTHESIS
                </button>
                <button
                  onClick={() => setActiveTab('epistemic')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'epistemic'
                      ? "bg-emerald-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  [02] FACTS_&_GAPS
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'evidence'
                      ? "bg-emerald-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  [03] EVIDENCE_LOG ({result.evidence_items?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'telemetry'
                      ? "bg-emerald-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  [04] AGENT_TELEMETRY
                </button>
              </div>

              <button
                onClick={copyReportMarkdown}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-xs font-mono text-slate-300 transition-all border border-slate-800"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                {copied ? "REPORT_COPIED_TO_CLIPBOARD" : "EXPORT_DEFENDED_DOCKET"}
              </button>
            </div>

            {/* TAB 1: DECISION CORE */}
            {activeTab === 'decision' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-8 p-6 sm:p-8">
                {/* Headline Stance Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-emerald-400 font-bold tracking-widest">// DEFENDED_STANCE</span>
                        {result.iterations_run > 1 && (
                          <span className="bg-sky-950 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded text-[10px]">
                            {result.iterations_run}_CYCLES_RUN
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        {result.recommendation}
                      </h2>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl text-center sm:text-right min-w-[160px] font-mono">
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">CONFIDENCE_SCORE</div>
                      <div className="text-4xl font-black text-emerald-400 mt-1">
                        {(confidenceScore * 100).toFixed(0)}%
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">MODEL_ASSESSED</div>
                    </div>
                  </div>
                </div>

                {/* Justifications */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    // JUSTIFICATION_PREMISES
                  </h3>
                  <div className="space-y-2.5">
                    {(result.primary_reasons || []).map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-850 text-sm text-slate-200">
                        <span className="font-mono text-xs text-emerald-400 mt-0.5">0{idx + 1}.</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks & Assumptions Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-amber-950/10 border border-amber-500/20 rounded-xl p-5 space-y-3 font-mono">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      // IDENTIFIED_RISKS
                    </h4>
                    <ul className="space-y-2 text-xs font-sans text-slate-300">
                      {(result.risks || []).map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3 font-mono">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      // STRUCTURAL_ASSUMPTIONS
                    </h4>
                    <ul className="space-y-2 text-xs font-sans text-slate-300">
                      {(result.assumptions || []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    // ACTIONABLE_EXECUTION_SEQUENCE
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {(result.next_steps || []).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 text-xs sm:text-sm text-slate-200">
                        <span className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FACTS, INFERENCES & UNCERTAINTIES */}
            {activeTab === 'epistemic' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: FACTS */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800 font-mono text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white uppercase tracking-wider">EMPIRICAL_FACTS</h3>
                      <p className="text-[10px] text-slate-500 font-sans">Corroborated by verified sources</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {(result.facts && result.facts.length > 0) ? (
                      result.facts.map((fact, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 text-xs text-slate-200">
                          {fact}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic font-mono">// No discrete empirical facts recorded.</p>
                    )}
                  </div>
                </div>

                {/* Column 2: INFERENCES */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800 font-mono text-xs">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <div>
                      <h3 className="font-bold text-white uppercase tracking-wider">LOGICAL_INFERENCES</h3>
                      <p className="text-[10px] text-slate-500 font-sans">Deductions based on verified data</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {(result.inferences && result.inferences.length > 0) ? (
                      result.inferences.map((inf, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 text-xs text-slate-200">
                          {inf}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic font-mono">// No derived inferences recorded.</p>
                    )}
                  </div>
                </div>

                {/* Column 3: UNCERTAINTIES */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800 font-mono text-xs">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white uppercase tracking-wider">DATA_GAPS_&_UNCERTAINTIES</h3>
                      <p className="text-[10px] text-slate-500 font-sans">Unresolved parameters</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {(result.uncertainties && result.uncertainties.length > 0) ? (
                      result.uncertainties.map((unc, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/20 text-xs text-amber-300">
                          {unc}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic font-mono">// Zero data gaps isolated.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EVIDENCE DOCKET */}
            {activeTab === 'evidence' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white">// EVIDENCE_AUDIT_DOCKET</h3>
                    <p className="text-xs text-slate-400">Claims cross-checked across live Google Search grounding chunks.</p>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded">
                    {result.evidence_items?.length || 0}_EVIDENCE_NODES
                  </span>
                </div>

                <div className="space-y-4">
                  {(result.evidence_items || []).map((item) => (
                    <div key={item.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-850 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          ID: {item.id}
                        </span>
                        <div>{getStatusBadge(item.verification_status)}</div>
                      </div>

                      <p className="text-sm font-semibold text-white">
                        "{item.claim_text}"
                      </p>

                      <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                        <span className="font-mono font-bold text-emerald-400">VERIFIER_FINDING: </span>
                        {item.verification_note || "Evaluated by Verifier Agent."}
                      </div>

                      {item.sources && item.sources.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                            // GROUNDED_WEB_PROVENANCE:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.sources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30 hover:border-emerald-400 transition-all"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {src.title || src.url}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: LIVE TELEMETRY LOG */}
            {activeTab === 'telemetry' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="text-emerald-400">// AGENT_EXECUTION_TIMELINE</span>
                  <span className="text-slate-500">{traceLogs.length} LOG_ENTRIES</span>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850 space-y-2 text-xs text-slate-300 max-h-96 overflow-y-auto">
                  {traceLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 select-none">&gt;</span>
                      <span className={log.includes("ERROR") ? "text-rose-400" : log.includes("COMPLETE") ? "text-emerald-300 font-bold" : ""}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Terminal Colophon Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div>
            <span>KIRO // VERIFIED DECISION ENGINE</span>
            <span className="mx-2">•</span>
            <span>GOOGLE GENAI AGENTIC PIPELINE</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FASTAPI</span>
            <span>•</span>
            <span>GEMINI 2.5 / 3.x</span>
            <span>•</span>
            <span>GOOGLE CLOUD RUN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}