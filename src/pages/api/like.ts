export const prerender = false;

// In-memory count (resets on cold start; will restore KV after verifying function works)
let count = 0;

export async function GET() {
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST() {
  count += 1;
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE() {
  count = Math.max(0, count - 1);
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
