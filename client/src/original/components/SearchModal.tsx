import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Tool } from '../types';
import { TOOLS } from '../constants/tools';
import { Icon } from './ui/Icons';
import { Tag } from './ui/ToolCard';

export default function SearchModal({ open, onClose, onOpenTool }: {
  open: boolean; onClose: () => void; onOpenTool: (t: Tool) => void;
}) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQ(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TOOLS.filter(t => t.badge === 'Popular').slice(0, 6);
    return TOOLS.filter(t =>
      t.name.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s) ||
      (t.keywords || []).some(k => k.includes(s))
    ).slice(0, 8);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[active]) { onOpenTool(results[active]); onClose(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, results, active, onClose, onOpenTool]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[13vh] px-4"
      style={{ background: 'rgba(7,7,26,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[600px] rounded-2xl overflow-hidden animate-pop"
        style={{
          background: 'var(--glass-bg-strong)',
          backdropFilter: 'blur(30px) saturate(220%)',
          WebkitBackdropFilter: 'blur(30px) saturate(220%)',
          border: '1px solid var(--glass-border-strong)',
          boxShadow: '0 0 0 1px var(--accent-line), 0 32px 80px rgba(0,0,20,0.7), 0 0 60px rgba(99,102,241,0.15)',
        }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--glass-border)]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--gradient-accent)' }}>
            <Icon name="Search" size={14} className="text-white" />
          </div>
          <input
            ref={inputRef}
            value={q}
            onChange={e => { setQ(e.target.value); setActive(0); }}
            placeholder="Search tools…"
            className="flex-1 bg-transparent text-[14.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
          />
          <span className="kbd">Esc</span>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="py-12 px-4 text-center text-[13px] text-[var(--text-tertiary)]">
            No tools match &ldquo;{q}&rdquo;
          </div>
        ) : (
          <div className="p-2 max-h-[50vh] overflow-y-auto">
            {!q.trim() && (
              <div className="px-3 py-2 mb-1">
                <span className="gradient-text text-[10.5px] font-bold uppercase tracking-widest">
                  Popular
                </span>
              </div>
            )}
            {results.map((tool, i) => (
              <button
                key={tool.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => { onOpenTool(tool); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-100"
                style={i === active ? {
                  background: 'var(--accent-soft)',
                  border: '1px solid var(--accent-line)',
                } : {
                  border: '1px solid transparent',
                }}
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cat-tile-${tool.category}`}>
                  <Icon name={tool.icon} size={15} strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-[var(--text-primary)] truncate">
                    {tool.name}
                  </div>
                  <div className="text-[11.5px] text-[var(--text-tertiary)] truncate mt-0.5">
                    {tool.description}
                  </div>
                </div>
                <Tag tag={tool.tag} />
                {i === active && (
                  <span className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
                    <Icon name="ArrowRight" size={11} className="text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--glass-border)] text-[11px] text-[var(--text-tertiary)]"
          style={{ background: 'rgba(99,102,241,0.04)' }}
        >
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="kbd">↑</span><span className="kbd">↓</span> navigate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="kbd">↵</span> open
            </span>
          </div>
          <span className="gradient-text font-semibold">{TOOLS.length} tools</span>
        </div>
      </div>
    </div>
  );
}
