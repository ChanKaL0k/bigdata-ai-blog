export const prerender = false;

function buildUrl(path: string) {
  return `${process.env.KV_REST_API_URL}${path}`;
}

function headers() {
  return { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` };
}

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const res = await fetch(buildUrl(`/get/views:${params.slug}`), { headers: headers() });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = (await res.json()) as { result: string };
    return Response.json({ count: parseInt(data.result || "0", 10) || 0 });
  } catch {
    return Response.json({ count: 0 });
  }
}

export async function POST({ params }: { params: { slug: string } }) {
  try {
    const res = await fetch(buildUrl(`/incr/views:${params.slug}`), {
      method: "POST",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`KV status ${res.status}`);
    const data = (await res.json()) as { result: number };
    return Response.json({ count: data.result });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
