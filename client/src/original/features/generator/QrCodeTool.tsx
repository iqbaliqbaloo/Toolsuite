import React, { useState, useRef } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, Label, SelectField, CopyBtn } from '../../components/ui/shared';
import { dlBlob } from '../../utils/helpers';

// ─── Types ────────────────────────────────────────────────────────────────────

type EccLevel = 'L' | 'M' | 'Q' | 'H';
type OutputFormat = 'png' | 'svg';
type DataType = 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'geo' | 'text';

interface WifiFields  { ssid: string; password: string; security: 'WPA' | 'WEP' | 'nopass' }
interface VCardFields { name: string; phone: string; email: string; org: string }
interface SmsFields   { phone: string; message: string }
interface GeoFields   { lat: string; lng: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectType(value: string): DataType {
  const v = value.trim();
  if (/^https?:\/\//i.test(v))           return 'url';
  if (/^mailto:/i.test(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'email';
  if (/^tel:/i.test(v) || /^\+?\d[\d\s\-()]{6,}$/.test(v))         return 'phone';
  if (/^smsto:/i.test(v))                return 'sms';
  if (/^WIFI:/i.test(v))                 return 'wifi';
  if (/^BEGIN:VCARD/i.test(v))           return 'vcard';
  if (/^geo:/i.test(v))                  return 'geo';
  return 'text';
}

function buildWifi(f: WifiFields): string {
  return `WIFI:T:${f.security};S:${f.ssid};P:${f.password};;`;
}
function buildVCard(f: VCardFields): string {
  return `BEGIN:VCARD\nVERSION:3.0\nFN:${f.name}\nTEL:${f.phone}\nEMAIL:${f.email}\nORG:${f.org}\nEND:VCARD`;
}
function buildSms(f: SmsFields): string {
  return `smsto:${f.phone}:${f.message}`;
}
function buildGeo(f: GeoFields): string {
  return `geo:${f.lat},${f.lng}`;
}

function buildQrUrl(data: string, size: string, ecc: EccLevel, format: OutputFormat, fg: string, bg: string, margin: string): string {
  const params = new URLSearchParams({
    size:    `${size}x${size}`,
    data,
    format,
    ecc,
    color:   fg.replace('#', ''),
    bgcolor: bg.replace('#', ''),
    margin,
    qzone:   '1',
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

// ─── Sub-forms ────────────────────────────────────────────────────────────────

function inputCls() {
  return "w-full h-10 px-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors";
}

function WifiForm({ value, onChange }: { value: WifiFields; onChange: (v: WifiFields) => void }) {
  const set = (k: keyof WifiFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...value, [k]: e.target.value });
  return (
    <div className="flex flex-col gap-3">
      <div><Label>Network name (SSID)</Label><input className={inputCls()} value={value.ssid} onChange={set('ssid')} placeholder="MyNetwork" /></div>
      <div><Label>Password</Label><input className={inputCls()} value={value.password} onChange={set('password')} placeholder="password123" /></div>
      <div>
        <Label>Security</Label>
        <select className={inputCls()} value={value.security} onChange={set('security')}>
          <option value="WPA">WPA / WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (open)</option>
        </select>
      </div>
    </div>
  );
}

function VCardForm({ value, onChange }: { value: VCardFields; onChange: (v: VCardFields) => void }) {
  const set = (k: keyof VCardFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value });
  return (
    <div className="flex flex-col gap-3">
      <div><Label>Full name</Label><input className={inputCls()} value={value.name} onChange={set('name')} placeholder="Ali Hassan" /></div>
      <div><Label>Phone</Label><input className={inputCls()} value={value.phone} onChange={set('phone')} placeholder="+923001234567" /></div>
      <div><Label>Email</Label><input className={inputCls()} value={value.email} onChange={set('email')} placeholder="ali@example.com" /></div>
      <div><Label>Organization</Label><input className={inputCls()} value={value.org} onChange={set('org')} placeholder="Company name" /></div>
    </div>
  );
}

function SmsForm({ value, onChange }: { value: SmsFields; onChange: (v: SmsFields) => void }) {
  const set = (k: keyof SmsFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value });
  return (
    <div className="flex flex-col gap-3">
      <div><Label>Phone number</Label><input className={inputCls()} value={value.phone} onChange={set('phone')} placeholder="+923001234567" /></div>
      <div><Label>Message</Label><input className={inputCls()} value={value.message} onChange={set('message')} placeholder="Hello!" /></div>
    </div>
  );
}

function GeoForm({ value, onChange }: { value: GeoFields; onChange: (v: GeoFields) => void }) {
  const set = (k: keyof GeoFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value });
  return (
    <div className="flex flex-col gap-3">
      <div><Label>Latitude</Label><input className={inputCls()} value={value.lat} onChange={set('lat')} placeholder="31.5204" /></div>
      <div><Label>Longitude</Label><input className={inputCls()} value={value.lng} onChange={set('lng')} placeholder="74.3587" /></div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function QrCodeTool() {
  // core
  const [dataType, setDataType] = useState<DataType>('url');
  const [text,     setText]     = useState('');

  // structured fields
  const [wifi,  setWifi]  = useState<WifiFields> ({ ssid: '', password: '', security: 'WPA' });
  const [vcard, setVcard] = useState<VCardFields>({ name: '', phone: '', email: '', org: '' });
  const [sms,   setSms]   = useState<SmsFields>  ({ phone: '', message: '' });
  const [geo,   setGeo]   = useState<GeoFields>  ({ lat: '', lng: '' });

  // appearance
  const [size,   setSize]   = useState('256');
  const [ecc,    setEcc]    = useState<EccLevel>('M');
  const [format, setFormat] = useState<OutputFormat>('png');
  const [fg,     setFg]     = useState('#000000');
  const [bg,     setBg]     = useState('#ffffff');
  const [margin, setMargin] = useState('10');

  // ui state
  const [imgError,    setImgError]    = useState(false);
  const [downloading, setDownloading] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  // ── Build encoded data ──────────────────────────────────────────────────────
  function buildData(): string {
    switch (dataType) {
      case 'wifi':  return buildWifi(wifi);
      case 'vcard': return buildVCard(vcard);
      case 'sms':   return buildSms(sms);
      case 'geo':   return buildGeo(geo);
      case 'email': return text.startsWith('mailto:') ? text : `mailto:${text}`;
      case 'phone': return text.startsWith('tel:')    ? text : `tel:${text}`;
      default:      return text;
    }
  }

  const data   = buildData();
  const hasData = data.trim().length > 0;
  const qrUrl  = hasData ? buildQrUrl(data, size, ecc, format, fg, bg, margin) : null;

  // ── Download ────────────────────────────────────────────────────────────────
  async function download() {
    if (!qrUrl) return;
    setDownloading(true);
    try {
      const r = await fetch(qrUrl);
      if (!r.ok) throw new Error('Fetch failed');
      const blob = await r.blob();

      // revoke previous object URL to prevent memory leak
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = URL.createObjectURL(blob);

      dlBlob(blob, `qrcode.${format}`);
    } catch {
      alert('Download failed. Try again or right-click the image to save.');
    } finally {
      setDownloading(false);
    }
  }

  // ── ECC descriptions ────────────────────────────────────────────────────────
  const eccInfo: Record<EccLevel, string> = {
    L: 'L — 7% recovery (clean screens)',
    M: 'M — 15% recovery (general use)',
    Q: 'Q — 25% recovery (industrial)',
    H: 'H — 30% recovery (logo embedded)',
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">

      {/* ── Data type selector ── */}
      <div>
        <Label>Content type</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {(['url','text','email','phone','sms','wifi','vcard','geo'] as DataType[]).map(t => (
            <button
              key={t}
              onClick={() => { setDataType(t); setText(''); setImgError(false); }}
              className={`px-3 py-1 rounded-lg text-[12px] border transition-colors ${
                dataType === t
                  ? 'bg-[var(--accent-line)] text-white border-[var(--accent-line)]'
                  : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent-line)]'
              }`}
            >
              {t === 'url'   ? 'URL'
               : t === 'text'  ? 'Text'
               : t === 'email' ? 'Email'
               : t === 'phone' ? 'Phone'
               : t === 'sms'   ? 'SMS'
               : t === 'wifi'  ? 'Wi-Fi'
               : t === 'vcard' ? 'vCard'
               : 'Location'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input fields based on type ── */}
      {dataType === 'wifi'  && <WifiForm  value={wifi}  onChange={setWifi}  />}
      {dataType === 'vcard' && <VCardForm value={vcard} onChange={setVcard} />}
      {dataType === 'sms'   && <SmsForm   value={sms}   onChange={setSms}   />}
      {dataType === 'geo'   && <GeoForm   value={geo}   onChange={setGeo}   />}

      {(['url','text','email','phone'] as DataType[]).includes(dataType) && (
        <div>
          <Label>
            {dataType === 'url'   ? 'URL'
             : dataType === 'email' ? 'Email address'
             : dataType === 'phone' ? 'Phone number'
             : 'Text content'}
          </Label>
          <input
            value={text}
            onChange={e => { setText(e.target.value); setImgError(false); }}
            placeholder={
              dataType === 'url'   ? 'https://example.com'
              : dataType === 'email' ? 'user@example.com'
              : dataType === 'phone' ? '+923001234567'
              : 'Enter any text...'
            }
            className={inputCls() + ' h-12'}
          />
        </div>
      )}

      {/* ── Options grid ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectField label="Size" value={size} onChange={v => { setSize(v); setImgError(false); }}>
          <option value="150">150×150 — small</option>
          <option value="256">256×256 — medium</option>
          <option value="512">512×512 — large</option>
          <option value="1024">1024×1024 — print</option>
        </SelectField>

        <SelectField label="Error correction" value={ecc} onChange={v => { setEcc(v as EccLevel); setImgError(false); }}>
          {(['L','M','Q','H'] as EccLevel[]).map(l => (
            <option key={l} value={l}>{eccInfo[l]}</option>
          ))}
        </SelectField>

        <SelectField label="Format" value={format} onChange={v => { setFormat(v as OutputFormat); setImgError(false); }}>
          <option value="png">PNG — screens</option>
          <option value="svg">SVG — print / scalable</option>
        </SelectField>

        <SelectField label="Quiet zone (margin)" value={margin} onChange={v => { setMargin(v); setImgError(false); }}>
          <option value="0">0 — none</option>
          <option value="5">5 — minimal</option>
          <option value="10">10 — standard</option>
          <option value="20">20 — large</option>
        </SelectField>
      </div>

      {/* ── Color pickers ── */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Label className="mb-0">QR color</Label>
          <input type="color" value={fg} onChange={e => { setFg(e.target.value); setImgError(false); }}
            className="w-9 h-9 rounded-lg border border-[var(--border-strong)] cursor-pointer bg-transparent p-0.5" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="mb-0">Background</Label>
          <input type="color" value={bg} onChange={e => { setBg(e.target.value); setImgError(false); }}
            className="w-9 h-9 rounded-lg border border-[var(--border-strong)] cursor-pointer bg-transparent p-0.5" />
        </div>
      </div>

      {/* ── Preview ── */}
      {qrUrl && (
        <div className="flex flex-col items-center gap-4 mt-1">

          {imgError ? (
            <div className="flex flex-col items-center gap-2 p-6 rounded-2xl border border-[var(--border-strong)] text-[var(--text-secondary)] text-[13px]">
              <Icon name="AlertCircle" size={24} />
              <span>Failed to generate QR code. Check your input and try again.</span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl inline-block" style={{ background: bg }}>
              <img
                src={qrUrl}
                alt="QR Code"
                width={parseInt(size)}
                height={parseInt(size)}
                onError={() => setImgError(true)}
                onLoad={() => setImgError(false)}
                className="block"
                style={{ maxWidth: '280px', maxHeight: '280px', width: '100%', height: 'auto' }}
              />
            </div>
          )}

          {/* ── Encoded data preview ── */}
          <div className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-2">
            <p className="text-[11px] text-[var(--text-tertiary)] mb-0.5">Encoded data</p>
            <p className="text-[12px] text-[var(--text-secondary)] break-all font-mono leading-relaxed">{data}</p>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-2 flex-wrap justify-center">
            <Btn variant="secondary" onClick={download} disabled={downloading || imgError}>
              <Icon name="Download" size={14} />
              {downloading ? 'Downloading…' : `Download ${format.toUpperCase()}`}
            </Btn>
            <CopyBtn value={qrUrl} label="Copy QR URL" />
            <CopyBtn value={data} label="Copy encoded data" />
          </div>

          {/* ── ECC note for logo embedding ── */}
          {ecc !== 'H' && (
            <p className="text-[11px] text-[var(--text-tertiary)] text-center">
              Use error correction <strong>H</strong> if you plan to overlay a logo on the QR code.
            </p>
          )}
        </div>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <QrCodeInfoContent />
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

function QrCodeInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="How QR Codes Work">
        <InfoP>
          QR (Quick Response) codes are two-dimensional matrix barcodes invented by Denso Wave in 1994
          for tracking automotive parts. Unlike traditional barcodes which encode only ~20 digits
          horizontally, QR codes encode data in both dimensions — up to 7,089 numeric characters or
          4,296 alphanumeric characters. A smartphone camera decodes the pattern of black and white squares
          in milliseconds using built-in camera software, with no app required since iOS 11 and Android 8.
        </InfoP>
        <InfoP>
          A QR code consists of three "finder patterns" (the large squares in three corners), "alignment
          patterns" (for correcting distorted reads), "timing patterns" (alternating stripes that help
          the scanner understand module size), and the actual data modules. The version number (1–40)
          determines the size: a Version 1 code is 21×21 modules; each version adds 4 modules per side,
          up to 177×177 for Version 40.
        </InfoP>
      </InfoSection>

      <InfoSection title="QR Code Types & Use Cases">
        <InfoTable
          headers={['QR Type', 'Encodes', 'Common Use Case']}
          rows={[
            ['URL',         'https://... link',              'Website links, landing pages, ad campaigns, menus'],
            ['vCard',       'Contact information',           'Business cards, name badges, conference materials'],
            ['WiFi',        'Network SSID + password',       'Guest WiFi in hotels, cafés, offices, events'],
            ['SMS',         'Phone number + message',        'Customer support shortcuts, voting systems'],
            ['Email',       'To + Subject + Body',           'Newsletter signups, feedback forms, referrals'],
            ['Phone',       'Phone number to call',          'Business directories, real estate signs'],
            ['Location',    'GPS coordinates',               'Maps, delivery addresses, venue check-ins'],
            ['Text',        'Plain text string',             'Instructions, serial numbers, secret messages'],
            ['App Store',   'iOS/Android store URL',        'Mobile app installs, promotional materials'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Error Correction Levels">
        <InfoP>
          QR codes include Reed-Solomon error correction that allows them to be read even if part of the
          code is damaged, dirty, or obscured. There are four error correction levels:
        </InfoP>
        <InfoTable
          headers={['Level', 'Data Recovery Capability', 'Data Capacity Impact', 'Best For']}
          rows={[
            ['L (Low)',    '7% of codewords recoverable',  'Largest capacity', 'Clean indoor environments, digital screens'],
            ['M (Medium)', '15% of codewords recoverable', 'Standard',         'Most general use cases; default recommendation'],
            ['Q (Quartile)','25% of codewords recoverable','Reduced',          'Industrial or outdoor environments'],
            ['H (High)',   '30% of codewords recoverable', 'Smallest capacity','Logo overlays, damaged surfaces, small print sizes'],
          ]}
        />
        <InfoP>
          When adding a logo overlay to a QR code, always use Error Correction Level H. The logo covers
          some data modules, but with 30% recovery capability the code remains scannable as long as the
          logo covers no more than 30% of the total area.
        </InfoP>
      </InfoSection>

      <InfoSection title="Static vs Dynamic QR Codes">
        <InfoP>
          A static QR code encodes the destination URL directly in the pattern. Once printed, it cannot
          be changed — to update the destination you must reprint. A dynamic QR code encodes a short
          redirect URL hosted on a QR platform; changing the destination on the platform changes where
          all printed codes point without reprinting.
        </InfoP>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Static QR — Advantages', body: 'Works forever without any third-party service. No monthly subscription. Scan data is private. Simpler for permanent uses like business cards.' },
            { title: 'Static QR — Disadvantages', body: 'Cannot be updated. No scan analytics. The encoded URL is visible and editable by anyone with a QR reader app.' },
            { title: 'Dynamic QR — Advantages', body: 'Update the destination without reprinting. Track scan counts, locations, and device types. A/B test different landing pages.' },
            { title: 'Dynamic QR — Disadvantages', body: 'Depends on the QR platform staying live. Subscription required for most analytics features. Redirect adds a small latency.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="QR Code Size & Print Guidelines">
        <InfoTable
          headers={['Print Size', 'Minimum Scan Distance', 'Recommended For']}
          rows={[
            ['1 cm × 1 cm',   '< 5 cm',   'Tiny labels, stickers — only reliable with phone directly over code'],
            ['2.5 cm × 2.5 cm', '15–25 cm', 'Business cards, product packaging, receipts'],
            ['4 cm × 4 cm',   '25–40 cm', 'Brochures, flyers, table cards'],
            ['8 cm × 8 cm',   '50–80 cm', 'Posters, signage, menus'],
            ['15 cm × 15 cm', '1–1.5 m',  'Large banners, window displays'],
            ['30 cm × 30 cm', '2–3 m',    'Outdoor signs, vehicle graphics'],
            ['1 m × 1 m',     '5–10 m',   'Billboards, building-scale displays'],
          ]}
        />
        <InfoP>
          Always test your QR code in the actual print size before mass printing. The quietzone (blank
          border around the code) should be at least 4 modules wide — a common cause of scan failures
          in printed materials is cutting into the quietzone.
        </InfoP>
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="Can QR codes expire?" a="Static QR codes never expire — the data is encoded in the pixels and works as long as the image is readable. Dynamic QR codes expire if the hosting service is discontinued or the subscription lapses." />
          <FaqItem q="What is the minimum contrast required for a QR code to scan?" a="The WCAG AA contrast standard (4.5:1) is a safe minimum. Black on white is the most reliable. Dark on light always works better than light on dark — most QR scanners assume dark modules on a light background." />
          <FaqItem q="Can I put a QR code on a dark background?" a="Technically yes, but you need to invert the pattern (light modules, dark background) and most scanners do not support inverted codes natively. Dark foreground on light background is overwhelmingly preferred." />
          <FaqItem q="How do I track how many times a QR code has been scanned?" a="Static QR codes cannot be tracked without adding UTM parameters to the destination URL and using Google Analytics. Dynamic QR codes include built-in scan tracking with geographic and device breakdowns." />
        </div>
      </InfoSection>

    </div>
  );
}

export default QrCodeTool;
