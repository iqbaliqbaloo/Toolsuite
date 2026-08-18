// @ts-nocheck
import React, { useState, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '../../components/ui/Icons';
import {
  EMPTY_DATA, CV_SECTIONS, CV_COLOR_THEMES, CV_FONT_CATEGORIES, CV_FONTS, GOOGLE_FONT_URLS,
  TEMPLATES, DEFAULT_THEMES, DEFAULT_CUSTOM, DEFAULT_SECTION_LABELS,
    STORAGE_KEY, CV_LIST_KEY, CV_DATA_PREFIX, IMPORT_KEY, DEMO_DATA,
  CvTemplateThumbnail, makeSizes, getThemeColors, cvId, slugify, safeArr, safeStr,
  completeness, migrateData, extractKeywords, cvTextContent,
  calcAtsScore, calcCompletenessScore, calcGrammarScore, isSkillLike,
} from './cv-core';
import { hexAlpha } from './cv-template-parts';
import { CvClassicTemplate, CvModernTemplate, CvMinimalTemplate, CvCreativeTemplate, CvExecutiveTemplate, CvTechTemplate } from './cv-templates-1';
import { CvElegantTemplate, CvCompactTemplate, CvBoldTemplate, CvAcademicTemplate, CvTimelineTemplate, CvSidebarRightTemplate } from './cv-templates-2';
import { CvGradientTemplate, CvTwoColumnTemplate, CvCenteredTemplate, CvSlateTemplate, CvCosmicTemplate, CvSharpTemplate, CvNovaTemplate, CvBoxedTemplate } from './cv-templates-3';
import { CvResumeScore, CvProfessionalTips, CvCoverLetterPanel, CvAtsFix, CvJobMatchFixes } from './cv-scoring';
import { CvAtsScore, CvHeaderForm, CvSummaryForm, CvExperienceForm, CvEducationForm, CvSkillsForm, CvProjectsForm, CvCertificationsForm, CvLanguagesForm, CvReferencesForm, CvHobbiesForm, CvCustomForm, CvAdditionalExpForm } from './ac';
function ResumeBuilderTool({ tool, onBack }) {
  const [data, setData] = useState(EMPTY_DATA);
  const [activeSection, setActiveSection] = useState('header');
  const [editorTab, setEditorTab] = useState('editor'); // 'editor' | 'jobmatch' | 'coverletter' | 'score'
  const [showSidebar, setShowSidebar] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [showPreview, setShowPreview] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1180 : true);
  const [isMobile, setIsMobile]     = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [template, setTemplate] = useState('classic');
  const [themePerTemplate,       setThemePerTemplate]       = useState({ ...DEFAULT_THEMES });
  const [customColorsPerTemplate, setCustomColorsPerTemplate] = useState(
    Object.fromEntries(TEMPLATES.map(t => [t.key, { ...DEFAULT_CUSTOM }]))
  );
  const [headingFont, setHeadingFont] = useState('inter');
  const [bodyFont,    setBodyFont]    = useState('inter');
  const [headingSize, setHeadingSize] = useState(26);
  const [bodySize,    setBodySize]    = useState(12);
  const [hiddenSections, setHiddenSections] = useState([]);
  const toggleHideSection = useCallback((key) => {
    setHiddenSections(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }, []);
  const skillStyle = 'plain'; // tags removed — all skills render as plain text
  const [atsMode, setAtsMode] = useState(true);
  const [exporting,    setExporting]    = useState(false);
  const [importBanner, setImportBanner] = useState(null);
  const [renamingId,    setRenamingId]    = useState(null);
  const [renameInput,   setRenameInput]   = useState('');
  const [confirmDelCvId, setConfirmDelCvId] = useState(null);
  const [cvSearch,      setCvSearch]      = useState('');
  const [sectionOrder,   setSectionOrder]   = useState(CV_SECTIONS.map(s => s.key));
  const [dragSecKey,     setDragSecKey]     = useState(null);
  const [cvList, setCvList] = useState([]);
  const [currentCvId,    setCurrentCvId]    = useState(null);
  const [showCvManager,  setShowCvManager]  = useState(false);
  const demoAutoLoadedRef = useRef(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const sectionHistRef  = useRef({});   // { [sectionKey]: { past: T[], future: T[] } }
  const activeSectionRef = useRef('header');
  const undoTimerRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [improving,  setImproving]  = useState(null);
  const [jobDesc,    setJobDesc]    = useState('');
  const [sectionLabels, setSectionLabels] = useState({ ...DEFAULT_SECTION_LABELS });
  const [renamingSection, setRenamingSection] = useState(null);
  const [renameSectionInput, setRenameSectionInput] = useState('');
  const [saveStatus,  setSaveStatus]  = useState('saved'); // 'saving' | 'saved'
  const [manualZoom,  setManualZoom]  = useState(null);   // null = auto
  const [showImport,  setShowImport]  = useState(false);
  const [importTab,   setImportTab]   = useState('paste'); // 'paste' | 'linkedin'
  const [importText,  setImportText]  = useState('');
  const [importing,   setImporting]   = useState(false);
  const [importResult, setImportResult] = useState(null); // parsed data preview
  const [expandedEntries,    setExpandedEntries]    = useState({});
  const [confirmDelEntries,  setConfirmDelEntries]   = useState({});
  const previewWrapRef = useRef(null);
  const previewRef     = useRef(null);
  const exportRef      = useRef(null);
  const [previewScale,   setPreviewScale]   = useState(0.48);
  const [docHeight,      setDocHeight]      = useState(1122);
  // Keep short resumes on a single A4 sheet, but let long resumes flow to additional pages.
  const onePage = docHeight <= 1122;
  const [containerWidth, setContainerWidth] = useState(388);

  const currentThemeKey    = themePerTemplate[template] || 'blue-teal';
  const currentCustom      = customColorsPerTemplate[template] || DEFAULT_CUSTOM;
  const theme              = getThemeColors(currentThemeKey, currentCustom);
  const sizes              = makeSizes(headingSize, bodySize);
  const headingFontFamily  = CV_FONTS[headingFont]?.css || CV_FONTS.inter.css;
  const bodyFontFamily     = CV_FONTS[bodyFont]?.css    || CV_FONTS.inter.css;
  const orderedSections    = sectionOrder.map(k => CV_SECTIONS.find(s => s.key === k)).filter(Boolean);
  const setCustomColor = useCallback((field, val) => setCustomColorsPerTemplate(c => ({ ...c, [template]: { ...c[template], [field]: val } })), [template]);

  // ── CSS injection ──────────────────────────────────────────────────────────
  useEffect(() => {
    const id = 'cv-builder-field-fix';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `.cv-field, .cv-field:focus, .cv-field:active {
  color: #111827 !important;
  background-color: #ffffff !important;
  -webkit-text-fill-color: #111827 !important;
}
.cv-field::placeholder {
  color: #9ca3af !important;
  -webkit-text-fill-color: #9ca3af !important;
  opacity: 1 !important;
}
#cv-preview-root {
  overflow-x: hidden;
  box-sizing: border-box;
}
#cv-export-root {
  /* No overflow:hidden here — clipping breaks html2canvas capture */
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}`;
    document.head.appendChild(el);
    return () => document.getElementById(id)?.remove();
  }, []);

  // ── Responsive layout ─────────────────────────────────────────────────────
  useEffect(() => {
    const handle = () => {
      const w = window.innerWidth;
      const mobile  = w < 768;
      const tablet  = w >= 768 && w < 1180;
      setIsMobile(mobile);
      setShowSidebar(!mobile);           // hidden by default on mobile
      setShowPreview(!mobile && !tablet); // hidden on mobile + small tablet
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  // ── Google Fonts loader ────────────────────────────────────────────────────
  useEffect(() => {
    [headingFont, bodyFont].forEach(f => {
      const url = GOOGLE_FONT_URLS[f];
      if (!url) return;
      const id = `cv-gfont-${f}`;
      if (document.getElementById(id)) return;
      document.head.appendChild(Object.assign(document.createElement('link'), { id, rel: 'stylesheet', href: url }));
    });
  }, [headingFont, bodyFont]);

  // ── LocalStorage load ──────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(CV_LIST_KEY) || '[]');
      if (list.length > 0) {
        setCvList(list); setCurrentCvId(list[0].id);
        const cv = JSON.parse(localStorage.getItem(CV_DATA_PREFIX + list[0].id) || 'null');
        if (!cv) { setSaveEnabled(true); return; }
        if (cv.data)                    setData(migrateData(cv.data));
        if (cv.template)                setTemplate(cv.template);
        if (cv.themePerTemplate)        setThemePerTemplate(t => ({ ...DEFAULT_THEMES, ...t, ...cv.themePerTemplate }));
        if (cv.customColorsPerTemplate) setCustomColorsPerTemplate(p => ({ ...p, ...cv.customColorsPerTemplate }));
        if (cv.headingFont && CV_FONTS[cv.headingFont]) setHeadingFont(cv.headingFont);
        if (cv.bodyFont    && CV_FONTS[cv.bodyFont])    setBodyFont(cv.bodyFont);
        if (cv.headingSize) setHeadingSize(cv.headingSize);
        if (cv.bodySize)    setBodySize(cv.bodySize);
        if (cv.sectionOrder) {
          setSectionOrder(saved => {
            const allKeys = CV_SECTIONS.map(s => s.key);
            const missing = allKeys.filter(k => !cv.sectionOrder.includes(k));
            return [...cv.sectionOrder, ...missing];
          });
        }
        if (cv.atsMode !== undefined) setAtsMode(!!cv.atsMode);
        if (cv.sectionLabels) setSectionLabels(l => ({ ...DEFAULT_SECTION_LABELS, ...l, ...cv.sectionLabels }));
        localStorage.removeItem(STORAGE_KEY);
        setSaveEnabled(true);
        return;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { data: d, template: t, themePerTemplate: tpt } = JSON.parse(saved);
        if (d)   setData(migrateData(d));
        if (t)   setTemplate(t);
        if (tpt) setThemePerTemplate(prev => ({ ...DEFAULT_THEMES, ...prev, ...tpt }));
      }
    } catch (_) {}
    setSaveEnabled(true);
  }, []);

  // ── Import banner ──────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(IMPORT_KEY);
      if (raw) { localStorage.removeItem(IMPORT_KEY); setImportBanner(JSON.parse(raw)); }
    } catch (_) {}
  }, []);

  // ── Auto-save ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!saveEnabled) return;
    if (!currentCvId) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, template, themePerTemplate })); } catch(_) {}
      return;
    }
    setSaveStatus('saving');
    const cv = { data, template, themePerTemplate, customColorsPerTemplate, headingFont, bodyFont, headingSize, bodySize, atsMode, sectionOrder, sectionLabels };
    try {
      const payload = JSON.stringify(cv);
      if (payload.length > 4_000_000) { console.warn('CV data too large to save'); setSaveStatus('saved'); return; }
      localStorage.setItem(CV_DATA_PREFIX + currentCvId, payload);
    } catch(_) {}
    setSaveStatus('saved');
  }, [saveEnabled, data, template, themePerTemplate, customColorsPerTemplate, headingFont, bodyFont, headingSize, bodySize, skillStyle, atsMode, sectionOrder, sectionLabels, currentCvId]);

  // ── Preview scale / height ─────────────────────────────────────────────────
  useEffect(() => {
    const compute = () => {
      if (previewWrapRef.current) {
        const availW = previewWrapRef.current.clientWidth - 48;
        setContainerWidth(availW);
        setPreviewScale(Math.max(0.4, availW / 794));
      }
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => { for (const e of entries) { if (e.contentRect.height > 100) setDocHeight(e.contentRect.height); } });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Orphan-heading prevention ──────────────────────────────────────────────
  // After every render: find sections marked [data-cv-sec] that fall within
  // THRESHOLD px of a page boundary and push them to the next page via a
  // global <style> tag (survives React re-renders, no state update needed).
React.useLayoutEffect(() => {
  const preview = previewRef.current;
  if (!preview) return;
  const PAGE_H_PX = 1122;
  const THRESHOLD = 110;
  const BUFFER = 14;

  let styleEl = document.getElementById('cv-orphan-fix') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style') as HTMLStyleElement;
    styleEl.id = 'cv-orphan-fix';
    document.head.appendChild(styleEl);
  }

  const sections = preview.querySelectorAll('[data-cv-sec]');
  if (!sections.length) { styleEl.textContent = ''; return; }

  for (let i = 0; i < 10; i++) {
    styleEl.textContent = '';
    void (preview as HTMLElement).offsetHeight;

    const previewRect = preview.getBoundingClientRect();
    const rules: string[] = [];

    sections.forEach((el: Element) => {
      const elRect = (el as HTMLElement).getBoundingClientRect();
      // Convert to position inside the 794px unscaled document
      const scale = previewRect.width / 794;
      const elTopScaled = elRect.top - previewRect.top;
      const elTopUnscaled = elTopScaled / scale; // real px position in doc
      const posInPage = elTopUnscaled % PAGE_H_PX;

      if (posInPage > PAGE_H_PX - THRESHOLD) {
        const key = el.getAttribute('data-cv-sec');
        const push = PAGE_H_PX - posInPage + BUFFER;
        rules.push(`[data-cv-sec="${key}"] { margin-top: ${push}px !important; }`);
      }
    });

    const css = rules.join('\n');
    if (styleEl.textContent === css) break;
    styleEl.textContent = css;
  }
});
  // Clean up the orphan-fix style element when the tool unmounts
  useEffect(() => () => { document.getElementById('cv-orphan-fix')?.remove(); }, []);

  // ── Per-section undo / redo ────────────────────────────────────────────────
  // Keep activeSectionRef in sync so undo/redo callbacks always see current section
  useEffect(() => {
    activeSectionRef.current = activeSection;
    const h = sectionHistRef.current[activeSection];
    setCanUndo(!!(h && h.past.length > 1));
    setCanRedo(!!(h && h.future.length > 0));
  }, [activeSection]);

  const pushUndo = useCallback((sectionKey, sectionValue) => {
    clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      if (!sectionHistRef.current[sectionKey]) {
        sectionHistRef.current[sectionKey] = { past: [], future: [] };
      }
      const h = sectionHistRef.current[sectionKey];
      const snap = sectionKey === 'header'
        ? { ...sectionValue, photo: '', _hadPhoto: !!sectionValue.photo }
        : sectionValue;
      h.past = [...h.past, snap].slice(-30);
      h.future = [];
      // Update buttons only for the currently visible section
      if (sectionKey === activeSectionRef.current) {
        setCanUndo(h.past.length > 1);
        setCanRedo(false);
      }
    }, 400);
  }, []);

  const undo = useCallback(() => {
    const sk = activeSectionRef.current;
    const h  = sectionHistRef.current[sk];
    if (!h || h.past.length <= 1) return;
    const popped = h.past[h.past.length - 1];
    h.past   = h.past.slice(0, -1);
    h.future = [popped, ...h.future];
    const restored = h.past[h.past.length - 1];
    setData(prev => {
      if (sk === 'header') return { ...prev, header: { ...restored, photo: restored._hadPhoto ? prev.header.photo : '' } };
      return { ...prev, [sk]: restored };
    });
    setCanUndo(h.past.length > 1);
    setCanRedo(true);
  }, []);

  const redo = useCallback(() => {
    const sk = activeSectionRef.current;
    const h  = sectionHistRef.current[sk];
    if (!h || h.future.length === 0) return;
    const next = h.future[0];
    h.future = h.future.slice(1);
    h.past   = [...h.past, next];
    setData(prev => {
      if (sk === 'header') return { ...prev, header: { ...next, photo: next._hadPhoto ? prev.header.photo : '' } };
      return { ...prev, [sk]: next };
    });
    setCanUndo(true);
    setCanRedo(h.future.length > 0);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey||e.metaKey) && e.key==='z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey||e.metaKey) && (e.key==='y' || (e.key==='z'&&e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  // ── Auto-add first entry when visiting empty multi-section ─────────────────
  useEffect(() => {
    const sec = CV_SECTIONS.find(s => s.key === activeSection);
    if (!sec?.multi) return;
    setData(d => {
      const entries = d[activeSection];
      if (!Array.isArray(entries) || entries.length > 0) return d;
      const id = cvId();
      const blank = {
        experience:     { id, jobTitle:'', company:'', employmentType:'', location:'', startDate:'', endDate:'', current:false, bullets:[] },
        education:      { id, degree:'', field:'', institution:'', location:'', startYear:'', endYear:'', expected:false, gpa:'', courses:[] },
        projects:       { id, name:'', techStack:[], startDate:'', endDate:'', liveUrl:'', githubUrl:'', description:'', bullets:[] },
        certifications: { id, name:'', issuer:'', issueDate:'', credentialId:'', credentialUrl:'' },
        references:     { id, name:'', title:'', company:'', relationship:'', email:'', phone:'' },
      }[activeSection];
      if (!blank) return d;
      setTimeout(() => setExpandedEntries(e => ({ ...e, [id]: true })), 0);
      return { ...d, [activeSection]: [blank] };
    });
  }, [activeSection]);

  // ── Data update ────────────────────────────────────────────────────────────
  const updateSection = useCallback((section, value) => {
    setData(d => { pushUndo(section, value); return { ...d, [section]: value }; });
  }, [pushUndo]);
  const handleAddEntry = useCallback(() => {
    const id = cvId();
    const blank = {
      experience:     { id, jobTitle:'', company:'', employmentType:'', location:'', startDate:'', endDate:'', current:false, bullets:[] },
      education:      { id, degree:'', field:'', institution:'', location:'', startYear:'', endYear:'', expected:false, gpa:'', courses:[] },
      projects:       { id, name:'', techStack:[], startDate:'', endDate:'', liveUrl:'', githubUrl:'', description:'', bullets:[] },
      certifications: { id, name:'', issuer:'', issueDate:'', credentialId:'', credentialUrl:'' },
      references:     { id, name:'', title:'', company:'', relationship:'', email:'', phone:'' },
    }[activeSection];
    if (!blank) return;
    updateSection(activeSection, [...(data[activeSection] || []), blank]);
    setExpandedEntries(e => ({ ...e, [id]: true }));
  }, [activeSection, data, updateSection]);
  const toggleEntry = useCallback((id) => setExpandedEntries(e => ({ ...e, [id]: !e[id] })), []);
  const confirmDel  = useCallback((id, v) => setConfirmDelEntries(e => {
    if (v === undefined) { const n = {...e}; delete n[id]; return n; }
    return { ...e, [id]: v };
  }), []);

  // ── Multiple CVs ───────────────────────────────────────────────────────────
  const createNewCv = useCallback(() => {
    const id   = cvId();
    const name = 'CV ' + (cvList.length + 1);
    const newList = [...cvList, { id, name }];
    setCvList(newList);
    setCurrentCvId(id);
    setData(EMPTY_DATA);
    setTemplate('classic');
    setThemePerTemplate({ ...DEFAULT_THEMES });
    setSectionOrder(CV_SECTIONS.map(s => s.key));
    setActiveSection('header');
    setExpandedEntries({});
    try { localStorage.setItem(CV_LIST_KEY, JSON.stringify(newList)); } catch(_) {}
  }, [cvList]);
  const loadDemoCv = useCallback(() => {
    const id = cvId();
    const name = 'Demo CV · Remote Product Designer';
    const newList = [...cvList, { id, name }];
    setCvList(newList);
    setCurrentCvId(id);
    setData(JSON.parse(JSON.stringify(DEMO_DATA)));
    setTemplate('modern');
    setThemePerTemplate({ ...DEFAULT_THEMES });
    setSectionOrder(CV_SECTIONS.map(s => s.key));
    setActiveSection('header');
    setExpandedEntries({});
    setShowCvManager(false);
    try {
      localStorage.setItem(CV_LIST_KEY, JSON.stringify(newList));
      localStorage.setItem(CV_DATA_PREFIX + id, JSON.stringify({ data: DEMO_DATA, template: 'modern', themePerTemplate: DEFAULT_THEMES, customColorsPerTemplate, headingFont: 'inter', bodyFont: 'inter', headingSize: 26, bodySize: 12, atsMode: true, sectionOrder: CV_SECTIONS.map(s => s.key), sectionLabels: DEFAULT_SECTION_LABELS }));
    } catch (_) {}
  }, [cvList, customColorsPerTemplate]);
  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === '1' && !demoAutoLoadedRef.current && saveEnabled) {
      demoAutoLoadedRef.current = true;
      loadDemoCv();
    }
  }, [saveEnabled, loadDemoCv]);
  const switchCv = useCallback((id) => {
    const saved = (() => { try { return JSON.parse(localStorage.getItem(CV_DATA_PREFIX+id)||'null'); } catch(_) { return null; } })();
    if (saved) {
      if (saved.data)             setData(migrateData(saved.data));
      if (saved.template)         setTemplate(saved.template);
      if (saved.themePerTemplate) setThemePerTemplate(t => ({ ...DEFAULT_THEMES, ...t, ...saved.themePerTemplate }));
      if (saved.headingFont && CV_FONTS[saved.headingFont]) setHeadingFont(saved.headingFont);
      if (saved.bodyFont    && CV_FONTS[saved.bodyFont])    setBodyFont(saved.bodyFont);
      if (saved.headingSize) setHeadingSize(saved.headingSize);
      if (saved.bodySize)    setBodySize(saved.bodySize);
      if (saved.sectionOrder) setSectionOrder(saved.sectionOrder);
      if (saved.atsMode!==undefined) setAtsMode(!!saved.atsMode);
      if (saved.sectionLabels) setSectionLabels(l => ({ ...DEFAULT_SECTION_LABELS, ...saved.sectionLabels }));
    }
    setCurrentCvId(id);
    setShowCvManager(false);
    setActiveSection('header');
  }, []);
  const deleteCv = useCallback((id) => {
    try { localStorage.removeItem(CV_DATA_PREFIX+id); } catch(_) {}
    const newList = cvList.filter(c => c.id !== id);
    setCvList(newList);
    try { localStorage.setItem(CV_LIST_KEY, JSON.stringify(newList)); } catch(_) {}
    if (currentCvId===id) { if (newList.length>0) switchCv(newList[0].id); else { setCurrentCvId(null); setData(EMPTY_DATA); } }
  }, [cvList, currentCvId, switchCv]);
  const duplicateCv = useCallback((id) => {
    const src = cvList.find(c => c.id === id);
    if (!src) return;
    const newId   = cvId();
    const newName = `${src.name} (copy)`;
    const saved   = (() => { try { return JSON.parse(localStorage.getItem(CV_DATA_PREFIX+id)||'null'); } catch(_) { return null; } })();
    const newList = [...cvList, { id: newId, name: newName }];
    setCvList(newList);
    try { localStorage.setItem(CV_LIST_KEY, JSON.stringify(newList)); } catch(_) {}
    if (saved) { try { localStorage.setItem(CV_DATA_PREFIX+newId, JSON.stringify(saved)); } catch(_) {} }
  }, [cvList]);
  const renameCv = useCallback((id, name) => {
    const newList = cvList.map(c => c.id===id ? { ...c, name } : c);
    setCvList(newList);
    try { localStorage.setItem(CV_LIST_KEY, JSON.stringify(newList)); } catch(_) {}
  }, [cvList]);

  // ── AI Improve ─────────────────────────────────────────────────────────────
  const handleAiImprove = useCallback(async (text, type, onDone) => {
    if (!text.trim() || improving) return;
    setImproving(type);
    try {
      const apiBase = window.TOOLSUITE_API_URL || 'http://localhost:3001/api/v1';
      const r = await fetch(apiBase + '/cv/improve', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type }),
      });
      const json = await r.json();
      if (json.improved) onDone(json.improved);
      else alert(json.message || 'AI improve failed.');
    } catch(e) { alert('AI improve unavailable. Add GROQ_API_KEY or OPENAI_API_KEY to backend/.env'); }
    setImproving(null);
  }, [improving]);

  // ── Export PDF ─────────────────────────────────────────────────────────────
  const validateBeforeExport = () => {
    if (!data.header.name)  { alert('Please add your name in Header before exporting.');  return false; }
    if (!data.header.email) { alert('Please add your email in Header before exporting.'); return false; }
    return true;
  };
  const loadScript = (src: string, globalKey: string): Promise<void> => {
    if ((window as any)[globalKey]) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = reject;
      document.head.appendChild(s);
    });
  };

  const exportPdf = async () => {
    if (!validateBeforeExport() || !exportRef.current || exporting) return;
    setExporting(true);

    try {
      await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf'),
      ]);
    } catch {
      alert('Failed to load PDF export libraries. Please check your connection.');
      setExporting(false);
      return;
    }

    const el = exportRef.current;
    const wrapper = el.parentElement;               // the aria-hidden off-screen div
    const origWrapperStyle = wrapper?.style.cssText || '';

    try {
      // ── 1. Bring the hidden wrapper fully into the viewport ────────────────
      // html2canvas REQUIRES the element to be in-viewport and visible.
      // opacity:0 or left:-9999px both cause a blank / mis-styled capture.
    if (wrapper) {
  wrapper.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:794px',    'height:auto',
    'z-index:99999',  'overflow:visible',
    'background:#ffffff',
    'pointer-events:none',
    'opacity:1', 'visibility:visible',
    'display:block',
  ].join(';') + ';';
}

      // ── 2. Wait for Google Fonts + profile photo image(s) ─────────────────
      await document.fonts.ready;
      const imgs = Array.from(el.querySelectorAll('img'));
      await Promise.all(imgs.map(img =>
        img.complete ? Promise.resolve()
                     : new Promise(r => { img.onload = r; img.onerror = r; })
      ));
      // Extra paint cycle so the browser finishes layout
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise(r => setTimeout(r, 600));

      // ── 3. Force the element to exactly 794 px before capturing ───────────
      // Without this, html2canvas reads the browser layout width (which may
      // differ from 794px) and everything ends up zoomed-out or mis-proportioned.
      el.style.width    = '794px';
      el.style.maxWidth = '794px';
      el.style.minWidth = '794px';
      // One extra frame so the 794px constraint is fully applied
      await new Promise(r => requestAnimationFrame(r));

      // ── 4. Capture ─────────────────────────────────────────────────────────
      const canvas = await window.html2canvas(el, {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  foreignObjectRendering: false,
        backgroundColor: '#ffffff',
        scrollX: -window.scrollX,
scrollY: -window.scrollY,
        width: 794,
        height: PAGE_H,
        logging: false,
        onclone: (_doc, clonedEl) => {
          // Lock width in the clone
          clonedEl.style.width    = '794px';
          clonedEl.style.maxWidth = '794px';
          clonedEl.style.minWidth = '794px';
          clonedEl.style.overflow  = 'visible';
          clonedEl.style.overflowX = 'visible';
          clonedEl.style.overflowY = 'visible';
          clonedEl.style.paddingLeft = '0px';
clonedEl.style.marginLeft = '0px';
clonedEl.style.left = '0px';

          clonedEl.querySelectorAll('*').forEach(node => {
            const cs = window.getComputedStyle(node);

            // Detect circular photo containers — KEEP overflow:hidden on these,
            // otherwise border-radius:50% + overflow:hidden circle clipping breaks.
            const isCircle = cs.borderRadius === '50%' ||
              (cs.borderTopLeftRadius === '50%' && cs.borderTopRightRadius === '50%' &&
               cs.borderBottomLeftRadius === '50%' && cs.borderBottomRightRadius === '50%');

            if (isCircle) {
              // Keep the clip; reinforce with clipPath just in case
              node.style.overflow  = 'hidden';
              node.style.clipPath  = 'circle(50%)';
            } else if (cs.overflow === 'hidden' || cs.overflowX === 'hidden') {
              // Remove overflow:hidden from layout containers so nothing gets cut
              node.style.overflow  = 'visible';
              node.style.overflowX = 'visible';
            }

            // Also reinforce clipPath on every <img> that is the photo
            if (node.tagName === 'IMG' && node.alt === 'Profile') {
              node.style.borderRadius = '50%';
              node.style.clipPath     = 'circle(50%)';
              node.style.objectFit    = 'cover';
            }

            // Preserve background colours (blue headers, sidebars, gradients)
            node.style.webkitPrintColorAdjust = 'exact';
            node.style.printColorAdjust       = 'exact';
          });
        },
      });

      // ── 5. Restore the off-screen position ────────────────────────────────
      if (wrapper) wrapper.style.cssText = origWrapperStyle;
      el.style.width    = '794px';
      el.style.maxWidth = '';
      el.style.minWidth = '';
      el.style.overflowX = 'hidden';
el.style.boxSizing = 'border-box';

      // ── 5. Restore the off-screen position (already done above) ───────────

      // ── 6. Build a multi-page PDF ──────────────────────────────────────────
      const { jsPDF } = window.jspdf;
      const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvas.toDataURL('image/png');
      const pdfW    = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageH   = pdf.internal.pageSize.getHeight();  // 297 mm
      const imgHmm  = (canvas.height * pdfW) / canvas.width;

      if (onePage) {
        // Captured exactly PAGE_H pixels → place as full A4 page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pageH);
      } else {
        let y = 0;
        while (y < imgHmm) {
          if (y > 0) pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, -y, pdfW, imgHmm);
          y += pageH;
        }
      }
      pdf.save(slugify(data.header.name) + '-resume.pdf');

    } catch (e) {
      if (wrapper) wrapper.style.cssText = origWrapperStyle;
      el.style.width = '794px'; el.style.maxWidth = ''; el.style.minWidth = '';
      alert('PDF export failed: ' + (e?.message || e));
    }
    setExporting(false);
  };


  const reset = () => {
    if (!confirm('Reset all data?')) return;
    if (currentCvId) { try { localStorage.removeItem(CV_DATA_PREFIX+currentCvId); } catch(_) {} }
    setData(EMPTY_DATA); setTemplate('classic');
    setThemePerTemplate({ ...DEFAULT_THEMES });
    setCustomColorsPerTemplate(Object.fromEntries(TEMPLATES.map(t=>[t.key,{...DEFAULT_CUSTOM}])));
    setHeadingFont('inter'); setBodyFont('inter'); setHeadingSize(26); setBodySize(12);
    setAtsMode(true);
    setSectionOrder(CV_SECTIONS.map(s=>s.key));
    setActiveSection('header'); setExpandedEntries({}); setConfirmDelEntries({});
    sectionHistRef.current={}; setCanUndo(false); setCanRedo(false);
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const done = (() => { try { return completeness(data); } catch(_) { return {}; } })();
  const DotColors = { complete:'#22c55e', partial:'#f59e0b', empty:'#6b7280' };
  const activeMulti = CV_SECTIONS.find(s=>s.key===activeSection)?.multi;
  const activeLabel = CV_SECTIONS.find(s=>s.key===activeSection)?.label || '';
  const PreviewComponent = {
    classic:CvClassicTemplate, modern:CvModernTemplate, minimal:CvMinimalTemplate, creative:CvCreativeTemplate,
    executive:CvExecutiveTemplate, tech:CvTechTemplate, elegant:CvElegantTemplate, compact:CvCompactTemplate,
    bold:CvBoldTemplate, academic:CvAcademicTemplate, timeline:CvTimelineTemplate,
    sidebarRight:CvSidebarRightTemplate, gradient:CvGradientTemplate, twoCol:CvTwoColumnTemplate,
    centered:CvCenteredTemplate, slate:CvSlateTemplate, cosmic:CvCosmicTemplate,
    sharp:CvSharpTemplate, nova:CvNovaTemplate, boxed:CvBoxedTemplate,
  }[template] || CvClassicTemplate;

  const aiImproveRef = useRef(handleAiImprove); aiImproveRef.current = handleAiImprove;
  const sectionForm = useMemo(() => {
    const props = { expanded:expandedEntries, onToggle:toggleEntry, confirmDel:confirmDelEntries, onConfirmDel:confirmDel };
    switch (activeSection) {
      case 'header':         return <CvHeaderForm         data={data.header}                    onChange={v=>updateSection('header',v)} />;
      case 'summary':        return <CvSummaryForm         summary={data.summary}               onChange={v=>updateSection('summary',v)} onImprove={aiImproveRef.current} improving={improving} />;
      case 'experience':           return <CvExperienceForm entries={data.experience}             onChange={v=>updateSection('experience',v)}             onImprove={aiImproveRef.current} improving={improving} onAdd={handleAddEntry} {...props} />;
      case 'additionalExperience': return <CvAdditionalExpForm items={data.additionalExperience||[]} onChange={v=>updateSection('additionalExperience',v)} />;
      case 'education':            return <CvEducationForm  entries={data.education}              onChange={v=>updateSection('education',v)}              onAdd={handleAddEntry} {...props} />;
      case 'skills':         return <CvSkillsForm          skills={data.skills}                  onChange={v=>updateSection('skills',v)} />;
      case 'projects':       return <CvProjectsForm        projects={data.projects}              onChange={v=>updateSection('projects',v)}       onImprove={aiImproveRef.current} improving={improving} onAdd={handleAddEntry} {...props} />;
      case 'certifications': return <CvCertificationsForm  certifications={data.certifications}  onChange={v=>updateSection('certifications',v)} onAdd={handleAddEntry} {...props} />;
      case 'languages':      return <CvLanguagesForm       languages={data.languages}            onChange={v=>updateSection('languages',v)} />;
      case 'references':     return <CvReferencesForm      references={data.references}          onChange={v=>updateSection('references',v)}     onAdd={handleAddEntry} {...props} />;
      case 'hobbies':        return <CvHobbiesForm         hobbies={data.hobbies}                onChange={v=>updateSection('hobbies',v)} />;
      case 'custom':         return <CvCustomForm          custom={data.custom}                  onChange={v=>updateSection('custom',v)} onImprove={aiImproveRef.current} improving={improving} />;
      default: return null;
    }
  }, [activeSection,data,expandedEntries,confirmDelEntries,updateSection,toggleEntry,confirmDel,improving]);

  const atsKeywords = useMemo(() => {
    if (!jobDesc.trim()) return { found:[], missing:[], total:0, score:0 };
    const jdKws  = extractKeywords(jobDesc).filter(k => isSkillLike(k));
    const cvText = cvTextContent(data);
    const found   = jdKws.filter(k => cvText.includes(k));
    const missing = jdKws.filter(k => !cvText.includes(k)).slice(0, 40);
    return { found, missing, total: jdKws.length, score: jdKws.length ? Math.round((found.length / jdKws.length) * 100) : 0 };
  }, [jobDesc, data]);

  const visibleData = useMemo(() => {
    const r = data || {};
    const safe = {
      header:         { ...EMPTY_DATA.header,  ...(r.header && typeof r.header === 'object' ? r.header : {}) },
      summary:        typeof r.summary === 'string'   ? r.summary : '',
      experience:           Array.isArray(r.experience)           ? r.experience           : [],
      additionalExperience: Array.isArray(r.additionalExperience) ? r.additionalExperience : [],
      education:            Array.isArray(r.education)            ? r.education            : [],
      skills:         Array.isArray(r.skills)         ? r.skills         : [],
      projects:       Array.isArray(r.projects)       ? r.projects       : [],
      certifications: Array.isArray(r.certifications) ? r.certifications : [],
      languages:      Array.isArray(r.languages)      ? r.languages      : [],
      references:     Array.isArray(r.references)     ? r.references     : [],
      hobbies:        Array.isArray(r.hobbies)        ? r.hobbies        : [],
      custom: (r.custom && typeof r.custom === 'object')
        ? { title: typeof r.custom.title==='string'?r.custom.title:'', body: typeof r.custom.body==='string'?r.custom.body:'' }
        : { title:'', body:'' },
    };
    if (!hiddenSections.length) return safe;
    hiddenSections.forEach(key => {
      if (Array.isArray(safe[key]))   safe[key] = [];
      else if (key === 'summary')     safe[key] = '';
      else if (key === 'custom')      safe[key] = { title:'', body:'' };
      else if (key === 'header')      safe[key] = { ...EMPTY_DATA.header, name:'​' };
    });
    return safe;
  }, [data, hiddenSections]);

  const sharedTemplateProps   = { data: visibleData, theme, sizes, headingFont:headingFontFamily, bodyFont:bodyFontFamily, fontFamily:bodyFontFamily, skillStyle, atsMode, labels: sectionLabels };
  // Keep the live preview expressive, but always export with ATS-first semantics and contrast.
  const exportTemplateProps   = { ...sharedTemplateProps, atsMode: true };
  const PAGE_H                = 1122;
  const numPageMarkers        = Math.max(0, Math.floor(docHeight / PAGE_H));
  const fillPct               = Math.min(100, Math.round((docHeight / PAGE_H) * 100));
  const nextSection = () => { const i=orderedSections.findIndex(s=>s.key===activeSection); if(i<orderedSections.length-1) setActiveSection(orderedSections[i+1].key); };
  const prevSection = () => { const i=orderedSections.findIndex(s=>s.key===activeSection); if(i>0) setActiveSection(orderedSections[i-1].key); };
  const currentCvName = cvList.find(c=>c.id===currentCvId)?.name || 'My CV';
  const effectiveScale = manualZoom !== null ? manualZoom : previewScale;
  const onePgFitPct = Math.min(100, Math.round((PAGE_H / Math.max(docHeight, 1)) * 100));

  // ── Import resume / LinkedIn parse ────────────────────────────────────────────
  const handleImportParse = useCallback(async () => {
    if (!importText.trim() || importing) return;
    setImporting(true);
    setImportResult(null);
    try {
      const apiBase = window.TOOLSUITE_API_URL || 'http://localhost:3001/api/v1';
      const r = await fetch(apiBase + '/cv/parse', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ rawText: importText.trim() }),
      });
      const json = await r.json();
      if (!json.success) { alert(json.message || 'Parsing failed.'); setImporting(false); return; }
      setImportResult(json.data);
    } catch(e) { alert('Import failed. Make sure the backend is running and GROQ_API_KEY is set.'); }
    setImporting(false);
  }, [importText, importing]);

  const handleImportConfirm = useCallback(() => {
    if (!importResult) return;
    const d = importResult;
    const mapped = {
      header: {
        name: d.header?.name || '', title: '', email: d.header?.email || '',
        phone: d.header?.phone || '', location: d.header?.location || '',
        linkedin: d.header?.linkedin || '', github: d.header?.github || '',
        portfolio: d.header?.portfolio || '', photo: '',
      },
      summary: d.summary || '',
      experience: (d.experience || []).map(e => ({ id:cvId(), jobTitle:e.title||'', company:e.company||'', employmentType:e.employment_type||'', location:e.location||'', startDate:e.start_date||'', endDate:e.end_date||'', current:e.end_date?.toLowerCase()==='present', bullets:e.bullets||[] })),
      education: (d.education || []).map(e => ({ id:cvId(), degree:e.degree||'', field:e.field||'', institution:e.institution||'', location:e.location||'', startYear:e.start_date||'', endYear:e.end_date||'', expected:!!e.expected, gpa:e.gpa||'', courses:e.courses||[] })),
      skills: (d.skills || []).map(s => ({ id:cvId(), name:s.category||'', items:s.items||[] })),
      projects: (d.projects || []).map(p => ({ id:cvId(), name:p.name||'', techStack:p.tech_stack||[], startDate:'', endDate:'', liveUrl:'', githubUrl:'', description:p.description||'', bullets:p.bullets||[] })),
      certifications: (d.certifications || []).map(c => ({ id:cvId(), name:c.name||'', issuer:c.issuer||'', issueDate:c.date||'', credentialId:c.credential_id||'', credentialUrl:c.url||'' })),
      languages: (d.languages || []).map(l => ({ id:cvId(), language:l.language||'', proficiency:l.proficiency||'' })),
      references: [], hobbies: d.interests || [],
      custom: { title:'', body:'' },
    };
    setData(mapped);
    setShowImport(false);
    setImportText('');
    setImportResult(null);
    setActiveSection('header');
  }, [importResult]);

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden cv-builder-shell" style={{ fontFamily:'Inter, sans-serif' }}>
      {/* Mobile backdrop — tapping it closes the sidebar */}
      {isMobile && showSidebar && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={()=>setShowSidebar(false)}/>
      )}

      {/* ── SIDEBAR ── */}
      <aside
        style={{ scrollbarWidth:'thin', scrollbarColor:'#374151 transparent', transition:'transform 0.25s ease' }}
        className={
          "flex flex-col bg-gray-900 overflow-y-auto " +
          (isMobile
            ? "fixed inset-y-0 left-0 z-50 w-72 " + (showSidebar ? "translate-x-0" : "-translate-x-full")
            : "w-[230px] shrink-0 " + (showSidebar ? "" : "hidden"))
        }>
        {/* Header + CV manager */}
        <div className="px-3 py-3 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-[13px]">CV Builder</span>
            <div className="flex items-center gap-1.5">
              <span className={"text-[9px] font-medium transition-colors " + (saveStatus==='saving'?'text-amber-400':'text-gray-400')}>
                {saveStatus==='saving' ? '● saving…' : '✓ saved'}
              </span>
              {isMobile && <button aria-label="Close sidebar" onClick={()=>setShowSidebar(false)} className="text-gray-500 hover:text-gray-300 p-1 rounded"><Icon name="X" size={14}/></button>}
              {!isMobile && onBack && <button aria-label="Close resume builder" onClick={onBack} className="text-gray-500 hover:text-gray-300 p-1 rounded"><Icon name="X" size={14}/></button>}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={()=>setShowCvManager(v=>!v)}
              className="flex-1 flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors min-w-0">
              <Icon name="FileText" size={11} className="shrink-0"/>
              <span className="truncate">{currentCvName}</span>
              <Icon name={showCvManager?'ChevronUp':'ChevronDown'} size={10} className="shrink-0 ml-auto"/>
            </button>
            <button onClick={()=>setShowImport(true)} aria-label="Import Resume" className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg p-1.5 shrink-0"><Icon name="Upload" size={13}/></button>
            <button onClick={loadDemoCv} aria-label="Load demo CV" title="Load demo CV" className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-2 py-1.5 text-[10px] font-semibold shrink-0">Demo</button>
            <button onClick={createNewCv} aria-label="New CV" title="New blank CV" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-1.5 shrink-0"><Icon name="Plus" size={13}/></button>
          </div>
          {showCvManager && (
            <div className="mt-2 bg-gray-800 rounded-lg overflow-hidden">
              {cvList.length > 3 && (
                <div className="px-2 py-1.5 border-b border-gray-700">
                  <input value={cvSearch} onChange={e=>setCvSearch(e.target.value)} placeholder="Search CVs…" autoComplete="off"
                    className="w-full bg-gray-900 text-white text-[11px] rounded px-2 py-1 border border-gray-700 outline-none focus:border-blue-500 placeholder-gray-600" />
                </div>
              )}
              {cvList.filter(cv=>!cvSearch||cv.name.toLowerCase().includes(cvSearch.toLowerCase())).map(cv=>(
                <div key={cv.id} className={"transition-colors " + (cv.id===currentCvId?'bg-blue-900/40':'hover:bg-gray-750')}>
                  {renamingId === cv.id ? (
                    <div className="flex items-center gap-1 px-2 py-1.5">
                      <input autoFocus value={renameInput} onChange={e=>setRenameInput(e.target.value)}
                        onKeyDown={e=>{ if(e.key==='Enter'){renameCv(cv.id,renameInput.trim()||cv.name);setRenamingId(null);} if(e.key==='Escape')setRenamingId(null); }}
                        onBlur={()=>{renameCv(cv.id,renameInput.trim()||cv.name);setRenamingId(null);}}
                        className="flex-1 bg-gray-900 text-white text-[11px] rounded px-1.5 py-0.5 border border-blue-500 outline-none min-w-0" />
                      <button aria-label="Confirm rename" onClick={()=>{renameCv(cv.id,renameInput.trim()||cv.name);setRenamingId(null);}} className="text-green-400 hover:text-green-300 p-0.5 shrink-0"><Icon name="Check" size={11}/></button>
                      <button aria-label="Cancel rename" onClick={()=>setRenamingId(null)} className="text-gray-500 hover:text-gray-300 p-0.5 shrink-0"><Icon name="X" size={11}/></button>
                    </div>
                  ) : confirmDelCvId === cv.id ? (
                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-red-900/30">
                      <span className="text-[11px] text-red-300 flex-1">Delete "{cv.name}"?</span>
                      <button onClick={()=>{deleteCv(cv.id);setConfirmDelCvId(null);}} className="text-[10px] font-bold text-red-400 hover:text-red-300 px-1.5 py-0.5 rounded bg-red-900/50">Yes</button>
                      <button onClick={()=>setConfirmDelCvId(null)} className="text-[10px] text-gray-400 hover:text-gray-200 px-1.5 py-0.5 rounded bg-gray-700">No</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 px-2 py-1.5">
                      <button onClick={()=>switchCv(cv.id)} className="flex-1 text-left text-[11px] text-gray-300 truncate min-w-0">{cv.name}</button>
                      <button onClick={()=>{setRenamingId(cv.id);setRenameInput(cv.name);}} aria-label="Rename CV" className="text-gray-500 hover:text-blue-400 p-0.5 shrink-0 transition-colors"><Icon name="Pencil" size={10}/></button>
                      <button onClick={()=>duplicateCv(cv.id)} aria-label="Duplicate CV" className="text-gray-500 hover:text-green-400 p-0.5 shrink-0 transition-colors"><Icon name="Copy" size={10}/></button>
                      <button onClick={()=>setConfirmDelCvId(cv.id)} aria-label="Delete CV" className="text-gray-500 hover:text-red-400 p-0.5 shrink-0 transition-colors"><Icon name="Trash2" size={10}/></button>
                    </div>
                  )}
                </div>
              ))}
              {cvList.length===0&&<p className="text-[10px] text-gray-400 px-3 py-2">No saved CVs yet. Click + to create one.</p>}
              <button onClick={createNewCv} className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 transition-colors border-t border-gray-700">
                <Icon name="Plus" size={11}/> New CV
              </button>
            </div>
          )}
        </div>

        {/* Section nav */}
        <nav className="py-2 px-2">
          <p className="px-2 text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Sections <span className="text-gray-400 normal-case">(drag · eye=hide)</span></p>
          {orderedSections.map(sec=>{
            const isActive = activeSection===sec.key;
            const isHidden = hiddenSections.includes(sec.key);
            return (
              <div key={sec.key} draggable
                onDragStart={()=>setDragSecKey(sec.key)}
                onDragOver={e=>{e.preventDefault();if(dragSecKey&&dragSecKey!==sec.key){setSectionOrder(o=>{const n=[...o];const fi=n.indexOf(dragSecKey),ti=n.indexOf(sec.key);if(fi>=0&&ti>=0){const[x]=n.splice(fi,1);n.splice(ti,0,x);}return n;});setDragSecKey(sec.key);}}}
                onDragEnd={()=>setDragSecKey(null)}
                onClick={()=>{ setActiveSection(sec.key); setEditorTab('editor'); }}
                className={"w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg mb-0.5 cursor-pointer transition-colors border-l-2 "+(isActive&&editorTab==='editor'?'bg-white/10 text-white border-blue-400':isHidden?'text-gray-600 hover:text-gray-400 hover:bg-white/5 border-transparent opacity-50':'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent')}>
                <span className="text-gray-500 cursor-grab text-[10px] shrink-0">≡</span>
                <Icon name={sec.icon} size={12} className="shrink-0"/>
                {renamingSection === sec.key ? (
                  <input autoFocus value={renameSectionInput}
                    onChange={e=>setRenameSectionInput(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter'){setSectionLabels(l=>({...l,[sec.key]:renameSectionInput.trim()||sec.label}));setRenamingSection(null);} if(e.key==='Escape')setRenamingSection(null); }}
                    onBlur={()=>{setSectionLabels(l=>({...l,[sec.key]:renameSectionInput.trim()||sec.label}));setRenamingSection(null);}}
                    onClick={e=>e.stopPropagation()}
                    className="flex-1 bg-gray-900 text-white text-[10px] rounded px-1 py-0.5 border border-blue-500 outline-none min-w-0"/>
                ) : (
                  <span className="flex-1 text-[11.5px] font-medium truncate">{sectionLabels[sec.key] || sec.label}</span>
                )}
                {sec.key !== 'header' && sec.key !== 'custom' && (
                  <button onClick={e=>{e.stopPropagation();setRenamingSection(sec.key);setRenameSectionInput(sectionLabels[sec.key]||sec.label);}}
                    aria-label="Rename section" className="text-gray-500 hover:text-blue-400 p-1.5 rounded transition-colors shrink-0">
                    <Icon name="Pencil" size={9}/>
                  </button>
                )}
                <button onClick={e=>{e.stopPropagation();toggleHideSection(sec.key);}}
                  title={isHidden?'Show in resume':'Hide from resume'}
                  className={"p-1.5 rounded transition-colors shrink-0 "+(isHidden?'text-gray-400 hover:text-yellow-400':'text-gray-500 hover:text-gray-300')}>
                  <Icon name={isHidden?'EyeOff':'Eye'} size={11}/>
                </button>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:isHidden?'#374151':DotColors[done[sec.key]||'empty']}}/>
              </div>
            );
          })}
        </nav>

        <CvAtsScore data={data}/>

        {/* Template picker */}
        <div className="px-3 py-2 border-t border-gray-800 cv-template-panel">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9.5px] font-semibold uppercase tracking-widest text-gray-400">Template</p>
            <span className="text-[9px] text-gray-400">{TEMPLATES.findIndex(t=>t.key===template)+1}/{TEMPLATES.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 max-h-64 overflow-y-auto pb-1" style={{scrollbarWidth:'thin',scrollbarColor:'#374151 transparent'}}>
            {TEMPLATES.map(t=>{
              const tTheme = getThemeColors(themePerTemplate[t.key]||'blue-teal', customColorsPerTemplate[t.key]||DEFAULT_CUSTOM);
              const isSelected = template===t.key;
              return (
                <button key={t.key} onClick={()=>setTemplate(t.key)} title={t.label}
                  className={"cv-template-card flex flex-col items-center gap-1 rounded-lg p-1 transition-all "+(isSelected?'ring-2 ring-blue-500 bg-blue-900/30':'hover:bg-gray-800/60')}>
                  <div style={{ width:'100%', aspectRatio:'3/4', borderRadius:'4px', overflow:'hidden', border:isSelected?'1.5px solid #3b82f6':'1px solid #374151' }}>
                    <CvTemplateThumbnail tk={t.key} primary={tTheme.primary} accent={tTheme.accent} sidebar={tTheme.sidebar} isActive={isSelected}/>
                  </div>
                  <span className={"text-[9px] font-medium leading-tight text-center truncate w-full "+(isSelected?'text-blue-400':'text-gray-400')}>{t.label.replace(' ✦','')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color theme */}
        <div className="px-3 pb-2 border-t border-gray-800 pt-2">
          <p className="text-[9.5px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Color Theme</p>
          <div className="grid grid-cols-4 gap-1 mb-1.5">
            {Object.entries(CV_COLOR_THEMES).map(([key,val])=>(
              <button key={key} onClick={()=>setThemePerTemplate(t=>({...t,[template]:key}))} title={val.label}
                className="relative h-7 rounded overflow-hidden border-2 transition-all"
                style={{borderColor:currentThemeKey===key?'#60a5fa':'transparent'}}>
                <div style={{position:'absolute',inset:0,left:0,width:'50%',background:val.primary}}/>
                <div style={{position:'absolute',inset:0,left:'50%',background:val.accent}}/>
                {key==='custom'&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:'9px',color:'#fff',fontWeight:'700',textShadow:'0 0 3px rgba(0,0,0,.8)'}}>✎</span></div>}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-gray-400 mb-1">{CV_COLOR_THEMES[currentThemeKey]?.label||'Custom'}</p>
          {currentThemeKey==='custom'&&(
            <div className="flex gap-3">
              <div><p className="text-[9px] text-gray-400 mb-1">Primary</p><input type="color" value={currentCustom.primary} onChange={e=>setCustomColorsPerTemplate(c=>({...c,[template]:{...c[template],primary:e.target.value}}))} style={{width:'34px',height:'26px',padding:0,border:'none',borderRadius:'4px',cursor:'pointer'}}/></div>
              <div><p className="text-[9px] text-gray-400 mb-1">Accent</p><input type="color" value={currentCustom.accent} onChange={e=>setCustomColorsPerTemplate(c=>({...c,[template]:{...c[template],accent:e.target.value}}))} style={{width:'34px',height:'26px',padding:0,border:'none',borderRadius:'4px',cursor:'pointer'}}/></div>
            </div>
          )}
        </div>

        {/* Typography */}
        <div className="px-3 pb-2 border-t border-gray-800 pt-2">
          <p className="text-[9.5px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Typography</p>
          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="cv-heading-font" className="text-[9px] text-gray-400 mb-0.5 block">Heading font</label>
              <select id="cv-heading-font" aria-label="Heading font" value={headingFont} onChange={e=>setHeadingFont(e.target.value)} style={{color:'#e5e7eb',backgroundColor:'#1f2937',width:'100%',borderRadius:'6px',padding:'4px 6px',fontSize:'11px',border:'1px solid #374151'}}>
                {CV_FONT_CATEGORIES.map(cat=>(<optgroup key={cat.label} label={cat.label} style={{color:'#9ca3af',backgroundColor:'#1f2937'}}>{cat.fonts.map(f=><option key={f.key} value={f.key} style={{color:'#111827',background:'#fff'}}>{f.label}</option>)}</optgroup>))}
              </select>
            </div>
            <div>
              <label htmlFor="cv-body-font" className="text-[9px] text-gray-400 mb-0.5 block">Body font</label>
              <select id="cv-body-font" aria-label="Body font" value={bodyFont} onChange={e=>setBodyFont(e.target.value)} style={{color:'#e5e7eb',backgroundColor:'#1f2937',width:'100%',borderRadius:'6px',padding:'4px 6px',fontSize:'11px',border:'1px solid #374151'}}>
                {CV_FONT_CATEGORIES.map(cat=>(<optgroup key={cat.label} label={cat.label} style={{color:'#9ca3af',backgroundColor:'#1f2937'}}>{cat.fonts.map(f=><option key={f.key} value={f.key} style={{color:'#111827',background:'#fff'}}>{f.label}</option>)}</optgroup>))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label htmlFor="cv-heading-size" className="text-[9px] text-gray-400 mb-0.5 block">Name: {headingSize}px</label><input id="cv-heading-size" aria-label="Heading font size" type="range" min="20" max="36" value={headingSize} onChange={e=>setHeadingSize(+e.target.value)} className="w-full h-1.5 rounded" style={{accentColor:'#3b82f6'}}/></div>
              <div><label htmlFor="cv-body-size" className="text-[9px] text-gray-400 mb-0.5 block">Body: {bodySize}px</label><input id="cv-body-size" aria-label="Body font size" type="range" min="11" max="15" step="0.5" value={bodySize} onChange={e=>setBodySize(+e.target.value)} className="w-full h-1.5 rounded" style={{accentColor:'#3b82f6'}}/></div>
            </div>
            <div className="flex gap-1">
              {[['S',22,11],['M',26,12],['L',30,13]].map(([lbl,hs,bs])=>(
                <button key={lbl} onClick={()=>{setHeadingSize(hs);setBodySize(bs);}} className={"flex-1 py-1 rounded text-[11px] font-bold transition-colors "+(headingSize===hs&&bodySize===bs?'bg-blue-600 text-white':'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200')}>{lbl}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills + ATS */}
        <div className="px-3 pb-2 border-t border-gray-800 pt-2 flex flex-col gap-2">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">ATS Mode</p>
            <button onClick={()=>setAtsMode(v=>!v)} className={"w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors "+(atsMode?'bg-green-700 text-white':'bg-gray-800 text-gray-400 hover:bg-gray-700')}>
              <span>{atsMode?'ON - B&W':'OFF - Color'}</span>
              <span className={"w-3 h-3 rounded-full border-2 "+(atsMode?'bg-green-300 border-green-300':'bg-transparent border-gray-600')}/>
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="px-3 pb-4 flex flex-col gap-1.5 border-t border-gray-800 pt-3 cv-export-panel">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Export</p>
          <button onClick={exportPdf} disabled={exporting}
            className="cv-export-primary flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors">
            {exporting?<Icon name="Loader" size={13} className="animate-spin"/>:<Icon name="FileDown" size={13}/>} Export PDF
          </button>
          <button onClick={reset} className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-red-900/50 rounded-lg px-3 py-2 text-[11px] font-medium transition-colors w-full">
            <Icon name="RotateCcw" size={12}/> Reset CV
          </button>
        </div>
      </aside>

      {/* ── CENTER EDITOR ── */}
      <div className="flex flex-col flex-1 min-w-0 bg-gray-50 overflow-hidden">
        {importBanner && (
          <div className="flex items-center justify-between gap-3 bg-blue-600 px-5 py-2 shrink-0">
            <p className="text-[12px] text-white font-medium">Data imported from AI CV Maker</p>
            <div className="flex gap-2">
              <button onClick={()=>{setData(migrateData(importBanner));setImportBanner(null);}} className="bg-white text-blue-600 text-[11px] font-bold px-3 py-1 rounded-md">Load</button>
              <button onClick={()=>setImportBanner(null)} className="text-blue-200 hover:text-white text-[11px] px-2">Dismiss</button>
            </div>
          </div>
        )}

        {/* Top bar — hamburger | tabs | actions */}
        <div className="cv-editor-toolbar flex items-center bg-white border-b border-gray-100 shrink-0 min-h-[44px]">
          {/* Hamburger (mobile) / sidebar toggle */}
          <button onClick={()=>setShowSidebar(v=>!v)}
            className="p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors shrink-0 border-r border-gray-100"
            title="Toggle sidebar">
            <Icon name="Menu" size={17}/>
          </button>

          {/* Tabs */}
          <div className="flex items-center flex-1 overflow-x-auto" style={{scrollbarWidth:'none'}}>
            {[
              { key:'editor',      icon:'Edit3',    label:'Edit',        active:'border-blue-500 text-blue-600'   },
              { key:'jobmatch',    icon:'Target',   label:'Job Match',   active:'border-orange-500 text-orange-600'},
              { key:'coverletter', icon:'Mail',     label:'Cover Letter',active:'border-purple-500 text-purple-600'},
              { key:'score',       icon:'BarChart2',label:'Score',       active:'border-green-500 text-green-600'  },
              { key:'guide',       icon:'BookOpen', label:'Guide',       active:'border-teal-500 text-teal-600'    },
            ].map(tab=>(
              <button key={tab.key} onClick={()=>setEditorTab(tab.key)}
                className={"flex items-center gap-1.5 px-3 py-3 text-[11.5px] font-semibold border-b-2 whitespace-nowrap transition-colors " +
                  (editorTab===tab.key ? tab.active : 'border-transparent text-gray-500 hover:text-gray-700')}>
                <Icon name={tab.icon} size={12}/>{tab.label}
              </button>
            ))}
          </div>

          {/* Right actions — section nav + undo/preview toggle */}
          <div className="flex items-center gap-0.5 px-2 shrink-0">
            {editorTab === 'editor' && (<>
              <button aria-label="Previous section" onClick={prevSection} disabled={orderedSections.findIndex(s=>s.key===activeSection)===0}
                className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-25 transition-colors">
                <Icon name="ChevronLeft" size={14}/>
              </button>
              <span className="text-[12px] font-semibold text-gray-700 px-1 min-w-[60px] text-center">{activeLabel}</span>
              <button aria-label="Next section" onClick={nextSection} disabled={orderedSections.findIndex(s=>s.key===activeSection)===orderedSections.length-1}
                className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-25 transition-colors">
                <Icon name="ChevronRight" size={14}/>
              </button>
              {activeMulti && (
                <button onClick={handleAddEntry} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ml-1">
                  <Icon name="Plus" size={11}/> Add
                </button>
              )}
              <span className="w-px h-5 bg-gray-200 mx-1"/>
              <button onClick={undo} disabled={!canUndo} aria-label="Undo" className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"><Icon name="Undo2" size={13}/></button>
              <button onClick={redo} disabled={!canRedo} aria-label="Redo" className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"><Icon name="Redo2" size={13}/></button>
            </>)}
            {/* Preview toggle */}
            <button onClick={()=>setShowPreview(v=>!v)}
              title={showPreview ? 'Hide preview' : 'Show preview'}
              className={"ml-1 flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors " + (showPreview ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
              <Icon name={showPreview ? 'EyeOff' : 'Eye'} size={13}/>
              <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Preview'}</span>
            </button>
          </div>
        </div>


        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{scrollbarWidth:'thin',scrollbarColor:'#d1d5db transparent'}}>

          {/* ── EDITOR TAB ── */}
          {editorTab === 'editor' && (
            <div>
              {activeMulti && Array.isArray(data[activeSection]) && data[activeSection].length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                    <Icon name="Plus" size={26} className="text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 font-semibold text-[14px] mb-1">No {activeLabel} entries yet</p>
                    <p className="text-[12px] text-gray-500">Click Add to fill in your first entry</p>
                  </div>
                  <button onClick={handleAddEntry} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2 text-[13px] font-semibold transition-colors">
                    <Icon name="Plus" size={14} /> Add {activeLabel}
                  </button>
                </div>
              ) : (
                <div>
                  {/* Section label editor */}
                  {activeSection !== 'header' && activeSection !== 'custom' && (
                    <div className="mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                      <span className="text-[10.5px] font-semibold uppercase tracking-wider text-gray-400 shrink-0">Section title</span>
                      <input
                        value={sectionLabels[activeSection] || CV_SECTIONS.find(s=>s.key===activeSection)?.label || ''}
                        onChange={e => setSectionLabels(l => ({ ...l, [activeSection]: e.target.value }))}
                        className="flex-1 text-[13px] font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none px-1 py-0.5 bg-transparent transition-colors min-w-0"
                        placeholder="Section title…"
                      />
                      <Icon name="Pencil" size={11} className="text-gray-300 shrink-0"/>
                    </div>
                  )}
                  {hiddenSections.includes(activeSection) && (
                    <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                      <Icon name="EyeOff" size={14} className="text-amber-500 shrink-0"/>
                      <p className="text-[12px] text-amber-800 flex-1 font-medium">This section is <strong>hidden</strong> from the resume preview.</p>
                      <button onClick={() => toggleHideSection(activeSection)} className="shrink-0 flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors">
                        <Icon name="Eye" size={10}/> Show
                      </button>
                    </div>
                  )}
                  {sectionForm}
                  <CvProfessionalTips data={data} />
                  <CvResumeScore data={data} />
                </div>
              )}
            </div>
          )}

          {/* ── JOB MATCH TAB ── */}
          {editorTab === 'jobmatch' && (
            <div className="flex flex-col gap-5">
              {/* Step 1 */}
              <div>
                <p className="text-[13px] font-bold text-gray-800 mb-1">Step 1 — Paste the job description</p>
                <p className="text-[12px] text-gray-500 mb-2">Copy the full job posting and paste it below. The more text you add, the better the keyword analysis.</p>
                <textarea
                  value={jobDesc} onChange={e=>setJobDesc(e.target.value)}
                  rows={6} placeholder="Paste the complete job description here…&#10;&#10;e.g. We are looking for a Senior Software Engineer with experience in React, Node.js, and AWS..."
                  style={{color:'#111827',backgroundColor:'#ffffff',caretColor:'#111827',WebkitTextFillColor:'#111827'}}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-none transition-colors"/>
                {jobDesc && (
                  <button onClick={()=>setJobDesc('')} className="mt-1.5 text-[11px] text-gray-400 hover:text-red-500 font-medium transition-colors">
                    Clear job description
                  </button>
                )}
              </div>

              {/* Step 2 — results */}
              {jobDesc.trim() ? (
                <div className="flex flex-col gap-4">
                  {/* Score bar */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-bold text-gray-800">Keyword Match Score</p>
                      <span className="text-[20px] font-black tabular-nums"
                        style={{color:atsKeywords.score>=70?'#16a34a':atsKeywords.score>=40?'#d97706':'#dc2626'}}>
                        {atsKeywords.score}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{width:`${atsKeywords.score}%`,background:atsKeywords.score>=70?'#16a34a':atsKeywords.score>=40?'#d97706':'#dc2626'}}/>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {atsKeywords.found.length} of {atsKeywords.total} keywords matched · {' '}
                      {atsKeywords.score >= 70 ? 'Great match — your resume fits this role well!' :
                       atsKeywords.score >= 40 ? 'Decent match — add the missing keywords to improve.' :
                       'Low match — your resume needs more keywords from this job.'}
                    </p>
                  </div>

                  {/* Found keywords */}
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                    <p className="text-[11.5px] font-bold text-green-800 mb-2 flex items-center gap-1.5">
                      <Icon name="CheckCircle" size={12}/> Found in resume ({atsKeywords.found.length})
                    </p>
                    {atsKeywords.found.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {atsKeywords.found.slice(0,30).map(k=>(
                          <span key={k} className="px-2 py-0.5 bg-white text-green-700 rounded text-[11px] font-medium border border-green-200">{k}</span>
                        ))}
                      </div>
                    ) : <p className="text-[11px] text-green-700">None yet — fill your resume sections.</p>}
                  </div>

                  {/* Smart suggestions for missing */}
                  {(atsKeywords.missing.length > 0 || jobDesc.trim()) ? (
                    <CvJobMatchFixes data={data} setData={setData} missing={atsKeywords.missing} jobDesc={jobDesc} />
                  ) : (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center gap-2">
                      <Icon name="CheckCircle" size={14} className="text-green-600 shrink-0"/>
                      <p className="text-[11.5px] text-green-800 font-semibold">All keywords matched — great fit for this role!</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                    <Icon name="Target" size={26} className="text-orange-400"/>
                  </div>
                  <p className="text-[14px] font-semibold text-gray-700">No job description yet</p>
                  <p className="text-[12px] text-gray-500 max-w-xs">Paste a job posting above and we'll instantly show which keywords your resume matches and which are missing.</p>
                </div>
              )}
            </div>
          )}

          {/* ── COVER LETTER TAB ── */}
          {editorTab === 'coverletter' && (
            <CvCoverLetterPanel data={data} jobDesc={jobDesc} />
          )}

          {/* ── SCORE TAB ── */}
          {editorTab === 'score' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="BarChart2" size={16} className="text-blue-500"/>
                <h3 className="text-[15px] font-bold text-gray-800">Resume Score Report</h3>
              </div>
              <p className="text-[12px] text-gray-500 -mt-2">Scores are calculated automatically as you fill in your resume. Aim for 80+ overall.</p>

              {[
                { label: 'ATS Score', value: calcAtsScore(data), color: '#2563eb', icon: 'Shield',
                  desc: 'How well your resume will pass Applicant Tracking Systems. Needs name, email, experience, education, skills.',
                  tips: calcAtsScore(data) < 100 ? ['Add name + email (30 pts)', 'Add work experience with bullets (20 pts)', 'Add education (10 pts)', 'Add 3+ skills per category (10 pts)', 'Add projects (5 pts)'] : [] },
                { label: 'Completeness', value: calcCompletenessScore(data), color: '#7c3aed', icon: 'CheckSquare',
                  desc: 'How completely filled your resume sections are.',
                  tips: calcCompletenessScore(data) < 100 ? ['Fill all header fields (30 pts)', 'Write a 100+ char summary (15 pts)', 'Add 2+ experience entries (20 pts)', 'Add 10+ skills (15 pts)'] : [] },
                { label: 'Grammar & Writing', value: calcGrammarScore(data), color: '#059669', icon: 'Type',
                  desc: 'Bullet point quality — strong action verbs, no weak openers, appropriate length.',
                  tips: calcGrammarScore(data) < 95 ? ['Start bullets with action verbs (Built, Led, Designed…)', 'Avoid "was", "did", "helped" as first word', 'Keep each bullet under 200 characters', 'Avoid first-person pronouns in summary'] : [] },
                { label: 'Keyword Density', value: Math.min(100, Math.round((safeArr(data?.skills).flatMap(s=>safeArr(s.items)).length / 15) * 100)), color: '#d97706', icon: 'Tag',
                  desc: 'Skills section density. 15+ skills = 100 points.',
                  tips: ['Add more skills — aim for 15+ across categories', 'Group skills by category (Languages, Frameworks, Tools)'] },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={item.icon} size={14} style={{color:item.color}}/>
                      <span className="text-[13px] font-bold text-gray-800">{item.label}</span>
                    </div>
                    <span className="text-[18px] font-bold tabular-nums" style={{color:item.value>=80?'#16a34a':item.value>=60?'#d97706':'#dc2626'}}>{item.value}<span className="text-[12px] text-gray-400">/100</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-700" style={{width:`${item.value}%`,background:item.color}}/>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">{item.desc}</p>
                  {item.value < 100 && item.tips.length > 0 && (
                    <ul className="flex flex-col gap-1">
                      {item.tips.map((tip,i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                          <span className="text-amber-500 mt-0.5 shrink-0">•</span>{tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* ATS Fix Suggestions */}
              <CvAtsFix data={data} setData={setData} />

              {/* Overall */}
              <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-4 mt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-bold text-gray-800">Overall Score</span>
                  <span className="text-[24px] font-black tabular-nums" style={{color:Math.round((calcAtsScore(data)+calcCompletenessScore(data)+calcGrammarScore(data)+Math.min(100,Math.round((safeArr(data?.skills).flatMap(s=>safeArr(s.items)).length/15)*100)))/4)>=80?'#16a34a':Math.round((calcAtsScore(data)+calcCompletenessScore(data)+calcGrammarScore(data)+Math.min(100,Math.round((safeArr(data?.skills).flatMap(s=>safeArr(s.items)).length/15)*100)))/4)>=60?'#d97706':'#dc2626'}}>
                    {Math.round((calcAtsScore(data)+calcCompletenessScore(data)+calcGrammarScore(data)+Math.min(100,Math.round((safeArr(data?.skills).flatMap(s=>safeArr(s.items)).length/15)*100)))/4)}<span className="text-[14px] text-gray-400 font-normal">/100</span>
                  </span>
                </div>
                <p className="text-[11px] text-blue-700">Average of ATS + Completeness + Grammar + Keywords. Score 80+ to be competitive for most roles.</p>
              </div>
            </div>
          )}
          {/* ── GUIDE TAB ── */}
          {editorTab === 'guide' && (
            <ResumeGuideContent />
          )}
        </div>
      </div>

      {/* ── RIGHT PREVIEW ── */}
      <div ref={previewWrapRef}
        className={"cv-preview-panel bg-gray-200 overflow-y-auto flex flex-col items-center py-4 px-4 gap-3 " + (showPreview ? "w-[420px] shrink-0" : "hidden")}
  style={{scrollbarWidth:'thin',scrollbarColor:'#d1d5db transparent',overflowX:'auto'}}>
        <div className="cv-preview-toolbar self-start flex-shrink-0 flex items-center gap-2 w-full flex-wrap">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Preview</p>
          <span className="text-[9px] text-gray-600 font-mono">A4 · 210×297mm</span>
          {atsMode&&<span className="text-[9px] bg-green-700 text-white px-2 py-0.5 rounded-full font-semibold">ATS</span>}
          <span className="text-[9px] bg-purple-700 text-white px-2 py-0.5 rounded-full font-semibold">{onePage ? (onePgFitPct < 100 ? '1-Page (cropped)' : 'Fits 1 page') : `${numPageMarkers + 1} pages`}</span>
          <div className="ml-auto flex items-center gap-1.5 flex-wrap justify-end">
            {/* Zoom controls */}
            <button onClick={()=>setManualZoom(z=>Math.max(0.2,(z||previewScale)-0.05))} className="w-5 h-5 flex items-center justify-center rounded bg-gray-300 hover:bg-gray-400 text-gray-700 text-[11px] font-bold transition-colors">−</button>
            <span className="text-[9px] text-gray-600 w-8 text-center tabular-nums">{Math.round((manualZoom||previewScale)*100)}%</span>
            <button onClick={()=>setManualZoom(z=>Math.min(1.5,(z||previewScale)+0.05))} className="w-5 h-5 flex items-center justify-center rounded bg-gray-300 hover:bg-gray-400 text-gray-700 text-[11px] font-bold transition-colors">+</button>
            {manualZoom!==null&&<button onClick={()=>setManualZoom(null)} title="Reset zoom" className="text-[9px] text-blue-500 hover:text-blue-700 font-medium">auto</button>}
            <div className="w-px h-3 bg-gray-400"/>
            <div className="w-14 h-1.5 bg-gray-400 rounded-full overflow-hidden" title={"Page fill: "+fillPct+"%"}>
              <div className="h-full rounded-full" style={{width:Math.min(100,fillPct)+'%',background:fillPct>=90?'#22c55e':fillPct>=60?'#f59e0b':'#ef4444'}}/>
            </div>
            <span className="text-[9px] text-gray-600">{fillPct}%</span>
          </div>
        </div>
        <div style={{position:'relative',width:Math.ceil(794 * effectiveScale)+'px',height:Math.ceil((onePage ? PAGE_H : docHeight)*effectiveScale + (onePage ? 0 : numPageMarkers*12))+'px',flexShrink:0}}>
          {/* Render each page as a separate sheet with a gap between them */}
          {Array.from({length: onePage ? 1 : Math.max(1,numPageMarkers+1)}).map((_,pageIdx)=>{
            const pageTop   = pageIdx * (PAGE_H * effectiveScale + 12);
            const clipTop   = pageIdx * PAGE_H;
            const clipH     = PAGE_H;
            const isLast    = pageIdx === numPageMarkers;
            const lastPageH = isLast ? Math.max(0, docHeight - pageIdx*PAGE_H) : PAGE_H;
            return (
           <div key={pageIdx} style={{
  position:'absolute',
  top: pageTop+'px',
  left:0,
  width: Math.ceil(794 * effectiveScale)+'px',
  height: Math.ceil(PAGE_H * effectiveScale)+'px',
  overflow:'hidden',
  borderRadius:'4px',
  boxShadow:'0 2px 16px rgba(0,0,0,0.15)',
  background:'#ffffff',
}}>
                <div id={pageIdx===0?'cv-preview-root':undefined}
                  ref={pageIdx===0?previewRef:undefined}
                style={{
  position:'absolute',
  top:0,
  left:0,
  width:'794px',
  minHeight: PAGE_H+'px',
  transform:`scale(${effectiveScale})`,
  transformOrigin:'top left',
  backgroundColor:'#ffffff',
  pointerEvents: pageIdx===0 ? undefined : 'none',
}}>
                  <PreviewComponent {...sharedTemplateProps}/>
                </div>
                <div style={{position:'absolute',bottom:'8px',right:'10px',fontSize:'8px',color:'#9ca3af',fontFamily:'monospace',background:'rgba(255,255,255,0.85)',padding:'1px 6px',borderRadius:'3px',pointerEvents:'none',userSelect:'none'}}>Page {pageIdx+1}</div>
              </div>
            );
          })}
        </div>
        {previewScale < 0.35 && <p style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center' }}>Preview is small — expand the window for a better view</p>}
      </div>

      {/* ── IMPORT MODAL ── */}
      {showImport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-[15px] font-bold text-gray-800">Import Resume</h2>
              <button aria-label="Close import dialog" onClick={()=>{setShowImport(false);setImportText('');setImportResult(null);}} className="text-gray-400 hover:text-gray-700 p-1 rounded"><Icon name="X" size={16}/></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-5 gap-0">
              {[{key:'paste',label:'Paste Resume Text'},{key:'linkedin',label:'LinkedIn Import'}].map(tab=>(
                <button key={tab.key} onClick={()=>{setImportTab(tab.key);setImportResult(null);setImportText('');}}
                  className={"px-3 py-2.5 text-[12px] font-semibold border-b-2 transition-colors "+(importTab===tab.key?'border-blue-500 text-blue-600':'border-transparent text-gray-500 hover:text-gray-700')}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {importTab === 'paste' ? (
                <div>
                  <p className="text-[12px] text-gray-500 mb-3">Copy all text from your existing resume (Ctrl+A → Ctrl+C) and paste it below. Works with any format.</p>
                  <textarea value={importText} onChange={e=>setImportText(e.target.value)} rows={8}
                    placeholder={"John Smith\njohn@email.com | +1 555 0100 | New York\n\nEXPERIENCE\nSoftware Engineer — Acme Corp\nJan 2022 – Present\n• Built scalable APIs using Node.js\n• Led a team of 4 engineers\n\nEDUCATION\nBS Computer Science — MIT | 2018–2022\n\nSKILLS\nJavaScript, React, Node.js, Python"}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none font-mono"/>
                </div>
              ) : (
                <div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <p className="text-[12px] font-semibold text-blue-800 mb-2">How to copy your LinkedIn profile:</p>
                    <ol className="text-[11.5px] text-blue-700 list-decimal list-inside space-y-1">
                      <li>Open your LinkedIn profile in a browser</li>
                      <li>Press <kbd className="bg-white border border-blue-200 rounded px-1 py-0.5 text-[10px] font-mono">Ctrl+A</kbd> to select all</li>
                      <li>Press <kbd className="bg-white border border-blue-200 rounded px-1 py-0.5 text-[10px] font-mono">Ctrl+C</kbd> to copy</li>
                      <li>Paste below with <kbd className="bg-white border border-blue-200 rounded px-1 py-0.5 text-[10px] font-mono">Ctrl+V</kbd></li>
                    </ol>
                  </div>
                  <textarea value={importText} onChange={e=>setImportText(e.target.value)} rows={8}
                    placeholder="Paste your LinkedIn profile text here…"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[12px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"/>
                </div>
              )}

              {/* Parsed preview */}
              {importResult && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-[12px] font-bold text-green-800 mb-2">✓ Successfully parsed — ready to import</p>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-green-700">
                    {importResult.header?.name && <span>👤 {importResult.header.name}</span>}
                    {importResult.header?.email && <span>✉ {importResult.header.email}</span>}
                    {(importResult.experience||[]).length>0 && <span>💼 {importResult.experience.length} experience{importResult.experience.length>1?'s':''}</span>}
                    {(importResult.education||[]).length>0 && <span>🎓 {importResult.education.length} education</span>}
                    {(importResult.skills||[]).length>0 && <span>🛠 {importResult.skills.length} skill categor{importResult.skills.length>1?'ies':'y'}</span>}
                    {(importResult.projects||[]).length>0 && <span>📁 {importResult.projects.length} project{importResult.projects.length>1?'s':''}</span>}
                    {(importResult.certifications||[]).length>0 && <span>🏅 {importResult.certifications.length} cert{importResult.certifications.length>1?'s':''}</span>}
                    {(importResult.languages||[]).length>0 && <span>🌍 {importResult.languages.length} language{importResult.languages.length>1?'s':''}</span>}
                  </div>
                  {(importResult.flags||[]).filter(f=>f.level==='ERROR'||f.level==='MISSING').length>0 && (
                    <div className="mt-2 text-[11px] text-amber-700">
                      {importResult.flags.filter(f=>f.level==='ERROR'||f.level==='MISSING').map((f,i)=><p key={i}>⚠ {f.message}</p>)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100">
              {!importResult ? (
                <>
                  <button onClick={()=>{setShowImport(false);setImportText('');}} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-[12px] font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleImportParse} disabled={importing||importText.trim().length<50}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[12px] font-bold transition-colors flex items-center justify-center gap-2">
                    {importing?<><Icon name="Loader" size={13} className="animate-spin"/>Parsing…</>:<><Icon name="Sparkles" size={13}/>Parse with AI</>}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={()=>setImportResult(null)} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-[12px] font-semibold hover:bg-gray-50 transition-colors">Re-parse</button>
                  <button onClick={handleImportConfirm} className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[12px] font-bold transition-colors flex items-center justify-center gap-2">
                    <Icon name="Check" size={13}/>Load into Builder
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden export div */}
      <div aria-hidden="true" style={{position:'absolute',left:'-9999px',top:0,width:'794px',background:'#fff',pointerEvents:'none',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
        <div id="cv-export-root" ref={exportRef} style={{width:'794px',WebkitPrintColorAdjust:'exact',printColorAdjust:'exact'}}>
          <PreviewComponent {...exportTemplateProps}/>
        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          .fixed.inset-0 { display: block !important; position: static !important; }
          aside, .bg-gray-50 { display: none !important; }
          .w-\\[420px\\] { display: block !important; padding: 0 !important; background: white !important; width: 100% !important; }
          div[style*="transform"] { transform: none !important; width: 100% !important; position: static !important; }
        }
      `}</style>
    </div>
  );
}

export default ResumeBuilderTool;

// ─── Resume Guide Content (Guide Tab) ────────────────────────────────────────
function ResumeGuideContent() {
  const [openFaq, setOpenFaq] = React.useState(null);

  const actionVerbs = {
    'Leadership':   ['Led','Managed','Directed','Supervised','Coordinated','Mentored','Oversaw','Guided','Established','Spearheaded'],
    'Achievement':  ['Achieved','Delivered','Exceeded','Improved','Increased','Reduced','Generated','Saved','Boosted','Maximized'],
    'Technical':    ['Built','Developed','Engineered','Designed','Architected','Implemented','Deployed','Automated','Optimized','Migrated'],
    'Creative':     ['Created','Designed','Launched','Produced','Developed','Crafted','Authored','Introduced','Pioneered','Initiated'],
    'Analysis':     ['Analyzed','Evaluated','Researched','Assessed','Identified','Investigated','Measured','Monitored','Audited','Reviewed'],
    'Communication':['Presented','Negotiated','Collaborated','Liaised','Advised','Facilitated','Advocated','Translated','Communicated','Trained'],
  };

  const formats = [
    { name:'Chronological', icon:'📅', best:'Most candidates — clear career progression', avoid:'Career changers, large gaps', pros:['ATS-friendly','Shows growth','Recruiters prefer it'], color:'#2563eb' },
    { name:'Functional',    icon:'🔧', best:'Career changers, fresh graduates',           avoid:'Most job seekers (ATS often rejects it)', pros:['Highlights skills','Hides gaps','Good for pivots'], color:'#7c3aed' },
    { name:'Hybrid/Combo',  icon:'⚡', best:'Experienced professionals, senior roles',    avoid:'Entry level (too complex)',              pros:['Skills + history','Flexible','Professional'], color:'#059669' },
  ];

  const recruiterScan = [
    { label:'Name & Contact',    pct:99, desc:'First thing every recruiter checks',            color:'#ef4444' },
    { label:'Current Title/Role',pct:95, desc:'Are you relevant to this position?',            color:'#f97316' },
    { label:'Current Employer',  pct:90, desc:'Brand recognition matters',                     color:'#f59e0b' },
    { label:'Previous Employers',pct:82, desc:'Career trajectory check',                       color:'#84cc16' },
    { label:'Education',         pct:71, desc:'Degree and institution scanned',                color:'#22c55e' },
    { label:'Skills Section',    pct:65, desc:'ATS keyword matching starts here',              color:'#06b6d4' },
    { label:'Summary/Objective', pct:50, desc:'Only read if above checks pass',                color:'#8b5cf6' },
    { label:'Bullet Points',     pct:30, desc:'Only if interview is likely',                   color:'#6366f1' },
  ];

  const faqs = [
    { q:'How long should my resume be?',
      a:'1 page for 0–10 years of experience. 2 pages for 10+ years or senior/executive roles. Never 3+ pages unless you are a professor with publications. Recruiters spend 6–10 seconds on first screening — conciseness is critical.' },
    { q:'Should I include a photo on my resume?',
      a:'Depends on country: Yes in Germany, Austria, France, Middle East, Asia. No in USA, UK, Canada, Australia (discrimination laws). Check norms for the specific country you\'re applying to. Always include a professional headshot if the job posting requests it.' },
    { q:'What is ATS and how do I beat it?',
      a:'ATS (Applicant Tracking System) is software that scans resumes before a human ever sees them. 75% of resumes are rejected by ATS. To pass: use keywords from the job description, use standard section headings (Experience, Education, Skills), avoid tables/columns/headers/footers, save as .docx or plain PDF, and use a clean single-column format.' },
    { q:'How do I write strong bullet points?',
      a:'Use the STAR formula: Situation/Task → Action → Result. Lead with an action verb. Quantify everything possible. Example: "Increased API response time by 40% by implementing Redis caching, reducing server costs by $12K/year." Bad: "Responsible for improving API performance." Aim for 3–5 bullets per role.' },
    { q:'Should I have an objective or summary?',
      a:'Summary (not objective) for experienced professionals (5+ years). Objective only for fresh graduates or complete career changers. A summary should be 2–3 lines max, highlight your biggest achievement, and include your target role. Skip it entirely if you\'re short on space — add that space to experience bullets instead.' },
    { q:'How often should I update my resume?',
      a:'After every major project, promotion, or skill acquired — not just when job searching. Update every 3–6 months. This ensures you don\'t forget key achievements. Always tailor the resume for each application: customize the summary and reorder skills/bullets to match the job description.' },
    { q:'What font and size should I use?',
      a:'Font: Calibri, Garamond, Georgia, or Helvetica. Never Times New Roman (outdated) or Comic Sans. Size: name 18–24pt, headings 11–12pt, body 10–11pt. Margins: 0.5–1 inch. Line spacing: 1.0–1.15. Consistency matters more than any specific choice — pick one font and stick to it.' },
    { q:'How do I handle employment gaps?',
      a:'Be honest but strategic. Use years only (not months) for dates if gaps are under 3 months. For longer gaps: add a brief explanation in your summary or as a line item (e.g., "Career Break — Family Care, 2022–2023"). Use the time to show self-improvement: certifications, freelance work, courses, volunteering all fill gaps legitimately.' },
  ];

  const sectionPriority = [
    { stage:'Fresh Graduate',   order:['Header','Education','Skills','Projects','Experience','Certifications'] },
    { stage:'1–5 Years',        order:['Header','Experience','Skills','Education','Projects','Certifications'] },
    { stage:'5–10 Years',       order:['Header','Summary','Experience','Skills','Education','Certifications'] },
    { stage:'Senior / Director',order:['Header','Summary','Experience','Achievements','Education','Board/Advisory'] },
  ];

  const card = 'rounded-xl border border-gray-200 bg-white p-4 shadow-sm';
  const sectionTitle = 'text-[14px] font-bold text-gray-800 mb-1';
  const sectionSub   = 'text-[12px] text-gray-500 mb-4';

  return (
    <div className="flex flex-col gap-5 pb-6">

      {/* 6-Second Scan */}
      <div className={card}>
        <p className={sectionTitle}>What Recruiters Scan in 6 Seconds</p>
        <p className={sectionSub}>Eye-tracking studies show recruiters follow a strict priority order. Make sure the top items are perfect.</p>
        <div className="flex flex-col gap-2">
          {recruiterScan.map((item,i) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 w-4 text-right shrink-0">#{i+1}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                <div className="h-full rounded-lg flex items-center px-2" style={{width:`${item.pct}%`,background:item.color,minWidth:40}}>
                  <span className="text-white text-[9px] font-bold">{item.pct}%</span>
                </div>
              </div>
              <div className="min-w-[130px]">
                <div className="text-[11.5px] font-semibold text-gray-700">{item.label}</div>
                <div className="text-[10px] text-gray-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Formats */}
      <div className={card}>
        <p className={sectionTitle}>Resume Format Guide</p>
        <p className={sectionSub}>Choose the right format for your career stage. The wrong format gets you rejected before a human reads it.</p>
        <div className="grid grid-cols-1 gap-3">
          {formats.map(f => (
            <div key={f.name} className="rounded-xl border p-3" style={{borderColor:f.color+'40',background:f.color+'08'}}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[18px]">{f.icon}</span>
                <span className="text-[13px] font-bold" style={{color:f.color}}>{f.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div><span className="font-semibold text-gray-600">Best for:</span><div className="text-gray-700 mt-0.5">{f.best}</div></div>
                <div><span className="font-semibold text-gray-600">Avoid if:</span><div className="text-gray-700 mt-0.5">{f.avoid}</div></div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {f.pros.map(p => <span key={p} className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{background:f.color}}>{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Priority by Career Stage */}
      <div className={card}>
        <p className={sectionTitle}>Section Priority by Career Stage</p>
        <p className={sectionSub}>The order of sections should change based on where you are in your career.</p>
        <div className="grid grid-cols-2 gap-3">
          {sectionPriority.map(s => (
            <div key={s.stage} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="text-[11.5px] font-bold text-gray-700 mb-2">{s.stage}</div>
              {s.order.map((sec,i) => (
                <div key={sec} className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] w-4 text-gray-400 font-mono">{i+1}.</span>
                  <div className="flex-1 text-[10.5px] rounded px-1.5 py-0.5"
                    style={{background: i===0?'#2563eb10':i<=1?'#10b98110':'transparent',color:i===0?'#1d4ed8':i<=1?'#059669':'#6b7280',fontWeight:i<=1?600:400}}>
                    {sec}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Action Verbs */}
      <div className={card}>
        <p className={sectionTitle}>Strong Action Verbs by Category</p>
        <p className={sectionSub}>Never start a bullet with "Was responsible for" or "Helped with." Use powerful verbs that show ownership.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(actionVerbs).map(([cat,verbs]) => (
            <div key={cat} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="text-[11px] font-bold text-gray-600 mb-2 uppercase tracking-wide">{cat}</div>
              <div className="flex flex-wrap gap-1">
                {verbs.map(v => <span key={v} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px] text-gray-700 font-medium">{v}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-[11.5px] font-semibold text-amber-800 mb-1">STAR Formula for Bullet Points</p>
          <p className="text-[11px] text-amber-700"><strong>S</strong>ituation → <strong>T</strong>ask → <strong>A</strong>ction → <strong>R</strong>esult</p>
          <p className="text-[11px] text-amber-600 mt-1 font-mono bg-white/60 rounded p-2 border border-amber-200">
            ✓ "Reduced page load time by 60% by migrating to Next.js SSR, increasing conversion rate by 18%"
          </p>
          <p className="text-[11px] text-red-500 mt-1 font-mono bg-white/60 rounded p-2 border border-red-100">
            ✗ "Was responsible for improving website performance"
          </p>
        </div>
      </div>

      {/* ATS Tips */}
      <div className={card}>
        <p className={sectionTitle}>ATS Optimization Checklist</p>
        <p className={sectionSub}>75% of resumes are rejected by ATS software before a human ever sees them. Use these rules to pass through.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ['✓','Use standard section headings','Experience, Education, Skills — not custom labels like "My Journey"'],
            ['✓','Include exact keywords','Copy phrases directly from the job description, don\'t paraphrase'],
            ['✓','Use .docx or plain PDF','Never submit image PDFs or scanned documents'],
            ['✓','Single column layout','ATS can\'t parse multi-column or table-based layouts'],
            ['✗','No headers/footers','ATS often can\'t read content in page headers or footers'],
            ['✗','No tables or text boxes','Use plain text lists instead'],
            ['✗','No images or graphics','ATS ignores them — your logo or chart wastes space'],
            ['✗','No special characters in dates','Use "Jan 2022 – Present" not "01/22 → Now"'],
          ].map(([mark,title,desc]) => (
            <div key={title} className={`flex gap-2 p-2.5 rounded-lg ${mark==='✓'?'bg-green-50 border border-green-100':'bg-red-50 border border-red-100'}`}>
              <span className={`text-[14px] font-bold shrink-0 ${mark==='✓'?'text-green-500':'text-red-400'}`}>{mark}</span>
              <div>
                <div className="text-[11.5px] font-semibold text-gray-700">{title}</div>
                <div className="text-[10.5px] text-gray-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className={card}>
        <p className={sectionTitle}>Resume FAQ</p>
        <p className={sectionSub}>Answers to the most common resume questions.</p>
        <div className="flex flex-col gap-2">
          {faqs.map((faq,i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left gap-3 hover:bg-gray-50 transition-colors">
                <span className="text-[12.5px] font-medium text-gray-800">{faq.q}</span>
                <span className="text-[18px] text-gray-400 shrink-0 transition-transform" style={{transform:openFaq===i?'rotate(45deg)':'none'}}>+</span>
              </button>
              {openFaq===i && (
                <div className="px-4 pb-4 pt-1 text-[12px] text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
