import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── PDF: Word to PDF ─────────────────────────────────────────────────────────


function WordToPdfTool() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await apiUpload('/pdf/from-word', fd);
      const blob = await r.blob();
      setResult({ blob });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <FileDropzone onFile={setFile} accept=".doc,.docx" files={file} />
      {file && (
        <div className="mt-4">
          <Btn loading={loading} onClick={run}><Icon name="FilePlus" size={15} /> Convert to PDF</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">Converted to PDF</p>
            <Btn variant="secondary" onClick={() => dlBlob(result.blob, 'converted.pdf')}>
              <Icon name="Download" size={14} /> Download PDF
            </Btn>
          </div>
        </ResultPanel>
      )}
    </div>
  );
}

export default WordToPdfTool;
