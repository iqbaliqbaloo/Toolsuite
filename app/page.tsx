import ToolSuiteClient from './ToolSuiteClient';

export default function HomePage() {
  return (
    <>
      <ToolSuiteClient />
      <noscript>
        <main className="mx-auto max-w-5xl px-6 py-16 text-[var(--text-primary,#fff)]">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent,#f5a97f)]">ToolSuite</p>
          <h1 className="mt-4 text-4xl font-semibold">Free online tools for work, study, and everyday tasks</h1>
          <p className="mt-5 max-w-3xl text-lg text-[var(--text-secondary,#b8adb9)]">Use 30 browser-first calculators, developer utilities, generators, image tools, and productivity helpers with clear results and practical guidance.</p>
          <p className="mt-4 max-w-3xl text-[var(--text-secondary,#b8adb9)]">Enable JavaScript to use the interactive ToolSuite workspace, or open a dedicated tool route from the site navigation.</p>
        </main>
      </noscript>
    </>
  );
}
