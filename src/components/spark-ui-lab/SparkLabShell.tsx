import { useState, useMemo } from "react";
import type { AnnotationDef } from "../../data/spark-ui-lab/types";
import { scenarioDefs, scenarioApps } from "../../data/spark-ui-lab";
import ScenarioSelector from "./ScenarioSelector";
import SparkHeader from "./SparkHeader";
import SparkTabNav from "./SparkTabNav";
import type { TabId } from "./SparkTabNav";
import SparkSummaryMetrics from "./SparkSummaryMetrics";
import SparkJobsTab from "./SparkJobsTab";
import SparkStagesTab from "./SparkStagesTab";
import SparkStorageTab from "./SparkStorageTab";
import SparkExecutorsTab from "./SparkExecutorsTab";
import SparkSQLTab from "./SparkSQLTab";
import SparkEnvironmentTab from "./SparkEnvironmentTab";

interface Props {
  initialScenario?: string;
}

export default function SparkLabShell({ initialScenario }: Props) {
  const [scenarioId, setScenarioId] = useState<string>(initialScenario ?? scenarioDefs[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("jobs");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);

  const app = scenarioApps[scenarioId];

  // Filter annotations by current active tab
  const visibleAnnotations = useMemo(() => {
    const tabAnnotationMap: Record<TabId, AnnotationDef["targetType"][]> = {
      jobs: ["job-row"],
      stages: ["stage-row", "task-cell"],
      storage: ["storage-row"],
      environment: ["summary-metric"],
      executors: ["executor-row"],
      sql: ["sql-node"],
    };
    const allowed = tabAnnotationMap[activeTab];
    return showAnnotations ? app.annotations.filter((a) => allowed.includes(a.targetType)) : [];
  }, [app.annotations, activeTab, showAnnotations]);

  return (
    <div>
      <ScenarioSelector scenarios={scenarioDefs} activeId={scenarioId} onChange={(id) => { setScenarioId(id); setActiveTab("jobs"); setSelectedStageId(null); }} />

      <div className="spark-ui-simulator">
        <SparkHeader
          appName={app.name}
          appId={app.id}
          user={app.user}
          status={app.status}
          duration={app.duration}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SparkTabNav activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSelectedStageId(null); }} />
          <button
            onClick={() => setShowAnnotations((v) => !v)}
            style={{
              margin: "0 16px",
              padding: "4px 12px",
              fontSize: "12px",
              borderRadius: "4px",
              border: showAnnotations ? "2px solid var(--spark-accent)" : "1px solid var(--spark-table-border)",
              background: showAnnotations ? "#e8f4fd" : "transparent",
              color: showAnnotations ? "var(--spark-accent)" : "var(--spark-metric-label)",
              cursor: "pointer",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {showAnnotations ? "隐藏标注" : "显示标注"}
          </button>
        </div>

        <SparkSummaryMetrics summary={app.summary} />

        <div style={{ padding: "12px 16px" }}>
          {activeTab === "jobs" && (
            <SparkJobsTab jobs={app.jobs} annotations={visibleAnnotations} showAnnotations={showAnnotations} />
          )}
          {activeTab === "stages" && !selectedStageId && (
            <SparkStagesTab
              stages={app.stages}
              annotations={visibleAnnotations}
              showAnnotations={showAnnotations}
              onSelectStage={(id) => setSelectedStageId(id)}
            />
          )}
          {activeTab === "stages" && selectedStageId !== null && (() => {
            const stage = app.stages.find((s) => s.id === selectedStageId);
            return stage ? (
              <SparkStagesTab
                stages={[stage]}
                annotations={visibleAnnotations}
                showAnnotations={showAnnotations}
                onSelectStage={() => {}}
                detailView
                onBack={() => setSelectedStageId(null)}
              />
            ) : null;
          })()}
          {activeTab === "storage" && (
            <SparkStorageTab entries={app.storage} annotations={visibleAnnotations} showAnnotations={showAnnotations} />
          )}
          {activeTab === "environment" && (
            <SparkEnvironmentTab config={app.environment} annotations={visibleAnnotations} showAnnotations={showAnnotations} />
          )}
          {activeTab === "executors" && (
            <SparkExecutorsTab executors={app.executors} annotations={visibleAnnotations} showAnnotations={showAnnotations} />
          )}
          {activeTab === "sql" && (
            <SparkSQLTab queries={app.sqlQueries} annotations={visibleAnnotations} showAnnotations={showAnnotations} />
          )}
        </div>
      </div>
    </div>
  );
}
