import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-base,#1d1820)] px-6 py-24 text-[var(--text-primary,#fff)]">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent,#f5a97f)]">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-[var(--text-secondary,#b8adb9)]">The ToolSuite page you requested does not exist.</p>
        <Link className="mt-8 inline-flex rounded-full bg-[var(--accent,#f5a97f)] px-5 py-3 font-medium text-black" href="/">Return to ToolSuite</Link>
      </div>
    </main>
  );
}
