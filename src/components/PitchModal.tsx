import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, Cpu, Globe, Compass, BrainCircuit } from 'lucide-react';

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#02050c]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="System Architecture and Pitch"
    >
      <div 
        className="glass-panel-elevated specular-top rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 relative border border-white/[0.12]"
        id="pitch-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-slate-100 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-150 active:scale-[0.98]"
          id="close-pitch-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-sky-300 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-400/20">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>KINETICMESH // SYSTEM ARCHITECTURE & 2-MINUTE PITCH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 tracking-tight">
            Autonomous Decision Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            "Think through the decision. Don't just answer it."
          </p>
        </div>

        {/* Pitch Content Sections */}
        <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-300">
          
          {/* Section 01: Problem */}
          <div className="bg-slate-950/70 border border-white/[0.06] rounded-xl p-4 sm:p-5 space-y-2">
            <h3 className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider">
              01 // The Problem: The Hallucination & Reasoning Gap
            </h3>
            <p className="text-slate-300 font-sans leading-relaxed">
              When leaders and technical architects ask LLMs high-stakes questions ("Should we invest $2M in battery storage?", "Should we migrate to on-premise colocation?"), single-turn models deliver plausible-sounding answers with no empirical grounding, no verification of contradictory data, and no distinction between verified facts and speculative deductions.
            </p>
          </div>

          {/* Section 02: Solution */}
          <div className="bg-slate-950/70 border border-white/[0.06] rounded-xl p-4 sm:p-5 space-y-2">
            <h3 className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
              02 // The Solution: KineticMesh Consensus Graph
            </h3>
            <p className="text-slate-300 font-sans leading-relaxed">
              KineticMesh breaks the problem down into a multi-agent deliberation mesh. Instead of generating a hasty response, four specialized agents coordinate:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 pt-1 text-slate-300 font-sans">
              <li><strong className="text-sky-300 font-mono text-xs">Orchestrator:</strong> Plans and decomposes inquiries into empirical research vectors.</li>
              <li><strong className="text-blue-300 font-mono text-xs">Researcher:</strong> Gathers real-world evidence using Google Search grounding with genuine URL citations.</li>
              <li><strong className="text-amber-300 font-mono text-xs">Verifier:</strong> Cross-checks gathered claims, isolates contradictions, and activates a dynamic feedback loop for secondary passes when uncertainty is detected.</li>
              <li><strong className="text-emerald-300 font-mono text-xs">Decision Maker:</strong> Synthesizes a defended stance with separate facts, inferences, uncertainties, risks, and next steps.</li>
            </ul>
          </div>

          {/* Section 03: Dynamic Feedback Loop */}
          <div className="bg-slate-950/70 border border-white/[0.06] rounded-xl p-4 sm:p-5 space-y-2">
            <h3 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
              03 // The Dynamic Verification Feedback Loop
            </h3>
            <p className="text-slate-300 font-sans leading-relaxed">
              Unlike linear agent chains, KineticMesh continuously stress-tests its own findings. If the Verifier identifies conflicting data or high uncertainty in initial claims, it loops back to the Researcher for targeted secondary corroboration before the Decision Maker issues an executive stance.
            </p>
          </div>

          {/* Section 04: Production Standards */}
          <div className="bg-slate-950/70 border border-white/[0.06] rounded-xl p-4 sm:p-5 space-y-2">
            <h3 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
              04 // Quality & Production Engineering Standards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono text-[11px]">
              <div className="flex items-center space-x-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-white/[0.04]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Zero committed credentials</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-white/[0.04]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Live Google Search grounding</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-white/[0.04]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Auditable typed schemas</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-white/[0.04]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Automated test coverage</span>
              </div>
            </div>
          </div>

          {/* Section 05: Transparent AI-Use Declaration */}
          <div className="bg-slate-950/70 border border-white/[0.06] rounded-xl p-4 sm:p-5 space-y-2">
            <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              05 // Transparent AI-Use Declaration
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              In adherence with hackathon integrity guidelines: KineticMesh was ideated and architected by Anirban Bhowmik. AI assistance was utilized for agent deliberation pipelines, live grounding tools, and iterative codebase refinement. All domain logic, multi-agent feedback orchestration, and evaluation criteria were human-architected and audited.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs tracking-wider transition-all duration-150 shadow-md active:scale-[0.98]"
          >
            Close & Return to Console
          </button>
        </div>

      </div>
    </div>
  );
};
