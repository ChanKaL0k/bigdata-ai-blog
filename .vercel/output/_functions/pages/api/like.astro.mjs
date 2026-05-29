import { kv } from '@vercel/kv';
export { renderers } from '../../renderers.mjs';

const LIKE_KEY = "site-likes";
const prerender = false;
async function GET() {
  try {
    const count = await kv.get(LIKE_KEY) || 0;
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function POST() {
  try {
    const count = await kv.incr(LIKE_KEY);
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to record like" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function DELETE() {
  try {
    const count = await kv.decr(LIKE_KEY);
    return new Response(JSON.stringify({ count: Math.max(0, count) }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to unlike" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
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
