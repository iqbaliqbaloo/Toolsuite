import type { Tool } from '../types';
import { TOOLS, TOOL_CATEGORIES } from '../constants/tools';
import TOOL_SEO from '../constants/tool-seo';
import { TOOL_EDUCATION } from './tool-education';
import { getToolGuide } from './tool-guides';

export const SITE_URL = 'https://toolsuite-bice.vercel.app';
export const SITE_NAME = 'ToolSuite';
export const DEFAULT_DESCRIPTION = 'Free online productivity tools for resumes, calculators, developer workflows, SEO, images, PDFs, and everyday tasks.';

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.content = content;
}

function upsertLink(rel: string, href: string) {
  let node = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement('link');
    node.rel = rel;
    document.head.appendChild(node);
  }
  node.href = href;
}

function upsertJsonLd(id: string, value: unknown) {
  let node = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);
  if (!node) {
    node = document.createElement('script');
    node.type = 'application/ld+json';
    node.dataset.seoId = id;
    document.head.appendChild(node);
  }
  node.textContent = JSON.stringify(value);
}

export function getToolSeo(toolId: string) {
  const base = TOOL_SEO[toolId];
  const extra = TOOL_EDUCATION[toolId];
  if (!base) return extra;
  if (!extra) return base;
  return {
    ...base,
    content: base.content?.length ? base.content : extra.content,
    faqs: base.faqs?.length ? base.faqs : extra.faqs,
  };
}

function compactDescription(value: string, max = 155) {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const clipped = clean.slice(0, max - 1).replace(/\s+\S*$/, '');
  return `${clipped}…`;
}

function categoryLabel(category: Tool['category']) {
  return TOOL_CATEGORIES.find(item => item.id === category)?.label || category;
}

export function getToolMeta(tool: Tool) {
  const seo = getToolSeo(tool.id);
  const guide = getToolGuide(tool.id);
  const educationalLead = seo?.content?.[0]?.body || guide?.method;
  const purpose = guide?.example ? ` ${guide.example}` : '';
  return {
    title: seo?.metaTitle || `${tool.name} — ${categoryLabel(tool.category)} Utility | ${SITE_NAME}`,
    description: compactDescription(seo?.metaDescription || `${tool.description} ${educationalLead || ''}${purpose} Browser-first, transparent, and free to use.`),
  };
}

export function buildSeoGraph(tool?: Tool) {
  const seo = tool ? getToolSeo(tool.id) : undefined;
  const description = tool ? getToolMeta(tool).description : DEFAULT_DESCRIPTION;
  const pathname = tool?.slug || '/';
  const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
  };
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  const graph: Record<string, unknown>[] = [organization, website];

  if (tool) {
    const category = TOOL_CATEGORIES.find(item => item.id === tool.category);
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'All tools', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: category?.label || tool.category, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 3, name: tool.name, item: canonical },
      ],
    });
    if (seo?.faqs?.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: seo.faqs.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      });
    }
    graph.push({
      '@type': 'SoftwareApplication',
      name: tool.name,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      url: canonical,
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${SITE_URL}/#organization` },
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function applyRouteSeo(tool?: Tool) {
  const title = tool ? getToolMeta(tool).title : `${SITE_NAME} — Free Online Productivity Tools`;
  const description = tool ? getToolMeta(tool).description : DEFAULT_DESCRIPTION;
  const pathname = tool?.slug || '/';
  const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', 'index,follow,max-image-preview:large');
  upsertMeta('property', 'og:type', tool ? 'website' : 'website');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('name', 'twitter:card', 'summary');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:url', canonical);
  upsertLink('canonical', canonical);

  upsertJsonLd('site-graph', buildSeoGraph(tool));
}

export function getRelatedTools(tool: Tool, limit = 4) {
  const sameCategory = TOOLS.filter(candidate => candidate.id !== tool.id && candidate.category === tool.category);
  const fallback = TOOLS.filter(candidate => candidate.id !== tool.id && candidate.category !== tool.category);
  return [...sameCategory, ...fallback].slice(0, limit);
}
