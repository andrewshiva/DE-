import React from 'react';

export default function StepBar({ steps, currentStep, onSelectStep }) {
  return (
    <div
      className="mt-3 px-4 py-2.5 rounded-xl border shrink-0"
      style={{
        backgroundColor: 'var(--de-card)',
        borderColor: 'var(--de-border)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: 'var(--de-muted)' }}
        >
          In This Lesson
        </span>
        <span className="text-[11px] font-mono-code" style={{ color: 'var(--de-muted)' }}>
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {steps.map((s, idx) => {
          const isCurrent = idx === currentStep;
          const isPast = idx < currentStep;
          return (
            <button
              key={idx}
              onClick={() => onSelectStep(idx)}
              title={s.heading}
              className="flex flex-col items-center shrink-0 min-w-[74px] max-w-[92px] px-1.5 py-1 rounded-lg transition-all cursor-pointer"
              style={
                isCurrent
                  ? {
                      backgroundColor: 'var(--de-accent-bg)',
                      border: '1px solid var(--de-accent)',
                    }
                  : {
                      border: '1px solid transparent',
                    }
              }
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-mono-code"
                style={
                  isCurrent
                    ? { backgroundColor: 'var(--de-accent)', color: '#ffffff' }
                    : isPast
                    ? { backgroundColor: 'var(--de-accent-bg)', color: 'var(--de-accent)' }
                    : {
                        backgroundColor: 'var(--de-sidebar)',
                        color: 'var(--de-muted)',
                        border: '1px solid var(--de-border)',
                      }
                }
              >
                {idx + 1}
              </span>
              <span
                className="text-[10px] mt-1 truncate w-full text-center"
                style={{
                  color: isCurrent ? 'var(--de-accent)' : 'var(--de-muted)',
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {s.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
