const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KEY = "site-likes";

async function kv(path, method = "GET") {
  return fetch(`${KV_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
}

async function getCount() {
  try {
    const res = await kv(`/get/${KEY}`);
    const data = await res.json();
    return parseInt(data.result || "0", 10) || 0;
  } catch {
    return 0;
  }
}

export default async function handler(req, res) {
  const method = req.method;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({ count: 0, error: "KV not configured" });
  }

  try {
    if (method === "GET") {
      const count = await getCount();
      return res.status(200).json({ count });
    }

    if (method === "POST") {
      const r = await kv(`/incr/${KEY}`, "POST");
      const data = await r.json();
      return res.status(200).json({ count: data.result });
    }

    if (method === "DELETE") {
      const current = await getCount();
      if (current <= 0) {
        return res.status(200).json({ count: 0 });
      }
      const r = await kv(`/decr/${KEY}`, "POST");
      const data = await r.json();
      return res.status(200).json({ count: Math.max(0, data.result) });
    }

    // Temporary: reset negative counts
    if (method === "PATCH") {
      // Force set to 1 via incr from negative
      const current = await getCount();
      if (current < 0) {
        // incr -(-current) + 1 times to get to 0, then set by absolute logic
        for (let i = 0; i < Math.abs(current); i++) {
          await kv(`/incr/${KEY}`, "POST");
        }
      }
      const fixed = await getCount();
      return res.status(200).json({ count: fixed });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
}
