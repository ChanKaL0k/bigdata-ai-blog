import type { SparkJob, AnnotationDef } from "../../data/spark-ui-lab";
import SparkDataTable from "./SparkDataTable";
import type { ColumnDef } from "./SparkDataTable";

interface Props {
  jobs: SparkJob[];
  annotations: AnnotationDef[];
  showAnnotations: boolean;
}

const columns: ColumnDef<SparkJob>[] = [
  { key: "id", header: "Job ID" },
  { key: "description", header: "Description" },
  { key: "submitted", header: "Submitted" },
  { key: "duration", header: "Duration" },
  { key: "stages", header: "Stages: Succeeded/Total" },
  { key: "tasks", header: "Tasks (for all stages): Succeeded/Total" },
  {
    key: "status",
    header: "Status",
    render: (row) => {
      const cls = row.status === "FAILED" ? "status-failed" : row.status === "RUNNING" ? "status-running" : "status-success";
      return <span className={cls}>{row.status}</span>;
    },
  },
];

export default function SparkJobsTab({ jobs, annotations, showAnnotations }: Props) {
  return (
    <SparkDataTable
      columns={columns}
      rows={jobs}
      rowKey={(row) => `job-${row.id}`}
      annotations={annotations}
      showAnnotations={showAnnotations}
      annotationTargetType="job-row"
      emptyMessage="No jobs found."
    />
  );
}
