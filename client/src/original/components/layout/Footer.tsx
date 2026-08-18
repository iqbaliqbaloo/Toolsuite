import React from 'react';
import { TOOLS, TOOL_CATEGORIES } from '../../constants/tools';

interface FooterProps {
  onNav: (r: any) => void;
}

const SOCIAL = [
  {
    name: 'Gmail',
    href: 'mailto:miqbal2226cs@gmail.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="2,4 12,13 22,4" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/iqbaliqbaloo',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/muhammad-iqbal-865b14415',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@MindBlownFacts-z8o',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white" />
      </svg>
    ),
  },
];

export default function Footer({ onNav }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border)] mt-auto" style={{ background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Tool links by category */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {TOOL_CATEGORIES.map(cat => (
            <div key={cat.id}>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5"
                style={{ color: `var(--cat-${cat.id}-ink)` }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: `var(--cat-${cat.id}-ink)` }} />
                {cat.label}
              </p>
              <ul className="flex flex-col gap-2">
                {TOOLS.filter(t => t.category === cat.id).map(tool => (
                  <li key={tool.id}>
                    <button
                      onClick={() => onNav({ kind: 'tool', tool })}
                      className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-left leading-snug"
                    >
                      {tool.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[var(--text-tertiary)]">
            © {new Date().getFullYear()}{' '}
            <span className="gradient-text font-bold">ToolSuite</span>
            {' '}— All tools run in your browser. No files stored.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {SOCIAL.map(s => (
              <a
                key={s.name}
                href={s.href}
                title={s.name}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-white transition-all duration-200 btn-glow"
              style={{ background: 'var(--surface-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gradient-accent)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-secondary)')}
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
