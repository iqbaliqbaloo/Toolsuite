// @ts-nocheck
import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, Label, ResultPanel } from '../../components/ui/shared';
import { apiPost } from '../../services/api';

// ─── Currency registry (code, name, symbol, flag, decimal places) ─────────────
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar',          sym: '$',    flag: '🇺🇸', dp: 2 },
  { code: 'EUR', name: 'Euro',               sym: '€',    flag: '🇪🇺', dp: 2 },
  { code: 'GBP', name: 'British Pound',      sym: '£',    flag: '🇬🇧', dp: 2 },
  { code: 'JPY', name: 'Japanese Yen',       sym: '¥',    flag: '🇯🇵', dp: 0 },
  { code: 'CAD', name: 'Canadian Dollar',    sym: 'C$',   flag: '🇨🇦', dp: 2 },
  { code: 'AUD', name: 'Australian Dollar',  sym: 'A$',   flag: '🇦🇺', dp: 2 },
  { code: 'CHF', name: 'Swiss Franc',        sym: 'Fr',   flag: '🇨🇭', dp: 2 },
  { code: 'CNY', name: 'Chinese Yuan',       sym: '¥',    flag: '🇨🇳', dp: 2 },
  { code: 'INR', name: 'Indian Rupee',       sym: '₹',    flag: '🇮🇳', dp: 2 },
  { code: 'PKR', name: 'Pakistani Rupee',    sym: '₨',    flag: '🇵🇰', dp: 2 },
  { code: 'BRL', name: 'Brazilian Real',     sym: 'R$',   flag: '🇧🇷', dp: 2 },
  { code: 'AED', name: 'UAE Dirham',         sym: '﷼',    flag: '🇦🇪', dp: 2 },
  { code: 'MXN', name: 'Mexican Peso',       sym: 'MX$',  flag: '🇲🇽', dp: 2 },
  { code: 'SGD', name: 'Singapore Dollar',   sym: 'S$',   flag: '🇸🇬', dp: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar',   sym: 'HK$',  flag: '🇭🇰', dp: 2 },
  { code: 'KRW', name: 'South Korean Won',   sym: '₩',    flag: '🇰🇷', dp: 0 },
  { code: 'SEK', name: 'Swedish Krona',      sym: 'kr',   flag: '🇸🇪', dp: 2 },
  { code: 'NOK', name: 'Norwegian Krone',    sym: 'kr',   flag: '🇳🇴', dp: 2 },
  { code: 'DKK', name: 'Danish Krone',       sym: 'kr',   flag: '🇩🇰', dp: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', sym: 'NZ$',  flag: '🇳🇿', dp: 2 },
  { code: 'ZAR', name: 'South African Rand', sym: 'R',    flag: '🇿🇦', dp: 2 },
  { code: 'TRY', name: 'Turkish Lira',       sym: '₺',    flag: '🇹🇷', dp: 2 },
  { code: 'SAR', name: 'Saudi Riyal',        sym: '﷼',    flag: '🇸🇦', dp: 2 },
  { code: 'MYR', name: 'Malaysian Ringgit',  sym: 'RM',   flag: '🇲🇾', dp: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah',  sym: 'Rp',   flag: '🇮🇩', dp: 0 },
  { code: 'THB', name: 'Thai Baht',          sym: '฿',    flag: '🇹🇭', dp: 2 },
  { code: 'PHP', name: 'Philippine Peso',    sym: '₱',    flag: '🇵🇭', dp: 2 },
  { code: 'EGP', name: 'Egyptian Pound',     sym: '£',    flag: '🇪🇬', dp: 2 },
  { code: 'BTC', name: 'Bitcoin',            sym: '₿',    flag: '₿',   dp: 8 },
  { code: 'ETH', name: 'Ethereum',           sym: 'Ξ',    flag: 'Ξ',   dp: 6 },
];

const CUR = Object.fromEntries(CURRENCIES.map(c => [c.code, c]));

// ─── Rounding per spec ────────────────────────────────────────────────────────
// Major (USD/EUR/GBP...): 2dp | High-value (JPY/KRW/IDR): 0dp | Crypto: 6-8dp
function roundResult(val, code) {
  const dp = CUR[code]?.dp ?? 2;
  if (dp === 0) return Math.round(val);
  const f = Math.pow(10, dp);
  return Math.round(val * f) / f;
}

function fmtResult(val, code) {
  const dp = CUR[code]?.dp ?? 2;
  return roundResult(val, code).toLocaleString(undefined, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

// Rate display: enough sig-figs to be useful
function fmtRate(val) {
  if (!val || !isFinite(val)) return '—';
  const a = Math.abs(val);
  if (a >= 10000) return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (a >= 100)   return val.toFixed(2);
  if (a >= 1)     return val.toFixed(4);
  if (a >= 0.001) return val.toFixed(6);
  return val.toFixed(8);
}

// ─── Rate comparison chart ────────────────────────────────────────────────────
function SpreadChart({ midRate, buyRate, sellRate, from, to }) {
  if (!midRate) return null;
  const max = Math.max(sellRate, midRate) * 1.02;
  const bars = [
    { label: 'Mid-market', val: midRate, color: '#60a5fa', hint: 'interbank rate' },
    { label: `You sell ${from}`, val: buyRate, color: '#34d399', hint: 'bank buys from you' },
    { label: `You buy ${to}`,   val: sellRate, color: '#f97316', hint: 'bank sells to you' },
  ];
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3.5 mb-4">
      <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Rate Comparison — 1 {from}</p>
      <div className="flex flex-col gap-3">
        {bars.map(b => (
          <div key={b.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-[var(--text-secondary)]">{b.label} <span className="text-[10.5px] text-[var(--text-tertiary)]">({b.hint})</span></span>
              <span className="text-[12.5px] font-bold tabular-nums" style={{ color: b.color }}>{fmtRate(b.val)} {to}</span>
            </div>
            <div className="h-[10px] rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(b.val / max) * 100}%`, background: b.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick-select pairs ───────────────────────────────────────────────────────
const QUICK = [
  ['USD', 'EUR'], ['USD', 'GBP'], ['USD', 'JPY'],
  ['USD', 'PKR'], ['USD', 'INR'], ['EUR', 'GBP'],
];

const SEL = 'h-10 pl-3 pr-8 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13.5px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors cursor-pointer w-full appearance-none';
const INP = 'h-10 px-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13.5px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors w-full';

function CurrencySelect({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className={SEL}>
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
          ))}
        </select>
        <Icon name="ChevronDown" size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
      </div>
    </div>
  );
}

export default function CurrencyTool() {
  const [amount,  setAmount]  = useState('100');
  const [from,    setFrom]    = useState('USD');
  const [to,      setTo]      = useState('PKR');
  const [spread,  setSpread]  = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [data,    setData]    = useState(null);

  const reset = () => { setData(null); setError(null); };

  const run = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    // Same currency — trivial case
    if (from === to) {
      setData({ midRate: 1, inverseRate: 1, fetchedAt: null, from, to, amt });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch mid-market rate for 1 unit — all math done client-side
      const res = await apiPost('/calculator/currency', { from, to, amount: 1 });
      setData({
        midRate:     res.rate,
        inverseRate: res.inverseRate ?? (1 / res.rate),
        fetchedAt:   res.fetchedAt ?? null,
        from, to, amt,
      });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const swap = () => { const t = from; setFrom(to); setTo(t); reset(); };

  // ── All maths done client-side per spec ────────────────────────────────────
  const calc = data ? (() => {
    const { midRate, inverseRate, fetchedAt, from: f, to: t, amt } = data;
    const s = spread / 100;

    // Core formula: Amount × (Rate_TO ÷ Rate_FROM) = Amount × midRate
    // midRate already equals Rate_TO / Rate_FROM (API gives direct rate)
    const midResult = amt * midRate;

    // Spread (per spec):
    //   Buy  rate = midRate × (1 − spread%)  → bank buys FROM, you receive less
    //   Sell rate = midRate × (1 + spread%)  → bank sells TO,  you pay more
    const buyRate    = midRate * (1 - s);
    const sellRate   = midRate * (1 + s);
    const buyResult  = roundResult(amt * buyRate,  t);
    const sellResult = roundResult(amt * sellRate, t);

    // Reverse rate: Rate(B→A) = 1 ÷ Rate(A→B)
    const revRate = inverseRate;

    // Cross rate: when neither currency is USD, the rate is via USD bridge
    const isCross = f !== 'USD' && t !== 'USD';

    // Formula display string
    const formulaLHS = f === 'USD'
      ? `${amt.toLocaleString()} × ${fmtRate(midRate)}`        // Case 2: Amount × Rate(TO)
      : t === 'USD'
      ? `${amt.toLocaleString()} ÷ ${fmtRate(1 / midRate)}`    // Case 1: Amount ÷ Rate(FROM)
      : `${amt.toLocaleString()} × (${fmtRate(midRate)})`;     // Case 3: Amount × cross rate

    return {
      f, t, amt, midRate, inverseRate, revRate, fetchedAt,
      midResult, buyRate, sellRate, buyResult, sellResult,
      isCross, formulaLHS, s,
    };
  })() : null;

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Quick pairs */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK.map(([f, t]) => (
          <button key={`${f}-${t}`}
            onClick={() => { setFrom(f); setTo(t); reset(); }}
            className={`h-7 px-2.5 rounded-lg text-[12px] font-semibold border transition-colors
              ${from === f && to === t
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
                : 'bg-[var(--surface-secondary)] text-[var(--text-tertiary)] border-[var(--border)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
              }`}>
            {CUR[f]?.flag} {f}/{t}
          </button>
        ))}
      </div>

      {/* ── Inputs ── */}
      <div className="flex flex-col gap-3">
        {/* Amount */}
        <div>
          <Label>Amount</Label>
          <input type="number" value={amount} min="0.01" step="any"
            onChange={e => { setAmount(e.target.value); reset(); }}
            onKeyDown={e => e.key === 'Enter' && run()}
            className={INP} />
        </div>

        {/* From */}
        <CurrencySelect label="From" value={from} onChange={v => { setFrom(v); reset(); }} />

        {/* Swap */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <button onClick={swap}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[12.5px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-tertiary)] transition-colors">
            <Icon name="ArrowLeftRight" size={13} /> Swap
          </button>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* To */}
        <CurrencySelect label="To" value={to} onChange={v => { setTo(v); reset(); }} />
      </div>

      <Btn loading={loading} onClick={run}>
        <Icon name="TrendingUp" size={15} /> Convert
      </Btn>

      {error && <ErrAlert>{error}</ErrAlert>}

      {/* ── Result ── */}
      {calc && (
        <ResultPanel>

          {/* Big result */}
          <div className="mb-5">
            <p className="text-[13px] text-[var(--text-tertiary)] mb-1.5">
              {CUR[calc.f]?.flag} {calc.amt.toLocaleString()} {calc.f} =
            </p>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-[44px] sm:text-[52px] font-bold tabular-nums leading-none text-[var(--text-primary)]">
                {fmtResult(calc.midResult, calc.t)}
              </span>
              <span className="text-[20px] font-semibold text-[var(--text-tertiary)]">
                {CUR[calc.t]?.flag} {calc.t}
              </span>
            </div>
          </div>

          {/* Exchange rate row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pb-5 mb-5 border-b border-[var(--border)] text-[12.5px]">
            <span className="text-[var(--text-secondary)]">
              1 {calc.f} = <strong className="text-[var(--text-primary)]">{fmtRate(calc.midRate)}</strong> {calc.t}
            </span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span className="text-[var(--text-secondary)]">
              1 {calc.t} = <strong className="text-[var(--text-primary)]">{fmtRate(calc.revRate)}</strong> {calc.f}
            </span>
            {calc.isCross && (
              <span className="w-full text-[11.5px] text-[var(--text-tertiary)]">
                Cross rate — bridged via USD: {calc.f} → USD → {calc.t}
              </span>
            )}
          </div>

          {/* Spread section */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12.5px] font-semibold text-[var(--text-secondary)]">
                Bank spread
              </span>
              <span className="text-[12.5px] font-bold tabular-nums text-[var(--accent)]">
                {spread.toFixed(1)}%
              </span>
            </div>
            <input type="range" min="0" max="5" step="0.1" value={spread}
              onChange={e => setSpread(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer mb-4 accent-[var(--accent)]" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12.5px]">
              {/* Mid-market */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-3 text-center">
                <p className="text-[11px] text-[var(--text-tertiary)] mb-1">Mid-market</p>
                <p className="font-bold text-[var(--text-primary)] tabular-nums text-[15px]">
                  {fmtResult(calc.midResult, calc.t)}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 tabular-nums">
                  @ {fmtRate(calc.midRate)}
                </p>
              </div>

              {/* Buy rate: bank buys FROM */}
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-3 text-center">
                <p className="text-[11px] text-green-400/80 mb-1">
                  You sell {calc.f} &nbsp;
                  <span className="opacity-70">−{spread.toFixed(1)}%</span>
                </p>
                <p className="font-bold text-[var(--text-primary)] tabular-nums text-[15px]">
                  {fmtResult(calc.buyResult, calc.t)}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 tabular-nums">
                  @ {fmtRate(calc.buyRate)}
                </p>
              </div>

              {/* Sell rate: bank sells TO */}
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-3 py-3 text-center">
                <p className="text-[11px] text-orange-400/80 mb-1">
                  You buy {calc.t} &nbsp;
                  <span className="opacity-70">+{spread.toFixed(1)}%</span>
                </p>
                <p className="font-bold text-[var(--text-primary)] tabular-nums text-[15px]">
                  {fmtResult(calc.sellResult, calc.t)}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 tabular-nums">
                  @ {fmtRate(calc.sellRate)}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-tertiary)] mt-2.5 leading-relaxed">
              Buy = mid × (1 − spread) · Sell = mid × (1 + spread).
              Mid-market is the pure mathematical rate; banks add a spread on top.
              Drag to simulate different institutions (typical: 0.5%–3%).
            </p>
          </div>

          {/* Rate comparison chart */}
          <SpreadChart midRate={calc.midRate} buyRate={calc.buyRate} sellRate={calc.sellRate} from={calc.f} to={calc.t} />

          {/* Formula breakdown */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3.5 mb-4">
            <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
              Formula — Amount × (Rate_TO ÷ Rate_FROM)
            </p>
            <p className="font-mono text-[13px] text-[var(--text-primary)] break-all">
              {calc.formulaLHS}{' = '}
              <span className="font-bold" style={{ color: 'var(--accent)' }}>
                {fmtResult(calc.midResult, calc.t)} {calc.t}
              </span>
            </p>
            {calc.isCross && (
              <p className="text-[11.5px] text-[var(--text-tertiary)] mt-2">
                Cross rate = Rate({calc.t}) ÷ Rate({calc.f}) = {fmtRate(calc.midRate)}
                &nbsp;(individual USD-base rates bridged internally)
              </p>
            )}
            {calc.f === 'USD' && (
              <p className="text-[11.5px] text-[var(--text-tertiary)] mt-2">
                Case: USD → any · Rate(FROM) = 1 · simplified to Amount × Rate(TO)
              </p>
            )}
            {calc.t === 'USD' && (
              <p className="text-[11.5px] text-[var(--text-tertiary)] mt-2">
                Case: any → USD · Rate(TO) = 1 · simplified to Amount ÷ Rate(FROM)
              </p>
            )}
          </div>

          {calc.fetchedAt && (
            <p className="text-[11.5px] text-[var(--text-tertiary)]">
              Rates updated: {new Date(calc.fetchedAt).toLocaleString()}
            </p>
          )}

        </ResultPanel>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <CurrencyInfoContent />
    </div>
  );
}

// ─── Shared layout helpers ────────────────────────────────────────────────────
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
function SpreadCostBar() {
  const spreads = [
    { label: 'Online broker (e.g. Wise)', pct: 0.3, color: '#34d399' },
    { label: 'Bank online portal',        pct: 1.0, color: '#60a5fa' },
    { label: 'Bank branch',               pct: 2.5, color: '#fbbf24' },
    { label: 'Airport kiosk',             pct: 5.0, color: '#f97316' },
    { label: 'Hotel / tourist desk',      pct: 8.0, color: '#ef4444' },
  ];
  const amount = 1000, maxCost = 80;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] text-[var(--text-secondary)]">Hidden cost per $1,000 converted — lower is better:</p>
      {spreads.map(s => {
        const cost = (amount * s.pct / 100).toFixed(2);
        return (
          <div key={s.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[12px] text-[var(--text-secondary)]">{s.label}</span>
              <span className="text-[12.5px] font-bold tabular-nums" style={{ color: s.color }}>
                −${cost} <span className="font-normal text-[10.5px] text-[var(--text-tertiary)]">({s.pct}%)</span>
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full" style={{ width: `${(parseFloat(cost) / maxCost) * 100}%`, background: s.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MajorPairsChart() {
  const pairs = [
    { pair: 'EUR/USD', share: 22.7, color: '#60a5fa', flags: '🇪🇺🇺🇸' },
    { pair: 'USD/JPY', share: 17.7, color: '#f97316', flags: '🇺🇸🇯🇵' },
    { pair: 'GBP/USD', share: 12.5, color: '#a78bfa', flags: '🇬🇧🇺🇸' },
    { pair: 'AUD/USD', share: 6.4,  color: '#34d399', flags: '🇦🇺🇺🇸' },
    { pair: 'USD/CAD', share: 5.5,  color: '#fbbf24', flags: '🇺🇸🇨🇦' },
    { pair: 'USD/CHF', share: 5.1,  color: '#f472b6', flags: '🇺🇸🇨🇭' },
    { pair: 'Others',  share: 30.1, color: '#6b7280', flags: '🌐'       },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {pairs.map(p => (
        <div key={p.pair} className="flex items-center gap-3">
          <span className="text-[13px] shrink-0 w-9">{p.flags}</span>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[12px] font-semibold text-[var(--text-secondary)]">{p.pair}</span>
              <span className="text-[12px] font-bold tabular-nums" style={{ color: p.color }}>{p.share}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full" style={{ width: `${(p.share / 22.7) * 100}%`, background: p.color }} />
            </div>
          </div>
        </div>
      ))}
      <p className="text-[10.5px] text-[var(--text-tertiary)]">Source: BIS Triennial Survey 2022 — share of global Forex daily turnover.</p>
    </div>
  );
}

function CurrencyInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="What is a Currency Exchange Rate?">
        <InfoP>
          A currency exchange rate is the price at which one currency can be exchanged for another. It tells
          you how much of one currency you need to buy one unit of another. For example, if the USD/PKR rate
          is 280, you need 280 Pakistani Rupees to purchase 1 US Dollar.
        </InfoP>
        <InfoP>
          Exchange rates change constantly — every second of every business day — driven by supply and demand
          in the global foreign exchange (Forex) market, which is the largest financial market in the world
          with over $7.5 trillion traded daily.
        </InfoP>
      </InfoSection>

      <InfoSection title="How Currency Conversion Works">
        <InfoP>
          All currency conversions use USD (or sometimes EUR) as the universal bridge currency. Every exchange
          rate is stored as "1 USD = X units of Currency." The conversion formula is:
        </InfoP>
        <InfoTable
          headers={['Conversion Case', 'Formula', 'Example']}
          rows={[
            ['USD → Any',      'Amount × Rate(TO)',                   '100 USD × 280 = 28,000 PKR'],
            ['Any → USD',      'Amount ÷ Rate(FROM)',                 '28,000 PKR ÷ 280 = 100 USD'],
            ['Any → Any (cross)', 'Amount × (Rate(TO) ÷ Rate(FROM))', '10,000 PKR × (0.86 ÷ 280) = 30.71 EUR'],
          ]}
        />
        <InfoP>
          The mid-market rate (also called the interbank rate) is the pure mathematical midpoint between
          the buy and sell prices. This is the rate you see on Google or financial data sites. Banks and
          money changers add a spread on top, which is how they make their profit.
        </InfoP>
      </InfoSection>

      <InfoSection title="Understanding the Spread">
        <InfoP>
          The spread is the difference between the rate at which a bank or exchange service buys a currency
          from you and the rate at which it sells it to you. It is how financial institutions earn revenue
          on currency exchanges without charging a visible commission.
        </InfoP>
        <InfoTable
          headers={['Term', 'Definition', 'Example (USD/PKR mid = 280)']}
          rows={[
            ['Mid-market rate', 'The true exchange rate — midpoint between buy and sell', '280.00'],
            ['Buy rate',        'Rate at which bank buys USD from you (you receive less)', '274.40 (−2%)'],
            ['Sell rate',       'Rate at which bank sells USD to you (you pay more)',      '285.60 (+2%)'],
            ['Spread',          'Difference between sell and buy rate',                    '11.20 PKR per USD'],
          ]}
        />
        <InfoP>
          Typical spreads range from 0.1–0.5% for online brokers and major bank online portals, to 2–5%
          at airport kiosks and physical money changers. Always compare total cost including fees, not just
          the advertised rate.
        </InfoP>
        <SpreadCostBar />
      </InfoSection>

      <InfoSection title="What Affects Exchange Rates?">
        <InfoP>
          Exchange rates are determined by a complex interaction of macroeconomic and political factors:
        </InfoP>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Interest Rates', body: 'Central banks set base interest rates. Higher rates attract foreign investment, increasing demand for that currency and pushing its value up.' },
            { title: 'Inflation', body: 'Countries with lower inflation typically see their currency appreciate. High inflation erodes purchasing power and weakens the exchange rate.' },
            { title: 'Trade Balance', body: 'A country that exports more than it imports (trade surplus) sees higher demand for its currency, which strengthens it.' },
            { title: 'Political Stability', body: 'Investors prefer stable countries. Political uncertainty, elections, or conflict cause currency depreciation as capital flees to safe havens.' },
            { title: 'Market Speculation', body: 'Forex traders buy and sell currencies based on expectations of future events. Speculation can move rates significantly in short periods.' },
            { title: 'Government Intervention', body: 'Central banks sometimes buy or sell their own currency to stabilise or adjust its value — known as foreign exchange intervention.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Major Currency Pairs">
        <InfoP>
          The Forex market is dominated by a small number of highly liquid currency pairs known as
          "the majors." These pairs account for over 80% of all Forex trading volume:
        </InfoP>
        <InfoTable
          headers={['Pair', 'Name', 'Approx. Daily Volume', 'Known For']}
          rows={[
            ['EUR/USD', 'Euro / US Dollar',           '$1.1 trillion', 'Most traded pair in the world'],
            ['USD/JPY', 'US Dollar / Japanese Yen',   '$0.9 trillion', 'Risk sentiment barometer; low interest carry trades'],
            ['GBP/USD', 'British Pound / US Dollar',  '$0.6 trillion', '"Cable" — highly volatile around UK economic data'],
            ['USD/CHF', 'US Dollar / Swiss Franc',    '$0.4 trillion', 'Safe-haven pair; rises in global uncertainty'],
            ['AUD/USD', 'Australian Dollar / US Dollar', '$0.3 trillion', 'Commodity-linked; follows iron ore and gold prices'],
            ['USD/CAD', 'US Dollar / Canadian Dollar', '$0.3 trillion', '"Loonie" — heavily influenced by oil prices'],
            ['USD/CNY', 'US Dollar / Chinese Yuan',   '$0.3 trillion', 'Managed float; closely watched by global markets'],
          ]}
        />
      </InfoSection>

      <MajorPairsChart />

      <InfoSection title="Currency Rounding Rules">
        <InfoP>
          Different currencies use different decimal precision due to their face value. Using incorrect
          decimal places can cause significant errors in financial calculations:
        </InfoP>
        <InfoTable
          headers={['Currency Type', 'Decimal Places', 'Examples']}
          rows={[
            ['Major currencies',     '2 decimal places', 'USD ($1.00), EUR (€1.00), GBP (£1.00), CAD, AUD'],
            ['High-value per unit',  '0 decimal places', 'JPY (¥280), KRW (₩1,300), IDR (Rp15,500), VND'],
            ['Crypto — Bitcoin',     '8 decimal places', 'BTC (0.00003571)'],
            ['Crypto — Ethereum',    '6 decimal places', 'ETH (0.000571)'],
            ['Display convention',   '2 decimal places', 'Always shown to 2dp for user-facing displays'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Tips for Getting the Best Exchange Rate">
        <InfoP>
          Where and how you exchange currency significantly affects how much you receive. Follow these
          practical tips to maximise your money:
        </InfoP>
        <InfoTable
          headers={['Tip', 'Why It Matters']}
          rows={[
            ['Use online brokers or fintech apps',   'Services like Wise, Revolut, and OFX typically offer spreads of 0.3–0.5% vs. 3–5% at airport counters.'],
            ['Avoid airport exchange kiosks',         'Airport kiosks are the most expensive option — spreads of 8–15% are common. Exchange before you travel.'],
            ['Check the mid-market rate first',       'Use Google or our calculator to find the true mid-market rate, then compare what the service offers.'],
            ['Watch out for "no commission" claims',  '"No commission" services often compensate with a larger spread. The total rate is what matters, not the fee label.'],
            ['Use a multi-currency travel card',      'Cards like Wise or Revolut convert at or near mid-market rates and avoid foreign transaction fees abroad.'],
            ['Transfer in larger amounts when possible', 'Fixed fees per transfer become proportionally smaller on larger amounts, improving effective rate.'],
            ['Avoid dynamic currency conversion',     'When paying abroad, always choose to pay in the local currency — your bank\'s rate is almost always better than the merchant\'s.'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem
            q="What is the mid-market rate?"
            a="The mid-market rate (also called interbank rate or spot rate) is the real exchange rate — the midpoint between the buy and sell prices in the global Forex market. It's the rate you see on Google Finance or Reuters. No consumer gets this rate directly; it's the benchmark to compare offers against."
          />
          <FaqItem
            q="Why is my bank's rate different from what I see here?"
            a="Banks and exchange services add a spread (markup) to the mid-market rate to make their profit. A 2% spread on a $1,000 transfer means you lose $20 compared to the mid-market rate. Our spread slider lets you simulate exactly this difference."
          />
          <FaqItem
            q="What is a cross rate?"
            a="A cross rate is an exchange rate between two currencies where neither is USD. For example, PKR/EUR is a cross rate. It is calculated by bridging through USD: first convert PKR → USD, then USD → EUR. The formula is: Cross Rate = Rate(TO) ÷ Rate(FROM), where both rates are expressed as 1 USD = X currency."
          />
          <FaqItem
            q="What is the reverse rate?"
            a="The reverse (or inverse) rate is simply 1 divided by the forward rate. If 1 USD = 280 PKR, then 1 PKR = 1 ÷ 280 = 0.003571 USD. Our calculator always shows both directions simultaneously."
          />
          <FaqItem
            q="How often do exchange rates change?"
            a="Forex rates change every second during trading hours. The global Forex market operates 24 hours a day, 5 days a week across different time zones (Sydney → Tokyo → London → New York). Rates are technically 'closed' on weekends, though cryptocurrency markets operate 24/7."
          />
          <FaqItem
            q="What currencies have zero decimal places?"
            a="Currencies with large face-value units use zero decimal places: Japanese Yen (JPY), South Korean Won (KRW), Indonesian Rupiah (IDR), Vietnamese Dong (VND), and Hungarian Forint (HUF). Showing '¥1.50' is incorrect — it should be '¥2'. Our calculator handles this automatically per currency."
          />
          <FaqItem
            q="Is cryptocurrency conversion the same as regular currency conversion?"
            a="The mathematics is identical — the same formula applies. However, cryptocurrency rates are far more volatile (can move 10–20% in a single day), operate 24/7, and have no central bank backing. Crypto rates in this calculator use 6–8 decimal places due to the small unit values relative to USD."
          />
        </div>
      </InfoSection>

    </div>
  );
}
