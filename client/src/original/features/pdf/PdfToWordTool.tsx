import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── PDF: To Word ─────────────────────────────────────────────────────────────


function PdfToWordTool() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await apiUpload('/pdf/to-word', fd);
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
        <div className="mt-4">
          <Btn loading={loading} onClick={run}><Icon name="FileText" size={15} /> Convert to Word</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Conversion complete</p>
              {result.pages && <p className="text-[12.5px] text-[var(--text-tertiary)] mt-0.5">{result.pages} pages converted</p>}
            </div>
            <Btn variant="secondary" onClick={() => dlBlob(result.blob, 'converted.docx')}>
              <Icon name="Download" size={14} /> Download .docx
            </Btn>
          </div>
        </ResultPanel>
      )}
    </div>
  );
}

export default PdfToWordTool;
