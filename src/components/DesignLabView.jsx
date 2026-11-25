import React from 'react';
import { ArrowRight, Clock, Building2 } from 'lucide-react';

export default function DesignLabView({ caseStudies, onOpenCaseStudy }) {
  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--de-bg)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-serif-display" style={{ color: 'var(--de-text)' }}>
            Design Lab — Real-World Case Studies
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--de-muted)' }}>
            {caseStudies.length} production architecture walkthroughs from e-commerce, fintech, streaming, and AI platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudies.map((cs) => (
            <button
              key={cs.slug}
              onClick={() => onOpenCaseStudy(cs.slug)}
              className="text-left p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--de-card)',
                borderColor: 'var(--de-border)',
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: 'var(--de-purple-bg)', color: 'var(--de-purple)' }}
                  >
                    <Building2 className="w-3 h-3" />
                    {cs.moduleTitle}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[11px]"
                    style={{ color: 'var(--de-muted)' }}
                  >
                    <Clock className="w-3 h-3" />
                    {cs.readTime}
                  </span>
                </div>
                <h3 className="text-base font-bold font-serif-display mb-1.5" style={{ color: 'var(--de-text)' }}>
                  {cs.title}
                </h3>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--de-muted)' }}>
                  {cs.tagline}
                </p>
              </div>

              <div
                className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-semibold"
                style={{ borderColor: 'var(--de-border)', color: 'var(--de-accent)' }}
              >
                <span>Open Interactive Walkthrough</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
