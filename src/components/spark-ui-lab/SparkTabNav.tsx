const TABS = [
  { id: "jobs", label: "Jobs" },
  { id: "stages", label: "Stages" },
  { id: "storage", label: "Storage" },
  { id: "environment", label: "Environment" },
  { id: "executors", label: "Executors" },
  { id: "sql", label: "SQL" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function SparkTabNav({ activeTab, onTabChange }: Props) {
  return (
    <div style={{
      display: "flex",
      background: "var(--spark-tab-inactive-bg)",
      borderBottom: "2px solid var(--spark-accent)",
    }}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: activeTab === tab.id ? 600 : 400,
            border: "none",
            borderBottom: activeTab === tab.id ? "3px solid var(--spark-accent)" : "3px solid transparent",
            background: activeTab === tab.id ? "var(--spark-tab-active-bg)" : "transparent",
            color: activeTab === tab.id ? "var(--spark-table-text)" : "var(--spark-tab-inactive-text)",
            cursor: "pointer",
            marginBottom: "-2px",
            transition: "all 0.15s",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
