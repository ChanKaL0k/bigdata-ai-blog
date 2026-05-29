import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export default function ViewCounter({ slug }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    // Increment view count on load
    fetch(`/api/views/${slug}`, {
      method: "POST",
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => setCount(null))
      .finally(() => clearTimeout(timer));
  }, [slug]);

  if (count === null) return null;

  return (
    <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
      {count} 次阅读
    </span>
  );
}
