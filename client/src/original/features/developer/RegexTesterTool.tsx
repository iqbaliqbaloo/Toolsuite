// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Developer: Regex Tester (client-side) ────────────────────────────────────


function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testStr, setTestStr] = useState('');

  const result = useMemo(() => {
    if (!pattern || !testStr) return null;
    try {
      const re = new RegExp(pattern, flags);
      const matches = [];
      let m;
      if (flags.includes('g')) {
        re.lastIndex = 0;
        while ((m = re.exec(testStr)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m[0].length === 0) re.lastIndex++;
        }
      } else {
        m = re.exec(testStr);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      return { matches, error: null };
    } catch (e) { return { matches: [], error: e.message }; }
  }, [pattern, flags, testStr]);

  const highlighted = useMemo(() => {
    if (!result?.matches?.length || !testStr) return testStr;
    let out = '';
    let last = 0;
    for (const { match, index } of result.matches) {
      out += testStr.slice(last, index);
      out += `<mark class="bg-yellow-400/30 rounded px-0.5">${match}</mark>`;
      last = index + match.length;
    }
    out += testStr.slice(last);
    return out;
  }, [result, testStr]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label>Regex pattern</Label>
          <div className="flex items-center h-10 px-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] focus-within:border-[var(--accent-line)] transition-colors">
            <span className="text-[var(--text-tertiary)] mr-1 font-mono">/</span>
            <input value={pattern} onChange={e => setPattern(e.target.value)}
              placeholder="[a-z]+" className="flex-1 bg-transparent text-[13.5px] text-[var(--text-primary)] font-mono outline-none" />
            <span className="text-[var(--text-tertiary)] mx-1 font-mono">/</span>
            <input value={flags} onChange={e => setFlags(e.target.value)}
              className="w-16 bg-transparent text-[13.5px] text-[var(--text-primary)] font-mono outline-none" />
          </div>
        </div>
      </div>
      <TextareaInput label="Test string" value={testStr} onChange={setTestStr}
        placeholder="Paste text to test the pattern against…" rows={5} />
      {result?.error && <ErrAlert>{result.error}</ErrAlert>}
      {result && !result.error && testStr && (
        <ResultPanel>
          <p className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">
            {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
          </p>
          <div className="bg-[var(--surface-tertiary)] rounded-xl p-4 text-[13px] font-mono leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlighted }} />
          {result.matches.length > 0 && (
            <div className="mt-3">
              <Label>Matches</Label>
              <div className="flex flex-col gap-1 mt-1">
                {result.matches.map((m, i) => (
                  <div key={i} className="text-[12.5px] text-[var(--text-secondary)]">
                    [{i}] <code className="font-mono text-[var(--accent)]">"{m.match}"</code>
                    <span className="text-[var(--text-tertiary)]"> at index {m.index}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ResultPanel>
      )}
    </div>
  );
}

export default RegexTesterTool;
