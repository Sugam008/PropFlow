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
  self.define = (n, c) => {
    const i = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[i]) return;
    let t = {};
    const r = (e) => a(e, i),
      d = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(n.map((e) => d[e] || r(e))).then((e) => (c(...e), t));
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
          url: '/_next/static/ZxEAXn-HBYhSVywa7s56X/_buildManifest.js',
          revision: '1d2ff17878fc205a3672ce9d44487af7',
        },
        {
          url: '/_next/static/ZxEAXn-HBYhSVywa7s56X/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/10-4edfb34bcc08b352.js', revision: '4edfb34bcc08b352' },
        { url: '/_next/static/chunks/129-eb94284cc223dcf5.js', revision: 'eb94284cc223dcf5' },
        { url: '/_next/static/chunks/266.6a6eec9822cbe0b3.js', revision: '6a6eec9822cbe0b3' },
        { url: '/_next/static/chunks/327-be650ec36f9eb246.js', revision: 'be650ec36f9eb246' },
        { url: '/_next/static/chunks/479.e3ba7f0b0ed1b36b.js', revision: 'e3ba7f0b0ed1b36b' },
        { url: '/_next/static/chunks/5-c2cf92cee29489ea.js', revision: 'c2cf92cee29489ea' },
        { url: '/_next/static/chunks/568-5de2158fcdc1c0be.js', revision: '5de2158fcdc1c0be' },
        { url: '/_next/static/chunks/867-5069c3a56b7812b3.js', revision: '5069c3a56b7812b3' },
        { url: '/_next/static/chunks/885-f83343211f62e4a4.js', revision: 'f83343211f62e4a4' },
        { url: '/_next/static/chunks/893.95b1ae366a8864ba.js', revision: '95b1ae366a8864ba' },
        { url: '/_next/static/chunks/905-906e4538e1c55146.js', revision: '906e4538e1c55146' },
        {
          url: '/_next/static/chunks/app/%5Bid%5D/page-a97608d9ddedf120.js',
          revision: 'a97608d9ddedf120',
        },
        {
          url: '/_next/static/chunks/app/_global-error/page-b345dca5f541e688.js',
          revision: 'b345dca5f541e688',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-5d40e0e478a9c53e.js',
          revision: '5d40e0e478a9c53e',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-a6fd7ba709609e56.js',
          revision: 'a6fd7ba709609e56',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-b345dca5f541e688.js',
          revision: 'b345dca5f541e688',
        },
        {
          url: '/_next/static/chunks/app/completed/%5Bid%5D/page-0e107e0c0c8fc59b.js',
          revision: '0e107e0c0c8fc59b',
        },
        {
          url: '/_next/static/chunks/app/completed/page-c5bc9a99971cac38.js',
          revision: 'c5bc9a99971cac38',
        },
        {
          url: '/_next/static/chunks/app/layout-06d0de0b131a854e.js',
          revision: '06d0de0b131a854e',
        },
        {
          url: '/_next/static/chunks/app/login/page-3654783b046a6dc3.js',
          revision: '3654783b046a6dc3',
        },
        { url: '/_next/static/chunks/app/page-a2617c8cbb18e219.js', revision: 'a2617c8cbb18e219' },
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
        { url: '/_next/static/chunks/webpack-7c2ec17dae8e3016.js', revision: '7c2ec17dae8e3016' },
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
