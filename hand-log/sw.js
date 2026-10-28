// Offline copy of the hand log. Bump VERSION whenever any SHELL file changes.
// Network first: online, every visit gets the current page (no update bar, owner 13 Oct 2026); the cache is only
// for offline or a network slower than NET_WAIT. A new version switches itself on once it has cached the page.

const VERSION = 'hand-log-v1';
const NET_WAIT = 3000; // ms before falling back to the cached copy
// The app kit (app-ui), one exact version (kit.js, index.html): the theme sheets and theme/index.js with every module it
// imports. Exact-version files never change, so they are served from this cache first, online or not.
const KIT = 'https://core.anawj.com/ui/1.0.0-rc.24/';
const KIT_SHELL = ['theme/early.js', 'theme/theme.css', 'theme/index.js', 'theme/choice.js',
  'theme/colour.js', 'theme/grid.js', 'theme/guard.js', 'theme/looks.js', 'theme/motion.js', 'theme/palette-css.js',
  'theme/presets.js', 'theme/schema.js', 'theme/switch.js', 'theme/looks/a.js', 'theme/looks/b.js', 'theme/looks/c.js',
  'theme/looks/d.js', 'theme/looks/e.js'].map(f => KIT + f);
const PINNED = /^https:\/\/core\.anawj\.com\/ui\/\d+\.\d+\.\d+(-rc\.\d+)?\//;
const SHELL = ['./', 'index.html', 'style.css', 'https://design.anawj.com/v1/tokens.css', 'https://design.anawj.com/v1/app.css', 'https://design.anawj.com/v1/app.js', 'js/app.js', 'js/forms.js', 'kit.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/favicon-32.png', 'icons/apple-touch-icon.png', 'icons/icon-192.png', ...KIT_SHELL];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(
    SHELL.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))).then(() => self.skipWaiting()));
});

// Older pages ask a waiting worker to take over (kept so they can still switch to this version).
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // only this app's caches: other apps on the same origin keep theirs
    for (const k of await caches.keys()) if (k.startsWith('hand-log-') && k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (PINNED.test(req.url)) {
    e.respondWith(caches.open(VERSION).then(async cache => await cache.match(req) || fetch(req).then(res => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })));
    return;
  }
  if (url.origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    // navigations: the page, cached under by the folder (see prewarm/sw.js for why not 'index.html')
    const shell = req.mode === 'navigate' && /\/(index\.html)?$/.test(url.pathname);
    const key = shell ? './' : req;
    const cached = () => cache.match(key, { ignoreSearch: req.mode === 'navigate' });
    const net = fetch(req).then(res => {
      if (res.ok && res.type === 'basic') cache.put(key, res.clone());
      return res;
    });
    // slow network: show the cached copy rather than wait (the fetch still refreshes the cache for next time)
    const slow = new Promise(r => setTimeout(r, NET_WAIT)).then(cached).then(hit => hit || net);
    slow.catch(() => {}); // offline: handled below
    try {
      return await Promise.race([net, slow]);
    } catch (err) {
      const hit = await cached() || (shell && await cache.match('./'));
      if (hit) return hit;
      throw err;
    }
  })());
});
