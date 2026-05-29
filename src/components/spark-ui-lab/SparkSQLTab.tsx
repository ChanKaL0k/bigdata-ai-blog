import { useState } from "react";
import type { SparkSQLQuery, AnnotationDef } from "../../data/spark-ui-lab";

interface Props {
  queries: SparkSQLQuery[];
  annotations: AnnotationDef[];
  showAnnotations: boolean;
}

export default function SparkSQLTab({ queries, annotations, showAnnotations }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (queries.length === 0) {
    return (
      <p style={{ padding: "20px", color: "var(--spark-metric-label)", fontSize: "13px", textAlign: "center" }}>
        No SQL queries executed.
      </p>
    );
  }

  return (
    <div className="spark-table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Submitted</th>
            <th>Duration</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((q) => {
            const isExpanded = expandedId === q.id;
            const annForQuery = showAnnotations
              ? annotations.filter((a) => a.targetType === "sql-node" && a.targetId.startsWith("sql-") || a.targetId.startsWith("env-"))
              : [];
            const bottomAnns = annForQuery.filter((a) => a.position === "bottom");

            return (
              <>
                <tr
                  key={`sql-${q.id}`}
                  className="cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <td style={{ color: "var(--spark-accent)", textDecoration: "underline" }}>{q.id}</td>
                  <td>{q.description}</td>
                  <td>{q.submitted}</td>
                  <td><span className="status-failed">{q.duration}</span></td>
                  <td>{q.details}</td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={5} style={{ padding: "12px 20px", background: "#f8f9fa", whiteSpace: "normal" }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>Query Plan:</div>
                      {q.plan.map((node) => (
                        <SparkPlanNode key={node.nodeId} node={node} depth={0} annotations={annForQuery} showAnnotations={showAnnotations} />
                      ))}
                      {bottomAnns.map((ann) => (
                        <div key={ann.id} className={`spark-annotation-callout ${ann.severity} spark-annotation-fade`} style={{ marginTop: "12px" }}>
                          <div className="ann-title">
                            {ann.severity === "critical" && "🔴 "}
                            {ann.severity === "warning" && "🟡 "}
                            {ann.severity === "info" && "🔵 "}
                            {ann.title}
                          </div>
                          <div className="ann-body" dangerouslySetInnerHTML={{ __html: ann.body }} />
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SparkPlanNode({ node, depth, annotations, showAnnotations }: {
  node: any;
  depth: number;
  annotations: AnnotationDef[];
  showAnnotations: boolean;
}) {
  const isAnomalous = showAnnotations && node._isAnomalous;

  return (
    <div style={{ marginLeft: depth * 24, marginBottom: "4px" }}>
      <div style={{
        padding: "6px 10px",
        borderRadius: "4px",
        background: isAnomalous ? "#fef2f2" : "var(--spark-bg)",
        border: isAnomalous ? "1px solid var(--spark-annotation-critical)" : "1px solid var(--spark-table-border)",
        fontSize: "12px",
        fontFamily: "var(--spark-font-mono)",
      }}>
        <span style={{ fontWeight: 600 }}>{node.name}</span>
        {Object.entries(node.metrics).map(([k, v]) => (
          <span key={k} style={{ marginLeft: "12px", fontSize: "11px", color: "var(--spark-metric-label)" }}>
            {k}: <span style={{ color: "var(--spark-table-text)", fontWeight: 500 }}>{v as string}</span>
          </span>
        ))}
      </div>
      {node.children?.map((child: any) => (
        <SparkPlanNode key={child.nodeId} node={child} depth={depth + 1} annotations={annotations} showAnnotations={showAnnotations} />
      ))}
    </div>
  );
}
