import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Developer: JSON Formatter (client-side) ──────────────────────────────────


function JsonFormatterTool() {
  const [raw, setRaw] = useState('');
  const [indent, setIndent] = useState('2');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const format = () => {
    setError(null);
    try {
      const parsed = JSON.parse(raw);
      setResult(JSON.stringify(parsed, null, parseInt(indent)));
    } catch (e) { setError(e.message); setResult(null); }
  };

  const minify = () => {
    setError(null);
    try {
      setResult(JSON.stringify(JSON.parse(raw)));
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <TextareaInput label="JSON input" value={raw}
        onChange={v => { setRaw(v); setResult(null); setError(null); }}
        placeholder='{"name": "example", "value": 42}' rows={10} />
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <SelectField label="Indent" value={indent} onChange={setIndent}>
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="1">1 space (compact)</option>
        </SelectField>
        <Btn onClick={format} disabled={!raw.trim()}>Format</Btn>
        <Btn onClick={minify} variant="secondary" disabled={!raw.trim()}>Minify</Btn>
      </div>
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between mb-3">
            <Label>Formatted JSON</Label>
            <CopyBtn text={result} />
          </div>
          <pre className="text-[12.5px] text-[var(--text-secondary)] font-mono leading-relaxed bg-[var(--surface-tertiary)] rounded-xl p-4 overflow-auto max-h-80 whitespace-pre">
            {result}
          </pre>
        </ResultPanel>
      )}
    </div>
  );
}

export default JsonFormatterTool;
