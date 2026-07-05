/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<import('workbox-precaching').PrecacheEntry | string>
}
