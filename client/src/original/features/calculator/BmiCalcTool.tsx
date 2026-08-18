// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Label, SelectField, ResultPanel } from '../../components/ui/shared';

const WHO_CATS = [
  { max: 18.5,     label: 'Underweight',       range: '< 18.5',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  { max: 25,       label: 'Normal weight',     range: '18.5 – 24.9', color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  { max: 30,       label: 'Overweight',        range: '25.0 – 29.9', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  { max: 35,       label: 'Obese — Class I',   range: '30.0 – 34.9', color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
  { max: 40,       label: 'Obese — Class II',  range: '35.0 – 39.9', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  { max: Infinity, label: 'Obese — Class III', range: '≥ 40.0',      color: '#dc2626', bg: 'rgba(220,38,38,0.12)'   },
];

const ASIAN_CATS = [
  { max: 18.5,     label: 'Underweight',   range: '< 18.5',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  { max: 23,       label: 'Normal weight', range: '18.5 – 22.9', color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  { max: 27.5,     label: 'Overweight',   range: '23.0 – 27.4', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  { max: Infinity, label: 'Obese',        range: '≥ 27.5',      color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
];

function getCat(bmi, cats) {
  return cats.find(c => bmi < c.max) || cats[cats.length - 1];
}

// ─── Gauge (270° speedometer) ─────────────────────────────────────────────────
const GCX = 90, GCY = 92, GR = 70;

function polarXY(deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [GCX + GR * Math.cos(rad), GCY + GR * Math.sin(rad)];
}

function arcPath(a, b) {
  const [sx, sy] = polarXY(a);
  const [ex, ey] = polarXY(b);
  return `M${sx} ${sy} A${GR} ${GR} 0 ${b - a > 180 ? 1 : 0} 1 ${ex} ${ey}`;
}

function bmiToDeg(bmi) {
  return ((Math.max(10, Math.min(45, bmi)) - 10) / 35) * 270 - 135;
}

function Gauge({ bmi, cats }) {
  const nd  = bmiToDeg(bmi);
  const nRad = ((nd - 90) * Math.PI) / 180;
  const nx  = GCX + (GR - 9) * Math.cos(nRad);
  const ny  = GCY + (GR - 9) * Math.sin(nRad);
  return (
    <svg viewBox="0 0 180 152" className="w-full max-w-[210px] mx-auto select-none" aria-hidden="true">
      <path d={arcPath(-135, 135)} fill="none" stroke="var(--border-strong)" strokeWidth="13" strokeLinecap="butt" opacity="0.35" />
      {cats.map((c, i) => {
        const from = i === 0 ? 10 : cats[i - 1].max;
        const to   = c.max === Infinity ? 45 : Math.min(c.max, 45);
        return <path key={i} d={arcPath(bmiToDeg(from), bmiToDeg(to))} fill="none" stroke={c.color} strokeWidth="13" strokeLinecap="butt" opacity="0.85" />;
      })}
      <line x1={GCX} y1={GCY} x2={nx} y2={ny} stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={GCX} cy={GCY} r="4.5" fill="var(--text-primary)" />
      <text x="14"  y="148" fontSize="9" fill="var(--text-tertiary)" textAnchor="middle">10</text>
      <text x="90"  y="17"  fontSize="9" fill="var(--text-tertiary)" textAnchor="middle">27.5</text>
      <text x="166" y="148" fontSize="9" fill="var(--text-tertiary)" textAnchor="middle">45</text>
    </svg>
  );
}

// ─── BMI Spectrum bar ─────────────────────────────────────────────────────────
function BmiSpectrumBar({ bmi, cats }) {
  const MIN = 10, TOTAL = 35; // display range 10–45
  const pct = (v) => Math.min(100, Math.max(0, ((Math.min(v === Infinity ? 45 : v, 45) - MIN) / TOTAL) * 100));
  const ptr = pct(bmi);
  const catColor = (cats.find(c => bmi < c.max) || cats[cats.length - 1]).color;
  const marks = [{ v: 10 }, { v: 18.5 }, { v: 25 }, { v: 30 }, { v: 35 }, { v: 45, label: '40+' }];
  const segs = cats.map((c, i) => {
    const s = i === 0 ? MIN : Math.min(cats[i - 1].max, 45);
    const e = Math.min(c.max === Infinity ? 45 : c.max, 45);
    return { s, e, color: c.color };
  });
  return (
    <div className="mb-5 px-1">
      <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2.5">BMI Spectrum</p>
      <div className="relative">
        {/* pointer */}
        <div className="absolute top-0 -translate-x-1/2" style={{ left: `${ptr}%` }}>
          <div className="w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `7px solid ${catColor}` }} />
        </div>
        {/* bar */}
        <div className="flex h-[14px] rounded-full overflow-hidden w-full mt-2.5">
          {segs.map((s, i) => (
            <div key={i} style={{ flex: s.e - s.s, background: s.color }} />
          ))}
        </div>
        {/* scale labels */}
        <div className="relative h-4 mt-0.5">
          {marks.map((mk, i) => (
            <span key={i} className="absolute text-[9.5px] text-[var(--text-tertiary)] tabular-nums"
              style={{ left: `${pct(mk.v)}%`, transform: i === 0 ? 'none' : i === marks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)' }}>
              {mk.label ?? mk.v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function Stat({ label, value, sub = '' }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]">
      <span className="text-[11px] text-[var(--text-tertiary)] font-medium">{label}</span>
      <span className="text-[15px] font-bold text-[var(--text-primary)] tabular-nums leading-snug">
        {value}
        {sub && <span className="text-[11px] font-normal text-[var(--text-tertiary)] ml-1">{sub}</span>}
      </span>
    </div>
  );
}

// ─── Gender toggle ────────────────────────────────────────────────────────────
function GenderToggle({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[{ id: 'male', label: '♂ Male' }, { id: 'female', label: '♀ Female' }].map(g => (
        <button key={g.id} onClick={() => onChange(g.id)}
          className={`h-10 px-4 rounded-xl text-[13.5px] font-semibold border transition-colors
            ${value === g.id
              ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
              : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-strong)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
            }`}>
          {g.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const INPUT = 'h-10 px-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13.5px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] w-full transition-colors';

export default function BmiCalcTool() {
  const [unit,     setUnit]     = useState('metric-cm');
  const [age,      setAge]      = useState('25');
  const [gender,   setGender]   = useState('male');
  const [weight,   setWeight]   = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightM,  setHeightM]  = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [feet,     setFeet]     = useState('');
  const [inches,   setInches]   = useState('');
  const [pop,      setPop]      = useState('who');

  const isMetric = unit === 'metric-cm' || unit === 'metric-m';
  const isImpFt  = unit === 'imperial-ft';

  // Only clear measurement inputs; age/gender persist
  const clearInputs = () => {
    setWeight(''); setHeightCm(''); setHeightM(''); setHeightIn(''); setFeet(''); setInches('');
  };

  const switchUnit = (v) => { setUnit(v); clearInputs(); };

  const hasAnyInput = weight || heightCm || heightM || heightIn || feet || inches;

  const result = useMemo(() => {
    const w   = parseFloat(weight);
    const a   = parseInt(age);
    let bmi   = null;
    let hm    = null;   // height in metres
    let tin   = null;   // total inches

    if (unit === 'metric-cm') {
      const h = parseFloat(heightCm);
      if (w > 0 && h > 0) { bmi = w / ((h / 100) ** 2); hm = h / 100; }
    } else if (unit === 'metric-m') {
      const h = parseFloat(heightM);
      if (w > 0 && h > 0) { bmi = w / (h ** 2); hm = h; }
    } else if (unit === 'imperial-in') {
      const h = parseFloat(heightIn);
      if (w > 0 && h > 0) { bmi = (w / (h ** 2)) * 703; tin = h; hm = (h * 2.54) / 100; }
    } else {
      const f = parseFloat(feet) || 0;
      const i = parseFloat(inches) || 0;
      const t = f * 12 + i;
      if (w > 0 && t > 0) { bmi = (w / (t ** 2)) * 703; tin = t; hm = (t * 2.54) / 100; }
    }

    if (!bmi || !isFinite(bmi) || bmi <= 0) return null;

    const cats      = pop === 'asian' ? ASIAN_CATS : WHO_CATS;
    const cat       = getCat(bmi, cats);
    const normalCat = cats.find(c => c.label === 'Normal weight');
    const normalMax = normalCat?.max ?? 25;

    // Ideal weight range
    const idealLow  = 18.5;
    const idealHigh = normalMax - 0.1;
    // Weight in kg (for Ponderal Index)
    const wKg = isMetric ? w : w * 0.453592;

    // Ideal weight range: always computed from hm (metres)
    let ideal = null;
    if (hm !== null) {
      if (isMetric) {
        ideal = {
          min: (idealLow  * hm ** 2).toFixed(1),
          max: (idealHigh * hm ** 2).toFixed(1),
          unit: 'kg',
        };
      } else {
        // Imperial: tin is always set when unit is imperial
        ideal = {
          min: ((idealLow  / 703) * tin ** 2).toFixed(1),
          max: ((idealHigh / 703) * tin ** 2).toFixed(1),
          unit: 'lbs',
        };
      }
    }

    // BMI Prime: ratio of BMI to upper bound of normal (standard definition = 25)
    const bmiPrime = (bmi / 25).toFixed(2);

    // Ponderal Index: weight(kg) ÷ height(m)³  [kg/m³]
    const ponderalIndex = hm ? (wKg / (hm ** 3)).toFixed(1) : null;

    // Estimated Body Fat % — Deurenberg formula (1991)
    // BF% = (1.20 × BMI) + (0.23 × Age) − (10.8 × sex) − 5.4
    // sex = 1 for male, 0 for female
    let bodyFat = null;
    if (a >= 2 && a <= 120) {
      const sexVal = gender === 'male' ? 1 : 0;
      const bf = (1.20 * bmi) + (0.23 * a) - (10.8 * sexVal) - 5.4;
      bodyFat = Math.max(0, bf).toFixed(1);
    }

    // Age context notes
    const ageNote = a < 20
      ? 'Ages under 20: use BMI-for-age percentile charts for accurate interpretation.'
      : a >= 65
      ? 'Age 65+: BMI thresholds may differ — consult a healthcare provider.'
      : null;

    return {
      value: Math.round(bmi * 10) / 10,
      raw: bmi, cat, cats, ideal,
      bmiPrime, ponderalIndex, bodyFat,
      ageNote,
    };
  }, [unit, age, gender, weight, heightCm, heightM, heightIn, feet, inches, pop]);

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Unit system */}
      <SelectField label="Unit system" value={unit} onChange={switchUnit}>
        <option value="metric-cm">Metric — kg + cm</option>
        <option value="metric-m">Metric — kg + m</option>
        <option value="imperial-in">Imperial — lbs + inches</option>
        <option value="imperial-ft">Imperial — lbs + ft &amp; in</option>
      </SelectField>

      {/* Age + Gender */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Age <span className="text-[var(--text-tertiary)] font-normal">(2 – 120)</span></Label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)}
            placeholder="25" min="2" max="120" className={INPUT} />
        </div>
        <div>
          <Label>Gender</Label>
          <GenderToggle value={gender} onChange={setGender} />
        </div>
      </div>

      {/* Weight + Height */}
      {isImpFt ? (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Weight (lbs)</Label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder="154" min="1" className={INPUT} />
          </div>
          <div>
            <Label>Feet</Label>
            <input type="number" value={feet} onChange={e => setFeet(e.target.value)}
              placeholder="5" min="1" max="8" className={INPUT} />
          </div>
          <div>
            <Label>Inches</Label>
            <input type="number" value={inches} onChange={e => setInches(e.target.value)}
              placeholder="9" min="0" max="11" className={INPUT} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Weight ({isMetric ? 'kg' : 'lbs'})</Label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder={isMetric ? '70' : '154'} min="1" className={INPUT} />
          </div>
          <div>
            {unit === 'metric-cm' && <>
              <Label>Height (cm)</Label>
              <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                placeholder="175" min="1" className={INPUT} />
            </>}
            {unit === 'metric-m' && <>
              <Label>Height (m)</Label>
              <input type="number" value={heightM} onChange={e => setHeightM(e.target.value)}
                placeholder="1.75" step="0.01" min="0.1" className={INPUT} />
            </>}
            {unit === 'imperial-in' && <>
              <Label>Height (in)</Label>
              <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                placeholder="69" min="1" className={INPUT} />
            </>}
          </div>
        </div>
      )}

      {/* Population standard + Clear */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {[{ id: 'who', label: 'WHO Standard' }, { id: 'asian', label: 'Asian Adjusted' }].map(p => (
            <button key={p.id} onClick={() => setPop(p.id)}
              className={`h-8 px-3.5 rounded-full text-[12.5px] font-semibold border transition-colors
                ${pop === p.id
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
                  : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                }`}>
              {p.label}
            </button>
          ))}
        </div>
        {hasAnyInput && (
          <button onClick={clearInputs}
            className="h-8 px-3.5 rounded-full text-[12.5px] font-semibold border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors">
            Clear
          </button>
        )}
      </div>

      {/* ── Result ── */}
      {result && (
        <ResultPanel>
          {/* Gauge */}
          <Gauge bmi={result.raw} cats={result.cats} />

          {/* BMI value + category */}
          <div className="text-center mb-5 -mt-2">
            <p className="text-[54px] font-bold leading-none tabular-nums text-[var(--text-primary)]">
              {result.value}
              <span className="text-[18px] font-normal text-[var(--text-tertiary)] ml-1.5">kg/m²</span>
            </p>
            <p className="text-[17px] font-semibold mt-1.5" style={{ color: result.cat.color }}>
              {result.cat.label}
            </p>
          </div>

          {/* BMI spectrum bar */}
          <BmiSpectrumBar bmi={result.raw} cats={result.cats} />

          {/* Extra metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            <Stat label="BMI Prime" value={result.bmiPrime}
              sub="(÷ 25)" />
            <Stat label="Ponderal Index" value={result.ponderalIndex ?? '—'}
              sub={result.ponderalIndex ? 'kg/m³' : ''} />
            <Stat label="Est. Body Fat" value={result.bodyFat !== null ? `${result.bodyFat}%` : '—'}
              sub={result.bodyFat !== null ? (gender === 'male' ? 'male' : 'female') : ''} />
            {result.ideal
              ? <Stat label="Healthy weight" value={`${result.ideal.min}–${result.ideal.max}`} sub={result.ideal.unit} />
              : <Stat label="Healthy weight" value="—" />
            }
          </div>

          {/* Category reference table */}
          <div className="rounded-xl overflow-hidden border border-[var(--border)] text-[12.5px] mb-3">
            {result.cats.map((c) => {
              const active = result.cat.label === c.label;
              return (
                <div key={c.label}
                  className="flex items-center justify-between px-3 py-[9px] border-b last:border-b-0 border-[var(--border)] transition-colors"
                  style={active ? { background: c.bg } : {}}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className={`truncate ${active ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {c.label}
                    </span>
                  </div>
                  <span className="tabular-nums font-medium shrink-0 ml-2"
                    style={{ color: active ? c.color : 'var(--text-tertiary)' }}>
                    {c.range}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Age-specific note */}
          {result.ageNote && (
            <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/8 px-3 py-2.5 mb-3 text-[12px] text-yellow-300/90 leading-relaxed">
              ⚠ {result.ageNote}
            </div>
          )}

          <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
            BMI is a screening tool only — it does not account for muscle mass, bone density, or fat distribution.
            Body fat estimate uses the Deurenberg formula (1991). Consult a healthcare provider for a full assessment.
          </p>
        </ResultPanel>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <BmiInfoContent />
    </div>
  );
}

// ─── Reusable sub-components ──────────────────────────────────────────────────
function InfoSection({ title, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight border-b border-[var(--border)] pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoP({ children }) {
  return <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">{children}</p>;
}

function InfoTable({ headers, rows }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)] text-[13px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--surface-secondary)]">
            {headers.map(h => (
              <th key={h} className="text-left px-3 py-2.5 font-semibold text-[var(--text-primary)] border-b border-[var(--border)]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-b-0 border-[var(--border)] hover:bg-[var(--surface-secondary)] transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2.5 text-[var(--text-secondary)]">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqItem({ q, a }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3.5">
      <p className="font-semibold text-[13.5px] text-[var(--text-primary)] mb-1.5">{q}</p>
      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{a}</p>
    </div>
  );
}

// ─── Info charts (static, for detail section) ────────────────────────────────
function BmiZoneColorBar() {
  const zones = [
    { label: 'Underweight', range: '< 18.5',    color: '#60a5fa', flex: 8.5 },
    { label: 'Normal',      range: '18.5–24.9', color: '#34d399', flex: 6.5 },
    { label: 'Overweight',  range: '25–29.9',   color: '#fbbf24', flex: 5   },
    { label: 'Obese I',     range: '30–34.9',   color: '#f97316', flex: 5   },
    { label: 'Obese II',    range: '35–39.9',   color: '#ef4444', flex: 5   },
    { label: 'Obese III',   range: '≥ 40',      color: '#dc2626', flex: 5   },
  ];
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)]">
      <div className="flex h-11">
        {zones.map(z => (
          <div key={z.label} style={{ flex: z.flex, background: z.color }}
            className="flex items-center justify-center px-0.5 text-center">
            <span className="text-[9px] font-bold text-white leading-tight">{z.label}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        {zones.map(z => (
          <div key={z.range} style={{ flex: z.flex, color: z.color, background: z.color + '18' }}
            className="text-center py-1.5 text-[8.5px] tabular-nums font-medium border-t border-[var(--border)]">
            {z.range}
          </div>
        ))}
      </div>
    </div>
  );
}

function WhoAsianComparison() {
  const who = [
    { label: 'Underweight', color: '#60a5fa', flex: 8.5 },
    { label: 'Normal',      color: '#34d399', flex: 6.5 },
    { label: 'Overweight',  color: '#fbbf24', flex: 5   },
    { label: 'Ob I',        color: '#f97316', flex: 5   },
    { label: 'Ob II',       color: '#ef4444', flex: 5   },
    { label: 'Ob III',      color: '#dc2626', flex: 5   },
  ];
  const asian = [
    { label: 'Underweight', color: '#60a5fa', flex: 8.5  },
    { label: 'Normal',      color: '#34d399', flex: 4.5  },
    { label: 'Overweight',  color: '#fbbf24', flex: 4.5  },
    { label: 'Obese',       color: '#ef4444', flex: 17.5 },
  ];
  const Bar = ({ segs }) => (
    <div className="flex h-8 rounded-lg overflow-hidden">
      {segs.map((s, i) => (
        <div key={i} style={{ flex: s.flex, background: s.color }}
          className="flex items-center justify-center">
          <span className="text-[8.5px] font-bold text-white truncate px-0.5">{s.label}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[10.5px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1">WHO Standard (Global)</p>
        <Bar segs={who} />
        <div className="flex justify-between text-[8.5px] text-[var(--text-tertiary)] mt-0.5 tabular-nums px-0.5">
          <span>10</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>45</span>
        </div>
      </div>
      <div>
        <p className="text-[10.5px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Asian Adjusted (Lower thresholds)</p>
        <Bar segs={asian} />
        <div className="flex justify-between text-[8.5px] text-[var(--text-tertiary)] mt-0.5 tabular-nums px-0.5">
          <span>10</span><span>18.5</span><span>23</span><span>27.5</span><span style={{marginLeft:'auto'}}>45</span>
        </div>
      </div>
      <p className="text-[10.5px] text-[var(--text-tertiary)]">Notice: The Normal and Overweight zones are narrower in the Asian standard — obesity risk starts at BMI 27.5 instead of 30.</p>
    </div>
  );
}

function BmiInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="What is Body Mass Index (BMI)?">
        <InfoP>
          Body Mass Index (BMI) is a numerical value derived from a person's weight and height. It was developed
          by Belgian mathematician Adolphe Quetelet in the 1830s and is now the most widely used screening tool
          to categorise individuals as underweight, normal weight, overweight, or obese. BMI is expressed in
          units of kg/m² and is calculated by dividing body weight in kilograms by the square of height in metres.
        </InfoP>
        <InfoP>
          BMI is used by healthcare professionals, public health organisations, and insurance companies worldwide
          because it is simple, inexpensive, and strongly correlated with body fat in most people. The World
          Health Organization (WHO) adopted BMI as the global standard for obesity classification in 1995.
        </InfoP>
      </InfoSection>

      <InfoSection title="BMI Formula Explained">
        <InfoP>
          The formula differs slightly depending on which unit system you use, but the underlying mathematics
          are equivalent:
        </InfoP>
        <InfoTable
          headers={['Unit System', 'Formula', 'Example']}
          rows={[
            ['Metric (kg + cm)', 'BMI = weight(kg) ÷ (height(cm) ÷ 100)²', '70 ÷ 1.75² = 22.9'],
            ['Metric (kg + m)',  'BMI = weight(kg) ÷ height(m)²',            '70 ÷ 1.75² = 22.9'],
            ['Imperial (lbs + in)', 'BMI = (weight(lbs) ÷ height(in)²) × 703', '(154 ÷ 69²) × 703 = 22.7'],
            ['Imperial (lbs + ft/in)', 'Convert to total inches first, then use above', '5\'9" = 69 in'],
          ]}
        />
      </InfoSection>

      <InfoSection title="BMI Categories & Health Risks (WHO)">
        <InfoP>
          The WHO classifies BMI into six categories for adults aged 20 and over. Each range is associated
          with different health risk profiles:
        </InfoP>
        <InfoTable
          headers={['BMI Range', 'Category', 'Health Risk']}
          rows={[
            ['Below 18.5',  'Underweight',       'Malnutrition, anaemia, osteoporosis, immune deficiency'],
            ['18.5 – 24.9', 'Normal weight',     'Lowest risk of chronic disease for most adults'],
            ['25.0 – 29.9', 'Overweight',        'Increased risk of cardiovascular disease, type 2 diabetes'],
            ['30.0 – 34.9', 'Obese — Class I',   'High risk; hypertension, sleep apnoea, joint problems'],
            ['35.0 – 39.9', 'Obese — Class II',  'Very high risk; often requires medical intervention'],
            ['40.0 and above', 'Obese — Class III', 'Extremely high risk; morbid obesity, severely reduced life expectancy'],
          ]}
        />
      </InfoSection>

      <BmiZoneColorBar />

      <InfoSection title="Asian-Adjusted BMI Cutoffs">
        <InfoP>
          Research has shown that people of Asian descent develop metabolic complications (such as type 2
          diabetes and cardiovascular disease) at lower BMI values than the WHO general population cutoffs suggest.
          The WHO Expert Consultation on BMI in Asian populations (2004) proposed the following adjusted thresholds:
        </InfoP>
        <InfoTable
          headers={['BMI Range', 'Category (Asian)']}
          rows={[
            ['Below 18.5',  'Underweight'],
            ['18.5 – 22.9', 'Normal weight'],
            ['23.0 – 27.4', 'Overweight'],
            ['27.5 and above', 'Obese'],
          ]}
        />
        <InfoP>
          These cutoffs apply to populations of South Asian, East Asian, and Southeast Asian descent.
          Countries including China, India, Japan, and Singapore have adopted these thresholds in their
          national health guidelines.
        </InfoP>
      </InfoSection>

      <WhoAsianComparison />

      <InfoSection title="BMI by Age Group">
        <InfoP>
          Standard WHO BMI cutoffs apply to adults aged 20 and over. For other age groups, interpretation
          differs significantly:
        </InfoP>
        <InfoTable
          headers={['Age Group', 'Interpretation Method', 'Notes']}
          rows={[
            ['2–19 years',  'BMI-for-age percentiles (CDC/WHO growth charts)', 'Overweight ≥ 85th percentile; Obese ≥ 95th percentile'],
            ['20–64 years', 'Standard WHO BMI cutoffs',                         'Most research and guidelines apply to this range'],
            ['65+ years',   'Modified thresholds may apply',                    'Some guidelines suggest 23–33 as acceptable range for older adults'],
          ]}
        />
        <InfoP>
          For children and teenagers, BMI alone is not sufficient — sex and age must be considered because
          body composition changes significantly during puberty and growth spurts.
        </InfoP>
      </InfoSection>

      <InfoSection title="BMI Prime & Ponderal Index">
        <InfoP>
          <strong className="text-[var(--text-primary)]">BMI Prime</strong> is the ratio of your BMI to
          the upper limit of the Normal range (25). A BMI Prime of 1.0 means you are exactly at the boundary
          of Normal and Overweight. Values below 1.0 are Normal or Underweight; above 1.0 are Overweight or Obese.
          It allows for quick comparison across populations regardless of the cutoff system in use.
        </InfoP>
        <InfoP>
          <strong className="text-[var(--text-primary)]">Ponderal Index (PI)</strong>, also called the
          Corpulence Index, uses the cube of height rather than the square: PI = weight(kg) ÷ height(m)³.
          The normal range for adults is approximately 11–14 kg/m³. Unlike BMI, PI is more consistent across
          people of different heights — tall individuals tend to have lower BMI relative to body fat, a bias
          the Ponderal Index partially corrects.
        </InfoP>
      </InfoSection>

      <InfoSection title="Limitations of BMI">
        <InfoP>
          Despite its widespread use, BMI has well-documented limitations that every user should understand:
        </InfoP>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Muscle vs. Fat', body: 'Athletes and bodybuilders often have a high BMI due to muscle mass, yet very low body fat. BMI cannot distinguish lean mass from adipose tissue.' },
            { title: 'Age Differences', body: 'Older adults tend to have more body fat and less muscle at the same BMI compared to younger adults, so the same BMI means different health risks.' },
            { title: 'Sex Differences', body: 'Women naturally carry more body fat than men at the same BMI. A BMI of 25 in a woman represents more fat than in a man of identical height/weight.' },
            { title: 'Ethnicity', body: 'Different ethnic groups have different body compositions at the same BMI, which is why WHO developed Asian-adjusted cutoffs.' },
            { title: 'Fat Distribution', body: 'Central (abdominal) obesity is more dangerous than peripheral fat, but BMI does not measure where fat is stored. Waist-to-hip ratio is better for this.' },
            { title: 'Height Bias', body: 'Very tall people tend to have lower BMI values relative to actual body fat percentage, while very short people tend to have higher values.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="How to Achieve a Healthy BMI">
        <InfoP>
          Reaching and maintaining a healthy BMI involves sustainable lifestyle changes rather than
          short-term dieting. Here are evidence-based strategies:
        </InfoP>
        <InfoTable
          headers={['Strategy', 'Detail']}
          rows={[
            ['Caloric balance',        'A deficit of 500–750 kcal/day leads to approximately 0.5–1 kg weight loss per week — a safe, sustainable rate.'],
            ['Dietary quality',        'Prioritise whole foods, lean protein, fibre-rich vegetables, and healthy fats. Limit ultra-processed foods and added sugars.'],
            ['Physical activity',      'WHO recommends 150–300 min of moderate aerobic activity per week plus muscle-strengthening exercises on 2+ days.'],
            ['Sleep',                  '7–9 hours of quality sleep per night regulates hunger hormones (leptin and ghrelin) and reduces cravings.'],
            ['Stress management',      'Chronic stress elevates cortisol, which promotes abdominal fat storage. Mindfulness, yoga, and therapy all help.'],
            ['Medical consultation',   'A registered dietitian or physician can tailor a plan to your specific health conditions, medications, and goals.'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem
            q="Is BMI accurate for everyone?"
            a="BMI is a useful population-level screening tool but is not accurate for everyone individually. Athletes, pregnant women, the elderly, and people of certain ethnicities may get misleading results. Always combine BMI with waist circumference, body fat %, and clinical assessments."
          />
          <FaqItem
            q="What is a good BMI for my age?"
            a="For adults 20–64, WHO defines 18.5–24.9 as Normal. For those 65+, some guidelines accept up to 27. For Asian populations, 18.5–22.9 is recommended as Normal. For children, use age-and-sex-specific percentile charts rather than fixed cutoffs."
          />
          <FaqItem
            q="How is Estimated Body Fat % calculated here?"
            a="This calculator uses the Deurenberg formula (1991): Body Fat % = (1.20 × BMI) + (0.23 × Age) − (10.8 × sex factor) − 5.4, where the sex factor is 1 for male and 0 for female. It provides a reasonable estimate but is not as accurate as DEXA scanning or hydrostatic weighing."
          />
          <FaqItem
            q="What is the difference between BMI and BMI Prime?"
            a="BMI is an absolute number (e.g., 22.5 kg/m²). BMI Prime is the ratio of your BMI to 25 (the upper limit of Normal). A BMI Prime of 0.90 means your BMI is 90% of the Normal upper limit. It makes cross-comparison easier and is independent of which population standard you use."
          />
          <FaqItem
            q="Can I have a normal BMI but still be unhealthy?"
            a="Yes — this is called 'metabolically obese normal weight' (MONW). People with normal BMI but high visceral fat (around organs) can still have elevated risk of diabetes, heart disease, and metabolic syndrome. Waist circumference and blood biomarkers provide additional insight."
          />
          <FaqItem
            q="How often should I check my BMI?"
            a="For weight management purposes, monthly monitoring is sufficient for most adults. Checking too frequently can cause unnecessary anxiety due to normal day-to-day fluctuations from water retention, digestion, and glycogen stores."
          />
        </div>
      </InfoSection>

    </div>
  );
}
