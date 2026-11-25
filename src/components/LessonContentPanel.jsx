import React, { useMemo } from 'react';
import { marked } from 'marked';
import { ArrowLeft, ArrowRight, CheckSquare, Square, AlertTriangle, Sparkles } from 'lucide-react';

marked.setOptions({
  breaks: false,
  gfm: true,
});

const TAG_STYLES = {
  orange: { bg: 'var(--de-orange-bg)', fg: 'var(--de-orange)' },
  red: { bg: 'var(--de-red-bg)', fg: 'var(--de-red)' },
  green: { bg: 'var(--de-accent-bg)', fg: 'var(--de-accent)' },
  blue: { bg: 'var(--de-blue-bg)', fg: 'var(--de-blue)' },
  purple: { bg: 'var(--de-purple-bg)', fg: 'var(--de-purple)' },
};

export default function LessonContentPanel({
  lesson,
  stepIndex,
  onPrev,
  onNext,
  nextLessonTitle,
  hasNextLesson,
}) {
  const step = lesson.steps[stepIndex];
  const totalSteps = lesson.steps.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const tagStyle = TAG_STYLES[step.tagType] || TAG_STYLES.green;

  const renderedHtml = useMemo(() => {
    if (!step.body) return '';
    return marked.parse(step.body);
  }, [step.body]);

  const nextStepShort = !isLast ? lesson.steps[stepIndex + 1]?.shortLabel : null;

  return (
    <aside
      className="w-[380px] shrink-0 flex flex-col border-l overflow-hidden"
      style={{
        backgroundColor: 'var(--de-card)',
        borderColor: 'var(--de-border)',
      }}
    >
      {/* Scrollable Step Body */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider font-mono-code"
            style={{ color: 'var(--de-muted)' }}
          >
            STEP {stepIndex + 1} / {totalSteps}
          </span>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: tagStyle.bg, color: tagStyle.fg }}
          >
            {step.tag}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3 font-serif-display leading-snug" style={{ color: 'var(--de-text)' }}>
          {step.heading}
        </h2>

        {step.recapPoints ? (
          <div className="space-y-2.5 text-sm animate-step-in">
            {step.recapPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: 'var(--de-accent-bg)', color: 'var(--de-accent)' }}
                >
                  ✓
                </span>
                <span style={{ color: 'var(--de-text)' }}>{pt}</span>
              </div>
            ))}
            {hasNextLesson && (
              <div
                className="mt-4 p-3 rounded-xl border text-xs"
                style={{
                  backgroundColor: 'var(--de-sidebar)',
                  borderColor: 'var(--de-border)',
                }}
              >
                <div className="font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--de-muted)' }}>
                  Coming Up
                </div>
                <div style={{ color: 'var(--de-text)' }}>
                  Continue to <strong>{nextLessonTitle}</strong> to build on these concepts.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            key={`${lesson.slug}-${stepIndex}`}
            className="de-prose text-[13.5px] animate-step-in"
            style={{ color: 'var(--de-text)' }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}

        {step.callout && (
          <div
            className="mt-4 p-3.5 rounded-xl border text-xs leading-relaxed"
            style={{
              backgroundColor:
                step.callout.type === 'orange' ? 'var(--de-orange-bg)' : 'var(--de-blue-bg)',
              borderColor:
                step.callout.type === 'orange' ? 'var(--de-orange)' : 'var(--de-blue)',
            }}
          >
            <div
              className="flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1 text-[10px]"
              style={{
                color: step.callout.type === 'orange' ? 'var(--de-orange)' : 'var(--de-blue)',
              }}
            >
              {step.callout.type === 'orange' ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{step.callout.label}</span>
            </div>
            <div style={{ color: 'var(--de-text)' }}>{step.callout.text}</div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--de-border)' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-opacity cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
            style={{
              borderColor: 'var(--de-border)',
              color: 'var(--de-text)',
              backgroundColor: 'var(--de-bg)',
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            disabled={isLast && !hasNextLesson}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-opacity disabled:opacity-40"
            style={{
              backgroundColor: 'var(--de-accent-bg)',
              color: 'var(--de-accent)',
              border: '1px solid var(--de-accent)',
            }}
          >
            <span className="truncate">
              {isLast
                ? hasNextLesson
                  ? `Next: ${nextLessonTitle}`
                  : 'Lesson Complete'
                : `Next: ${nextStepShort}`}
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        <div className="text-[10px] text-center font-mono-code" style={{ color: 'var(--de-muted)' }}>
          ← → step · R replay · Space pause
        </div>
      </div>

      {/* You'll Learn Checklist */}
      <div
        className="px-4 py-3 border-t max-h-40 overflow-y-auto"
        style={{ borderColor: 'var(--de-border)', backgroundColor: 'var(--de-sidebar)' }}
      >
        <div
          className="text-[10px] font-bold uppercase tracking-wider mb-2"
          style={{ color: 'var(--de-muted)' }}
        >
          You&apos;ll Learn
        </div>
        <div className="space-y-1.5 text-xs">
          {lesson.learnItems.map((item, idx) => {
            const checked = idx <= stepIndex;
            return (
              <div key={idx} className="flex items-start gap-2">
                {checked ? (
                  <CheckSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--de-accent)' }} />
                ) : (
                  <Square className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--de-muted)' }} />
                )}
                <span
                  className="leading-snug"
                  style={{ color: checked ? 'var(--de-text)' : 'var(--de-muted)' }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
