if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  });
}
