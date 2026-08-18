import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── PDF: Compress ────────────────────────────────────────────────────────────


function PdfCompressTool() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('quality', quality);
      const r = await apiUpload('/pdf/compress', fd);
      const blob = await r.blob();
      setResult({
        blob,
        orig: r.headers.get('X-Original-Size'),
        comp: r.headers.get('X-Compressed-Size'),
        ratio: r.headers.get('X-Compression-Ratio'),
      });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <FileDropzone onFile={setFile} accept=".pdf" files={file} />
      {file && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <SelectField label="Quality preset" value={quality} onChange={setQuality}>
            <option value="screen">Screen — smallest file</option>
            <option value="ebook">eBook</option>
            <option value="medium">Medium (recommended)</option>
            <option value="printer">Printer quality</option>
            <option value="prepress">Prepress — best quality</option>
          </SelectField>
          <Btn loading={loading} onClick={run}><Icon name="FileDown" size={15} /> Compress PDF</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Compression complete</p>
              {result.orig && result.comp ? (
                <p className="text-[12.5px] text-[var(--text-tertiary)] mt-0.5">
                  {fmtBytes(result.orig)} → {fmtBytes(result.comp)}
                  {result.ratio ? ` (${result.ratio}% smaller)` : ''}
                </p>
              ) : (
                <p className="text-[12.5px] text-[var(--text-tertiary)] mt-0.5">PDF optimised successfully</p>
              )}
            </div>
            <Btn variant="secondary" onClick={() => dlBlob(result.blob, 'compressed.pdf')}>
              <Icon name="Download" size={14} /> Download
            </Btn>
          </div>
        </ResultPanel>
      )}
    </div>
  );
}

export default PdfCompressTool;
