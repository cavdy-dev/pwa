if ('serviceWorker' in navigator) {
  (async function() {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered successfully');
    } catch (err) {
      console.log('Service worker not registered');
    }
  })();
}
