import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── PDF: To JPG ──────────────────────────────────────────────────────────────


function PdfToJpgTool() {
  const [file, setFile] = useState(null);
  const [dpi, setDpi] = useState('150');
  const [format, setFormat] = useState('jpg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('dpi', dpi);
      fd.append('format', format);
      const r = await apiUpload('/pdf/to-jpg', fd);
      const blob = await r.blob();
      const pages = r.headers.get('X-Page-Count');
      setResult({ blob, pages });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <FileDropzone onFile={setFile} accept=".pdf" files={file} />
      {file && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <SelectField label="Output format" value={format} onChange={setFormat}>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </SelectField>
          <SelectField label="Resolution (DPI)" value={dpi} onChange={setDpi}>
            <option value="72">72 dpi — web</option>
            <option value="150">150 dpi — standard</option>
            <option value="300">300 dpi — print</option>
          </SelectField>
          <Btn loading={loading} onClick={run}><Icon name="Image" size={15} /> Convert to {format.toUpperCase()}</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Conversion complete</p>
              {result.pages && <p className="text-[12.5px] text-[var(--text-tertiary)] mt-0.5">{result.pages} pages → ZIP archive</p>}
            </div>
            <Btn variant="secondary" onClick={() => dlBlob(result.blob, 'pdf-pages.zip')}>
              <Icon name="Download" size={14} /> Download ZIP
            </Btn>
          </div>
        </ResultPanel>
      )}
    </div>
  );
}

export default PdfToJpgTool;
