import { useEffect, useRef } from "react";

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || container.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "ChanKaL0k/bigdata-ai-blog");
    script.setAttribute("data-repo-id", "R_kgDOSqiQhA");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOSqiQhM4C-FXY");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    container.appendChild(script);
  }, []);

  return (
    <div className="mt-16 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
      <h2 className="text-xl font-bold mb-6">评论</h2>
      <div ref={ref} />
    </div>
  );
}
