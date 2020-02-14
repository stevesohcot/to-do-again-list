const toDoAgainList = "to-do-again-list-v1"
const assets = [
  "/",
  "/index.html",
  "/css/bootstrap.min.css",
  "/assets/js/app.js",
  "/assets/js/indexeddb.js",
  "/assets/js/jquery-3.4.1.slim.min.js",
  "/assets/js/popper.min.js",
  "/assets/js/bootstrap.min.js"
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