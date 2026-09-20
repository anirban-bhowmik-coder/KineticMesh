import React from 'react';
import { Globe, ExternalLink, ShieldCheck, Link2 } from 'lucide-react';
import { DecisionResult } from '../types';

interface SourceLogTabProps {
  decision: DecisionResult;
}

export const SourceLogTab: React.FC<SourceLogTabProps> = ({ decision }) => {
  // Aggregate unique sources
  const sourceMap = new Map<string, { title: string; url: string; claims: string[] }>();

  decision.evidence_items.forEach((item) => {
    item.sources?.forEach((src) => {
      const key = src.url || src.title;
      if (!sourceMap.has(key)) {
        sourceMap.set(key, { title: src.title, url: src.url, claims: [item.id] });
      } else {
        const entry = sourceMap.get(key)!;
        if (!entry.claims.includes(item.id)) {
          entry.claims.push(item.id);
        }
      }
    });
  });

  const uniqueSources = Array.from(sourceMap.values());

  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'external-source';
    }
  };

  const isSafeHttpUrl = (url?: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6" id="tab-content-sources">
      <div className="glass-panel specular-top rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-white/[0.08] flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Search Grounding Provenance & Source Registry ({uniqueSources.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-400/20 font-semibold">
            Google Search Grounding
          </span>
        </div>

        {/* Source Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniqueSources.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-xs font-mono text-slate-400 bg-slate-950/40 rounded-xl border border-white/[0.05]">
              No external web citations logged for this investigation.
            </div>
          ) : (
            uniqueSources.map((src, idx) => {
              const domain = getDomain(src.url);

              return (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-white/[0.06] hover:border-white/[0.14] rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm"
                  id={`source-card-${idx}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2.5 py-0.5 rounded-md border border-sky-400/20 uppercase font-semibold tracking-wider">
                        {domain}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-2 mb-3 font-sans leading-snug">
                      {src.title || src.url}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span>Corroborates claims:</span>
                      {src.claims.map((cId) => (
                        <span key={cId} className="px-2 py-0.5 rounded bg-slate-900 border border-white/[0.06] text-sky-300 font-semibold text-[10px]">
                          {cId}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    {isSafeHttpUrl(src.url) ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center space-x-1.5 transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Inspect Source Link</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-slate-500 flex items-center space-x-1.5">
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Archived Reference Citation</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
