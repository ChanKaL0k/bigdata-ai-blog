export const prerender = false;

const counts: Record<string, number> = {};

export async function GET({ params }: { params: { slug: string } }) {
  const count = counts[params.slug] || 0;
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ params }: { params: { slug: string } }) {
  counts[params.slug] = (counts[params.slug] || 0) + 1;
  return new Response(JSON.stringify({ count: counts[params.slug] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
