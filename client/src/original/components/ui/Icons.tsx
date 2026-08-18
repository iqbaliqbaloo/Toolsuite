import React from 'react';

const ICON_PATHS: Record<string, string> = {
  Search: 'M21 21l-4.3-4.3|circle:11,11,7', Sun: 'circle:12,12,4|M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41',
  Moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', Menu: 'M3 6h18M3 12h18M3 18h18', X: 'M18 6L6 18M6 6l12 12',
  ChevronDown: 'M6 9l6 6 6-6', ChevronRight: 'M9 6l6 6-6 6', ChevronLeft: 'M15 18l-6-6 6-6', ChevronUp: 'M18 15l-6-6-6 6',
  ArrowRight: 'M5 12h14M12 5l7 7-7 7', Shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  Clock: 'circle:12,12,9|polyline:12,7,12,12,15,14', Zap: 'M13 2L3 14h8l-1 8 10-12h-8l1-8z',
  FileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|polyline:14,2,14,8,20,8|M16 13H8M16 17H8M10 9H8',
  FileDown: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|polyline:14,2,14,8,20,8|M12 18v-6M9 15l3 3 3-3',
  FilePlus: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|polyline:14,2,14,8,20,8|M12 18v-6M9 15h6',
  FilePen: 'M14 2H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h7|polyline:14,2,14,8,20,8|M18.4 12.6a2 2 0 1 1 3 3L17 20l-4 1 1-4z',
  Layers: 'M12 2l10 6-10 6L2 8l10-6z|M2 17l10 6 10-6M2 12l10 6 10-6',
  Image: 'rect:3,3,18,18,2|circle:9,9,2|M21 15l-5-5L5 21', Scissors: 'M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12|circle:6,6,3|circle:6,18,3',
  Minimize2: 'polyline:4,14,10,14,10,20|polyline:20,10,14,10,14,4|M14 10l7-7M3 21l7-7', RefreshCw: 'M21 12a9 9 0 1 1-6.219-8.56M21 3v6h-6',
  Expand: 'polyline:15,3,21,3,21,9|polyline:9,21,3,21,3,15|M21 3l-7 7M3 21l7-7',
  ScanText: 'M3 7V5a2 2 0 0 1 2-2h2M21 7V5a2 2 0 0 0-2-2h-2M3 17v2a2 2 0 0 0 2 2h2M21 17v2a2 2 0 0 1-2 2h-2M7 9h10M7 13h7M7 17h4',
  Eraser: 'M20 20H7l-3-3a2 2 0 0 1 0-3l9-9a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-7 7', Hash: 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
  SpellCheck: 'M6 16.5l3-9 3 9M7.5 13.5h3M15 18l3 3 4-4', UserCheck: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M17 11l2 2 4-4|circle:9,7,4',
  ShieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z|polyline:9,12,11,14,15,10', Bot: 'rect:4,8,16,12,2|polyline:9,21,9,18,15,18,15,21|M2 14h2M20 14h2M9 13v.01M15 13v.01|M12 4V8M8 4h8',
  Braces: 'M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5c0-1.1-.9-2-2-2h-1',
  Code2: 'M16 18l6-6-6-6M8 6l-6 6 6 6', Binary: 'rect:6,4,4,6,1|rect:14,14,4,6,1|M6 20h4M14 4h4M6 14h4v-4M14 20h4v-4',
  KeyRound: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  Database: 'ellipse:12,5,9,3|M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6', Camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z|circle:12,13,4',
  QrCode: 'rect:3,3,7,7,1|rect:14,3,7,7,1|rect:3,14,7,7,1|M14 14h3v3h-3zM21 14v3M14 21h3M17 17v4M21 21v.01', Lock: 'rect:3,11,18,11,2|M7 11V7a5 5 0 0 1 10 0v4',
  Receipt: 'M21 3v18l-3-2-3 2-3-2-3 2-3-2-3 2V3l3 2 3-2 3 2 3-2 3 2 3-2z|M8 9h8M8 13h6', Fingerprint: 'M12 11a4 4 0 0 1 4 4v2M12 11a4 4 0 0 0-4 4v2M16 11.13a7 7 0 1 0-13.5 2.6M4 21c1-1 1.5-2 1.5-3.5M19 18a2.5 2.5 0 0 1-2.5-2.5V14a2 2 0 0 0-2-2',
  Calendar: 'rect:3,4,18,18,2|M16 2v4M8 2v4M3 10h18', Activity: 'polyline:22,12,18,12,15,21,9,3,6,12,2,12', TrendingUp: 'polyline:22,7,13.5,15.5,8.5,10.5,2,17|polyline:16,7,22,7,22,13',
  Sparkles: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  CheckCircle: 'circle:12,12,10|M9 12l2 2 4-4', Loader: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  Undo2: 'M9 14 4 9l5-5|M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11', Redo2: 'M15 14l5-5-5-5|M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13',
  Pencil: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  Trash2: 'M3 6h18|M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6|M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2|M10 11v6|M14 11v6',
  User: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|circle:12,7,4', Users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|circle:9,7,4|M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  Briefcase: 'rect:2,7,20,14,2|M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', GraduationCap: 'M22 10v6M2 10l10-5 10 5-10 5z|M6 12v5c3 3 9 3 12 0v-5',
  AlignLeft: 'M15 10H3|M21 6H3|M21 14H3|M15 18H3', FolderOpen: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z|M2 12h20',
  Award: 'circle:12,8,6|M15.477 12.89L17 22l-5-3-5 3 1.523-9.11', Smile: 'circle:12,12,10|M8 14s1.5 2 4 2 4-2 4-2|M9 9h.01|M15 9h.01',
  Check: 'M20 6L9 17l-5-5', Upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M17 8l-5-5-5 5|M12 3v12',
  Download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3', AlertCircle: 'circle:12,12,10|M12 8v4|M12 16h.01',
  Copy: 'rect:9,9,13,13,2|M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1', RotateCcw: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8|M3 3v5h5',
  Plus: 'M12 5v14M5 12h14', Minus: 'M5 12h14', Globe: 'circle:12,12,10|M2 12h20|M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  Link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71|M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  Shuffle: 'polyline:16,3,21,3,21,8|polyline:4,20,4,15|M21 3l-7 7|M3 3l18 18|M4 4l3.5 3.5|M20.5 8.5l-3.5-3.5', Type: 'polyline:4,7,4,4,20,4,20,7|M9 20h6|M12 4v16',
  Percent: 'M19 5L5 19|circle:6.5,6.5,2.5|circle:17.5,17.5,2.5', Eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|circle:12,12,3',
  EyeOff: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94|M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19|M1 1l22 22|M14.12 14.12a3 3 0 1 1-4.24-4.24',
  Settings: 'circle:12,12,3|M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
};

type IconProps = { name: string; size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties };

function piece(p: string): React.ReactElement {
  if (p.startsWith('circle:'))   { const [cx,cy,r] = p.slice(7).split(',').map(Number);    return <circle cx={cx} cy={cy} r={r} />; }
  if (p.startsWith('ellipse:'))  { const [cx,cy,rx,ry] = p.slice(8).split(',').map(Number); return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />; }
  if (p.startsWith('rect:'))     { const [x,y,w,h,rx] = p.slice(5).split(',').map(Number);  return <rect x={x} y={y} width={w} height={h} rx={rx||0} ry={rx||0} />; }
  if (p.startsWith('polyline:')) { return <polyline points={p.slice(9)} />; }
  if (p.startsWith('polygon:'))  { return <polygon points={p.slice(8)} />; }
  return <path d={p} />;
}

export function Icon({ name, size = 16, strokeWidth = 1.75, className, style }: IconProps) {
  const def = ICON_PATHS[name];
  const svgProps = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className, style, 'aria-hidden': true };
  if (!def) return <svg {...svgProps}><rect x="4" y="4" width="16" height="16" rx="2" /></svg>;
  return (
    <svg {...svgProps}>
      {def.split('|').map((p, i) => <React.Fragment key={i}>{piece(p)}</React.Fragment>)}
    </svg>
  );
}
