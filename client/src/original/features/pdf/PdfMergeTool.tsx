// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── PDF: Merge ───────────────────────────────────────────────────────────────


function PdfMergeTool() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    if (files.length < 2) { setError('Please select at least 2 PDF files to merge.'); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const r = await apiUpload('/pdf/merge', fd);
      const blob = await r.blob();
      setResult({ blob });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <FileDropzone onFile={setFiles} accept=".pdf" multiple files={files} />
      {files.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <span className="text-[13px] text-[var(--text-tertiary)]">{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
          <Btn loading={loading} onClick={run}><Icon name="Layers" size={15} /> Merge PDFs</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">
              {files.length} PDFs merged successfully
            </p>
            <Btn variant="secondary" onClick={() => dlBlob(result.blob, 'merged.pdf')}>
              <Icon name="Download" size={14} /> Download merged.pdf
            </Btn>
          </div>
        </ResultPanel>
      )}
    </div>
  );
}

export default PdfMergeTool;
