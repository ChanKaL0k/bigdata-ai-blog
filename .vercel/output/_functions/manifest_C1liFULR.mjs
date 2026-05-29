import 'piccolore';
import { a7 as decodeKey } from './chunks/astro/server_D9IGIwMG.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BXiN5i9j.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/bigdata-ai-blog/","cacheDir":"file:///D:/bigdata-ai-blog/node_modules/.astro/","outDir":"file:///D:/bigdata-ai-blog/dist/","srcDir":"file:///D:/bigdata-ai-blog/src/","publicDir":"file:///D:/bigdata-ai-blog/public/","buildClientDir":"file:///D:/bigdata-ai-blog/dist/client/","buildServerDir":"file:///D:/bigdata-ai-blog/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CopjOQbj.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CopjOQbj.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"kb/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CopjOQbj.css"}],"routeData":{"route":"/kb","isIndex":true,"type":"page","pattern":"^\\/kb\\/?$","segments":[[{"content":"kb","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kb/index.astro","pathname":"/kb","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"roadmap/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CopjOQbj.css"}],"routeData":{"route":"/roadmap","isIndex":false,"type":"page","pattern":"^\\/roadmap\\/?$","segments":[[{"content":"roadmap","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/roadmap.astro","pathname":"/roadmap","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"search/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CopjOQbj.css"}],"routeData":{"route":"/search","isIndex":false,"type":"page","pattern":"^\\/search\\/?$","segments":[[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/search.astro","pathname":"/search","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.CopjOQbj.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/like","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/like\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"like","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/like.ts","pathname":"/api/like","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/ping","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/ping\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"ping","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/ping.ts","pathname":"/api/ping","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/views/[slug]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/views\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"views","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/api/views/[slug].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://bigdata-ai.blog","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/bigdata-ai-blog/src/pages/404.astro",{"propagation":"none","containsHead":true}],["D:/bigdata-ai-blog/src/pages/blog/[slug].astro",{"propagation":"in-tree","containsHead":true}],["D:/bigdata-ai-blog/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["D:/bigdata-ai-blog/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["D:/bigdata-ai-blog/src/pages/kb/[topic].astro",{"propagation":"in-tree","containsHead":true}],["D:/bigdata-ai-blog/src/pages/kb/[topic]/[slug].astro",{"propagation":"in-tree","containsHead":true}],["D:/bigdata-ai-blog/src/pages/kb/index.astro",{"propagation":"in-tree","containsHead":true}],["D:/bigdata-ai-blog/src/pages/roadmap.astro",{"propagation":"none","containsHead":true}],["D:/bigdata-ai-blog/src/pages/search.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/kb/[topic]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/kb/[topic]/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/kb/index@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/bigdata-ai-blog/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/search@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/api/like@_@ts":"pages/api/like.astro.mjs","\u0000@astro-page:src/pages/api/ping@_@ts":"pages/api/ping.astro.mjs","\u0000@astro-page:src/pages/api/views/[slug]@_@ts":"pages/api/views/_slug_.astro.mjs","\u0000@astro-page:src/pages/blog/[slug]@_@astro":"pages/blog/_slug_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/kb/[topic]/[slug]@_@astro":"pages/kb/_topic_/_slug_.astro.mjs","\u0000@astro-page:src/pages/kb/[topic]@_@astro":"pages/kb/_topic_.astro.mjs","\u0000@astro-page:src/pages/kb/index@_@astro":"pages/kb.astro.mjs","\u0000@astro-page:src/pages/roadmap@_@astro":"pages/roadmap.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/search@_@astro":"pages/search.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_C1liFULR.mjs","D:/bigdata-ai-blog/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DS1LIGV2.mjs","D:\\bigdata-ai-blog\\.astro\\content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","D:\\bigdata-ai-blog\\.astro\\content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_D7SCeT-V.mjs","D:/bigdata-ai-blog/src/components/ViewCounter":"_astro/ViewCounter.BMpVkHzL.js","D:/bigdata-ai-blog/src/components/Giscus":"_astro/Giscus.CEIo_VRd.js","D:/bigdata-ai-blog/src/components/LikeButton":"_astro/LikeButton.DNcemHWI.js","D:/bigdata-ai-blog/src/components/ThemeToggle":"_astro/ThemeToggle.BzMsm1u9.js","@astrojs/react/client.js":"_astro/client.CbHKJimV.js","D:/bigdata-ai-blog/src/pages/kb/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.ysx7nBKX.js","D:/bigdata-ai-blog/src/pages/search.astro?astro&type=script&index=0&lang.ts":"_astro/search.astro_astro_type_script_index_0_lang.CEvtwMTW.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["D:/bigdata-ai-blog/src/pages/kb/index.astro?astro&type=script&index=0&lang.ts","const n=document.getElementById(\"kb-search\"),c=document.getElementById(\"search-results\"),o=document.getElementById(\"topic-grid\"),i=document.querySelectorAll(\".kb-article\"),l=document.getElementById(\"no-match\");n.addEventListener(\"input\",()=>{const e=n.value.toLowerCase().trim();if(!e){c.classList.add(\"hidden\"),o.classList.remove(\"hidden\");return}c.classList.remove(\"hidden\"),o.classList.add(\"hidden\");let t=0;i.forEach(s=>{const d=(s.getAttribute(\"data-keywords\")||\"\").toLowerCase().includes(e);s.style.display=d?\"block\":\"none\",d&&t++}),l.classList.toggle(\"hidden\",t>0)});"],["D:/bigdata-ai-blog/src/pages/search.astro?astro&type=script&index=0&lang.ts","function o(){const t=document.getElementById(\"search-input\").value.toLowerCase().trim(),c=document.querySelectorAll(\".search-item\"),a=document.getElementById(\"no-results\");let s=0;c.forEach(e=>{const i=(e.getAttribute(\"data-title\")||\"\").toLowerCase(),d=(e.getAttribute(\"data-desc\")||\"\").toLowerCase(),l=(e.getAttribute(\"data-tags\")||\"\").toLowerCase(),n=!t||i.includes(t)||d.includes(t)||l.includes(t);e.style.display=n?\"block\":\"none\",n&&s++}),a.style.display=t&&s===0?\"block\":\"none\"}document.getElementById(\"search-input\").addEventListener(\"input\",o);o();"]],"assets":["/_astro/_slug_.CopjOQbj.css","/favicon.svg","/_astro/client.CbHKJimV.js","/_astro/Giscus.CEIo_VRd.js","/_astro/index.C5BVv2q5.js","/_astro/jsx-runtime.D_zvdyIk.js","/_astro/LikeButton.DNcemHWI.js","/_astro/ThemeToggle.BzMsm1u9.js","/_astro/ViewCounter.BMpVkHzL.js","/404.html","/blog/index.html","/kb/index.html","/roadmap/index.html","/rss.xml","/search/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"Ps6mEhnh4dCAQfwsxG1i0MFlvkCFPUP2HJAWnPU/sGg="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
