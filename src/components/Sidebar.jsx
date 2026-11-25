import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, Circle } from 'lucide-react';

export default function Sidebar({
  modules,
  activeSlug,
  completedSlugs,
  onSelectLesson,
  totalLessons,
}) {
  const activeModId = activeSlug ? activeSlug.split('/')[0] : modules[0]?.id;
  const [openModules, setOpenModules] = useState(() => new Set([activeModId]));

  useEffect(() => {
    if (activeModId) {
      setOpenModules((prev) => {
        if (prev.has(activeModId)) return prev;
        const next = new Set(prev);
        next.add(activeModId);
        return next;
      });
    }
  }, [activeModId]);

  const toggleModule = (modId) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  };

  const completedCount = completedSlugs.size;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <aside
      className="w-[260px] shrink-0 flex flex-col border-r overflow-hidden"
      style={{
        backgroundColor: 'var(--de-sidebar)',
        borderColor: 'var(--de-border)',
      }}
    >
      <div
        className="px-3.5 py-2.5 flex items-center justify-between text-xs border-b"
        style={{ borderColor: 'var(--de-border)' }}
      >
        <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--de-text)' }}>
          Course
        </span>
        <span style={{ color: 'var(--de-muted)' }}>{totalLessons} lessons</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 text-[13px]">
        {modules.map((mod) => {
          const isOpen = openModules.has(mod.id);
          const modDone = mod.lessons.filter((l) => completedSlugs.has(l.slug)).length;
          return (
            <div key={mod.id}>
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer hover:opacity-90"
                style={
                  isOpen
                    ? { backgroundColor: 'var(--de-card)', color: 'var(--de-text)' }
                    : { color: 'var(--de-text)' }
                }
              >
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--de-muted)' }} />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--de-muted)' }} />
                )}
                <span className="text-sm leading-none">{mod.icon}</span>
                <span className="flex-1 font-medium truncate">
                  {mod.num}. {mod.title}
                </span>
                <span className="text-[11px] font-mono-code" style={{ color: 'var(--de-muted)' }}>
                  {modDone}/{mod.lessons.length}
                </span>
              </button>

              {isOpen && (
                <div className="ml-4 mt-0.5 mb-1.5 space-y-0.5">
                  {mod.lessons.map((lesson) => {
                    const isActive = lesson.slug === activeSlug;
                    const isDone = completedSlugs.has(lesson.slug);
                    return (
                      <button
                        key={lesson.slug}
                        onClick={() => onSelectLesson(lesson.slug)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[12.5px] transition-colors cursor-pointer"
                        style={
                          isActive
                            ? {
                                backgroundColor: 'var(--de-accent-bg)',
                                color: 'var(--de-accent)',
                                fontWeight: 600,
                                border: '1px solid var(--de-accent)',
                              }
                            : {
                                color: 'var(--de-text)',
                                border: '1px solid transparent',
                              }
                        }
                      >
                        {isDone ? (
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: 'var(--de-accent)' }}
                          />
                        ) : (
                          <Circle
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: isActive ? 'var(--de-accent)' : 'var(--de-border)' }}
                          />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="p-3 border-t text-xs"
        style={{ borderColor: 'var(--de-border)', backgroundColor: 'var(--de-sidebar)' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--de-muted)' }}>
            Progress
          </span>
          <span className="font-mono-code font-semibold" style={{ color: 'var(--de-text)' }}>
            {completedCount} / {totalLessons}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--de-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: 'var(--de-accent)' }}
          />
        </div>
      </div>
    </aside>
  );
}
