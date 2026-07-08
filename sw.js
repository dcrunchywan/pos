const CACHE='dcpos-patch001';
const CORE=['./','./index.html','./manifest.json'];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
 self.skipWaiting();
});

self.addEventListener('activate',e=>{
 e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET') return;
 e.respondWith(
   caches.match(e.request).then(cached=>{
     return cached || fetch(e.request).then(r=>{
       if(r.ok){
         const copy=r.clone();
         caches.open(CACHE).then(c=>c.put(e.request,copy));
       }
       return r;
     }).catch(()=>caches.match('./index.html'));
   })
 );
});
