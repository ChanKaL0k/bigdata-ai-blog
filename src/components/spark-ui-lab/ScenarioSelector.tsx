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
        color: "#6c757d",
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
                border: isActive ? "2px solid #2490eb" : "1px solid #dee2e6",
                background: isActive ? "#e8f4fd" : "#ffffff",
                textAlign: "left" as const,
                transition: "all 0.15s",
                minWidth: "180px",
                flex: "1 1 180px",
                maxWidth: "320px",
                boxShadow: isActive ? "0 2px 8px rgba(36,144,235,0.15)" : "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{
                fontSize: "14px",
                fontWeight: 700,
                color: isActive ? "#1a7ad9" : "#212529",
              }}>
                {s.nameZh}
              </div>
              <div style={{
                fontSize: "11px",
                color: "#6c757d",
                marginTop: "2px",
              }}>
                {s.nameEn}
              </div>
              <div style={{
                fontSize: "11px",
                color: "#6c757d",
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
                    background: "#f1f3f5",
                    color: "#495057",
                    border: "1px solid #dee2e6",
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
