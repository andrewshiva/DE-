import React from 'react';
import {
  BookOpen,
  HelpCircle,
  Compass,
  FileText,
  Search,
  Moon,
  Sun,
  Database,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'practice', label: 'Practice', icon: HelpCircle },
  { id: 'lab', label: 'Design Lab', icon: Compass },
  { id: 'cheatsheets', label: 'Cheatsheets', icon: FileText },
];

export default function Header({
  activeTab,
  onTabChange,
  onOpenSearch,
  isDark,
  onToggleTheme,
}) {
  return (
    <header
      className="h-12 px-4 flex items-center justify-between shrink-0 border-b"
      style={{
        backgroundColor: 'var(--de-sidebar)',
        borderColor: 'var(--de-border)',
      }}
    >
      <div className="flex items-center gap-6">
        <button
          onClick={() => onTabChange('learn')}
          className="flex items-center gap-2 font-bold text-sm tracking-tight cursor-pointer"
          style={{ color: 'var(--de-text)' }}
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: 'var(--de-accent-bg)',
              color: 'var(--de-accent)',
              border: '1px solid var(--de-border)',
            }}
          >
            <Database className="w-4 h-4" />
          </span>
          <span>Data Engineering</span>
        </button>

        <nav className="flex items-center gap-1 text-xs">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                style={
                  active
                    ? {
                        backgroundColor: 'var(--de-accent-bg)',
                        color: 'var(--de-accent)',
                        border: '1px solid var(--de-accent)',
                      }
                    : {
                        color: 'var(--de-muted)',
                        border: '1px solid transparent',
                      }
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 text-xs">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--de-card)',
            borderColor: 'var(--de-border)',
            color: 'var(--de-muted)',
          }}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search lessons & concepts...</span>
          <kbd
            className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono-code"
            style={{
              backgroundColor: 'var(--de-sidebar)',
              border: '1px solid var(--de-border)',
            }}
          >
            Ctrl K
          </kbd>
        </button>

        <button
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="p-1.5 rounded-lg border transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--de-card)',
            borderColor: 'var(--de-border)',
            color: 'var(--de-text)',
          }}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
