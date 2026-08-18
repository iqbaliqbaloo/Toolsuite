import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Text: Plagiarism Check ───────────────────────────────────────────────────


function PlagiarismTool() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await apiPost('/text/plagiarism', { text });
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <TextareaInput label="Text to check" value={text} onChange={setText}
        placeholder="Paste text to check for plagiarism…" rows={8} />
      {text.trim().length >= 10 && (
        <div className="mt-4">
          <Btn loading={loading} onClick={run}><Icon name="ShieldCheck" size={15} /> Check Plagiarism</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <div className="mt-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <ResultPanel>
              <Label>Originality</Label>
              <ScoreBadge score={result.originalityScore} />
            </ResultPanel>
            <ResultPanel>
              <Label>Similarity</Label>
              <ScoreBadge score={result.similarityScore} />
            </ResultPanel>
          </div>
          {result.message && <InfoAlert>{result.message}</InfoAlert>}
          {result.sources?.length > 0 && (
            <ResultPanel>
              <Label>Matched sources</Label>
              <div className="flex flex-col gap-2 mt-2">
                {result.sources.map((s, i) => (
                  <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface-tertiary)] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[13px] font-semibold text-[var(--text-primary)]">{s.title}</p>
                      <span className="text-[12px] font-bold text-orange-400">{s.similarity}% match</span>
                    </div>
                    <p className="text-[11.5px] text-[var(--text-tertiary)] italic">"{s.matchedText}"</p>
                  </div>
                ))}
              </div>
            </ResultPanel>
          )}
        </div>
      )}
    </div>
  );
}

export default PlagiarismTool;
