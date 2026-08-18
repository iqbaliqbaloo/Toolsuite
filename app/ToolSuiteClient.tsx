'use client';

import dynamic from 'next/dynamic';

const OriginalApp = dynamic(() => import('../client/src/original/App'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[var(--bg-base,#1d1820)]" aria-busy="true" />,
});

export default function ToolSuiteClient() {
  return <OriginalApp />;
}
