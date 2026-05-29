import type { SparkExecutor, AnnotationDef } from "../../data/spark-ui-lab";
import SparkDataTable from "./SparkDataTable";
import type { ColumnDef } from "./SparkDataTable";

interface Props {
  executors: SparkExecutor[];
  annotations: AnnotationDef[];
  showAnnotations: boolean;
}

const columns: ColumnDef<SparkExecutor>[] = [
  { key: "id", header: "Executor ID" },
  { key: "address", header: "Address" },
  {
    key: "status",
    header: "Status",
    render: (row) => {
      const cls = row.status === "FAILED" || row.status === "DEAD" ? "status-failed" : "status-success";
      return <span className={cls}>{row.status}</span>;
    },
  },
  { key: "cores", header: "Cores" },
  {
    key: "memoryUsed",
    header: "Memory (Used / Total)",
    render: (row) => {
      const used = parseFloat(row.memoryUsed);
      const total = parseFloat(row.memory);
      const pct = Math.round((used / total) * 100);
      const isHigh = pct > 90;
      return (
        <span style={{ color: isHigh ? "var(--spark-status-failed)" : undefined, fontWeight: isHigh ? 600 : undefined }}>
          {row.memoryUsed} / {row.memory} ({pct}%)
        </span>
      );
    },
  },
  { key: "taskActive", header: "Active Tasks" },
  { key: "taskCompleted", header: "Completed Tasks" },
  {
    key: "taskFailed",
    header: "Failed Tasks",
    render: (row) => <span style={{ color: row.taskFailed > 0 ? "var(--spark-status-failed)" : undefined, fontWeight: row.taskFailed > 0 ? 600 : undefined }}>{row.taskFailed}</span>,
  },
  { key: "gcTime", header: "GC Time" },
  { key: "shuffleRead", header: "Shuffle Read" },
  { key: "shuffleWrite", header: "Shuffle Write" },
];

export default function SparkExecutorsTab({ executors, annotations, showAnnotations }: Props) {
  return (
    <SparkDataTable
      columns={columns}
      rows={executors}
      rowKey={(row) => `executor-${row.id}`}
      annotations={annotations}
      showAnnotations={showAnnotations}
      annotationTargetType="executor-row"
      emptyMessage="No executors registered."
    />
  );
}
