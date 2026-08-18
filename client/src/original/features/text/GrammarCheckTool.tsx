import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Text: Grammar Check ──────────────────────────────────────────────────────


function GrammarCheckTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await apiPost('/text/grammar', { text, mode });
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const typeColors = {
    grammar: 'text-red-400',
    spelling: 'text-orange-400',
    punctuation: 'text-yellow-400',
    style: 'text-blue-400',
    clarity: 'text-purple-400',
  };

  return (
    <div>
      <TextareaInput label="Paste your text" value={text} onChange={setText}
        placeholder="Paste the text you want to check for grammar and style issues…" rows={8} />
      {text.trim().length >= 10 && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <SelectField label="Writing mode" value={mode} onChange={setMode}>
            <option value="standard">Standard / Professional</option>
            <option value="academic">Academic</option>
            <option value="casual">Casual</option>
          </SelectField>
          <Btn loading={loading} onClick={run}><Icon name="SpellCheck" size={15} /> Check Grammar</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <div className="mt-5 flex flex-col gap-4">
          <ResultPanel>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">Writing score</p>
                <p className="text-[12.5px] text-[var(--text-tertiary)]">{result.summary}</p>
                {result.tone && (
                  <p className="text-[12px] text-[var(--text-tertiary)] mt-1">
                    Detected tone: <strong className="text-[var(--text-secondary)]">{result.tone}</strong>
                  </p>
                )}
              </div>
              <ScoreBadge score={result.score} />
            </div>
            {result.corrected && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label>Corrected text</Label>
                  <CopyBtn text={result.corrected} />
                </div>
                <div className="bg-[var(--surface-tertiary)] rounded-xl p-4 text-[13.5px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {result.corrected}
                </div>
              </div>
            )}
          </ResultPanel>
          {result.issues?.length > 0 && (
            <div>
              <Label>{result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} found</Label>
              <div className="flex flex-col gap-2">
                {result.issues.map((issue, i) => (
                  <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${typeColors[issue.type] || 'text-[var(--text-tertiary)]'}`}>
                        {issue.type}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--text-primary)]">
                      <span className="line-through text-red-400/80">{issue.original}</span>
                      {' → '}
                      <span className="text-[var(--success)] font-medium">{issue.suggestion}</span>
                    </p>
                    {issue.explanation && (
                      <p className="text-[12px] text-[var(--text-tertiary)] mt-1">{issue.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GrammarCheckTool;
