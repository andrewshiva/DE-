import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, BookOpen, Briefcase } from 'lucide-react';

export default function SearchModal({
  isOpen,
  onClose,
  modules,
  caseStudies,
  onSelectLesson,
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = [];
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        if (!q || lesson.title.toLowerCase().includes(q) || mod.title.toLowerCase().includes(q)) {
          items.push({
            type: 'lesson',
            slug: lesson.slug,
            title: lesson.title,
            subtitle: `${mod.num}. ${mod.title} · ${lesson.level} · ${lesson.readTime}`,
            icon: mod.icon,
          });
        }
      }
    }
    for (const cs of caseStudies) {
      if (!q || cs.title.toLowerCase().includes(q) || cs.moduleTitle.toLowerCase().includes(q)) {
        items.push({
          type: 'case',
          slug: cs.slug,
          title: cs.title,
          subtitle: `Case Study · ${cs.moduleTitle}`,
          icon: '🏢',
        });
      }
    }
    return items.slice(0, 24);
  }, [query, modules, caseStudies]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--de-card)',
          borderColor: 'var(--de-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-2.5 px-4 py-3 border-b"
          style={{ borderColor: 'var(--de-border)' }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--de-muted)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 150+ Data Engineering lessons, case studies..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--de-text)' }}
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:opacity-75 cursor-pointer"
            style={{ color: 'var(--de-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm" style={{ color: 'var(--de-muted)' }}>
              No matching lessons found.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.slug}
                onClick={() => {
                  onSelectLesson(item.slug);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer hover:opacity-90"
                style={{ backgroundColor: 'var(--de-bg)' }}
              >
                <span className="text-base">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--de-text)' }}>
                    {item.title}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--de-muted)' }}>
                    {item.subtitle}
                  </div>
                </div>
                {item.type === 'case' ? (
                  <Briefcase className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--de-purple)' }} />
                ) : (
                  <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--de-muted)' }} />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
