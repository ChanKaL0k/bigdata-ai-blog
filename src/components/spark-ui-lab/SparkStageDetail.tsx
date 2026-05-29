import type { SparkStage, SparkTaskDetail, AnnotationDef } from "../../data/spark-ui-lab";
import SparkDataTable from "./SparkDataTable";
import type { ColumnDef } from "./SparkDataTable";

interface Props {
  stage: SparkStage;
  annotations: AnnotationDef[];
  showAnnotations: boolean;
  onBack: () => void;
}

const columns: ColumnDef<SparkTaskDetail>[] = [
  { key: "index", header: "Index" },
  { key: "taskId", header: "Task ID" },
  { key: "attempt", header: "Attempt" },
  {
    key: "status",
    header: "Status",
    render: (row) => {
      const cls = row.status === "FAILED" ? "status-failed" : row.status === "RUNNING" ? "status-running" : "status-success";
      return <span className={cls}>{row.status}</span>;
    },
  },
  { key: "locality", header: "Locality" },
  { key: "executorId", header: "Executor ID" },
  { key: "taskTime", header: "Task Time (GC Time)" },
  { key: "gcTime", header: "GC Time" },
  { key: "inputSize", header: "Input Size" },
  { key: "shuffleReadSize", header: "Shuffle Read" },
  { key: "shuffleWriteSize", header: "Shuffle Write" },
  { key: "errors", header: "Errors" },
];

export default function SparkStageDetail({ stage, annotations, showAnnotations, onBack }: Props) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <button
          onClick={onBack}
          className="cursor-pointer"
          style={{
            padding: "4px 12px",
            fontSize: "12px",
            borderRadius: "4px",
            border: "1px solid var(--spark-table-border)",
            background: "transparent",
            color: "var(--spark-accent)",
          }}
        >
          &larr; 返回 Stages 列表
        </button>
        <div>
          <span style={{ fontWeight: 700, fontSize: "14px" }}>Stage {stage.id}: {stage.description}</span>
          <span style={{ marginLeft: "12px", fontSize: "12px", color: "var(--spark-metric-label)" }}>
            Duration: {stage.duration} &middot; Input: {stage.input} &middot; Output: {stage.output} &middot;
            Shuffle Read: {stage.shuffleRead} &middot; Shuffle Write: {stage.shuffleWrite}
          </span>
        </div>
      </div>
      <SparkDataTable
        columns={columns}
        rows={stage.tasks_detail}
        rowKey={(row) => `stage-${stage.id}-task-${row.index}`}
        annotations={annotations}
        showAnnotations={showAnnotations}
        annotationTargetType="task-cell"
        emptyMessage="No task details available for this stage."
      />
    </div>
  );
}
