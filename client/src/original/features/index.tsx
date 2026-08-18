'use client';
import React, { lazy, Suspense } from 'react';
import type { Tool } from '../types';
import { TOOL_CATEGORIES } from '../constants/tools';
import { Icon } from '../components/ui/Icons';
import { Tag, CategoryDot } from '../components/ui/ToolCard';
import UniversalToolWorkbench from './UniversalToolWorkbench';
import { getRelatedTools, getToolSeo } from '../seo/seo';
import { getToolGuide } from '../seo/tool-guides';
import { getToolTable } from '../seo/tool-tables';

const Universal = lazy(() => Promise.resolve({ default: UniversalToolWorkbench }));

const TOOL_MAP: Record<string, React.LazyExoticComponent<any>> = {
  'pdf-compress':     lazy(() => import('./pdf/PdfCompressTool')),
  'pdf-merge':        lazy(() => import('./pdf/PdfMergeTool')),
  'pdf-to-word':      lazy(() => import('./pdf/PdfToWordTool')),
  'pdf-to-jpg':       lazy(() => import('./pdf/PdfToJpgTool')),
  'word-to-pdf':      lazy(() => import('./pdf/WordToPdfTool')),
  'img-compress':     lazy(() => import('./image/ImgCompressTool')),
  'img-convert':      lazy(() => import('./image/ImgConvertTool')),
  'img-resize':       lazy(() => import('./image/ImgResizeTool')),
  'img-to-text':      lazy(() => import('./image/ImgToTextTool')),
  'bg-remover':       lazy(() => import('./image/BgRemoverTool')),
  'watermark-remove': lazy(() => import('./image/WatermarkRemoveTool')),
  'grammar-check':    lazy(() => import('./text/GrammarCheckTool')),
  'ai-humanizer':     lazy(() => import('./text/HumanizerTool')),
  'plagiarism-check': lazy(() => import('./text/PlagiarismTool')),
  'ai-detector':      lazy(() => import('./text/AiDetectorTool')),
  'word-counter':     lazy(() => import('./text/WordCounterTool')),
  'currency-conv':    lazy(() => import('./calculator/CurrencyTool')),
  'age-calc':         lazy(() => import('./calculator/AgeCalcTool')),
  'bmi-calc':         lazy(() => import('./calculator/BmiCalcTool')),
  'json-format':      lazy(() => import('./developer/JsonFormatterTool')),
  'regex-test':       lazy(() => import('./developer/RegexTesterTool')),
  'base64':           lazy(() => import('./developer/Base64Tool')),
  'jwt-decode':       lazy(() => import('./developer/JwtDecoderTool')),
  'sql-format':       lazy(() => import('./developer/SqlFormatterTool')),
  'code-screenshot':  lazy(() => import('./developer/CodeScreenshotTool')),
  'password-gen':     lazy(() => import('./generator/PasswordGenTool')),
  'uuid-gen':         lazy(() => import('./generator/UuidGenTool')),
  'qr-gen':           lazy(() => import('./generator/QrCodeTool')),
  'resume-builder':   lazy(() => import('./generator/ResumeBuilderTool')),
  'invoice-gen':      lazy(() => import('./generator/InvoiceGenTool')),
  'compound-interest': Universal,
  'crypto-roi': Universal,
  'mortgage-amortization': Universal,
  'salary-after-tax': Universal,
  'freelance-rate': Universal,
  'investment-return': Universal,
  'percentage-calc': Universal,
  'sitemap-generator': Universal,
  'htaccess-generator': Universal,
  'robots-generator': Universal,
  'domain-age': Universal,
  'social-share': Universal,
  'json-csv': Universal,
  'regex-cheat': Universal,
  'sql-formatter': Universal,
  'yaml-validator': Universal,
  'crontab-generator': Universal,
  'timezone-converter': Universal,
  'svg-png': Universal,
  'flexbox-generator': Universal,
  'utm-builder': Universal,
  'subnet-calc': Universal,
};

/* Resume & Invoice get their own full-page layout (they manage it internally) */
const FULLSCREEN = new Set(['resume-builder', 'invoice-gen']);

function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div
            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <div
            className="absolute inset-[6px] rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--cat-generator-ink)', borderTopColor: 'transparent', animationDirection: 'reverse', animationDuration: '0.6s' }}
          />
        </div>
        <p className="text-[13px] text-[var(--text-tertiary)] animate-fade-in">Loading {label}…</p>
      </div>
    </div>
  );
}

export default function ToolPage({ tool, onBack, onOpenTool }: {
  tool: Tool; onBack: () => void; onOpenTool?: (t: Tool) => void;
}) {
  const LazyComp = TOOL_MAP[tool.id];
  const seo = getToolSeo(tool.id);
  const guide = getToolGuide(tool.id);
  const table = getToolTable(tool.id);
  const relatedTools = getRelatedTools(tool);
  const Component = LazyComp as React.ComponentType<{ tool: Tool; onBack: () => void }> | undefined;
  const cat = TOOL_CATEGORIES.find(c => c.id === tool.category) || TOOL_CATEGORIES[0];

  if (FULLSCREEN.has(tool.id)) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <h1 className="sr-only">{tool.name}</h1>
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
            <LoadingSpinner label={tool.name} />
          </div>
        }>
          {Component && <Component tool={tool} onBack={onBack} />}
        </Suspense>
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12" aria-label={`${tool.name} guide`}>
          <p className="text-[11px] uppercase tracking-[0.16em] font-bold" style={{ color: 'var(--accent)' }}>Practical guide</p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">About {tool.name}</h2>
          {guide ? <div className="mt-5 grid gap-3 sm:grid-cols-3">{[
            ['Example', guide.example], ['How it works', guide.method], ['Limits to know', guide.limitations],
          ].map(([heading, body]) => <div key={heading} className="rounded-xl p-4" style={{ background: 'var(--surface-secondary)' }}><h3 className="text-[13px] font-bold text-[var(--text-primary)]">{heading}</h3><p className="mt-1.5 text-[12px] leading-5 text-[var(--text-secondary)]">{body}</p></div>)}</div> : null}
          {seo?.content.map(section => <div key={section.heading} className="mt-6"><h3 className="text-[15px] font-bold text-[var(--text-primary)]">{section.heading}</h3><p className="mt-1.5 text-[14px] leading-7 text-[var(--text-secondary)]">{section.body}</p></div>)}
          {seo?.faqs.length ? <div className="mt-8 border-t border-[var(--border)] pt-6"><h2 className="text-lg font-bold text-[var(--text-primary)]">Frequently asked questions</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{seo.faqs.map(item => <div key={item.question}><h3 className="text-[14px] font-semibold text-[var(--text-primary)]">{item.question}</h3><p className="mt-1 text-[13px] leading-6 text-[var(--text-secondary)]">{item.answer}</p></div>)}</div></div> : null}
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-full animate-fade-in">

      {/* ── Colourful tool page header ── */}
      <div className="relative px-4 sm:px-6 lg:px-8 pt-5 pb-6 border-b border-[var(--border)] overflow-hidden">
        {/* Mesh gradient behind header */}
        <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" aria-hidden />

        {/* Breadcrumb */}
        <nav className="relative flex items-center gap-1.5 text-[12px] mb-5 flex-wrap">
          <button
            onClick={onBack}
            className="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium"
          >
            All Tools
          </button>
          <span className="gradient-text font-bold">/</span>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: `var(--cat-${cat.id})` }}
            />
            {cat.label}
          </button>
          <span className="gradient-text font-bold">/</span>
          <span className="text-[var(--text-secondary)] font-semibold">{tool.name}</span>
        </nav>

        {/* Tool identity */}
        <div className="relative flex items-start gap-4">
          <div
            className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center shrink-0 cat-tile-${tool.category} animate-pop`}
            style={{ boxShadow: `0 0 24px var(--cat-${tool.category}-soft)` }}
          >
            <Icon name={tool.icon} size={28} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              <h1
                className="font-bold tracking-[-0.025em] text-[var(--text-primary)] leading-tight animate-fade-in-up"
                style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
              >
                {tool.name}
              </h1>
              <Tag tag={tool.tag} />
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed animate-fade-in-up anim-d-100">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Tool content — full available width ── */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-7">
        <Suspense fallback={<LoadingSpinner label={tool.name} />}>
          {Component
            ? <Component tool={tool} onBack={onBack} />
            : (
              <div
                className="rounded-2xl border-2 border-dashed border-[var(--border-strong)] min-h-[220px] flex flex-col items-center justify-center gap-3 px-6 py-12 text-center animate-border"
                style={{ background: 'var(--surface-secondary)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
                  <Icon name="Zap" size={22} className="text-white" />
                </div>
                <p className="text-[15px] font-bold text-[var(--text-primary)]">Tool coming soon</p>
                <p className="text-[13px] text-[var(--text-tertiary)]">We're building this. Check back shortly.</p>
              </div>
            )
          }
        </Suspense>

        <section className="mt-10 max-w-5xl mx-auto grid gap-5 lg:grid-cols-[1.35fr_0.65fr]" aria-label="Tool guide">
          <div className="rounded-2xl border border-[var(--border)] p-6 sm:p-8" style={{ background: 'var(--surface-primary)' }}>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] font-bold" style={{ color: 'var(--accent)' }}>Practical guide</p>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-[var(--text-primary)]">How to use {tool.name}</h2>
              </div>
              <span className="hidden sm:inline-flex rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: 'var(--surface-secondary)', color: 'var(--text-secondary)' }}>Transparent workflow</span>
            </div>
            <p className="text-[14px] leading-7 text-[var(--text-secondary)] mb-6">{tool.description} Start with the inputs above, review the assumptions in the result, and use the feedback controls to tell us what would make this workflow clearer.</p>
            {guide ? (
              <div className="mb-7 grid gap-3 sm:grid-cols-3">
                {[
                  ['Example', guide.example],
                  ['How it works', guide.method],
                  ['Limits to know', guide.limitations],
                ].map(([heading, body]) => (
                  <div key={heading} className="rounded-xl p-4" style={{ background: 'var(--surface-secondary)' }}>
                    <h3 className="text-[13px] font-bold text-[var(--text-primary)]">{heading}</h3>
                    <p className="mt-1.5 text-[12px] leading-5 text-[var(--text-secondary)]">{body}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {table ? (
              <div className="mb-7 overflow-x-auto rounded-xl border border-[var(--border)]">
                <table className="w-full min-w-[620px] text-left text-[12px]">
                  <caption className="px-4 py-3 text-left text-[13px] font-bold text-[var(--text-primary)]" style={{ background: 'var(--surface-secondary)' }}>{table.caption}</caption>
                  <thead style={{ background: 'var(--surface-secondary)' }}><tr>{table.headers.map(header => <th key={header} scope="col" className="border-t border-[var(--border)] px-4 py-3 font-bold text-[var(--text-primary)]">{header}</th>)}</tr></thead>
                  <tbody>{table.rows.map((row, rowIndex) => <tr key={`${row[0]}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className="border-t border-[var(--border)] px-4 py-3 align-top leading-5 text-[var(--text-secondary)]">{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
            ) : null}
            <div className="space-y-5">
              {(seo?.content || [
                { heading: 'What this tool is for', body: `${tool.name} is designed for a focused, repeatable workflow. It keeps the main action visible, explains the result in plain language, and avoids asking for information that is not needed for the task.` },
                { heading: 'Method and limitations', body: `Results are generated from the values you provide in your browser. Review the assumptions and source state before using a financial, legal, medical, security, or production decision.` },
                { heading: 'A useful next step', body: `Save or copy the result, then compare it with the related tools below when your task involves another stage of the same workflow.` },
              ]).map(section => (
                <div key={section.heading}>
                  <h3 className="text-[15px] font-bold text-[var(--text-primary)]">{section.heading}</h3>
                  <p className="mt-1.5 text-[14px] leading-7 text-[var(--text-secondary)]">{section.body}</p>
                </div>
              ))}
            </div>
            {seo?.faqs?.length ? (
              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Frequently asked questions</h2>
                <div className="mt-4 space-y-4">
                  {seo.faqs.map(item => (
                    <div key={item.question}>
                      <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">{item.question}</h3>
                      <p className="mt-1 text-[13px] leading-6 text-[var(--text-secondary)]">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="rounded-2xl border border-[var(--border)] p-6" style={{ background: 'var(--surface-secondary)' }}>
            <p className="text-[11px] uppercase tracking-[0.16em] font-bold" style={{ color: 'var(--accent)' }}>Keep exploring</p>
            <h2 className="mt-1 text-lg font-bold text-[var(--text-primary)]">Related tools</h2>
            <div className="mt-4 space-y-2">
              {relatedTools.map(related => (
                <button key={related.id} onClick={() => onOpenTool?.(related)} className="w-full text-left rounded-xl px-3 py-3 transition-colors hover:bg-[var(--surface-primary)] focus-visible:outline-none focus-visible:ring-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="block text-[13px] font-semibold text-[var(--text-primary)]">{related.name}</span>
                  <span className="block mt-0.5 text-[12px] leading-5">{related.description}</span>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
