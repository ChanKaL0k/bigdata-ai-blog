import type { AnnotationDef } from "../../data/spark-ui-lab/types";
import SparkAnnotation from "./SparkAnnotation";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface Props<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  annotations?: AnnotationDef[];
  showAnnotations?: boolean;
  annotationTargetType?: AnnotationDef["targetType"];
  emptyMessage?: string;
}

export default function SparkDataTable<T extends Record<string, any>>({
  columns,
  rows,
  rowKey,
  annotations = [],
  showAnnotations = false,
  annotationTargetType = "stage-row",
  emptyMessage = "No data available.",
}: Props<T>) {
  if (rows.length === 0) {
    return (
      <p style={{ padding: "20px", color: "var(--spark-metric-label)", fontSize: "13px", textAlign: "center" }}>
        {emptyMessage}
      </p>
    );
  }

  // Build annotation map by targetId
  const annByTarget: Record<string, AnnotationDef[]> = {};
  const annFieldsByTarget: Record<string, Record<string, AnnotationDef>> = {};
  if (showAnnotations) {
    for (const ann of annotations) {
      if (ann.targetType === annotationTargetType && ann.targetField) {
        if (!annFieldsByTarget[ann.targetId]) annFieldsByTarget[ann.targetId] = {};
        annFieldsByTarget[ann.targetId][ann.targetField] = ann;
      } else if (ann.targetType === annotationTargetType) {
        if (!annByTarget[ann.targetId]) annByTarget[ann.targetId] = [];
        annByTarget[ann.targetId].push(ann);
      }
    }
  }

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
          {rows.map((row, idx) => {
            const key = rowKey(row, idx);
            const rowAnnotations = annByTarget[key] || [];
            const cellAnnotations = annFieldsByTarget[key] || {};
            const hasAnnotations = rowAnnotations.length > 0;

            return (
              <>
                <tr
                  key={key}
                  className={hasAnnotations ? "row-anomalous" : row._isAnomalous ? "row-warning" : undefined}
                >
                  {columns.map((col) => {
                    const hasCellAnn = !!cellAnnotations[col.key];
                    return (
                      <td
                        key={col.key}
                        className={hasCellAnn ? "cell-anomalous" : col.className}
                      >
                        {col.render ? col.render(row) : row[col.key] ?? "-"}
                      </td>
                    );
                  })}
                </tr>
                {/* Render inline annotations below row */}
                {rowAnnotations.filter((a) => a.position === "inline").map((ann) => (
                  <tr key={`ann-${key}-${ann.id}`} className="annotation-row">
                    <SparkAnnotation annotation={ann} inline />
                  </tr>
                ))}
                {/* Render bottom annotations */}
                {rowAnnotations.filter((a) => a.position === "bottom").map((ann) => (
                  <tr key={`ann-b-${key}-${ann.id}`}>
                    <td colSpan={columns.length} style={{ padding: "8px 16px", background: "transparent", borderBottom: "none" }}>
                      <SparkAnnotation annotation={ann} />
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
