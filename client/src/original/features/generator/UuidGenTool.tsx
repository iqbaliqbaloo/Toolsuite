// @ts-nocheck
import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, Label, SelectField, NumberInput, CopyBtn } from '../../components/ui/shared';

// ─── Types ────────────────────────────────────────────────────────────────────

type UuidVersion = 'v4' | 'v7' | 'v5' | 'nil' | 'max';
type OutputFormat = 'standard' | 'uppercase' | 'nohyphens' | 'urn' | 'braces';

// ─── Namespaces (RFC 4122) ────────────────────────────────────────────────────

const NAMESPACES: Record<string, string> = {
  DNS:  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL:  '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID:  '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
};

// ─── Secure UUID v4 fallback (crypto.getRandomValues, NOT Math.random) ────────

function uuidV4Secure(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // variant RFC 4122
  return [
    hex(b, 0, 4), '-', hex(b, 4, 6), '-', hex(b, 6, 8), '-', hex(b, 8, 10), '-', hex(b, 10, 16),
  ].join('');
}

function hex(b: Uint8Array, start: number, end: number): string {
  return Array.from(b.slice(start, end)).map(x => x.toString(16).padStart(2, '0')).join('');
}

// ─── UUID v7 (timestamp-ordered) ─────────────────────────────────────────────

function uuidV7(): string {
  const ms   = BigInt(Date.now());
  const rand = crypto.getRandomValues(new Uint8Array(10));

  // 48-bit timestamp in ms
  const tsHigh = Number((ms >> 16n) & 0xffffffffn);
  const tsLow  = Number(ms & 0xffffn);

  // 12 random bits for ver field area
  const randA = ((rand[0] & 0x0f) << 8) | rand[1];
  // variant + 62 random bits
  const varB  = (rand[2] & 0x3f) | 0x80;

  const p1 = tsHigh.toString(16).padStart(8, '0');
  const p2 = tsLow.toString(16).padStart(4, '0');
  const p3 = '7' + randA.toString(16).padStart(3, '0');
  const p4 = varB.toString(16).padStart(2, '0') + rand[3].toString(16).padStart(2, '0');
  const p5 = Array.from(rand.slice(4)).map(x => x.toString(16).padStart(2, '0')).join('');

  return `${p1}-${p2}-${p3}-${p4}-${p5}`;
}

// ─── UUID v5 (SHA-1 + namespace + name) ───────────────────────────────────────

function parseUuidBytes(uuid: string): Uint8Array {
  const clean = uuid.replace(/-/g, '');
  return new Uint8Array(clean.match(/.{2}/g)!.map(h => parseInt(h, 16)));
}

async function uuidV5(namespace: string, name: string): Promise<string> {
  const nsBytes   = parseUuidBytes(namespace);
  const nameBytes = new TextEncoder().encode(name);
  const combined  = new Uint8Array(nsBytes.length + nameBytes.length);
  combined.set(nsBytes);
  combined.set(nameBytes, nsBytes.length);

  const hashBuf = await crypto.subtle.digest('SHA-1', combined);
  const b       = new Uint8Array(hashBuf).slice(0, 16);

  b[6] = (b[6] & 0x0f) | 0x50; // version 5
  b[8] = (b[8] & 0x3f) | 0x80; // variant

  return [hex(b, 0, 4), '-', hex(b, 4, 6), '-', hex(b, 6, 8), '-', hex(b, 8, 10), '-', hex(b, 10, 16)].join('');
}

// ─── Format output ────────────────────────────────────────────────────────────

function applyFormat(uuid: string, fmt: OutputFormat): string {
  switch (fmt) {
    case 'uppercase':  return uuid.toUpperCase();
    case 'nohyphens':  return uuid.replace(/-/g, '');
    case 'urn':        return `urn:uuid:${uuid}`;
    case 'braces':     return `{${uuid}}`;
    default:           return uuid;
  }
}

// ─── Parse v4 UUID structure ─────────────────────────────────────────────────

function parseStructure(uuid: string) {
  const clean = uuid.replace(/-/g, '');
  return {
    timeLow:         uuid.slice(0, 8),
    timeMid:         uuid.slice(9, 13),
    versionAndHigh:  uuid.slice(14, 18),
    variantAndClock: uuid.slice(19, 23),
    node:            uuid.slice(24),
    version:         clean[12],
    variant:         parseInt(clean[16], 16) >= 8 ? 'RFC 4122' : 'Other',
    bits:            '128 bits total — 122 random bits (6 fixed: version + variant)',
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

function UuidGenTool() {
  const [version,   setVersion]   = useState<UuidVersion>('v4');
  const [count,     setCount]     = useState(10);
  const [format,    setFormat]    = useState<OutputFormat>('standard');
  const [uuids,     setUuids]     = useState<string[]>([]);
  const [loading,   setLoading]   = useState(false);

  // v5 options
  const [ns,       setNs]       = useState('DNS');
  const [nsName,   setNsName]   = useState('');

  // inspect panel
  const [inspected, setInspected] = useState<string | null>(null);

  const inputCls = "h-9 px-3 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors";

  // ── Generate ──────────────────────────────────────────────────────────────
  const generate = async () => {
    setLoading(true);
    try {
      const arr: string[] = [];
      const cap = Math.min(count, 100);

      if (version === 'nil') {
        for (let i = 0; i < cap; i++) arr.push('00000000-0000-0000-0000-000000000000');
      } else if (version === 'max') {
        for (let i = 0; i < cap; i++) arr.push('ffffffff-ffff-ffff-ffff-ffffffffffff');
      } else if (version === 'v7') {
        // small delay between each so timestamps differ
        for (let i = 0; i < cap; i++) {
          arr.push(uuidV7());
          if (i < cap - 1) await new Promise(r => setTimeout(r, 1));
        }
      } else if (version === 'v5') {
        const namespaceuuid = NAMESPACES[ns] || NAMESPACES.DNS;
        const base = nsName.trim() || 'example';
        for (let i = 0; i < cap; i++) {
          // append index so each is unique (same name = same UUID)
          arr.push(await uuidV5(namespaceuuid, cap === 1 ? base : `${base}-${i}`));
        }
      } else {
        for (let i = 0; i < cap; i++) arr.push(uuidV4Secure());
      }

      setUuids(arr.map(u => applyFormat(u, format)));
      setInspected(null);
    } finally {
      setLoading(false);
    }
  };

  const structured = inspected ? parseStructure(inspected.replace(/[{}]/g, '').replace('urn:uuid:', '').toLowerCase()) : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">

      {/* ── Version selector ── */}
      <div>
        <Label>UUID version</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {([
            ['v4',  'v4 — Random',       'General purpose, most common'],
            ['v7',  'v7 — Time-ordered', 'Database PKs, sortable'],
            ['v5',  'v5 — Deterministic','Same input = same UUID'],
            ['nil', 'Nil',               'All zeros — null placeholder'],
            ['max', 'Max',               'All ones — sentinel value'],
          ] as [UuidVersion, string, string][]).map(([v, lbl, tip]) => (
            <button key={v} onClick={() => setVersion(v)} title={tip}
              className={`px-3 py-1.5 rounded-lg text-[12.5px] border transition-colors ${
                version === v
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
                  : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent-line)]'
              }`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* ── Version description ── */}
      <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
        {version === 'v4'  && <><strong className="text-[var(--text-primary)]">UUID v4</strong> — 122 random bits generated by <code>crypto.randomUUID()</code>. Not time-sortable. Best for general-purpose IDs where insert order does not matter.</>}
        {version === 'v7'  && <><strong className="text-[var(--text-primary)]">UUID v7</strong> — 48-bit Unix timestamp (ms) + 74 random bits. Time-sortable, sequential B-tree insertions. Recommended for database primary keys in PostgreSQL 17+.</>}
        {version === 'v5'  && <><strong className="text-[var(--text-primary)]">UUID v5</strong> — SHA-1 hash of namespace + name. Deterministic: same inputs always produce the same UUID. Use when two systems must independently generate the same ID for the same resource.</>}
        {version === 'nil' && <><strong className="text-[var(--text-primary)]">Nil UUID</strong> — All 128 bits set to zero. Used as null/empty UUID placeholder per RFC 4122.</>}
        {version === 'max' && <><strong className="text-[var(--text-primary)]">Max UUID</strong> — All 128 bits set to one. Used as a sentinel/upper-bound value in range queries per RFC 4122.</>}
      </div>

      {/* ── v5 namespace options ── */}
      {version === 'v5' && (
        <div className="flex flex-col gap-3">
          <div>
            <Label>Namespace</Label>
            <select value={ns} onChange={e => setNs(e.target.value)} className={inputCls + ' w-full'}>
              {Object.keys(NAMESPACES).map(k => (
                <option key={k} value={k}>{k} — {NAMESPACES[k]}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Name</Label>
            <input value={nsName} onChange={e => setNsName(e.target.value)}
              placeholder="e.g. example.com"
              className={inputCls + ' w-full'} />
            <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
              Same namespace + name always produces the same UUID.
            </p>
          </div>
        </div>
      )}

      {/* ── Options row ── */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <Label>Count (max 100)</Label>
          <input type="number" min="1" max="100" value={count}
            onChange={e => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className={inputCls + ' w-24'} />
        </div>
        <div>
          <Label>Output format</Label>
          <select value={format} onChange={e => setFormat(e.target.value as OutputFormat)} className={inputCls}>
            <option value="standard">Standard</option>
            <option value="uppercase">Uppercase</option>
            <option value="nohyphens">No hyphens</option>
            <option value="urn">URN</option>
            <option value="braces">Braces</option>
          </select>
        </div>
      </div>

      {/* ── Format preview ── */}
      <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-2">
        <p className="text-[11px] text-[var(--text-tertiary)] mb-0.5">Format preview</p>
        <code className="text-[12px] font-mono text-[var(--text-secondary)]">
          {applyFormat('550e8400-e29b-41d4-a716-446655440000', format)}
        </code>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <Btn onClick={generate} disabled={loading}>
          <Icon name="Fingerprint" size={15} />
          {loading ? 'Generating…' : 'Generate'}
        </Btn>
        {uuids.length > 0 && (
          <CopyBtn text={uuids.join('\n')} label={`Copy all ${uuids.length}`} />
        )}
      </div>

      {/* ── UUID list ── */}
      {uuids.length > 0 && (
        <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {uuids.map((u, i) => (
              <div key={i}
                className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-strong)] last:border-0 hover:bg-[var(--surface-tertiary)] transition-colors">
                <code className="font-mono text-[12.5px] text-[var(--text-primary)] flex-1 break-all">{u}</code>
                <div className="flex items-center gap-1.5 ml-3 shrink-0">
                  <CopyBtn text={u} />
                  {version === 'v4' && (
                    <button
                      onClick={() => setInspected(prev => prev === u ? null : u)}
                      title="Inspect UUID structure"
                      className={`h-7 px-2 rounded-lg text-[11px] border transition-colors ${
                        inspected === u
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
                          : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent-line)]'
                      }`}>
                      Inspect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Structure inspector ── */}
      {inspected && structured && (
        <div className="rounded-xl border border-[var(--accent-line)] bg-[var(--surface-secondary)] px-4 py-4 flex flex-col gap-3">
          <p className="text-[12px] font-mono text-[var(--accent)] break-all">{inspected}</p>
          <div className="grid grid-cols-1 gap-1.5 text-[12px]">
            {[
              ['Part 1 (32 bits)',  structured.timeLow,         'Random bits'],
              ['Part 2 (16 bits)',  structured.timeMid,         'Random bits'],
              ['Part 3 (16 bits)',  structured.versionAndHigh,  `Version = ${structured.version}, remaining random`],
              ['Part 4 (16 bits)',  structured.variantAndClock, `Variant = ${structured.variant}, remaining random`],
              ['Part 5 (48 bits)',  structured.node,            'Random bits'],
            ].map(([name, value, note]) => (
              <div key={name} className="flex gap-3 items-baseline">
                <span className="text-[var(--text-tertiary)] w-32 shrink-0">{name}</span>
                <code className="font-mono text-[var(--accent)] w-24 shrink-0">{value}</code>
                <span className="text-[var(--text-secondary)]">{note}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[var(--text-tertiary)]">{structured.bits}</p>
        </div>
      )}

      {/* ── Collision info ── */}
      <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3 text-[12px] text-[var(--text-secondary)] leading-relaxed">
        <p className="text-[var(--text-primary)] font-medium mb-1">Collision probability</p>
        <p>Total possible v4 UUIDs: 2¹²² ≈ 5.3 × 10³⁶. To reach a 50% chance of one collision you would need to generate 2.7 × 10¹⁸ UUIDs — at 1 billion per second that takes ~85 years. For all practical purposes: impossible.</p>
      </div>

      {/* ── Comparison table ── */}
      <div className="flex flex-col gap-2">
        <Label>ID format comparison</Label>
        <div className="rounded-xl border border-[var(--border-strong)] overflow-hidden text-[12px]">
          {[
            ['UUID v4', '36 chars', 'No',  'General purpose'],
            ['UUID v7', '36 chars', 'Yes', 'Database PKs (PostgreSQL 17+)'],
            ['ULID',    '26 chars', 'Yes', 'Logs, events, shorter'],
            ['NanoID',  '21 chars', 'No',  'URLs, Next.js, Prisma'],
            ['CUID2',   '24 chars', 'No',  'Web apps, Prisma default'],
          ].map(([type, size, sortable, use], i) => (
            <div key={type} className={`grid px-4 py-2.5 border-b border-[var(--border-strong)] last:border-0 ${i === 0 ? 'text-[var(--text-tertiary)] text-[11px]' : ''}`}
              style={{ gridTemplateColumns: '1fr 1fr 1fr 2fr' }}>
              {i === 0
                ? ['Type','Size','Sortable','Use case'].map(h => <span key={h} className="text-[var(--text-tertiary)]">{h}</span>)
                : [
                    <code key="t" className="font-mono text-[var(--accent)]">{type}</code>,
                    <span key="s">{size}</span>,
                    <span key="so" className={sortable === 'Yes' ? 'text-green-600 dark:text-green-400' : 'text-[var(--text-tertiary)]'}>{sortable}</span>,
                    <span key="u" className="text-[var(--text-secondary)]">{use}</span>,
                  ]
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── Rich content for CPM / SEO ── */}
      <UuidGenInfoContent />
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

function UuidGenInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="What is a UUID?">
        <InfoP>
          A Universally Unique Identifier (UUID), also called a GUID (Globally Unique Identifier) in
          Microsoft contexts, is a 128-bit label used to uniquely identify objects in computer systems.
          It is formatted as 32 hexadecimal digits arranged in five groups separated by hyphens:
          <code className="mx-1 text-[var(--accent)] font-mono text-[12.5px]">xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx</code>
          where M indicates the UUID version and N indicates the variant.
        </InfoP>
        <InfoP>
          The probability of generating a duplicate UUIDv4 is astronomically small: approximately
          1 in 5.3 × 10³⁶. To put this in context, generating 1 billion UUIDs per second for
          85 years still gives you less than a 50% probability of producing a single collision.
          This makes UUIDs safe to generate independently across distributed systems without any
          central coordination.
        </InfoP>
      </InfoSection>

      <InfoSection title="UUID Versions Compared">
        <InfoTable
          headers={['Version', 'Generation Method', 'Sortable?', 'Privacy', 'Best Use Case']}
          rows={[
            ['v1', 'MAC address + timestamp',     'Yes (time-ordered)', 'Low — leaks MAC address', 'Distributed systems where creation time matters'],
            ['v2', 'DCE security + timestamp',    'Yes',               'Low',                     'POSIX UID/GID-based systems (rarely used)'],
            ['v3', 'MD5 hash of namespace+name',  'No',                'Medium',                  'Deterministic IDs from names (legacy systems)'],
            ['v4', 'Cryptographically random',    'No',                'High — fully random',     'Databases, APIs, session tokens, file IDs'],
            ['v5', 'SHA-1 hash of namespace+name','No',                'Medium',                  'Deterministic IDs from names (preferred over v3)'],
            ['v6', 'Reordered timestamp + random','Yes (time-ordered)','High',                    'Database PKs needing time-ordering and privacy'],
            ['v7', 'Unix timestamp + random',     'Yes (time-ordered)','High',                    'Modern databases; recommended new standard'],
          ]}
        />
      </InfoSection>

      <InfoSection title="UUID vs ULID vs NanoID">
        <InfoP>
          UUIDs are the most widely supported identifier standard, but several alternatives have emerged
          for specific use cases — particularly in databases where sequential ordering of primary keys
          improves B-tree index performance:
        </InfoP>
        <InfoTable
          headers={['Format', 'Example', 'Length', 'Sortable', 'URL-safe', 'Notes']}
          rows={[
            ['UUID v4',  '550e8400-e29b-41d4-a716-446655440000', '36 chars', 'No',  'No',  'Universal support; not index-friendly'],
            ['UUID v7',  '01956bef-a800-7d3e-a6de-4b83f6712043', '36 chars', 'Yes', 'No',  'New RFC 9562 standard; use for new projects'],
            ['ULID',     '01ARZ3NDEKTSV4RRFFQ69G5FAV',          '26 chars', 'Yes', 'Yes', 'Lexicographically sortable; Crockford base32'],
            ['NanoID',   'V1StGXR8_Z5jdHi6B-myT',              'Custom',   'No',  'Yes', 'Compact URL-safe; customisable alphabet/length'],
            ['CUID2',    'clyrw1jef0000rn8i5bv0byft',           '24+ chars','Yes', 'Yes', 'Collision resistant; designed for horizontal scale'],
          ]}
        />
      </InfoSection>

      <InfoSection title="UUIDs in Database Design">
        <InfoP>
          The choice between UUIDs and sequential integers as primary keys is one of the most debated
          decisions in database design. Here is an honest comparison:
        </InfoP>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'UUID Advantages', body: 'Generated client-side without a DB round-trip. Safe to merge data across databases without conflicts. Makes IDs opaque (not guessable — "there are 4,293 orders" cannot be inferred from an ID).' },
            { title: 'UUID Disadvantages', body: 'Random UUIDs (v4) fragment B-tree indexes, causing write amplification and slower inserts at scale. 16 bytes vs 4–8 bytes for integers means larger join columns and more index memory.' },
            { title: 'Sequential Integer Advantages', body: 'Optimal B-tree insert performance — new rows always append to the end of the index. Compact (4 bytes for INT, 8 for BIGINT). Easy to debug ("order 42").' },
            { title: 'Sequential Integer Disadvantages', body: 'Requires a DB sequence or auto-increment — no client-side generation. Exposes business data (competitor can estimate volume). Breaks when merging tables from different sources.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <InfoP>
          The modern consensus for new projects: use UUID v7 or ULID for distributed systems and
          microservices where client-side generation is needed; use BIGINT auto-increment for
          single-database applications where insert throughput is the priority.
        </InfoP>
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="Are UUIDs truly unique?" a="UUID v4 is probabilistically unique, not guaranteed. With 2¹²² possible values (~5.3 × 10³⁶), the probability of collision is negligible in practice — but not mathematically zero. For applications requiring guaranteed uniqueness, check for collisions in your database using a unique constraint." />
          <FaqItem q="Is UUID v4 safe to use as a session token?" a="UUID v4 generated with a cryptographically secure RNG (which this tool uses) has 122 bits of entropy — sufficient for session tokens. However, dedicated token generation (e.g. crypto.randomBytes(32) in Node.js) produces 256 bits of entropy and is preferred for security-critical uses." />
          <FaqItem q="What is the difference between UUID and GUID?" a="They are the same thing. UUID is the open standard (RFC 9562); GUID (Globally Unique Identifier) is Microsoft's implementation of the same concept, used in COM, Active Directory, and .NET frameworks." />
          <FaqItem q="Why do some UUIDs have uppercase and others lowercase hex?" a="The UUID standard (RFC 9562) specifies lowercase hex digits. Microsoft's GUID implementation historically used uppercase. Both forms are valid and equivalent — all parsers treat them identically. The canonical form is lowercase." />
        </div>
      </InfoSection>

    </div>
  );
}

export default UuidGenTool;
