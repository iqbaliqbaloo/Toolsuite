// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Text: Word Counter (client-side) ─────────────────────────────────────────


function WordCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text) return null;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const readTime = Math.max(1, Math.round(words.length / 200));
    return { words: words.length, sentences: sentences.length, paragraphs: paragraphs.length, chars, charsNoSpaces, readTime };
  }, [text]);

  const items = stats ? [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'No spaces', value: stats.charsNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Read time', value: `~${stats.readTime} min` },
  ] : [];

  return (
    <div>
      <TextareaInput label="Paste or type your text" value={text} onChange={setText}
        placeholder="Start typing or paste text here…" rows={10} />
      {stats && (
        <ResultPanel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11.5px] font-medium text-[var(--text-tertiary)] mb-1">{label}</p>
                <p className="text-[28px] font-bold text-[var(--text-primary)] leading-none tabular-nums">{value}</p>
              </div>
            ))}
          </div>
        </ResultPanel>
      )}
    </div>
  );
}

export default WordCounterTool;
