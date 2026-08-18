import React from 'react';
import type { Route } from '../../types';
import { BrandMark } from '../ui/ToolCard';
import { Icon } from '../ui/Icons';

const TABS = [
  { id: 'tools',   label: 'Tools'   },
  { id: 'api',     label: 'API'     },
  { id: 'pricing', label: 'Pricing' },
  { id: 'blog',    label: 'Blog'    },
];

export default function TopBar({
  theme, onToggleTheme, onOpenSearch, onNav, activeTab = 'tools',
}: {
  theme: string;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onNav: (r: Route) => void;
  activeTab?: string;
}) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-[var(--glass-border)]">
      <div className="flex items-center gap-3 h-[60px] px-4 sm:px-5">

        {/* Brand */}
        <button
          onClick={() => onNav({ kind: 'home' })}
          className="group inline-flex items-center gap-2.5 shrink-0 mr-2 sm:mr-4 rounded-xl px-2 py-1.5 hover:bg-[var(--surface-secondary)]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[var(--gradient-accent)] shadow-[0_8px_22px_rgba(139,124,248,.28)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
            <BrandMark size={8} className="text-white" />
          </span>
          <span className="text-[15.5px] font-bold text-[var(--text-primary)] tracking-[-0.015em] gradient-text-anim">
            ToolBox
          </span>
        </button>

        {/* Nav tabs */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => t.id === 'tools' && onNav({ kind: 'home' })}
              className={`relative h-11 px-4 rounded-xl text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                t.id === activeTab
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
              }`}
            >
              {t.id === activeTab && (
                <span className="absolute inset-0 rounded-lg bg-[var(--surface-tertiary)]" />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="md:hidden flex-1" />

        {/* Icon buttons */}
        <button
          onClick={onOpenSearch}
          className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-all duration-200 hover:-translate-y-0.5"
          aria-label="Search"
        >
          <Icon name="Search" size={16} />
        </button>

        <button
          onClick={onToggleTheme}
          className="w-10 h-10 inline-flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-all duration-200 hover:-translate-y-0.5"
          aria-label="Toggle theme"
        >
          <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={16} />
        </button>

        {/* Pro button */}
        <button
          aria-label="Upgrade to Pro"
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-semibold text-white btn-glow whitespace-nowrap"
          style={{ background: 'var(--gradient-accent)' }}
        >
          Go Pro
        </button>
      </div>
    </header>
  );
}
