// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import { Btn, ErrAlert, InfoAlert, ResultPanel, Label, SelectField, NumberInput, CopyBtn, FileDropzone, TextareaInput, ScoreBadge } from '../../components/ui/shared';
import { apiUpload, apiPost } from '../../services/api';
import { fmtBytes, dlBlob } from '../../utils/helpers';

// ─── Image: Watermark Remover ─────────────────────────────────────────────────


function WatermarkRemoveTool() {
  const [file,      setFile]      = useState(null);
  const [imgSrc,    setImgSrc]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [mode,      setMode]      = useState('auto');   // 'auto' | 'manual'
  const [region,    setRegion]    = useState(null);     // { x, y, w, h } in natural px
  const [drawing,   setDrawing]   = useState(false);
  const [startPt,   setStartPt]   = useState(null);
  const [currentPt, setCurrentPt] = useState(null);
  const canvasRef   = useRef(null);
  const imgRef      = useRef(null);

  // Load preview when file changes
  useEffect(() => {
    if (!file) { setImgSrc(null); setRegion(null); return; }
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setRegion(null);
    setResultUrl(null);
    setError(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Redraw canvas overlay whenever drawing state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (region) {
      const scaleX = canvas.width  / img.naturalWidth;
      const scaleY = canvas.height / img.naturalHeight;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth   = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(region.x * scaleX, region.y * scaleY, region.w * scaleX, region.h * scaleY);
      ctx.fillStyle = 'rgba(59,130,246,0.12)';
      ctx.fillRect(region.x * scaleX, region.y * scaleY, region.w * scaleX, region.h * scaleY);
    }
    if (drawing && startPt && currentPt) {
      const x = Math.min(startPt.x, currentPt.x);
      const y = Math.min(startPt.y, currentPt.y);
      const w = Math.abs(currentPt.x - startPt.x);
      const h = Math.abs(currentPt.y - startPt.y);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth   = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = 'rgba(239,68,68,0.1)';
      ctx.fillRect(x, y, w, h);
    }
  }, [region, drawing, startPt, currentPt]);

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return null;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = img.naturalWidth  / canvas.width;
    const scaleY = img.naturalHeight / canvas.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top)  * scaleY),
      // canvas coordinates (for drawing)
      cx: e.clientX - rect.left,
      cy: e.clientY - rect.top,
    };
  };

  const onMouseDown = useCallback((e) => {
    if (mode !== 'manual') return;
    e.preventDefault();
    const pt = getCanvasPoint(e);
    if (!pt) return;
    setDrawing(true);
    setStartPt({ x: pt.cx, y: pt.cy, nx: pt.x, ny: pt.y });
    setCurrentPt({ x: pt.cx, y: pt.cy });
    setRegion(null);
  }, [mode]);

  const onMouseMove = useCallback((e) => {
    if (!drawing) return;
    const pt = getCanvasPoint(e);
    if (!pt) return;
    setCurrentPt({ x: pt.cx, y: pt.cy });
  }, [drawing]);

  const onMouseUp = useCallback((e) => {
    if (!drawing || !startPt) return;
    setDrawing(false);
    const pt = getCanvasPoint(e);
    if (!pt) return;
    const img = imgRef.current;
    const scaleX = img ? img.naturalWidth  / canvasRef.current.width  : 1;
    const scaleY = img ? img.naturalHeight / canvasRef.current.height : 1;
    const x = Math.round(Math.min(startPt.x, pt.cx) * scaleX);
    const y = Math.round(Math.min(startPt.y, pt.cy) * scaleY);
    const w = Math.round(Math.abs(pt.cx - startPt.x) * scaleX);
    const h = Math.round(Math.abs(pt.cy - startPt.y) * scaleY);
    if (w > 5 && h > 5) setRegion({ x, y, w, h });
    setStartPt(null); setCurrentPt(null);
  }, [drawing, startPt]);

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResultUrl(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (mode === 'auto') {
        fd.append('auto', 'true');
      } else if (region) {
        fd.append('x',      String(region.x));
        fd.append('y',      String(region.y));
        fd.append('width',  String(region.w));
        fd.append('height', String(region.h));
      } else {
        setError('Draw a rectangle over the watermark first, then click Remove.');
        setLoading(false);
        return;
      }
      const r = await fetch(
        `${window.TOOLSUITE_API_URL || 'http://localhost:3001/api/v1'}/image/remove-watermark`,
        { method: 'POST', body: fd },
      );
      if (r.ok) {
        const blob = await r.blob();
        setResultUrl(URL.createObjectURL(blob));
      } else {
        const j = await r.json();
        setError(j.message || 'Watermark removal failed.');
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
    a.download = 'watermark-removed.jpg';
    a.click();
  };

  const reset = () => { setFile(null); setImgSrc(null); setRegion(null); setResultUrl(null); setError(null); };

  return (
    <div className="flex flex-col gap-4">
      {!imgSrc && (
        <FileDropzone onFile={f => { setFile(f); setResultUrl(null); setError(null); }} accept=".jpg,.jpeg,.png,.webp" files={file} />
      )}

      {imgSrc && !resultUrl && (
        <div className="flex flex-col gap-3">
          {/* Mode selector */}
          <div className="flex gap-2">
            {[['auto', 'Auto-detect'], ['manual', 'Draw region']].map(([k, l]) => (
              <button key={k} onClick={() => { setMode(k); setRegion(null); }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors ${mode === k ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {l}
              </button>
            ))}
          </div>

          {mode === 'manual' && (
            <p className="text-[11px] text-gray-500">
              <strong>Draw a rectangle</strong> over the watermark area, then click Remove.
            </p>
          )}

          {/* Canvas overlay on image */}
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 select-none">
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Preview"
              className="w-full object-contain max-h-72"
              onLoad={() => {
                const canvas = canvasRef.current;
                const img    = imgRef.current;
                if (canvas && img) { canvas.width = img.clientWidth; canvas.height = img.clientHeight; }
              }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ cursor: mode === 'manual' ? 'crosshair' : 'default' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => { if (drawing) { setDrawing(false); setStartPt(null); setCurrentPt(null); } }}
            />
          </div>

          {mode === 'manual' && region && (
            <p className="text-[11px] text-green-700 font-medium">
              Region selected: {region.w} × {region.h} px at ({region.x}, {region.y})
            </p>
          )}

          <div className="flex gap-2">
            <Btn loading={loading} onClick={run}>
              <Icon name="Eraser" size={15} /> Remove Watermark
            </Btn>
            <button onClick={reset}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <InfoAlert><strong>Error:</strong> {error}</InfoAlert>
      )}

      {resultUrl && (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={resultUrl} alt="Watermark removed" className="w-full object-contain max-h-80" />
          </div>
          <div className="flex gap-2">
            <Btn onClick={download}><Icon name="Download" size={14} /> Download</Btn>
            <button onClick={reset}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
              New Image
            </button>
          </div>
        </div>
      )}

      {/* ── Rich content for CPM / SEO ── */}
      <WatermarkRemoveInfoContent />
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

function WatermarkRemoveInfoContent() {
  return (
    <div className="flex flex-col gap-10 mt-4 w-full">

      <InfoSection title="What is Image Inpainting?">
        <InfoP>
          Inpainting is the process of reconstructing missing or damaged regions of an image using
          surrounding pixel information. The technique originates from art restoration — museum conservators
          have "inpainted" damaged paintings for centuries — but digital inpainting was formalised in
          computer vision research in the early 2000s and has been transformed by deep learning since 2018.
        </InfoP>
        <InfoP>
          When a watermark is selected for removal, the inpainting algorithm treats those pixels as a
          "hole" to be filled. It analyses the texture, colour, and patterns from the surrounding image
          area and synthesises plausible content to fill the hole. Results are best when the watermark
          covers a textured or patterned background rather than fine detail like hair, text, or edges.
        </InfoP>
      </InfoSection>

      <InfoSection title="Types of Watermarks and Removal Difficulty">
        <InfoTable
          headers={['Watermark Type', 'Difficulty to Remove', 'Notes']}
          rows={[
            ['Semi-transparent text overlay',  'Easy',     'Common stock photo style; inpainting recovers background cleanly'],
            ['Solid colour logo',              'Easy',     'Hard edges; background reconstruction is straightforward on uniform areas'],
            ['Tiled / repeated pattern',       'Medium',   'Requires multiple selection passes; result depends on background complexity'],
            ['Semi-transparent on gradient',   'Medium',   'Gradient backgrounds reconstruct well; detailed texture underneath is harder'],
            ['Full-colour embedded watermark', 'Hard',     'Little background information remains; AI must hallucinate missing detail'],
            ['Watermark over faces or text',   'Very hard', 'Human brain notices imperfections on faces; edges and text do not reconstruct well'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Watermark Best Practices for Photographers">
        <InfoP>
          If you are a photographer or content creator wondering how to protect your work effectively,
          here are evidence-based strategies for watermarking that balance protection with aesthetics:
        </InfoP>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Place over fine detail', body: 'Watermarks placed over faces, text, complex patterns, or important subject elements are the hardest to remove cleanly and best protect the image.' },
            { title: 'Use EXIF metadata', body: 'Embed your name and copyright in the image EXIF data using a tool like ExifTool. Metadata survives most edits and is legally recognised as copyright evidence.' },
            { title: 'Sell from a platform', body: 'Licensing through Getty, Shutterstock, or Adobe Stock provides legal protection and makes it easy for buyers to purchase legitimate use rights.' },
            { title: 'Register copyright', body: 'In the US and many countries, registering your copyright gives you the right to statutory damages — much stronger legal recourse than unregistered work.' },
            { title: 'High-opacity watermarks', body: 'Semi-transparent watermarks are much easier to remove than fully opaque ones. A solid or 85%+ opacity watermark substantially increases removal difficulty.' },
            { title: 'Digital fingerprinting', body: 'Steganographic watermarking (invisible to the eye, detectable algorithmically) is the gold standard for professional stock photography protection.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
              <p className="font-semibold text-[13px] text-[var(--text-primary)] mb-1">{item.title}</p>
              <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Inpainting Algorithm Comparison">
        <InfoTable
          headers={['Algorithm', 'Approach', 'Strengths', 'Weaknesses']}
          rows={[
            ['Fast Marching Method', 'Propagates from edges inward', 'Very fast; good for thin overlays', 'Produces blurry results on large regions'],
            ['Navier-Stokes PDE',    'Solves fluid diffusion equations', 'Smooth transitions, good for solid backgrounds', 'Slow; poor on textured areas'],
            ['Patch-based (PatchMatch)', 'Copies similar patches from elsewhere in the image', 'Excellent on repeated textures and backgrounds', 'Fails when no similar patches exist elsewhere'],
            ['Deep Learning (GAN/Diffusion)', 'Neural network generates plausible content', 'Best on complex backgrounds; semantically aware', 'Slower; may hallucinate detail on difficult cases'],
          ]}
        />
      </InfoSection>

      <InfoSection title="Frequently Asked Questions">
        <div className="flex flex-col gap-3">
          <FaqItem q="Can watermarks be removed perfectly every time?" a="No. Removal quality depends heavily on the complexity of the background beneath the watermark and the type of watermark. Simple overlays on plain backgrounds remove very cleanly; watermarks over detailed textures or faces may leave visible artefacts." />
          <FaqItem q="Is it legal to remove watermarks?" a="In most jurisdictions, removing watermarks from images you do not own or have not licensed is a violation of copyright law. In the United States, the DMCA (Digital Millennium Copyright Act) specifically prohibits removal of copyright management information. Only remove watermarks from your own images." />
          <FaqItem q="Why does the result look blurry in the removed area?" a="Blurriness occurs when the inpainting algorithm over-smooths the reconstructed area. This is common with Navier-Stokes or Fast Marching algorithms. Try selecting a slightly larger region around the watermark to give the algorithm more surrounding texture to work with." />
          <FaqItem q="Can I remove multiple watermarks in one go?" a="Our tool processes one selected region per operation. For multiple watermarks, re-upload the result and select the next watermark area. This approach generally produces better quality than trying to select all regions at once." />
        </div>
      </InfoSection>

    </div>
  );
}

export default WatermarkRemoveTool;
