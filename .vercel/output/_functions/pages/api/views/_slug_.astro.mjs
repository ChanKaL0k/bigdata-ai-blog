export { renderers } from '../../../renderers.mjs';

const prerender = false;
const counts = {};
async function GET({ params }) {
  const count = counts[params.slug] || 0;
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
async function POST({ params }) {
  counts[params.slug] = (counts[params.slug] || 0) + 1;
  return new Response(JSON.stringify({ count: counts[params.slug] }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
