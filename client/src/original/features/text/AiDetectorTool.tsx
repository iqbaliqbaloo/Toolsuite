import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Text: AI Detector ────────────────────────────────────────────────────────


function AiDetectorTool() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await apiPost('/text/ai-detect', { text });
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const verdictColor = (v) => {
    if (!v) return 'var(--text-tertiary)';
    if (v.includes('AI')) return 'var(--danger)';
    if (v.includes('human')) return 'var(--success)';
    return 'var(--warning)';
  };

  return (
    <div>
      <TextareaInput label="Text to analyse" value={text} onChange={setText}
        placeholder="Paste text to detect whether it was written by AI or a human…" rows={8} />
      {text.trim().length >= 10 && (
        <div className="mt-4">
          <Btn loading={loading} onClick={run}><Icon name="Bot" size={15} /> Detect AI Content</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <div className="mt-5 flex flex-col gap-4">
          <ResultPanel>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">{result.verdict}</p>
                <p className="text-[12.5px] text-[var(--text-tertiary)]">
                  Confidence: <strong className="text-[var(--text-secondary)]">{result.confidence}</strong>
                  {result.modelGuess && ` • Possible model: ${result.modelGuess}`}
                </p>
                <p className="text-[12px] text-[var(--text-tertiary)] mt-1">
                  Perplexity: {result.perplexity} • Burstiness: {result.burstiness}
                </p>
              </div>
              <div className="text-center">
                <span className="text-[36px] font-bold leading-none" style={{ color: verdictColor(result.verdict) }}>
                  {result.aiProbability}%
                </span>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">AI probability</p>
              </div>
            </div>
          </ResultPanel>
          {result.signals?.length > 0 && (
            <ResultPanel>
              <Label>AI signals detected</Label>
              <div className="flex flex-col gap-2 mt-2">
                {result.signals.map((s, i) => (
                  <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface-tertiary)] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">{s.weight} signal</span>
                    </div>
                    <p className="text-[12.5px] font-medium text-[var(--text-primary)] mb-0.5">"{s.text}"</p>
                    <p className="text-[12px] text-[var(--text-tertiary)]">{s.signal}</p>
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

export default AiDetectorTool;
