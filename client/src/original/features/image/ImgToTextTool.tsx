import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Image: To Text (OCR) ─────────────────────────────────────────────────────


function ImgToTextTool() {
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState('eng');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('lang', lang);
      const r = await apiUpload('/image/to-text', fd);
      const j = await r.json();
      setResult(j.data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <FileDropzone onFile={setFile} accept=".jpg,.jpeg,.png,.webp,.bmp,.tiff" files={file} />
      {file && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <SelectField label="Language" value={lang} onChange={setLang}>
            <option value="eng">English</option>
            <option value="fra">French</option>
            <option value="deu">German</option>
            <option value="spa">Spanish</option>
            <option value="chi_sim">Chinese (Simplified)</option>
            <option value="ara">Arabic</option>
            <option value="urd">Urdu</option>
            <option value="hin">Hindi</option>
          </SelectField>
          <Btn loading={loading} onClick={run}><Icon name="ScanText" size={15} /> Extract Text</Btn>
        </div>
      )}
      {error && <ErrAlert>{error}</ErrAlert>}
      {result && (
        <ResultPanel>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Text extracted</p>
              <p className="text-[12.5px] text-[var(--text-tertiary)] mt-0.5">
                {result.wordCount} words • {result.confidence}% confidence
              </p>
            </div>
            <CopyBtn text={result.text} />
          </div>
          <pre className="whitespace-pre-wrap text-[13px] text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-tertiary)] rounded-xl p-4 max-h-64 overflow-y-auto font-mono">
            {result.text || '(no text detected)'}
          </pre>
        </ResultPanel>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <ImgToTextInfoContent />
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

function ImgToTextInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="What is Optical Character Recognition (OCR)?">
        <InfoP>
          Optical Character Recognition (OCR) is the technology that converts images containing text —
          scanned documents, photographs of signs, screenshots, or handwritten notes — into machine-readable,
          editable text. OCR engines analyse the shapes and patterns of characters in an image and match
          them against trained character models to produce a transcription.
        </InfoP>
        <InfoP>
          Modern OCR systems use deep learning neural networks trained on hundreds of millions of text
          samples across dozens of scripts and typefaces. This gives them the ability to recognise not
          just printed text but also handwriting, unusual fonts, degraded documents, and text in complex
          backgrounds — tasks that were impossible with the rule-based OCR engines of the 1990s.
        </InfoP>
      </InfoSection>

      <InfoSection title="OCR Accuracy Factors">
        <InfoP>
          OCR accuracy varies significantly depending on input quality. Understanding what affects accuracy
          helps you prepare images that produce better results:
        </InfoP>
        <InfoTable
          headers={['Factor', 'Impact on Accuracy', 'Recommended Setting']}
          rows={[
            ['Image resolution',  'Very high',  'Minimum 200 DPI; ideally 300–400 DPI for scanned documents'],
            ['Contrast',          'High',        'High contrast between text and background; avoid grey-on-grey'],
            ['Skew / rotation',   'Medium',      'Deskew before OCR; most engines handle up to 10° automatically'],
            ['Font type',         'Medium',      'Serif and sans-serif fonts extract well; decorative fonts reduce accuracy'],
            ['Noise / artefacts', 'High',        'Clean scans; avoid heavily compressed JPEG for OCR input'],
            ['Language model',    'High',        'Select the correct language to enable dictionary-based correction'],
            ['Text colour',       'Medium',      'Black text on white background is optimal; coloured text acceptable'],
          ]}
        />
      </InfoSection>

      <InfoSection title="OCR Language Support">
        <InfoP>
          Our OCR engine (Tesseract) supports over 100 languages and writing systems. Here are the most
          commonly used language codes and their writing systems:
        </InfoP>
        <InfoTable
          headers={['Language', 'Script', 'Code', 'Notes']}
          rows={[
            ['English',              'Latin',    'eng', 'Default; highest accuracy'],
            ['French',               'Latin',    'fra', 'Includes accented characters'],
            ['German',               'Latin',    'deu', 'Handles Umlauts (ä, ö, ü, ß)'],
            ['Spanish',              'Latin',    'spa', 'Includes ñ and accent marks'],
            ['Arabic',               'Arabic',   'ara', 'Right-to-left; requires RTL post-processing'],
            ['Chinese (Simplified)', 'Han',      'chi_sim', '~3,500 most common characters'],
            ['Chinese (Traditional)','Han',      'chi_tra', 'Traditional character set'],
            ['Japanese',             'CJK',      'jpn', 'Hiragana + Katakana + Kanji'],
            ['Korean',               'Hangul',   'kor', 'Hangul syllabic alphabet'],
            ['Hindi',                'Devanagari','hin', 'Most widely spoken Devanagari script'],
            ['Urdu',                 'Nastaliq', 'urd', 'Right-to-left Perso-Arabic script'],
            ['Russian',              'Cyrillic', 'rus', 'Full Cyrillic alphabet support'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Use Cases for Image-to-Text Conversion">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Document digitisation', body: 'Convert paper documents, books, and physical records into searchable, editable digital text for archiving or content management systems.' },
            { title: 'Receipt & invoice processing', body: 'Extract line items, totals, and vendor information from receipts for expense management or accounting software integration.' },
            { title: 'Business card scanning', body: 'Extract contact information from business card photos and import into CRM systems or address books automatically.' },
            { title: 'Translating foreign text', body: 'Extract text from signs, menus, or documents in foreign languages, then paste into a translation service to get an instant translation.' },
            { title: 'Data entry automation', body: 'OCR eliminates manual re-typing of data from forms, certificates, contracts, and identification documents — reducing errors and saving hours.' },
            { title: 'Accessibility', body: 'Convert image-based PDFs (scanned documents) into real text so they can be read by screen readers and assistive technologies for visually impaired users.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="Can OCR read handwriting?" a="Modern AI-based OCR engines can recognise neat printed handwriting with reasonable accuracy (70–90%). Cursive or heavily stylised handwriting is significantly harder and may require dedicated handwriting recognition models." />
          <FaqItem q="Why does my confidence score show a low percentage?" a="Low confidence usually indicates image quality issues: low resolution, poor contrast, skewed text, or a language mismatch. Try scanning at a higher DPI or selecting the correct language." />
          <FaqItem q="Can OCR preserve document formatting?" a="Basic OCR returns plain text in reading order. Advanced 'layout-aware' OCR can attempt to preserve paragraph structure and table formatting, but it is inherently imperfect — always review extracted text before use." />
          <FaqItem q="How does OCR handle tables in documents?" a="Table extraction from images is challenging. Many OCR engines return the text in reading order (left-to-right, top-to-bottom) which may scramble column order. Dedicated table extraction tools (like document AI platforms) handle this better." />
        </div>
      </InfoSection>

    </div>
  );
}

export default ImgToTextTool;
