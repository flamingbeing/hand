// worker/routes.js: which folder each address serves, and what it must never serve. Run: node --test 'worker/test/*.test.mjs'
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { resolve, SITES } from '../routes.js';

test('hand.anawj.com serves each app under its own path', () => {
  assert.deepEqual(resolve('hand.anawj.com', '/babies/'), { file: 'hand-babies/' });
  assert.deepEqual(resolve('HAND.anawj.com:443', '/babies/app.js'), { file: 'hand-babies/app.js' });
  assert.deepEqual(resolve('hand.anawj.com', '/handlog/sw.js'), { file: 'hand-log/sw.js' });
  assert.deepEqual(resolve('hand.anawj.com', '/cmcj/js/x.js'), { file: 'cmcj/js/x.js' });
  assert.deepEqual(resolve('hand.anawj.com', '/cmcj'), { redirect: '/cmcj/' });
});

test('anything else serves nothing; localhost serves the repo', () => {
  assert.deepEqual(resolve('hand.anawj.com', '/'), { notFound: true });
  assert.deepEqual(resolve('hand.anawj.com', '/hand-babies/'), { notFound: true });
  assert.deepEqual(resolve('hand.anawj.com', '/worker/sites.js'), { notFound: true });
  assert.deepEqual(resolve('x.workers.dev', '/babies/'), { notFound: true });
  assert.deepEqual(resolve('localhost:8787', '/hand-log/'), { file: 'hand-log/' });
});

test('nothing escapes its folder', () => {
  for (const p of ['/../wrangler.jsonc', '/%2e%2e/x', '/a%2fb', '/a\\b', '/./x'])
    assert.deepEqual(resolve('hand.anawj.com', p), { notFound: true }, p);
});

test('every folder in SITES exists', () => {
  for (const [host, s] of Object.entries(SITES))
    for (const f of [s.root, ...Object.values(s.prefixes || {})].filter(Boolean))
      assert.ok(fs.existsSync(new URL(`../../${f}`, import.meta.url)), `${host}: ${f}`);
});
