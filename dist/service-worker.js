"use strict";
// File: service-worker.ts
const urlsToCache = [
    "/",
    "./index.html",
    "./assets/schweiz.png",
    "./manifest.json",
    "./dist/main.js",
    "./dist/i-todo.js",
    "./dist/todo.js",
    "./dist/service.js",
];
self.addEventListener("install", (event) => {
    const swEvent = event;
    swEvent.waitUntil(caches.open("pwa-assets").then((cache) => {
        return cache.addAll(urlsToCache);
    }));
});
self.addEventListener("fetch", (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        return response || fetch(event.request);
    }));
});
