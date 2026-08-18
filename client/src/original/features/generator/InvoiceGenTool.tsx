// @ts-nocheck
import React, { useState, useRef, useCallback, useMemo, useLayoutEffect, useEffect } from 'react';

// ─── Business Templates ───────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'standard',
    label: 'Standard Business',
    icon: '🏢',
    title: 'INVOICE',
    rateLabel: 'Unit Price',
    taxLabel: 'Tax',
    showHsn: false, showItemDisc: true, showPayMode: true,
    showBank: true, showSignatory: true, showTerms: true, showShipTo: true,
    showRefInv: false, showPatient: false, showSite: false,
    defaultTerms: 'Payment is due within 30 days of invoice date.\nLate payments may attract interest at 1.5% per month.',
    defaultNotes: 'Thank you for your business!',
  },
  {
    id: 'tax',
    label: 'Tax / GST Invoice',
    icon: '🧾',
    title: 'TAX INVOICE',
    rateLabel: 'Rate',
    taxLabel: 'GST / VAT',
    showHsn: true, showItemDisc: true, showPayMode: true,
    showBank: true, showSignatory: true, showTerms: true, showShipTo: true,
    showRefInv: false, showPatient: false, showSite: false,
    defaultTerms: 'E. & O.E. Goods once sold will not be taken back.\nPayment due within 30 days of invoice date.',
    defaultNotes: 'Subject to local jurisdiction.',
  },
  {
    id: 'freelance',
    label: 'Freelance / Service',
    icon: '💼',
    title: 'SERVICE INVOICE',
    rateLabel: 'Rate',
    taxLabel: 'Tax',
    showHsn: false, showItemDisc: false, showPayMode: true,
    showBank: true, showSignatory: false, showTerms: true, showShipTo: false,
    showRefInv: false, showPatient: false, showSite: false,
    defaultTerms: 'Payment due within 14 days. Late payments subject to 1.5% monthly interest.\nWork ownership transfers upon full payment.',
    defaultNotes: 'Thank you for choosing our services!',
  },
  {
    id: 'proforma',
    label: 'Proforma / Quotation',
    icon: '📋',
    title: 'PROFORMA INVOICE',
    rateLabel: 'Unit Price',
    taxLabel: 'Tax',
    showHsn: false, showItemDisc: true, showPayMode: false,
    showBank: false, showSignatory: true, showTerms: true, showShipTo: true,
    showRefInv: false, showPatient: false, showSite: false,
    defaultTerms: 'This is a proforma invoice and does not constitute a demand for payment.\nQuotation is valid for 30 days from the date of issue.',
    defaultNotes: 'Prices are subject to change. Final invoice will be issued after delivery.',
  },
  {
    id: 'medical',
    label: 'Medical / Clinic',
    icon: '🏥',
    title: 'MEDICAL INVOICE',
    rateLabel: 'Charges',
    taxLabel: 'Tax',
    showHsn: false, showItemDisc: false, showPayMode: true,
    showBank: true, showSignatory: true, showTerms: true, showShipTo: false,
    showRefInv: false, showPatient: true, showSite: false,
    defaultTerms: 'Payment is due at the time of service.\nInsurance claims are the responsibility of the patient.',
    defaultNotes: 'Get well soon. Please keep this receipt for insurance purposes.',
  },
  {
    id: 'construction',
    label: 'Construction / Contractor',
    icon: '🔨',
    title: 'CONTRACTOR INVOICE',
    rateLabel: 'Rate',
    taxLabel: 'Tax',
    showHsn: false, showItemDisc: false, showPayMode: true,
    showBank: true, showSignatory: true, showTerms: true, showShipTo: false,
    showRefInv: false, showPatient: false, showSite: true,
    defaultTerms: 'Payment within 14 days of completion.\nVariations to scope must be agreed in writing.\nRetention: 5% until practical completion.',
    defaultNotes: 'All work performed in accordance with agreed specifications.',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const CURRENCIES = [
  { code:'USD', sym:'$',    name:'US Dollar'          },
  { code:'EUR', sym:'€',    name:'Euro'               },
  { code:'GBP', sym:'£',    name:'British Pound'      },
  { code:'CAD', sym:'C$',   name:'Canadian Dollar'    },
  { code:'AUD', sym:'A$',   name:'Australian Dollar'  },
  { code:'JPY', sym:'¥',    name:'Japanese Yen'       },
  { code:'CNY', sym:'¥',    name:'Chinese Yuan'       },
  { code:'INR', sym:'₹',    name:'Indian Rupee'       },
  { code:'PKR', sym:'₨',    name:'Pakistani Rupee'    },
  { code:'AED', sym:'د.إ',  name:'UAE Dirham'         },
  { code:'SAR', sym:'﷼',   name:'Saudi Riyal'        },
  { code:'CHF', sym:'Fr',   name:'Swiss Franc'        },
  { code:'SGD', sym:'S$',   name:'Singapore Dollar'   },
  { code:'MYR', sym:'RM',   name:'Malaysian Ringgit'  },
  { code:'BRL', sym:'R$',   name:'Brazilian Real'     },
  { code:'ZAR', sym:'R',    name:'South African Rand' },
  { code:'NGN', sym:'₦',    name:'Nigerian Naira'     },
  { code:'TRY', sym:'₺',    name:'Turkish Lira'       },
  { code:'MXN', sym:'Mex$', name:'Mexican Peso'       },
  { code:'KRW', sym:'₩',    name:'Korean Won'         },
];

const THEMES = [
  { name:'Blue',    accent:'#1d4ed8', light:'#eff6ff', text:'#1e3a8a' },
  { name:'Emerald', accent:'#059669', light:'#ecfdf5', text:'#064e3b' },
  { name:'Violet',  accent:'#7c3aed', light:'#f5f3ff', text:'#4c1d95' },
  { name:'Rose',    accent:'#e11d48', light:'#fff1f2', text:'#881337' },
  { name:'Slate',   accent:'#374151', light:'#f8fafc', text:'#1e293b' },
];

const PAYMENT_MODES = ['Bank Transfer','Cash','Cheque','UPI / Mobile Pay','Credit Card','Online Payment','Other'];

// ─── Utilities ────────────────────────────────────────────────────────────────
const localToday = () => new Date().toLocaleDateString('en-CA');
function addDays(n) { const d = new Date(); d.setDate(d.getDate()+n); return d.toLocaleDateString('en-CA'); }
function fmtDate(s) {
  if (!s) return '';
  const [y,m,d] = s.split('-').map(Number);
  return new Date(y,m-1,d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}
const fmtM = (n, sym) => sym + Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
function fileToBase64(file) {
  return new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(file); });
}

// ─── Shared UI styles ─────────────────────────────────────────────────────────
const INP = 'h-9 px-3 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors';
const TA  = 'px-3 py-2 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors resize-none';
const SEC = 'rounded-xl border border-[var(--border)] p-3 flex flex-col gap-2';
const SH  = 'text-[11px] font-bold uppercase tracking-wide text-[var(--text-tertiary)]';
const LB  = 'text-[10.5px] text-[var(--text-tertiary)] mb-0.5 block';

// ─── A4 dimensions ───────────────────────────────────────────────────────────
const A4W = 595;
const A4H = 842;

// ─────────────────────────────────────────────────────────────────────────────
export default function InvoiceGenTool() {
  const outerRef   = useRef(null); // captured by html2canvas (595×842 clipped)
  const innerRef   = useRef(null); // measured for auto-scale
  const logoInput  = useRef(null);
  const [scale,       setScale]      = useState(1);
  const [downloading, setDownloading]= useState(false);
  const [fitPct,      setFitPct]     = useState(100);

  // ── Template / Theme / Currency ─────────────────────────────────────────────
  const [tplId,    setTplId]    = useState('standard');
  const [themeIdx, setThemeIdx] = useState(0);
  const [cur,      setCur]      = useState('USD');
  const tpl    = TEMPLATES.find(t => t.id === tplId) || TEMPLATES[0];
  const curObj = CURRENCIES.find(c => c.code === cur) || CURRENCIES[0];
  const sym    = curObj.sym;
  const th     = THEMES[themeIdx];

  // ── Logo ────────────────────────────────────────────────────────────────────
  const [logo, setLogo] = useState(null);
  const handleLogo = async e => { const f = e.target.files?.[0]; if (f) setLogo(await fileToBase64(f)); };

  // ── Seller ──────────────────────────────────────────────────────────────────
  const [fromName,    setFromName]    = useState('Your Business Name');
  const [fromAddress, setFromAddress] = useState('123 Business Street\nCity, State 10001');
  const [fromEmail,   setFromEmail]   = useState('billing@yourbusiness.com');
  const [fromPhone,   setFromPhone]   = useState('+1 (555) 000-0000');
  const [fromTaxId,   setFromTaxId]   = useState('');

  // ── Client ──────────────────────────────────────────────────────────────────
  const [toName,    setToName]    = useState('');
  const [toAddress, setToAddress] = useState('');
  const [toEmail,   setToEmail]   = useState('');
  const [toPhone,   setToPhone]   = useState('');
  const [toTaxId,   setToTaxId]   = useState('');

  // ── Ship To ─────────────────────────────────────────────────────────────────
  const [shipOn,      setShipOn]      = useState(false);
  const [shipName,    setShipName]    = useState('');
  const [shipAddress, setShipAddress] = useState('');

  // ── Template-specific extra fields ──────────────────────────────────────────
  const [patientId,  setPatientId]  = useState(''); // medical
  const [doctorName, setDoctorName] = useState(''); // medical
  const [siteAddr,   setSiteAddr]   = useState(''); // construction
  const [contractNo, setContractNo] = useState(''); // construction

  // ── Invoice meta ────────────────────────────────────────────────────────────
  const [invNum,  setInvNum]  = useState('INV-001');
  const [invDate, setInvDate] = useState(localToday());
  const [dueDate, setDueDate] = useState(addDays(30));
  const [payMode, setPayMode] = useState('Bank Transfer');

  // ── Items ───────────────────────────────────────────────────────────────────
  const [items, setItems] = useState([{ id:1, desc:'Professional Services', hsn:'', qty:1, price:500, disc:0 }]);
  const nextId = useRef(2);
  const addItem    = () => setItems(p => [...p, { id:nextId.current++, desc:'', hsn:'', qty:1, price:0, disc:0 }]);
  const removeItem = id => setItems(p => p.filter(i => i.id !== id));
  const setItem    = (id,k,v) => setItems(p => p.map(i => i.id===id ? {...i,[k]:v} : i));

  // ── Totals ──────────────────────────────────────────────────────────────────
  const [taxRate,  setTaxRate]  = useState('');
  const [discount, setDiscount] = useState('');

  // ── Footer ──────────────────────────────────────────────────────────────────
  const [bankInfo,  setBankInfo]  = useState('');
  const [terms,     setTerms]     = useState(tpl.defaultTerms);
  const [notes,     setNotes]     = useState(tpl.defaultNotes);
  const [signatory, setSignatory] = useState('');

  // When template changes, reset terms/notes to new template defaults
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    setTerms(tpl.defaultTerms);
    setNotes(tpl.defaultNotes);
  }, [tplId]);

  // ── Computed rows ────────────────────────────────────────────────────────────
  const itemRows = useMemo(() => items.map(i => {
    const gross   = (Number(i.qty)||0) * (Number(i.price)||0);
    const discAmt = gross * (Math.min(Number(i.disc)||0, 100) / 100);
    return { ...i, gross, discAmt, net: gross - discAmt };
  }), [items]);

  const subtotal   = useMemo(() => itemRows.reduce((s,i) => s + i.net, 0), [itemRows]);
  const taxAmt     = useMemo(() => subtotal * (parseFloat(taxRate)||0) / 100, [subtotal, taxRate]);
  const discAmt    = useMemo(() => Math.min(subtotal + taxAmt, parseFloat(discount)||0), [subtotal, taxAmt, discount]);
  const total      = useMemo(() => Math.max(0, subtotal + taxAmt - discAmt), [subtotal, taxAmt, discAmt]);
  const showHsn    = tpl.showHsn;
  const showDisc   = tpl.showItemDisc && itemRows.some(i => (Number(i.disc)||0) > 0);

  // ── Auto-scale: measure inner height every render, scale to fit A4 ──────────
  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const h = innerRef.current.scrollHeight;
    if (h <= 0) return;
    const needed = Math.min(1, A4H / h);
    const pct    = Math.round(needed * 100);
    setScale(prev  => Math.abs(prev  - needed) > 0.005 ? needed : prev);
    setFitPct(prev => prev === pct ? prev : pct);
  });

  // ── Build shared invoice data object ─────────────────────────────────────────
  const inv = {
    tpl, th, sym, cur, curObj, logo, invNum, invDate, dueDate, payMode,
    fromName, fromAddress, fromEmail, fromPhone, fromTaxId,
    toName, toAddress, toEmail, toPhone, toTaxId,
    shipOn, shipName, shipAddress,
    patientId, doctorName, siteAddr, contractNo,
    itemRows, showHsn, showDisc,
    subtotal, taxAmt, taxRate, discAmt, discount, total,
    bankInfo, terms, notes, signatory,
    scale, // for print scaling
  };

  // ── PDF download ─────────────────────────────────────────────────────────────
  const handleDownloadPdf = useCallback(async () => {
    if (!outerRef.current || downloading) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'), import('jspdf'),
      ]);
      const canvas = await html2canvas(outerRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false,
        width: A4W, height: A4H,
      });
      const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H);
      pdf.save(`${invNum||'invoice'}.pdf`);
    } catch { alert('PDF generation failed. Please try again.'); }
    finally { setDownloading(false); }
  }, [outerRef, downloading, invNum]);

  // ── Print ────────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(buildPrintHtml(inv));
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
    <div className="flex flex-col xl:flex-row gap-5 items-start">

      {/* ══ FORM (left) ════════════════════════════════════════════════════════ */}
      <div className="w-full xl:w-[355px] shrink-0 flex flex-col gap-3">

        {/* Business Template selector */}
        <div className={SEC}>
          <p className={SH}>Invoice Type / Business Category</p>
          <div className="grid grid-cols-2 gap-1.5">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTplId(t.id)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[12px] font-medium border transition-all text-left ${tplId===t.id ? 'text-white border-transparent' : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)]'}`}
                style={tplId===t.id ? { background: th.accent } : {}}>
                <span>{t.icon}</span><span className="leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme + Currency + Logo */}
        <div className={SEC}>
          <p className={SH}>Appearance</p>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[130px]">
              <label className={LB}>Currency</label>
              <select value={cur} onChange={e => setCur(e.target.value)} className={INP + ' cursor-pointer'}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} – {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={LB}>Theme</label>
              <div className="flex gap-1.5 mt-1">
                {THEMES.map((t,i) => (
                  <button key={t.name} title={t.name} onClick={() => setThemeIdx(i)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${themeIdx===i ? 'ring-2 ring-offset-1' : 'border-transparent'}`}
                    style={{ background: t.accent, ringColor: t.accent }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => logoInput.current?.click()}
              className="h-8 px-3 rounded-lg border border-[var(--border-strong)] text-[12px] text-[var(--text-secondary)] bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors">
              {logo ? '✓ Change Logo' : '↑ Upload Logo'}
            </button>
            {logo && <button onClick={() => setLogo(null)} className="text-[11px] text-red-400 hover:underline">Remove</button>}
            <input ref={logoInput} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
          </div>
        </div>

        {/* Invoice Details */}
        <div className={SEC}>
          <p className={SH}>Invoice Details</p>
          <div className="grid grid-cols-3 gap-2">
            <div><label className={LB}>Invoice #</label><input value={invNum} onChange={e=>setInvNum(e.target.value)} className={INP} /></div>
            <div><label className={LB}>Date</label><input type="date" value={invDate} onChange={e=>setInvDate(e.target.value)} className={INP} /></div>
            <div><label className={LB}>Due Date</label><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className={INP} /></div>
          </div>
          {tpl.showPayMode && (
            <div><label className={LB}>Payment Mode</label>
              <select value={payMode} onChange={e=>setPayMode(e.target.value)} className={INP+' cursor-pointer'}>
                {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Seller */}
        <div className={SEC}>
          <p className={SH}>From — Seller / Your Business</p>
          <input placeholder="Business / Company Name *" value={fromName} onChange={e=>setFromName(e.target.value)} className={INP} />
          <textarea rows={2} placeholder="Full Address" value={fromAddress} onChange={e=>setFromAddress(e.target.value)} className={TA} />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Email" value={fromEmail} onChange={e=>setFromEmail(e.target.value)} className={INP} />
            <input placeholder="Phone" value={fromPhone} onChange={e=>setFromPhone(e.target.value)} className={INP} />
          </div>
          <input placeholder="GSTIN / VAT No. / Tax ID (optional)" value={fromTaxId} onChange={e=>setFromTaxId(e.target.value)} className={INP} />
        </div>

        {/* Client */}
        <div className={SEC}>
          <p className={SH}>{tpl.id==='medical'?'Patient Details':'Bill To — Client'}</p>
          <input placeholder={tpl.id==='medical'?'Patient Name *':'Client / Company Name *'} value={toName} onChange={e=>setToName(e.target.value)} className={INP} />
          {tpl.showPatient && (
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Patient ID / File No." value={patientId} onChange={e=>setPatientId(e.target.value)} className={INP} />
              <input placeholder="Doctor / Consultant" value={doctorName} onChange={e=>setDoctorName(e.target.value)} className={INP} />
            </div>
          )}
          <textarea rows={2} placeholder="Address" value={toAddress} onChange={e=>setToAddress(e.target.value)} className={TA} />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Email" value={toEmail} onChange={e=>setToEmail(e.target.value)} className={INP} />
            <input placeholder="Phone" value={toPhone} onChange={e=>setToPhone(e.target.value)} className={INP} />
          </div>
          <input placeholder="Client GSTIN / Tax ID (optional)" value={toTaxId} onChange={e=>setToTaxId(e.target.value)} className={INP} />
          {tpl.showShipTo && (
            <>
              <button onClick={() => setShipOn(p=>!p)} className="self-start text-[11.5px] font-medium" style={{color:th.accent}}>
                {shipOn ? '− Remove Ship To' : '+ Add Ship To Address'}
              </button>
              {shipOn && (
                <>
                  <input placeholder="Ship To — Name" value={shipName} onChange={e=>setShipName(e.target.value)} className={INP} />
                  <textarea rows={2} placeholder="Shipping Address" value={shipAddress} onChange={e=>setShipAddress(e.target.value)} className={TA} />
                </>
              )}
            </>
          )}
        </div>

        {/* Construction-specific */}
        {tpl.showSite && (
          <div className={SEC}>
            <p className={SH}>Site / Project Details</p>
            <input placeholder="Site / Project Address" value={siteAddr} onChange={e=>setSiteAddr(e.target.value)} className={INP} />
            <input placeholder="Contract / Work Order Number" value={contractNo} onChange={e=>setContractNo(e.target.value)} className={INP} />
          </div>
        )}

        {/* Tax & Discount */}
        <div className={SEC}>
          <p className={SH}>{tpl.taxLabel} & Discount</p>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={LB}>{tpl.taxLabel} Rate (%)</label>
              <input type="number" min="0" max="100" step="0.01" placeholder="0" value={taxRate} onChange={e=>setTaxRate(e.target.value)} className={INP} />
            </div>
            <div><label className={LB}>Discount ({sym})</label>
              <input type="number" min="0" step="0.01" placeholder="0" value={discount} onChange={e=>setDiscount(e.target.value)} className={INP} />
            </div>
          </div>
        </div>

        {/* Bank / Payment */}
        {tpl.showBank && (
          <div className={SEC}>
            <p className={SH}>Payment / Bank Details</p>
            <textarea rows={3} placeholder={"Bank Name:\nAccount No:\nIFSC / IBAN / Routing No:\nBranch:"} value={bankInfo} onChange={e=>setBankInfo(e.target.value)} className={TA} />
          </div>
        )}

        {/* Terms */}
        {tpl.showTerms && (
          <div className={SEC}>
            <p className={SH}>Terms & Conditions</p>
            <textarea rows={3} value={terms} onChange={e=>setTerms(e.target.value)} className={TA} />
          </div>
        )}

        {/* Notes */}
        <div className={SEC}>
          <p className={SH}>Notes</p>
          <textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} className={TA} />
        </div>

        {/* Signatory */}
        {tpl.showSignatory && (
          <div className={SEC}>
            <p className={SH}>Authorized Signatory</p>
            <input placeholder="Signatory Name" value={signatory} onChange={e=>setSignatory(e.target.value)} className={INP} />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pb-2">
          <button onClick={handleDownloadPdf} disabled={downloading}
            className="flex-1 h-10 rounded-xl font-semibold text-[13.5px] text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: th.accent }}>
            {downloading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Generating…</>
              : '↓ Download PDF'}
          </button>
          <button onClick={handlePrint}
            className="h-10 px-4 rounded-xl font-semibold text-[13.5px] border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] transition-colors">
            Print
          </button>
        </div>
      </div>

      {/* ══ PREVIEW + ITEMS (right) ════════════════════════════════════════════ */}
      <div className="flex-1 w-full min-w-0">

        {/* Page fit indicator */}
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] text-[var(--text-tertiary)]">Live Preview — A4</p>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${fitPct >= 100 ? 'bg-emerald-100 text-emerald-700' : fitPct >= 80 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
            {fitPct >= 100 ? '✓ Fits 1 page' : `⚡ Auto-scaled ${fitPct}%`}
          </span>
        </div>

        {/* A4 canvas — outer div is exactly 595×842, clips overflow */}
        <div className="overflow-x-auto">
          <div ref={outerRef}
            style={{ width: A4W, height: A4H, overflow:'hidden', position:'relative', background:'#fff', boxShadow:'0 2px 20px rgba(0,0,0,0.12)' }}>
            <div ref={innerRef}
              style={{ position:'absolute', top:0, left:0, width: A4W, transformOrigin:'top left', transform:`scale(${scale})` }}>
              <InvoiceContent inv={inv} />
            </div>
          </div>
        </div>

        {/* Items editor */}
        <ItemsEditor items={items} itemRows={itemRows} sym={sym} th={th} tpl={tpl}
          addItem={addItem} removeItem={removeItem} setItem={setItem} />
      </div>
    </div>
    <InvoiceInfoSection />
    </>
  );
}

// ─── Invoice content (rendered inside A4 canvas) ──────────────────────────────
function InvoiceContent({ inv }) {
  const { tpl, th, sym, cur, curObj, logo, invNum, invDate, dueDate, payMode,
    fromName, fromAddress, fromEmail, fromPhone, fromTaxId,
    toName, toAddress, toEmail, toPhone, toTaxId,
    shipOn, shipName, shipAddress,
    patientId, doctorName, siteAddr, contractNo,
    itemRows, showHsn, showDisc,
    subtotal, taxAmt, taxRate, discAmt, discount, total,
    bankInfo, terms, notes, signatory } = inv;

  const f = n => fmtM(n, sym);
  const s = { fontFamily:"'Segoe UI',Arial,sans-serif", color:'#111', fontSize:11 };

  return (
    <div style={{ ...s, padding:'36px 42px 30px', boxSizing:'border-box', width: A4W }}>

      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:0 }}>
        <div style={{ flex:1, paddingRight:16 }}>
          {logo && <img src={logo} alt="" style={{ maxHeight:52, maxWidth:150, marginBottom:7, objectFit:'contain', display:'block' }} />}
          <div style={{ fontSize:19, fontWeight:700, color:th.accent, lineHeight:1.2 }}>{fromName||'Your Business'}</div>
          <div style={{ fontSize:10, color:'#6b7280', marginTop:4, whiteSpace:'pre-line', lineHeight:1.6 }}>{fromAddress}</div>
          {fromEmail && <div style={{ fontSize:10, color:'#6b7280' }}>{fromEmail}</div>}
          {fromPhone && <div style={{ fontSize:10, color:'#6b7280' }}>{fromPhone}</div>}
          {fromTaxId && <div style={{ fontSize:10, color:'#374151', marginTop:2 }}><b>GSTIN/Tax ID:</b> {fromTaxId}</div>}
        </div>
        <div style={{ textAlign:'right', minWidth:185 }}>
          <div style={{ fontSize:22, fontWeight:800, color:th.accent, letterSpacing:'-0.02em', lineHeight:1 }}>{tpl.title}</div>
          <table style={{ marginTop:8, marginLeft:'auto', fontSize:10, borderCollapse:'collapse' }}>
            <tbody>
              {[['Invoice #', invNum, true],['Date', fmtDate(invDate), false],['Due Date', fmtDate(dueDate), true],
                tpl.showPayMode ? ['Pay Via', payMode, false] : null,
                [cur, curObj?.name||'', false]
              ].filter(Boolean).map(([l,v,bold]) => (
                <tr key={l}><td style={{ padding:'2px 7px 2px 0', color:'#9ca3af', whiteSpace:'nowrap' }}>{l}</td>
                  <td style={{ textAlign:'right', color:bold?th.accent:'#374151', fontWeight:bold?600:400, whiteSpace:'nowrap' }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height:3, background:th.accent, borderRadius:2, margin:'14px 0 16px' }} />

      {/* Medical / Construction extra header */}
      {tpl.showPatient && (patientId||doctorName) && (
        <div style={{ display:'flex', gap:20, marginBottom:12, background:th.light, borderRadius:7, padding:'8px 12px', fontSize:10 }}>
          {patientId  && <span><b style={{color:th.accent}}>Patient ID:</b> {patientId}</span>}
          {doctorName && <span><b style={{color:th.accent}}>Doctor:</b> {doctorName}</span>}
        </div>
      )}
      {tpl.showSite && (siteAddr||contractNo) && (
        <div style={{ display:'flex', gap:20, marginBottom:12, background:th.light, borderRadius:7, padding:'8px 12px', fontSize:10 }}>
          {siteAddr   && <span><b style={{color:th.accent}}>Site:</b> {siteAddr}</span>}
          {contractNo && <span><b style={{color:th.accent}}>Contract #:</b> {contractNo}</span>}
        </div>
      )}

      {/* BILL TO + SHIP TO */}
      <div style={{ display:'flex', gap:28, marginBottom:16 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:th.accent, marginBottom:5 }}>
            {tpl.id==='medical'?'Patient':'Bill To'}
          </div>
          <div style={{ fontSize:12, fontWeight:600, color:'#111' }}>{toName||'—'}</div>
          <div style={{ fontSize:10, color:'#6b7280', whiteSpace:'pre-line', lineHeight:1.65, marginTop:2 }}>{toAddress}</div>
          {toEmail && <div style={{ fontSize:10, color:'#6b7280' }}>{toEmail}</div>}
          {toPhone && <div style={{ fontSize:10, color:'#6b7280' }}>{toPhone}</div>}
          {toTaxId && <div style={{ fontSize:10, color:'#374151', marginTop:2 }}><b>Tax ID:</b> {toTaxId}</div>}
        </div>
        {shipOn && (
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:th.accent, marginBottom:5 }}>Ship To</div>
            {shipName && <div style={{ fontSize:12, fontWeight:600 }}>{shipName}</div>}
            <div style={{ fontSize:10, color:'#6b7280', whiteSpace:'pre-line', lineHeight:1.65 }}>{shipAddress}</div>
          </div>
        )}
      </div>

      {/* ITEMS TABLE */}
      <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:16, fontSize:10.5 }}>
        <thead>
          <tr style={{ background:th.accent }}>
            <th style={{ ...TH, textAlign:'left' }}>Description</th>
            {showHsn  && <th style={{ ...TH, width:65 }}>HSN/SAC</th>}
            <th style={{ ...TH, width:36 }}>Qty</th>
            <th style={{ ...TH, width:80 }}>{tpl.rateLabel}</th>
            {showDisc && <th style={{ ...TH, width:52 }}>Disc%</th>}
            <th style={{ ...TH, width:82 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {itemRows.map((row,i) => (
            <tr key={row.id} style={{ background:i%2===0?'#fff':th.light }}>
              <td style={TD}>{row.desc||'—'}</td>
              {showHsn  && <td style={{ ...TD, textAlign:'center', color:'#6b7280' }}>{row.hsn||'—'}</td>}
              <td style={{ ...TD, textAlign:'center' }}>{Number(row.qty)||0}</td>
              <td style={{ ...TD, textAlign:'right' }}>{f(Number(row.price)||0)}</td>
              {showDisc && <td style={{ ...TD, textAlign:'center', color:'#dc2626' }}>{Number(row.disc)||0}%</td>}
              <td style={{ ...TD, textAlign:'right', fontWeight:500 }}>{f(row.net)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS + BANK */}
      <div style={{ display:'flex', gap:16, marginBottom:14, alignItems:'flex-start' }}>
        <div style={{ flex:1 }}>
          {bankInfo && (
            <div style={{ background:th.light, border:`1px solid ${th.accent}25`, borderRadius:7, padding:'9px 11px' }}>
              <div style={{ fontSize:8.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:th.accent, marginBottom:4 }}>Payment Details</div>
              <div style={{ fontSize:10, color:'#374151', whiteSpace:'pre-line', lineHeight:1.7 }}>{bankInfo}</div>
            </div>
          )}
        </div>
        <table style={{ minWidth:195, fontSize:11, borderCollapse:'collapse' }}>
          <tbody>
            <tr><td style={{ padding:'3px 0', color:'#6b7280' }}>Sub Total</td><td style={{ textAlign:'right' }}>{f(subtotal)}</td></tr>
            {taxRate && Number(taxRate)>0 && (
              <tr><td style={{ padding:'3px 0', color:'#6b7280' }}>{tpl.taxLabel} ({taxRate}%)</td><td style={{ textAlign:'right' }}>{f(taxAmt)}</td></tr>
            )}
            {discount && Number(discount)>0 && (
              <tr><td style={{ padding:'3px 0', color:'#6b7280' }}>Discount</td><td style={{ textAlign:'right', color:'#dc2626' }}>−{f(discAmt)}</td></tr>
            )}
            <tr><td colSpan={2} style={{ borderTop:`2px solid ${th.accent}`, paddingTop:6 }} /></tr>
            <tr>
              <td style={{ padding:'3px 0', fontWeight:700, fontSize:13 }}>Total</td>
              <td style={{ textAlign:'right', fontWeight:700, fontSize:15, color:th.accent }}>{f(total)}</td>
            </tr>
            <tr><td colSpan={2} style={{ fontSize:9, color:'#9ca3af', paddingTop:1 }}>{cur} — {curObj?.name}</td></tr>
          </tbody>
        </table>
      </div>

      {/* TERMS */}
      {tpl.showTerms && terms && (
        <div style={{ borderTop:'1px solid #e5e7eb', paddingTop:10, marginBottom:10 }}>
          <div style={{ fontSize:8.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:th.accent, marginBottom:3 }}>Terms & Conditions</div>
          <div style={{ fontSize:9.5, color:'#6b7280', whiteSpace:'pre-line', lineHeight:1.65 }}>{terms}</div>
        </div>
      )}

      {/* NOTES */}
      {notes && (
        <div style={{ fontSize:9.5, color:'#6b7280', fontStyle:'italic', marginBottom:12 }}>{notes}</div>
      )}

      {/* SIGNATORY */}
      {tpl.showSignatory && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:6 }}>
          <div style={{ fontSize:9.5, color:'#9ca3af' }}>For — <b style={{color:'#374151'}}>{fromName}</b></div>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:120, height:34, border:`1.5px solid ${th.accent}40`, borderRadius:6, marginBottom:3, background:th.light }} />
            <div style={{ fontSize:9, color:'#6b7280' }}>{signatory||'Authorized Signatory'}</div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ marginTop:14, borderTop:'1px solid #e5e7eb', paddingTop:7, display:'flex', justifyContent:'space-between', fontSize:9, color:'#9ca3af' }}>
        <span>{fromName}</span><span>{invNum}</span><span>{fmtDate(invDate)}</span>
      </div>
    </div>
  );
}

// Cell styles
const TH = { color:'#fff', fontWeight:600, fontSize:9, textTransform:'uppercase', letterSpacing:'.06em', padding:'7px 9px', textAlign:'right' };
const TD = { padding:'7px 9px', borderBottom:'1px solid #e5e7eb', color:'#1f2937', fontSize:10.5 };

// ─── Items editor ──────────────────────────────────────────────────────────────
function ItemsEditor({ items, itemRows, sym, th, tpl, addItem, removeItem, setItem }) {
  const f = n => sym + Number(n).toFixed(2);
  const showHsn = tpl.showHsn;
  const cols = [
    '2fr',
    showHsn ? '75px' : null,
    '50px','90px',
    tpl.showItemDisc ? '60px' : null,
    '82px','28px',
  ].filter(Boolean).join(' ');

  return (
    <div className="mt-4 rounded-xl border border-[var(--border)] overflow-hidden">
      <div style={{ gridTemplateColumns: cols }} className="grid text-[10px] font-bold uppercase tracking-wide text-[var(--text-tertiary)] bg-[var(--surface-secondary)] px-3 py-2 gap-2">
        <span>Description</span>
        {showHsn && <span className="text-center">HSN/SAC</span>}
        <span className="text-center">Qty</span>
        <span className="text-right">{tpl.rateLabel} ({sym})</span>
        {tpl.showItemDisc && <span className="text-center">Disc%</span>}
        <span className="text-right">Net Amt</span>
        <span />
      </div>
      {items.map((item, idx) => {
        const row = itemRows[idx];
        return (
          <div key={item.id} style={{ gridTemplateColumns: cols }}
            className="grid items-center px-3 py-1.5 border-t border-[var(--border)] gap-2">
            <input value={item.desc} onChange={e=>setItem(item.id,'desc',e.target.value)}
              placeholder="Item / service description"
              className="bg-transparent text-[12px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]" />
            {showHsn && <input value={item.hsn} onChange={e=>setItem(item.id,'hsn',e.target.value)}
              placeholder="HSN"
              className="bg-transparent text-[11px] text-center text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]" />}
            <input type="number" min="0" value={item.qty} onChange={e=>setItem(item.id,'qty',e.target.value)}
              className="bg-transparent text-[12px] text-center text-[var(--text-primary)] outline-none w-full" />
            <input type="number" min="0" step="0.01" value={item.price} onChange={e=>setItem(item.id,'price',e.target.value)}
              className="bg-transparent text-[12px] text-right text-[var(--text-primary)] outline-none w-full" />
            {tpl.showItemDisc && <input type="number" min="0" max="100" step="0.1" value={item.disc} onChange={e=>setItem(item.id,'disc',e.target.value)}
              placeholder="0"
              className="bg-transparent text-[12px] text-center text-[var(--text-primary)] outline-none w-full" />}
            <span className="text-[12px] text-right font-medium text-[var(--text-primary)] tabular-nums">{f(row?.net??0)}</span>
            <button onClick={()=>removeItem(item.id)}
              className="w-5 h-5 flex items-center justify-center rounded-full text-[var(--text-tertiary)] hover:text-red-400 hover:bg-red-400/10 transition-colors text-[15px] leading-none">×</button>
          </div>
        );
      })}
      <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--border)] bg-[var(--surface-secondary)]">
        <button onClick={addItem} className="text-[12.5px] font-medium flex items-center gap-1 hover:underline" style={{color:th.accent}}>
          + Add Line Item
        </button>
        <span className="text-[13px] font-bold text-[var(--text-primary)] tabular-nums">
          {sym}{itemRows.reduce((s,i)=>s+i.net,0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// ─── Print HTML ────────────────────────────────────────────────────────────────
function buildPrintHtml(inv) {
  const { tpl, th, sym, cur, curObj, logo, invNum, invDate, dueDate, payMode,
    fromName, fromAddress, fromEmail, fromPhone, fromTaxId,
    toName, toAddress, toEmail, toPhone, toTaxId,
    shipOn, shipName, shipAddress, patientId, doctorName, siteAddr, contractNo,
    itemRows, showHsn, showDisc, subtotal, taxAmt, taxRate, discAmt, discount, total,
    bankInfo, terms, notes, signatory, scale = 1 } = inv;

  // When scale < 1 the content overflows A4. We expand the inner div width
  // proportionally so that after CSS scale() it renders at exactly 210mm.
  const innerW  = scale < 1 ? `${(210 / scale).toFixed(2)}mm` : '210mm';
  const scaleCss = scale < 1 ? `transform:scale(${scale});transform-origin:top left;` : '';

  const f = n => sym + Number(n).toFixed(2);
  const rows = itemRows.map((row,i) => `
    <tr style="background:${i%2===0?'#fff':th.light}">
      <td style="padding:7px 9px;border-bottom:1px solid #e5e7eb;font-size:10.5px">${row.desc||'—'}</td>
      ${showHsn?`<td style="padding:7px 9px;text-align:center;border-bottom:1px solid #e5e7eb;font-size:10px;color:#6b7280">${row.hsn||'—'}</td>`:''}
      <td style="padding:7px 9px;text-align:center;border-bottom:1px solid #e5e7eb;font-size:10.5px">${Number(row.qty)||0}</td>
      <td style="padding:7px 9px;text-align:right;border-bottom:1px solid #e5e7eb;font-size:10.5px">${f(Number(row.price)||0)}</td>
      ${showDisc?`<td style="padding:7px 9px;text-align:center;border-bottom:1px solid #e5e7eb;font-size:10.5px;color:#dc2626">${Number(row.disc)||0}%</td>`:''}
      <td style="padding:7px 9px;text-align:right;border-bottom:1px solid #e5e7eb;font-size:10.5px;font-weight:500">${f(row.net)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${tpl.title} ${invNum}</title>
<style>
  @page{size:A4;margin:0}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:210mm;height:297mm;overflow:hidden;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .a4-clip{width:210mm;height:297mm;overflow:hidden;position:relative}
  .a4-body{position:absolute;top:0;left:0;width:${innerW};${scaleCss}padding:10mm 12mm;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111;font-size:10.5px}
</style></head><body>
<div class="a4-clip"><div class="a4-body">
<div style="display:flex;justify-content:space-between;align-items:flex-start">
  <div style="flex:1;padding-right:14px">
    ${logo?`<img src="${logo}" style="max-height:48px;max-width:140px;margin-bottom:6px;object-fit:contain;display:block">`:''}
    <div style="font-size:18px;font-weight:700;color:${th.accent}">${fromName||'Your Business'}</div>
    <div style="font-size:9.5px;color:#6b7280;margin-top:3px;white-space:pre-line;line-height:1.6">${fromAddress||''}</div>
    ${fromEmail?`<div style="font-size:9.5px;color:#6b7280">${fromEmail}</div>`:''}
    ${fromPhone?`<div style="font-size:9.5px;color:#6b7280">${fromPhone}</div>`:''}
    ${fromTaxId?`<div style="font-size:9.5px;color:#374151;margin-top:2px"><b>GSTIN/Tax ID:</b> ${fromTaxId}</div>`:''}
  </div>
  <div style="text-align:right;min-width:180px">
    <div style="font-size:20px;font-weight:800;color:${th.accent}">${tpl.title}</div>
    <table style="margin-top:7px;margin-left:auto;font-size:9.5px;border-collapse:collapse">
      <tr><td style="padding:2px 6px 2px 0;color:#9ca3af">Invoice #</td><td style="text-align:right;color:${th.accent};font-weight:600">${invNum}</td></tr>
      <tr><td style="padding:2px 6px 2px 0;color:#9ca3af">Date</td><td style="text-align:right;color:#374151">${fmtDate(invDate)}</td></tr>
      <tr><td style="padding:2px 6px 2px 0;color:#9ca3af">Due Date</td><td style="text-align:right;color:${th.accent};font-weight:600">${fmtDate(dueDate)}</td></tr>
      ${tpl.showPayMode?`<tr><td style="padding:2px 6px 2px 0;color:#9ca3af">Pay Via</td><td style="text-align:right;color:#374151">${payMode}</td></tr>`:''}
    </table>
  </div>
</div>
<div style="height:3px;background:${th.accent};border-radius:2px;margin:12px 0 14px"></div>
${tpl.showPatient&&(patientId||doctorName)?`<div style="display:flex;gap:16px;margin-bottom:10px;background:${th.light};border-radius:6px;padding:7px 10px;font-size:9.5px">${patientId?`<span><b style="color:${th.accent}">Patient ID:</b> ${patientId}</span>`:''} ${doctorName?`<span><b style="color:${th.accent}">Doctor:</b> ${doctorName}</span>`:''}</div>`:''}
${tpl.showSite&&(siteAddr||contractNo)?`<div style="display:flex;gap:16px;margin-bottom:10px;background:${th.light};border-radius:6px;padding:7px 10px;font-size:9.5px">${siteAddr?`<span><b style="color:${th.accent}">Site:</b> ${siteAddr}</span>`:''} ${contractNo?`<span><b style="color:${th.accent}">Contract #:</b> ${contractNo}</span>`:''}</div>`:''}
<div style="display:flex;gap:24px;margin-bottom:14px">
  <div style="flex:1">
    <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${th.accent};margin-bottom:4px">${tpl.id==='medical'?'Patient':'Bill To'}</div>
    <div style="font-size:11.5px;font-weight:600">${toName||'—'}</div>
    <div style="font-size:9.5px;color:#6b7280;white-space:pre-line;line-height:1.6;margin-top:2px">${toAddress||''}</div>
    ${toEmail?`<div style="font-size:9.5px;color:#6b7280">${toEmail}</div>`:''}
    ${toPhone?`<div style="font-size:9.5px;color:#6b7280">${toPhone}</div>`:''}
    ${toTaxId?`<div style="font-size:9.5px;color:#374151;margin-top:1px"><b>Tax ID:</b> ${toTaxId}</div>`:''}
  </div>
  ${shipOn?`<div style="flex:1"><div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${th.accent};margin-bottom:4px">Ship To</div>${shipName?`<div style="font-size:11.5px;font-weight:600">${shipName}</div>`:''}<div style="font-size:9.5px;color:#6b7280;white-space:pre-line;line-height:1.6">${shipAddress}</div></div>`:''}
</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:14px">
  <thead><tr style="background:${th.accent}">
    <th style="color:#fff;font-weight:600;font-size:8.5px;text-transform:uppercase;letter-spacing:.06em;padding:7px 9px;text-align:left">Description</th>
    ${showHsn?`<th style="color:#fff;font-weight:600;font-size:8.5px;text-transform:uppercase;padding:7px 9px;text-align:center;width:65px">HSN/SAC</th>`:''}
    <th style="color:#fff;font-weight:600;font-size:8.5px;text-transform:uppercase;padding:7px 9px;text-align:center;width:36px">Qty</th>
    <th style="color:#fff;font-weight:600;font-size:8.5px;text-transform:uppercase;padding:7px 9px;text-align:right;width:80px">${tpl.rateLabel}</th>
    ${showDisc?`<th style="color:#fff;font-weight:600;font-size:8.5px;text-transform:uppercase;padding:7px 9px;text-align:center;width:50px">Disc%</th>`:''}
    <th style="color:#fff;font-weight:600;font-size:8.5px;text-transform:uppercase;padding:7px 9px;text-align:right;width:80px">Amount</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div style="display:flex;gap:14px;margin-bottom:12px;align-items:flex-start">
  <div style="flex:1">${bankInfo?`<div style="background:${th.light};border:1px solid ${th.accent}25;border-radius:6px;padding:8px 10px"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${th.accent};margin-bottom:3px">Payment Details</div><div style="font-size:9.5px;color:#374151;white-space:pre-line;line-height:1.65">${bankInfo}</div></div>`:''}</div>
  <table style="min-width:185px;font-size:10.5px;border-collapse:collapse">
    <tr><td style="padding:3px 0;color:#6b7280">Sub Total</td><td style="text-align:right">${f(subtotal)}</td></tr>
    ${taxRate&&Number(taxRate)>0?`<tr><td style="padding:3px 0;color:#6b7280">${tpl.taxLabel} (${taxRate}%)</td><td style="text-align:right">${f(taxAmt)}</td></tr>`:''}
    ${discount&&Number(discount)>0?`<tr><td style="padding:3px 0;color:#6b7280">Discount</td><td style="text-align:right;color:#dc2626">−${f(discAmt)}</td></tr>`:''}
    <tr><td colspan="2" style="border-top:2px solid ${th.accent};padding-top:5px"></td></tr>
    <tr><td style="padding:3px 0;font-weight:700;font-size:12.5px">Total</td><td style="text-align:right;font-weight:700;font-size:14px;color:${th.accent}">${f(total)}</td></tr>
    <tr><td colspan="2" style="font-size:8.5px;color:#9ca3af;padding-top:1px">${cur}</td></tr>
  </table>
</div>
${tpl.showTerms&&terms?`<div style="border-top:1px solid #e5e7eb;padding-top:8px;margin-bottom:8px"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${th.accent};margin-bottom:3px">Terms & Conditions</div><div style="font-size:9px;color:#6b7280;white-space:pre-line;line-height:1.6">${terms}</div></div>`:''}
${notes?`<div style="font-size:9px;color:#6b7280;font-style:italic;margin-bottom:10px">${notes}</div>`:''}
${tpl.showSignatory?`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px"><div style="font-size:9px;color:#9ca3af">For — <b style="color:#374151">${fromName||''}</b></div><div style="text-align:center"><div style="width:110px;height:30px;border:1.5px solid ${th.accent}40;border-radius:5px;margin-bottom:3px;background:${th.light}"></div><div style="font-size:8.5px;color:#6b7280">${signatory||'Authorized Signatory'}</div></div></div>`:''}
<div style="margin-top:12px;border-top:1px solid #e5e7eb;padding-top:6px;display:flex;justify-content:space-between;font-size:8.5px;color:#9ca3af">
  <span>${fromName||''}</span><span>${invNum}</span><span>${fmtDate(invDate)}</span>
</div>
</div></div>
</body></html>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// INFO SECTION — educational content below the tool
// ═════════════════════════════════════════════════════════════════════════════

// ── Chart 1: Payment Terms Visual Timeline ────────────────────────────────────
function PaymentTermsChart() {
  const terms = [
    { label:'Due on Receipt', days:0,  color:'#10b981', use:'Freelancers, small jobs, deposits' },
    { label:'NET 7',          days:7,  color:'#34d399', use:'Weekly contractors, rush projects' },
    { label:'NET 14',         days:14, color:'#60a5fa', use:'Recurring services, small businesses' },
    { label:'NET 30',         days:30, color:'#a78bfa', use:'Standard B2B — most common worldwide' },
    { label:'NET 60',         days:60, color:'#f59e0b', use:'Large corporations, government' },
    { label:'NET 90',         days:90, color:'#f97316', use:'Enterprise contracts, long-term supply' },
  ];
  const max = 90;
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-1">Payment Terms Explained</h3>
      <p className="text-[13px] text-[var(--text-secondary)] mb-5">
        NET days = number of days a client has to pay after the invoice date. Choosing the right term affects your cash flow.
      </p>
      <div className="flex flex-col gap-3">
        {terms.map(t => (
          <div key={t.label} className="flex items-center gap-3">
            <div className="w-[110px] shrink-0 text-[12px] font-semibold text-[var(--text-primary)]">{t.label}</div>
            <div className="flex-1 h-7 rounded-lg overflow-hidden bg-[var(--surface-secondary)] relative">
              <div className="h-full rounded-lg flex items-center px-2 transition-all"
                style={{ width: t.days === 0 ? '6%' : `${(t.days/max)*100}%`, background: t.color, minWidth: 28 }}>
                {t.days > 0 && <span className="text-white text-[10px] font-bold">{t.days}d</span>}
              </div>
            </div>
            <div className="w-[200px] shrink-0 text-[11px] text-[var(--text-tertiary)] hidden sm:block">{t.use}</div>
          </div>
        ))}
      </div>
      <p className="text-[11.5px] text-[var(--text-tertiary)] mt-4 border-t border-[var(--border)] pt-3">
        Tip: NET 30 is the global standard for B2B invoicing. For new clients or high-risk accounts, use shorter terms (NET 7–14) or require a 50% deposit upfront.
      </p>
    </div>
  );
}

// ── Chart 2: Late Payment Interest Cost ──────────────────────────────────────
function LatePaymentChart() {
  const principal = 1000;
  const points = [30, 60, 90, 120, 150, 180];
  const rates = [
    { label:'1.5%/month (standard)', r: 1.5/100/30, color:'#f97316' },
    { label:'2%/month (high)',        r: 2.0/100/30, color:'#ef4444' },
    { label:'5%/yr (bank rate)',      r: 5.0/100/365, color:'#60a5fa' },
  ];
  const maxInterest = principal * rates[1].r * 180;
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-1">Cost of Late Payment</h3>
      <p className="text-[13px] text-[var(--text-secondary)] mb-5">
        Interest accumulated on an unpaid <strong>$1,000 invoice</strong> at different rates over time.
      </p>
      {/* Chart area */}
      <div className="relative" style={{ height: 160 }}>
        {/* Y axis labels */}
        {[0, 25, 50, 75].map(v => (
          <div key={v} className="absolute left-0 text-[10px] text-[var(--text-tertiary)]"
            style={{ bottom: `${(v/75)*100}%`, transform:'translateY(50%)' }}>${v}</div>
        ))}
        {/* Grid lines */}
        {[0, 25, 50, 75].map(v => (
          <div key={v} className="absolute left-8 right-0 border-t border-[var(--border)]"
            style={{ bottom: `${(v/75)*100}%` }} />
        ))}
        {/* Bars per time point */}
        <div className="absolute left-8 right-0 bottom-0 top-0 flex items-end">
          {points.map((days, di) => (
            <div key={days} className="flex-1 flex items-end justify-center gap-0.5 pb-0" style={{ paddingBottom: 0 }}>
              {rates.map((rate, ri) => {
                const interest = principal * rate.r * days;
                const h = Math.round((interest / 75) * 100);
                return (
                  <div key={ri} title={`${rate.label}: $${interest.toFixed(2)}`}
                    className="rounded-t-sm transition-all cursor-help"
                    style={{ width: 10, height: `${Math.min(h, 100)}%`, background: rate.color, opacity: 0.9 }} />
                );
              })}
            </div>
          ))}
        </div>
        {/* X axis labels */}
        <div className="absolute left-8 right-0 flex" style={{ bottom: -20 }}>
          {points.map(d => (
            <div key={d} className="flex-1 text-center text-[10px] text-[var(--text-tertiary)]">{d}d</div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-8">
        {rates.map(r => (
          <div key={r.label} className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <div className="w-3 h-3 rounded-sm" style={{ background: r.color }} />
            {r.label}
          </div>
        ))}
      </div>
      <p className="text-[11.5px] text-[var(--text-tertiary)] mt-3 border-t border-[var(--border)] pt-3">
        Always include your late payment policy in Terms & Conditions. State the rate clearly (e.g. "1.5% per month on overdue balances") to make it legally enforceable.
      </p>
    </div>
  );
}

// ── Chart 3: Template Feature Matrix ─────────────────────────────────────────
function TemplateMatrix() {
  const features = ['HSN/SAC Code','Per-item Discount','Ship To','Bank Details','Signatory','Terms & Conditions','Payment Mode','Patient Fields','Site/Project Fields'];
  const matrix = {
    'Standard Business':        [false,true, true, true, true, true, true, false,false],
    'Tax / GST Invoice':        [true, true, true, true, true, true, true, false,false],
    'Freelance / Service':      [false,false,false,true, false,true, true, false,false],
    'Proforma / Quotation':     [false,true, true, false,true, true, false,false,false],
    'Medical / Clinic':         [false,false,false,true, true, true, true, true, false],
    'Construction / Contractor':[false,false,false,true, true, true, true, false,true ],
  };
  const templates = Object.keys(matrix);
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5 overflow-x-auto">
      <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-1">Template Feature Comparison</h3>
      <p className="text-[13px] text-[var(--text-secondary)] mb-4">Which fields appear in each business category template.</p>
      <table className="w-full text-[11.5px] border-collapse" style={{ minWidth: 600 }}>
        <thead>
          <tr>
            <th className="text-left pb-2 pr-3 text-[var(--text-tertiary)] font-semibold text-[10.5px] uppercase tracking-wide">Feature</th>
            {templates.map(t => (
              <th key={t} className="pb-2 px-2 text-[var(--text-primary)] font-semibold text-center" style={{ fontSize: 10, lineHeight: 1.3, maxWidth: 70 }}>
                {t.split('/')[0].trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feat, fi) => (
            <tr key={feat} className={fi % 2 === 0 ? 'bg-[var(--surface-secondary)]' : ''}>
              <td className="py-1.5 pr-3 text-[var(--text-secondary)]">{feat}</td>
              {templates.map(t => (
                <td key={t} className="py-1.5 px-2 text-center">
                  {matrix[t][fi]
                    ? <span className="text-emerald-500 font-bold text-[13px]">✓</span>
                    : <span className="text-[var(--border-strong)] text-[13px]">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Key Invoice Elements Grid ─────────────────────────────────────────────────
function InvoiceElementsGrid() {
  const elements = [
    { icon:'🏢', title:'Seller Information',   desc:'Your full business name, address, email, phone, and tax registration number (GSTIN/VAT/EIN).' },
    { icon:'👤', title:'Buyer Information',    desc:'Client name, billing address, email, and their tax ID if applicable for B2B invoices.' },
    { icon:'🔢', title:'Unique Invoice Number',desc:'Sequential, never repeated (e.g. INV-2024-001). Required for accounting, audits, and tax filing.' },
    { icon:'📅', title:'Invoice & Due Dates',  desc:'Invoice date starts the payment clock. Due date defines the NET term. Both are legally important.' },
    { icon:'📋', title:'Itemized Line Items',  desc:'Description, quantity, unit price, and line total for every product or service billed.' },
    { icon:'💰', title:'Tax & Total',          desc:'Subtotal, applicable tax (GST/VAT) with rate %, any discounts, and the final amount due.' },
    { icon:'🏦', title:'Payment Details',      desc:'Bank name, account number, IBAN/SWIFT, or payment link so the client knows exactly how to pay.' },
    { icon:'📜', title:'Terms & Conditions',   desc:'Late payment clause, ownership transfer terms, warranty, and dispute resolution policy.' },
    { icon:'✍️', title:'Authorized Signature', desc:'Required for tax invoices and formal contracts. Confirms the invoice is genuine and approved.' },
  ];
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-1">9 Essential Invoice Elements</h3>
      <p className="text-[13px] text-[var(--text-secondary)] mb-4">
        A legally valid invoice must contain these core elements. Missing any can delay payment or cause tax compliance issues.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {elements.map((el, i) => (
          <div key={el.title} className="rounded-xl border border-[var(--border)] p-3 flex gap-3">
            <span className="text-[22px] leading-none mt-0.5 shrink-0">{el.icon}</span>
            <div>
              <div className="text-[12.5px] font-semibold text-[var(--text-primary)] mb-0.5">
                <span className="text-[10px] font-bold text-[var(--text-tertiary)] mr-1">#{i+1}</span>{el.title}
              </div>
              <div className="text-[11.5px] text-[var(--text-tertiary)] leading-relaxed">{el.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Best Practices strip ──────────────────────────────────────────────────────
function BestPracticesStrip() {
  const tips = [
    { icon:'⚡', tip:'Send invoices immediately',      detail:'Same day as delivery. Delays in sending = delays in payment.' },
    { icon:'🔔', tip:'Follow up on due date',           detail:'A polite reminder email on the due date recovers 30% more overdue invoices.' },
    { icon:'💳', tip:'Offer multiple payment methods',  detail:'Clients pay 2× faster when you offer bank transfer, card, and mobile pay.' },
    { icon:'📊', tip:'Number sequentially',             detail:'INV-001, INV-002… Required for bookkeeping and tax audits.' },
    { icon:'🔒', tip:'Keep copies for 7 years',         detail:'Most tax authorities require invoice records for 5–7 years.' },
    { icon:'📝', tip:'Be specific in descriptions',     detail:'"Web Design – Homepage Redesign" is stronger than "Web Services" for dispute resolution.' },
  ];
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-4">Invoicing Best Practices</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tips.map(t => (
          <div key={t.tip} className="flex gap-2.5 p-3 rounded-xl bg-[var(--surface-secondary)]">
            <span className="text-[20px] leading-none shrink-0 mt-0.5">{t.icon}</span>
            <div>
              <div className="text-[12.5px] font-semibold text-[var(--text-primary)] mb-0.5">{t.tip}</div>
              <div className="text-[11.5px] text-[var(--text-tertiary)] leading-relaxed">{t.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function InvoiceFAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q:'What is the difference between an invoice and a receipt?',
      a:'An invoice is a payment request sent before money is received — it says "you owe me X." A receipt is a confirmation sent after payment — it says "you paid X." A receipt is proof of transaction; an invoice is a legal demand for payment.',
    },
    {
      q:'When should I use a Proforma Invoice?',
      a:'Use a proforma invoice when you want to give a client a quote or cost estimate before the actual work begins. It looks like a real invoice but is explicitly marked as not a demand for payment. Common in international trade, construction, and large projects.',
    },
    {
      q:'What is HSN/SAC code and do I need it?',
      a:'HSN (Harmonized System of Nomenclature) codes identify goods; SAC (Services Accounting Code) identifies services. They are mandatory on GST tax invoices in India for every line item. Not required on standard invoices in most other countries. Use the Tax/GST Invoice template if you need HSN/SAC.',
    },
    {
      q:'What does NET 30 mean?',
      a:'NET 30 means the client must pay within 30 calendar days from the invoice date. "NET" refers to the total amount due. NET 30 is the most common payment term globally for B2B invoicing. Other common terms: NET 7, NET 14, NET 60. "Due on receipt" means pay immediately.',
    },
    {
      q:'How do I calculate late payment interest?',
      a:'Monthly rate: Amount × (rate/100) × (days overdue/30). Example: $1,000 invoice, 1.5%/month, 45 days late → $1,000 × 0.015 × 1.5 = $22.50 interest. Annual rate: Amount × (rate/365) × days overdue. Always state the rate in your Terms & Conditions to make it enforceable.',
    },
    {
      q:'Is an electronic/PDF invoice legally valid?',
      a:'Yes, in almost all countries. The US (E-SIGN Act), EU (eIDAS), UK, India (IT Act), and most jurisdictions recognize electronically generated invoices as legally valid. What matters is that the invoice contains all required fields, not whether it is paper or digital. GST e-invoicing rules may apply to large businesses in some countries.',
    },
    {
      q:'What is the difference between CGST, SGST, and IGST?',
      a:'These apply to Indian GST. CGST (Central) + SGST (State) are charged for intra-state transactions — split 50/50 between central and state government. IGST (Integrated) is charged for inter-state or import/export transactions and goes to the central government. For example, 18% GST intra-state = 9% CGST + 9% SGST. Use the Tax/GST Invoice template.',
    },
    {
      q:'Can I send the same invoice twice if unpaid?',
      a:'Yes, but add a "Reminder" label and the original invoice date. Never change the invoice number — create a new reference if needed. Keep the original invoice unchanged for your records. A polite follow-up email with the invoice attached, referencing the original date and amount, is standard practice.',
    },
  ];
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-4">Frequently Asked Questions</h3>
      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-[var(--border)] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left gap-3 hover:bg-[var(--surface-secondary)] transition-colors">
              <span className="text-[13px] font-medium text-[var(--text-primary)]">{faq.q}</span>
              <span className="text-[18px] text-[var(--text-tertiary)] shrink-0 transition-transform"
                style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 pt-1 text-[13px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] bg-[var(--surface-secondary)]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Master info section ───────────────────────────────────────────────────────
function InvoiceInfoSection() {
  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentTermsChart />
        <LatePaymentChart />
      </div>
      <InvoiceElementsGrid />
      <TemplateMatrix />
      <BestPracticesStrip />
      <InvoiceFAQ />
    </div>
  );
}
