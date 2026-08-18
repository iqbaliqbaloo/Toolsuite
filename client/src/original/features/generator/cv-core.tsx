// @ts-nocheck
import React from 'react';
// cv-core.tsx — Types, constants, and pure helper functions for the CV Builder.

// ─── TypeScript Type Declarations ─────────────────────────────────────────────
type CvFontSizes = {
  name: number; titleLine: number; secHead: number; jobTitle: number;
  body: number; date: number; contact: number; tag: number;
};
type CvColorTheme = { label?: string; primary: string; accent: string; sidebar: string; sidebarText: string };
type CvHeader = { name: string; title: string; email: string; phone: string; location: string; linkedin: string; github: string; portfolio: string; photo: string };
type CvExperienceEntry = { id: string; jobTitle: string; company: string; employmentType: string; location: string; startDate: string; endDate: string; current: boolean; bullets: string[] };
type CvEducationEntry  = { id: string; degree: string; field: string; institution: string; location: string; startYear: string; endYear: string; expected: boolean; gpa: string; courses: string[] };
type CvSkillEntry      = { id: string; name: string; items: string[] };
type CvProjectEntry    = { id: string; name: string; techStack: string[]; startDate: string; endDate: string; liveUrl: string; githubUrl: string; description: string; bullets: string[] };
type CvCertEntry       = { id: string; name: string; issuer: string; issueDate: string; credentialId: string; credentialUrl: string };
type CvLanguageEntry   = { id: string; language: string; proficiency: string };
type CvReferenceEntry  = { id: string; name: string; title: string; company: string; relationship: string; email: string; phone: string };
type CvData = {
  header: CvHeader; summary: string;
  experience: CvExperienceEntry[]; education: CvEducationEntry[]; skills: CvSkillEntry[];
  projects: CvProjectEntry[]; certifications: CvCertEntry[]; languages: CvLanguageEntry[];
  references: CvReferenceEntry[]; hobbies: string[]; custom: { title: string; body: string };
  additionalExperience: string[];
};
type SectionCompleteness = 'complete' | 'partial' | 'empty';
type CvListEntry  = { id: string; name: string };
type TemplateKey  = 'classic' | 'modern' | 'minimal' | 'creative' | 'executive' | 'tech' | 'elegant' | 'compact' | 'bold' | 'academic' | 'timeline' | 'sidebarRight' | 'gradient' | 'twoCol' | 'centered' | 'slate' | 'cosmic' | 'sharp' | 'nova' | 'boxed';
type SkillStyle   = 'tags' | 'plain';
type TemplateProps = { data: CvData; theme: CvColorTheme; sizes: CvFontSizes; fontFamily: string; headingFont?: string; bodyFont?: string; skillStyle: SkillStyle; atsMode: boolean };
type CvInputProps    = { label?: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string };
type CvTextareaProps = { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; maxLength?: number; className?: string };
type CvSelectProps   = { label?: string; value: string; onChange: (v: string) => void; options: string[]; className?: string };
type CvTagInputProps  = { label?: string; tags: string[]; onChange: (tags: string[]) => void; placeholder?: string };
type CvBulletEditorProps = { bullets: string[]; onChange: (bullets: string[]) => void; onImprove?: (text: string, type: string, onDone: (v: string) => void) => void; improving?: string | null };
type CvEntryCardProps    = { title: string; subtitle?: string; date?: string; isExpanded: boolean; onToggle: () => void; onDelete: () => void; confirmDelete: boolean; setConfirmDelete: (v: boolean) => void; children?: React.ReactNode };
type CvAtsScoreProps     = { data: Partial<CvData> | null };
type CvHeaderFormProps   = { data: CvHeader; onChange: (data: CvHeader) => void };
type CvSummaryFormProps  = { summary: string; onChange: (v: string) => void; onImprove?: (text: string, type: string, onDone: (v: string) => void) => void; improving?: string | null };
type _EntryBaseProps = { expanded: Record<string, boolean>; onToggle: (id: string) => void; confirmDel: Record<string, boolean>; onConfirmDel: (id: string, v: boolean | undefined) => void; onAdd?: () => void };
type _AiProps        = { onImprove?: (text: string, type: string, onDone: (v: string) => void) => void; improving?: string | null };
type CvExperienceFormProps    = _EntryBaseProps & _AiProps & { entries: CvExperienceEntry[]; onChange: (e: CvExperienceEntry[]) => void };
type CvEducationFormProps     = _EntryBaseProps & { entries: CvEducationEntry[]; onChange: (e: CvEducationEntry[]) => void };
type CvSkillsFormProps        = { skills: CvSkillEntry[]; onChange: (s: CvSkillEntry[]) => void };
type CvProjectsFormProps      = _EntryBaseProps & _AiProps & { projects: CvProjectEntry[]; onChange: (p: CvProjectEntry[]) => void };
type CvCertificationsFormProps= _EntryBaseProps & { certifications: CvCertEntry[]; onChange: (c: CvCertEntry[]) => void };
type CvLanguagesFormProps     = { languages: CvLanguageEntry[]; onChange: (l: CvLanguageEntry[]) => void };
type CvReferencesFormProps    = _EntryBaseProps & { references: CvReferenceEntry[]; onChange: (r: CvReferenceEntry[]) => void };
type CvCustomFormProps        = { custom: { title: string; body: string }; onChange: (c: { title: string; body: string }) => void };
type CvHobbiesFormProps       = { hobbies: string[]; onChange: (h: string[]) => void };
type SkillItemsProps    = { items: string[]; primary: string; accent: string; sizes: CvFontSizes; fontFamily: string; skillStyle: SkillStyle; atsMode: boolean };
type SectionHeadingProps= { label: string; primary: string; fontFamily: string; sizes: CvFontSizes; atsMode: boolean };
type PreviewBulletsProps= { bullets: string[]; fontFamily: string; sizes: CvFontSizes; color?: string };
type ContactLineProps   = { h: CvHeader; fontFamily: string; sizes: CvFontSizes; atsMode: boolean };
type PhotoCircleProps   = { photo: string; size?: number; border?: string };
type HobbiesBlockProps  = { hobbies: string[]; primary: string; fontFamily: string; sizes: CvFontSizes; atsMode: boolean };
type ReferencesBlockProps = { references: CvReferenceEntry[]; primary: string; fontFamily: string; sizes: CvFontSizes; atsMode: boolean };
type CustomBlockProps   = { custom: { title: string; body: string }; primary: string; fontFamily: string; sizes: CvFontSizes; atsMode: boolean; secHFn: (label: string) => React.ReactNode };
type CvProfessionalTipsProps = { data: Partial<CvData> };

// ─── Constants ────────────────────────────────────────────────────────────────
const CV_SECTIONS = [
  { key: 'header',               label: 'Header',               icon: 'User',          multi: false },
  { key: 'summary',              label: 'Summary',               icon: 'AlignLeft',     multi: false },
  { key: 'experience',           label: 'Experience',            icon: 'Briefcase',     multi: true  },
  { key: 'education',            label: 'Education',             icon: 'GraduationCap', multi: true  },
  { key: 'skills',               label: 'Skills',                icon: 'Code2',         multi: false },
  { key: 'projects',             label: 'Projects',              icon: 'FolderOpen',    multi: true  },
  { key: 'additionalExperience', label: 'Additional Experience', icon: 'Briefcase',     multi: false },
  { key: 'certifications',       label: 'Certifications',        icon: 'Award',         multi: true  },
  { key: 'languages',            label: 'Languages',             icon: 'Globe',         multi: false },
  { key: 'references',           label: 'References',            icon: 'Users',         multi: true  },
  { key: 'hobbies',              label: 'Hobbies',               icon: 'Smile',         multi: false },
  { key: 'custom',               label: 'Custom Section',        icon: 'Plus',          multi: false },
];
const CV_COLOR_THEMES = {
  'blue-teal':   { label: 'Blue · Teal',    primary: '#2563eb', accent: '#0d9488', sidebar: '#1e3a8a', sidebarText: '#ffffff' },
  'violet-rose': { label: 'Violet · Rose',  primary: '#7c3aed', accent: '#e11d48', sidebar: '#4c1d95', sidebarText: '#ffffff' },
  'teal-blue':   { label: 'Teal · Blue',    primary: '#0d9488', accent: '#2563eb', sidebar: '#134e4a', sidebarText: '#ffffff' },
  'slate-blue':  { label: 'Slate · Blue',   primary: '#475569', accent: '#2563eb', sidebar: '#1e293b', sidebarText: '#ffffff' },
  'rose-violet': { label: 'Rose · Violet',  primary: '#e11d48', accent: '#7c3aed', sidebar: '#9f1239', sidebarText: '#ffffff' },
  'emerald':     { label: 'Emerald · Teal', primary: '#059669', accent: '#0d9488', sidebar: '#064e3b', sidebarText: '#ffffff' },
  'amber':       { label: 'Amber · Green',  primary: '#d97706', accent: '#059669', sidebar: '#78350f', sidebarText: '#ffffff' },
  'dark':        { label: 'Dark Pro',       primary: '#1e293b', accent: '#475569', sidebar: '#0f172a', sidebarText: '#e2e8f0' },
  'custom':      { label: 'Custom',         primary: '#2563eb', accent: '#0d9488', sidebar: '#1e3a8a', sidebarText: '#ffffff' },
};
function makeSizes(headingSize: number, bodySize: number): CvFontSizes {
  const readableBody = Math.max(11, bodySize);
  return {
    name:      Math.max(28, headingSize),
    titleLine: Math.max(14, Math.round(readableBody * 1.22)),
    secHead:   Math.max(13, Math.round(readableBody * 1.28)),
    jobTitle:  Math.max(12, Math.round(readableBody * 1.16)),
    body:      readableBody,
    date:      Math.max(10, Math.round(readableBody * 0.92)),
    contact:   Math.max(10, Math.round(readableBody * 0.95)),
    tag:       Math.max(10, Math.round(readableBody * 0.92)),
  };
}
const CV_FONT_CATEGORIES = [
  { label: 'Sans-serif', fonts: [
    { key: 'inter',       label: 'Inter',         css: 'Inter, Arial, sans-serif',              docx: 'Calibri'        },
    { key: 'roboto',      label: 'Roboto',         css: 'Roboto, Arial, sans-serif',             docx: 'Arial'          },
    { key: 'lato',        label: 'Lato',           css: 'Lato, Arial, sans-serif',               docx: 'Calibri Light'  },
    { key: 'montserrat',  label: 'Montserrat',     css: 'Montserrat, Arial, sans-serif',         docx: 'Arial'          },
    { key: 'opensans',    label: 'Open Sans',      css: '"Open Sans", Arial, sans-serif',        docx: 'Calibri'        },
    { key: 'nunito',      label: 'Nunito',         css: 'Nunito, Arial, sans-serif',             docx: 'Calibri'        },
  ]},
  { label: 'Serif', fonts: [
    { key: 'georgia',      label: 'Georgia',          css: 'Georgia, "Times New Roman", serif',  docx: 'Georgia'        },
    { key: 'playfair',     label: 'Playfair Display', css: '"Playfair Display", Georgia, serif', docx: 'Times New Roman'},
    { key: 'merriweather', label: 'Merriweather',     css: 'Merriweather, Georgia, serif',       docx: 'Book Antiqua'   },
    { key: 'lora',         label: 'Lora',             css: 'Lora, Georgia, serif',               docx: 'Georgia'        },
  ]},
  { label: 'Monospace', fonts: [
    { key: 'firacode',  label: 'Fira Code',      css: '"Fira Code", monospace',                 docx: 'Courier New'    },
    { key: 'jetbrains', label: 'JetBrains Mono', css: '"JetBrains Mono", monospace',            docx: 'Courier New'    },
  ]},
];
const CV_FONTS = Object.fromEntries(CV_FONT_CATEGORIES.flatMap(c => c.fonts.map(f => [f.key, f])));
const GOOGLE_FONT_URLS = {
  roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  lato: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
  montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap',
  opensans: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
  nunito: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap',
  playfair: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
  merriweather: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
  lora: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap',
  firacode: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap',
  jetbrains: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
};
const EMPTY_DATA = {
  header:               { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', photo: '' },
  summary:              '',
  experience:           [],
  additionalExperience: [],
  education:            [],
  skills:               [],
  projects:             [],
  certifications:       [],
  languages:            [],
  references:           [],
  hobbies:              [],
  custom:               { title: '', body: '' },
};
const DEMO_DATA = {
  header: { name: 'Avery Morgan', title: 'Lead Product Designer · Remote Product Systems', email: 'avery@example.com', phone: '+1 555 0100', location: 'Remote · New York, NY · UTC−5', linkedin: 'linkedin.com/in/avery', github: 'github.com/avery', portfolio: 'avery.design', photo: '' },
  summary: 'Lead product designer with 8+ years building accessible SaaS products for distributed teams. I translate complex workflows into clear systems, coach cross-functional partners, and ship measurable improvements across activation, retention, and operational efficiency.',
  experience: [
    { id: 'demo-exp-1', jobTitle: 'Lead Product Designer', company: 'Northstar Labs', employmentType: 'Remote', location: 'Remote · UTC−5 to UTC+2', startDate: '2021', endDate: '', current: true, bullets: ['Led cross-functional delivery across distributed design and engineering teams in multiple time zones.', 'Improved activation by 31% through a redesigned onboarding system and clearer product guidance.', 'Built a reusable design system that improved accessibility coverage and delivery speed.'] },
    { id: 'demo-exp-2', jobTitle: 'Senior Product Designer', company: 'Remote Systems Co.', employmentType: 'Full-time', location: 'Remote', startDate: '2018', endDate: '2021', current: false, bullets: ['Designed async collaboration workflows used by 12,000 distributed teams.', 'Partnered with engineering to reduce time-to-first-value through guided setup.'] },
  ],
  education: [{ id: 'demo-edu-1', degree: 'BFA', field: 'Interaction Design', institution: 'School of Visual Arts', location: 'New York, NY', startYear: '2014', endYear: '2018', expected: false, gpa: '', courses: ['Information Architecture', 'Interaction Systems'] }],
  skills: [{ id: 'demo-skill-1', name: 'Design', items: ['Figma', 'Design systems', 'Accessibility', 'Prototyping'] }, { id: 'demo-skill-2', name: 'Product', items: ['Research', 'Analytics', 'Roadmapping', 'Experimentation'] }, { id: 'demo-skill-3', name: 'Remote delivery', items: ['Async facilitation', 'Documentation', 'Cross-time-zone planning'] }],
  projects: [{ id: 'demo-project-1', name: 'Remote Workspace', techStack: ['Figma', 'React', 'TypeScript'], startDate: '2023', endDate: '2024', liveUrl: 'https://example.com', githubUrl: 'https://github.com/example/project', description: 'A collaboration system for distributed product teams.', bullets: ['Shipped a new information architecture used by 12,000 teams.', 'Reduced time-to-first-value by 31% through guided workflows.'] }],
  certifications: [{ id: 'demo-cert-1', name: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance', issueDate: '2022', credentialId: 'DEMO-123', credentialUrl: 'https://example.com/cert' }],
  languages: [{ id: 'demo-lang-1', language: 'English', proficiency: 'Native' }, { id: 'demo-lang-2', language: 'Spanish', proficiency: 'Conversational' }],
  references: [], hobbies: ['Typography', 'Cycling', 'Open-source mentoring'], custom: { title: 'Community', body: 'Mentor for early-career designers in remote communities.' }, additionalExperience: ['Volunteer design mentor for distributed teams'],
};
const CV_LIST_KEY    = 'toolsuite-cv-list-v1';
const CV_DATA_PREFIX = 'toolsuite-cv-data-';
const EMPLOYMENT_TYPES   = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'];
const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Conversational', 'Basic'];
const STORAGE_KEY        = 'toolsuite-cv-builder-v5';
const IMPORT_KEY         = 'toolsuite-cv-import';
const DEFAULT_THEMES = {
  classic: 'blue-teal',   modern:      'slate-blue', minimal:    'teal-blue',  creative:    'violet-rose',
  executive:'blue-teal',  tech:        'dark',       elegant:    'rose-violet', compact:     'slate-blue',
  bold:    'violet-rose', academic:    'blue-teal',  timeline:   'blue-teal',   sidebarRight:'violet-rose',
  gradient:'teal-blue',   twoCol:      'slate-blue', centered:   'rose-violet', slate:       'slate-blue',
  cosmic:  'dark',        sharp:       'blue-teal',  nova:       'emerald',     boxed:       'blue-teal',
};
const TEMPLATES = [
  { key: 'classic',     label: 'Classic'      },
  { key: 'modern',      label: 'Modern'       },
  { key: 'minimal',     label: 'Minimal'      },
  { key: 'creative',    label: 'Creative'     },
  { key: 'executive',   label: 'Executive'    },
  { key: 'tech',        label: 'Tech'         },
  { key: 'elegant',     label: 'Elegant'      },
  { key: 'compact',     label: 'Compact'      },
  { key: 'bold',        label: 'Bold'         },
  { key: 'academic',    label: 'Academic'     },
  { key: 'timeline',    label: 'Timeline ✦'   },
  { key: 'sidebarRight',label: 'Sidebar Pro ✦'},
  { key: 'gradient',    label: 'Gradient ✦'   },
  { key: 'twoCol',      label: 'Two Column ✦' },
  { key: 'centered',    label: 'Centered ✦'   },
  { key: 'slate',       label: 'Slate ✦'      },
  { key: 'cosmic',      label: 'Cosmic ✦'     },
  { key: 'sharp',       label: 'Sharp ✦'      },
  { key: 'nova',        label: 'Nova ✦'       },
  { key: 'boxed',       label: 'Boxed ✦'      },
];
const DEFAULT_CUSTOM = { primary: '#2563eb', accent: '#0d9488' }

const DEFAULT_SECTION_LABELS = {
  summary:              'Professional Summary',
  experience:           'Experience',
  additionalExperience: 'Additional Experience',
  education:            'Education',
  skills:               'Skills',
  projects:             'Projects',
  certifications:       'Certifications',
  languages:            'Languages',
  references:           'References',
  hobbies:              'Hobbies & Interests',
}

function CvTemplateThumbnail({ tk, primary, accent, sidebar, isActive }) {
  const P = primary || '#2563eb';
  const A = accent  || '#0d9488';
  const S = sidebar || '#1e3a8a';
  const line = (w, c='#e5e7eb', h=2, mb=2) => (
    <div style={{ height:`${h}px`, width:w, background:c, marginBottom:`${mb}px`, borderRadius:'1px', flexShrink:0 }}/>
  );
  const bodyLines = (color='#e5e7eb') => (
    <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
      {line('80%',color)} {line('65%',color)} {line('85%',color)} {line('50%',color)} {line('70%',color)}
    </div>
  );

  // ── dark-band templates ──────────────────────────────────────────────────────
  if (['modern','tech','slate','sharp','twoCol'].includes(tk)) {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ height:'28%', background:S||P, padding:'5px 5px 4px', display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:'2px' }}>
          <div style={{ height:'4px', width:'55%', background:'rgba(255,255,255,0.9)', borderRadius:'1px' }}/>
          <div style={{ height:'2px', width:'35%', background:'rgba(255,255,255,0.5)', borderRadius:'1px' }}/>
        </div>
        <div style={{ padding:'4px 5px', flex:1 }}>{bodyLines()}</div>
      </div>
    );
  }

  // ── left-sidebar (creative) ──────────────────────────────────────────────────
  if (tk === 'creative') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', display:'flex', flexDirection:'row' }}>
        <div style={{ width:'34%', background:S||P, padding:'4px 4px', display:'flex', flexDirection:'column', gap:'3px' }}>
          <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'rgba(255,255,255,0.25)', margin:'0 auto 4px' }}/>
          {line('85%','rgba(255,255,255,0.5)',1,2)} {line('70%','rgba(255,255,255,0.35)',1,2)} {line('80%','rgba(255,255,255,0.35)',1,2)}
        </div>
        <div style={{ flex:1, padding:'4px 4px' }}>
          <div style={{ height:'3px', width:'70%', background:hexAlpha(P,0.6), borderRadius:'1px', marginBottom:'4px' }}/>
          {bodyLines()}
        </div>
      </div>
    );
  }

  // ── right-sidebar (sidebarRight) ──────────────────────────────────────────────
  if (tk === 'sidebarRight') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', display:'flex', flexDirection:'row' }}>
        <div style={{ flex:1, padding:'5px 4px' }}>
          <div style={{ height:'4px', width:'70%', background:hexAlpha(P,0.7), borderRadius:'1px', marginBottom:'4px' }}/>
          {bodyLines()}
        </div>
        <div style={{ width:'33%', background:S||P, padding:'4px 3px', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'rgba(255,255,255,0.25)', marginBottom:'4px' }}/>
          {line('90%','rgba(255,255,255,0.4)',1,2)} {line('80%','rgba(255,255,255,0.3)',1,2)} {line('85%','rgba(255,255,255,0.3)',1,2)}
        </div>
      </div>
    );
  }

  // ── gradient header ──────────────────────────────────────────────────────────
  if (['gradient','nova'].includes(tk)) {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ height:'30%', background:`linear-gradient(135deg,${P},${A})`, padding:'5px', display:'flex', alignItems:'center', gap:'6px' }}>
          <div style={{ flex:1 }}>
            <div style={{ height:'5px', width:'60%', background:'rgba(255,255,255,0.9)', borderRadius:'1px', marginBottom:'3px' }}/>
            <div style={{ height:'2px', width:'40%', background:'rgba(255,255,255,0.55)', borderRadius:'1px' }}/>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', flex:1, gap:'4px', padding:'4px 5px' }}>
          <div>{bodyLines()}</div>
          <div>{bodyLines(hexAlpha(P,0.2))}</div>
        </div>
      </div>
    );
  }

  // ── cosmic (dark full) ───────────────────────────────────────────────────────
  if (tk === 'cosmic') {
    return (
      <div style={{ width:'100%', height:'100%', background:'#0f172a', borderRadius:'3px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ height:'28%', padding:'5px', display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:'2px', background:`linear-gradient(180deg,${hexAlpha(P,0.2)},transparent)` }}>
          <div style={{ height:'5px', width:'60%', background:'rgba(255,255,255,0.9)', borderRadius:'1px' }}/>
          <div style={{ height:'2px', width:'35%', background:hexAlpha(P,0.8), borderRadius:'1px' }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', flex:1, gap:'4px', padding:'4px 5px' }}>
          <div>{bodyLines(hexAlpha(P,0.35))}</div>
          <div>{bodyLines('rgba(255,255,255,0.12)')}</div>
        </div>
      </div>
    );
  }

  // ── elegant (centered lines + ornament) ──────────────────────────────────────
  if (tk === 'elegant') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', padding:'5px' }}>
        <div style={{ height:'1px', background:hexAlpha(P,0.4), marginBottom:'4px' }}/>
        <div style={{ height:'5px', width:'60%', background:hexAlpha(P,0.1), margin:'0 auto 2px', borderRadius:'1px' }}/>
        <div style={{ height:'3px', width:'45%', background:hexAlpha(P,0.15), margin:'0 auto 4px', borderRadius:'1px' }}/>
        <div style={{ height:'1px', background:hexAlpha(P,0.4), marginBottom:'5px' }}/>
        <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
          {line('80%')} {line('65%')} {line('85%')} {line('50%')} {line('70%')}
        </div>
      </div>
    );
  }

  // ── centered (dots ornament) ─────────────────────────────────────────────────
  if (tk === 'centered') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', padding:'5px' }}>
        <div style={{ textAlign:'center', marginBottom:'5px' }}>
          <div style={{ height:'5px', width:'55%', background:hexAlpha(P,0.12), margin:'0 auto 2px', borderRadius:'1px' }}/>
          <div style={{ height:'2px', width:'35%', background:hexAlpha(P,0.2), margin:'0 auto 3px', borderRadius:'1px' }}/>
          <div style={{ display:'flex', justifyContent:'center', gap:'3px', alignItems:'center' }}>
            <div style={{ width:'3px', height:'3px', borderRadius:'50%', background:hexAlpha(P,0.4) }}/>
            <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:P }}/>
            <div style={{ width:'3px', height:'3px', borderRadius:'50%', background:hexAlpha(P,0.4) }}/>
          </div>
        </div>
        {bodyLines()}
      </div>
    );
  }

  // ── timeline ─────────────────────────────────────────────────────────────────
  if (tk === 'timeline') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ height:'22%', background:P, padding:'4px 5px', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
          <div style={{ height:'4px', width:'55%', background:'rgba(255,255,255,0.9)', borderRadius:'1px' }}/>
        </div>
        <div style={{ padding:'4px 5px 4px 10px', flex:1, position:'relative' }}>
          <div style={{ position:'absolute', left:'7px', top:0, bottom:0, width:'1px', background:hexAlpha(P,0.25) }}/>
          {[40,55,35,60,45].map((w,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'3px' }}>
              <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:P, flexShrink:0, marginLeft:'-3px', border:'1px solid white' }}/>
              <div style={{ height:'2px', width:`${w}%`, background:'#e5e7eb', borderRadius:'1px' }}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── boxed (cards bg) ─────────────────────────────────────────────────────────
  if (tk === 'boxed') {
    return (
      <div style={{ width:'100%', height:'100%', background:'#f1f5f9', borderRadius:'3px', overflow:'hidden', padding:'4px' }}>
        <div style={{ background:'white', borderRadius:'4px', border:`1.5px solid ${hexAlpha(P,0.4)}`, padding:'4px 5px', marginBottom:'3px' }}>
          <div style={{ height:'4px', width:'55%', background:hexAlpha(P,0.15), borderRadius:'1px', marginBottom:'2px' }}/>
          <div style={{ height:'2px', width:'75%', background:'#e5e7eb', borderRadius:'1px' }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:'3px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
            {[1,2].map(i=><div key={i} style={{ background:'white', borderRadius:'3px', padding:'3px 4px', border:'1px solid #e5e7eb' }}>{line('80%')}{line('60%')}</div>)}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
            {[1,2].map(i=><div key={i} style={{ background:'white', borderRadius:'3px', padding:'3px 4px', border:'1px solid #e5e7eb' }}>{line('85%')}{line('60%')}</div>)}
          </div>
        </div>
      </div>
    );
  }

  // ── two-column (compact, twoCol with accent right) ────────────────────────────
  if (['compact'].includes(tk)) {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ height:'18%', borderBottom:`2px solid ${P}`, padding:'3px 5px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ height:'4px', width:'45%', background:hexAlpha(P,0.3), borderRadius:'1px' }}/>
          <div style={{ height:'2px', width:'30%', background:'#e5e7eb', borderRadius:'1px' }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', flex:1, gap:'4px', padding:'4px 5px' }}>
          <div>{bodyLines()}</div>
          <div>{bodyLines()}</div>
        </div>
      </div>
    );
  }

  // ── executive (thick gradient bar) ───────────────────────────────────────────
  if (tk === 'executive') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ height:'6px', background:`linear-gradient(to right,${P},${A})` }}/>
        <div style={{ padding:'5px 5px', flex:1 }}>
          <div style={{ height:'6px', width:'65%', background:'#111827', borderRadius:'1px', marginBottom:'2px', opacity:0.8 }}/>
          <div style={{ height:'2px', width:'45%', background:hexAlpha(P,0.7), borderRadius:'1px', marginBottom:'5px' }}/>
          {bodyLines()}
        </div>
      </div>
    );
  }

  // ── academic ─────────────────────────────────────────────────────────────────
  if (tk === 'academic') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', padding:'5px' }}>
        <div style={{ borderBottom:`2px solid #111827`, paddingBottom:'4px', marginBottom:'5px' }}>
          <div style={{ height:'5px', width:'60%', background:'#111827', borderRadius:'1px', marginBottom:'2px', opacity:0.8 }}/>
          <div style={{ height:'2px', width:'80%', background:'#e5e7eb', borderRadius:'1px' }}/>
        </div>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ display:'flex', gap:'4px', marginBottom:'3px' }}>
            <div style={{ width:'22px', height:'2px', background:hexAlpha(P,0.3), flexShrink:0, marginTop:'2px', borderRadius:'1px' }}/>
            <div style={{ flex:1, height:'2px', background:'#e5e7eb', borderRadius:'1px', marginTop:'2px' }}/>
          </div>
        ))}
      </div>
    );
  }

  // ── minimal ──────────────────────────────────────────────────────────────────
  if (tk === 'minimal') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', padding:'5px' }}>
        <div style={{ borderBottom:'1px solid #e5e7eb', paddingBottom:'5px', marginBottom:'5px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ height:'5px', width:'45px', background:'#111827', borderRadius:'1px', marginBottom:'3px', opacity:0.8 }}/>
            <div style={{ height:'2px', width:'30px', background:'#9ca3af', borderRadius:'1px' }}/>
          </div>
        </div>
        {bodyLines()}
      </div>
    );
  }

  // ── bold ─────────────────────────────────────────────────────────────────────
  if (tk === 'bold') {
    return (
      <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', padding:'5px 5px 4px' }}>
        <div style={{ marginBottom:'4px' }}>
          <div style={{ height:'7px', width:'75%', background:'#111827', borderRadius:'1px', marginBottom:'3px', opacity:0.85 }}/>
          <div style={{ height:'3px', width:'50%', background:P, borderRadius:'1px', marginBottom:'2px' }}/>
          <div style={{ height:'2px', background:`linear-gradient(to right, ${P}, ${A}, transparent)`, borderRadius:'1px' }}/>
        </div>
        {bodyLines()}
      </div>
    );
  }

  // ── classic (strip top) — default ────────────────────────────────────────────
  return (
    <div style={{ width:'100%', height:'100%', background:'white', borderRadius:'3px', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ height:'4px', background:`linear-gradient(to right,${P},${A})` }}/>
      <div style={{ padding:'5px 5px', flex:1 }}>
        <div style={{ height:'5px', width:'60%', background:'#111827', borderRadius:'1px', marginBottom:'3px', opacity:0.8 }}/>
        <div style={{ height:'2px', width:'40%', background:hexAlpha(P,0.5), borderRadius:'1px', marginBottom:'5px' }}/>
        {bodyLines()}
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cvId(): string { return `cv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }
function slugify(str: string): string {
  return (str || 'resume').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40) || 'resume';
}
function getThemeColors(themeKey: string, customColors?: { primary?: string; accent?: string }): CvColorTheme {
  if (themeKey === 'custom') return { ...CV_COLOR_THEMES['blue-teal'], ...(customColors || {}) };
  return CV_COLOR_THEMES[themeKey] || CV_COLOR_THEMES['blue-teal'];
}
function hexAlpha(hex: string, alpha: number): string {
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex = '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return `rgba(0,0,0,${alpha})`;
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function safeStr(v: unknown): string { return typeof v === 'string' ? v : ''; }
function safeArr<T>(v: unknown): T[] { return Array.isArray(v) ? v : []; }

// ── Input quality validators ──────────────────────────────────────────────────
// Returns true only if text has enough real words (not random gibberish).
const TECH_TOKENS = new Set([
  'c++','c#','.net','css','js','ts','sql','xml','api','sdk','cli',
  'jwt','php','png','svg','pdf','ssr','csr','html','http','https',
  'aws','gcp','ci','cd','ui','ux','db','os','oop','fp','rest','graphql',
  'node','react','vue','next','nuxt','git','linux','bash','json','yaml',
]);

function hasRealWords(text: string, minWords = 3): boolean {
  if (!text || text.trim().length < 2) return false;
  const words = text.trim().split(/\s+/).filter(w => {
    const lower = w.toLowerCase().replace(/[^a-z0-9+#.]/g, '');
    if (lower.length < 2 || lower.length > 40) return false;
    if (TECH_TOKENS.has(lower)) return true;
    if (/[aeiou]/i.test(w)) return true;
    if (/^[A-Z0-9+#.]{2,6}$/.test(w)) return true;
    return false;
  });
  return words.length >= minWords;
}
// Validates a real name: must contain at least one letter and be >= 2 chars.
// Single-word "names" pass (e.g. "Ali"), but completely empty or symbol-only strings fail.
function isRealName(name: string): boolean {
  if (!name || name.trim().length < 2) return false;
  return /\p{L}/u.test(name.trim());
}
// Validates an email address format (must contain @ and a dot after it).
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email || '').trim());
}
// Validates a phone number: must contain at least 7 digits.
function isRealPhone(phone: string): boolean {
  return !!phone && (phone.match(/\d/g) || []).length >= 7;
}
// Validates a URL or profile link: must contain a dot or slash.
function isRealLink(url: string): boolean {
  if (!url || url.trim().length < 5) return false;
  const normalized = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
  try {
    const parsed = new URL(normalized);
    return parsed.hostname.includes('.') && parsed.hostname.length > 3;
  } catch {
    return false;
  }
}
// A bullet point is "real" if it has at least 3 words and contains vowels.
function isRealBullet(bullet: string): boolean {
  return hasRealWords(bullet, 3);
}

function calcAtsScore(data: Partial<CvData> | null): number {
  if (!data) return 0;
  const h   = data.header || {};
  const sm  = safeStr(data.summary);
  const exp = safeArr(data.experience);
  const edu = safeArr(data.education);
  const skl = safeArr(data.skills);
  const prj = safeArr(data.projects);
  let score = 0;
  if (isRealName(h.name))                                       score += 15;
  if (isValidEmail(h.email))                                    score += 15;
  if (isRealPhone(h.phone))                                     score += 5;
  if (h.location && h.location.trim().length >= 2)              score += 5;
  if (isRealLink(h.linkedin) || isRealLink(h.github) || isRealLink(h.portfolio)) score += 5;
  if (hasRealWords(sm, 5))                                      score += 10;
  if (exp.length > 0)                                           score += 10;
  if (exp.filter(e => safeArr(e.bullets).filter(isRealBullet).length >= 2).length > 0) score += 10;
  if (edu.length > 0 && edu.some(e => e.institution?.trim().length >= 2))              score += 10;
  if (skl.filter(s => safeArr(s.items).filter(i => i.trim().length >= 2).length >= 3).length > 0) score += 10;
  if (prj.length > 0 && prj.some(p => p.name?.trim().length >= 2))                    score += 5;
  return Math.min(100, score);
}

function calcCompletenessScore(data: Partial<CvData> | null): number {
  if (!data) return 0;
  const h = data.header || {};
  let score = 0;
  // Header fields: 30 pts — validated, not just non-empty
  if (isRealName(h.name))                                         score += 6;
  if (isValidEmail(h.email))                                      score += 6;
  if (isRealPhone(h.phone))                                       score += 4;
  if (h.location && h.location.trim().length >= 2)                score += 4;
  if (hasRealWords(h.title, 1))                                   score += 4;
  if (isRealLink(h.linkedin) || isRealLink(h.github) || isRealLink(h.portfolio)) score += 6;
  // Summary: 15 pts — must have real sentences, not gibberish
  const sm = safeStr(data.summary);
  if (hasRealWords(sm, 10)) score += 15;
  else if (hasRealWords(sm, 5)) score += 8;
  // Experience: 20 pts — entries must have company names
  const exp = safeArr(data.experience).filter(e => e.company?.trim().length >= 2);
  if (exp.length >= 2) score += 20;
  else if (exp.length === 1) score += 12;
  // Education: 10 pts — must have institution
  if (safeArr(data.education).some(e => e.institution?.trim().length >= 2)) score += 10;
  // Skills: 15 pts — items must look like real skill names
  const skillItems = safeArr(data.skills).reduce((s, sk) =>
    s + safeArr(sk.items).filter(i => i.trim().length >= 2 && /[a-zA-Z]/.test(i)).length, 0);
  if (skillItems >= 10) score += 15;
  else if (skillItems >= 5) score += 8;
  // Projects: 5 pts
  if (safeArr(data.projects).some(p => p.name?.trim().length >= 2)) score += 5;
  // Certs: 5 pts
  if (safeArr(data.certifications).some(c => c.name?.trim().length >= 2)) score += 5;
  return Math.min(100, score);
}

function calcGrammarScore(data: Partial<CvData> | null): number {
  if (!data) return 100;
  const bullets = safeArr(data.experience).flatMap(e => safeArr(e.bullets).filter(Boolean));
  // If bullets exist but none are real sentences, penalise heavily
  const realBullets = bullets.filter(b => hasRealWords(b, 3));
  if (bullets.length === 0) return 75;
  if (realBullets.length === 0) return 20; // all gibberish
  let deductions = (bullets.length - realBullets.length) * 8; // gibberish bullets penalised
  realBullets.forEach(b => {
    if (/^(was|did|helped|worked|responsible|involved|assisted|i |my )/i.test(b.trim())) deductions += 4;
    if (b.length > 250) deductions += 2;
    if (!/[.!?]$/.test(b.trim()) && b.length > 20) deductions += 1;
    if (/  +/.test(b)) deductions += 1;
  });
  const sm = safeStr(data.summary);
  if (sm.length > 0 && !hasRealWords(sm, 5)) deductions += 20; // gibberish summary
  if (sm.length > 0 && /\bi\b/i.test(sm)) deductions += 5;
  return Math.max(0, Math.min(100, 100 - deductions));
}

function completeness(data: Partial<CvData> | undefined): Record<string, SectionCompleteness> {
  const h  = (data && data.header) || {};
  const sm = safeStr(data?.summary);
  const exp = safeArr(data?.experience);
  return {
    header:         isRealName(h.name) && isValidEmail(h.email) ? 'complete' : isRealName(h.name) ? 'partial' : 'empty',
    summary:        hasRealWords(sm, 8) ? 'complete' : sm.length > 0 ? 'partial' : 'empty',
    experience:     exp.length > 0 ? (exp.some(e => safeArr(e.bullets).filter(isRealBullet).length > 0) ? 'complete' : 'partial') : 'empty',
    education:      safeArr(data?.education).some(e => e.institution?.trim().length >= 2) ? 'complete' : safeArr(data?.education).length > 0 ? 'partial' : 'empty',
    skills:         safeArr(data?.skills).some(s => safeArr(s.items).length >= 3) ? 'complete' : safeArr(data?.skills).length > 0 ? 'partial' : 'empty',
    projects:       safeArr(data?.projects).some(p => p.name?.trim().length >= 2) ? 'complete' : 'empty',
    certifications: safeArr(data?.certifications).some(c => c.name?.trim().length >= 2) ? 'complete' : 'empty',
    languages:      safeArr(data?.languages).length > 0 ? 'complete' : 'empty',
    hobbies:        safeArr(data?.hobbies).length > 0 ? 'complete' : 'empty',
    references:     safeArr(data?.references).length > 0 ? 'complete' : 'empty',
    custom:         data?.custom?.title ? 'complete' : 'empty',
  };
}

function migrateData(raw: unknown): CvData {
  raw = (raw && typeof raw === 'object') ? raw : {};
  const ensureId = <T extends object>(arr: unknown): T[] =>
    safeArr(arr)
      .filter((e): e is Record<string, unknown> => typeof e === 'object' && e !== null)
      .map(e => ({ ...e, id: (e as any).id || cvId() })) as T[];
  return {
    header:         { ...EMPTY_DATA.header, ...(((raw as any).header && typeof (raw as any).header === 'object') ? (raw as any).header : {}) },
    summary:        safeStr((raw as any).summary),
    experience:     ensureId((raw as any).experience),
    education:      ensureId((raw as any).education),
    skills:         ensureId((raw as any).skills),
    projects:       ensureId((raw as any).projects),
    certifications: ensureId((raw as any).certifications),
    languages:      ensureId((raw as any).languages),
    references:     ensureId((raw as any).references),
    hobbies:        safeArr((raw as any).hobbies),
    custom:         ((raw as any).custom && typeof (raw as any).custom === 'object')
                      ? { title: safeStr((raw as any).custom.title), body: safeStr((raw as any).custom.body) }
                      : { ...EMPTY_DATA.custom },
  };
}

const ATS_STOP = new Set([
  // articles / prepositions / conjunctions
  'the','a','an','and','or','in','on','at','to','for','of','with','by','is','are','was','were','will','have','has','had','be','been',
  'this','that','you','we','they','our','your','their','as','it','its','from','up','about','into','through','before','after','each',
  'more','also','than','so','if','but','not','all','both','few','most','no','nor','only','own','same','too','very','just','can','such',
  'use','used','using','work','working','within','across','between','over','under','per','any','some','other','another','may','must',
  'should','would','could','new','one','two','three','four','five','who','how','what','when','where','which','while','then','there',
  // job posting filler words
  'job','jobs','role','roles','position','positions','apply','candidate','candidates','selected','join','joining','seeking','looking',
  'hiring','hire','team','teams','company','companies','organization','firm','employer','employee','staff','member','members',
  'internship','intern','interns','opportunity','opportunities','application','applications','resume','cv','portfolio',
  // adjectives / descriptors
  'strong','excellent','good','great','best','top','motivated','passionate','innovative','dynamic','fast','quick','proven','solid',
  'effective','efficient','reliable','creative','flexible','adaptable','proactive','detail','oriented','driven','focused','based',
  'responsible','dedicated','experienced','skilled','talented','qualified','competitive','collaborative','professional','technical',
  // common HR / requirement words
  'experience','knowledge','understanding','ability','skills','skill','background','proficiency','familiarity','expertise','years',
  'minimum','preferred','required','requirement','requirements','plus','bonus','ideal','ideally','including','include','included',
  'related','relevant','equivalent','similar','demonstrate','demonstrated','working','hands','etc','e.g','i.e',
  // common verbs used in JDs (not skills)
  'build','building','built','create','creating','created','develop','developing','make','making','help','helping','improve',
  'improving','ensure','ensuring','deliver','delivering','maintain','maintaining','communicate','communicating','manage',
  'managing','support','supporting','solve','solving','contribute','contributing','participate','participating','design',
  'designing','implement','implementing','define','defining','drive','driving','lead','leading','grow','growing',
  'handle','handles','handling','provide','providing','review','reviewing','follow','following','meet','meeting',
  // grammar words missed before
  'well','will','able','want','need','take','get','got','let','set','new','own','due','put','see','say','make',
  // business / soft / environment words (not technical skills)
  'environment','environments','market','markets','decision','decisions','ownership','process','processes',
  'culture','business','product','products','service','services','solution','solutions','strategy','strategies',
  'value','values','impact','growth','results','outcome','outcomes','goal','goals','objective','objectives',
  'priority','priorities','initiative','initiatives','approach','approaches','mindset','attitude','behavior',
  'people','person','individual','community','diversity','inclusion','equity','mission','vision','purpose',
  'customer','client','clients','partner','partners','vendor','vendors','stakeholder','stakeholders',
  'budget','cost','costs','revenue','profit','loss','investment','roi','kpi','metric','metrics','data',
  'time','times','way','ways','case','cases','level','levels','type','types','area','areas','part','parts',
  'factor','factors','aspect','aspects','issue','issues','challenge','challenges','problem','problems',
  'benefit','benefits','feature','features','task','tasks','point','points','item','items','note','notes',
  'week','weeks','month','months','year','years','day','days','hour','hours',
]);

const KNOWN_SKILLS = new Set([
  'javascript','typescript','python','java','golang','go','rust','ruby','php','swift','kotlin','scala','perl','dart','elixir','haskell','matlab','bash','shell','powershell','r',
  'react','vue','angular','svelte','nextjs','nuxt','gatsby','remix','astro','jquery','bootstrap','tailwind','tailwindcss','sass','less','scss','webpack','vite','babel','parcel','rollup','storybook','figma','sketch','framer',
  'nodejs','express','fastify','nestjs','django','flask','fastapi','spring','rails','laravel','symfony','phoenix','fiber','gin','echo','hapi','koa','strapi',
  'postgresql','postgres','mysql','mongodb','redis','sqlite','cassandra','dynamodb','elasticsearch','neo4j','couchdb','mariadb','mssql','supabase','firebase','prisma','sequelize','mongoose','typeorm','knex','drizzle','planetscale',
  'aws','gcp','azure','heroku','vercel','netlify','cloudflare','digitalocean','docker','kubernetes','k8s','terraform','ansible','jenkins','nginx','linux','apache','helm','vagrant','puppet','chef','grafana','prometheus','datadog',
  'github','gitlab','bitbucket','jira','confluence','trello','notion','postman','insomnia','swagger','openapi',
  'jest','mocha','cypress','selenium','playwright','vitest','jasmine','chai','supertest','pytest','junit','testng','storybook',
  'rest','graphql','grpc','websocket','oauth','jwt','microservices','serverless','devops','mlops','agile','scrum','kanban','tdd','bdd','ddd','oop','solid','mvc','mvvm','spa','pwa','ssr','csr','cicd','seo',
  'pandas','numpy','tensorflow','pytorch','sklearn','opencv','nltk','keras','langchain','openai','huggingface','tableau','powerbi','looker','spark','hadoop','airflow','dbt','snowflake','bigquery','redshift',
  'redux','zustand','mobx','rxjs','recoil','tanstack','trpc','socket.io','stripe','twilio','sendgrid','shopify','wordpress','firebase','supabase','sanity','contentful',
  'excel','powerpoint','photoshop','illustrator','indesign','aftereffects','blender','unity','unreal',
  'html','css','api','sdk','cli','cms','cdn','dns','ssl','tls','http','https','tcp','grpc','sql','nosql','xml','json','yaml','markdown',
  'accessibility','wcag','i18n','pwa','webgl','threejs','d3','chartjs','leaflet','mapbox',
  'c++','c#','.net','asp.net','node.js','next.js','vue.js','react.js','express.js','socket.io','tailwind.css',
]);

function isSkillLike(kw: string): boolean {
  const k = kw.toLowerCase().trim().replace(/[.,;:!?()\[\]]+$/, '');
  if (k.length < 2) return false;
  if (/[a-z]\.[a-z]/.test(k)) return true;  // node.js, next.js, socket.io
  if (/\+\+/.test(k)) return true;           // c++
  if (/[a-z]#/.test(k)) return true;         // c#, f#
  if (KNOWN_SKILLS.has(k)) return true;
  if (/\d/.test(k)) return true;
  return false;
}

function extractKeywords(text: string): string[] {
  const raw = (text.toLowerCase().match(/[a-z][a-z.+#-]{1,}/g) || [])
    .map(w => w.replace(/[.\-,;:!?]+$/, ''))
    .filter(w => !ATS_STOP.has(w) && w.length >= 3);
  return [...new Set(raw)].slice(0, 80);
}
function cvTextContent(data: Partial<CvData> | null): string {
  if (!data) return '';
  return [
    data.header?.name, data.header?.title,
    safeStr(data.summary),
    ...safeArr(data.experience).flatMap(e=>[e.jobTitle,e.company,e.location,...safeArr(e.bullets)]),
    ...safeArr(data.education).flatMap(e=>[e.degree,e.field,e.institution,...safeArr(e.courses)]),
    ...safeArr(data.skills).flatMap(s=>[s.name,...safeArr(s.items)]),
    ...safeArr(data.projects).flatMap(p=>[p.name,p.description,...safeArr(p.techStack),...safeArr(p.bullets)]),
    ...safeArr(data.certifications).flatMap(c=>[c.name,c.issuer]),
    ...safeArr(data.languages).map(l=>l.language),
    data.custom?.title, data.custom?.body,
  ].filter(Boolean).join(' ').toLowerCase();
}

export {
  CV_SECTIONS, CV_COLOR_THEMES, makeSizes, CV_FONT_CATEGORIES, CV_FONTS, GOOGLE_FONT_URLS,
  EMPTY_DATA, CV_LIST_KEY, CV_DATA_PREFIX, EMPLOYMENT_TYPES, PROFICIENCY_LEVELS,
  STORAGE_KEY, IMPORT_KEY, TEMPLATES, DEFAULT_THEMES, DEFAULT_CUSTOM, DEFAULT_SECTION_LABELS, DEMO_DATA,
  CvTemplateThumbnail, cvId, slugify, getThemeColors, hexAlpha, safeStr, safeArr,
  hasRealWords, isRealName, isValidEmail, isRealPhone, isRealLink, isRealBullet,
  calcAtsScore, calcCompletenessScore, calcGrammarScore, completeness, migrateData,
  extractKeywords, cvTextContent, ATS_STOP, TECH_TOKENS, KNOWN_SKILLS, isSkillLike,
};
