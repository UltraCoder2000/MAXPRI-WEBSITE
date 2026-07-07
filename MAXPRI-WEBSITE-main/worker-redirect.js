addEventListener('fetch', event => {
  try {
    const url = new URL(event.request.url);
    if (url.hostname && url.hostname.includes('workers.dev')) {
      return event.respondWith(Response.redirect('https://maxpritech.com', 301));
    }
  } catch (e) {
    // if parsing fails, fall through to fetch
  }
  return event.respondWith(fetch(event.request));
});
