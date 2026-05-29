export { renderers } from '../../renderers.mjs';

const prerender = false;
const KEY = "site-likes";
function buildUrl(path) {
  return `${process.env.KV_REST_API_URL}${path}`;
}
function headers() {
  return { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` };
}
async function GET() {
  try {
    const res = await fetch(buildUrl(`/get/${KEY}`), { headers: headers() });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = await res.json();
    return Response.json({ count: parseInt(data.result || "0", 10) || 0 });
  } catch {
    return Response.json({ count: 0 });
  }
}
async function POST() {
  try {
    const res = await fetch(buildUrl(`/incr/${KEY}`), { method: "POST", headers: headers() });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = await res.json();
    return Response.json({ count: data.result });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
async function DELETE() {
  try {
    const res = await fetch(buildUrl(`/decr/${KEY}`), { method: "POST", headers: headers() });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = await res.json();
    return Response.json({ count: Math.max(0, data.result) });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
