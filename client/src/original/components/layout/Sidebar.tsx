import React from 'react';
import { TOOLS, TOOL_CATEGORIES } from '../../constants/tools';
import { CategoryDot } from '../ui/ToolCard';

function SidebarItem({
  active, onClick, label, count, dotCategory,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  dotCategory?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2.5 w-full h-10 px-3 rounded-lg text-[13px] font-medium transition-all duration-150 ${
        active
          ? 'bg-[var(--surface-secondary)] text-[var(--text-primary)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
      }`}
    >
      {/* Active indicator — gradient bar */}
      {active && (
        <span
          className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-r-full"
          style={{ background: 'var(--gradient-accent)' }}
        />
      )}

      {dotCategory ? (
        <CategoryDot category={dotCategory} size={8} />
      ) : (
        <span className="w-2 h-2 rounded-sm border border-[var(--border-strong)] shrink-0" />
      )}

      <span className="flex-1 text-left truncate">{label}</span>

      {typeof count === 'number' && (
        <span
          className={`text-[10.5px] font-bold tabular-nums px-1.5 py-0.5 rounded-md ${
            active
              ? 'text-[var(--accent)] bg-[var(--accent-tint)]'
              : 'text-[var(--text-tertiary)]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({
  activeCategory, onSelectCategory,
}: {
  activeCategory: string | null;
  onSelectCategory: (c: string | null) => void;
}) {
  const popular = [
    { id: 'trending',  label: 'Trending',   cat: 'pdf'       },
    { id: 'most-used', label: 'Most used',   cat: 'developer' },
    { id: 'ai-powered',label: 'AI-powered',  cat: 'image'     },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 px-2.5 py-5 border-r border-[var(--border)] bg-[var(--bg-base)] h-[calc(100vh-60px)] sticky top-[60px] overflow-y-auto">

      {/* Categories */}
      <div className="eyebrow px-3 mb-2">Categories</div>

      <SidebarItem
        active={!activeCategory}
        onClick={() => onSelectCategory(null)}
        label="All tools"
        count={TOOLS.length}
      />

      {TOOL_CATEGORIES.map(cat => (
        <SidebarItem
          key={cat.id}
          active={activeCategory === cat.id}
          onClick={() => onSelectCategory(cat.id)}
          label={cat.short}
          count={TOOLS.filter(t => t.category === cat.id).length}
          dotCategory={cat.id}
        />
      ))}

      {/* Divider */}
      <div className="my-4 mx-3 border-t border-[var(--border)]" />

      {/* Popular */}
      <div className="eyebrow px-3 mb-2">Quick picks</div>
      {popular.map(p => (
        <SidebarItem
          key={p.id}
          onClick={() => onSelectCategory(p.cat)}
          label={p.label}
          dotCategory={p.cat}
        />
      ))}

      {/* Bottom promo card */}
      <div className="mt-auto pt-5">
        <div className="rounded-xl p-3.5 relative overflow-hidden border border-[var(--border)]" style={{ background: 'var(--gradient-mesh)' }}>
          <div className="text-[12px] font-bold text-[var(--text-primary)] mb-0.5">Go Pro</div>
          <div className="text-[11px] text-[var(--text-tertiary)] leading-snug">
            API access & priority processing
          </div>
          <button className="mt-3 w-full h-8 rounded-lg text-[12px] font-semibold text-white btn-glow" style={{ background: 'var(--gradient-accent)' }}>
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
