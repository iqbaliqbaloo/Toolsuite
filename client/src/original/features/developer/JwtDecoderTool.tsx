// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Developer: JWT Decoder (client-side) ────────────────────────────────────


function JwtDecoderTool() {
  const [token, setToken] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) throw new Error('JWT must have 3 parts (header.payload.signature)');
      const decode = (s) => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')));
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      const now = Math.floor(Date.now() / 1000);
      const expired = payload.exp && payload.exp < now;
      const expiresIn = payload.exp ? payload.exp - now : null;
      return { header, payload, expired, expiresIn, error: null };
    } catch (e) { return { error: e.message }; }
  }, [token]);

  const fmtExpiry = (secs) => {
    if (secs === null) return null;
    if (secs < 0) return `Expired ${Math.abs(secs)}s ago`;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `Expires in ${h ? h + 'h ' : ''}${m ? m + 'm ' : ''}${s}s`;
  };

  return (
    <div>
      <TextareaInput label="JWT token" value={token} onChange={setToken}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" rows={4} />
      {decoded?.error && <ErrAlert>{decoded.error}</ErrAlert>}
      {decoded && !decoded.error && (
        <div className="mt-5 flex flex-col gap-3">
          <ResultPanel>
            <div className="flex items-center justify-between mb-3">
              <Label>Header</Label>
              <div className="flex gap-2">
                {decoded.header.alg && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-bold">
                    {decoded.header.alg}
                  </span>
                )}
                <CopyBtn text={JSON.stringify(decoded.header, null, 2)} />
              </div>
            </div>
            <pre className="text-[12.5px] font-mono text-[var(--text-secondary)] bg-[var(--surface-tertiary)] rounded-xl p-4">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </ResultPanel>
          <ResultPanel>
            <div className="flex items-center justify-between mb-3">
              <Label>Payload</Label>
              <div className="flex items-center gap-2">
                {decoded.expired !== undefined && (
                  <span className={`text-[11px] font-bold ${decoded.expired ? 'text-red-400' : 'text-green-400'}`}>
                    {decoded.expired ? '✗ EXPIRED' : '✓ VALID'}
                  </span>
                )}
                <CopyBtn text={JSON.stringify(decoded.payload, null, 2)} />
              </div>
            </div>
            {decoded.expiresIn !== null && (
              <p className={`text-[12px] mb-2 ${decoded.expired ? 'text-red-400' : 'text-[var(--success)]'}`}>
                {fmtExpiry(decoded.expiresIn)}
              </p>
            )}
            <pre className="text-[12.5px] font-mono text-[var(--text-secondary)] bg-[var(--surface-tertiary)] rounded-xl p-4 max-h-48 overflow-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </ResultPanel>
        </div>
      )}
    </div>
  );
}

export default JwtDecoderTool;
