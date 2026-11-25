import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export default function CheatsheetsView({ glossary }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossary;
    return glossary.filter(
      (g) => g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)
    );
  }, [glossary, query]);

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--de-bg)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-serif-display" style={{ color: 'var(--de-text)' }}>
              Data Engineering Glossary & Cheatsheet
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--de-muted)' }}>
              A–Z cross-module terminology index for quick interview revision.
            </p>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border w-64"
            style={{
              backgroundColor: 'var(--de-card)',
              borderColor: 'var(--de-border)',
            }}
          >
            <Search className="w-3.5 h-3.5" style={{ color: 'var(--de-muted)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter terms..."
              className="bg-transparent outline-none text-xs flex-1"
              style={{ color: 'var(--de-text)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border"
              style={{
                backgroundColor: 'var(--de-card)',
                borderColor: 'var(--de-border)',
              }}
            >
              <div className="text-sm font-bold font-mono-code mb-1" style={{ color: 'var(--de-accent)' }}>
                {item.term}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--de-text)' }}>
                {item.definition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
