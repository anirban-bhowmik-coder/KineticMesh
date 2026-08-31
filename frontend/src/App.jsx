import React, { useState } from 'react';
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
  Cpu,
  Layers,
  FileText,
  Activity
} from 'lucide-react';

const PRESET_QUERIES = [
  {
    label: "🇪🇸 Iberian Solar & Battery Storage",
    query: "Should a commercial distribution warehouse in Valencia invest in on-site solar PV with battery storage under 2024-2026 Iberian electricity market tariffs?"
  },
  {
    label: "☁️ Cloud Migration vs On-Prem",
    query: "Should a mid-market healthcare SaaS company migrate from AWS multi-region to on-premises colocation to reduce infrastructure OpEx in 2025?"
  },
  {
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
  const [activeTab, setActiveTab] = useState('decision'); // 'decision' | 'evidence' | 'trace'
  const [copied, setCopied] = useState(false);

  const workflowSteps = [
    { title: "Orchestrator Agent", desc: "Decomposing query into epistemic research vectors", status: "Planning" },
    { title: "Researcher Agent", desc: "Retrieving grounded sources via Google Search & Gemini", status: "Retrieving" },
    { title: "Verifier Agent", desc: "Cross-corroborating claims & isolating conflicting data", status: "Fact-Checking" },
    { title: "Decision Maker Agent", desc: "Formulating defensible recommendation & risk matrix", status: "Synthesizing" }
  ];

  const handleInvestigate = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1100);

    try {
      const response = await fetch('http://localhost:8000/api/v1/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      clearInterval(stepInterval);
      setStep(4);
      setResult(data);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || 'Error occurred during agent deliberation pipeline.');
    } finally {
      setLoading(false);
    }
  };

  const copyReportMarkdown = () => {
    if (!result) return;
    const md = `# KIRO DEFENDED DECISION REPORT
**Query:** ${result.original_query}
**Recommendation:** ${result.recommendation}
**Confidence Score:** ${(result.confidence_score * 100).toFixed(0)}%

## CORE JUSTIFICATIONS
${result.primary_reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## IDENTIFIED RISKS
${result.risks.map(r => `- ${r}`).join('\n')}

## STRUCTURAL ASSUMPTIONS
${result.assumptions.map(a => `- ${a}`).join('\n')}

## RECOMMENDED ACTION PLAN
${result.next_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## VERIFIED EVIDENCE TRAIL
${result.evidence_items.map(e => `[${e.verification_status}] "${e.claim_text}" - Note: ${e.verification_note}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Corroborated & Verified
          </span>
        );
      case 'Conflicting':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Conflicting Market Data
          </span>
        );
      case 'Uncertain':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" /> Uncertain / Data Gap
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Unsupported
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">KIRO</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Epistemic Multi-Agent Intelligence Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gemini 2.5 Flash DAG</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Don't just get an answer. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Get a decision you can defend.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            Autonomous 4-agent consensus engine. KIRO cross-examines market data, isolates hidden contradictions, and outputs verifiable decisions with full audit trails.
          </p>
        </div>

        {/* Input & Deliberation Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 mb-10">
          <form onSubmit={handleInvestigate}>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="decision-inquiry" className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                Strategic Decision Inquiry
              </label>
              <span className="text-xs text-slate-500">Grounded via Google Search Tools</span>
            </div>

            <textarea
              id="decision-inquiry"
              rows={3}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base resize-none shadow-inner"
              placeholder="Enter your strategic or capital allocation inquiry..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />

            {/* Quick Scenario Pills */}
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-400 mb-2">Test Pre-Configured Benchmark Scenarios:</div>
              <div className="flex flex-wrap gap-2">
                {PRESET_QUERIES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(preset.query)}
                    className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-all text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>4 Discrete Agents • Zero parametric hallucinations</span>
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Agent Pipeline Deliberating...
                  </>
                ) : (
                  <>
                    Investigate & Defend
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Real-time Agent Progress Stepper */}
          {loading && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Epistemic Deliberation Lifecycle
                </span>
                <span className="text-xs text-slate-400 animate-pulse">Running 4-Agent Directed Graph</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workflowSteps.map((agent, index) => {
                  const isDone = step > index;
                  const isCurrent = step === index;
                  return (
                    <div
                      key={agent.title}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-slate-800 border-emerald-500/50 shadow-md shadow-emerald-500/5"
                          : isDone
                          ? "bg-slate-950/60 border-slate-800 opacity-90"
                          : "bg-slate-950/30 border-slate-900 opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isCurrent ? "text-emerald-400" : isDone ? "text-white" : "text-slate-500"}`}>
                          {agent.title}
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-700" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{agent.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <div className="font-bold mb-1">Pipeline Execution Warning</div>
              <div>{error}</div>
            </div>
          )}
        </div>

        {/* Results Interface */}
        {result && (
          <div className="space-y-6">
            {/* View Switcher Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl">
              <div className="flex items-center gap-1 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('decision')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'decision'
                      ? "bg-emerald-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Decision & Synthesis
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'evidence'
                      ? "bg-emerald-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Evidence Matrix ({result.evidence_items.length})
                </button>
              </div>

              <button
                onClick={copyReportMarkdown}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                {copied ? "Report Copied to Clipboard!" : "Export Defended Report"}
              </button>
            </div>

            {/* TAB 1: DECISION & SYNTHESIS */}
            {activeTab === 'decision' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Recommendation Banner */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 sm:p-8 border-b border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1 max-w-2xl">
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                        Formal Defended Stance
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                        {result.recommendation}
                      </h2>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 sm:text-right min-w-[140px]">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confidence</div>
                      <div className="text-3xl font-black text-emerald-400">
                        {(result.confidence_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Calibrated Epistemic Score</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                  {/* Justifications */}
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Core Justification Premises
                    </h3>
                    <div className="space-y-2.5">
                      {result.primary_reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200">
                          <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks & Assumptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Identified Risk Disclosures
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {result.risks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        Underlying Structural Assumptions
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {result.assumptions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actionable Next Steps */}
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Recommended Execution Sequence
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {result.next_steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200">
                          <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EVIDENCE MATRIX */}
            {activeTab === 'evidence' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">Verified Evidence Matrix & Audit Trail</h3>
                    <p className="text-xs text-slate-400">All claims evaluated by the Verifier Agent across primary sources.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full self-start">
                    {result.evidence_items.length} Evaluated Evidence Tuples
                  </span>
                </div>

                <div className="space-y-4">
                  {result.evidence_items.map((item) => (
                    <div key={item.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {item.id}
                        </span>
                        <div>{getStatusBadge(item.verification_status)}</div>
                      </div>

                      <p className="text-sm font-semibold text-white">
                        "{item.claim_text}"
                      </p>

                      <div className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                        <span className="font-bold text-emerald-400">Verifier Finding: </span>
                        {item.verification_note}
                      </div>

                      {item.sources && item.sources.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Corroborating Web Sources:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.sources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {src.title}
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
          </div>
        )}
      </main>
    </div>
  );
}