const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function kv(path, method = "GET") {
  return fetch(`${KV_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
}

export default async function handler(req, res) {
  const { slug } = req.query;
  const method = req.method;

  if (!KV_URL || !KV_TOKEN) {
    res.status(200).json({ count: 0, error: "KV not configured" });
    return;
  }

  try {
    if (method === "GET") {
      const r = await kv(`/get/views:${slug}`);
      const data = await r.json();
      return res.status(200).json({ count: parseInt(data.result || "0", 10) || 0 });
    }

    if (method === "POST") {
      const r = await kv(`/incr/views:${slug}`, "POST");
      const data = await r.json();
      return res.status(200).json({ count: data.result });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
}
