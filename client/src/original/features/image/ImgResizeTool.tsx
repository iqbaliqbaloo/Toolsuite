import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Image: Resize ────────────────────────────────────────────────────────────


function ImgResizeTool() {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [fit, setFit] = useState('inside');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    if (!width && !height) { setError('Enter at least one of width or height.'); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (width)  fd.append('width', width);
      if (height) fd.append('height', height);
      fd.append('fit', fit);
      const r = await apiUpload('/image/resize', fd);
      const blob = await r.blob();
      setResult({ blob, w: r.headers.get('X-Width'), h: r.headers.get('X-Height') });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <FileDropzone onFile={setFile} accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.avif" files={file} />
      {file && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <NumberInput label="Width (px)" value={width} onChange={setWidth} min="1" placeholder="auto" />
          <NumberInput label="Height (px)" value={height} onChange={setHeight} min="1" placeholder="auto" />
          <SelectField label="Fit mode" value={fit} onChange={setFit}>
            <option value="inside">Inside (contain)</option>
            <option value="cover">Cover (crop)</option>
            <option value="fill">Fill (stretch)</option>
            <option value="contain">Contain (letterbox)</option>
          </SelectField>
          <Btn loading={loading} onClick={run}><Icon name="Expand" size={15} /> Resize</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Image resized</p>
              {result.w && result.h && (
                <p className="text-[12.5px] text-[var(--text-tertiary)] mt-0.5">{result.w}×{result.h}px</p>
              )}
            </div>
            <Btn variant="secondary" onClick={() => dlBlob(result.blob, 'resized.jpg')}>
              <Icon name="Download" size={14} /> Download
            </Btn>
          </div>
        </ResultPanel>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <ImgResizeInfoContent />
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

function ImgResizeInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="What Does Image Resizing Actually Do?">
        <InfoP>
          Image resizing changes the pixel dimensions (width and height) of an image. When you resize an
          image smaller (downscale), pixels are averaged and combined — the process is called downsampling.
          When you resize an image larger (upscale), the software must estimate what the new pixels should
          look like — this is called interpolation or upsampling. Downscaling almost always produces clean
          results; upscaling can introduce blurriness or pixelation beyond a certain enlargement factor
          (typically 2–3×), which is why AI upscaling techniques were developed.
        </InfoP>
        <InfoP>
          Resizing is distinct from cropping (which changes the composition by removing parts of the frame)
          and compression (which reduces file size without changing pixel count). All three operations are
          often used together as part of image preparation pipelines for websites, print, and mobile apps.
        </InfoP>
      </InfoSection>

      <InfoSection title="Social Media Image Size Reference">
        <InfoP>
          Every social media platform has recommended (and sometimes enforced) image dimensions. Using the
          wrong size results in cropping, stretching, or quality loss applied by the platform's own
          compression pipeline.
        </InfoP>
        <InfoTable
          headers={['Platform', 'Type', 'Width × Height (px)', 'Aspect Ratio']}
          rows={[
            ['Instagram', 'Square post',         '1080 × 1080', '1:1'],
            ['Instagram', 'Portrait post',        '1080 × 1350', '4:5'],
            ['Instagram', 'Landscape post',       '1080 × 566',  '1.91:1'],
            ['Instagram', 'Story / Reel',         '1080 × 1920', '9:16'],
            ['Facebook',  'Cover photo',          '851 × 315',   '2.7:1'],
            ['Facebook',  'Shared link preview',  '1200 × 630',  '1.91:1'],
            ['Twitter/X', 'In-stream photo',      '1600 × 900',  '16:9'],
            ['Twitter/X', 'Profile picture',      '400 × 400',   '1:1'],
            ['LinkedIn',  'Cover image',          '1584 × 396',  '4:1'],
            ['LinkedIn',  'Shared image',         '1200 × 627',  '1.91:1'],
            ['YouTube',   'Thumbnail',            '1280 × 720',  '16:9'],
            ['Pinterest', 'Standard pin',         '1000 × 1500', '2:3'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Resize Fit Modes Explained">
        <InfoP>
          When the target dimensions have a different aspect ratio than the source image, the resize algorithm
          must decide how to handle the discrepancy. The four common strategies are:
        </InfoP>
        <InfoTable
          headers={['Mode', 'Behaviour', 'When to Use']}
          rows={[
            ['Inside (contain)', 'Scales to fit within the bounds; may leave empty space on sides or top/bottom', 'Thumbnails, previews where whole image must be visible'],
            ['Cover (crop)',     'Scales to fill the bounds completely; crops the overflow', 'Social media profile pictures, hero banners, square thumbnails'],
            ['Fill (stretch)',   'Stretches to exactly fill; distorts proportions if aspect ratios differ', 'Rarely recommended; use only when exact pixel dimensions are mandatory'],
            ['Contain (letterbox)', 'Adds padding/background to fill the remainder after fitting inside', 'Video thumbnails, product listings requiring uniform dimensions'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Resolution and DPI for Print vs Web">
        <InfoP>
          Pixels Per Inch (PPI) and Dots Per Inch (DPI) describe image resolution — how many pixels are
          packed into each inch of the output. For screens, resolution is irrelevant because the display
          driver controls pixel size. For print, resolution is critical:
        </InfoP>
        <InfoTable
          headers={['Output Type', 'Recommended DPI', 'Min Pixel Size for A4']}
          rows={[
            ['Website / screen',   '72–96 DPI',  'Any size, DPI is ignored'],
            ['Desktop publishing', '150 DPI',    '1240 × 1754 px'],
            ['Standard print',     '300 DPI',    '2480 × 3508 px'],
            ['Large format print', '150–200 DPI', '4960+ × 7016+ px'],
            ['Offset printing',    '300–600 DPI', '2480–4960 × 3508–7016 px'],
          ]}
        />
        <InfoP>
          To calculate the minimum pixel dimensions for a print size: multiply the physical dimension in
          inches by the target DPI. For an A4 sheet at 300 DPI: 8.27 in × 300 = 2481 px wide;
          11.69 in × 300 = 3508 px tall.
        </InfoP>
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="Can I resize an image without losing quality?" a="Downscaling (making smaller) almost never loses visible quality and often improves apparent sharpness. Upscaling (making larger) always involves estimation and can introduce blur. AI upscaling tools like Topaz Gigapixel can enlarge by up to 6× with good results." />
          <FaqItem q="What is the difference between resize and crop?" a="Resize changes the pixel dimensions of the entire image. Crop removes a portion of the image (changes composition). You can resize without cropping and crop without resizing, or do both together." />
          <FaqItem q="Why does my resized image look blurry?" a="Blurriness in upscaled images is caused by the interpolation algorithm estimating pixel values. For the best upscale quality, use a bicubic or Lanczos algorithm, or an AI super-resolution tool." />
          <FaqItem q="What is 'aspect ratio' and why does it matter?" a="Aspect ratio is the proportional relationship between width and height (e.g. 16:9, 4:3, 1:1). Maintaining the aspect ratio preserves the natural proportions of the image. Ignoring it causes the 'stretched' effect you see on poorly cropped social media images." />
        </div>
      </InfoSection>

    </div>
  );
}

export default ImgResizeTool;
