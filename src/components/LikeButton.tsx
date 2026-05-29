import { useEffect, useState } from "react";

const STORAGE_KEY = "blog-liked";

export default function LikeButton() {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(STORAGE_KEY) === "true");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    fetch("/api/like", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => setCount((c) => (c === null ? 0 : c)))
      .finally(() => clearTimeout(timer));
  }, []);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);

    const wasLiked = liked;

    if (wasLiked) {
      setLiked(false);
      localStorage.removeItem(STORAGE_KEY);
      setCount((c) => Math.max(0, c - 1));
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);
        const res = await fetch("/api/like", {
          method: "DELETE",
          signal: controller.signal,
        });
        const data = await res.json();
        if (data.count !== undefined) setCount(data.count);
        clearTimeout(timer);
      } catch {}
    } else {
      setLiked(true);
      localStorage.setItem(STORAGE_KEY, "true");
      setCount((c) => c + 1);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);
        const res = await fetch("/api/like", {
          method: "POST",
          signal: controller.signal,
        });
        const data = await res.json();
        if (data.count !== undefined) setCount(data.count);
        clearTimeout(timer);
      } catch {}
    }

    setBusy(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
        liked
          ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/15 hover:border-yellow-400"
          : "hover:border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/10"
      } cursor-pointer`}
      style={{
        color: liked ? "#b45309" : "var(--color-text-secondary)",
      }}
    >
      <svg
        className={`w-5 h-5 transition-colors ${liked ? "text-yellow-500" : ""}`}
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={liked ? 0 : 1.5}
      >
        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
      <span>{liked ? "已点赞" : "觉得有用？点个赞支持一下吧~"}</span>
      <span
        className="ml-1 text-xs px-1.5 py-0.5 rounded-full transition-colors"
        style={{
          backgroundColor: liked ? "#f59e0b" : "var(--color-bg)",
          color: liked ? "white" : "var(--color-text-secondary)",
          border: liked ? "none" : "1px solid var(--color-border)",
        }}
      >
        {count === null ? "···" : count}
      </span>
    </button>
  );
}
