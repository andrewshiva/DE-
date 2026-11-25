import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { Eye, EyeOff, CheckCircle2, Filter } from 'lucide-react';

export default function PracticeView({ questions }) {
  const [selectedModule, setSelectedModule] = useState('all');
  const [revealed, setRevealed] = useState(() => new Set());
  const [mastered, setMastered] = useState(() => new Set());

  const moduleOptions = useMemo(() => {
    const seen = new Map();
    for (const q of questions) {
      if (!seen.has(q.moduleId)) {
        seen.set(q.moduleId, q.moduleTitle);
      }
    }
    return Array.from(seen.entries());
  }, [questions]);

  const filtered = useMemo(() => {
    if (selectedModule === 'all') return questions;
    return questions.filter((q) => q.moduleId === selectedModule);
  }, [questions, selectedModule]);

  const toggleReveal = (idx) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleMastered = (idx) => {
    setMastered((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--de-bg)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-serif-display" style={{ color: 'var(--de-text)' }}>
              Interview Practice Bank
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--de-muted)' }}>
              {questions.length} production-grade Data Engineering questions with solutions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'var(--de-muted)' }} />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs border outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--de-card)',
                borderColor: 'var(--de-border)',
                color: 'var(--de-text)',
              }}
            >
              <option value="all">All Modules ({questions.length})</option>
              {moduleOptions.map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item, i) => {
            const key = `${item.moduleId}-${i}`;
            const isOpen = revealed.has(key);
            const isDone = mastered.has(key);
            return (
              <div
                key={key}
                className="rounded-xl border p-4 transition-colors"
                style={{
                  backgroundColor: 'var(--de-card)',
                  borderColor: isDone ? 'var(--de-accent)' : 'var(--de-border)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: 'var(--de-sidebar)', color: 'var(--de-muted)' }}
                    >
                      {item.moduleTitle}
                    </span>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--de-text)' }}>
                      {item.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleReveal(key)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer"
                      style={{
                        backgroundColor: 'var(--de-bg)',
                        borderColor: 'var(--de-border)',
                        color: 'var(--de-text)',
                      }}
                    >
                      {isOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isOpen ? 'Hide' : 'Answer'}</span>
                    </button>

                    <button
                      onClick={() => toggleMastered(key)}
                      className="p-1.5 rounded-lg border cursor-pointer"
                      title="Mark as mastered"
                      style={{
                        backgroundColor: isDone ? 'var(--de-accent-bg)' : 'var(--de-bg)',
                        borderColor: isDone ? 'var(--de-accent)' : 'var(--de-border)',
                        color: isDone ? 'var(--de-accent)' : 'var(--de-muted)',
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div
                    className="mt-3 pt-3 border-t de-prose text-xs"
                    style={{ borderColor: 'var(--de-border)', color: 'var(--de-text)' }}
                    dangerouslySetInnerHTML={{ __html: marked.parse(item.answer) }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
