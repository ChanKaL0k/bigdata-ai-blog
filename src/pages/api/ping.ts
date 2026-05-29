export const prerender = false;

export async function GET() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const hasUrl = !!url;
  const hasToken = !!token;

  let kvWorks = false;
  if (hasUrl && hasToken) {
    try {
      const res = await fetch(`${url}/ping`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      kvWorks = res.ok;
    } catch {}
  }

  return Response.json({ ok: true, kv: { hasUrl, hasToken, kvWorks } });
}
