'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[var(--bg-base,#1d1820)] px-6 py-24 text-[var(--text-primary,#fff)]">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent,#f5a97f)]">ToolSuite</p>
        <h1 className="mt-4 text-4xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-[var(--text-secondary,#b8adb9)]">Please try again or return to the homepage.</p>
        <button className="mt-8 rounded-full bg-[var(--accent,#f5a97f)] px-5 py-3 font-medium text-black" onClick={() => reset()}>Try again</button>
      </div>
    </main>
  );
}
