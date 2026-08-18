import React, { useState, useCallback, useRef } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, Label, CopyBtn } from '../../components/ui/shared';

// ─── Constants ────────────────────────────────────────────────────────────────

const CHARSET = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

const AMBIGUOUS = new Set(Array.from('0Oo1lIi|'));

// EFF large wordlist (200 common words — replace with full 7776-word list for production)
const WORDLIST = [
  'apple','brave','crisp','delta','early','flame','grace','hotel','inner','joker',
  'karma','lemon','magic','noble','ocean','piano','queen','river','solar','tiger',
  'ultra','vivid','water','xenon','yacht','zebra','amber','blaze','coral','dream',
  'eagle','frost','globe','honey','ivory','jewel','knack','lunar','maple','nerve',
  'olive','pearl','quart','radar','smoke','tulip','under','vault','wheat','axiom',
  'birch','candy','depot','ember','fizzy','groan','hazel','irony','jumpy','kinky',
  'lilac','mocha','nymph','optic','proxy','quota','ridge','scone','thorn','umbra',
  'vigor','waltz','extra','yummy','zonal','actor','beach','cubic','disco','elfin',
  'ferry','glyph','hedge','icing','jazzy','kebab','libel','mirth','notch','oxide',
  'plumb','quirk','resin','stern','tabby','unwed','vicar','winch','expat','yearn',
  'abbot','brine','chess','derby','envoy','flint','guava','hatch','imply','joust',
  'karma','llama','mango','niche','offal','pinch','qualm','rajah','savvy','tango',
  'usher','vying','walrus','xerox','yodel','zesty','abide','budge','cleft','dowry',
  'eject','finch','gruff','hinge','inlet','jokey','kneel','lodge','moose','nudge',
  'outdo','plait','quell','revel','slunk','trout','untie','voila','woken','expel',
  'yeoman','zippy','abash','blurt','comet','dirge','elbow','fiord','gripe','havoc',
  'impel','joist','knave','lusty','maxim','nifty','opine','prawn','quaff','rusty',
  'skimp','taboo','unfed','vouch','wormy','exert','yawns','zilch','acorn','booze',
  'cinch','dowel','efface','flair','gruel','hippo','incur','jazzy','kapow','leaky',
];

// ─── Crypto helpers ───────────────────────────────────────────────────────────

/** Unbiased random index using rejection sampling to fix modulo bias */
function cryptoIndex(max: number): number {
  const limit = Math.floor(256 / max) * max;
  let byte: number;
  do {
    byte = crypto.getRandomValues(new Uint8Array(1))[0];
  } while (byte >= limit);
  return byte % max;
}

/** Fisher-Yates shuffle using crypto */
function cryptoShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = cryptoIndex(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Entropy ──────────────────────────────────────────────────────────────────

function calcEntropy(charsetSize: number, length: number): number {
  if (charsetSize === 0 || length === 0) return 0;
  return Math.floor(length * Math.log2(charsetSize));
}

function entropyLabel(bits: number): { label: string; color: string } {
  if (bits < 28)  return { label: 'Very Weak', color: '#ef4444' };
  if (bits < 36)  return { label: 'Weak',      color: '#f97316' };
  if (bits < 60)  return { label: 'Fair',       color: '#eab308' };
  if (bits < 128) return { label: 'Strong',     color: '#22c55e' };
  return             { label: 'Very Strong', color: '#06b6d4' };
}

// ─── Generator ───────────────────────────────────────────────────────────────

type Opts = { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean };
type Mode = 'random' | 'passphrase';

function buildCharset(opts: Opts, noAmbiguous: boolean): string {
  let cs = [
    opts.upper   ? CHARSET.upper   : '',
    opts.lower   ? CHARSET.lower   : '',
    opts.numbers ? CHARSET.numbers : '',
    opts.symbols ? CHARSET.symbols : '',
  ].join('');
  if (noAmbiguous) cs = Array.from(cs).filter(c => !AMBIGUOUS.has(c)).join('');
  return cs;
}

function generateRandom(length: number, opts: Opts, noAmbiguous: boolean): string {
  const charset = buildCharset(opts, noAmbiguous);
  if (!charset) return '';

  // Guarantee at least one char from each active group
  const guaranteed: string[] = [];
  const groups = [
    opts.upper   ? (noAmbiguous ? Array.from(CHARSET.upper).filter(c => !AMBIGUOUS.has(c)).join('') : CHARSET.upper)   : '',
    opts.lower   ? (noAmbiguous ? Array.from(CHARSET.lower).filter(c => !AMBIGUOUS.has(c)).join('') : CHARSET.lower)   : '',
    opts.numbers ? (noAmbiguous ? Array.from(CHARSET.numbers).filter(c => !AMBIGUOUS.has(c)).join('') : CHARSET.numbers) : '',
    opts.symbols ? CHARSET.symbols : '',
  ].filter(Boolean);

  for (const g of groups) {
    if (g.length > 0) guaranteed.push(g[cryptoIndex(g.length)]);
  }

  // Fill remaining positions
  const remaining = length - guaranteed.length;
  const filled: string[] = Array.from({ length: remaining }, () => charset[cryptoIndex(charset.length)]);

  // Shuffle guaranteed + filled together
  return cryptoShuffle([...guaranteed, ...filled]).join('');
}

function generatePassphrase(wordCount: number, separator: string): string {
  return Array.from({ length: wordCount }, () => WORDLIST[cryptoIndex(WORDLIST.length)]).join(separator);
}

// ─── HaveIBeenPwned check ─────────────────────────────────────────────────────

async function sha1(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function checkPwned(password: string): Promise<number> {
  const hash   = await sha1(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  const res    = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text   = await res.text();
  const match  = text.split('\r\n').find(line => line.startsWith(suffix));
  return match ? parseInt(match.split(':')[1], 10) : 0;
}

// ─── Component ───────────────────────────────────────────────────────────────

type PasswordEntry = {
  id:       number;
  value:    string;
  entropy:  number;
  pwned:    number | null;
  checking: boolean;
};

let idCounter = 0;

function PasswordGenTool() {
  // mode
  const [mode, setMode] = useState<Mode>('random');

  // random options
  const [length,      setLength]      = useState(16);
  const [opts,        setOpts]        = useState<Opts>({ upper: true, lower: true, numbers: true, symbols: true });
  const [noAmbiguous, setNoAmbiguous] = useState(false);

  // passphrase options
  const [wordCount,  setWordCount]  = useState(5);
  const [separator,  setSeparator]  = useState('-');

  // output
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [history,   setHistory]   = useState<string[]>([]);
  const [count,     setCount]     = useState(5);

  const toggle = (key: keyof Opts) => setOpts(o => ({ ...o, [key]: !o[key] }));

  const charset = buildCharset(opts, noAmbiguous);
  const entropy = mode === 'random'
    ? calcEntropy(charset.length, length)
    : Math.floor(wordCount * Math.log2(WORDLIST.length));
  const { label: strengthLabel, color: strengthColor } = entropyLabel(entropy);

  // ── Generate ────────────────────────────────────────────────────────────────
  const generate = useCallback(() => {
    if (mode === 'random' && !charset) return;
    const newEntries: PasswordEntry[] = Array.from({ length: count }, () => {
      const value = mode === 'random'
        ? generateRandom(length, opts, noAmbiguous)
        : generatePassphrase(wordCount, separator);
      const e = mode === 'random' ? entropy : Math.floor(wordCount * Math.log2(WORDLIST.length));
      return { id: ++idCounter, value, entropy: e, pwned: null, checking: false };
    });
    setPasswords(newEntries);
    setHistory(prev => [...newEntries.map(e => e.value), ...prev].slice(0, 20));
  }, [mode, charset, length, opts, noAmbiguous, wordCount, separator, count, entropy]);

  // ── Pwned check ─────────────────────────────────────────────────────────────
  const checkPwnedFor = async (id: number, value: string) => {
    setPasswords(prev => prev.map(p => p.id === id ? { ...p, checking: true } : p));
    try {
      const count = await checkPwned(value);
      setPasswords(prev => prev.map(p => p.id === id ? { ...p, pwned: count, checking: false } : p));
    } catch {
      setPasswords(prev => prev.map(p => p.id === id ? { ...p, pwned: -1, checking: false } : p));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  const inputCls = "h-9 px-3 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-line)] transition-colors";

  return (
    <div className="flex flex-col gap-5">

      {/* ── Mode tabs ── */}
      <div className="flex gap-2">
        {(['random','passphrase'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-lg text-[13px] border transition-colors ${
              mode === m
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
                : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent-line)]'
            }`}>
            {m === 'random' ? 'Random' : 'Passphrase'}
          </button>
        ))}
      </div>

      {/* ── Random options ── */}
      {mode === 'random' && (
        <div className="flex flex-col gap-4">
          {/* Length slider */}
          <div>
            <div className="flex justify-between mb-1">
              <Label>Length</Label>
              <span className="text-[13px] font-mono text-[var(--accent)]">{length}</span>
            </div>
            <input type="range" min="8" max="64" step="1" value={length}
              onChange={e => setLength(+e.target.value)}
              className="w-full accent-[var(--accent)]" />
            <div className="flex justify-between text-[11px] text-[var(--text-tertiary)] mt-0.5">
              <span>8</span><span>64</span>
            </div>
          </div>

          {/* Character type toggles */}
          <div className="flex flex-wrap gap-2">
            {([['upper','A–Z'],['lower','a–z'],['numbers','0–9'],['symbols','!@#']] as [keyof Opts, string][]).map(([k, lbl]) => (
              <button key={k} onClick={() => toggle(k)}
                className={`h-8 px-3 rounded-lg text-[12.5px] border transition-colors ${
                  opts[k]
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
                    : 'border-[var(--border-strong)] text-[var(--text-secondary)]'
                }`}>
                {lbl}
              </button>
            ))}
          </div>

          {/* Exclude ambiguous */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={noAmbiguous} onChange={e => setNoAmbiguous(e.target.checked)}
              className="w-4 h-4 accent-[var(--accent)]" />
            <span className="text-[13px] text-[var(--text-secondary)]">
              Exclude ambiguous characters <span className="font-mono text-[var(--text-tertiary)]">(0 O o 1 l I i |)</span>
            </span>
          </label>

          {/* Charset preview */}
          {charset && (
            <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-3 py-2">
              <p className="text-[11px] text-[var(--text-tertiary)] mb-0.5">Character pool ({charset.length} chars)</p>
              <p className="text-[11px] font-mono text-[var(--text-secondary)] break-all leading-relaxed">{charset}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Passphrase options ── */}
      {mode === 'passphrase' && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <Label>Word count</Label>
              <span className="text-[13px] font-mono text-[var(--accent)]">{wordCount}</span>
            </div>
            <input type="range" min="3" max="10" step="1" value={wordCount}
              onChange={e => setWordCount(+e.target.value)}
              className="w-full accent-[var(--accent)]" />
            <div className="flex justify-between text-[11px] text-[var(--text-tertiary)] mt-0.5">
              <span>3</span><span>10</span>
            </div>
          </div>
          <div>
            <Label>Separator</Label>
            <div className="flex gap-2 flex-wrap">
              {(['-','_','.','/','','@']).map(s => (
                <button key={s} onClick={() => setSeparator(s)}
                  className={`h-8 px-3 rounded-lg text-[12.5px] font-mono border transition-colors ${
                    separator === s
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-line)]'
                      : 'border-[var(--border-strong)] text-[var(--text-secondary)]'
                  }`}>
                  {s === '' ? 'none' : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Entropy meter ── */}
      <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] text-[var(--text-secondary)]">Entropy</span>
          <span className="text-[12px] font-mono" style={{ color: strengthColor }}>
            {entropy} bits — {strengthLabel}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--border-strong)] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (entropy / 128) * 100)}%`,
              background: strengthColor,
            }} />
        </div>
      </div>

      {/* ── Count + generate ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="mb-0 whitespace-nowrap">Count</Label>
          <select value={count} onChange={e => setCount(+e.target.value)} className={inputCls}>
            {[1,3,5,10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <Btn onClick={generate} disabled={mode === 'random' && !charset}>
          <Icon name="RotateCcw" size={14} /> Generate
        </Btn>
      </div>

      {/* ── Password list ── */}
      {passwords.length > 0 && (
        <div className="flex flex-col gap-2">
          {passwords.map(p => (
            <div key={p.id}
              className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono text-[13.5px] text-[var(--text-primary)] tracking-wider break-all flex-1">
                  {p.value}
                </code>
                <div className="flex items-center gap-1.5 shrink-0">
                  <CopyBtn text={p.value} />
                  <button
                    onClick={() => checkPwnedFor(p.id, p.value)}
                    disabled={p.checking}
                    title="Check if this password appeared in known data breaches"
                    className="h-7 px-2 rounded-lg text-[11px] border border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent-line)] transition-colors disabled:opacity-50">
                    {p.checking ? '…' : 'Breach?'}
                  </button>
                </div>
              </div>

              {/* Breach result */}
              {p.pwned !== null && (
                <div className={`mt-2 text-[11.5px] px-2 py-1 rounded-lg ${
                  p.pwned === -1  ? 'bg-[var(--surface-secondary)] text-[var(--text-tertiary)]' :
                  p.pwned === 0   ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' :
                                    'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                }`}>
                  {p.pwned === -1 ? 'Breach check failed (network error)' :
                   p.pwned === 0  ? '✓ Not found in known breaches' :
                   `⚠ Found ${p.pwned.toLocaleString()} times in known breaches — do not use`}
                </div>
              )}

              {/* Entropy per password */}
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-[var(--border-strong)] overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (p.entropy / 128) * 100)}%`,
                      background: entropyLabel(p.entropy).color,
                    }} />
                </div>
                <span className="text-[10.5px] font-mono" style={{ color: entropyLabel(p.entropy).color }}>
                  {p.entropy}b
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Session history ── */}
      {history.length > 0 && (
        <div>
          <Label>Session history (cleared on refresh)</Label>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] p-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between gap-2 px-2 py-1 rounded-lg hover:bg-[var(--surface-tertiary)]">
                <code className="font-mono text-[12px] text-[var(--text-secondary)] break-all flex-1">{h}</code>
                <CopyBtn text={h} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <PasswordGenInfoContent />
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

function PasswordGenInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="Password Security: What Makes a Password Strong?">
        <InfoP>
          Password strength is determined by two factors: length and character set size. Together they
          determine the "entropy" — the number of possible combinations an attacker must try to guess
          your password by brute force. Entropy is measured in bits: each additional bit doubles the
          number of possible combinations. A 128-bit password would take longer than the age of the
          universe to crack even with all current computing power combined.
        </InfoP>
        <InfoP>
          The most common attack vectors against passwords are not brute force but credential stuffing
          (trying passwords leaked from other breaches), dictionary attacks (trying common words and
          patterns), and phishing. A randomly generated password with high entropy defeats all three:
          it cannot be found in any dictionary and has never been used in a breach.
        </InfoP>
      </InfoSection>

      <InfoSection title="Password Entropy by Length and Character Set">
        <InfoTable
          headers={['Length', 'Lowercase only (26)', 'Alphanumeric (62)', 'All ASCII (94)', 'Entropy (all ASCII)']}
          rows={[
            ['8 chars',  '38 bits',  '48 bits',  '52 bits',  'Minimum for most sites — crack in hours'],
            ['12 chars', '56 bits',  '71 bits',  '79 bits',  'Good for most accounts'],
            ['16 chars', '75 bits',  '95 bits',  '105 bits', 'Excellent; brute-force infeasible for decades'],
            ['20 chars', '94 bits',  '119 bits', '131 bits', 'Strong even against future quantum computers'],
            ['24 chars', '113 bits', '143 bits', '157 bits', 'Beyond any foreseeable attack capability'],
            ['32 chars', '150 bits', '190 bits', '210 bits', 'Effectively unbreakable; use for master passwords'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Time to Crack: Modern Hardware Estimates">
        <InfoP>
          A modern GPU cluster can test billions of password hashes per second against unsalted MD5 or
          SHA-1 hashes (still used by many older systems). Against properly hashed passwords (bcrypt,
          Argon2, scrypt) the rate drops to thousands per second, making even shorter passwords much
          safer in well-designed systems. These estimates assume an offline attack on a stolen hash:
        </InfoP>
        <InfoTable
          headers={['Password Complexity', 'MD5 (fast hash)', 'bcrypt cost=12']}
          rows={[
            ['6 lowercase chars',           '< 1 second',    '< 1 minute'],
            ['8 mixed alphanumeric',         '< 1 hour',      '~6 months'],
            ['10 mixed with symbols',        '~2 years',      'Centuries'],
            ['12 fully random (all chars)',  'Millennia',     'Effectively never'],
            ['16 fully random (all chars)',  'Never',         'Never'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Password Manager: The Only Practical Solution">
        <InfoP>
          The average internet user has 80–100 online accounts. Remembering unique, high-entropy passwords
          for each is humanly impossible without a password manager. A password manager stores all your
          passwords encrypted behind a single master password, which should be a long passphrase (5–6
          random words) that you can actually remember.
        </InfoP>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Bitwarden (Free / Open Source)', body: 'End-to-end encrypted, open source, cross-platform. Free tier covers all core features. Self-hosting is possible for technical users.' },
            { title: '1Password', body: 'Best UI/UX; travel mode hides vaults at border crossings. Business plans include team sharing and admin controls. Paid only.' },
            { title: 'Dashlane', body: 'Includes a built-in VPN on paid plans. Dark web monitoring alerts you if your email appears in known data breaches.' },
            { title: 'Apple Keychain / iCloud', body: 'Built into macOS/iOS; zero extra cost. Limited to Apple ecosystem; passkey support is excellent. No Windows/Android app.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Passphrase vs Random Password">
        <InfoP>
          A passphrase is a sequence of random words (e.g. "correct horse battery staple") — famously
          illustrated by xkcd. Passphrases are highly memorable and can achieve excellent entropy through
          length alone. A 5-word passphrase from a 7,000-word dictionary has approximately 62 bits of
          entropy — comparable to a 10-character random password with all character types.
        </InfoP>
        <InfoTable
          headers={['Type', 'Example', 'Entropy', 'Memorability']}
          rows={[
            ['Random (12 chars)',   'x#K9mP!2qLzR',          '~79 bits', 'Very low'],
            ['Passphrase (4 words)','correct horse battery staple', '~51 bits', 'High'],
            ['Passphrase (5 words)','violet lamp ocean bronze dawn', '~64 bits', 'Good'],
            ['Passphrase (6 words)','piano jungle storm eleven copper drift', '~77 bits', 'Moderate'],
            ['Random (20 chars)',   'hT!p7Wm#2kLqZx9yRv1@', '~131 bits', 'Very low'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="Are passwords generated in this tool stored anywhere?" a="No. All password generation runs entirely in your browser using the Web Crypto API. No password, no setting, and no session data is transmitted to any server." />
          <FaqItem q="What is HIBP (Have I Been Pwned)?" a="Have I Been Pwned is a free service that checks whether an email address or password appears in known data breach datasets. A password that appears in breach lists can be cracked instantly via lookup tables, regardless of its complexity." />
          <FaqItem q="Should I use the same password generator settings every time?" a="Use the maximum settings your target site allows. Most modern sites accept at least 16-character passwords with all character types. Some legacy systems restrict length or prohibit symbols — adjust accordingly." />
          <FaqItem q="What is two-factor authentication (2FA) and should I use it?" a="2FA adds a second verification step (a time-based one-time code from an app like Google Authenticator or Authy) after your password. Even if an attacker has your password, they cannot log in without the second factor. Always enable 2FA on email, banking, and cloud storage accounts." />
        </div>
      </InfoSection>

    </div>
  );
}

export default PasswordGenTool;
