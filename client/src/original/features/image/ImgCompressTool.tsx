import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Image: Compress ──────────────────────────────────────────────────────────


function ImgCompressTool() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState('80');
  const [format, setFormat] = useState('webp');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('quality', quality);
      fd.append('outputFormat', format);
      const r = await apiUpload('/image/compress', fd);
      const blob = await r.blob();
      setResult({
        blob,
        orig: r.headers.get('X-Original-Size'),
        out: r.headers.get('X-Output-Size'),
        w: r.headers.get('X-Width'),
        h: r.headers.get('X-Height'),
      });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <FileDropzone onFile={setFile} accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.avif" files={file} />
      {file && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <SelectField label="Output format" value={format} onChange={setFormat}>
            <option value="webp">WebP (best compression)</option>
            <option value="jpg">JPEG</option>
            <option value="png">PNG</option>
            <option value="avif">AVIF</option>
          </SelectField>
          <NumberInput label="Quality (1–100)" value={quality}
            onChange={v => setQuality(String(Math.min(100, Math.max(1, parseInt(v) || 80))))}
            min="1" max="100" />
          <Btn loading={loading} onClick={run}><Icon name="Minimize2" size={15} /> Compress</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Compression complete</p>
              {result.orig && result.out && (
                <p className="text-[12.5px] text-[var(--text-tertiary)] mt-0.5">
                  {fmtBytes(result.orig)} → {fmtBytes(result.out)}
                  {result.w && result.h ? ` • ${result.w}×${result.h}px` : ''}
                </p>
              )}
            </div>
            <Btn variant="secondary" onClick={() => dlBlob(result.blob, `compressed.${format}`)}>
              <Icon name="Download" size={14} /> Download
            </Btn>
          </div>
        </ResultPanel>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <ImgCompressInfoContent />
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

function ImgCompressInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="What is Image Compression?">
        <InfoP>
          Image compression is the process of reducing the file size of a digital image by encoding image data
          more efficiently. Every pixel in an image is stored as colour data; compression algorithms find
          patterns and redundancies in that data and represent them with fewer bits. The result is a smaller
          file that loads faster, consumes less bandwidth, and takes up less storage — with varying degrees
          of visual quality depending on the technique used.
        </InfoP>
        <InfoP>
          There are two fundamental types of image compression: lossless and lossy. Lossless compression
          (used by PNG and GIF) removes redundant metadata without discarding any visual information, allowing
          a pixel-perfect reconstruction of the original. Lossy compression (used by JPEG, WebP, and AVIF)
          permanently discards some visual data — typically fine details the human eye can barely perceive
          — in exchange for dramatically smaller file sizes.
        </InfoP>
      </InfoSection>

      <InfoSection title="Image Format Comparison">
        <InfoP>
          Choosing the right format before compressing can make as much difference as the compression level itself.
          Here is how the most common formats compare:
        </InfoP>
        <InfoTable
          headers={['Format', 'Type', 'Typical Size vs JPEG', 'Best For']}
          rows={[
            ['JPEG / JPG', 'Lossy',    'Baseline',      'Photos, complex scenes, social media'],
            ['WebP',       'Lossy/Lossless', '25–35% smaller', 'Web images, thumbnails, hero banners'],
            ['AVIF',       'Lossy/Lossless', '40–50% smaller', 'Next-gen web, HDR photos, streaming'],
            ['PNG',        'Lossless', '2–5× larger',   'Screenshots, logos, transparent images'],
            ['GIF',        'Lossless', 'Similar to PNG', 'Short animations, simple graphics'],
            ['BMP',        'Uncompressed', '3–10× larger', 'Raw editing, legacy Windows apps'],
          ]}
        />
      </InfoSection>

      <InfoSection title="How Quality Settings Work">
        <InfoP>
          Most lossy codecs expose a quality parameter (typically 1–100) that controls the trade-off between
          file size and visual fidelity. At quality 100 the codec applies minimal compression and the output
          is nearly indistinguishable from the original. At quality 1 the file is tiny but noticeably
          degraded. The sweet spot for most use cases is quality 70–85:
        </InfoP>
        <InfoTable
          headers={['Quality Range', 'Visual Result', 'Typical Use']}
          rows={[
            ['90–100', 'Near-lossless; file savings 10–20%',  'Professional photography, print-ready assets'],
            ['80–89',  'Excellent; file savings 40–55%',       'E-commerce product images, editorial photos'],
            ['70–79',  'Very good; file savings 55–70%',       'Blog images, social media, thumbnails'],
            ['50–69',  'Good; file savings 70–80%',            'Email newsletters, low-bandwidth pages'],
            ['20–49',  'Noticeable artefacts; savings 80–90%', 'Previews, placeholder images'],
            ['1–19',   'Highly degraded; savings 90%+',        'Not recommended for production use'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Impact of Image Size on Web Performance">
        <InfoP>
          Images typically account for 50–75% of a web page's total download weight. Page speed directly
          affects search engine rankings (Google uses Core Web Vitals as a ranking signal), user experience,
          and conversion rates. Studies show:
        </InfoP>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Largest Contentful Paint (LCP)', body: 'Google targets LCP under 2.5 seconds. Oversized hero images are the most common cause of LCP failures on mobile.' },
            { title: 'Cumulative Layout Shift (CLS)', body: 'Images without defined width/height attributes cause layout shifts as they load, hurting CLS scores and UX.' },
            { title: 'Bandwidth Cost', body: 'A 1 MB image served to 100,000 monthly visitors uses ~100 GB of data transfer — a real cost for CDN and hosting budgets.' },
            { title: 'Mobile Penalty', body: 'Mobile connections are often 3–4× slower than desktop. Uncompressed images cause the largest engagement drop on mobile.' },
            { title: 'Conversion Impact', body: 'Akamai research found a 100 ms delay in page load time reduces conversion rates by 7%. Image optimisation is the fastest fix.' },
            { title: 'SEO Benefit', body: 'Google PageSpeed Insights ranks image compression as its highest-priority recommendation for most websites.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="WebP vs AVIF: The Modern Standard">
        <InfoP>
          WebP, developed by Google and released in 2010, replaced JPEG as the de-facto web image format
          for most publishers. It supports both lossy and lossless compression, transparency (like PNG),
          and animation (like GIF) — all in a single format. AVIF, released in 2019 and based on the AV1
          video codec, offers even better compression ratios than WebP at the same visual quality.
        </InfoP>
        <InfoTable
          headers={['Feature', 'JPEG', 'WebP', 'AVIF']}
          rows={[
            ['Lossy compression',      '✓', '✓', '✓'],
            ['Lossless compression',   '✗', '✓', '✓'],
            ['Transparency (alpha)',   '✗', '✓', '✓'],
            ['Animation',              '✗', '✓', '✓'],
            ['HDR / Wide colour',      '✗', '✗', '✓'],
            ['Browser support (2025)', '100%', '97%', '94%'],
            ['Compression efficiency', 'Baseline', '+25–35%', '+40–50%'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="Does compressing an image reduce its dimensions?" a="No. Compression reduces file size by encoding the pixel data more efficiently, not by changing the number of pixels. To reduce dimensions (width/height) use the Image Resizer tool." />
          <FaqItem q="Can I compress an image that was already compressed?" a="Yes, but with diminishing returns. Each round of lossy compression introduces additional quality loss. It is best to start from the original or the highest-quality copy you have." />
          <FaqItem q="What quality setting should I use for product photos?" a="Quality 80–85 in WebP or AVIF is the standard for e-commerce product images. It typically reduces file sizes by 50–60% compared to the original JPEG at quality 100 while remaining visually indistinguishable to shoppers." />
          <FaqItem q="Will my images be stored on your server?" a="No. Your images are processed server-side and deleted immediately after the response is returned. We do not store, index, or retain any uploaded files." />
        </div>
      </InfoSection>

    </div>
  );
}

export default ImgCompressTool;
