import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Developer: SQL Formatter (client-side) ───────────────────────────────────


function SqlFormatterTool() {
  const [sql, setSql] = useState('');
  const [result, setResult] = useState('');

  const format = () => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
      'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE',
      'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'LIMIT', 'OFFSET',
      'UNION', 'UNION ALL'];
    let out = sql.trim();
    keywords.forEach(k => {
      const re = new RegExp(`\\b${k}\\b`, 'gi');
      out = out.replace(re, '\n' + k);
    });
    out = out.replace(/,\s*/g, ',\n  ').trim();
    out = out.replace(/\n{3,}/g, '\n\n');
    setResult(out);
  };

  return (
    <div>
      <TextareaInput label="SQL query" value={sql} onChange={setSql}
        placeholder="SELECT * FROM users WHERE id = 1 AND active = true ORDER BY created_at DESC LIMIT 10"
        rows={8} />
      <div className="mt-4">
        <Btn onClick={format} disabled={!sql.trim()}>Format SQL</Btn>
      </div>
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between mb-3">
            <Label>Formatted</Label>
            <CopyBtn text={result} />
          </div>
          <pre className="text-[12.5px] font-mono text-[var(--text-secondary)] bg-[var(--surface-tertiary)] rounded-xl p-4 max-h-64 overflow-auto whitespace-pre">
            {result}
          </pre>
        </ResultPanel>
      )}
    </div>
  );
}

export default SqlFormatterTool;
