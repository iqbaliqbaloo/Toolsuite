'use client';

import './globals.css';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1d1820] text-white">
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#f5a97f]">ToolSuite</p>
          <h1 className="mt-4 text-4xl font-semibold">Something went wrong</h1>
          <p className="mt-4 text-[#b8adb9]">Please try again or return to the homepage.</p>
          <button className="mt-8 rounded-full bg-[#f5a97f] px-5 py-3 font-medium text-black" onClick={() => reset()}>Try again</button>
        </main>
      </body>
    </html>
  );
}
