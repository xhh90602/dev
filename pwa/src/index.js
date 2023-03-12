console.log('hello pwa111', 'serviceWorker' in navigator);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js') // 注册 Service Worker
      .then((reg) => console.log('service worker registered:', reg))
      .catch((err) => console.log('service worker not registered', err));
  });
}
