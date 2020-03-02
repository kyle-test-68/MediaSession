importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([{"revision":"842277f7af0a1152a81d88708e7edd78","url":"css/materialize.css"},{"revision":"f288d8c8c9ea9f4d0bb6f8f81c8ff7da","url":"css/materialize.min.css"},{"revision":"220afd743d9e9643852e31a135a9f3ae","url":"js/jquery-3.4.1.min.js"},{"revision":"9832259e6e013b2e55f342c053c26104","url":"js/materialize.js"},{"revision":"5dcfc8944ed380b2215dc28b3f13835f","url":"js/materialize.min.js"}]);

  const articleHandler = new workbox.strategies.NetworkFirst({
    cacheName: 'cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
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

  workbox.routing.registerRoute('/music/symphony.mp3', args => {
    return articleHandler.handle(args).then(response => {
      if (!response) {
        return caches.match('pages/offline.html');
      } else if (response.status === 404) {
        return caches.match('pages/404.html');
      }
      return response;
    });;
  });

  workbox.routing.registerRoute('/', args => {
    return articleHandler.handle(args).then(response => {
      if (!response) {
        return caches.match('pages/offline.html');
      } else if (response.status === 404) {
        return caches.match('pages/404.html');
      }
      return response;
    });;
  });


} else {
  console.log(`Boo! Workbox didn't load 😬`);
}