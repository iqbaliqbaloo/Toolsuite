import React, { useEffect, useMemo, useState } from 'react';
import { parse, stringify } from 'yaml';
import type { Tool } from '../types';

type Props = { tool: Tool; onBack: () => void };
type Field = { key: string; label: string; type?: 'text' | 'number' | 'textarea' | 'select'; placeholder?: string; defaultValue?: string; options?: string[] };

const FIELD_MAP: Record<string, Field[]> = {
  'compound-interest': [
    { key: 'principal', label: 'Initial investment', type: 'number', defaultValue: '10000' },
    { key: 'monthly', label: 'Monthly contribution', type: 'number', defaultValue: '300' },
    { key: 'rate', label: 'Annual return %', type: 'number', defaultValue: '7' },
    { key: 'years', label: 'Years', type: 'number', defaultValue: '20' },
    { key: 'frequency', label: 'Compounds per year', type: 'select', defaultValue: '12', options: ['1', '2', '4', '12', '365'] },
  ],
  'crypto-roi': [
    { key: 'buy', label: 'Buy price per token', type: 'number', defaultValue: '25000' },
    { key: 'sell', label: 'Sell price per token', type: 'number', defaultValue: '32000' },
    { key: 'units', label: 'Units held', type: 'number', defaultValue: '0.25' },
    { key: 'fees', label: 'Total fees', type: 'number', defaultValue: '25' },
  ],
  'mortgage-amortization': [
    { key: 'principal', label: 'Loan amount', type: 'number', defaultValue: '350000' },
    { key: 'rate', label: 'Annual interest %', type: 'number', defaultValue: '6.5' },
    { key: 'years', label: 'Term in years', type: 'number', defaultValue: '30' },
    { key: 'extra', label: 'Extra monthly principal', type: 'number', defaultValue: '0' },
  ],
  'salary-after-tax': [
    { key: 'gross', label: 'Gross annual income', type: 'number', defaultValue: '85000' },
    { key: 'taxRate', label: 'Estimated tax rate %', type: 'number', defaultValue: '24' },
    { key: 'deductions', label: 'Annual deductions', type: 'number', defaultValue: '0' },
    { key: 'country', label: 'Country / region', defaultValue: 'United States' },
  ],
  'freelance-rate': [
    { key: 'income', label: 'Desired annual take-home', type: 'number', defaultValue: '90000' },
    { key: 'expenses', label: 'Annual business expenses', type: 'number', defaultValue: '12000' },
    { key: 'weeks', label: 'Working weeks per year', type: 'number', defaultValue: '46' },
    { key: 'hours', label: 'Hours per week', type: 'number', defaultValue: '40' },
    { key: 'billable', label: 'Billable percentage', type: 'number', defaultValue: '65' },
  ],
  'investment-return': [
    { key: 'initial', label: 'Initial amount', type: 'number', defaultValue: '10000' },
    { key: 'final', label: 'Final amount', type: 'number', defaultValue: '14500' },
    { key: 'years', label: 'Holding period in years', type: 'number', defaultValue: '3' },
    { key: 'fees', label: 'Fees and costs', type: 'number', defaultValue: '100' },
  ],
  'percentage-calc': [
    { key: 'a', label: 'Value A', type: 'number', defaultValue: '120' },
    { key: 'b', label: 'Value B', type: 'number', defaultValue: '150' },
  ],
  'sitemap-generator': [
    { key: 'urls', label: 'Absolute URLs, one per line', type: 'textarea', defaultValue: 'https://example.com/\nhttps://example.com/about\nhttps://example.com/contact' },
  ],
  'htaccess-generator': [
    { key: 'from', label: 'Old path', defaultValue: '/old-page' },
    { key: 'to', label: 'New absolute URL', defaultValue: 'https://example.com/new-page' },
    { key: 'permanent', label: 'Redirect type', type: 'select', defaultValue: '301', options: ['301', '302'] },
  ],
  'robots-generator': [
    { key: 'agent', label: 'User-agent', defaultValue: '*' },
    { key: 'disallow', label: 'Disallow paths, one per line', type: 'textarea', defaultValue: '/admin/\n/private/' },
    { key: 'allow', label: 'Allow paths, one per line', type: 'textarea', defaultValue: '/' },
    { key: 'sitemap', label: 'Sitemap URL', defaultValue: 'https://example.com/sitemap.xml' },
  ],
  'domain-age': [{ key: 'domain', label: 'Domain name', defaultValue: 'example.com' }],
  'social-share': [
    { key: 'url', label: 'Page URL', defaultValue: 'https://example.com/article' },
    { key: 'title', label: 'Share title', defaultValue: 'A useful article' },
  ],
  'json-csv': [{ key: 'json', label: 'JSON array or object', type: 'textarea', defaultValue: '[{"name":"Ada","role":"Engineer"},{"name":"Lin","role":"Designer"}]' }],
  'regex-cheat': [
    { key: 'pattern', label: 'Regular expression', defaultValue: '\\b[A-Z][a-z]+\\b' },
    { key: 'flags', label: 'Flags', defaultValue: 'g' },
    { key: 'sample', label: 'Test text', type: 'textarea', defaultValue: 'Ada Lovelace built an Analytical Engine concept.' },
  ],
  'sql-formatter': [{ key: 'sql', label: 'SQL query', type: 'textarea', defaultValue: 'select id,name from users where active = 1 order by created_at desc limit 20;' }],
  'yaml-validator': [{ key: 'yaml', label: 'YAML document', type: 'textarea', defaultValue: 'name: ToolSuite\nversion: 1\nfeatures:\n  - calculators\n  - generators' }],
  'crontab-generator': [
    { key: 'minute', label: 'Minute', defaultValue: '0' },
    { key: 'hour', label: 'Hour', defaultValue: '9' },
    { key: 'day', label: 'Day of month', defaultValue: '*' },
    { key: 'month', label: 'Month', defaultValue: '*' },
    { key: 'weekday', label: 'Day of week', defaultValue: '1-5' },
  ],
  'timezone-converter': [
    { key: 'date', label: 'Date and time', type: 'text', defaultValue: '2026-08-17T09:00' },
    { key: 'fromZone', label: 'From timezone', defaultValue: 'America/New_York' },
    { key: 'toZone', label: 'To timezone', defaultValue: 'Asia/Dhaka' },
  ],
  'svg-png': [{ key: 'svg', label: 'SVG markup', type: 'textarea', defaultValue: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" rx="32" fill="#e96758"/><text x="50%" y="55%" text-anchor="middle" font-size="48" fill="white">ToolSuite</text></svg>' }],
  'flexbox-generator': [
    { key: 'direction', label: 'Direction', type: 'select', defaultValue: 'row', options: ['row', 'column'] },
    { key: 'justify', label: 'Justify content', type: 'select', defaultValue: 'space-between', options: ['flex-start', 'center', 'space-between', 'space-around', 'space-evenly'] },
    { key: 'align', label: 'Align items', type: 'select', defaultValue: 'center', options: ['stretch', 'flex-start', 'center', 'flex-end'] },
    { key: 'gap', label: 'Gap', type: 'number', defaultValue: '16' },
  ],
  'utm-builder': [
    { key: 'url', label: 'Destination URL', defaultValue: 'https://example.com/landing' },
    { key: 'source', label: 'utm_source', defaultValue: 'newsletter' },
    { key: 'medium', label: 'utm_medium', defaultValue: 'email' },
    { key: 'campaign', label: 'utm_campaign', defaultValue: 'summer-launch' },
    { key: 'content', label: 'utm_content', defaultValue: 'hero-button' },
  ],
  'subnet-calc': [{ key: 'cidr', label: 'IPv4 CIDR', defaultValue: '192.168.10.0/24' }],
};

const money = (n: number) => Number.isFinite(n) ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n) : '—';
const num = (v: string) => Number(v || 0);
const ensure = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };
const lines = (v: string) => v.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

function csvFromJson(value: unknown) {
  const rows = Array.isArray(value) ? value : [value];
  const keys = Array.from(new Set(rows.flatMap(r => r && typeof r === 'object' ? Object.keys(r as object) : [])));
  const escape = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  return [keys.map(escape).join(','), ...rows.map(r => keys.map(k => escape(r && typeof r === 'object' ? (r as Record<string, unknown>)[k] : '')).join(','))].join('\n');
}

export function calculate(id: string, v: Record<string, string>): { title: string; body: string; download?: { name: string; content: string; type?: string; href?: string } } {
  if (id === 'compound-interest') {
    const p = num(v.principal), monthly = num(v.monthly), years = num(v.years), rate = num(v.rate) / 100, n = num(v.frequency);
    ensure([p, monthly, years, rate, n].every(Number.isFinite) && p >= 0 && monthly >= 0 && years > 0 && rate >= 0 && n > 0, 'Use non-negative amounts, a positive term, and a valid compounding frequency.');
    const periods = years * n; const contribution = monthly * 12 / n;
    const future = p * Math.pow(1 + rate / n, periods) + contribution * ((Math.pow(1 + rate / n, periods) - 1) / (rate / n || 1));
    return { title: 'Projected future value', body: `Estimated balance: ${money(future)}\nTotal contributions: ${money(p + monthly * 12 * years)}\nEstimated growth: ${money(future - p - monthly * 12 * years)}\n\nThis is an illustration, not a promise of returns.` };
  }
  if (id === 'crypto-roi') { ensure(num(v.buy) >= 0 && num(v.sell) >= 0 && num(v.units) >= 0 && num(v.fees) >= 0, 'Prices, units, and fees cannot be negative.'); const cost = num(v.buy) * num(v.units), proceeds = num(v.sell) * num(v.units), profit = proceeds - cost - num(v.fees); return { title: 'Crypto position result', body: `Cost basis: ${money(cost)}\nNet proceeds: ${money(proceeds - num(v.fees))}\nProfit / loss: ${money(profit)}\nROI: ${cost ? ((profit / cost) * 100).toFixed(2) : '0.00'}%\n\nUses your supplied prices only; crypto prices are volatile.` }; }
  if (id === 'mortgage-amortization') { const p=num(v.principal), r=num(v.rate)/100/12, n=num(v.years)*12, extra=num(v.extra); ensure(p > 0 && r >= 0 && n > 0 && extra >= 0, 'Loan amount and term must be positive; rate and extra payment cannot be negative.'); const payment=r ? p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : p/n, total=(payment+extra)*n; return { title: 'Mortgage estimate', body: `Principal + interest payment: ${money(payment)} / month\nWith extra payment: ${money(payment+extra)} / month\nEstimated scheduled interest: ${money(payment*n-p)}\nIllustrated total with extra payment: ${money(total)}\n\nExcludes property tax, insurance, fees, and adjustable-rate changes.` }; }
  if (id === 'salary-after-tax') { const gross=num(v.gross), deductions=num(v.deductions), taxRate=num(v.taxRate); ensure(gross >= 0 && deductions >= 0 && taxRate >= 0 && taxRate <= 100, 'Income, deductions, and tax rate must be valid non-negative values; tax rate must be 0–100%.'); const taxable=Math.max(0,gross-deductions), tax=taxable*taxRate/100, net=gross-tax; return { title: 'Estimated take-home pay', body: `Estimated annual net: ${money(net)}\nEstimated monthly net: ${money(net/12)}\nEstimated tax: ${money(tax)}\nRegion used for labeling: ${v.country || 'Not specified'}\n\nThis simplified estimate is not tax advice and does not model every local rule, credit, or payroll deduction.` }; }
  if (id === 'freelance-rate') { const income=num(v.income), expenses=num(v.expenses), weeks=num(v.weeks), hours=num(v.hours), billable=num(v.billable); ensure(income >= 0 && expenses >= 0 && weeks > 0 && hours > 0 && billable > 0 && billable <= 100, 'Income and expenses cannot be negative; time and billable percentage must be valid.'); const annual=income+expenses, billableHours=weeks*hours*(billable/100); return { title: 'Sustainable hourly rate', body: `Suggested minimum rate: ${money(billableHours ? annual/billableHours : 0)} / hour\nBillable hours modeled: ${billableHours.toFixed(0)}\nAnnual target incl. expenses: ${money(annual)}\n\nAdjust for taxes, benefits, unpaid sales time, and business risk.` }; }
  if (id === 'investment-return') { ensure(num(v.initial) > 0 && num(v.final) >= 0 && num(v.years) > 0 && num(v.fees) >= 0, 'Initial amount and holding period must be positive; final amount and fees cannot be negative.'); const profit=num(v.final)-num(v.initial)-num(v.fees), roi=num(v.initial)?profit/num(v.initial)*100:0, cagr=num(v.initial)>0&&num(v.years)>0?(Math.pow(num(v.final)/num(v.initial),1/num(v.years))-1)*100:0; return { title: 'Investment return', body: `Profit / loss after fees: ${money(profit)}\nROI: ${roi.toFixed(2)}%\nAnnualized return (CAGR): ${cagr.toFixed(2)}%\n\nThis compares your supplied start and end values; it is not investment advice.` }; }
  if (id === 'percentage-calc') { const a=num(v.a), b=num(v.b); return { title: 'Percentage comparison', body: `${b} is ${a ? (b/a*100).toFixed(2) : '0.00'}% of ${a}.\nChange from A to B: ${a ? ((b-a)/a*100).toFixed(2) : '0.00'}%\nDifference: ${(b-a).toFixed(2)}` }; }
  if (id === 'sitemap-generator') { const urls=lines(v.urls).filter(u=>/^https?:\/\//i.test(u)); const xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',...urls.map(u=>`  <url><loc>${u.replaceAll('&','&amp;')}</loc></url>`),'</urlset>'].join('\n'); return { title: `${urls.length} URLs generated`, body: xml, download: { name:'sitemap.xml', content:xml, type:'application/xml' } }; }
  if (id === 'htaccess-generator') { const body=`Redirect ${v.permanent || '301'} ${v.from || '/old-path'} ${v.to || 'https://example.com/new-path'}`; return { title: 'Apache redirect rule', body, download:{name:'.htaccess',content:body,text:'text/plain'} as any }; }
  if (id === 'robots-generator') { const body=[`User-agent: ${v.agent || '*'}`, ...lines(v.disallow).map(x=>`Disallow: ${x}`), ...lines(v.allow).map(x=>`Allow: ${x}`), v.sitemap ? `Sitemap: ${v.sitemap}` : ''].filter(Boolean).join('\n'); return { title: 'robots.txt output', body, download:{name:'robots.txt',content:body} }; }
  if (id === 'social-share') { const u=encodeURIComponent(v.url), t=encodeURIComponent(v.title); return { title:'Share links', body:`Facebook: https://www.facebook.com/sharer/sharer.php?u=${u}\nX: https://twitter.com/intent/tweet?url=${u}&text=${t}\nLinkedIn: https://www.linkedin.com/sharing/share-offsite/?url=${u}` }; }
  if (id === 'json-csv') { try { const csv=csvFromJson(JSON.parse(v.json)); return { title:'CSV output', body:csv, download:{name:'converted.csv',content:csv,text:'text/csv'} as any }; } catch { throw new Error('Enter valid JSON. Use an object or an array of objects.'); } }
  if (id === 'regex-cheat') { try { const re=new RegExp(v.pattern, v.flags); const matches=Array.from(v.sample.matchAll(re)).map(m=>m[0]); return { title:`${matches.length} match${matches.length===1?'':'es'}`, body:`Matches:\n${matches.join('\n') || 'No matches'}\n\nCommon patterns:\n\\d+  numbers\n\\w+  word characters\n^...$  full-string match\n(...) capture group` }; } catch { throw new Error('Invalid regular expression or flags.'); } }
  if (id === 'sql-formatter') { const sql=v.sql.trim().replace(/\s+/g,' '); const formatted=sql.replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|VALUES|SET|INNER JOIN|LEFT JOIN|RIGHT JOIN|JOIN|ON|AND|OR)\b/gi,'\n$1').replace(/^\n/,'').replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|VALUES|SET|INNER JOIN|LEFT JOIN|RIGHT JOIN|JOIN|ON|AND|OR)\b/gi,m=>m.toUpperCase()); return { title:'Formatted SQL', body:formatted }; }
  if (id === 'yaml-validator') { try { const parsed=parse(v.yaml, { stringKeys: true }); const normalized=stringify(parsed); return { title:'Valid YAML', body:`Parsed successfully.\n\nNormalized YAML:\n${normalized}` }; } catch (error) { const message=error instanceof Error ? error.message : 'Unknown YAML parse error'; throw new Error(`YAML parse error: ${message}`, { cause: error }); } }
  if (id === 'crontab-generator') { const cron=`${v.minute||'*'} ${v.hour||'*'} ${v.day||'*'} ${v.month||'*'} ${v.weekday||'*'}`; return { title:'Crontab expression', body:`${cron}\n\nFields: minute hour day-of-month month day-of-week\nSchedule: runs at ${v.hour||'*'}:${v.minute||'00'} on ${v.weekday==='1-5'?'weekdays':'the configured schedule'}.` }; }
  if (id === 'timezone-converter') { const d=new Date(v.date); if(Number.isNaN(d.getTime())) throw new Error('Enter a valid date and time.'); const fmt=(zone:string)=>new Intl.DateTimeFormat(undefined,{dateStyle:'full',timeStyle:'long',timeZone:zone}).format(d); return { title:'Converted time', body:`${v.fromZone}: ${fmt(v.fromZone)}\n${v.toZone}: ${fmt(v.toZone)}` }; }
  if (id === 'flexbox-generator') { const css=`.flex-container {\n  display: flex;\n  flex-direction: ${v.direction};\n  justify-content: ${v.justify};\n  align-items: ${v.align};\n  gap: ${num(v.gap)}px;\n}`; return { title:'CSS Flexbox output', body:css }; }
  if (id === 'utm-builder') { try { const u=new URL(v.url); [['utm_source',v.source],['utm_medium',v.medium],['utm_campaign',v.campaign],['utm_content',v.content]].forEach(([k,val])=>{if(val)u.searchParams.set(k as string,val as string)}); return { title:'Campaign URL', body:u.toString() }; } catch { throw new Error('Enter a valid absolute destination URL.'); } }
  if (id === 'subnet-calc') { const [ip,prefixText]=v.cidr.split('/'); const prefix=Number(prefixText); const oct=ip?.split('.').map(Number); if(oct?.length!==4||oct.some(n=>n<0||n>255)||prefix<0||prefix>32) throw new Error('Use a valid IPv4 CIDR such as 192.168.10.0/24.'); const ipNum=oct.reduce((a,n)=>(a<<8)+n,0)>>>0; const mask=prefix===0?0:(0xffffffff << (32-prefix))>>>0; const net=(ipNum&mask)>>>0; const broadcast=(net|(~mask>>>0))>>>0; const fmt=(n:number)=>[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join('.'); const total=2**(32-prefix); return { title:'Subnet details', body:`Network: ${fmt(net)}\nBroadcast: ${fmt(broadcast)}\nFirst address: ${fmt(net + (total>1?1:0))}\nLast address: ${fmt(broadcast - (total>1?1:0))}\nTotal addresses: ${total}\nUsable hosts: ${total>2?total-2:Math.max(total,0)}\nPrefix length: /${prefix}` }; }
  return { title: 'Ready', body: 'This tool is ready for input.' };
}

async function calculateAsync(id: string, v: Record<string, string>) {
  if (id === 'domain-age') {
    const domain = (v.domain || '').trim().replace(/^https?:\/\//, '').split('/')[0];
    if (!domain || !domain.includes('.')) throw new Error('Enter a valid domain such as example.com.');
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, { headers: { Accept: 'application/rdap+json, application/json' } });
    if (!response.ok) throw new Error(`RDAP lookup unavailable (${response.status}). Try again or use a different domain.`);
    const data = await response.json() as { events?: Array<{ eventAction?: string; eventDate?: string }>; ldhName?: string; status?: string[] };
    const registration = data.events?.find(e => e.eventAction === 'registration')?.eventDate;
    const age = registration ? ((Date.now() - new Date(registration).getTime()) / (365.2425 * 24 * 3600 * 1000)).toFixed(1) : null;
    return { title: `RDAP result for ${data.ldhName || domain}`, body: `Registration date: ${registration ? new Date(registration).toLocaleDateString() : 'Not published'}\nEstimated domain age: ${age ? `${age} years` : 'Unavailable'}\nStatus: ${data.status?.join(', ') || 'Not published'}\n\nThis is public registry metadata, not a third-party SEO authority score.` };
  }
  if (id === 'svg-png') {
    const svg = v.svg?.trim();
    if (!svg?.startsWith('<svg')) throw new Error('Paste valid SVG markup beginning with <svg.');
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    try {
      const image = new Image();
      image.decoding = 'async';
      image.src = url;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || 1200;
      canvas.height = image.naturalHeight || 800;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas export is unavailable in this browser.');
      context.drawImage(image, 0, 0);
      const png = canvas.toDataURL('image/png');
      return { title: 'PNG export ready', body: `Rendered ${canvas.width} × ${canvas.height} px locally in your browser.`, download: { name: 'converted.svg.png', content: '', href: png, type: 'image/png' } };
    } finally { URL.revokeObjectURL(url); }
  }
  return calculate(id, v);
}

export default function UniversalToolWorkbench({ tool }: Props) {
  const fields = FIELD_MAP[tool.id] || [];
  const initial = useMemo(() => Object.fromEntries(fields.map(f => [f.key, f.defaultValue || ''])), [tool.id]);
  const [values, setValues] = useState<Record<string,string>>(initial);
  useEffect(() => { setValues(initial); setResult(null); setError(''); setFeedback(null); }, [initial]);
  const [result, setResult] = useState<{ title:string; body:string; download?: { name:string; content:string; type?:string; href?:string } } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<'yes'|'no'|null>(null);
  const run = async () => { setBusy(true); setError(''); setResult(null); try { const out=await calculateAsync(tool.id, values); setResult(out); } catch (e) { setError(e instanceof Error ? e.message : 'Could not process this input.'); } finally { setBusy(false); } };
  const download = () => { if (!result?.download) return; const url=result.download.href || URL.createObjectURL(new Blob([result.download.content],{type:result.download.type||'text/plain'})); const a=document.createElement('a'); a.href=url; a.download=result.download.name; a.click(); if (!result.download.href) URL.revokeObjectURL(url); };
  return <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[var(--shadow-md)]">
      <div className="mb-5 rounded-xl bg-[var(--accent-tint)] p-4"><h2 className="text-lg font-bold text-[var(--text-primary)]">What it does</h2><p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{tool.description}</p><p className="mt-2 text-xs leading-5 text-[var(--text-tertiary)]">Use it when you need a quick, transparent result without installing another app.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">{fields.map(f => <label key={f.key} className={f.type==='textarea'?'sm:col-span-2':''}><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[var(--text-secondary)]">{f.label}</span>{f.type==='textarea' ? <textarea value={values[f.key]||''} onChange={e=>setValues({...values,[f.key]:e.target.value})} rows={6} className="min-h-32 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] outline-none" placeholder={f.placeholder}/> : f.type==='select' ? <select value={values[f.key]||''} onChange={e=>setValues({...values,[f.key]:e.target.value})} className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)]">{f.options?.map(o=><option key={o} value={o}>{o}</option>)}</select> : <input type={f.type==='number'?'number':'text'} value={values[f.key]||''} onChange={e=>setValues({...values,[f.key]:e.target.value})} className="h-11 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] outline-none"/>}</label>)}</div>
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={run} disabled={busy} className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_var(--accent-soft)]">{busy?'Working…':'Run tool'}</button><button type="button" onClick={()=>{setValues(initial);setResult(null);setError('')}} className="rounded-xl border border-[var(--border-strong)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)]">Reset</button></div>
      {error && <div role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    </section>
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] p-5 sm:p-6 shadow-[var(--shadow-md)]"><div className="flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-[var(--text-tertiary)]">Output</div><h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{result?.title || 'Your result will appear here'}</h2></div>{result?.download && <button type="button" onClick={download} className="rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-bold text-white">Download</button>}</div><pre className="mt-5 min-h-56 whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 font-mono text-xs leading-6 text-[var(--text-secondary)]">{result?.body || 'Add your inputs, then run the tool. We keep the calculation transparent so you can check every assumption.'}</pre><div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4"><span className="text-xs text-[var(--text-tertiary)]">Was this useful?</span><div className="flex gap-2"><button type="button" aria-label="Useful" onClick={()=>setFeedback('yes')} className={`rounded-lg border px-3 py-1.5 text-xs ${feedback==='yes'?'border-green-400 bg-green-50 text-green-700':'border-[var(--border-strong)] text-[var(--text-secondary)]'}`}>Yes</button><button type="button" aria-label="Not useful" onClick={()=>setFeedback('no')} className={`rounded-lg border px-3 py-1.5 text-xs ${feedback==='no'?'border-red-300 bg-red-50 text-red-700':'border-[var(--border-strong)] text-[var(--text-secondary)]'}`}>Needs work</button></div></div></aside>
  </div>;
}
