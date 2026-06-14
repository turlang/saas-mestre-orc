if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      console.info('Service Worker não registrado neste ambiente local. Hospede com HTTPS para ativar o PWA.');
    });
  });
}
