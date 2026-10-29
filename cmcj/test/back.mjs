// Back with tabs in the CMC page: tab A -> B -> C adds at most one history entry; Back -> Anatomy; Back -> leaves.
// Run from the repo root: node cmcj/test/back.mjs   (files are served from this checkout by route)
const { chromium } = await import(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright/index.mjs');
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('../../', import.meta.url).pathname;
const MIME = { html: 'text/html', js: 'text/javascript', css: 'text/css', svg: 'image/svg+xml', json: 'application/json', png: 'image/png', webmanifest: 'application/manifest+json' };
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') && !fs.statSync('/opt/pw-browsers/chromium').isDirectory() ? '/opt/pw-browsers/chromium' : undefined);
const b = await chromium.launch(exe ? { executablePath: exe, args: ['--no-sandbox'] } : {});
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.route(/^https:\/\/hand\.anawj\.com\//, async route => {
  let rel = decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\//, '');
  if (!rel.startsWith('cmcj/')) return route.fulfill({ status: 404, body: 'not found' });
  rel = 'cmcj/' + rel.slice(5);
  if (rel.endsWith('/')) rel += 'index.html';
  const f = path.join(root, rel);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
  await route.fulfill({ status: 200, contentType: MIME[f.split('.').pop()] || 'application/octet-stream', body: fs.readFileSync(f) });
});
const page = await ctx.newPage();
await page.goto('about:blank');
await page.goto('https://hand.anawj.com/cmcj/');
await page.waitForFunction(() => document.querySelector('.tabs button'));
await page.waitForTimeout(1500);   // the kit module (tab-back.js) loads from core.anawj.com
const len = () => page.evaluate(() => history.length);
const hash = () => page.evaluate(() => location.hash.slice(1) || 'anatomy');
const tab = async h => { await page.click(`.tabs button[data-mode="${h}"]`); await page.waitForTimeout(150); };
const start = await len();
await tab('oa');
await tab('arthro');
assert.equal(await hash(), 'arthro');
assert.ok((await len()) - start <= 1, `history grew by ${(await len()) - start}`);
await page.goBack();
await page.waitForTimeout(200);
assert.equal(await hash(), 'anatomy', 'Back goes to the first tab');
assert.ok(await page.evaluate(() => document.querySelector('.tabs button.active').dataset.mode === 'anatomy'), 'Anatomy is on screen');
await page.goBack();
await page.waitForTimeout(300);
assert.equal(page.url(), 'about:blank', 'Back on the first tab leaves');
// tapping Anatomy from another tab takes the extra entry away again
await page.goto('https://hand.anawj.com/cmcj/');
await page.waitForFunction(() => document.querySelector('.tabs button'));
await page.waitForTimeout(1500);
const s2 = await len();
await tab('oa');
await tab('anatomy');
await page.waitForTimeout(200);
assert.equal(await hash(), 'anatomy');
assert.equal(await len(), s2 + 1, 'the extra entry stays but is skipped by Back');
await page.goBack();
await page.waitForTimeout(300);
assert.equal(page.url(), 'about:blank', 'Back after tapping Anatomy leaves');
await b.close();
console.log('cmcj back: ok');
