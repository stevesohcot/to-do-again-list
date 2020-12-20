const toDoAgainList = "to-do-again-list-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/css/bootstrap.min.css",
  "/css/fontawesome.min.css",
  "/assets/js/app.js",
  "/assets/js/bootstrap.min.js",
  "/assets/js/indexeddb.js",
  "/assets/js/jquery-3.4.1.min.js",
  "/assets/js/popper.min.js",
  "/assets/webfonts/fa-regular-400.woff",
  "/assets/webfonts/fa-regular-400.woff2",
  "/assets/webfonts/fa-solid-900.woff",
  "/assets/webfonts/fa-solid-900.woff2",
  "/assets/images/icons/icon-32x32.png",
  "/assets/images/icons/icon-48x48.png",
  "/assets/images/to-do-again-list-screenshot.png",
  "https://fonts.googleapis.com/css?family=Raleway:300,400,700&display=swap"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(toDoAgainList).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})