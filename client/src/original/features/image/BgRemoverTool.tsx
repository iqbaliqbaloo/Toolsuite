// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Image: Background Remover ────────────────────────────────────────────────


function BgRemoverTool() {
  const [file,     setFile]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResultUrl(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch(
        `${window.TOOLSUITE_API_URL || 'http://localhost:3001/api/v1'}/image/remove-background`,
        { method: 'POST', body: fd },
      );
      if (r.ok) {
        const blob = await r.blob();
        setResultUrl(URL.createObjectURL(blob));
      } else {
        const j = await r.json();
        setError(j.message || 'Background removal failed.');
      }
    } catch (e) {
      setError('Could not reach the server. Make sure the backend is running.');
    }
    setLoading(false);
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'background-removed.png';
    a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <FileDropzone onFile={f => { setFile(f); setResultUrl(null); setError(null); }} accept=".jpg,.jpeg,.png,.webp" files={file} />

      {file && !resultUrl && (
        <Btn loading={loading} onClick={run}>
          <Icon name="Scissors" size={15} /> Remove Background
        </Btn>
      )}

      {error && (
        <InfoAlert>
          <strong>Error:</strong> {error}
          {error.includes('REMOVE_BG_API_KEY') && (
            <p className="mt-1 text-[12px]">
              Get a free API key at <strong>remove.bg</strong> (50 free credits/month), then add{' '}
              <code className="text-[var(--accent)]">REMOVE_BG_API_KEY=your_key</code> to{' '}
              <code>backend/.env</code> and restart the server.
            </p>
          )}
        </InfoAlert>
      )}

      {resultUrl && (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,white_0%_50%)] bg-[length:20px_20px]">
            <img src={resultUrl} alt="Background removed" className="w-full object-contain max-h-80" />
          </div>
          <div className="flex gap-2">
            <Btn onClick={download}><Icon name="Download" size={14} /> Download PNG</Btn>
            <button
              onClick={() => { setFile(null); setResultUrl(null); setError(null); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
              New Image
            </button>
          </div>
        </div>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <BgRemoverInfoContent />
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

function BgRemoverInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="How AI Background Removal Works">
        <InfoP>
          Modern AI background removal uses deep learning segmentation models — typically a convolutional
          neural network (CNN) or Vision Transformer — trained on millions of labelled images. The model
          predicts a pixel-level "alpha mask" that classifies each pixel as foreground (keep) or background
          (remove). The output is a transparent PNG where background pixels have been deleted.
        </InfoP>
        <InfoP>
          The best models are trained on diverse datasets including humans, animals, products, vehicles,
          and everyday objects against complex backgrounds. They learn to detect semantic edges (the
          boundary between subject and background) even when the contrast is low — something traditional
          chroma-keying cannot do without a controlled studio environment.
        </InfoP>
      </InfoSection>

      <InfoSection title="Background Removal Use Cases">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'E-commerce product photos', body: 'Marketplace platforms like Amazon, eBay, and Etsy require clean white or transparent backgrounds. AI removal saves hours of manual masking per photo shoot.' },
            { title: 'Professional headshots', body: 'Remove office clutter or distracting backgrounds from LinkedIn or ID photos. Replace with a professional solid colour or branded backdrop.' },
            { title: 'Marketing materials', body: 'Extract product shots for brochures, social media ads, and banner images without needing a professional studio setup or green screen.' },
            { title: 'App & UI design', body: 'Designers use transparent PNGs to composite product images, icons, and illustrations directly into mockups without dealing with unwanted backgrounds.' },
            { title: 'Virtual backgrounds', body: 'Create custom backgrounds for video calls, presentations, or social media posts by combining a background-removed portrait with a different scene.' },
            { title: 'Photography editing', body: 'Photographers replace skies, change environments, or composite multiple shots — all workflows that start with accurate background removal.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="AI vs Manual Background Removal">
        <InfoTable
          headers={['Method', 'Speed', 'Quality on Hair/Fur', 'Cost', 'Best For']}
          rows={[
            ['AI (this tool)',       '3–5 seconds',  'Good to excellent', 'Free / low cost', 'Batch processing, quick edits'],
            ['Photoshop Select Subject', '10–30 sec', 'Excellent',        'Subscription',    'High-end retouching, fine detail'],
            ['Manual pen tool',      '5–30 min',     'Perfect',           'Time/labour',     'Complex subjects, critical deadlines'],
            ['Chroma key (green screen)', '< 1 sec', 'Excellent',         'Studio setup',    'Video production, broadcast'],
            ['Canva Magic Eraser',   '5–10 sec',     'Good',              'Subscription',    'Social media, quick collages'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Getting the Best Results">
        <InfoP>
          AI background removal works best under certain conditions. Follow these tips to maximise accuracy:
        </InfoP>
        <InfoTable
          headers={['Tip', 'Detail']}
          rows={[
            ['Use high contrast',      'Subjects with clear contrast against the background are easier to segment accurately.'],
            ['Avoid busy backgrounds', 'Cluttered or textured backgrounds (brick walls, grass, crowds) confuse edge detection.'],
            ['Higher resolution',      'Provide at least 800×800 px for good results; professional outputs should be 2000 px+.'],
            ['Well-lit subjects',      'Even, soft lighting with no harsh shadows reduces segmentation errors along edges.'],
            ['Single subject',         'Multiple overlapping subjects (two people hugging) are harder to separate cleanly.'],
            ['Hair & fine detail',     'Wispy hair is the hardest case — AI quality varies; manual touch-up may be needed.'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="What file format is the output?" a="Background-removed images are saved as PNG because JPEG does not support transparency (alpha channel). PNG preserves the transparent pixels so you can composite the subject onto any new background." />
          <FaqItem q="Why does the AI sometimes leave a faint halo?" a="Halo artefacts occur when the alpha mask includes semi-transparent pixels from the original background colour. Reducing the contrast between subject and background in post-processing, or using a tool's 'defringe' option, usually removes halos." />
          <FaqItem q="Can this tool handle group photos?" a="AI models segment the entire foreground by subject category — so a group of people would typically be treated as a single foreground subject. Individual person extraction from a group requires manual masking." />
          <FaqItem q="Does background removal work on animals and products?" a="Yes. Good AI models are trained on diverse categories including animals, cars, furniture, clothing, shoes, and food. Product shot accuracy is especially high because product images have consistent lighting and clear boundaries." />
        </div>
      </InfoSection>

    </div>
  );
}

export default BgRemoverTool;
