import React, { useState, useCallback } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, Label, SelectField, CopyBtn } from '../../components/ui/shared';
import { apiPost } from '../../services/api';
import { dlBlob } from '../../utils/helpers';

// ─── Types ────────────────────────────────────────────────────────────────────

type Style = 'natural' | 'casual' | 'professional' | 'academic';

interface DiffToken {
  text:   string;
  type:   'same' | 'removed' | 'added';
}

interface HumanizeResult {
  humanized:              string;
  aiScoreBefore:          number;
  aiScoreAfter:           number;
  originalReadability:    number;
  humanizedReadability:   number;
  changes:                string[];
  diff:                   DiffToken[];
  wordsBefore:            number;
  wordsAfter:             number;
  chunkCount:             number;
}

// ─── Readability (Flesch) — client-side preview ───────────────────────────────

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function fleschScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words     = text.trim().split(/\s+/).filter(Boolean);
  if (!sentences.length || !words.length) return 0;
  const syllables = words.reduce((n, w) => n + countSyllables(w), 0);
  const asl  = words.length / sentences.length;
  const asw  = syllables / words.length;
  return Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * asl - 84.6 * asw)));
}

function fleschLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Very easy',       color: '#22c55e' };
  if (score >= 70) return { label: 'Easy',            color: '#84cc16' };
  if (score >= 60) return { label: 'Standard',        color: '#eab308' };
  if (score >= 50) return { label: 'Fairly difficult',color: '#f97316' };
  if (score >= 30) return { label: 'Difficult',       color: '#ef4444' };
  return                  { label: 'Very difficult',  color: '#dc2626' };
}

// ─── Word count ───────────────────────────────────────────────────────────────

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─── Simple client-side diff (word level) ─────────────────────────────────────

function buildDiff(original: string, humanized: string): DiffToken[] {
  const ow = original.split(/\s+/).filter(Boolean);
  const hw = humanized.split(/\s+/).filter(Boolean);
  const tokens: DiffToken[] = [];

  // LCS-based simple diff
  const m = ow.length, n = hw.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = ow[i] === hw[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && ow[i] === hw[j]) {
      tokens.push({ text: ow[i] + ' ', type: 'same' });
      i++; j++;
    } else if (j < n && (i >= m || dp[i + 1][j] <= dp[i][j + 1])) {
      tokens.push({ text: hw[j] + ' ', type: 'added' });
      j++;
    } else {
      tokens.push({ text: ow[i] + ' ', type: 'removed' });
      i++;
    }
  }
  return tokens;
}

// ─── Style definitions ────────────────────────────────────────────────────────

const STYLE_DESCRIPTIONS: Record<Style, string> = {
  casual:       'Short sentences (8–12 words avg), contractions, slang OK, no passive voice.',
  natural:      'Varied length (8–20 words), conversational, minimal passive voice.',
  professional: 'Medium sentences (15–20 words), formal but clear, some passive OK.',
  academic:     'Long sentences (20–30 words), complex vocabulary, passive common.',
};

// ─── AI signal analyzer (client-side, for preview only) ──────────────────────

function analyzeAiSignals(text: string): string[] {
  const signals: string[] = [];
  const lower = text.toLowerCase();
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());

  const roboticWords = ['furthermore','moreover','additionally','in conclusion',
    'it is important to note','utilize','commence','facilitate','optimal','demonstrate'];
  const found = roboticWords.filter(w => lower.includes(w));
  if (found.length > 0) signals.push(`Robotic phrases detected: ${found.join(', ')}`);

  const contractions = (text.match(/\b\w+n't\b|\b(I'm|it's|don't|can't|won't|isn't|aren't|we're|they're|you're)\b/gi) || []).length;
  if (contractions === 0) signals.push('No contractions — sounds robotic');

  const passiveMatches = (text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length;
  if (passiveMatches > 2) signals.push(`Passive voice overuse (${passiveMatches} instances)`);

  if (sentences.length > 2) {
    const lens = sentences.map(s => s.trim().split(/\s+/).length);
    const avg  = lens.reduce((a, b) => a + b, 0) / lens.length;
    const variance = lens.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lens.length;
    if (variance < 10) signals.push('Uniform sentence length — low variation');
  }

  const firstPerson = (text.match(/\bI\b|\bI think\b|\bIn my view\b/gi) || []).length;
  if (firstPerson === 0 && words.length > 50) signals.push('No first-person voice detected');

  return signals;
}

// ─── History entry ────────────────────────────────────────────────────────────

interface HistoryEntry {
  id:        number;
  original:  string;
  result:    HumanizeResult;
  style:     Style;
  ts:        string;
}

let histId = 0;

// ─── Component ───────────────────────────────────────────────────────────────

function HumanizerTool() {
  const [text,    setText]    = useState('');
  const [style,   setStyle]   = useState<Style>('natural');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<HumanizeResult | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [tab,     setTab]     = useState<'result' | 'diff' | 'history'>('result');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const wc        = wordCount(text);
  const flesch    = fleschScore(text);
  const flInfo    = fleschLabel(flesch);
  const aiSignals = text.trim().length > 30 ? analyzeAiSignals(text) : [];

  // ── Run ──────────────────────────────────────────────────────────────────
  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const data: HumanizeResult = await apiPost('/text/humanize', { text, style });

      // build client-side diff if backend didn't provide one
      if (!data.diff && data.humanized) {
        data.diff = buildDiff(text, data.humanized);
      }

      // client-side readability fallback
      if (!data.originalReadability)  data.originalReadability  = fleschScore(text);
      if (!data.humanizedReadability) data.humanizedReadability = fleschScore(data.humanized);
      if (!data.wordsBefore)          data.wordsBefore          = wordCount(text);
      if (!data.wordsAfter)           data.wordsAfter           = wordCount(data.humanized);

      setResult(data);
      setTab('result');
      setHistory(prev => [{
        id: ++histId, original: text, result: data, style,
        ts: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 10));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  // ── Download ─────────────────────────────────────────────────────────────
  const download = () => {
    if (!result) return;
    const blob = new Blob([result.humanized], { type: 'text/plain' });
    dlBlob(blob, 'humanized.txt');
  };

  // ── Shared classes ────────────────────────────────────────────────────────
  const cardCls = "rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3";
  const tabCls  = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-[12.5px] border transition-colors ${
      active
        ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
        : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent-line)]'
    }`;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">

      {/* ── Input ── */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label>AI-generated text</Label>
          <span className="text-[11px] text-[var(--text-tertiary)]">{wc} words</span>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste AI-written text here…"
          rows={7}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13.5px] text-[var(--text-primary)] leading-relaxed outline-none focus:border-[var(--accent-line)] transition-colors resize-none"
        />
      </div>

      {/* ── Input analysis ── */}
      {text.trim().length > 30 && (
        <div className={cardCls}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] text-[var(--text-secondary)]">Input readability</span>
            <span className="text-[12px] font-mono" style={{ color: flInfo.color }}>
              Flesch {flesch} — {flInfo.label}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--border-strong)] overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${flesch}%`, background: flInfo.color }} />
          </div>
          {aiSignals.length > 0 && (
            <div className="mt-3 flex flex-col gap-1">
              <span className="text-[11px] text-[var(--text-tertiary)]">AI signals detected</span>
              {aiSignals.map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11.5px] text-[var(--text-secondary)]">
                  <Icon name="AlertTriangle" size={11} className="mt-0.5 shrink-0 text-[var(--warning)]" />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Style selector + run ── */}
      {text.trim().length >= 10 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[160px]">
              <Label>Writing style</Label>
              <select value={style} onChange={e => setStyle(e.target.value as Style)}
                className="w-full h-10 px-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors">
                <option value="casual">Casual</option>
                <option value="natural">Natural</option>
                <option value="professional">Professional</option>
                <option value="academic">Academic</option>
              </select>
            </div>
            <Btn loading={loading} onClick={run} disabled={wc < 5}>
              <Icon name="UserCheck" size={15} /> Humanize
            </Btn>
          </div>
          <p className="text-[11.5px] text-[var(--text-tertiary)]">{STYLE_DESCRIPTIONS[style]}</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-3 text-[13px] text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* ── Result tabs ── */}
      {result && (
        <div className="flex flex-col gap-4">

          {/* Score cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['AI score — original',   result.aiScoreBefore,        '%'],
              ['Human score — rewritten', result.aiScoreAfter,       '%'],
              ['Readability — original', result.originalReadability,  'Flesch'],
              ['Readability — rewritten', result.humanizedReadability,'Flesch'],
            ].map(([lbl, val, unit]) => {
              const v  = Number(val) || 0;
              const fl = unit === 'Flesch' ? fleschLabel(v) : null;
              return (
                <div key={String(lbl)} className={cardCls}>
                  <p className="text-[11px] text-[var(--text-tertiary)] mb-1">{lbl}</p>
                  <p className="text-[22px] font-mono font-medium"
                    style={{ color: fl ? fl.color : undefined }}>
                    {v}<span className="text-[13px] text-[var(--text-tertiary)] ml-1">{unit}</span>
                  </p>
                  {fl && <p className="text-[11px] mt-0.5" style={{ color: fl.color }}>{fl.label}</p>}
                </div>
              );
            })}
          </div>

          {/* Word count comparison */}
          <div className={cardCls + ' flex justify-around text-center'}>
            {[
              ['Original words',  result.wordsBefore],
              ['Rewritten words', result.wordsAfter],
              ['Chunks processed', result.chunkCount || 1],
            ].map(([lbl, val]) => (
              <div key={String(lbl)}>
                <p className="text-[20px] font-mono font-medium text-[var(--text-primary)]">{val}</p>
                <p className="text-[11px] text-[var(--text-tertiary)]">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 flex-wrap">
            {(['result','diff','history'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={tabCls(tab === t)}>
                {t === 'result'  ? 'Humanized text'
                 : t === 'diff'  ? 'Diff view'
                 : `History (${history.length})`}
              </button>
            ))}
          </div>

          {/* ── Humanized text tab ── */}
          {tab === 'result' && (
            <div className={cardCls + ' flex flex-col gap-3'}>
              <div className="flex items-center justify-between">
                <Label>Humanized text</Label>
                <div className="flex gap-2">
                  <CopyBtn text={result.humanized} />
                  <button onClick={download}
                    className="h-7 px-2 rounded-lg text-[11px] border border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent-line)] transition-colors">
                    <Icon name="Download" size={12} /> .txt
                  </button>
                </div>
              </div>
              <div className="rounded-xl bg-[var(--surface-tertiary)] p-4 text-[13.5px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                {result.humanized}
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                {wordCount(result.humanized)} words
              </p>

              {/* Changes list */}
              {result.changes?.length > 0 && (
                <div className="border-t border-[var(--border-strong)] pt-3">
                  <Label>Changes made</Label>
                  <ul className="flex flex-col gap-1.5 mt-1">
                    {result.changes.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12.5px] text-[var(--text-secondary)]">
                        <Icon name="Check" size={12} className="mt-0.5 shrink-0 text-green-500" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ── Diff tab ── */}
          {tab === 'diff' && result.diff && (
            <div className={cardCls}>
              <div className="flex gap-4 mb-3 text-[11.5px]">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-700" />
                  <span className="text-[var(--text-secondary)]">Removed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-green-100 dark:bg-green-950 border border-green-300 dark:border-green-700" />
                  <span className="text-[var(--text-secondary)]">Added</span>
                </span>
              </div>
              <div className="text-[13px] leading-loose max-h-72 overflow-y-auto">
                {result.diff.map((token, i) => (
                  <span key={i}
                    className={
                      token.type === 'removed' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 line-through rounded px-0.5' :
                      token.type === 'added'   ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded px-0.5' :
                      'text-[var(--text-primary)]'
                    }>
                    {token.text}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── History tab ── */}
          {tab === 'history' && (
            <div className="flex flex-col gap-2">
              {history.length === 0 && (
                <p className="text-[13px] text-[var(--text-tertiary)]">No history yet.</p>
              )}
              {history.map(h => (
                <div key={h.id} className={cardCls + ' flex flex-col gap-2'}>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[var(--text-tertiary)]">{h.ts} — {h.style}</span>
                    <CopyBtn text={h.result.humanized} />
                  </div>
                  <p className="text-[12px] text-[var(--text-secondary)] line-clamp-2">{h.result.humanized}</p>
                  <div className="flex gap-3 text-[11px] text-[var(--text-tertiary)]">
                    <span>AI before: {h.result.aiScoreBefore}%</span>
                    <span>AI after: {h.result.aiScoreAfter}%</span>
                    <span>Flesch: {h.result.humanizedReadability}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HumanizerTool;
