import type { SparkApp } from "./types";

export const slowTasks: SparkApp = {
  id: "application_1716201600000_0128",
  name: "Spark SQL — hourly_aggregation_job",
  user: "data-team",
  status: "SUCCEEDED",
  startTime: "2026-05-28 07:00:22",
  duration: "31 min",
  cores: 24,
  memoryPerExecutor: "3 GB",
  summary: {
    appUptime: "34 min",
    completedJobs: 2,
    failedJobs: 0,
    completedStages: 6,
    activeBatches: 0,
    totalTasks: 144,
    usedMemory: "2.8 GB",
    totalMemory: "3 GB",
  },
  jobs: [
    { id: 0, description: "json at AggJob.scala:38", submitted: "07:00:23", duration: "4.2 min", stages: "4/4", tasks: "96/96", status: "SUCCEEDED" },
    { id: 1, description: "save at AggJob.scala:72", submitted: "07:04:40", duration: "24 min", stages: "2/2", tasks: "48/48", status: "SUCCEEDED" },
  ],
  stages: [
    { id: 0, description: "json at AggJob.scala:38 (Scan)", submitted: "07:00:23", duration: "1.8 min", tasks: "24/24", input: "5.2 GB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "3.8 GB", status: "COMPLETE", tasks_detail: [] },
    { id: 1, description: "json at AggJob.scala:38 (Agg)", submitted: "07:02:10", duration: "2.1 min", tasks: "24/24", input: "0 B", output: "0 B", shuffleRead: "3.8 GB", shuffleWrite: "1.2 GB", status: "COMPLETE", tasks_detail: [] },
    { id: 2, description: "json at AggJob.scala:38 (Sort)", submitted: "07:04:15", duration: "0.3 min", tasks: "24/24", input: "0 B", output: "1.2 GB", shuffleRead: "1.2 GB", shuffleWrite: "0 B", status: "COMPLETE", tasks_detail: [] },
    { id: 3, description: "save at AggJob.scala:72 (Scan + Join)", submitted: "07:04:41", duration: "23.5 min", tasks: "24/24", input: "2.8 GB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "6.1 GB", status: "COMPLETE", _isAnomalous: true, tasks_detail: generateSlowGCTasks(24) },
    { id: 4, description: "save at AggJob.scala:72 (Write)", submitted: "07:28:11", duration: "1.5 min", tasks: "24/24", input: "0 B", output: "1.8 GB", shuffleRead: "6.1 GB", shuffleWrite: "0 B", status: "COMPLETE", tasks_detail: [] },
  ],
  executors: [
    { id: "1", address: "10.0.2.11:38111", status: "ACTIVE", cores: 4, memory: "3 GB", memoryUsed: "1.8 GB", taskActive: 0, taskCompleted: 24, taskFailed: 0, gcTime: "1.8 min", shuffleRead: "1.5 GB", shuffleWrite: "1.1 GB", _isAnomalous: true },
    { id: "2", address: "10.0.2.12:38112", status: "ACTIVE", cores: 4, memory: "3 GB", memoryUsed: "2.5 GB", taskActive: 0, taskCompleted: 22, taskFailed: 0, gcTime: "2.1 min", shuffleRead: "1.8 GB", shuffleWrite: "1.4 GB", _isAnomalous: true },
    { id: "3", address: "10.0.2.13:38113", status: "ACTIVE", cores: 4, memory: "3 GB", memoryUsed: "1.6 GB", taskActive: 0, taskCompleted: 25, taskFailed: 0, gcTime: "12 s", shuffleRead: "1.2 GB", shuffleWrite: "987 MB" },
    { id: "4", address: "10.0.2.14:38114", status: "ACTIVE", cores: 4, memory: "3 GB", memoryUsed: "2.9 GB", taskActive: 0, taskCompleted: 23, taskFailed: 0, gcTime: "3.2 min", shuffleRead: "2.4 GB", shuffleWrite: "1.8 GB", _isAnomalous: true },
    { id: "5", address: "10.0.2.15:38115", status: "ACTIVE", cores: 4, memory: "3 GB", memoryUsed: "1.7 GB", taskActive: 0, taskCompleted: 26, taskFailed: 0, gcTime: "14 s", shuffleRead: "1.1 GB", shuffleWrite: "876 MB" },
    { id: "6", address: "10.0.2.16:38116", status: "ACTIVE", cores: 4, memory: "3 GB", memoryUsed: "1.5 GB", taskActive: 0, taskCompleted: 24, taskFailed: 0, gcTime: "11 s", shuffleRead: "1.3 GB", shuffleWrite: "912 MB" },
  ],
  storage: [],
  sqlQueries: [
    {
      id: 0, description: "SELECT hour, city, COUNT(DISTINCT user_id), AVG(session_time) FROM events JOIN dim_city GROUP BY hour, city", submitted: "07:00:45", duration: "29 min", details: "Completed",
      plan: [
        { nodeId: 1, name: "WholeStageCodegen (2)", metrics: { "duration": "23.5 min (瓶颈)", "peak memory": "2.5 GB" }, _isAnomalous: true, children: [
          { nodeId: 2, name: "HashAggregate", metrics: { "spill": "1.8 GB", "GC time": "4.2 min" }, _isAnomalous: true, children: [
            { nodeId: 3, name: "SortMergeJoin", metrics: { "duration": "18 min" }, children: [
              { nodeId: 4, name: "Exchange", metrics: { "shuffle write": "3.1 GB" }, children: [
                { nodeId: 5, name: "Scan events", metrics: { "read rows": "128,452,000", "input size": "2.8 GB" }, children: [] },
              ] },
              { nodeId: 6, name: "Exchange", metrics: { "shuffle write": "3.0 GB" }, children: [
                { nodeId: 7, name: "Scan dim_city", metrics: { "read rows": "98,320", "input size": "12 MB" }, children: [] },
              ] },
            ] },
          ] },
        ] },
      ],
    },
  ],
  environment: [
    { key: "spark.sql.shuffle.partitions", value: "200" },
    { key: "spark.executor.memory", value: "3g" },
    { key: "spark.executor.cores", value: "4" },
    { key: "spark.sql.adaptive.enabled", value: "true" },
    { key: "spark.memory.fraction", value: "0.6" },
    { key: "spark.memory.storageFraction", value: "0.5" },
    { key: "spark.sql.adaptive.coalescePartitions.enabled", value: "true" },
    { key: "spark.shuffle.compress", value: "true" },
    { key: "spark.executor.extraJavaOptions", value: "-XX:+UseG1GC -XX:MaxGCPauseMillis=200" },
  ],
  annotations: [
    {
      id: "gc-stage",
      targetType: "stage-row", targetId: "stage-3",
      title: "Stage 3 耗时异常（23.5 分钟）",
      body: "Stage 3 是 Join + Agg 操作，耗时远超其他 Stage。点击查看 Task 详情，会发现多个 Task 的 <b>GC Time 占 Task 总时间的 15-22%</b>（正常应 < 5%），严重拖慢整体执行速度。",
      severity: "critical", position: "inline"
    },
    {
      id: "gc-task-cell",
      targetType: "task-cell", targetId: "stage-3-task-7", targetField: "gcTime",
      title: "GC Time 过高",
      body: "Task 7 的 GC Time 高达 <b>42 秒</b>，占总执行时间（3.2 min）的 <b>22%</b>。这是因为 Executor 内存不足（仅 3 GB），JVM 频繁进行 Full GC。<br><br><b>解决方案：</b><br>1. 增加 <code>spark.executor.memory</code> 到 6g-8g<br>2. 使用 G1GC：<code>-XX:+UseG1GC</code><br>3. 减少 <code>spark.memory.fraction</code> 给执行内存更多空间",
      severity: "critical", position: "right"
    },
    {
      id: "gc-executor",
      targetType: "executor-row", targetId: "executor-4",
      title: "Executor 4 GC 时间异常",
      body: "Executor 4 的 GC Time 累计 <b>3.2 分钟</b>，内存使用 2.9 GB / 3 GB（<b>97%</b>），内存几乎耗尽。该 Executor 负责处理多个大数据量的 Task，频繁触发 Full GC。",
      severity: "warning", position: "inline"
    },
    {
      id: "gc-env",
      targetType: "sql-node", targetId: "env-memory-fraction",
      title: "内存配置建议",
      body: "当前 <code>spark.memory.fraction</code> = 0.6，意味着只有 60% 的堆内存用于执行和存储。在 GC 压力大时，可以降低该值给 JVM 预留更多空间。同时建议 <b>增加 executor 内存至 6 GB</b>。",
      severity: "info", position: "bottom"
    },
  ],
};

function generateSlowGCTasks(count: number): SparkApp["stages"][0]["tasks_detail"] {
  const tasks: SparkApp["stages"][0]["tasks_detail"] = [];
  for (let i = 0; i < count; i++) {
    const isSlow = i === 3 || i === 7 || i === 15 || i === 19;
    const taskTime = isSlow ? `${2.8 + Math.random() * 1.4}` : `${0.3 + Math.random() * 0.8}`;
    tasks.push({
      index: i,
      taskId: 400 + i,
      attempt: 0,
      status: "SUCCESS",
      locality: "PROCESS_LOCAL",
      executorId: isSlow ? String([4, 2, 1, 4][i % 4]) : String((i % 5) + 1),
      taskTime: isSlow ? `${(2.8 + Math.random() * 1.4).toFixed(1)} min` : `${(15 + Math.floor(Math.random() * 30))} s`,
      gcTime: isSlow ? `${32 + Math.floor(Math.random() * 20)} s` : `${2 + Math.floor(Math.random() * 4)} s`,
      inputSize: `${300 + Math.floor(Math.random() * 500)} MB`,
      shuffleReadSize: `${200 + Math.floor(Math.random() * 400)} MB`,
      shuffleWriteSize: `${100 + Math.floor(Math.random() * 200)} MB`,
      errors: "",
      _isAnomalous: isSlow,
      _anomalyReason: isSlow ? "GC Time 占总 Task 时间 15-22%" : undefined,
    });
  }
  return tasks;
}
