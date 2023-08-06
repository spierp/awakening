const VIDEO_CACHE = 'video-cache-v1';
const videoFiles = [
    'static/video/scene_1.mov',
    'static/video/scene_2.mov',
    'static/video/scene_3.mov',
];

self.addEventListener('install', function(event) {
  // Precache all video files
  event.waitUntil(
    caches.open(VIDEO_CACHE)
      .then(function(cache) {
        return cache.addAll(videoFiles);
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return the response from the cached version
          if (response) {
            return response;
          }
  
          // Not in cache - return the result of a call to fetch
          return fetch(event.request);
        }
      )
    );
  });