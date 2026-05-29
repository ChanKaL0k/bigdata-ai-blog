const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function kv(path) {
  return fetch(`${KV_URL}${path}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
}

export async function GET(request, { params }) {
  if (!KV_URL || !KV_TOKEN) {
    return Response.json({ count: 0, error: "KV not configured" });
  }
  try {
    const res = await kv(`/get/views:${params.slug}`);
    const data = await res.json();
    return Response.json({ count: parseInt(data.result || "0", 10) || 0 });
  } catch {
    return Response.json({ count: 0 });
  }
}

export async function POST(request, { params }) {
  if (!KV_URL || !KV_TOKEN) {
    return Response.json({ error: "KV not configured" }, { status: 500 });
  }
  try {
    const res = await kv(`/incr/views:${params.slug}`);
    const data = await res.json();
    return Response.json({ count: data.result });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
