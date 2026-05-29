import type { SparkStage, AnnotationDef } from "../../data/spark-ui-lab";
import SparkDataTable from "./SparkDataTable";
import type { ColumnDef } from "./SparkDataTable";
import SparkStageDetail from "./SparkStageDetail";

interface Props {
  stages: SparkStage[];
  annotations: AnnotationDef[];
  showAnnotations: boolean;
  onSelectStage: (id: number) => void;
  detailView?: boolean;
}

const columns: ColumnDef<SparkStage>[] = [
  { key: "id", header: "Stage ID" },
  { key: "description", header: "Description" },
  { key: "submitted", header: "Submitted" },
  { key: "duration", header: "Duration" },
  { key: "tasks", header: "Tasks: Succeeded/Total" },
  { key: "input", header: "Input" },
  { key: "output", header: "Output" },
  { key: "shuffleRead", header: "Shuffle Read" },
  { key: "shuffleWrite", header: "Shuffle Write" },
  {
    key: "status",
    header: "Status",
    render: (row) => {
      const cls = row.status === "FAILED" ? "status-failed" : "status-success";
      return <span className={cls}>{row.status}</span>;
    },
  },
];

interface ListProps {
  stages: SparkStage[];
  annotations: AnnotationDef[];
  showAnnotations: boolean;
  onSelectStage: (id: number) => void;
}

export default function SparkStagesTab({ stages, annotations, showAnnotations, onSelectStage, detailView }: Props & { onBack?: () => void }) {
  // If there's a parent-provided onBack, we pass it down;
  // the orchestrator handles the detail view selection
  if (detailView && stages.length === 1 && stages[0].tasks_detail.length > 0) {
    // Detail view is handled in SparkLabShell, here we just render the list
    return <SparkStagesList stages={stages} annotations={annotations} showAnnotations={showAnnotations} onSelectStage={onSelectStage} />;
  }
  return <SparkStagesList stages={stages} annotations={annotations} showAnnotations={showAnnotations} onSelectStage={onSelectStage} />;
}

function SparkStagesList({ stages, annotations, showAnnotations, onSelectStage }: ListProps) {
  // We wrap the stage list with click-to-expand: each stage row is clickable
  return (
    <div className="spark-table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stages.map((stage) => {
            const hasTaskDetail = stage.tasks_detail.length > 0;
            const annForStage = showAnnotations ? annotations.filter((a) => a.targetType === "stage-row" && a.targetId === `stage-${stage.id}` && a.position === "inline") : [];
            return (
              <>
                <tr
                  key={`stage-${stage.id}`}
                  className={`${stage._isAnomalous ? "row-anomalous" : ""} ${hasTaskDetail ? "cursor-pointer" : ""}`}
                  onClick={hasTaskDetail ? () => onSelectStage(stage.id) : undefined}
                  style={hasTaskDetail ? { _cursor: "pointer" } as any : {}}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={col.key === "id" && hasTaskDetail ? "cursor-pointer" : ""} style={col.key === "id" && hasTaskDetail ? { color: "var(--spark-accent)", textDecoration: "underline" } : {}}>
                      {col.render ? col.render(stage) : String(stage[col.key as keyof SparkStage] ?? "-")}
                    </td>
                  ))}
                </tr>
                {annForStage.map((ann) => (
                  <tr key={`ann-stage-${stage.id}`} className="annotation-row">
                    <td colSpan={columns.length}>
                      <div className={`spark-annotation-callout ${ann.severity} spark-annotation-fade`}>
                        <div className="ann-title">
                          {ann.severity === "critical" && "🔴 "}
                          {ann.severity === "warning" && "🟡 "}
                          {ann.severity === "info" && "🔵 "}
                          {ann.title}
                        </div>
                        <div className="ann-body" dangerouslySetInnerHTML={{ __html: ann.body }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
