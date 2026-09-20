import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AgentMeshVisualizer } from './components/AgentMeshVisualizer';
import { InvestigationConsole } from './components/InvestigationConsole';
import { LiveInvestigationProgress } from './components/LiveInvestigationProgress';
import { DecisionTab } from './components/DecisionTab';
import { EvidenceGapsTab } from './components/EvidenceGapsTab';
import { SourceLogTab } from './components/SourceLogTab';
import { RunTraceTab } from './components/RunTraceTab';
import { PitchModal } from './components/PitchModal';
import { 
  Sparkles, 
  Layers, 
  Database, 
  Globe, 
  Terminal, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState('IDLE');
  const [activeStep, setActiveStep] = useState(0); // 0=idle, 1=orch, 2=res, 3=ver, 4=dec, 5=complete
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('decision');
  const [traceLogs, setTraceLogs] = useState([]);
  const [latestEvent, setLatestEvent] = useState(null);
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  const eventSourceRef = useRef(null);

  const addTrace = (msg) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setTraceLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleSelectPreset = (preset) => {
    setQuery(preset.query);
    const consoleEl = document.getElementById('investigation-console');
    if (consoleEl) {
      consoleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleReset = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setResult(null);
    setError(null);
    setCurrentStage('IDLE');
    setActiveStep(0);
    setTraceLogs([]);
    setLatestEvent(null);
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Real-time Event-Based Investigation
  // Strictly reflects the REAL backend multi-agent pipeline state
  // Zero fake activity. Zero artificial setTimeout delays.
  const handleInvestigate = async () => {
    const cleanQuery = query.trim();
    if (!cleanQuery || loading) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setActiveStep(1);
    setCurrentStage('ORCHESTRATING');
    setTraceLogs([]);
    setLatestEvent(null);

    const streamUrl = `/api/v1/investigate/stream?query=${encodeURIComponent(cleanQuery)}`;

    try {
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.addEventListener('agent_event', (e) => {
        try {
          const eventData = JSON.parse(e.data);
          setLatestEvent(eventData);
          if (eventData.stage) {
            setCurrentStage(eventData.stage);
          }
          if (typeof eventData.active_step === 'number') {
            setActiveStep(eventData.active_step);
          }
          if (eventData.message) {
            const time = eventData.timestamp || new Date().toLocaleTimeString('en-US', { hour12: false });
            const prefix = eventData.agent ? eventData.agent.toUpperCase() : 'SYSTEM';
            setTraceLogs((prev) => [...prev, `[${time}] ${prefix} // ${eventData.message}`]);
          }
        } catch (parseErr) {
          console.warn('[KineticMesh UI] Event parse error:', parseErr);
        }
      });

      es.addEventListener('complete', (e) => {
        try {
          const finalDecision = JSON.parse(e.data);
          setResult(finalDecision);
          setCurrentStage('COMPLETE');
          setActiveStep(5);
          setLoading(false);
          setActiveTab('decision');
          es.close();
          eventSourceRef.current = null;
        } catch (completeErr) {
          console.error('[KineticMesh UI] Decision payload error:', completeErr);
          setError('Failed to parse final decision docket.');
          setLoading(false);
          es.close();
        }
      });

      es.addEventListener('error', async () => {
        // Fallback gracefully to standard POST API if SSE stream fails to open or closes prematurely
        es.close();
        eventSourceRef.current = null;

        console.log('[KineticMesh UI] Stream closed or unavailable. Executing standard API fallback...');
        try {
          const response = await fetch('/api/v1/investigate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: cleanQuery }),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || `Server error: HTTP ${response.status}`);
          }

          const data = await response.json();
          setResult(data);
          setCurrentStage('COMPLETE');
          setActiveStep(5);

          // Populate real execution trace from backend audit metadata
          if (data.audit_metadata?.execution_trace && Array.isArray(data.audit_metadata.execution_trace)) {
            const backendLogs = data.audit_metadata.execution_trace.map(
              (item) => `[${item.timestamp}] ${item.agent.toUpperCase()} // ${item.message}`
            );
            setTraceLogs(backendLogs);
          }

          setActiveTab('decision');
        } catch (fallbackErr) {
          setCurrentStage('ERROR');
          setActiveStep(0);
          const msg = fallbackErr?.message || 'Deliberation failed';
          setError(msg);
          addTrace(`PIPELINE_ERROR // ${msg}`);
        } finally {
          setLoading(false);
        }
      });
    } catch (streamInitErr) {
      console.error('[KineticMesh UI] EventSource init error:', streamInitErr);
      // Direct POST fallback
      try {
        const response = await fetch('/api/v1/investigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: cleanQuery }),
        });
        const data = await response.json();
        setResult(data);
        setCurrentStage('COMPLETE');
        setActiveStep(5);
        if (data.audit_metadata?.execution_trace) {
          setTraceLogs(
            data.audit_metadata.execution_trace.map(
              (t) => `[${t.timestamp}] ${t.agent.toUpperCase()} // ${t.message}`
            )
          );
        }
      } catch (err) {
        setError(err?.message || 'Deliberation failed');
        setCurrentStage('ERROR');
      } finally {
        setLoading(false);
      }
    }
  };

  const navTabs = [
    { id: 'decision', label: 'DECISION', icon: Sparkles },
    { id: 'evidence', label: 'EVIDENCE & GAPS', icon: Database },
    { id: 'sources', label: 'SOURCE LOG', icon: Globe },
    { id: 'telemetry', label: 'RUN TRACE', icon: Terminal },
  ];

  return (
    <div className="min-h-screen atmospheric-surface text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        onOpenPitch={() => setIsPitchOpen(true)}
        onReset={handleReset}
        hasResult={Boolean(result)}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-8">
        
        {/* Hero Section shown on entry or when no active results */}
        {!result && !loading && (
          <HeroSection
            onSelectPreset={handleSelectPreset}
            onFocusInput={() => {
              const el = document.getElementById('query-input');
              el?.focus();
            }}
          />
        )}

        {/* Agent Consensus Mesh Topology Visualizer */}
        <div className="space-y-2">
          <AgentMeshVisualizer
            currentStage={currentStage}
            activeStep={activeStep}
            iterationCount={result?.iterations_run || latestEvent?.iteration || 1}
          />
        </div>

        {/* Investigation Console */}
        <InvestigationConsole
          query={query}
          setQuery={setQuery}
          onExecute={handleInvestigate}
          loading={loading}
          onSelectPreset={handleSelectPreset}
        />

        {/* Live Deliberation Progress Banner when loading */}
        {loading && (
          <LiveInvestigationProgress
            currentStage={currentStage}
            traceLogs={traceLogs}
            activeStep={activeStep}
            latestEvent={latestEvent}
          />
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-4 flex items-center justify-between text-rose-200 text-xs font-mono shadow-xl">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-slate-200 underline font-mono text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results Experience (The Masterpiece Docket) */}
        {result && !loading && (
          <div className="space-y-6 pt-2" id="results-docket">
            
            {/* Tab Navigation Header Bar */}
            <div className="glass-panel specular-top rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center space-x-2.5 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                  INVESTIGATION DOCKET // {result.investigation_id}
                </span>
              </div>

              {/* 4 Primary Navigation Tabs with Smooth Pill Indicator */}
              <div 
                role="tablist" 
                aria-label="Investigation docket sections"
                className="flex items-center space-x-1.5 text-xs font-mono p-1 bg-slate-950/70 rounded-xl border border-white/[0.06]"
              >
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`tab-panel-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-3.5 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 select-none ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                      id={`tab-btn-${tab.id}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Contents with Framer Motion Entering Transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                id={`tab-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-btn-${activeTab}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {activeTab === 'decision' && <DecisionTab decision={result} />}
                {activeTab === 'evidence' && <EvidenceGapsTab decision={result} />}
                {activeTab === 'sources' && <SourceLogTab decision={result} />}
                {activeTab === 'telemetry' && <RunTraceTab decision={result} traceLogs={traceLogs} />}
              </motion.div>
            </AnimatePresence>

          </div>
        )}

      </main>

      {/* Tactical Architectural Footer */}
      <footer className="border-t border-white/[0.06] bg-[#030610]/95 backdrop-blur-xl py-6 text-center text-xs font-mono text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200 tracking-wider">KineticMesh</span>
            <span>—</span>
            <span className="text-slate-400">Autonomous Decision Intelligence Engine</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Powered by Gemini 3.6 Flash</span>
            <span>•</span>
            <span>Google Search Grounding</span>
            <span>•</span>
            <button
              onClick={() => setIsPitchOpen(true)}
              className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
            >
              System Architecture & Pitch
            </button>
          </div>
        </div>
      </footer>

      {/* Pitch & Architecture Modal */}
      <PitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />

    </div>
  );
}
