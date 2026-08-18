import React, { useState, useRef } from 'react';
import { Icon } from './Icons';
import { fmtBytes } from '../../utils/helpers';

/* ── Primary action button — gradient with glow ── */
export function Btn({
  onClick, disabled, loading, children, variant = 'primary', className = '',
}: {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
}) {
  if (variant === 'primary') {
    return (
      <button
        className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl text-[13.5px] font-semibold text-white btn-glow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-all ${className}`}
        style={{ background: 'var(--gradient-accent)' }}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading && (
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        )}
        {children}
      </button>
    );
  }

  if (variant === 'danger') {
    return (
      <button
        className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl text-[13.5px] font-semibold text-white btn-glow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-all ${className}`}
        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading && (
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        )}
        {children}
      </button>
    );
  }

  const v: Record<string, string> = {
    secondary: 'border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)]',
    ghost:     'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl text-[13.5px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${v[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}

/* ── Error alert ── */
export function ErrAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px] animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.06))',
        border: '1px solid rgba(239,68,68,0.30)',
        color: 'var(--cat-pdf-ink)',
      }}>
      <Icon name="AlertCircle" size={16} className="mt-0.5 shrink-0" />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

/* ── Info alert ── */
export function InfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px] animate-fade-in"
      style={{
        background: 'var(--accent-tint)',
        border: '1px solid var(--accent-line)',
        color: 'var(--text-secondary)',
      }}>
      <Icon name="AlertCircle" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' } as any} />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

/* ── Result panel — glassmorphism card ── */
export function ResultPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-5 rounded-2xl p-5 animate-fade-in-up"
      style={{
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border-strong)',
        boxShadow: '0 0 0 1px var(--accent-line), var(--shadow-md)',
      }}
    >
      {children}
    </div>
  );
}

/* ── Field label ── */
export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`block text-[11.5px] font-bold uppercase tracking-wider mb-1.5 ${className}`}
      style={{ color: 'var(--accent)' }}>
      {children}
    </span>
  );
}

/* ── Select field ── */
export function SelectField({
  label, value, onChange, children, className = '',
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-10 px-3 rounded-xl text-[13.5px] text-[var(--text-primary)] outline-none cursor-pointer min-w-[180px] transition-all"
        style={{
          background: 'var(--surface-secondary)',
          border: '1px solid var(--border-strong)',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-tint)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {children}
      </select>
    </div>
  );
}

/* ── Number input ── */
export function NumberInput({
  label, value, onChange, min, max, placeholder, className = '',
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min}
        max={max}
        placeholder={placeholder}
        className="h-10 px-3 rounded-xl text-[13.5px] text-[var(--text-primary)] outline-none w-[120px] transition-all"
        style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-strong)' }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-tint)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

/* ── Copy button ── */
export function CopyBtn({ text, value, label, className = '' }: {
  text?: string; value?: string; label?: string; className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyText = text || value || '';

  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(copyText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
      }
      className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold transition-all ${className}`}
      style={copied
        ? { background: 'var(--gradient-green)', color: '#fff', border: '1px solid transparent' }
        : { background: 'var(--surface-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' }
      }
    >
      <Icon name={copied ? 'Check' : 'Copy'} size={12} />
      {copied ? 'Copied!' : (label || 'Copy')}
    </button>
  );
}

/* ── File dropzone ── */
export function FileDropzone({
  onFile, accept, multiple = false, files: externalFiles,
}: {
  onFile: (f: File | File[]) => void;
  accept?: string;
  multiple?: boolean;
  files?: File | File[] | null;
}) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (list: FileList) => {
    const arr = Array.from(list);
    if (!arr.length) return;
    setFiles(arr);
    onFile(multiple ? arr : arr[0]);
  };

  const display =
    externalFiles != null
      ? Array.isArray(externalFiles) ? externalFiles : [externalFiles]
      : files;

  return (
    <div
      className="rounded-2xl cursor-pointer transition-all duration-200 min-h-[190px] flex flex-col items-center justify-center gap-3 px-6 py-8 text-center"
      style={dragging ? {
        border: '2px dashed var(--accent)',
        background: 'var(--accent-tint)',
        boxShadow: '0 0 0 4px var(--accent-soft), inset 0 0 40px var(--accent-tint)',
      } : display.length > 0 ? {
        border: '2px dashed var(--border-strong)',
        background: 'var(--surface-secondary)',
      } : {
        border: '2px dashed var(--border-strong)',
        background: 'var(--surface-secondary)',
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={e => e.target.files && handle(e.target.files)}
      />

      {display.length === 0 ? (
        <>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float"
            style={{ background: dragging ? 'var(--gradient-accent)' : 'var(--surface-tertiary)' }}
          >
            <Icon
              name="Upload"
              size={22}
              style={{ color: dragging ? '#fff' : 'var(--accent)' } as any}
            />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">
              {dragging ? 'Drop it!' : <>Drop {multiple ? 'files' : 'a file'} here, or <span className="gradient-text font-bold">browse</span></>}
            </p>
            <p className="text-[12.5px] text-[var(--text-tertiary)] mt-1">
              Accepts {accept || 'any file'}{multiple ? ' — up to 50 files' : ''}
            </p>
          </div>
        </>
      ) : (
        <>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pop"
            style={{ background: 'var(--gradient-green)' }}
          >
            <Icon name="Check" size={20} className="text-white" />
          </div>
          <div className="flex flex-col gap-1 max-h-28 overflow-y-auto w-full">
            {display.map((f, i) => (
              <p key={i} className="text-[12.5px] text-[var(--text-secondary)] truncate">
                <span className="font-semibold text-[var(--text-primary)]">{f.name}</span>
                {' '}({fmtBytes(f.size)})
              </p>
            ))}
          </div>
          <p className="text-[11.5px] text-[var(--text-tertiary)]">Click or drop to change</p>
        </>
      )}
    </div>
  );
}

/* ── Textarea input ── */
export function TextareaInput({
  label, value, onChange, placeholder, rows = 8,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl text-[13.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none resize-y transition-all font-mono leading-relaxed"
        style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-strong)' }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-line)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-tint)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

/* ── Score badge (circular) ── */
export function ScoreBadge({ score, max = 100 }: { score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  const gradient =
    pct >= 80 ? 'linear-gradient(135deg, #10b981, #00d4ff)' :
    pct >= 50 ? 'linear-gradient(135deg, #f59e0b, #f97316)' :
                'linear-gradient(135deg, #ef4444, #ec4899)';

  return (
    <div className="relative w-16 h-16 animate-pop">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-strong)" strokeWidth="6" />
        <circle
          cx="32" cy="32" r="26" fill="none"
          stroke="url(#score-grad)" strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 163.4} 163.4`}
        />
        <defs>
          <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'} />
            <stop offset="100%" stopColor={pct >= 80 ? '#00d4ff' : pct >= 50 ? '#f97316' : '#ec4899'} />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[18px] font-bold"
        style={{
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {score}
      </span>
    </div>
  );
}
