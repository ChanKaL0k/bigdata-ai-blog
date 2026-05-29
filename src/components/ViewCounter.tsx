import { useCallback, useEffect, useState } from "react";

interface Props {
  slug: string;
}

export default function ViewCounter({ slug }: Props) {
  const [count, setCount] = useState<number | null | undefined>(undefined);

  const recordView = useCallback(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    fetch(`/api/views/${slug}`, {
      method: "POST",
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => setCount(null))
      .finally(() => clearTimeout(timer));
  }, [slug]);

  useEffect(() => {
    recordView();
  }, [recordView]);

  // Loading — show placeholder
  if (count === undefined) {
    return (
      <span className="text-sm opacity-50" style={{ color: "var(--color-text-secondary)" }}>
        ··· 次阅读
      </span>
    );
  }

  // API failed — show retry
  if (count === null) {
    return (
      <button
        onClick={recordView}
        className="text-sm underline cursor-pointer"
        style={{ color: "var(--color-text-secondary)" }}
      >
        获取阅读量
      </button>
    );
  }

  return (
    <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
      {count} 次阅读
    </span>
  );
}
