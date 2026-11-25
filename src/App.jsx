import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, BarChart2, Layers } from 'lucide-react';
import courseData from './data/courseData.json';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import SimulationCanvas from './components/SimulationCanvas.jsx';
import LessonContentPanel from './components/LessonContentPanel.jsx';
import StepBar from './components/StepBar.jsx';
import SearchModal from './components/SearchModal.jsx';
import PracticeView from './components/PracticeView.jsx';
import DesignLabView from './components/DesignLabView.jsx';
import CheatsheetsView from './components/CheatsheetsView.jsx';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('learn');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('de-theme') === 'dark';
  });

  const [completedSlugs, setCompletedSlugs] = useState(() => {
    try {
      const saved = localStorage.getItem('de-completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('de-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('de-completed', JSON.stringify(Array.from(completedSlugs)));
  }, [completedSlugs]);

  // Flat list of lessons in order for Prev/Next Lesson transitions
  const flatLessons = useMemo(() => {
    return courseData.modules.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, moduleTitle: `${m.num}. ${m.title}` }))
    );
  }, []);

  // Parse route: /<moduleId>/<lessonId>/<stepNum>
  const { activeSlug, stepIndex } = useMemo(() => {
    const parts = location.pathname.replace(/^\/+/, '').split('/').filter(Boolean);
    if (parts.length >= 2) {
      const slug = `${parts[0]}/${parts[1]}`;
      if (courseData.lessonsBySlug[slug]) {
        const rawStep = parseInt(parts[2] || '1', 10);
        const maxIdx = courseData.lessonsBySlug[slug].steps.length - 1;
        const idx = Number.isNaN(rawStep) ? 0 : Math.max(0, Math.min(maxIdx, rawStep - 1));
        return { activeSlug: slug, stepIndex: idx };
      }
    }
    const defaultSlug = flatLessons[0]?.slug;
    return { activeSlug: defaultSlug, stepIndex: 0 };
  }, [location.pathname, flatLessons]);

  const activeLesson = courseData.lessonsBySlug[activeSlug];
  const activeModule = courseData.modules.find((m) => m.id === activeLesson?.moduleId);
  const lessonIndexInMod = activeModule
    ? activeModule.lessons.findIndex((l) => l.slug === activeSlug)
    : 0;

  const flatIdx = flatLessons.findIndex((l) => l.slug === activeSlug);
  const nextLesson = flatIdx >= 0 && flatIdx < flatLessons.length - 1 ? flatLessons[flatIdx + 1] : null;

  const goTo = useCallback(
    (slug, stepIdx = 0) => {
      setActiveTab('learn');
      navigate(`/${slug}/${stepIdx + 1}`);
    },
    [navigate]
  );

  // Auto-mark complete when reaching Recap step
  useEffect(() => {
    if (activeLesson && stepIndex === activeLesson.steps.length - 1) {
      setCompletedSlugs((prev) => {
        if (prev.has(activeSlug)) return prev;
        const next = new Set(prev);
        next.add(activeSlug);
        return next;
      });
    }
  }, [activeLesson, activeSlug, stepIndex]);

  const handleNext = useCallback(() => {
    if (!activeLesson) return;
    if (stepIndex < activeLesson.steps.length - 1) {
      goTo(activeSlug, stepIndex + 1);
    } else if (nextLesson) {
      goTo(nextLesson.slug, 0);
    }
  }, [activeLesson, stepIndex, activeSlug, nextLesson, goTo]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      goTo(activeSlug, stepIndex - 1);
    }
  }, [activeSlug, stepIndex, goTo]);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((v) => !v);
        return;
      }
      if (isSearchOpen || activeTab !== 'learn') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'r' || e.key === 'R') {
        setReplayKey((k) => k + 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, activeTab, handleNext, handlePrev]);

  const currentStep = activeLesson?.steps[stepIndex];

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--de-bg)' }}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
      />

      {activeTab === 'learn' && activeLesson && (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            modules={courseData.modules}
            activeSlug={activeSlug}
            completedSlugs={completedSlugs}
            onSelectLesson={(slug) => goTo(slug, 0)}
            totalLessons={courseData.stats.totalLessons}
          />

          <main className="flex-1 flex flex-col overflow-hidden px-6 py-4">
            {/* Lesson Header */}
            <div className="mb-3 shrink-0">
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--de-muted)' }}>
                {activeModule ? `${activeModule.num}. ${activeModule.title}` : 'Case Study'}
                {activeModule && lessonIndexInMod >= 0
                  ? ` / Lesson ${lessonIndexInMod + 1} of ${activeModule.lessons.length}`
                  : ''}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-bold font-serif-display" style={{ color: 'var(--de-text)' }}>
                  {activeLesson.title}
                </h1>

                <div className="flex items-center gap-2 text-[11px] font-medium">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: 'var(--de-orange-bg)',
                      color: 'var(--de-orange)',
                      borderColor: 'var(--de-border)',
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    {activeLesson.readTime}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: 'var(--de-accent-bg)',
                      color: 'var(--de-accent)',
                      borderColor: 'var(--de-border)',
                    }}
                  >
                    <BarChart2 className="w-3 h-3" />
                    {activeLesson.level}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: 'var(--de-purple-bg)',
                      color: 'var(--de-purple)',
                      borderColor: 'var(--de-border)',
                    }}
                  >
                    <Layers className="w-3 h-3" />
                    {activeLesson.steps.length} steps
                  </span>
                </div>
              </div>

              <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--de-muted)' }}>
                {activeLesson.tagline}
              </p>
            </div>

            <SimulationCanvas
              simType={activeLesson.simType}
              lessonId={activeLesson.id}
              lessonTitle={activeLesson.title}
              stepHeading={currentStep?.heading}
              stepIndex={stepIndex}
              totalSteps={activeLesson.steps.length}
              stepTag={currentStep?.tag}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused((p) => !p)}
              replayKey={replayKey}
              onReplay={() => setReplayKey((k) => k + 1)}
            />

            <StepBar
              steps={activeLesson.steps}
              currentStep={stepIndex}
              onSelectStep={(idx) => goTo(activeSlug, idx)}
            />
          </main>

          <LessonContentPanel
            lesson={activeLesson}
            stepIndex={stepIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            nextLessonTitle={nextLesson?.title}
            hasNextLesson={Boolean(nextLesson)}
          />
        </div>
      )}

      {activeTab === 'practice' && (
        <PracticeView questions={courseData.interviewQuestions} />
      )}

      {activeTab === 'lab' && (
        <DesignLabView
          caseStudies={courseData.caseStudies}
          onOpenCaseStudy={(slug) => goTo(slug, 0)}
        />
      )}

      {activeTab === 'cheatsheets' && (
        <CheatsheetsView glossary={courseData.glossary} />
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        modules={courseData.modules}
        caseStudies={courseData.caseStudies}
        onSelectLesson={(slug) => goTo(slug, 0)}
      />
    </div>
  );
}
