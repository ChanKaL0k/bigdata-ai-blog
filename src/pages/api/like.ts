export const prerender = false;

const KEY = "site-likes";

function buildUrl(path: string) {
  return `${process.env.KV_REST_API_URL}${path}`;
}

function headers() {
  return { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` };
}

export async function GET() {
  try {
    const res = await fetch(buildUrl(`/get/${KEY}`), { headers: headers() });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = (await res.json()) as { result: string };
    return Response.json({ count: parseInt(data.result || "0", 10) || 0 });
  } catch {
    return Response.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const res = await fetch(buildUrl(`/incr/${KEY}`), { method: "POST", headers: headers() });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = (await res.json()) as { result: number };
    return Response.json({ count: data.result });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const res = await fetch(buildUrl(`/decr/${KEY}`), { method: "POST", headers: headers() });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = (await res.json()) as { result: number };
    return Response.json({ count: Math.max(0, data.result) });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
