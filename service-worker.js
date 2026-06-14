const CACHE_NAME = 'mestre-orc-pwa-v3-sprint45';
const CORE_ASSETS = [
  './',
  './index.html',
  './mobile.html',
  './marketplace.html',
  './dashboard-mestre.html',
  './campanhas-manager.html',
  './personagens-manager.html',
  './reservas.html',
  './foundry.html',
  './ia-mestre.html',
  './api-client.js',
  './ia-avancada.js',
  './ia-avancada.html',
  './biblioteca-premium.js',
  './biblioteca-premium.html',
  './oneshot.html',
  './gerador.html',
  './style.css',
  './script.js',
  './marketplace.js',
  './mobile-app.js',
  './phase2-data.js',
  './foundry-export.js',
  './mestre-orc.png'
  './financeiro.html',
  './pagamento-sucesso.html',
  './foundry-bridge.js',
  './payments.js',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).catch(() => null));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => caches.match('./mobile.html'))));
});
