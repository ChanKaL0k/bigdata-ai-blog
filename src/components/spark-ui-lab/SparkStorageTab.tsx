import type { SparkStorageEntry, AnnotationDef } from "../../data/spark-ui-lab";
import SparkDataTable from "./SparkDataTable";
import type { ColumnDef } from "./SparkDataTable";

interface Props {
  entries: SparkStorageEntry[];
  annotations: AnnotationDef[];
  showAnnotations: boolean;
}

const columns: ColumnDef<SparkStorageEntry>[] = [
  { key: "id", header: "RDD ID" },
  { key: "rddName", header: "RDD Name" },
  { key: "storageLevel", header: "Storage Level" },
  { key: "cachedSize", header: "Cached Size" },
  { key: "partitions", header: "Partitions" },
  { key: "inMemory", header: "In Memory" },
  { key: "onDisk", header: "On Disk" },
];

export default function SparkStorageTab({ entries, annotations, showAnnotations }: Props) {
  return (
    <SparkDataTable
      columns={columns}
      rows={entries}
      rowKey={(row) => `storage-${row.id}`}
      annotations={annotations}
      showAnnotations={showAnnotations}
      annotationTargetType="storage-row"
      emptyMessage="No cached RDDs or DataFrames."
    />
  );
}
