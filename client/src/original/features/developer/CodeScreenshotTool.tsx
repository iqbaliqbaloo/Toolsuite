import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Developer: Code Screenshot (client-side) ────────────────────────────────


function CodeScreenshotTool() {
  const [code, setCode] = useState('function hello(name) {\n  console.log(`Hello, ${name}!`);\n}\nhello("World");');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('javascript');

  const themes = {
    dark:    { bg: '#1e1e2e', header: '#181825', text: '#cdd6f4', accent: '#89b4fa', keyword: '#cba6f7', string: '#a6e3a1', number: '#fab387', comment: '#585b70' },
    light:   { bg: '#fafafa', header: '#f5f5f5', text: '#383a42', accent: '#4078f2', keyword: '#a626a4', string: '#50a14f', number: '#d19a66', comment: '#9ca3af' },
    dracula: { bg: '#282a36', header: '#21222c', text: '#f8f8f2', accent: '#8be9fd', keyword: '#ff79c6', string: '#f1fa8c', number: '#bd93f9', comment: '#6272a4' },
  };
  const t = themes[theme] || themes.dark;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <SelectField label="Theme" value={theme} onChange={setTheme}>
          <option value="dark">Catppuccin Dark</option>
          <option value="light">Atom Light</option>
          <option value="dracula">Dracula</option>
        </SelectField>
        <SelectField label="Language" value={lang} onChange={setLang}>
          {['javascript', 'typescript', 'python', 'rust', 'go', 'java', 'css', 'html', 'sql', 'bash'].map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </SelectField>
      </div>
      <TextareaInput label="Code" value={code} onChange={setCode} rows={8} placeholder="Paste your code here…" />
      <div className="mt-5 rounded-2xl overflow-hidden shadow-[var(--shadow-lg)]" style={{ background: t.header }}>
        <div className="flex items-center gap-1.5 px-4 py-3">
          {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => (
            <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-3 text-[11.5px] font-mono" style={{ color: t.text + '80' }}>{lang}</span>
        </div>
        <pre className="px-6 pb-6 overflow-auto text-[13.5px] font-mono leading-[1.7] m-0" style={{ background: t.bg, color: t.text }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

export default CodeScreenshotTool;
