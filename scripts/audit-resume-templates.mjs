import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = '/home/ubuntu/toolsuite-rebuilt/client/src/original/features/generator';
const files = ['cv-templates-1.tsx', 'cv-templates-2.tsx', 'cv-templates-3.tsx'];
const source = (await Promise.all(files.map(file => readFile(path.join(root, file), 'utf8')))).join('\n');
const matches = [...source.matchAll(/function\s+(Cv[A-Za-z0-9]+Template)\s*\(/g)];
const templates = matches.map((match, index) => {
  const name = match[1].replace(/^Cv/, '').replace(/Template$/, '');
  const start = match.index ?? 0;
  const end = matches[index + 1]?.index ?? source.length;
  const body = source.slice(start, end);
  return {
    name,
    gridColumns: (body.match(/gridTemplateColumns/g) || []).length,
    fixedPageHeight: (body.match(/minHeight:'1122px'/g) || []).length > 0,
    absolutePositioning: (body.match(/position:'absolute'/g) || []).length > 0,
    contactIsPlainText: /\[h\.(email|phone|location|linkedin|github|portfolio)[\s\S]{0,200}\.join\('  ·  '\)/.test(body),
    includesPhoto: /<img[^>]+alt="Profile"/.test(body),
    atsModeBranches: (body.match(/atsMode/g) || []).length,
  };
});
const summary = {
  templateCount: templates.length,
  templates,
  sharedSignals: {
    fixedA4HeightCount: (source.match(/minHeight:'1122px'/g) || []).length,
    twoColumnGridCount: (source.match(/gridTemplateColumns:'minmax\(0,\d+fr\) minmax\(0,\d+fr\)'/g) || []).length,
    absolutePositionCount: (source.match(/position:'absolute'/g) || []).length,
    atsModeCount: (source.match(/atsMode/g) || []).length,
  },
};
console.log(JSON.stringify(summary, null, 2));
