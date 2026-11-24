const V='hub-v5';
const FILES=['./','index.html','tools.json','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
const u=new URL(e.request.url);
if(e.request.method!=='GET'||u.origin!==location.origin)return;
if(u.pathname.endsWith('tools.json')){
e.respondWith(fetch(e.request).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put('tools.json',c));return n}).catch(()=>caches.match('tools.json')));return}
e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{
const net=fetch(e.request).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(e.request,c));return n}).catch(()=>r||caches.match('index.html'));
return r||net}))});
