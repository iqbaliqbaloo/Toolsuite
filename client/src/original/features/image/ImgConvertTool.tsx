import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Image: Convert ───────────────────────────────────────────────────────────


function ImgConvertTool() {
  const [file, setFile] = useState(null);
  const [to, setTo] = useState('webp');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('to', to);
      const r = await apiUpload('/image/convert', fd);
      const blob = await r.blob();
      setResult({ blob });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <FileDropzone onFile={setFile} accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.avif" files={file} />
      {file && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <SelectField label="Convert to" value={to} onChange={setTo}>
            <option value="webp">WebP</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="avif">AVIF</option>
            <option value="bmp">BMP</option>
            <option value="tiff">TIFF</option>
            <option value="gif">GIF</option>
          </SelectField>
          <Btn loading={loading} onClick={run}><Icon name="RefreshCw" size={15} /> Convert</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-[14px] font-semibold text-[var(--text-primary)]">Converted to {to.toUpperCase()}</p>
            <Btn variant="secondary" onClick={() => dlBlob(result.blob, `converted.${to}`)}>
              <Icon name="Download" size={14} /> Download .{to}
            </Btn>
          </div>
        </ResultPanel>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <ImgConvertInfoContent />
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

function ImgConvertInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="Why Convert Between Image Formats?">
        <InfoP>
          Different image formats were designed with different priorities in mind — some optimise for
          photographic fidelity, others for small file sizes, lossless reproduction, or animation support.
          Converting between formats lets you match the right format to your use case: a PNG screenshot
          converted to WebP can be 60–70% smaller with no visible quality loss; a HEIC photo from an iPhone
          converted to JPEG becomes universally compatible with all browsers and apps.
        </InfoP>
        <InfoP>
          Format conversion is also frequently necessary for platform compliance: app stores, e-commerce
          platforms, social networks, and content management systems each impose their own format requirements.
          Understanding the strengths of each format helps you make the best conversion choice.
        </InfoP>
      </InfoSection>

      <InfoSection title="Complete Image Format Guide">
        <InfoTable
          headers={['Format', 'Full Name', 'Compression', 'Transparency', 'Animation', 'Best Use']}
          rows={[
            ['JPG/JPEG', 'Joint Photographic Experts Group', 'Lossy',    'No',  'No',  'Photos, social media, email'],
            ['PNG',      'Portable Network Graphics',        'Lossless', 'Yes', 'No',  'Screenshots, logos, UI assets'],
            ['WebP',     'Web Picture format (Google)',      'Both',     'Yes', 'Yes', 'Web images, all modern browsers'],
            ['AVIF',     'AV1 Image File Format',            'Both',     'Yes', 'Yes', 'Next-gen web, HDR content'],
            ['GIF',      'Graphics Interchange Format',      'Lossless', 'Yes', 'Yes', 'Simple animations, memes'],
            ['BMP',      'Bitmap Image File',                'None',     'Yes', 'No',  'Legacy Windows, raw editing'],
            ['TIFF',     'Tagged Image File Format',         'Both',     'Yes', 'No',  'Print, archiving, scanning'],
            ['HEIC',     'High Efficiency Image Container',  'Lossy',    'Yes', 'Yes', 'Apple devices, iOS photos'],
          ]}
        />
      </InfoSection>

      <InfoSection title="When to Use Each Format">
        <InfoP>
          Choosing the wrong format wastes bandwidth, degrades quality, or breaks compatibility. Here are
          the most common use-case decisions:
        </InfoP>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Website hero images & banners', body: 'Use WebP or AVIF. They deliver the same visual quality as JPEG at 25–50% smaller sizes, directly improving LCP scores.' },
            { title: 'Logos & icons with transparency', body: 'Use PNG for maximum compatibility, or WebP if all visitors use modern browsers. Never use JPEG — it cannot handle transparency.' },
            { title: 'Product photos for e-commerce', body: 'Use WebP at quality 80–85. Most platforms (Shopify, WooCommerce) serve WebP natively and it dramatically speeds up category pages.' },
            { title: 'Print and archiving', body: 'Use TIFF or PNG for lossless fidelity. Print workflows require at minimum 300 DPI; JPEG compression artefacts become visible in print.' },
            { title: 'Social media uploads', body: 'Each platform re-compresses your image on upload anyway. Upload at the recommended dimensions in high-quality JPEG or PNG.' },
            { title: 'Email attachments', body: 'Use JPEG for photos and PNG for graphics. AVIF/WebP have limited email client support. Aim for under 1 MB to avoid spam filters.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Colour Space & Metadata Considerations">
        <InfoP>
          When converting between formats, colour space and embedded metadata (EXIF data — camera settings,
          GPS coordinates, date/time) are often affected. Key points to know:
        </InfoP>
        <InfoTable
          headers={['Issue', 'What Happens', 'Action']}
          rows={[
            ['sRGB → CMYK',      'Most web formats only support sRGB; CMYK images need to be converted before web use', 'Convert in Photoshop before uploading for print workflows'],
            ['EXIF data',        'Metadata (GPS, camera model) may be stripped or preserved depending on the converter', 'Strip EXIF for privacy if sharing publicly; keep for archiving'],
            ['ICC colour profile','Profile determines how colours render across devices; may be discarded on conversion', 'Embed sRGB profile for maximum cross-device consistency'],
            ['Alpha channel',    'Converting PNG/WebP with transparency to JPEG removes the alpha; background becomes white', 'Use PNG or WebP as the output format if transparency is required'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="Does converting PNG to JPEG lose quality?" a="Yes. PNG is lossless; JPEG is lossy. The first conversion from PNG to JPEG permanently discards some image data. If you later convert back to PNG, the quality loss is already baked in." />
          <FaqItem q="Can I convert a HEIC file from my iPhone?" a="Yes. HEIC (High Efficiency Image Container) is Apple's default photo format. Converting to JPEG or PNG makes the photo universally compatible with Windows, Android, and web applications." />
          <FaqItem q="What format should I use for transparent backgrounds?" a="PNG is the safest choice for maximum compatibility. WebP also supports transparency and is 30–40% smaller. Avoid JPEG, GIF (limited colours), and BMP for complex transparent images." />
          <FaqItem q="Is AVIF supported by all browsers?" a="As of 2025, AVIF is supported by Chrome, Firefox, Safari, and Edge — over 94% of global browser market share. The main exception is older browsers and some mobile webviews." />
        </div>
      </InfoSection>

    </div>
  );
}

export default ImgConvertTool;
