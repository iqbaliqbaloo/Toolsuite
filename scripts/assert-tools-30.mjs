import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../client/src/original/constants/tools.ts', import.meta.url), 'utf8');
const catalog = source.split('export const TOOLS: Tool[] = [')[1].split('export const QUICK_FILTERS')[0];
const ids = [...catalog.matchAll(/\{ id: '([^']+)'/g)].map(([, id]) => id);
const slugs = [...catalog.matchAll(/slug: '([^']+)'/g)].map(([, slug]) => slug);
const unique = values => new Set(values).size === values.length;
if (ids.length !== 30 || slugs.length !== 30 || !unique(ids) || !unique(slugs)) {
  throw new Error(`Expected 30 unique tools and slugs; got ids=${ids.length}, slugs=${slugs.length}, uniqueIds=${new Set(ids).size}, uniqueSlugs=${new Set(slugs).size}`);
}
console.log(JSON.stringify({ count: ids.length, uniqueIds: new Set(ids).size, uniqueSlugs: new Set(slugs).size }, null, 2));
