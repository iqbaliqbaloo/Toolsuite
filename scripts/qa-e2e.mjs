import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const base = process.env.QA_BASE_URL || 'https://3000-ih93bxlvmv8e6u93uhkq8-7270a318.us2.manus.computer';
const sitemap = fs.readFileSync(new URL('../client/public/sitemap.xml', import.meta.url), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1] || '/');
const toolRoutes = routes.filter((route) => route !== '/');
const results = [];
const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.CHROME_BIN || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function checkRoute(page, route, viewport) {
  const errors = [];
  const failed = [];
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.removeAllListeners('requestfailed');
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('requestfailed', (req) => failed.push(`${req.method()} ${req.url()} ${req.failure()?.errorText || ''}`));
  await page.setViewport(viewport);
  const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const snapshot = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim() || '',
    buttons: [...document.querySelectorAll('button')].map((b) => ({ text: b.textContent?.trim() || '', aria: b.getAttribute('aria-label') || '' })),
    inputs: document.querySelectorAll('input,textarea,select').length,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    dark: document.documentElement.classList.contains('dark'),
  }));
  let interactions = { run: false, reset: false, feedback: false, download: false, theme: false };
  const run = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /^(Run tool|Generate|Detect AI Content|Check Grammar|Check Plagiarism|Check)$/i.test(x.textContent?.trim() || ''));
    if (!b || b.hasAttribute('disabled')) return false;
    b.click(); return true;
  });
  if (run) {
    interactions.run = true;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  interactions.feedback = await page.evaluate(() => {
    const b = document.querySelector('button[aria-label="Useful"]');
    if (!b) return false; b.click(); return true;
  });
  interactions.download = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /^Download$/i.test(x.textContent?.trim() || ''));
    if (!b) return false; b.click(); return true;
  });
  interactions.reset = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent?.trim() === 'Reset');
    if (!b) return false; b.click(); return true;
  });
  if (route === '/') {
    await page.evaluate(() => document.querySelector('button[aria-label="Toggle theme"]')?.click());
    interactions.theme = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
    await page.evaluate(() => document.querySelector('button[aria-label="Search"]')?.click());
    const search = await page.$('input[type="search"]');
    if (search) {
      await search.type('calculator');
      interactions.search = true;
    }
  }
  results.push({ route, viewport: `${viewport.width}x${viewport.height}`, status: response?.status() || 0, title: snapshot.title, h1: snapshot.h1, inputs: snapshot.inputs, buttons: snapshot.buttons.length, overflow: snapshot.horizontalOverflow, dark: snapshot.dark, interactions, errors, failed });
}

const page = await browser.newPage();
await checkRoute(page, '/', { width: 1280, height: 720 });
for (const route of toolRoutes) await checkRoute(page, route, { width: 1280, height: 720 });
for (const route of ['/', '/calculator/compound-interest', '/developer/json-csv', '/generator/password', '/image/svg-to-png']) await checkRoute(page, route, { width: 375, height: 812 });
await browser.close();

const summary = {
  totalChecks: results.length,
  routeCount: toolRoutes.length,
  httpFailures: results.filter((r) => r.status < 200 || r.status >= 400),
  missingTitles: results.filter((r) => !r.title),
  missingH1: results.filter((r) => r.route !== '/' && !r.h1),
  overflow: results.filter((r) => r.overflow),
  consoleErrors: results.filter((r) => r.errors.length),
  failedRequests: results.filter((r) => r.failed.length),
  interactionCoverage: {
    run: results.filter((r) => r.interactions.run).length,
    reset: results.filter((r) => r.interactions.reset).length,
    feedback: results.filter((r) => r.interactions.feedback).length,
    download: results.filter((r) => r.interactions.download).length,
    theme: results.filter((r) => r.interactions.theme).length,
  },
};
fs.writeFileSync('qa-e2e-results.json', JSON.stringify({ summary, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (summary.routeCount !== 30 || summary.httpFailures.length || summary.missingTitles.length || summary.missingH1.length || summary.overflow.length || summary.consoleErrors.length || summary.failedRequests.length) process.exitCode = 1;
