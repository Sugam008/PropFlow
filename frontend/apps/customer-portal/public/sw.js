if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + '.js', n).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, i) => {
    const t = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[t]) return;
    let c = {};
    const r = (e) => a(e, t),
      d = { module: { uri: t }, exports: c, require: r };
    s[t] = Promise.all(n.map((e) => d[e] || r(e))).then((e) => (i(...e), c));
  };
}
define(['./workbox-515067d1'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/YNLMxR_2EAthe212vdylF/_buildManifest.js',
          revision: '5e318e71854bf888dc4b4b5539e615dd',
        },
        {
          url: '/_next/static/YNLMxR_2EAthe212vdylF/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/118-1f42f61d475275ac.js', revision: '1f42f61d475275ac' },
        { url: '/_next/static/chunks/162-fa8299ee5b5543a1.js', revision: 'fa8299ee5b5543a1' },
        { url: '/_next/static/chunks/216-ee152486267b9c70.js', revision: 'ee152486267b9c70' },
        { url: '/_next/static/chunks/306-981b2e51d9261e1c.js', revision: '981b2e51d9261e1c' },
        { url: '/_next/static/chunks/44-cbfc31ef7a8b1e91.js', revision: 'cbfc31ef7a8b1e91' },
        { url: '/_next/static/chunks/444-5e24512f64fce504.js', revision: '5e24512f64fce504' },
        { url: '/_next/static/chunks/515-153742c5b1f8dd44.js', revision: '153742c5b1f8dd44' },
        { url: '/_next/static/chunks/831-23af2c7da90ad6d2.js', revision: '23af2c7da90ad6d2' },
        { url: '/_next/static/chunks/869.d4e7b830d212918e.js', revision: 'd4e7b830d212918e' },
        { url: '/_next/static/chunks/885-f83343211f62e4a4.js', revision: 'f83343211f62e4a4' },
        {
          url: '/_next/static/chunks/app/_global-error/page-b345dca5f541e688.js',
          revision: 'b345dca5f541e688',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-5d40e0e478a9c53e.js',
          revision: '5d40e0e478a9c53e',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-b345dca5f541e688.js',
          revision: 'b345dca5f541e688',
        },
        {
          url: '/_next/static/chunks/app/layout-ab9d45201eb656a6.js',
          revision: 'ab9d45201eb656a6',
        },
        {
          url: '/_next/static/chunks/app/login/page-ed81c881b5889e94.js',
          revision: 'ed81c881b5889e94',
        },
        {
          url: '/_next/static/chunks/app/new/details/page-33ea2690dc8118b3.js',
          revision: '33ea2690dc8118b3',
        },
        {
          url: '/_next/static/chunks/app/new/location/page-6c5a8dca35427489.js',
          revision: '6c5a8dca35427489',
        },
        {
          url: '/_next/static/chunks/app/new/page-421d069b080c45a7.js',
          revision: '421d069b080c45a7',
        },
        {
          url: '/_next/static/chunks/app/new/photos/page-42c3ff5c098c0d48.js',
          revision: '42c3ff5c098c0d48',
        },
        {
          url: '/_next/static/chunks/app/new/review/page-7716eb2aa9eab6f8.js',
          revision: '7716eb2aa9eab6f8',
        },
        { url: '/_next/static/chunks/app/page-7457bec48f6ae976.js', revision: '7457bec48f6ae976' },
        {
          url: '/_next/static/chunks/app/property/%5Bid%5D/follow-up/page-afdc3139434d91fa.js',
          revision: 'afdc3139434d91fa',
        },
        {
          url: '/_next/static/chunks/app/property/%5Bid%5D/page-9b9c132d845a6568.js',
          revision: '9b9c132d845a6568',
        },
        {
          url: '/_next/static/chunks/app/property/%5Bid%5D/result/page-f7734bd8c9eb3c75.js',
          revision: 'f7734bd8c9eb3c75',
        },
        { url: '/_next/static/chunks/c1a4b40c.1b04144e7d16b319.js', revision: '1b04144e7d16b319' },
        { url: '/_next/static/chunks/daf2dcfc-d6d8125e465eb8d1.js', revision: 'd6d8125e465eb8d1' },
        { url: '/_next/static/chunks/framework-d0a9cbc1ed273ce9.js', revision: 'd0a9cbc1ed273ce9' },
        { url: '/_next/static/chunks/main-app-785332c5606511c2.js', revision: '785332c5606511c2' },
        { url: '/_next/static/chunks/main-b932a1fc4a1af882.js', revision: 'b932a1fc4a1af882' },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/app-error-b345dca5f541e688.js',
          revision: 'b345dca5f541e688',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/forbidden-b345dca5f541e688.js',
          revision: 'b345dca5f541e688',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/global-error-e5830a759f5c6414.js',
          revision: 'e5830a759f5c6414',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/not-found-b345dca5f541e688.js',
          revision: 'b345dca5f541e688',
        },
        {
          url: '/_next/static/chunks/next/dist/client/components/builtin/unauthorized-b345dca5f541e688.js',
          revision: 'b345dca5f541e688',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/webpack-38fc439f2479444f.js', revision: '38fc439f2479444f' },
        { url: '/_next/static/css/a539d4bf3ea20de9.css', revision: 'a539d4bf3ea20de9' },
        { url: '/_next/static/css/b83780674093a69f.css', revision: 'b83780674093a69f' },
        {
          url: '/_next/static/media/19cfc7226ec3afaa-s.woff2',
          revision: '9dda5cfc9a46f256d0e131bb535e46f8',
        },
        {
          url: '/_next/static/media/21350d82a1f187e9-s.woff2',
          revision: '4e2553027f1d60eff32898367dd4d541',
        },
        {
          url: '/_next/static/media/8e9860b6e62d6359-s.woff2',
          revision: '01ba6c2a184b8cba08b0d57167664d75',
        },
        {
          url: '/_next/static/media/ba9851c3c22cd980-s.woff2',
          revision: '9e494903d6b0ffec1a1e14d34427d44d',
        },
        {
          url: '/_next/static/media/c5fe6dc8356a8c31-s.woff2',
          revision: '027a89e9ab733a145db70f09b8a18b42',
        },
        {
          url: '/_next/static/media/df0a9ae256c0569c-s.woff2',
          revision: 'd54db44de5ccb18886ece2fda72bdfe0',
        },
        {
          url: '/_next/static/media/e4af272ccee01ff0-s.p.woff2',
          revision: '65850a373e258f1c897a2b3d75eb74de',
        },
        { url: '/_next/static/media/layers-2x.9859cd12.png', revision: '9859cd12' },
        { url: '/_next/static/media/layers.ef6db872.png', revision: 'ef6db872' },
        { url: '/_next/static/media/marker-icon.d577052a.png', revision: 'd577052a' },
        { url: '/ab-capital-logo.png', revision: '94fd60228564dda32d4b7f8d71fe1632' },
        { url: '/demo/interior_1.png', revision: 'f74c99e8ee483439724e9498f738cc90' },
        { url: '/demo/interior_2.png', revision: 'ea1a6844b71054d923683f8b9efb92ef' },
        { url: '/manifest.json', revision: '951456c369be9665d1b811a693b69c36' },
        { url: '/property/bedroom.png', revision: '566263436eed9838178bf71230809210' },
        { url: '/property/exterior.png', revision: 'ecde144e5653d4c88ed80545d70d0c1a' },
        { url: '/property/kitchen.png', revision: 'b6d04b67eaac87873512ab041b40424a' },
        { url: '/property/living.png', revision: '9f079f4ad9c5664c19ea12484af14c72' },
        { url: '/swe-worker-5c72df51bb1f6ee0.js', revision: '76fdd3369f623a3edcf74ce2200bfdd0' },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && 'opaqueredirect' === e.type
                ? new Response(e.body, { status: 200, statusText: 'OK', headers: e.headers })
                : e,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: 'next-static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith('/api/auth/callback') || !s.startsWith('/api/')),
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        '1' === e.headers.get('RSC') &&
        '1' === e.headers.get('Next-Router-Prefetch') &&
        a &&
        !s.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages-rsc-prefetch',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        '1' === e.headers.get('RSC') && a && !s.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages-rsc',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET',
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0));
});
