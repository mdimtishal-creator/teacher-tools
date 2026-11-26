self.addEventListener('fetch', function(event) {
  // Ye Chrome ko batata hai ki hum network requests handle kar sakte hain
  // Abhi ke liye hum bas requests ko normal jaane de rahe hain
  event.respondWith(fetch(event.request).catch(function() {
    return caches.match(event.request);
  }));
});
