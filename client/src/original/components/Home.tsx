import React from 'react';
import type { Tool } from '../types';
import { TOOLS, TOOL_CATEGORIES, QUICK_FILTERS } from '../constants/tools';
import { Icon } from '../components/ui/Icons';
import { CategoryDot, ToolCard, StatsCard } from '../components/ui/ToolCard';
import { SEO_GUIDES } from '../seo/seo-guides';

export default function Home({
  activeCategory, query, setQuery, setActiveCategory,
  activeFilter, setActiveFilter, onOpenTool,
}: {
  activeCategory: string | null;
  query: string;
  setQuery: (q: string) => void;
  setActiveCategory: (c: string | null) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  onOpenTool: (t: Tool) => void;
}) {
  const filterFn = QUICK_FILTERS.find(f => f.id === activeFilter)?.match;
  const filtered = TOOLS.filter(t => {
    if (activeCategory && t.category !== activeCategory) return false;
    if (filterFn && !filterFn(t)) return false;
    const q = query.toLowerCase();
    return !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.keywords || []).some(k => k.includes(q));
  });
  const sections = TOOL_CATEGORIES
    .map(cat => ({ cat, tools: filtered.filter(t => t.category === cat.id) }))
    .filter(s => s.tools.length > 0);

  const isFiltered = !!activeCategory || !!query || activeFilter !== 'all';

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-12 max-w-[1140px] w-full mx-auto">

      {/* ── Hero / Search ── */}
      {!isFiltered && (
        <div className="relative mb-7 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-secondary)] bg-mesh animate-fade-in">
          <div className="px-6 pt-7 pb-5">
            <div className="mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full animate-glow" style={{ background: 'var(--gradient-accent)' }} aria-hidden />
              <span className="eyebrow">ToolSuite</span>
            </div>
            <h1 className="font-bold text-[var(--text-primary)] mb-4 leading-tight" style={{ fontSize: 'var(--fs-hero)', letterSpacing: '-0.025em' }}>
              Everything useful,{' '}
              <span className="gradient-text-anim">in one calm workspace.</span>
            </h1>

            {/* Search inside hero */}
            <div className="relative max-w-xl">
              <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                aria-label="Search ToolBox tools"
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tools… (compress PDF, remove background…)"
                className="w-full h-12 pl-12 pr-16 rounded-xl glass border border-[var(--glass-border)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-line)] focus:ring-4 focus:ring-[var(--accent-tint)] transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 kbd hidden sm:inline">⌘K</span>
            </div>
            <p className="mt-3 text-[12px] text-[var(--text-tertiary)]">Private by default · quick browser tools · clear results</p>
          </div>
        </div>
      )}

      {/* ── Search bar (filtered state) ── */}
      {isFiltered && (
        <div className="relative mb-4 animate-fade-in">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            aria-label="Search ToolBox tools"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full h-12 pl-12 pr-16 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-line)] focus:ring-4 focus:ring-[var(--accent-tint)] transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 kbd hidden sm:inline">⌘K</span>
        </div>
      )}

      {/* ── Mobile category shortcuts ── */}
      <div className="lg:hidden -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1 snap-x" aria-label="Browse tool categories">
        <button type="button" onClick={() => setActiveCategory(null)} className={`shrink-0 snap-start rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-all ${!activeCategory ? 'border-transparent bg-[var(--accent)] text-white shadow-[0_8px_20px_var(--accent-soft)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'}`}>All tools</button>
        {TOOL_CATEGORIES.map(cat => <button type="button" key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`shrink-0 snap-start rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-all ${activeCategory === cat.id ? 'border-transparent bg-[var(--accent)] text-white shadow-[0_8px_20px_var(--accent-soft)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'}`}>{cat.short}</button>)}
      </div>

      {/* ── Quick Filters ── */}
      <div className="flex flex-wrap items-center gap-2 mb-7 animate-fade-in anim-d-100">
        {QUICK_FILTERS.map(f => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`inline-flex items-center h-8 px-3.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-[var(--accent)] text-white border border-transparent shadow-[0_0_12px_var(--accent-soft)]'
                  : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── Stats Card (home only) ── */}
      {!isFiltered && (
        <div className="mb-10 animate-fade-in-up anim-d-150">
          <StatsCard />
        </div>
      )}

      {/* ── Tool Sections ── */}
      {sections.length === 0 ? (
        <div className="text-center py-20 px-6 text-[var(--text-tertiary)] animate-fade-in">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] shadow-[0_12px_28px_rgba(0,0,0,.18)]">
            <Icon name="Search" size={24} />
          </div>
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">No tools match those filters.</p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6">Try a shorter search, or clear the filters to browse the complete toolkit.</p>
          <button
            type="button"
            onClick={() => { setQuery(''); setActiveCategory(null); setActiveFilter('all'); }}
            className="mt-5 inline-flex h-10 items-center rounded-xl bg-[var(--accent)] px-4 text-[13px] font-semibold text-white shadow-[0_8px_22px_var(--accent-soft)] hover:-translate-y-0.5"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {sections.map(({ cat, tools }, sIdx) => {
            const displayTools = isFiltered ? tools : tools.slice(0, 3);
            const hasBento = displayTools.length >= 4;

            return (
              <section
                key={cat.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${sIdx * 60}ms` }}
              >
                {/* Section header */}
                <div className="flex items-baseline justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-glow"
                      style={{ background: `var(--cat-${cat.id})` }}
                      aria-hidden
                    />
                    <h2 className="text-[18px] font-bold text-[var(--text-primary)] tracking-[-0.015em]">
                      {cat.label.replace(' Tools', ' tools')}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--accent)] hover:underline whitespace-nowrap transition-colors"
                  >
                    See all {tools.length}
                    <Icon name="ArrowRight" size={11} />
                  </button>
                </div>

                {/* Bento grid */}
                {hasBento && !isFiltered ? (
                  <div className="bento-grid">
                    {displayTools.map((t, idx) => (
                      <div key={t.id} className={idx === 0 ? 'bento-wide' : ''}>
                        <ToolCard
                          tool={t}
                          onOpen={onOpenTool}
                          variant={idx === 0 ? 'wide' : 'featured'}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {displayTools.map(t => (
                      <ToolCard key={t.id} tool={t} onOpen={onOpenTool} variant="featured" />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {!isFiltered && (
        <>
        <section id="guides" className="mt-14" aria-label="ToolSuite guides">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="eyebrow">Learn before you act</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">Practical guides for better decisions.</h2>
            </div>
            <span className="hidden sm:inline text-[12px] text-[var(--text-tertiary)]">Transparent methods, not ranking promises</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {SEO_GUIDES.map(guide => (
              <article key={guide.id} className="rounded-2xl border border-[var(--border)] p-5" style={{ background: 'var(--surface-primary)' }}>
                <p className="text-[11px] uppercase tracking-[0.14em] font-bold" style={{ color: 'var(--accent)' }}>{guide.category === 'all' ? 'Privacy' : guide.category}</p>
                <h3 className="mt-2 text-[15px] font-bold text-[var(--text-primary)]">{guide.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[var(--text-secondary)]">{guide.summary}</p>
                <button type="button" onClick={() => guide.category !== 'all' && setActiveCategory(guide.category)} className="mt-3 text-[12px] font-semibold hover:underline" style={{ color: 'var(--accent)' }}>{guide.category === 'all' ? 'Read the notes above' : `Browse ${guide.category} tools`}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]" aria-label="About ToolSuite">
          <div className="rounded-2xl border border-[var(--border)] p-6 sm:p-8" style={{ background: 'var(--surface-secondary)' }}>
            <p className="eyebrow">A calmer way to get things done</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">One workspace for everyday digital tasks.</h2>
            <p className="mt-3 text-[14px] leading-7 text-[var(--text-secondary)]">ToolSuite brings practical browser tools into one searchable place: create an ATS-first resume, check a calculation, prepare SEO files, format developer data, or generate a file-ready result without opening a chain of unrelated websites.</p>
            <p className="mt-3 text-[14px] leading-7 text-[var(--text-secondary)]">Each tool explains what it does, shows its inputs and assumptions, and gives you a clear result state. Where a workflow runs locally, the page says so; where an estimate or external lookup has limits, the page keeps those limits visible.</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-6 sm:p-8" style={{ background: 'var(--surface-primary)' }}>
            <p className="eyebrow">Choose your starting point</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {TOOL_CATEGORIES.map(cat => {
                const count = TOOLS.filter(tool => tool.category === cat.id).length;
                return (
                  <button key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)} className="rounded-xl border border-[var(--border)] p-3 text-left transition-colors hover:bg-[var(--surface-secondary)] focus-visible:outline-none focus-visible:ring-2" style={{ color: 'var(--text-secondary)' }}>
                    <span className="block text-[14px] font-bold text-[var(--text-primary)]">{cat.label}</span>
                    <span className="mt-1 block text-[12px]">{count} focused tools for this workflow</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        </>
      )}
    </div>
  );
}
