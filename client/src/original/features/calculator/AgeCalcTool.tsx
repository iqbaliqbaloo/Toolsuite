// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Label, ResultPanel } from '../../components/ui/shared';

// ─── Date helpers ─────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function parseLocal(str) {
  const [y, m, d] = str.split('-').map(Number);
  return { y, m, d };
}

function daysInMonth(year, month1) {
  return new Date(year, month1, 0).getDate(); // day 0 of next month = last day of this month
}

function isLeap(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function toDate(p) {
  return new Date(p.y, p.m - 1, p.d);
}

// Core borrowing-logic algorithm (per spec)
function calcAge(dob, today) {
  let d = today.d - dob.d;
  let m = today.m - dob.m;
  let y = today.y - dob.y;

  if (d < 0) {
    const prevM = today.m === 1 ? 12 : today.m - 1;
    const prevY = today.m === 1 ? today.y - 1 : today.y;
    d = today.d + daysInMonth(prevY, prevM) - dob.d;
    m -= 1;
  }
  if (m < 0) { m += 12; y -= 1; }

  return { years: y, months: m, days: d };
}

function nextBirthday(dob, today) {
  const bd = { y: today.y, m: dob.m, d: dob.d };
  // Feb 29 in non-leap year → Feb 28
  if (dob.m === 2 && dob.d === 29 && !isLeap(bd.y)) bd.d = 28;
  const todayMs = toDate(today).getTime();
  const bdMs = toDate(bd).getTime();
  if (bdMs <= todayMs) {
    bd.y += 1;
    bd.d = (dob.m === 2 && dob.d === 29 && !isLeap(bd.y)) ? 28 : dob.d;
  }
  return { date: bd, days: Math.round((toDate(bd).getTime() - todayMs) / 86400000) };
}

// ─── Zodiac ───────────────────────────────────────────────────────────────────
const ZODIAC = [
  { sign: 'Capricorn',   sym: '♑', start: [12,22], end: [1,19]  },
  { sign: 'Aquarius',    sym: '♒', start: [1,20],  end: [2,18]  },
  { sign: 'Pisces',      sym: '♓', start: [2,19],  end: [3,20]  },
  { sign: 'Aries',       sym: '♈', start: [3,21],  end: [4,19]  },
  { sign: 'Taurus',      sym: '♉', start: [4,20],  end: [5,20]  },
  { sign: 'Gemini',      sym: '♊', start: [5,21],  end: [6,20]  },
  { sign: 'Cancer',      sym: '♋', start: [6,21],  end: [7,22]  },
  { sign: 'Leo',         sym: '♌', start: [7,23],  end: [8,22]  },
  { sign: 'Virgo',       sym: '♍', start: [8,23],  end: [9,22]  },
  { sign: 'Libra',       sym: '♎', start: [9,23],  end: [10,22] },
  { sign: 'Scorpio',     sym: '♏', start: [10,23], end: [11,21] },
  { sign: 'Sagittarius', sym: '♐', start: [11,22], end: [12,21] },
];
const CHINESE = ['Monkey','Rooster','Dog','Pig','Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat'];

function getZodiac(m, d) {
  for (const z of ZODIAC) {
    const [sm, sd] = z.start, [em, ed] = z.end;
    if (sm > em) { // Capricorn spans Dec–Jan
      if ((m === sm && d >= sd) || (m === em && d <= ed)) return z;
    } else {
      if ((m === sm && d >= sd) || (m > sm && m < em) || (m === em && d <= ed)) return z;
    }
  }
  return ZODIAC[0];
}

// ─── Life ring (donut) ───────────────────────────────────────────────────────
function LifeRing({ years }) {
  const capped = Math.min(years, 80);
  const pctNum = (capped / 80) * 100;
  const r = 52, cx = 68, cy = 68;
  const circ = 2 * Math.PI * r;
  const dash = (pctNum / 100) * circ;
  const ringColor = years < 20 ? '#34d399' : years < 40 ? '#60a5fa' : years < 60 ? '#fbbf24' : '#f97316';
  const stages = [
    { label: 'Childhood', max: 12, color: '#34d399' },
    { label: 'Teen',      max: 17, color: '#60a5fa' },
    { label: 'Young',     max: 35, color: '#a78bfa' },
    { label: 'Middle',    max: 60, color: '#fbbf24' },
    { label: 'Senior',    max: 80, color: '#f97316' },
  ];
  const stage = stages.find(s => years <= s.max) || stages[stages.length - 1];
  return (
    <div className="flex flex-col items-center shrink-0">
      <svg viewBox="0 0 136 136" className="w-[120px] h-[120px]" aria-hidden="true">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-strong)" strokeWidth="13" opacity="0.3" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={ringColor} strokeWidth="13"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
        <text x={cx} y={cy - 7} textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="bold" fontFamily="system-ui">{pctNum.toFixed(0)}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--text-tertiary)" fontSize="9.5" fontFamily="system-ui">of 80 yrs</text>
        <text x={cx} y={cy + 23} textAnchor="middle" fill={ringColor} fontSize="9" fontFamily="system-ui">{stage.label}</text>
      </svg>
    </div>
  );
}

// ─── Year dots grid ──────────────────────────────────────────────────────────
function YearDots({ years }) {
  const stageColor = (yr) => {
    if (yr <= 12) return '#34d399';
    if (yr <= 17) return '#60a5fa';
    if (yr <= 35) return '#a78bfa';
    if (yr <= 60) return '#fbbf24';
    return '#f97316';
  };
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Life in Years (80)</p>
      <div className="flex flex-wrap gap-[3px]">
        {Array.from({ length: 80 }, (_, i) => {
          const yr = i + 1;
          const isCurrent = yr === Math.ceil(years) || (yr === 80 && years >= 80);
          const isPast = yr < years;
          return (
            <div key={yr} title={`Age ${yr}`}
              className={`rounded-[2px] ${isCurrent ? 'ring-2 ring-pink-400 ring-offset-1 scale-[1.4]' : ''}`}
              style={{ width: 8, height: 8, background: isPast ? stageColor(yr) : isCurrent ? '#e879f9' : 'var(--border)', flexShrink: 0 }} />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-2.5">
        {[['#34d399','Child 1–12'],['#60a5fa','Teen 13–17'],['#a78bfa','Young 18–35'],['#fbbf24','Middle 36–60'],['#f97316','Senior 61+'],['#e879f9','You are here']].map(([c,l]) => (
          <span key={l} className="flex items-center gap-1 text-[9.5px] text-[var(--text-tertiary)]">
            <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ background: c }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
const INPUT = 'h-10 px-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13.5px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors';

function StatBox({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]">
      <span className="text-[11px] text-[var(--text-tertiary)] font-medium">{label}</span>
      <span className="text-[15px] font-bold text-[var(--text-primary)] tabular-nums leading-snug">{value}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AgeCalcTool() {
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local
  const [dob,   setDob]   = useState('');
  const [asOf,  setAsOf]  = useState(todayStr);

  const result = useMemo(() => {
    if (!dob) return null;
    const dobP   = parseLocal(dob);
    const todayP = parseLocal(asOf || todayStr);

    // Validate
    if (isNaN(toDate(dobP).getTime())) return null;
    if (toDate(dobP) > toDate(todayP)) return { error: 'Date of birth cannot be in the future.' };

    const { years, months, days } = calcAge(dobP, todayP);
    const totalDays  = Math.floor((toDate(todayP) - toDate(dobP)) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours  = totalDays * 24;
    const totalMins   = totalDays * 1440;
    const totalSecs   = totalDays * 86400;

    const nb     = nextBirthday(dobP, todayP);
    const dayBorn = WEEKDAYS[toDate(dobP).getDay()];
    const zodiac  = getZodiac(dobP.m, dobP.d);
    const chinese = CHINESE[dobP.y % 12];
    const isBirthday = years > 0 && months === 0 && days === 0;

    return {
      years, months, days, totalDays, totalWeeks,
      totalMonths, totalHours, totalMins, totalSecs,
      nextBd: nb, dayBorn, zodiac, chinese, dobP, isBirthday,
    };
  }, [dob, asOf]);

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date of birth</Label>
          <input type="date" value={dob} max={asOf || todayStr}
            onChange={e => setDob(e.target.value)} className={`${INPUT} w-full`} />
        </div>
        <div>
          <Label>Calculate as of <span className="text-[var(--text-tertiary)] font-normal">(optional)</span></Label>
          <input type="date" value={asOf} max={todayStr}
            onChange={e => setAsOf(e.target.value || todayStr)} className={`${INPUT} w-full`} />
        </div>
      </div>

      {/* Error */}
      {result?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
          {result.error}
        </div>
      )}

      {/* Result */}
      {result && !result.error && (
        <ResultPanel>
          {/* Birthday banner */}
          {result.isBirthday && (
            <div className="rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-line)] px-4 py-3 mb-4 text-center text-[13.5px] font-semibold text-[var(--accent)]">
              🎂 Happy Birthday!
            </div>
          )}

          {/* Primary age */}
          <div className="text-center mb-5">
            <p className="text-[58px] font-bold leading-none tabular-nums text-[var(--text-primary)]">
              {result.years}
            </p>
            <p className="text-[15px] text-[var(--text-secondary)] mt-1">years old</p>
            <p className="text-[13px] text-[var(--text-tertiary)] mt-1 tabular-nums">
              {result.years}y &nbsp;{result.months}m &nbsp;{result.days}d
            </p>
            {/* Zodiac */}
            <p className="text-[13px] text-[var(--text-secondary)] mt-2">
              {result.zodiac.sym} {result.zodiac.sign} &nbsp;·&nbsp; {result.chinese} (Chinese zodiac)
            </p>
          </div>

          {/* Life ring + year dots */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-5 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]">
            <LifeRing years={result.years} />
            <YearDots years={result.years} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            <StatBox label="Total months"  value={result.totalMonths.toLocaleString()} />
            <StatBox label="Total weeks"   value={result.totalWeeks.toLocaleString()} />
            <StatBox label="Total days"    value={result.totalDays.toLocaleString()} />
            <StatBox label="Total hours"   value={result.totalHours.toLocaleString()} />
            <StatBox label="Total minutes" value={result.totalMins.toLocaleString()} />
            <StatBox label="Total seconds" value={result.totalSecs.toLocaleString()} />
          </div>

          {/* Next birthday + day born */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox
              label="Next birthday"
              value={result.nextBd.days === 0
                ? 'Today! 🎂'
                : `${result.nextBd.days} days`}
            />
            <StatBox
              label="Born on"
              value={`${result.dayBorn}, ${MONTHS[result.dobP.m - 1]} ${result.dobP.d}`}
            />
          </div>

          {/* Next birthday date */}
          {result.nextBd.days > 0 && (
            <p className="text-[12px] text-[var(--text-tertiary)] text-center">
              Next birthday: {MONTHS[result.nextBd.date.m - 1]} {result.nextBd.date.d}, {result.nextBd.date.y}
            </p>
          )}
        </ResultPanel>
      )}

      {/* Rich content */}
      <AgeInfoContent />
    </div>
  );
}

// ─── Info helpers ─────────────────────────────────────────────────────────────
function S({ title, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight border-b border-[var(--border)] pb-2">{title}</h2>
      {children}
    </section>
  );
}
function P({ children }) {
  return <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">{children}</p>;
}
function T({ headers, rows }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)] text-[13px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--surface-secondary)]">
            {headers.map(h => <th key={h} className="text-left px-3 py-2.5 font-semibold text-[var(--text-primary)] border-b border-[var(--border)]">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-b-0 border-[var(--border)] hover:bg-[var(--surface-secondary)] transition-colors">
              {row.map((c, j) => <td key={j} className="px-3 py-2.5 text-[var(--text-secondary)]">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function FAQ({ q, a }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3.5">
      <p className="font-semibold text-[13.5px] text-[var(--text-primary)] mb-1.5">{q}</p>
      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{a}</p>
    </div>
  );
}

// ─── Info charts (static, for detail section) ────────────────────────────────
function LifeExpectancyChart() {
  const data = [
    { country: 'Japan',              years: 84.3, color: '#34d399', flag: '🇯🇵' },
    { country: 'Switzerland',        years: 83.4, color: '#34d399', flag: '🇨🇭' },
    { country: 'South Korea',        years: 83.3, color: '#34d399', flag: '🇰🇷' },
    { country: 'USA',                years: 76.1, color: '#60a5fa', flag: '🇺🇸' },
    { country: 'World Average',      years: 73.4, color: '#a78bfa', flag: '🌍' },
    { country: 'India',              years: 70.2, color: '#fbbf24', flag: '🇮🇳' },
    { country: 'Pakistan',           years: 67.3, color: '#f97316', flag: '🇵🇰' },
    { country: 'Sub-Saharan Africa', years: 61.4, color: '#ef4444', flag: '🌍' },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {data.map(d => (
        <div key={d.country} className="flex items-center gap-3">
          <span className="text-[15px] shrink-0 w-6 text-center">{d.flag}</span>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[12px] text-[var(--text-secondary)]">{d.country}</span>
              <span className="text-[12px] font-bold tabular-nums" style={{ color: d.color }}>{d.years} yrs</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full" style={{ width: `${(d.years / 90) * 100}%`, background: d.color }} />
            </div>
          </div>
        </div>
      ))}
      <p className="text-[10.5px] text-[var(--text-tertiary)]">Source: WHO Global Health Observatory 2023 estimates.</p>
    </div>
  );
}

function ChineseZodiacGrid() {
  const animals = [
    { name: 'Rat',    emoji: '🐀', color: '#60a5fa' },
    { name: 'Ox',     emoji: '🐂', color: '#34d399' },
    { name: 'Tiger',  emoji: '🐅', color: '#f97316' },
    { name: 'Rabbit', emoji: '🐇', color: '#a78bfa' },
    { name: 'Dragon', emoji: '🐉', color: '#ef4444' },
    { name: 'Snake',  emoji: '🐍', color: '#fbbf24' },
    { name: 'Horse',  emoji: '🐴', color: '#f472b6' },
    { name: 'Goat',   emoji: '🐐', color: '#34d399' },
    { name: 'Monkey', emoji: '🐒', color: '#f97316' },
    { name: 'Rooster',emoji: '🐓', color: '#fbbf24' },
    { name: 'Dog',    emoji: '🐕', color: '#60a5fa' },
    { name: 'Pig',    emoji: '🐖', color: '#f472b6' },
  ];
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {animals.map(a => (
        <div key={a.name} className="rounded-xl border py-2.5 flex flex-col items-center gap-1 text-center"
          style={{ borderColor: a.color + '50', background: a.color + '14' }}>
          <span className="text-[22px]">{a.emoji}</span>
          <span className="text-[10.5px] font-semibold" style={{ color: a.color }}>{a.name}</span>
        </div>
      ))}
    </div>
  );
}

function AgeInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <S title="How Age is Calculated">
        <P>Age is the difference between your date of birth and today's date, broken into years, months, and days using borrowing logic — the same carry-and-borrow method used in arithmetic subtraction. Simply dividing milliseconds by 365.25 gives an approximate result; the correct method accounts for the exact number of days in each specific month.</P>
        <T
          headers={['Step', 'Operation', 'Example (DOB: 15 Jan 2000, Today: 9 Jun 2026)']}
          rows={[
            ['1 — Days',   'today_day − dob_day. If negative, borrow from previous month.', '9 − 15 = −6 → borrow May (31 days) → 9 + 31 − 15 = 25 days'],
            ['2 — Months', 'today_month − dob_month − borrow. If negative, add 12, subtract 1 year.', '6 − 1 − 1 = 4 months'],
            ['3 — Years',  'current_year − dob_year (already adjusted in step 2).', '2026 − 2000 = 26 years'],
            ['Result',     '26 years, 4 months, 25 days', '✓'],
          ]}
        />
      </S>

      <S title="Extended Age Calculations">
        <T
          headers={['Metric', 'Formula', 'Notes']}
          rows={[
            ['Total days',    '(today − dob) ÷ 86,400,000 ms', 'Most accurate — no approximation'],
            ['Total weeks',   'total_days ÷ 7 (floor)',         'Whole weeks only'],
            ['Total months',  '(years × 12) + months',          'Exact whole months lived'],
            ['Total hours',   'total_days × 24',                 'Does not account for daylight saving'],
            ['Total minutes', 'total_days × 1,440',              '1,440 minutes per day'],
            ['Total seconds', 'total_days × 86,400',             '86,400 seconds per day'],
            ['Next birthday', 'Next occurrence of dob day/month from today', 'Feb 29 → Feb 28 in non-leap years'],
          ]}
        />
      </S>

      <S title="Leap Year & Edge Cases">
        <P>Leap years are crucial for correct age calculation because February has 28 or 29 days depending on the year. The leap year rules are:</P>
        <T
          headers={['Rule', 'Condition', 'Example']}
          rows={[
            ['Divisible by 4',    'year % 4 === 0',              '2024 ÷ 4 = 506 → leap year'],
            ['Except centuries',  'year % 100 !== 0',            '1900 ÷ 100 = 19 → NOT leap'],
            ['Except 400-years',  'year % 400 === 0',            '2000 ÷ 400 = 5 → leap year'],
            ['Feb 29 birthday',   'Treated as Feb 28 in non-leap years', 'DOB Feb 29 2000 → birthday Feb 28 2025'],
          ]}
        />
        <P>Other edge cases handled: future date of birth (shows error), DOB = today (age = 0 years, 0 months, 0 days), and month-end borrowing where different months have 28/29/30/31 days.</P>
      </S>

      <S title="Western Zodiac Signs">
        <T
          headers={['Sign', 'Symbol', 'Dates', 'Element']}
          rows={[
            ['Aries',       '♈', 'Mar 21 – Apr 19', 'Fire'],
            ['Taurus',      '♉', 'Apr 20 – May 20', 'Earth'],
            ['Gemini',      '♊', 'May 21 – Jun 20', 'Air'],
            ['Cancer',      '♋', 'Jun 21 – Jul 22', 'Water'],
            ['Leo',         '♌', 'Jul 23 – Aug 22', 'Fire'],
            ['Virgo',       '♍', 'Aug 23 – Sep 22', 'Earth'],
            ['Libra',       '♎', 'Sep 23 – Oct 22', 'Air'],
            ['Scorpio',     '♏', 'Oct 23 – Nov 21', 'Water'],
            ['Sagittarius', '♐', 'Nov 22 – Dec 21', 'Fire'],
            ['Capricorn',   '♑', 'Dec 22 – Jan 19', 'Earth'],
            ['Aquarius',    '♒', 'Jan 20 – Feb 18', 'Air'],
            ['Pisces',      '♓', 'Feb 19 – Mar 20', 'Water'],
          ]}
        />
      </S>

      <S title="Chinese Zodiac — 12-Year Cycle">
        <P>The Chinese zodiac assigns an animal to each year in a 12-year cycle. The animal is determined by birth year (Julian calendar year, technically starting from Chinese New Year in late Jan/early Feb, though most calculators use Jan 1 for simplicity).</P>
        <T
          headers={['Animal', 'Recent Years', 'Traits']}
          rows={[
            ['Rat',     '1996, 2008, 2020', 'Clever, adaptable, quick-witted'],
            ['Ox',      '1997, 2009, 2021', 'Diligent, dependable, strong'],
            ['Tiger',   '1998, 2010, 2022', 'Brave, confident, competitive'],
            ['Rabbit',  '1999, 2011, 2023', 'Gentle, quiet, elegant'],
            ['Dragon',  '2000, 2012, 2024', 'Vigorous, strong, charismatic'],
            ['Snake',   '2001, 2013, 2025', 'Wise, intuitive, introspective'],
            ['Horse',   '2002, 2014, 2026', 'Energetic, free-spirited, cheerful'],
            ['Goat',    '2003, 2015, 2027', 'Calm, gentle, sympathetic'],
            ['Monkey',  '2004, 2016, 2028', 'Witty, curious, innovative'],
            ['Rooster', '2005, 2017, 2029', 'Observant, hardworking, courageous'],
            ['Dog',     '2006, 2018, 2030', 'Loyal, honest, kind'],
            ['Pig',     '2007, 2019, 2031', 'Compassionate, generous, diligent'],
          ]}
        />
      </S>

      <ChineseZodiacGrid />

      <S title="Age Milestones Around the World">
        <T
          headers={['Age', 'Milestone', 'Country / Context']}
          rows={[
            ['13',  'Bat/Bar Mitzvah',               'Jewish tradition — religious adulthood'],
            ['15',  'Quinceañera',                    'Latin America — girl\'s transition to womanhood'],
            ['16',  'Driver\'s licence',              'USA, UK, Australia'],
            ['18',  'Legal adulthood (voting, contracts)', 'Most countries worldwide'],
            ['20',  'Hatachi (成人式)',                'Japan — coming-of-age celebration'],
            ['21',  'Legal drinking age',             'USA — key adulthood milestone'],
            ['25',  'Frontal lobe fully developed',   'Neuroscience — prefrontal cortex matures'],
            ['30',  'Saturn Return',                  'Astrology — major life transition period'],
            ['40',  'Midlife milestone',              'Most cultures mark with celebrations'],
            ['60',  'Retirement planning age',        'Many pension systems reference this'],
            ['65',  'Standard retirement age',        'USA, UK, most European countries'],
            ['100', 'Centenarian',                    'Letter from monarch/president in many countries'],
          ]}
        />
      </S>

      <S title="Life Expectancy by Country (2023)">
        <P>How long people live varies dramatically by country, driven by access to healthcare, diet, lifestyle, and economic development. Understanding where you stand relative to global averages can give perspective to your own age milestones.</P>
        <LifeExpectancyChart />
      </S>

      <S title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FAQ q="Why doesn't just dividing milliseconds by 365 give the right age?"
               a="Because months have different lengths (28–31 days) and leap years add an extra day. Dividing raw milliseconds by 365.25 gives an approximation that can be off by a day or more, especially around birthdays. The correct method is the borrowing algorithm that subtracts years, months, and days while accounting for the actual days in each specific month." />
          <FAQ q="How is 'as of' date useful?"
               a="The 'Calculate as of' feature lets you compute age at any point in time — past or future. For example: how old will I be on my wedding date? How old was my grandfather when he emigrated in 1952? How old will my child be when they start school? Simply change the 'as of' date to get the precise age at that moment." />
          <FAQ q="What happens if someone is born on February 29?"
               a="February 29 only exists in leap years. For people born on Feb 29, their birthday is celebrated on Feb 28 in non-leap years. Our calculator handles this correctly — the next birthday counter will point to Feb 28 in years where Feb 29 doesn't exist, and to Feb 29 in leap years." />
          <FAQ q="How is the next birthday calculated?"
               a="The calculator finds the next occurrence of your birth month and day. If that date has already passed this year, it uses next year. For Feb 29 birthdays, it adjusts to Feb 28 in non-leap years. The days-until value uses midnight-to-midnight day counting for accuracy." />
          <FAQ q="How accurate are the total hours, minutes, and seconds?"
               a="These are calculated from total days × conversion factor. They are accurate to the day but do not account for daylight saving time transitions (which add or remove one hour per transition per year) or leap seconds. For most practical purposes this level of precision is more than sufficient." />
          <FAQ q="What is the Western zodiac and how is it assigned?"
               a="The Western (tropical) zodiac divides the year into 12 signs based on the Sun's position relative to Earth as it orbits. Each sign spans approximately 30 days. Your zodiac sign is determined by your birth month and day — it has nothing to do with birth year. The system originates from Babylonian astronomy circa 1000 BCE." />
        </div>
      </S>

    </div>
  );
}
