import type { SparkConfigEntry, AnnotationDef } from "../../data/spark-ui-lab";
import SparkDataTable from "./SparkDataTable";
import type { ColumnDef } from "./SparkDataTable";

interface Props {
  config: SparkConfigEntry[];
  annotations: AnnotationDef[];
  showAnnotations: boolean;
}

const columns: ColumnDef<SparkConfigEntry>[] = [
  {
    key: "key",
    header: "Property",
    render: (row) => (
      <code style={{ fontSize: "11px", fontFamily: "var(--spark-font-mono)" }}>{row.key}</code>
    ),
  },
  {
    key: "value",
    header: "Value",
    render: (row) => (
      <code style={{ fontSize: "11px", fontFamily: "var(--spark-font-mono)" }}>{row.value}</code>
    ),
  },
];

export default function SparkEnvironmentTab({ config, annotations, showAnnotations }: Props) {
  // Find annotations that reference environment keys
  const envAnnotations = showAnnotations
    ? annotations.filter((a) => a.targetType === "sql-node" && (a.targetId.startsWith("env-") || a.position === "bottom"))
    : [];

  return (
    <div>
      <SparkDataTable
        columns={columns}
        rows={config}
        rowKey={(row) => `env-${row.key}`}
        annotations={[]}
        showAnnotations={false}
        emptyMessage="No configuration properties found."
      />
      {envAnnotations.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          {envAnnotations.map((ann) => (
            <SparkEnvAnnotation key={ann.id} annotation={ann} config={config} />
          ))}
        </div>
      )}
    </div>
  );
}

function SparkEnvAnnotation({ annotation, config }: { annotation: AnnotationDef; config: SparkConfigEntry[] }) {
  const targetKey = annotation.targetId.replace("env-", "").replace(/-/g, ".");
  const entry = config.find((c) => c.key.toLowerCase().includes(targetKey.toLowerCase()));

  return (
    <div className={`spark-annotation-callout ${annotation.severity} spark-annotation-fade`} style={{ marginTop: "8px" }}>
      <div className="ann-title">
        {annotation.severity === "critical" && "🔴 "}
        {annotation.severity === "warning" && "🟡 "}
        {annotation.severity === "info" && "🔵 "}
        {annotation.title}
        {entry && (
          <span style={{ marginLeft: "8px", fontWeight: 400, fontSize: "11px", color: "var(--spark-metric-label)" }}>
            (当前值: <code>{entry.value}</code>)
          </span>
        )}
      </div>
      <div className="ann-body" dangerouslySetInnerHTML={{ __html: annotation.body }} />
    </div>
  );
}
