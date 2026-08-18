import type { Metadata } from 'next';
import ToolSuiteClient from '../ToolSuiteClient';
import { TOOLS } from '../../client/src/original/constants/tools';
import { getToolGuide } from '../../client/src/original/seo/tool-guides';
import { getToolMeta } from '../../client/src/original/seo/seo';

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug.replace(/^\//, '').split('/') }));
}

function getRouteTool(slug: string[]) {
  return TOOLS.find((item) => item.slug === `/${slug.join('/')}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = `/${slug.join('/')}`;
  const tool = getRouteTool(slug);
  const meta = tool ? getToolMeta(tool) : undefined;
  return {
    title: meta?.title || tool?.name || 'ToolSuite Tools',
    description: meta?.description || tool?.description,
    alternates: { canonical: path },
    openGraph: { title: meta?.title || tool?.name, description: meta?.description || tool?.description, url: path },
  };
}

export default async function ToolRoute({ params }: Props) {
  const { slug } = await params;
  const tool = getRouteTool(slug);
  const guide = tool ? getToolGuide(tool.id) : undefined;
  const meta = tool ? getToolMeta(tool) : undefined;

  return (
    <>
      <ToolSuiteClient />
      <noscript>
        <main className="mx-auto max-w-5xl px-6 py-16 text-[var(--text-primary,#fff)]">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent,#f5a97f)]">ToolSuite tool</p>
          <h1 className="mt-4 text-4xl font-semibold">{tool?.name || 'ToolSuite tool'}</h1>
          <p className="mt-5 max-w-3xl text-lg text-[var(--text-secondary,#b8adb9)]">{meta?.description || tool?.description || 'A browser-first utility from ToolSuite.'}</p>
          {guide ? (
            <section className="mt-10 grid gap-6 md:grid-cols-3" aria-label="Tool guide">
              <div><h2 className="text-lg font-semibold">How it works</h2><p className="mt-2 text-[var(--text-secondary,#b8adb9)]">{guide.method}</p></div>
              <div><h2 className="text-lg font-semibold">Example</h2><p className="mt-2 text-[var(--text-secondary,#b8adb9)]">{guide.example}</p></div>
              <div><h2 className="text-lg font-semibold">Limitations</h2><p className="mt-2 text-[var(--text-secondary,#b8adb9)]">{guide.limitations}</p></div>
            </section>
          ) : null}
          <p className="mt-10 text-[var(--text-secondary,#b8adb9)]">Enable JavaScript to use the interactive inputs, calculations, downloads, and feedback controls.</p>
        </main>
      </noscript>
    </>
  );
}
