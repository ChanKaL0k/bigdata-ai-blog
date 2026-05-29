import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CH_0aQuG.mjs';
import { manifest } from './manifest_CTe-X9sF.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/like.astro.mjs');
const _page3 = () => import('./pages/api/ping.astro.mjs');
const _page4 = () => import('./pages/api/views/_slug_.astro.mjs');
const _page5 = () => import('./pages/blog/_slug_.astro.mjs');
const _page6 = () => import('./pages/blog.astro.mjs');
const _page7 = () => import('./pages/kb/_topic_/_slug_.astro.mjs');
const _page8 = () => import('./pages/kb/_topic_.astro.mjs');
const _page9 = () => import('./pages/kb.astro.mjs');
const _page10 = () => import('./pages/roadmap.astro.mjs');
const _page11 = () => import('./pages/rss.xml.astro.mjs');
const _page12 = () => import('./pages/search.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/like.ts", _page2],
    ["src/pages/api/ping.ts", _page3],
    ["src/pages/api/views/[slug].ts", _page4],
    ["src/pages/blog/[slug].astro", _page5],
    ["src/pages/blog/index.astro", _page6],
    ["src/pages/kb/[topic]/[slug].astro", _page7],
    ["src/pages/kb/[topic].astro", _page8],
    ["src/pages/kb/index.astro", _page9],
    ["src/pages/roadmap.astro", _page10],
    ["src/pages/rss.xml.ts", _page11],
    ["src/pages/search.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "0a98090b-9c33-4514-acf4-5e1d6956babf",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
