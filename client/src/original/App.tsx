'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TOOLS } from './constants/tools';
import type { Route, Tool } from './types';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import SearchModal from './components/SearchModal';
import Home from './components/Home';
import ToolPage from './features/index';
import Footer from './components/layout/Footer';
import { applyRouteSeo } from './seo/seo';

export default function App() {
  const [pathname, setPathname] = useState(() => typeof window !== 'undefined' ? window.location.pathname : '/');
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });
  const [route, setRoute] = useState<Route>({ kind: 'home' });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1d1820' : '#fff8f2');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize route state with URL pathname
  useEffect(() => {
    const normalizedPath = pathname?.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
    const matchingTool = TOOLS.find(t => t.slug === normalizedPath);
    if (matchingTool) {
      setRoute({ kind: 'tool', tool: matchingTool });
    } else {
      setRoute({ kind: 'home' });
    }
  }, [pathname]);

  useEffect(() => {
    applyRouteSeo(route.kind === 'tool' ? route.tool : undefined);
  }, [route]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const onNav = useCallback((r: Route) => {
    if (r.kind === 'home') {
      setActiveCategory((r as any).category ?? null);
      setQuery('');
      navigate('/');
    } else {
      navigate(r.tool.slug);
    }
    window.scrollTo({ top: 0 });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onOpenSearch={() => setSearchOpen(true)}
        onNav={onNav}
        activeTab="tools"
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={c => { setActiveCategory(c); setQuery(''); navigate('/'); window.scrollTo({ top: 0 }); }}
        />
        <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          {route.kind === 'home'
            ? <>
                <Home
                  activeCategory={activeCategory}
                  query={query}
                  setActiveCategory={setActiveCategory}
                  setQuery={setQuery}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  onOpenTool={(t: Tool) => onNav({ kind: 'tool', tool: t })}
                />
                <Footer onNav={onNav} />
              </>
            : <ToolPage
                tool={route.tool}
                onBack={() => onNav({ kind: 'home' })}
                onOpenTool={(t: Tool) => onNav({ kind: 'tool', tool: t })}
              />
          }
        </main>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenTool={(t: Tool) => onNav({ kind: 'tool', tool: t })}
      />
    </div>
  );
}
