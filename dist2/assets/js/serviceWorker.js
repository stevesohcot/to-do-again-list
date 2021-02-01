const toDoAgainList = "to-do-again-list-v1"
const assets = [
  "/",
  "https://stevesohcot.github.io/to-do-again-list/dist2/index.html",
  "https://stevesohcot.github.io/to-do-again-list/dist2/css/style.css",
  "https://stevesohcot.github.io/to-do-again-list/dist2/css/bootstrap.min.css",
  "https://stevesohcot.github.io/to-do-again-list/dist2/css/fontawesome.min.css",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/js/app.js",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/js/bootstrap.min.js",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/js/indexeddb.js",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/js/jquery-3.4.1.min.js",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/js/popper.min.js",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/webfonts/fa-regular-400.woff",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/webfonts/fa-regular-400.woff2",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/webfonts/fa-solid-900.woff",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/webfonts/fa-solid-900.woff2",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/images/icons/icon-32x32.png",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/images/icons/icon-48x48.png",
  "https://stevesohcot.github.io/to-do-again-list/dist2/assets/images/to-do-again-list-screenshot.png",
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