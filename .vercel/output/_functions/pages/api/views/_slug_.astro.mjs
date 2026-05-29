import { kv } from '@vercel/kv';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
async function GET({ params }) {
  try {
    const count = await kv.get(`views:${params.slug}`) || 0;
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
async function POST({ params }) {
  try {
    const count = await kv.incr(`views:${params.slug}`);
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to record view" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
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
