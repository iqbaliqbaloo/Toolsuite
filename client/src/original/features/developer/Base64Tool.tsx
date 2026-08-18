import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Developer: Base64 (client-side) ─────────────────────────────────────────


function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  const run = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (e) {
      setOutput('Error: ' + e.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        {['encode', 'decode'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`h-8 px-4 rounded-lg text-[13px] font-semibold transition-colors
              ${mode === m
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-line)]'
                : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'}`}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <TextareaInput
        label={mode === 'encode' ? 'Text to encode' : 'Base64 to decode'}
        value={input} onChange={setInput}
        placeholder={mode === 'encode' ? 'Enter text…' : 'Enter base64 string…'}
        rows={5} />
      <Btn onClick={run} disabled={!input.trim()}>{mode === 'encode' ? 'Encode' : 'Decode'} →</Btn>
      {output && (
        <ResultPanel>
          <div className="flex items-center justify-between mb-3">
            <Label>Result</Label>
            <CopyBtn text={output} />
          </div>
          <pre className="text-[12.5px] text-[var(--text-secondary)] font-mono leading-relaxed bg-[var(--surface-tertiary)] rounded-xl p-4 whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
            {output}
          </pre>
        </ResultPanel>
      )}
    </div>
  );
}

export default Base64Tool;
