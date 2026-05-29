import { kv } from "@vercel/kv";

const LIKE_KEY = "site-likes";

export const prerender = false;

export async function GET() {
  try {
    const count = (await kv.get<number>(LIKE_KEY)) || 0;
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST() {
  try {
    const count = await kv.incr(LIKE_KEY);
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to record like" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE() {
  try {
    const count = await kv.decr(LIKE_KEY);
    return new Response(JSON.stringify({ count: Math.max(0, count) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to unlike" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
