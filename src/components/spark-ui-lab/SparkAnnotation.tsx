import type { AnnotationDef } from "../../data/spark-ui-lab/types";

interface Props {
  annotation: AnnotationDef;
  inline?: boolean;
}

export default function SparkAnnotation({ annotation, inline }: Props) {
  const classNames = [
    "spark-annotation-callout",
    annotation.severity,
    "spark-annotation-fade",
  ].join(" ");

  if (inline) {
    return (
      <td colSpan={99} style={{ padding: "12px 16px", background: annotation.severity === "critical" ? "#fef2f2" : annotation.severity === "warning" ? "#fff8e1" : "#e8f4fd" }}>
        <div className={classNames} style={{ margin: 0 }}>
          <div className="ann-title">
            {annotation.severity === "critical" && "🔴 "}
            {annotation.severity === "warning" && "🟡 "}
            {annotation.severity === "info" && "🔵 "}
            {annotation.title}
          </div>
          <div className="ann-body" dangerouslySetInnerHTML={{ __html: annotation.body }} />
        </div>
      </td>
    );
  }

  return (
    <div className={classNames}>
      <div className="ann-title">
        {annotation.severity === "critical" && "🔴 "}
        {annotation.severity === "warning" && "🟡 "}
        {annotation.severity === "info" && "🔵 "}
        {annotation.title}
      </div>
      <div className="ann-body" dangerouslySetInnerHTML={{ __html: annotation.body }} />
    </div>
  );
}
