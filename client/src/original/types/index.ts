export interface ToolTag {
  label: string;
  tone: 'orange' | 'violet' | 'green';
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  icon: string;
  badge?: string;
  tag?: ToolTag;
  highlight: string;
  keywords: string[];
}

export interface ToolCategory {
  id: string;
  label: string;
  short: string;
}

export interface QuickFilter {
  id: string;
  label: string;
  match?: (tool: Tool) => boolean;
}

export type Route =
  | { kind: 'home'; category?: string | null }
  | { kind: 'tool'; tool: Tool };
