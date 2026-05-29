import type { ScenarioDef } from "../../data/spark-ui-lab/types";

interface Props {
  scenarios: ScenarioDef[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function ScenarioSelector({ scenarios, activeId, onChange }: Props) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{
        fontSize: "12px",
        color: "var(--color-text-secondary)",
        marginBottom: "8px",
        fontWeight: 600,
      }}>
        选择故障场景
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {scenarios.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className="cursor-pointer"
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: isActive ? "2px solid var(--spark-accent)" : "1px solid var(--color-border)",
                background: isActive ? "#e8f4fd" : "var(--color-bg)",
                textAlign: "left",
                transition: "all 0.15s",
                minWidth: "180px",
                flex: "1 1 180px",
                maxWidth: "320px",
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{
                fontSize: "14px",
                fontWeight: 700,
                color: isActive ? "var(--spark-accent)" : "var(--color-text)",
              }}>
                {s.nameZh}
              </div>
              <div style={{
                fontSize: "11px",
                color: "var(--color-text-secondary)",
                marginTop: "2px",
              }}>
                {s.nameEn}
              </div>
              <div style={{
                fontSize: "11px",
                color: "var(--color-text-secondary)",
                marginTop: "6px",
                lineHeight: "1.5",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {s.description}
              </div>
              <div style={{ display: "flex", gap: "4px", marginTop: "6px", flexWrap: "wrap" }}>
                {s.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: "10px",
                    padding: "1px 6px",
                    borderRadius: "10px",
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
