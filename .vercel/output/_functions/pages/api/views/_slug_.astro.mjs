export { renderers } from '../../../renderers.mjs';

const prerender = false;
function buildUrl(path) {
  return `${process.env.KV_REST_API_URL}${path}`;
}
function headers() {
  return { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` };
}
async function GET({ params }) {
  try {
    const res = await fetch(buildUrl(`/get/views:${params.slug}`), { headers: headers() });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = await res.json();
    return Response.json({ count: parseInt(data.result || "0", 10) || 0 });
  } catch {
    return Response.json({ count: 0 });
  }
}
async function POST({ params }) {
  try {
    const res = await fetch(buildUrl(`/incr/views:${params.slug}`), {
      method: "POST",
      headers: headers()
    });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = await res.json();
    return Response.json({ count: data.result });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
