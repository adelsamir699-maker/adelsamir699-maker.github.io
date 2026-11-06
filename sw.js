/* sw.js — Service Worker بسيط جدًا، غرضه الوحيد تمكين تثبيت التطبيق (PWA).
 *
 * مهم جدًا: مفيش أي كاش للبيانات هنا.
 * كل الطلبات بتتمرّر للشبكة مباشرة (network-only passthrough)،
 * عشان ميأثرش على سياسة "no-cache" الموجودة في index.html
 * ولا يخزّن أي بيانات مستخدم على الجهاز بشكل قديم.
 *
 * لو حصلت أي مشكلة في الـ fetch بنرجّع الخطأ زي ما هو (من غير intercept صامت).
 */
"use strict";

const SW_VERSION = "300";

self.addEventListener("install", (event) => {
  // من غير انتظار: فعّل النسخة الجديدة فورًا
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // امسح أي كاش قديم لو موجود (احتياطي) وخذ التحكم في كل التابات
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (e) { /* تجاهل */ }
      await self.clients.claim();
      /* 📲 بناء 297: الإشارة للنوافذ الحيّة — الـPWA المفتوح من الهوم اسكرين ممكن
         يقعد أيام بكود قديم بلا ريلود (بلاغ المالك 5/11). الصفحة (297+) بتقرر هي:
         مافيش فاتورة منفتحة ⇒ ريلود شفاف؛ فيه شغل ⇒ توست ودّي. الإشارة مجرد
         فأنا مقترح، صفر تجبر وسط فاتورة شغّالة. */
      try {
        const cs = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
        cs.forEach((c) => { try { c.postMessage({ type: "MIZAN_SW_UPDATED", version: SW_VERSION }); } catch (e) { } });
      } catch (e) { /* تجاهل */ }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  /* 📲 بناء 292: مكتبات الـPDF الثابتة (vendor/ — جافاسكربت رخص MIT، ليست بيانات مستخدم)
     بيتحفظ كاش-أول — عشان إقلاع أوفلاين بالـPWA ما يسّبش «ملفات PDF مش محمّلة»
     (بلاغ المالك الحرفي: «الpdf مش بيتخلق»). باقي الطلبات كلّها network-only بالحرف —
     مافيش أي كاش لبيانات المستخدم زي ما هو. */
  const u = new URL(event.request.url);
  if (event.request.method === "GET" && u.origin === self.location.origin &&
    u.pathname.indexOf("/vendor/") === 0) {
    event.respondWith(
      (async () => {
        try {
          const c = await caches.open("mizan-vendor-" + SW_VERSION);
          const hit = await c.match(u.pathname);
          if (hit) return hit;
          const r = await fetch(event.request);
          if (r && r.ok) { try { await c.put(u.pathname, r.clone()); } catch (e) { } }
          return r;
        } catch (e) {
          try { return fetch(event.request); } catch (e2) { return Response.error(); }
        }
      })()
    );
    return;
  }
  // network-only: مرّر الطلب للشبكة من غير كاش.
  // ده بيحقّق شرط "service worker له fetch handler" المطلوب للتثبيت،
  // ومن غير ما يغيّر سلوك التحميل/الكاش الحالي للتطبيق.
  event.respondWith(fetch(event.request));
});
