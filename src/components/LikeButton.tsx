import { useEffect, useState } from "react";

const NAMESPACE = "bigdata-ai-blog";
const KEY = "homepage-likes";
const STORAGE_KEY = "blog-liked";

export default function LikeButton() {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const alreadyLiked = localStorage.getItem(STORAGE_KEY) === "true";
    setLiked(alreadyLiked);

    fetch(`https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`)
      .then((r) => r.json())
      .then((data) => {
        setCount(data.value || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLike = async () => {
    if (liked) return;

    try {
      const res = await fetch(
        `https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`
      );
      const data = await res.json();
      setCount(data.value);
      setLiked(true);
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // If API fails, still show as liked to prevent spam
      setLiked(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
        liked
          ? "opacity-70 cursor-default"
          : "hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 cursor-pointer"
      }`}
      style={{
        borderColor: liked ? "var(--color-border)" : "var(--color-border)",
        color: liked ? "var(--color-text-secondary)" : "var(--color-text)",
      }}
      title={liked ? "已点赞" : "点个赞吧"}
    >
      <svg
        className={`w-5 h-5 ${liked ? "text-yellow-500" : ""}`}
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={liked ? 0 : 1.5}
      >
        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
      <span>{liked ? "已点赞" : "觉得有用？点个赞支持一下吧~"}</span>
      <span
        className="ml-1 text-xs px-1.5 py-0.5 rounded-full"
        style={{
          backgroundColor: liked ? "var(--color-accent)" : "var(--color-bg)",
          color: liked ? "white" : "var(--color-text-secondary)",
          border: liked ? "none" : "1px solid var(--color-border)",
        }}
      >
        {count}
      </span>
    </button>
  );
}
