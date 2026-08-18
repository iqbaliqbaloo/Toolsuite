import { describe, expect, it } from 'vitest';
import { TOOLS } from '../constants/tools';
import { buildSeoGraph, getToolMeta, getRelatedTools, getToolSeo, SITE_URL } from './seo';

const sitemapRoutes = [
  '/',
  '/generator/qr', '/generator/password', '/generator/resume', '/generator/invoice', '/generator/uuid',
  '/calculator/age', '/calculator/bmi', '/calculator/currency', '/calculator/compound-interest', '/calculator/crypto-roi', '/calculator/mortgage', '/calculator/salary-after-tax', '/calculator/freelance-rate', '/calculator/investment-return', '/calculator/percentage',
  '/developer/sitemap', '/developer/htaccess', '/developer/robots', '/developer/domain-age', '/developer/social-share', '/developer/json-csv', '/developer/regex', '/developer/sql', '/developer/yaml', '/developer/crontab', '/developer/timezone', '/image/svg-to-png', '/developer/flexbox', '/developer/utm', '/developer/subnet',
];

describe('ToolSuite SEO foundation', () => {
  it('keeps the sitemap aligned with the exact 30-tool catalog', () => {
    expect(TOOLS).toHaveLength(30);
    expect(new Set(TOOLS.map(tool => tool.slug)).size).toBe(30);
    expect(sitemapRoutes).toHaveLength(31);
    expect(new Set(sitemapRoutes)).toEqual(new Set(['/', ...TOOLS.map(tool => tool.slug)]));
  });

  it('uses the configured Vercel deployment as the canonical SEO origin', () => {
    expect(SITE_URL).toBe('https://toolsuite-bice.vercel.app');
  });

  it('generates safe metadata for every tool, including newly added tools', () => {
    for (const tool of TOOLS) {
      const meta = getToolMeta(tool);
      expect(meta.title).toContain('ToolSuite');
      expect(meta.title.length).toBeGreaterThan(20);
      expect(meta.description.length).toBeGreaterThan(40);
      expect(`${SITE_URL}${tool.slug}`).toMatch(/^https:\/\//);
    }
  });

  it('keeps every tool title distinct and descriptions search-snippet friendly', () => {
    const metadata = TOOLS.map(tool => getToolMeta(tool));
    expect(new Set(metadata.map(item => item.title)).size).toBe(TOOLS.length);
    expect(metadata.every(item => item.title.length <= 90)).toBe(true);
    expect(metadata.every(item => item.description.length <= 160)).toBe(true);
    expect(metadata.every(item => !/\\b(cheap|best|#1|guaranteed)\\b/i.test(item.title))).toBe(true);
  });

  it('provides relevant content and FAQs for every exact-catalog tool', () => {
    for (const tool of TOOLS) {
      const seo = getToolSeo(tool.id);
      expect(seo?.content.length).toBeGreaterThanOrEqual(3);
      expect(seo?.faqs.length).toBeGreaterThanOrEqual(3);
      expect(seo?.content.every(section => section.heading.length > 8 && section.body.length > 80)).toBe(true);
      expect(seo?.faqs.every(item => item.question.endsWith('?') && item.answer.length > 40)).toBe(true);
    }
  });

  it('emits canonical tool URLs and valid schema graph entries', () => {
    for (const tool of TOOLS) {
      const graph = buildSeoGraph(tool);
      expect(graph['@context']).toBe('https://schema.org');
      expect(Array.isArray(graph['@graph'])).toBe(true);
      const nodes = graph['@graph'] as Array<Record<string, unknown>>;
      const app = nodes.find(node => node['@type'] === 'SoftwareApplication');
      const breadcrumb = nodes.find(node => node['@type'] === 'BreadcrumbList');
      expect(app?.url).toBe(`${SITE_URL}${tool.slug}`);
      expect(breadcrumb).toBeTruthy();
      expect(String(app?.description).length).toBeGreaterThan(40);
    }
  });

  it('returns contextual related tools without returning the current tool', () => {
    const related = getRelatedTools(TOOLS[0]);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every(tool => tool.id !== TOOLS[0].id)).toBe(true);
  });
});
