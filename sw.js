importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // workbox.routing.registerRoute(
  //   '/music/symphony.mp3',
  //   new workbox.strategies.NetworkFirst()
  // );

  // workbox.routing.registerRoute(
  //   new RegExp('/index.html'),
  //   new workbox.strategies.NetworkFirst()
  // );

  const articleHandler = new workbox.strategies.NetworkFirst({
    cacheName: 'cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      })
    ]
  });
  
  workbox.routing.registerRoute('/pages/list.html', args => {
    return articleHandler.handle(args).then(response => {
      if (!response) {
        return caches.match('pages/offline.html');
      } else if (response.status === 404) {
        return caches.match('pages/404.html');
      }
      return response;
    });;
  });

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}