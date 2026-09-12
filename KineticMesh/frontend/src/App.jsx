import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, ArrowRight, Check, CheckCircle2,
  ChevronRight, CircleDot, Compass, Copy, ExternalLink, FileText, Globe2,
  Layers3, Loader2, Radar, RefreshCw, Search, ShieldCheck, Sparkles, Terminal,
  XCircle, Zap
} from 'lucide-react';

const PRESET_QUERIES = [
  { id: '01', tag: 'ENERGY', label: 'Solar + battery investment', query: 'Should a commercial distribution warehouse in Valencia invest in on-site solar PV with battery storage under 2024-2026 Iberian electricity market tariffs?' },
  { id: '02', tag: 'INFRA', label: 'Cloud vs colocation', query: 'Should a mid-market healthcare SaaS company migrate from AWS multi-region to on-premises colocation to reduce infrastructure OpEx in 2025?' },
  { id: '03', tag: 'AI SYSTEMS', label: 'LLM architecture choice', query: 'Should a global financial consultancy deploy self-hosted open-source models (Llama 3) or proprietary API endpoints (Gemini 2.5) for sensitive client audit workflows?' },
];

const AGENTS = [
  { key: 'orchestrator', no: '01', name: 'Orchestrator', role: 'frames the decision', icon: Compass },
  { key: 'researcher', no: '02', name: 'Researcher', role: 'finds grounded evidence', icon: Search },
  { key: 'verifier', no: '03', name: 'Verifier', role: 'challenges the evidence', icon: ShieldCheck },
  { key: 'decision', no: '04', name: 'Decision maker', role: 'synthesizes the case', icon: Zap },
];

function StatusPill({ status }) {
  const map = {
    Verified: ['verified', CheckCircle2, 'Corroborated'],
    Conflicting: ['conflict', AlertTriangle, 'Conflict detected'],
    Uncertain: ['uncertain', AlertCircle, 'Data gap'],
  };
  const [tone, Icon, label] = map[status] || ['unsupported', XCircle, 'Unsupported'];
  return <span className={`status-pill ${tone}`}><Icon size={13} />{label}</span>;
}

function EmptyState({ children }) {
  return <div className="empty-state"><CircleDot size={15} />{children}</div>;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('decision');
  const [copied, setCopied] = useState(false);
  const [traceLogs, setTraceLogs] = useState([]);

  const confidence = result ? (result.model_assessed_confidence ?? result.confidence_score ?? 0.8) : 0;

  const addTrace = (message) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setTraceLogs((prev) => [...prev, `[${time}] ${message}`]);
  };

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setStep((prev) => {
        const next = Math.min(prev + 1, 3);
        const messages = [
          'RESEARCHER // retrieving grounded evidence',
          'VERIFIER // testing claims against sources',
          'DECISION // synthesizing evidence and risk',
        ];
        if (next > prev && messages[next - 1]) addTrace(messages[next - 1]);
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, [loading]);

  async function investigate(e) {
    e?.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true); setError(null); setResult(null); setStep(0); setTraceLogs([]); setActiveTab('decision');
    addTrace('PIPELINE // investigation initialized');
    addTrace('ORCHESTRATOR // mapping objective into research tasks');
    try {
      const response = await fetch('/api/v1/investigate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || `Server returned HTTP ${response.status}`);
      }
      const data = await response.json();
      setStep(4); setResult(data);
      addTrace(`PIPELINE // completed ${data.investigation_id || 'local investigation'}`);
    } catch (err) {
      setError(err.message || 'Investigation failed.');
      addTrace(`PIPELINE // error: ${err.message}`);
    } finally { setLoading(false); }
  }

  async function copyReport() {
    if (!result) return;
    const text = [
      '# KINETICMESH — DECISION REPORT', '',
      `Query: ${result.original_query || query}`,
      `Recommendation: ${result.recommendation || 'N/A'}`,
      `Confidence: ${(confidence * 100).toFixed(0)}%`, '',
      '## Reasons', ...(result.primary_reasons || []).map((x, i) => `${i + 1}. ${x}`), '',
      '## Facts', ...(result.facts || []).map(x => `- ${x}`), '',
      '## Risks', ...(result.risks || []).map(x => `- ${x}`), '',
      '## Next steps', ...(result.next_steps || []).map((x, i) => `${i + 1}. ${x}`),
    ].join('\n');
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  }

  const tabs = useMemo(() => [
    ['decision', 'Decision'], ['epistemic', 'Evidence & gaps'], ['evidence', `Source log · ${result?.evidence_items?.length || 0}`], ['telemetry', 'Run trace'],
  ], [result]);

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top">
            <span className="brand-mark"><span /></span>
            <span><strong>KINETICMESH</strong><small>DECISION INTELLIGENCE</small></span>
          </a>
          <div className="top-meta">
            <span className="live-dot" /> SYSTEM READY
            <i />
            <span>4 AGENTS</span>
            <i />
            <span>GROUNDED RESEARCH</span>
          </div>
        </div>
      </header>

      <main id="top" className="page">
        <section className="hero">
          <div className="eyebrow"><span>01</span> FROM QUESTION TO DEFENSIBLE DECISION</div>
          <h1>Think through the decision.<br /><em>Don't just answer it.</em></h1>
          <p>KINETICMESH coordinates research, verification and synthesis into one traceable decision workflow.</p>
        </section>

        <section className="workspace">
          <aside className="side-rail">
            <div className="rail-label">MESH / 04</div>
            <div className="agent-stack">
              {AGENTS.map((agent, i) => {
                const Icon = agent.icon;
                const active = loading && step === i;
                const done = loading && step > i;
                return <div key={agent.key} className={`agent-node ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
                  <div className="node-icon"><Icon size={16} /></div>
                  <div><span>{agent.no}</span><strong>{agent.name}</strong><small>{agent.role}</small></div>
                  {i < AGENTS.length - 1 && <div className="node-line" />}
                </div>;
              })}
            </div>
            <div className="rail-note"><Layers3 size={14} /><span>Agents operate as a<br />single reasoning mesh.</span></div>
          </aside>

          <div className="main-column">
            <div className="query-card">
              <div className="card-top"><div><span className="kicker">INVESTIGATION CONSOLE</span><h2>What decision are you trying to make?</h2></div><span className="secure"><Globe2 size={14} /> WEB-GROUNDED</span></div>
              <form onSubmit={investigate}>
                <div className="input-wrap">
                  <textarea value={query} onChange={e => setQuery(e.target.value)} disabled={loading} rows={5} placeholder="Describe the strategic, technical, financial or regulatory decision..." />
                  <div className="input-footer"><span>{query.length} characters</span><span>Natural language input</span></div>
                </div>
                <div className="examples">
                  <div className="examples-head"><span>TRY A SCENARIO</span><span>OR WRITE YOUR OWN</span></div>
                  <div className="example-grid">
                    {PRESET_QUERIES.map(p => <button key={p.id} type="button" onClick={() => setQuery(p.query)} className="example-card"><span>{p.tag}</span><strong>{p.label}</strong><ArrowRight size={15} /></button>)}
                  </div>
                </div>
                <button className="run-button" disabled={!query.trim() || loading} type="submit">
                  {loading ? <><Loader2 className="spin" size={17} /> Running the mesh</> : <><Sparkles size={17} /> Run investigation <ArrowRight size={17} /></>}
                </button>
              </form>
              {loading && <div className="run-progress"><div className="progress-line"><span style={{ width: `${Math.min(((step + 1) / 4) * 100, 100)}%` }} /></div><div className="progress-meta"><span>LIVE PIPELINE</span><span>{step < 4 ? `${step + 1} / 4` : '4 / 4'}</span></div></div>}
              {error && <div className="error-box"><AlertCircle size={16} /> <span>{error}</span></div>}
            </div>

            {result && <section className="results">
              <div className="results-head">
                <div><span className="kicker">INVESTIGATION RESULT</span><h2>A decision with a visible trail.</h2></div>
                <button className="copy-button" onClick={copyReport}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy report'}</button>
              </div>
              <div className="tabs">{tabs.map(([id, label]) => <button key={id} onClick={() => setActiveTab(id)} className={activeTab === id ? 'selected' : ''}>{label}</button>)}</div>

              {activeTab === 'decision' && <div className="decision-view">
                <div className="recommendation">
                  <div><span className="kicker">RECOMMENDATION</span><h3>{result.recommendation}</h3></div>
                  <div className="confidence"><span>MODEL-ASSESSED CONFIDENCE</span><strong>{(confidence * 100).toFixed(0)}<small>%</small></strong><div><i style={{ width: `${confidence * 100}%` }} /></div></div>
                </div>
                <div className="section-block"><div className="section-title"><FileText size={16} /><span>Why the mesh landed here</span></div><div className="reason-grid">{(result.primary_reasons || []).map((r, i) => <div className="reason" key={i}><b>0{i + 1}</b><p>{r}</p></div>)}</div></div>
                <div className="two-col">
                  <div className="soft-panel risk"><div className="section-title"><AlertTriangle size={16} /><span>Risks</span></div>{(result.risks || []).length ? <ul>{result.risks.map((r, i) => <li key={i}>{r}</li>)}</ul> : <EmptyState>No risks recorded.</EmptyState>}</div>
                  <div className="soft-panel"><div className="section-title"><Sparkles size={16} /><span>Assumptions</span></div>{(result.assumptions || []).length ? <ul>{result.assumptions.map((r, i) => <li key={i}>{r}</li>)}</ul> : <EmptyState>No assumptions recorded.</EmptyState>}</div>
                </div>
                <div className="section-block"><div className="section-title"><ArrowRight size={16} /><span>Suggested next moves</span></div><div className="next-list">{(result.next_steps || []).map((s, i) => <div key={i}><b>{String(i + 1).padStart(2, '0')}</b><span>{s}</span><ChevronRight size={15} /></div>)}</div></div>
              </div>}

              {activeTab === 'epistemic' && <div className="evidence-columns">
                {[
                  ['Facts', CheckCircle2, 'verified', result.facts || []],
                  ['Inferences', Sparkles, 'neutral', result.inferences || []],
                  ['Uncertainties', AlertCircle, 'warning', result.uncertainties || []],
                ].map(([title, Icon, tone, items]) => <div className={`evidence-column ${tone}`} key={title}><div className="section-title"><Icon size={16} /><span>{title}</span></div>{items.length ? items.map((x, i) => <article key={i}>{x}</article>) : <EmptyState>Nothing recorded.</EmptyState>}</div>)}
              </div>}

              {activeTab === 'evidence' && <div className="source-log"><div className="log-intro"><div><span className="kicker">PROVENANCE</span><h3>Evidence docket</h3></div><span>{result.evidence_items?.length || 0} sources / claims</span></div>{(result.evidence_items || []).length ? result.evidence_items.map(item => <article className="source-item" key={item.id}><div className="source-meta"><span>#{item.id}</span><StatusPill status={item.verification_status} /></div><h4>{item.claim_text}</h4><p><b>Verifier finding</b>{item.verification_note || 'Evaluated by Verifier Agent.'}</p>{item.sources?.length > 0 && <div className="links">{item.sources.map((s, i) => <a key={i} href={s.url} target="_blank" rel="noreferrer"><ExternalLink size={13} />{s.title || s.url}</a>)}</div>}</article>) : <EmptyState>No evidence items returned.</EmptyState>}</div>}

              {activeTab === 'telemetry' && <div className="trace"><div className="trace-head"><div><span className="kicker">EXECUTION TRACE</span><h3>What happened during this run</h3></div><span>{traceLogs.length} events</span></div><div className="trace-window">{traceLogs.map((log, i) => <div key={i}><span>{String(i + 1).padStart(2, '0')}</span><code>{log}</code></div>)}</div></div>}
            </section>}
          </div>
        </section>
      </main>

      <footer className="footer"><div><strong>KINETICMESH</strong><span>Autonomous decision intelligence</span></div><div><span>FastAPI</span><i /> <span>Google GenAI</span><i /> <span>React</span></div></footer>
    </div>
  );
}
