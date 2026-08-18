// Global declarations for CDN-loaded libraries used in Babel-standalone scripts.
// React, ReactDOM are loaded via unpkg; Icon and other components are defined in
// earlier <script type="text/babel"> tags and exposed as globals.

// declare const React: typeof import('react');
// declare const ReactDOM: typeof import('react-dom/client');

// Shared UI components defined in components.jsx / icons.jsx
declare function Icon(props: { name: string; size?: number; strokeWidth?: number; className?: string }): JSX.Element | null;
declare function BrandMark(props: { size?: number; className?: string }): JSX.Element;
declare function CategoryDot(props: { category: string; size?: number; className?: string }): JSX.Element;
declare function Tag(props: { tag?: { label: string; tone: string } | null }): JSX.Element | null;
declare function ToolCard(props: { tool: Record<string, unknown>; onOpen?: (t: unknown) => void; variant?: string }): JSX.Element;

// Shared tool utilities from shared.jsx
declare function fmtBytes(n: number): string;
declare function dlBlob(blob: Blob, name: string): void;
declare function apiUpload(path: string, fd: FormData): Promise<Response>;
declare function apiPost(path: string, body: unknown): Promise<unknown>;

// Shared tool UI from shared.jsx / tools.jsx
declare function Btn(props: { onClick?: () => void; disabled?: boolean; loading?: boolean; children?: React.ReactNode; variant?: string; className?: string }): JSX.Element;
declare function ErrAlert(props: { children: React.ReactNode }): JSX.Element;
declare function InfoAlert(props: { children: React.ReactNode }): JSX.Element;
declare function ResultPanel(props: { children: React.ReactNode }): JSX.Element;
declare function Label(props: { children: React.ReactNode; className?: string }): JSX.Element;
declare function SelectField(props: { label?: string; value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }): JSX.Element;
declare function NumberInput(props: { label?: string; value: string; onChange: (v: string) => void; min?: string; max?: string; placeholder?: string; className?: string }): JSX.Element;
declare function CopyBtn(props: { text?: string; value?: string; label?: string; className?: string }): JSX.Element;
declare function FileDropzone(props: { onFile: (f: unknown) => void; accept?: string; multiple?: boolean; files?: unknown }): JSX.Element;
declare function TextareaInput(props: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }): JSX.Element;
declare function ScoreBadge(props: { score: number; max?: number }): JSX.Element;

// App globals
declare const window: Window & {
  TOOLSUITE_API_URL?: string;
  TOOLS: Record<string, unknown>[];
  TOOL_CATEGORIES: Record<string, unknown>[];
  QUICK_FILTERS: Record<string, unknown>[];
  CATEGORY_DESCRIPTIONS: Record<string, string>;
  ResumeBuilderTool: unknown;
  html2canvas: (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  jspdf: { jsPDF: new (opts?: Record<string, unknown>) => unknown };
  [key: string]: unknown;
};
