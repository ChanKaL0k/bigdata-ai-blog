import { kv } from "@vercel/kv";

export const prerender = false;

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const count = (await kv.get<number>(`views:${params.slug}`)) || 0;
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

export async function POST({ params }: { params: { slug: string } }) {
  try {
    const count = await kv.incr(`views:${params.slug}`);
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to record view" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
