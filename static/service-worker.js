const VIDEO_CACHE = 'video-cache-v1';
const AUDIO_CACHE = 'audio-cache-v1';
const VOICEOVER_CACHE = 'voiceover-cache-v1';

const videoFiles = [
    '/static/video/scene_1.mov',
    '/static/video/scene_2.mov',
    '/static/video/scene_3.mov',
    '/static/video/scene_4.mov',
    '/static/video/scene_5.mov',
    '/static/video/scene_6.mov',
    '/static/video/scene_7.mov',
];

const audioFiles = [
  '/static/audio/crickets.mp3',
  // ... other audio files
];

const voiceoverFiles = [
  '/static/voiceover/scene_2.mp3',
  // ... other voiceover files
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    Promise.all([
      caches.open(VIDEO_CACHE).then(function(cache) {
        return cache.addAll(videoFiles);
      }),
      caches.open(AUDIO_CACHE).then(function(cache) {
        return cache.addAll(audioFiles);
      }),
      caches.open(VOICEOVER_CACHE).then(function(cache) {
        return cache.addAll(voiceoverFiles);
      }),
    ])
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
      })
  );
});