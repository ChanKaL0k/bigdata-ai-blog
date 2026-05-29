import type { SparkSummary } from "../../data/spark-ui-lab/types";

interface Props {
  summary: SparkSummary;
}

export default function SparkSummaryMetrics({ summary }: Props) {
  const metrics = [
    { label: "Uptime", value: summary.appUptime },
    { label: "Completed Jobs", value: String(summary.completedJobs) },
    { label: "Failed Jobs", value: String(summary.failedJobs), alert: summary.failedJobs > 0 },
    { label: "Completed Stages", value: String(summary.completedStages) },
    { label: "Active Batches", value: String(summary.activeBatches) },
    { label: "Total Tasks", value: String(summary.totalTasks) },
    { label: "Memory Used", value: summary.usedMemory, unit: summary.totalMemory, alert: parseFloat(summary.usedMemory) / parseFloat(summary.totalMemory) > 0.9 },
  ];

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "18px",
      padding: "12px 20px",
      background: "var(--spark-bg)",
      borderBottom: "1px solid var(--spark-table-border)",
    }}>
      {metrics.map((m) => (
        <div key={m.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "var(--spark-metric-label)", marginBottom: "2px" }}>{m.label}</div>
          <div style={{
            fontSize: "18px",
            fontWeight: 700,
            color: m.alert ? "var(--spark-status-failed)" : "var(--spark-metric-value)",
          }}>
            {m.value}
          </div>
          {m.unit && (
            <div style={{ fontSize: "10px", color: "var(--spark-metric-label)" }}>/ {m.unit}</div>
          )}
        </div>
      ))}
    </div>
  );
}
