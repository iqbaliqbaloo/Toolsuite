import React from 'react';
import type { Tool, ToolTag } from '../../types';
import { Icon } from './Icons';

export function BrandMark({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full btn-glow ${className}`}
      style={{ width: size, height: size, background: 'var(--gradient-accent)' }}
      aria-hidden
    />
  );
}

export function CategoryDot({ category, size = 7, className = '' }: { category: string; size?: number; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full shrink-0 ${className}`}
      style={{ width: size, height: size, background: `var(--cat-${category})` }}
      aria-hidden
    />
  );
}

const TAG_TONE: Record<string, string> = {
  orange: 'text-[var(--tag-orange)] bg-[var(--tag-orange-bg)]',
  violet: 'text-[var(--tag-violet)] bg-[var(--tag-violet-bg)]',
  green:  'text-[var(--tag-green)]  bg-[var(--tag-green-bg)]',
};

export function Tag({ tag }: { tag?: ToolTag }) {
  if (!tag) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide ${TAG_TONE[tag.tone] || TAG_TONE.violet}`}>
      {tag.label}
    </span>
  );
}

/* ── ToolCard ── */
export function ToolCard({
  tool,
  onOpen,
  variant = 'featured',
  bento,
}: {
  tool: Tool;
  onOpen?: (t: Tool) => void;
  variant?: 'featured' | 'minimal' | 'wide';
  bento?: boolean;
}) {
  const click = (e: React.MouseEvent) => { e.preventDefault(); onOpen?.(tool); };

  if (variant === 'minimal') {
    return (
      <a
        href={tool.slug}
        onClick={click}
        className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] card-hover"
      >
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cat-tile-${tool.category}`}>
          <Icon name={tool.icon} size={15} strokeWidth={2} />
        </span>
        <span className="flex-1 min-w-0 text-[13.5px] font-semibold text-[var(--text-primary)] truncate">{tool.name}</span>
        <Icon
          name="ChevronRight"
          size={14}
          className="text-[var(--text-tertiary)] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </a>
    );
  }

  if (variant === 'wide') {
    return (
      <a
        href={tool.slug}
        onClick={click}
        className="group relative flex flex-col sm:flex-row rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] card-hover overflow-hidden"
      >
        {/* left accent bar */}
        <span
          className="hidden sm:block w-1 shrink-0 rounded-l-2xl"
          style={{ background: `var(--cat-${tool.category})` }}
          aria-hidden
        />
        <div className="flex flex-col sm:flex-row items-start gap-4 p-5 flex-1">
          <span className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 cat-tile-${tool.category}`}>
            <Icon name={tool.icon} size={22} strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-[17px] font-bold text-[var(--text-primary)] tracking-[-0.015em]">{tool.name}</h3>
              <Tag tag={tool.tag} />
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55] line-clamp-2">{tool.description}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--text-tertiary)]">
              <Icon name="Check" size={11} className="text-[var(--success)]" />
              {tool.highlight}
            </span>
          </div>
          <div className="shrink-0 self-center">
            <span className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-[var(--border-strong)] text-[13px] font-semibold text-[var(--text-primary)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-transparent transition-all duration-200 whitespace-nowrap">
              Open <Icon name="ArrowRight" size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </a>
    );
  }

  /* featured (default) */
  return (
    <a
      href={tool.slug}
      onClick={click}
      className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] card-hover overflow-hidden"
    >
      <div className="flex flex-col p-5 gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <span className={`w-11 h-11 rounded-xl flex items-center justify-center cat-tile-${tool.category}`}>
            <Icon name={tool.icon} size={20} strokeWidth={2} />
          </span>
          <Tag tag={tool.tag} />
        </div>
        <h3 className="text-[17px] font-bold text-[var(--text-primary)] leading-tight tracking-[-0.015em]">
          {tool.name}
        </h3>
        <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55] flex-1 text-pretty">
          {tool.description}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-[var(--border)]">
        <span className="text-[11.5px] font-medium text-[var(--text-tertiary)] inline-flex items-center gap-1.5">
          <Icon name="Check" size={11} className="text-[var(--success)]" />
          {tool.highlight}
        </span>
        <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[var(--border-strong)] text-[12.5px] font-semibold text-[var(--text-primary)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-transparent transition-all duration-200 whitespace-nowrap">
          Use tool
          <Icon name="ArrowRight" size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

/* ── StatsCard — vivid multi-colour bento hero ── */
const STAT_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',   /* indigo → violet */
  'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',   /* pink  → orange  */
  'linear-gradient(135deg, #00d4ff 0%, #6366f1 100%)',   /* cyan  → indigo  */
] as const;

export function StatsCard() {
  const stats = [
    { label: 'Tools online',          value: '30',    sub: 'Exact catalog' },
    { label: 'Files processed today', value: '84.2k', sub: '↑ 12% vs yesterday' },
    { label: 'Avg processing time',   value: '1.3s',  sub: 'No signup needed' },
  ] as const;

  return (
    <div className="stats-card relative rounded-2xl overflow-hidden border border-[var(--border)] animate-border">
      <div className="absolute inset-0 bg-mesh pointer-events-none" aria-hidden />
      <div className="relative grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="px-6 py-6 animate-fade-in-up"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="text-[10.5px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">
              {s.label}
            </div>
            <div
              className="text-[40px] font-bold leading-none tracking-[-0.035em] tabular-nums animate-pop"
              style={{
                animationDelay: `${80 + i * 90}ms`,
                background: STAT_GRADIENTS[i],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {s.value}
            </div>
            <div className="text-[11.5px] text-[var(--text-tertiary)] mt-2">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
