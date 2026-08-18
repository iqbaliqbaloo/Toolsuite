// @ts-nocheck
import React, { useState, useRef, useCallback, useMemo, useId } from 'react';
import { Icon } from '../../components/ui/Icons';
import { cvId, EMPTY_DATA, EMPLOYMENT_TYPES, PROFICIENCY_LEVELS, safeArr, safeStr, hasRealWords, calcAtsScore, calcCompletenessScore, calcGrammarScore, isSkillLike, isRealName, isValidEmail, isRealPhone, isRealLink } from './cv-core';
const scoreColor = (s) => s >= 80 ? '#16a34a' : s >= 60 ? '#d97706' : '#dc2626';

// ─── Shared form field styles ─────────────────────────────────────────────────
const CV_INPUT_STYLE  = { color: '#111827', backgroundColor: '#ffffff', caretColor: '#111827', WebkitTextFillColor: '#111827' };
const CV_SELECT_STYLE = { color: '#111827', backgroundColor: '#ffffff', WebkitTextFillColor: '#111827' };
const CV_CHECK_STYLE  = { accentColor: '#2563eb', width: '14px', height: '14px' };

function CvLabel({ children, required, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{ display: 'block', fontSize: '10.5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '4px' }}>
      {children}{required && <span style={{ color: '#f87171', marginLeft: '2px' }}>*</span>}
    </label>
  );
}
function CvInput({ label, required, value, onChange, placeholder, type = 'text', className = '' }) {
  const id = useId();
  return (
    <div className={className}>
      {label && <CvLabel htmlFor={id} required={required}>{label}</CvLabel>}
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={CV_INPUT_STYLE}
        className="cv-field w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors" />
    </div>
  );
}
function CvTextarea({ label, value, onChange, placeholder, rows = 4, maxLength, className = '' }) {
  const id = useId();
  return (
    <div className={className}>
      {label && <CvLabel htmlFor={id}>{label}</CvLabel>}
      <textarea id={id} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows} maxLength={maxLength} style={CV_INPUT_STYLE}
        className="cv-field w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors resize-none" />
      {maxLength && <p style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'right', marginTop: '2px' }}>{value.length}/{maxLength}</p>}
    </div>
  );
}
function CvSelect({ label, value, onChange, options, className = '' }) {
  const id = useId();
  return (
    <div className={className}>
      {label && <CvLabel htmlFor={id}>{label}</CvLabel>}
      <select id={id} value={value} onChange={e => onChange(e.target.value)} style={CV_SELECT_STYLE}
        className="cv-field w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors cursor-pointer">
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function CvTagInput({ label, tags, onChange, placeholder = 'Type and press Enter' }) {
  const [input, setInput] = useState('');
  const draggingRef = useRef(null);
  const add = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const trimmed = input.trim();
const isDuplicate = tags.some(t => t.toLowerCase() === trimmed.toLowerCase());
if (!isDuplicate) onChange([...tags, trimmed]);
      setInput('');
    }
  };
  return (
    <div>
      {label && <CvLabel>{label}</CvLabel>}
      <div className="min-h-[42px] flex flex-wrap gap-1.5 p-2 rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 transition-colors">
        {tags.map((tag, i) => (
          <span key={i} draggable
            onDragStart={() => { draggingRef.current = i; }}
            onDragOver={e => { e.preventDefault(); const drag = draggingRef.current; if (drag !== null && drag !== i) { const n = [...tags]; const [x] = n.splice(drag, 1); n.splice(i, 0, x); onChange(n); draggingRef.current = i; }}}
            onDragEnd={() => { draggingRef.current = null; }}
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full border border-blue-200 cursor-grab">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter((_, j) => j !== i))}
              className="text-blue-400 hover:text-blue-700 leading-none ml-0.5">×</button>
          </span>
        ))}
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={add}
          placeholder={tags.length === 0 ? placeholder : ''}
          style={{ color: '#111827', WebkitTextFillColor: '#111827', caretColor: '#111827', backgroundColor: 'transparent' }}
          className="flex-1 min-w-[120px] text-sm outline-none" />
      </div>
    </div>
  );
}
function CvBulletEditor({ bullets, onChange, onImprove, improving }) {
  const [drag, setDrag] = useState(null);
  const [bulletDrafts, setBulletDrafts] = useState({});
  const add = () => onChange([...bullets, '']);
  const update = (i, val) => { const n = [...bullets]; n[i] = val; onChange(n); };
  const remove = (i) => onChange(bullets.filter((_, j) => j !== i));
  const enhanceBullet = (b, i) => {
    if (!b.trim() || improving) return;
    onImprove && onImprove(b, 'bullet', (enhanced) => setBulletDrafts(d => ({ ...d, [i]: enhanced })));
  };
  const applyDraft = (i) => { update(i, bulletDrafts[i]); setBulletDrafts(d => { const n = { ...d }; delete n[i]; return n; }); };
  const discardDraft = (i) => setBulletDrafts(d => { const n = { ...d }; delete n[i]; return n; });
  return (
    <div>
      <CvLabel>Bullet points</CvLabel>
      <div className="flex flex-col gap-2">
        {bullets.map((b, i) => (
  <div key={`${i}-${b.slice(0, 20)}`} className="flex flex-col gap-1">
            <div draggable
              onDragStart={() => setDrag(i)}
              onDragOver={e => { e.preventDefault(); if (drag !== null && drag !== i) { const n = [...bullets]; const [x] = n.splice(drag, 1); n.splice(i, 0, x); onChange(n); setDrag(i); }}}
              onDragEnd={() => setDrag(null)}
              className="flex items-start gap-2 group">
              <button className="mt-2.5 text-gray-300 hover:text-gray-500 cursor-grab shrink-0 text-xs select-none">≡</button>
              <span className="mt-2.5 text-gray-400 shrink-0 text-sm">•</span>
              <textarea value={b} onChange={e => update(i, e.target.value)} rows={2}
                placeholder="Describe an achievement or responsibility..." style={CV_INPUT_STYLE}
                className="cv-field flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors resize-none" />
              {onImprove && (
                <button onClick={() => enhanceBullet(b, i)}
                  disabled={!!improving || !b.trim()} title="AI Enhance bullet"
                  className="mt-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-40 text-[10px] font-semibold transition-colors shrink-0">
                  {improving === 'bullet' ? <Icon name="Loader" size={10} className="animate-spin" /> : <Icon name="Sparkles" size={10} />}
                  AI
                </button>
              )}
              <button onClick={() => remove(i)} className="mt-2 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                <Icon name="X" size={13} />
              </button>
            </div>
            {bulletDrafts[i] !== undefined && (
              <div className="ml-10 rounded-lg border border-purple-200 bg-purple-50 p-2.5">
                <p className="text-[9.5px] font-semibold text-purple-700 mb-1.5 uppercase tracking-wide">AI Enhanced Preview</p>
                <p className="text-[11.5px] text-gray-800 leading-relaxed">{bulletDrafts[i]}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => applyDraft(i)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600 text-white text-[10px] font-semibold hover:bg-purple-700 transition-colors">
                    <Icon name="Check" size={9} /> Apply
                  </button>
                  <button onClick={() => discardDraft(i)}
                    className="px-2.5 py-1 rounded bg-white text-gray-500 text-[10px] font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1.5 text-[12px] text-blue-600 hover:text-blue-800 mt-1 w-fit">
          <Icon name="Plus" size={13} /> Add bullet
        </button>
      </div>
    </div>
  );
}
function CvEntryCard({ title, subtitle, date, isExpanded, onToggle, onDelete, confirmDelete, setConfirmDelete, children }) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm overflow-hidden transition-colors ${isExpanded ? 'border-blue-200' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 select-none">
        <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={onToggle}>
          <Icon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} size={14} className="text-gray-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{title || 'Untitled entry'}</p>
            {(subtitle || date) && <p className="text-[11px] text-gray-500 truncate">{[subtitle, date].filter(Boolean).join(' · ')}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-3 shrink-0">
          <button onClick={onToggle}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${isExpanded ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
            <Icon name={isExpanded ? 'Check' : 'Pencil'} size={11} />
            {isExpanded ? 'Done' : 'Edit'}
          </button>
          {confirmDelete ? (
            <span className="flex items-center gap-1 bg-red-50 rounded-lg px-2 py-1 text-[11px]">
              <span className="text-gray-500 font-medium">Delete?</span>
              <button onClick={onDelete} className="text-red-600 font-bold hover:text-red-800 ml-1">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="text-gray-400 hover:text-gray-600 ml-0.5">No</button>
            </span>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors">
              <Icon name="Trash2" size={11} /> Delete
            </button>
          )}
        </div>
      </div>
      {isExpanded && <div className="border-t border-blue-100 px-4 pt-4 pb-5 flex flex-col gap-4">{children}</div>}
    </div>
  );
}

// ─── ATS Score sidebar widget ─────────────────────────────────────────────────
function CvAtsScore({ data }) {
  const score = useMemo(() => {
    if (typeof calcAtsScore !== 'function') return 0;
    return calcAtsScore(data);
  }, [data]);
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Strong' : score >= 50 ? 'Good' : 'Needs work';
  return (
    <div className="px-3 pb-3">
      <p className="text-[9.5px] font-semibold uppercase tracking-widest text-gray-400 mb-2">ATS Score</p>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: color }} />
        </div>
        <span className="text-[13px] font-bold tabular-nums" style={{ color }}>{score}</span>
      </div>
      <p className="text-[10px] text-gray-400">{label} — {score < 100 ? 'fill more sections to improve' : 'excellent!'}</p>
    </div>
  );
}

// ─── Section completion guide ─────────────────────────────────────────────────
// checks: [{ label, done, example?, applyLabel?, onApply? }]
function SectionGuide({ checks }) {
  const total = checks.length;
  const done  = checks.filter(c => c.done).length;
  const [open, setOpen] = useState(done < total);
  if (done === total) return null;
  const pct = Math.round((done / total) * 100);
  const barColor = pct >= 70 ? '#15803d' : pct >= 40 ? '#b45309' : '#b91c1c';
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-blue-100 transition-colors">
        <div className="flex items-center gap-2">
          <Icon name="Target" size={11} className="text-blue-500"/>
          <span className="text-[10.5px] font-bold text-blue-800">To reach 100%</span>
          <span className="text-[9.5px] text-blue-700 font-medium">{done}/{total} done</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-14 h-1.5 bg-blue-100 rounded-full overflow-hidden border border-blue-200">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }}/>
          </div>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: barColor }}>{pct}%</span>
          <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={11} className="text-blue-400"/>
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 flex flex-col gap-1.5 border-t border-blue-100 pt-2">
          {checks.map((c, i) => (
            <div key={i} className={`rounded-md px-2.5 py-1.5 border ${c.done ? 'border-green-100 bg-green-50/60' : 'border-blue-100 bg-white'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${c.done ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <Icon name={c.done ? 'Check' : 'Minus'} size={7} className={c.done ? 'text-white' : 'text-gray-400'}/>
                </div>
                <span className={`text-[10.5px] flex-1 ${c.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{c.label}</span>
                {!c.done && c.onApply && (
                  <button onClick={c.onApply}
                    className="shrink-0 text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all">
                    {c.applyLabel || 'Apply'}
                  </button>
                )}
              </div>
              {!c.done && c.example && (
                <p className="text-[10px] text-gray-600 italic mt-0.5 ml-5">e.g. {c.example}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section Forms ────────────────────────────────────────────────────────────
function CvHeaderForm({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
  if (!ev.target?.result) return;
  const img = new Image();
  img.onload = () => {
        const TARGET = 300;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = TARGET;
        const ctx = canvas.getContext('2d');
        let sw, sh, sx, sy;
        if (img.height >= img.width) {
          sw = sh = img.width; sx = 0; sy = 0;
        } else {
          sw = sh = img.height; sx = (img.width - sw) / 2; sy = 0;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET, TARGET);
        set('photo', canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col gap-4">
      <SectionGuide checks={[
        { label: 'Full name',                         done: isRealName(data.name),  example: 'Jane Smith' },
        { label: 'Valid email address',               done: isValidEmail(data.email), example: 'jane@gmail.com' },
        { label: 'Phone number (7+ digits)',          done: isRealPhone(data.phone),  example: '+1 555 000 0000' },
        { label: 'City / Country',                    done: !!(data.location?.trim()), example: 'New York, NY', applyLabel: 'Apply', onApply: () => !data.location?.trim() && onChange({ ...data, location: 'City, Country' }) },
        { label: 'Professional headline / job title', done: hasRealWords(data.title, 1), example: 'Senior Software Engineer', applyLabel: 'Apply', onApply: () => !data.title?.trim() && onChange({ ...data, title: 'Software Engineer' }) },
        { label: 'LinkedIn URL',                      done: isRealLink(data.linkedin), example: 'linkedin.com/in/yourname' },
        { label: 'GitHub or portfolio URL',           done: isRealLink(data.github) || isRealLink(data.portfolio), example: 'github.com/yourname' },
      ]}/>
      <div className="flex items-center gap-4">
        <div style={{ width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden', background: '#f3f4f6', border: data.photo ? '2px solid #d1d5db' : '2px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {data.photo
            ? <img src={data.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <Icon name="User" size={32} className="text-gray-400" />}
        </div>
        <div>
          <CvLabel>Profile Photo (optional)</CvLabel>
          <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[12px] font-medium transition-colors w-fit">
            <Icon name="Upload" size={12} /> Upload Photo
            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </label>
          {data.photo && <button onClick={() => set('photo', '')} className="mt-1 text-[11px] text-red-400 hover:text-red-600">Remove photo</button>}
        </div>
      </div>
      <CvInput label="Full name" required value={data.name} onChange={v => set('name', v)} placeholder="Jane Smith" />
      <CvInput label="Job title / headline" value={data.title} onChange={v => set('title', v)} placeholder="Senior Software Engineer" />
      <div className="grid grid-cols-3 gap-3">
        <CvInput label="Email" required value={data.email} onChange={v => set('email', v)} placeholder="jane@example.com" type="email" />
        <CvInput label="Phone" value={data.phone} onChange={v => set('phone', v)} placeholder="+1 555 000 0000" />
        <CvInput label="Location" value={data.location} onChange={v => set('location', v)} placeholder="New York, NY" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <CvInput label="LinkedIn URL" value={data.linkedin} onChange={v => set('linkedin', v)} placeholder="linkedin.com/in/jane" />
        <CvInput label="GitHub URL" value={data.github} onChange={v => set('github', v)} placeholder="github.com/jane" />
        <CvInput label="Portfolio URL" value={data.portfolio} onChange={v => set('portfolio', v)} placeholder="janesmith.dev" />
      </div>
      {(data.name || data.email || data.phone || data.location || data.linkedin || data.github || data.portfolio) && (
        <button onClick={() => onChange({ ...EMPTY_DATA.header, photo: data.photo })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 text-[11px] font-medium transition-colors w-fit">
          <Icon name="RotateCcw" size={11}/> Clear all fields
        </button>
      )}
    </div>
  );
}
function CvSummaryForm({ summary, onChange, onImprove, improving }) {
  const [aiDraft, setAiDraft] = useState(null);
  const handleEnhance = () => {
    if (!summary.trim() || improving === 'summary') return;
    onImprove && onImprove(summary, 'summary', (enhanced) => setAiDraft(enhanced));
  };
  const sumWords = summary.trim().split(/\s+/).filter(Boolean).length;
  const SUMMARY_TEMPLATE = 'Software Engineer with experience building scalable and user-focused web applications. Skilled in modern frameworks, REST APIs, and cloud infrastructure. Strong problem-solver committed to writing clean, maintainable code and continuously delivering high-quality results.';
  return (
    <div className="flex flex-col gap-2">
      <SectionGuide checks={[
        { label: 'Write your summary',               done: summary.trim().length > 10,
          example: 'Software Engineer with experience building scalable web apps...',
          applyLabel: 'Use template', onApply: () => onChange(SUMMARY_TEMPLATE) },
        { label: 'At least 30 words',                done: sumWords >= 30,
          example: 'Aim for 3–4 sentences covering role, skills, and value' },
        { label: '50+ words (ideal ATS length)',      done: sumWords >= 50,
          example: '50–80 words is the sweet spot for recruiter readability' },
        { label: 'No first-person "I" usage',         done: !/\bi\b/i.test(summary),
          example: 'Instead of "I built..." write "Built..." or "Developed..."',
          applyLabel: 'Fix "I"s', onApply: () => onChange(summary.replace(/\bI\s+([a-z])/g, (_, w) => w.toUpperCase()).replace(/\bI\b/g, '')) },
        { label: 'Mention 2–3 core technologies',     done: sumWords >= 30 && /[A-Z]/.test(summary),
          example: 'e.g. React, Node.js, PostgreSQL, AWS' },
      ]}/>
      <CvTextarea label="Professional summary" value={summary} onChange={onChange}
        placeholder="Results-driven engineer with 5+ years of experience building scalable systems..."
        rows={5} maxLength={600} />
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={handleEnhance} disabled={!summary.trim() || improving === 'summary'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-40 text-[11px] font-semibold transition-colors">
          {improving === 'summary' ? <Icon name="Loader" size={11} className="animate-spin" /> : <Icon name="Sparkles" size={11} />}
          {improving === 'summary' ? 'Enhancing...' : 'AI Enhance Summary'}
        </button>
        {summary.trim() && (
          <button onClick={() => onChange('')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 text-[11px] font-medium transition-colors">
            <Icon name="RotateCcw" size={11}/> Clear
          </button>
        )}
      </div>
      {aiDraft !== null && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-3">
          <p className="text-[10px] font-semibold text-purple-700 mb-2 uppercase tracking-wide">AI Enhanced Preview</p>
          <p className="text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap">{aiDraft}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { onChange(aiDraft); setAiDraft(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-semibold hover:bg-purple-700 transition-colors">
              <Icon name="Check" size={11} /> Apply to Resume
            </button>
            <button onClick={() => setAiDraft(null)}
              className="px-3 py-1.5 rounded-lg bg-white text-gray-500 text-[11px] font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function CvExperienceForm({ entries, onChange, expanded, onToggle, confirmDel, onConfirmDel, onImprove, improving, onAdd }) {
  const [drag, setDrag] = useState(null);
  const update = (id, field, val) => onChange(entries.map(e => e.id === id ? { ...e, [field]: val } : e));
const remove = (id) => {
  onChange(entries.filter(e => e.id !== id));
  onConfirmDel(id, undefined);
};  const reorder = (fromIdx, toIdx) => { const n=[...entries]; const [x]=n.splice(fromIdx,1); n.splice(toIdx,0,x); onChange(n); };
  const allBullets = entries.flatMap(e => safeArr(e.bullets).filter(Boolean));
  const EXAMPLE_BULLETS = [
    'Built and deployed scalable REST APIs serving 10,000+ daily active users using Node.js and Express',
    'Reduced page load time by 40% through code splitting, lazy loading, and image optimisation',
    'Led migration of legacy codebase to TypeScript, reducing runtime bugs by 30% across the platform',
  ];
  return (
    <div className="flex flex-col gap-3">
      <SectionGuide checks={[
        { label: 'Add at least 1 experience entry',        done: entries.length >= 1,
          example: 'Software Engineer at Google | Jan 2022 – Present',
          applyLabel: 'Add entry', onApply: onAdd },
        { label: '2+ entries (more = stronger resume)',    done: entries.length >= 2,
          example: 'Include internships, freelance, or part-time roles',
          applyLabel: 'Add entry', onApply: onAdd },
        { label: 'Company name on every entry',            done: entries.length > 0 && entries.every(e => e.company?.trim()),
          example: 'Google, Acme Corp, Freelance' },
        { label: 'Start date on every entry',              done: entries.length > 0 && entries.every(e => e.startDate?.trim()),
          example: 'Jan 2022  (month + year)' },
        { label: '3+ bullet points per entry',             done: entries.length > 0 && entries.every(e => safeArr(e.bullets).filter(Boolean).length >= 3),
          example: 'Built REST API serving 10K users, Reduced load time by 40%...',
          applyLabel: 'Add examples', onApply: () => onChange(entries.map(e => {
            const ex = safeArr(e.bullets).filter(Boolean);
            return ex.length >= 3 ? e : { ...e, bullets: [...ex, ...EXAMPLE_BULLETS.slice(ex.length)] };
          })) },
        { label: 'Include a number or metric in bullets',  done: allBullets.some(b => /\d/.test(b)),
          example: '"Reduced load time by 40%", "Led team of 8", "Saved 10+ hours/week"' },
        { label: 'Start bullets with strong action verbs', done: allBullets.length > 0 && !allBullets.some(b => /^(was|did|helped|worked|responsible|involved|assisted)/i.test(b.trim())),
          example: 'Built, Led, Designed, Deployed, Optimised, Automated, Delivered' },
      ]}/>
      {entries.map((entry, idx) => (
        <div key={entry.id} draggable
          onDragStart={()=>setDrag(idx)}
          onDragOver={e=>{e.preventDefault();if(drag!==null&&drag!==idx){reorder(drag,idx);setDrag(idx);}}}
          onDragEnd={()=>setDrag(null)}
          className="cursor-grab active:cursor-grabbing">
        <CvEntryCard
          title={entry.jobTitle} subtitle={entry.company}
          date={[entry.startDate, entry.current ? 'Present' : entry.endDate].filter(Boolean).join(' — ')}
          isExpanded={!!expanded[entry.id]} onToggle={() => onToggle(entry.id)}
          onDelete={() => remove(entry.id)}
          confirmDelete={!!confirmDel[entry.id]} setConfirmDelete={v => onConfirmDel(entry.id, v)}>
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Job title" value={entry.jobTitle} onChange={v => update(entry.id, 'jobTitle', v)} placeholder="Software Engineer" />
            <CvInput label="Company" value={entry.company} onChange={v => update(entry.id, 'company', v)} placeholder="Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CvSelect label="Employment type" value={entry.employmentType} onChange={v => update(entry.id, 'employmentType', v)} options={EMPLOYMENT_TYPES} />
            <CvInput label="Location" value={entry.location} onChange={v => update(entry.id, 'location', v)} placeholder="Remote" />
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <CvInput label="Start date" value={entry.startDate} onChange={v => update(entry.id, 'startDate', v)} placeholder="Jan 2022" />
            <div>
              {entry.current
                ? <div>
                    <CvLabel>End date</CvLabel>
                    <div className="cv-field w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-green-700 font-semibold">Present</div>
                  </div>
                : <CvInput label="End date" value={entry.endDate} onChange={v => update(entry.id, 'endDate', v)} placeholder="Dec 2024" />
              }
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={entry.current} onChange={e => {
  const checked = e.target.checked;
  onChange(entries.map(en => en.id === entry.id
    ? { ...en, current: checked, endDate: checked ? '' : en.endDate }
    : en
  ));
}} style={CV_CHECK_STYLE} />
                <span style={{ fontSize: '11px', color: '#111827' }}>Currently working here</span>
              </label>
            </div>
          </div>
          <CvBulletEditor bullets={entry.bullets} onChange={v => update(entry.id, 'bullets', v)} onImprove={onImprove} improving={improving} />
        </CvEntryCard>
        </div>
      ))}
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 justify-center rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <Icon name="Plus" size={15}/> Add Experience
        </button>
      )}
    </div>
  );
}
function CvEducationForm({ entries, onChange, expanded, onToggle, confirmDel, onConfirmDel, onAdd }) {
  const [drag, setDrag] = useState(null);
  const update = (id, field, val) => onChange(entries.map(e => e.id === id ? { ...e, [field]: val } : e));
  const remove = (id) => onChange(entries.filter(e => e.id !== id));
  const reorder = (fi, ti) => { const n=[...entries]; const [x]=n.splice(fi,1); n.splice(ti,0,x); onChange(n); };
  return (
    <div className="flex flex-col gap-3">
      <SectionGuide checks={[
        { label: 'Add at least 1 education entry',  done: entries.length >= 1,
          example: 'BSc Computer Science · MIT · 2018–2022',
          applyLabel: 'Add entry', onApply: onAdd },
        { label: 'Institution name',                done: entries.length > 0 && entries.every(e => e.institution?.trim()),
          example: 'MIT, Harvard University, Stanford' },
        { label: 'Degree type',                     done: entries.length > 0 && entries.every(e => e.degree?.trim()),
          example: 'Bachelor of Science, Master of Engineering, BSc' },
        { label: 'Field of study',                  done: entries.length > 0 && entries.every(e => e.field?.trim()),
          example: 'Computer Science, Software Engineering, Data Science' },
        { label: 'Graduation year',                 done: entries.length > 0 && entries.every(e => e.endYear?.trim()),
          example: '2022  (or "Expected 2025" for ongoing)' },
      ]}/>
      {entries.map((entry, idx) => (
        <div key={entry.id} draggable onDragStart={()=>setDrag(idx)} onDragOver={e=>{e.preventDefault();if(drag!==null&&drag!==idx){reorder(drag,idx);setDrag(idx);}}} onDragEnd={()=>setDrag(null)} className="cursor-grab active:cursor-grabbing">
        <CvEntryCard
          title={[entry.degree, entry.field].filter(Boolean).join(' in ')} subtitle={entry.institution}
          date={[entry.startYear, entry.expected ? `Expected ${entry.endYear}` : entry.endYear].filter(Boolean).join(' — ')}
          isExpanded={!!expanded[entry.id]} onToggle={() => onToggle(entry.id)}
          onDelete={() => remove(entry.id)}
          confirmDelete={!!confirmDel[entry.id]} setConfirmDelete={v => onConfirmDel(entry.id, v)}>
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Degree" value={entry.degree} onChange={v => update(entry.id, 'degree', v)} placeholder="Bachelor of Science" />
            <CvInput label="Field of study" value={entry.field} onChange={v => update(entry.id, 'field', v)} placeholder="Computer Science" />
          </div>
          <CvInput label="Institution" value={entry.institution} onChange={v => update(entry.id, 'institution', v)} placeholder="MIT" />
          <div className="grid grid-cols-3 gap-3 items-end">
            <CvInput label="Location" value={entry.location} onChange={v => update(entry.id, 'location', v)} placeholder="Cambridge, MA" />
            <CvInput label="Start year" value={entry.startYear} onChange={v => update(entry.id, 'startYear', v)} placeholder="2018" />
            <div>
              <CvInput label="End year" value={entry.endYear} onChange={v => update(entry.id, 'endYear', v)} placeholder="2022" />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={entry.expected} onChange={e => update(entry.id, 'expected', e.target.checked)} style={CV_CHECK_STYLE} />
                <span style={{ fontSize: '11px', color: '#111827' }}>Expected</span>
              </label>
            </div>
          </div>
          <CvInput label="GPA / Grade (optional)" value={entry.gpa} onChange={v => update(entry.id, 'gpa', v)} placeholder="3.8 / 4.0" />
          <CvTagInput label="Relevant courses" tags={entry.courses} onChange={v => update(entry.id, 'courses', v)} placeholder="Data Structures, Algorithms…" />
        </CvEntryCard>
        </div>
      ))}
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 justify-center rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <Icon name="Plus" size={15}/> Add Education
        </button>
      )}
    </div>
  );
}
function CvSkillsForm({ skills, onChange }) {
  const [drag, setDrag] = useState(null);
  const [cleaned, setCleaned] = useState(null);
  const add = () => onChange([...skills, { id: cvId(), name: '', items: [] }]);
  const upd = (id, field, val) => onChange(skills.map(s => s.id === id ? { ...s, [field]: val } : s));
  const del = (id) => onChange(skills.filter(s => s.id !== id));

  const cleanUp = () => {
    let removed = 0;
    const next = skills.map(cat => {
      const filtered = (cat.items || []).filter(item => isSkillLike(item));
      removed += (cat.items || []).length - filtered.length;
      return { ...cat, items: filtered };
    });
    onChange(next);
    setCleaned(removed);
    setTimeout(() => setCleaned(null), 3000);
  };

  const dirtyCount = skills.reduce((n, cat) =>
    n + (cat.items || []).filter(item => !isSkillLike(item)).length, 0);

  const totalSkills = skills.reduce((s, c) => s + safeArr(c.items).length, 0);
  const STARTER_KIT = [
    { id: cvId(), name: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'] },
    { id: cvId(), name: 'Backend',  items: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'MongoDB'] },
    { id: cvId(), name: 'Tools',    items: ['Git', 'Docker', 'VS Code', 'Postman', 'GitHub Actions'] },
  ];
  return (
    <div className="flex flex-col gap-3">
      <SectionGuide checks={[
        { label: 'Add at least 1 skill category',              done: skills.length >= 1,
          example: 'Frontend: React · TypeScript, Backend: Node.js · Express',
          applyLabel: 'Add starter kit', onApply: () => onChange(skills.length === 0 ? STARTER_KIT : skills) },
        { label: '3+ categories (Frontend, Backend, Tools…)',  done: skills.length >= 3,
          example: 'Frontend / Backend / Tools / Databases / DevOps',
          applyLabel: 'Add starter kit', onApply: () => onChange(skills.length < 3 ? [...skills, ...STARTER_KIT.slice(skills.length)] : skills) },
        { label: 'All categories have a name',                 done: skills.length > 0 && skills.every(c => c.name?.trim()),
          example: 'Frontend, Backend, Tools, Databases, Languages' },
        { label: 'At least 10 skills total',                   done: totalSkills >= 10,
          example: 'React, TypeScript, Node.js, PostgreSQL, Docker, Git…' },
        { label: '15+ skills (ideal for ATS keyword matching)',done: totalSkills >= 15,
          example: 'More skills = more JD keyword matches' },
        { label: 'Only real technical skills (no soft words)', done: dirtyCount === 0,
          example: 'Remove: "motivated", "team", "hardworking" — keep: "React", "AWS"',
          applyLabel: 'Clean up', onApply: cleanUp },
      ]}/>
      {skills.map((cat, i) => (
        <div key={cat.id} draggable
          onDragStart={() => setDrag(i)}
          onDragOver={e => { e.preventDefault(); if (drag !== null && drag !== i) { const n = [...skills]; const [x] = n.splice(drag, 1); n.splice(i, 0, x); onChange(n); setDrag(i); }}}
          onDragEnd={() => setDrag(null)}
          className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-400 cursor-grab text-sm select-none" title="Drag to reorder">⠿</span>
            <input value={cat.name} onChange={e => upd(cat.id, 'name', e.target.value)}
              placeholder="Category (e.g. Languages, Tools)"
              style={{ color: '#111827', WebkitTextFillColor: '#111827', caretColor: '#111827', backgroundColor: 'transparent' }}
              className="flex-1 text-sm font-semibold border-0 border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-400" />
            <button onClick={() => del(cat.id)} className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete category">
              <Icon name="Trash2" size={12} /> Delete
            </button>
          </div>
          <CvTagInput tags={cat.items} onChange={v => upd(cat.id, 'items', v)} placeholder="Type skill + Enter" />
        </div>
      ))}
      {dirtyCount > 0 && (
        <button onClick={cleanUp}
          className="flex items-center gap-2 justify-center rounded-xl border border-red-200 bg-red-50 py-2.5 text-[12px] font-semibold text-red-600 hover:bg-red-100 transition-colors">
          <Icon name="Trash2" size={13} />
          Remove {dirtyCount} non-skill word{dirtyCount !== 1 ? 's' : ''} from Skills
        </button>
      )}
      {cleaned !== null && (
        <p className="text-[11px] text-green-700 text-center font-medium">
          ✓ Removed {cleaned} non-skill word{cleaned !== 1 ? 's' : ''}
        </p>
      )}
      <button onClick={add}
        className="flex items-center gap-2 justify-center rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
        <Icon name="Plus" size={15} /> Add skill category
      </button>
    </div>
  );
}
function CvProjectsForm({ projects, onChange, expanded, onToggle, confirmDel, onConfirmDel, onImprove, improving, onAdd }) {
  const [descDrafts, setDescDrafts] = useState({});
  const [drag, setDrag] = useState(null);
  const update = (id, field, val) => onChange(projects.map(p => p.id === id ? { ...p, [field]: val } : p));
  const remove = (id) => { onChange(projects.filter(p => p.id !== id)); onConfirmDel(id, undefined); };
  const reorder = (fi, ti) => { const n=[...projects]; const [x]=n.splice(fi,1); n.splice(ti,0,x); onChange(n); };
  const enhanceDesc = (proj) => {
    if (!proj.description.trim() || improving) return;
    onImprove && onImprove(proj.description, 'description', (enhanced) =>
      setDescDrafts(d => ({ ...d, [proj.id]: enhanced }))
    );
  };
  const applyDesc = (id) => { update(id, 'description', descDrafts[id]); setDescDrafts(d => { const n={...d}; delete n[id]; return n; }); };
  const discardDesc = (id) => setDescDrafts(d => { const n={...d}; delete n[id]; return n; });
  return (
    <div className="flex flex-col gap-3">
      <SectionGuide checks={[
        { label: 'Add at least 1 project',                   done: projects.length >= 1,
          example: 'Portfolio Website · React, TypeScript, Tailwind',
          applyLabel: 'Add project', onApply: onAdd },
        { label: '2+ projects recommended',                  done: projects.length >= 2,
          example: 'Include side projects, open-source, or coursework',
          applyLabel: 'Add project', onApply: onAdd },
        { label: 'All projects have a name',                 done: projects.length > 0 && projects.every(p => p.name?.trim()),
          example: 'E-Commerce App, AI Chatbot, Portfolio Website' },
        { label: 'Tech stack listed on each project',        done: projects.length > 0 && projects.every(p => safeArr(p.techStack).length > 0),
          example: 'React, Node.js, PostgreSQL, Docker  (press Enter to add each)' },
        { label: 'Description or bullets on each project',   done: projects.length > 0 && projects.every(p => p.description?.trim() || safeArr(p.bullets).filter(Boolean).length > 0),
          example: 'Built a full-stack e-commerce platform with cart, auth, and Stripe payments' },
        { label: 'GitHub or live URL on at least 1 project', done: projects.some(p => p.githubUrl?.trim() || p.liveUrl?.trim()),
          example: 'github.com/yourname/project or myapp.vercel.app' },
      ]}/>
      {projects.map((proj, idx) => (
        <div key={proj.id} draggable onDragStart={()=>setDrag(idx)} onDragOver={e=>{e.preventDefault();if(drag!==null&&drag!==idx){reorder(drag,idx);setDrag(idx);}}} onDragEnd={()=>setDrag(null)} className="cursor-grab active:cursor-grabbing">
        <CvEntryCard
          title={proj.name} subtitle={proj.techStack.slice(0, 3).join(', ')}
          date={[proj.startDate, proj.endDate].filter(Boolean).join(' – ')}
          isExpanded={!!expanded[proj.id]} onToggle={() => onToggle(proj.id)}
          onDelete={() => remove(proj.id)}
          confirmDelete={!!confirmDel[proj.id]} setConfirmDelete={v => onConfirmDel(proj.id, v)}>
          <CvInput label="Project name" value={proj.name} onChange={v => update(proj.id, 'name', v)} placeholder="Portfolio Website" />
          <CvTagInput label="Tech stack (Enter to add)" tags={proj.techStack} onChange={v => update(proj.id, 'techStack', v)} placeholder="React, TypeScript, Tailwind..." />
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Start date" value={proj.startDate} onChange={v => update(proj.id, 'startDate', v)} placeholder="Mar 2024" />
            <CvInput label="End date" value={proj.endDate} onChange={v => update(proj.id, 'endDate', v)} placeholder="Jun 2024" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Live URL" value={proj.liveUrl} onChange={v => update(proj.id, 'liveUrl', v)} placeholder="https://myproject.com" />
            <CvInput label="GitHub URL" value={proj.githubUrl} onChange={v => update(proj.id, 'githubUrl', v)} placeholder="github.com/user/repo" />
          </div>
          <div className="flex flex-col gap-1.5">
            <CvTextarea label="Description" value={proj.description} onChange={v => update(proj.id, 'description', v)} placeholder="Brief overview of the project..." rows={3} />
            <button onClick={() => enhanceDesc(proj)} disabled={!proj.description.trim() || improving === 'description'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-40 text-[11px] font-semibold transition-colors w-fit">
              {improving === 'description' ? <Icon name="Loader" size={11} className="animate-spin" /> : <Icon name="Sparkles" size={11} />}
              {improving === 'description' ? 'Enhancing...' : 'AI Enhance Description'}
            </button>
            {descDrafts[proj.id] !== undefined && (
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-3">
                <p className="text-[10px] font-semibold text-purple-700 mb-2 uppercase tracking-wide">AI Enhanced Preview</p>
                <p className="text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap">{descDrafts[proj.id]}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => applyDesc(proj.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-semibold hover:bg-purple-700 transition-colors">
                    <Icon name="Check" size={11} /> Apply to Resume
                  </button>
                  <button onClick={() => discardDesc(proj.id)}
                    className="px-3 py-1.5 rounded-lg bg-white text-gray-500 text-[11px] font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
          <CvBulletEditor bullets={proj.bullets} onChange={v => update(proj.id, 'bullets', v)} onImprove={onImprove} improving={improving} />
        </CvEntryCard>
        </div>
      ))}
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 justify-center rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <Icon name="Plus" size={15}/> Add Project
        </button>
      )}
    </div>
  );
}
function CvCertificationsForm({ certifications, onChange, expanded, onToggle, confirmDel, onConfirmDel, onAdd }) {
  const [drag, setDrag] = useState(null);
  const update = (id, field, val) => onChange(certifications.map(c => c.id === id ? { ...c, [field]: val } : c));
  const remove = (id) => { onChange(certifications.filter(c => c.id !== id)); onConfirmDel(id, undefined); };
  const reorder = (fi, ti) => { const n=[...certifications]; const [x]=n.splice(fi,1); n.splice(ti,0,x); onChange(n); };
  return (
    <div className="flex flex-col gap-3">
      <SectionGuide checks={[
        { label: 'Add at least 1 certification',       done: certifications.length >= 1,
          example: 'AWS Solutions Architect, Google Cloud Professional, Meta Frontend',
          applyLabel: 'Add cert', onApply: onAdd },
        { label: 'Certification name on each entry',   done: certifications.length > 0 && certifications.every(c => c.name?.trim()),
          example: 'AWS Solutions Architect – Associate' },
        { label: 'Issuing organization on each entry', done: certifications.length > 0 && certifications.every(c => c.issuer?.trim()),
          example: 'Amazon Web Services, Google, Meta, Microsoft' },
        { label: 'Issue date on each entry',           done: certifications.length > 0 && certifications.every(c => c.issueDate?.trim()),
          example: 'Mar 2023  (month + year)' },
      ]}/>
      {certifications.map((cert, idx) => (
        <div key={cert.id} draggable onDragStart={()=>setDrag(idx)} onDragOver={e=>{e.preventDefault();if(drag!==null&&drag!==idx){reorder(drag,idx);setDrag(idx);}}} onDragEnd={()=>setDrag(null)} className="cursor-grab active:cursor-grabbing">
        <CvEntryCard
          title={cert.name} subtitle={cert.issuer} date={cert.issueDate}
          isExpanded={!!expanded[cert.id]} onToggle={() => onToggle(cert.id)}
          onDelete={() => remove(cert.id)}
          confirmDelete={!!confirmDel[cert.id]} setConfirmDelete={v => onConfirmDel(cert.id, v)}>
          <CvInput label="Certification name" value={cert.name} onChange={v => update(cert.id, 'name', v)} placeholder="AWS Solutions Architect" />
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Issuing organization" value={cert.issuer} onChange={v => update(cert.id, 'issuer', v)} placeholder="Amazon Web Services" />
            <CvInput label="Issue date" value={cert.issueDate} onChange={v => update(cert.id, 'issueDate', v)} placeholder="Mar 2023" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Credential ID" value={cert.credentialId} onChange={v => update(cert.id, 'credentialId', v)} placeholder="ABC-123456" />
            <CvInput label="Credential URL" value={cert.credentialUrl} onChange={v => update(cert.id, 'credentialUrl', v)} placeholder="verify.amazon.com/…" />
          </div>
        </CvEntryCard>
        </div>
      ))}
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 justify-center rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <Icon name="Plus" size={15}/> Add Certification
        </button>
      )}
    </div>
  );
}
function CvLanguagesForm({ languages, onChange }) {
  const add = () => onChange([...languages, { id: cvId(), language: '', proficiency: 'Conversational' }]);
  const update = (id, field, val) => onChange(languages.map(l => l.id === id ? { ...l, [field]: val } : l));
  const remove = (id) => onChange(languages.filter(l => l.id !== id));
  return (
    <div className="flex flex-col gap-2">
      <SectionGuide checks={[
        { label: 'Add at least 1 language',             done: languages.length >= 1,
          example: 'English · Native, French · Conversational',
          applyLabel: 'Add', onApply: add },
        { label: 'Language name on each entry',         done: languages.length > 0 && languages.every(l => l.language?.trim()),
          example: 'English, Arabic, French, Spanish, Mandarin' },
        { label: 'Proficiency level on each entry',     done: languages.length > 0 && languages.every(l => l.proficiency?.trim()),
          example: 'Native / Fluent / Conversational / Basic' },
      ]}/>
      {languages.length > 0 && (
        <div className="grid grid-cols-[1fr_180px_40px] gap-2 mb-1">
          <CvLabel>Language</CvLabel>
          <CvLabel>Proficiency</CvLabel>
          <span/>
        </div>
      )}
      {languages.map(lang => (
        <div key={lang.id} className="grid grid-cols-[1fr_180px_40px] gap-2 items-center">
          <CvInput value={lang.language} onChange={v => update(lang.id, 'language', v)} placeholder="e.g. English" />
          <CvSelect value={lang.proficiency} onChange={v => update(lang.id, 'proficiency', v)} options={PROFICIENCY_LEVELS} />
          <button onClick={() => remove(lang.id)}
            className="h-[38px] flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-red-200" title="Remove">
            <Icon name="Trash2" size={13} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 mt-1 text-sm text-blue-600 hover:text-blue-800 w-fit">
        <Icon name="Plus" size={13} /> Add language
      </button>
    </div>
  );
}
function CvReferencesForm({ references, onChange, expanded, onToggle, confirmDel, onConfirmDel, onAdd }) {
  const [drag, setDrag] = useState(null);
  const update = (id, field, val) => onChange(references.map(r => r.id === id ? { ...r, [field]: val } : r));
  const remove = (id) => { onChange(references.filter(r => r.id !== id)); onConfirmDel(id, undefined); };
  const reorder = (fi, ti) => { const n=[...references]; const [x]=n.splice(fi,1); n.splice(ti,0,x); onChange(n); };
  return (
    <div className="flex flex-col gap-3">
      <SectionGuide checks={[
        { label: 'Add at least 1 reference',            done: references.length >= 1,
          example: 'John Smith · Engineering Manager · Google',
          applyLabel: 'Add', onApply: onAdd },
        { label: 'Full name on each reference',         done: references.length > 0 && references.every(r => r.name?.trim()),
          example: 'John Smith' },
        { label: 'Job title on each reference',         done: references.length > 0 && references.every(r => r.title?.trim()),
          example: 'Engineering Manager, Senior Developer, CTO' },
        { label: 'Company on each reference',           done: references.length > 0 && references.every(r => r.company?.trim()),
          example: 'Google, Acme Corp, Freelance' },
        { label: 'Email or phone on each reference',    done: references.length > 0 && references.every(r => r.email?.trim() || r.phone?.trim()),
          example: 'john@google.com or +1 555 000 0000' },
      ]}/>
      {references.map((ref, idx) => (
        <div key={ref.id} draggable onDragStart={()=>setDrag(idx)} onDragOver={e=>{e.preventDefault();if(drag!==null&&drag!==idx){reorder(drag,idx);setDrag(idx);}}} onDragEnd={()=>setDrag(null)} className="cursor-grab active:cursor-grabbing">
        <CvEntryCard
          title={ref.name} subtitle={ref.title} date={ref.company}
          isExpanded={!!expanded[ref.id]} onToggle={() => onToggle(ref.id)}
          onDelete={() => remove(ref.id)}
          confirmDelete={!!confirmDel[ref.id]} setConfirmDelete={v => onConfirmDel(ref.id, v)}>
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Full name" value={ref.name} onChange={v => update(ref.id, 'name', v)} placeholder="John Manager" />
            <CvInput label="Job title" value={ref.title} onChange={v => update(ref.id, 'title', v)} placeholder="Engineering Manager" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Company" value={ref.company} onChange={v => update(ref.id, 'company', v)} placeholder="Acme Corp" />
            <CvInput label="Relationship" value={ref.relationship} onChange={v => update(ref.id, 'relationship', v)} placeholder="Direct Manager" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CvInput label="Email" value={ref.email} onChange={v => update(ref.id, 'email', v)} placeholder="john@acme.com" type="email" />
            <CvInput label="Phone (optional)" value={ref.phone} onChange={v => update(ref.id, 'phone', v)} placeholder="+1 555 000 0000" />
          </div>
        </CvEntryCard>
        </div>
      ))}
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 justify-center rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <Icon name="Plus" size={15}/> Add Reference
        </button>
      )}
      <p className="text-[11px] text-gray-500 italic">References appear in the CV preview. You can also write "References available upon request" in the Custom section.</p>
    </div>
  );
}
function CvCustomForm({ custom, onChange, onImprove, improving }) {
  const [aiDraft, setAiDraft] = useState(null);
  const handleEnhance = () => {
    if (!custom.body.trim() || improving === 'custom') return;
    onImprove && onImprove(custom.body, 'custom', (enhanced) => setAiDraft(enhanced));
  };
  return (
    <div className="flex flex-col gap-4">
      <SectionGuide checks={[
        { label: 'Give the section a title',           done: !!(custom.title?.trim()),
          example: 'Volunteer Work, Publications, Awards, Open Source',
          applyLabel: 'Apply', onApply: () => !custom.title?.trim() && onChange({ ...custom, title: 'Awards & Achievements' }) },
        { label: 'Add content (50+ characters)',       done: (custom.body?.trim() || '').length >= 50,
          example: 'Dean\'s List 2022–2023 · Volunteered at Code.org teaching 200+ students · Speaker at ReactConf 2024' },
      ]}/>
      <CvInput label="Section title" value={custom.title} onChange={v => onChange({ ...custom, title: v })} placeholder="Volunteer Work / Publications / Awards..." />
      <CvTextarea label="Content" value={custom.body} onChange={v => onChange({ ...custom, body: v })}
        placeholder="Write anything here — achievements, volunteering, publications, awards, hobbies..."
        rows={8} maxLength={1200} />
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={handleEnhance} disabled={!custom.body.trim() || improving === 'custom'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-40 text-[11px] font-semibold transition-colors">
          {improving === 'custom' ? <Icon name="Loader" size={11} className="animate-spin" /> : <Icon name="Sparkles" size={11} />}
          {improving === 'custom' ? 'Enhancing...' : 'AI Enhance Content'}
        </button>
        {(custom.title || custom.body) && (
          <button onClick={() => { onChange({ title: '', body: '' }); setAiDraft(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 text-[11px] font-medium transition-colors">
            <Icon name="RotateCcw" size={11}/> Clear section
          </button>
        )}
      </div>
      {aiDraft !== null && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-3">
          <p className="text-[10px] font-semibold text-purple-700 mb-2 uppercase tracking-wide">AI Enhanced Preview</p>
          <p className="text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap">{aiDraft}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { onChange({ ...custom, body: aiDraft }); setAiDraft(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-semibold hover:bg-purple-700 transition-colors">
              <Icon name="Check" size={11} /> Apply to Resume
            </button>
            <button onClick={() => setAiDraft(null)}
              className="px-3 py-1.5 rounded-lg bg-white text-gray-500 text-[11px] font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
              Discard
            </button>
          </div>
        </div>
      )}
      <p className="text-[11px] text-gray-500">This section appears at the bottom of your CV with your custom title.</p>
    </div>
  );
}
function CvAdditionalExpForm({ items, onChange }) {
  const add = () => onChange([...(items || []), '']);
  const update = (i, v) => onChange((items || []).map((x, j) => j === i ? v : x));
  const remove = (i) => onChange((items || []).filter((_, j) => j !== i));
  const filled = (items || []).filter(i => i.trim().length > 15);
  return (
    <div className="flex flex-col gap-3">
      <SectionGuide checks={[
        { label: 'Add at least 1 bullet point',          done: (items||[]).some(i => i.trim()),
          example: 'Freelanced as a React developer building 5+ client websites',
          applyLabel: 'Add bullet', onApply: add },
        { label: '2+ bullets (freelance, contracts…)',   done: filled.length >= 2,
          example: 'Open-source contributor to popular npm packages, 200+ GitHub stars',
          applyLabel: 'Add bullet', onApply: add },
        { label: 'Each bullet is descriptive (15+ chars)',done: filled.length === (items||[]).filter(i=>i.trim()).length && filled.length > 0,
          example: 'Be specific: what you built, what stack, what impact' },
      ]}/>
      <p className="text-[11px] text-gray-500">Add bullet points for additional experience — projects, pipelines, freelance work, etc.</p>
      {(items || []).map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <textarea
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder="Describe what you built or accomplished..."
            rows={2}
            style={CV_INPUT_STYLE}
            className="flex-1 text-[12px] border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white"
          />
          <button onClick={() => remove(i)} className="mt-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
            <Icon name="Trash2" size={14}/>
          </button>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 text-[11px] font-medium transition-colors w-fit">
        <Icon name="Plus" size={12}/> Add bullet
      </button>
    </div>
  );
}

function CvHobbiesForm({ hobbies, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <SectionGuide checks={[
        { label: 'Add at least 1 hobby / interest',  done: hobbies.length >= 1,
          example: 'Reading, Hiking, Photography, Chess, Open-Source' },
        { label: '3+ hobbies recommended',            done: hobbies.length >= 3,
          example: 'Shows personality — recruiters love well-rounded candidates' },
      ]}/>
      <p className="text-[11px] text-gray-500">Add your hobbies and interests. Press Enter or comma to add each one.</p>
      <CvTagInput label="Hobbies & Interests" tags={hobbies} onChange={onChange} placeholder="Reading, Hiking, Photography, Chess..." />
      {hobbies.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {hobbies.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 text-[11px] font-medium rounded-full border border-gray-200 shadow-sm">
                {h}
                <button onClick={() => onChange(hobbies.filter((_,j) => j !== i))} className="text-gray-400 hover:text-red-500 leading-none ml-0.5">×</button>
              </span>
            ))}
          </div>
          <button onClick={() => onChange([])}
            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 text-[11px] font-medium transition-colors">
            <Icon name="RotateCcw" size={11}/> Clear all hobbies
          </button>
        </div>
      )}
    </div>
  );
}
export { CvLabel, CvInput, CvTextarea, CvSelect, CvTagInput, CvBulletEditor, CvEntryCard, CvAtsScore, CvHeaderForm, CvSummaryForm, CvExperienceForm, CvEducationForm, CvSkillsForm, CvProjectsForm, CvCertificationsForm, CvLanguagesForm, CvReferencesForm, CvHobbiesForm, CvCustomForm, CvAdditionalExpForm };
