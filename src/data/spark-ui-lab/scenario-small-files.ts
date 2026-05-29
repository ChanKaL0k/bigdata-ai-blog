import type { SparkApp } from "./types";

export const smallFiles: SparkApp = {
  id: "application_1716201600000_0267",
  name: "Spark SQL — log_analysis_daily",
  user: "ops-team",
  status: "SUCCEEDED",
  startTime: "2026-05-28 22:01:12",
  duration: "42 min",
  cores: 20,
  memoryPerExecutor: "4 GB",
  summary: {
    appUptime: "45 min",
    completedJobs: 4,
    failedJobs: 0,
    completedStages: 12,
    activeBatches: 0,
    totalTasks: 1648,
    usedMemory: "1.2 GB",
    totalMemory: "4 GB",
  },
  jobs: [
    { id: 0, description: "textFile at LogAnalysis.scala:25", submitted: "22:01:13", duration: "28 min", stages: "8/8", tasks: "1200/1200", status: "SUCCEEDED" },
    { id: 1, description: "filter at LogAnalysis.scala:38", submitted: "22:29:20", duration: "6.2 min", stages: "2/2", tasks: "300/300", status: "SUCCEEDED" },
    { id: 2, description: "groupBy at LogAnalysis.scala:56", submitted: "22:35:30", duration: "5.8 min", stages: "2/2", tasks: "148/148", status: "SUCCEEDED" },
    { id: 3, description: "save at LogAnalysis.scala:68", submitted: "22:41:20", duration: "1.2 min", stages: "1/1", tasks: "1/1", status: "SUCCEEDED" },
  ],
  stages: [
    { id: 0, description: "textFile at LogAnalysis.scala:25 (List Files)", submitted: "22:01:13", duration: "8.2 min", tasks: "1/1", input: "0 B", output: "0 B", shuffleRead: "0 B", shuffleWrite: "0 B", status: "COMPLETE", _isAnomalous: true, tasks_detail: [] },
    { id: 1, description: "textFile at LogAnalysis.scala:25 (Scan 1)", submitted: "22:09:20", duration: "5.1 min", tasks: "200/200", input: "12 MB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "1.1 GB", status: "COMPLETE", _isAnomalous: true, tasks_detail: generateSmallFileTasks(200, "scan") },
    { id: 2, description: "textFile at LogAnalysis.scala:25 (Scan 2)", submitted: "22:14:30", duration: "4.8 min", tasks: "200/200", input: "11 MB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "1.0 GB", status: "COMPLETE", _isAnomalous: true, tasks_detail: [] },
    { id: 3, description: "filter at LogAnalysis.scala:38 (Filter)", submitted: "22:22:20", duration: "5.1 min", tasks: "300/300", input: "0 B", output: "0 B", shuffleRead: "2.1 GB", shuffleWrite: "856 MB", status: "COMPLETE", _isAnomalous: true, tasks_detail: generateSmallFileTasks(300, "filter") },
    { id: 4, description: "groupBy at LogAnalysis.scala:56 (Agg)", submitted: "22:35:30", duration: "4.5 min", tasks: "148/148", input: "0 B", output: "0 B", shuffleRead: "856 MB", shuffleWrite: "52 MB", status: "COMPLETE", tasks_detail: [] },
    { id: 5, description: "save at LogAnalysis.scala:68 (Write)", submitted: "22:41:40", duration: "0.8 min", tasks: "1/1", input: "0 B", output: "52 MB", shuffleRead: "0 B", shuffleWrite: "0 B", status: "COMPLETE", tasks_detail: [] },
  ],
  executors: [
    { id: "1", address: "10.0.4.11:45121", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "1.1 GB", taskActive: 0, taskCompleted: 330, taskFailed: 0, gcTime: "24 s", shuffleRead: "521 MB", shuffleWrite: "412 MB" },
    { id: "2", address: "10.0.4.12:45122", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "1.2 GB", taskActive: 0, taskCompleted: 328, taskFailed: 0, gcTime: "22 s", shuffleRead: "498 MB", shuffleWrite: "388 MB" },
    { id: "3", address: "10.0.4.13:45123", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "1.3 GB", taskActive: 0, taskCompleted: 335, taskFailed: 0, gcTime: "26 s", shuffleRead: "556 MB", shuffleWrite: "445 MB" },
    { id: "4", address: "10.0.4.14:45124", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "1.1 GB", taskActive: 0, taskCompleted: 325, taskFailed: 0, gcTime: "21 s", shuffleRead: "482 MB", shuffleWrite: "371 MB" },
    { id: "5", address: "10.0.4.15:45125", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "1.0 GB", taskActive: 0, taskCompleted: 330, taskFailed: 0, gcTime: "23 s", shuffleRead: "515 MB", shuffleWrite: "402 MB" },
  ],
  storage: [],
  sqlQueries: [
    {
      id: 0, description: "SELECT hour, status_code, COUNT(*) FROM server_logs WHERE dt='2026-05-28' GROUP BY hour, status_code", submitted: "22:01:20", duration: "39 min", details: "Completed",
      plan: [
        { nodeId: 1, name: "WholeStageCodegen (1)", metrics: { "duration": "28 min (瓶颈)", "num tasks": "1200" }, _isAnomalous: true, children: [
          { nodeId: 2, name: "HashAggregate", metrics: { "output rows": "168", "num tasks": "148" }, children: [
            { nodeId: 3, name: "Exchange", metrics: { "shuffle write": "2.1 GB", "num tasks": "1200" }, _isAnomalous: true, children: [
              { nodeId: 4, name: "Scan text", metrics: { "read rows": "2,845,000", "input size": "48 MB", "num tasks": "1200", "avg input per task": "40 KB" }, _isAnomalous: true, children: [] },
            ] },
          ] },
        ] },
      ],
    },
  ],
  environment: [
    { key: "spark.sql.files.maxPartitionBytes", value: "134217728 (128 MB)" },
    { key: "spark.sql.files.openCostInBytes", value: "4194304 (4 MB)" },
    { key: "spark.sql.shuffle.partitions", value: "200" },
    { key: "spark.executor.memory", value: "4g" },
    { key: "spark.executor.cores", value: "4" },
    { key: "spark.sql.adaptive.enabled", value: "false" },
    { key: "spark.sql.adaptive.coalescePartitions.enabled", value: "false" },
    { key: "spark.shuffle.compress", value: "true" },
    { key: "spark.hadoop.mapreduce.input.fileinputformat.split.maxsize", value: "134217728" },
  ],
  annotations: [
    {
      id: "sf-listing",
      targetType: "stage-row", targetId: "stage-0",
      title: "Stage 0 列出文件耗时 8.2 分钟",
      body: "Stage 0 是 Listing 阶段（列出目录下的所有文件），耗时 <b>8.2 分钟</b>，说明目录下有 <b>海量小文件</b>。Spark 需要调用 HDFS NameNode / S3 List API 逐个获取文件元数据，10,000+ 文件时仅 Listing 就可能耗时数分钟。",
      severity: "critical", position: "inline"
    },
    {
      id: "sf-task-count",
      targetType: "stage-row", targetId: "stage-1",
      title: "200 个 Task 读取 12 MB 数据",
      body: "Stage 1 有 <b>200 个 Task</b>，但总输入仅 12 MB，平均每个 Task 读取 <b>60 KB</b>。Task 的调度和启动开销远大于实际数据处理时间。正常配置下（128 MB/分区），12 MB 应只需 1 个 Task。<br><br><b>根因：</b>输入目录包含 2,800+ 小文件（每个 4-8 KB），每个文件至少对应一个分区。",
      severity: "critical", position: "inline"
    },
    {
      id: "sf-sql-node",
      targetType: "sql-node", targetId: "sql-scan",
      title: "Scan 阶段 1,200 个 Task",
      body: "整个 SQL 查询的 Scan 阶段产生了 <b>1,200 个 Task</b>，但总输入仅 48 MB。每个 Task 平均读取 <b>40 KB</b>——开销全部浪费在 Task 调度和序列化上。<br><br><b>解决方案：</b><br>1. 上游写入时合并小文件（如 <code>coalesce()</code> 或 <code>repartition()</code>）<br>2. 使用 <code>spark.sql.files.maxPartitionBytes</code> 控制分区大小<br>3. 开启 <b>AQE</b> (<code>spark.sql.adaptive.enabled=true</code>) 自动合并小分区",
      severity: "critical", position: "bottom"
    },
    {
      id: "sf-env",
      targetType: "sql-node", targetId: "env-aqe-off",
      title: "AQE 未开启",
      body: "当前 <code>spark.sql.adaptive.enabled</code> = <b>false</b>。开启 AQE 后，Spark 可以自动检测并合并小分区（<code>coalescePartitions</code>），将 1,200 个 Task 合并为几十个，大幅减少调度开销。",
      severity: "warning", position: "bottom"
    },
  ],
};

function generateSmallFileTasks(count: number, _type: string): SparkApp["stages"][0]["tasks_detail"] {
  const tasks: SparkApp["stages"][0]["tasks_detail"] = [];
  for (let i = 0; i < count; i++) {
    const anomalyEvery = count === 300 ? 10 : 8;
    tasks.push({
      index: i,
      taskId: 600 + i,
      attempt: 0,
      status: "SUCCESS",
      locality: "PROCESS_LOCAL",
      executorId: String((i % 5) + 1),
      taskTime: `${1 + Math.random() * 3}`.substring(0, 4) + " s",
      gcTime: `${Math.floor(Math.random() * 2)} ms`,
      inputSize: i % anomalyEvery === 0 ? `${40 + Math.floor(Math.random() * 30)} KB` : `${70 + Math.floor(Math.random() * 60)} KB`,
      shuffleReadSize: "0 B",
      shuffleWriteSize: `${Math.floor(1 + Math.random() * 5)} MB`,
      errors: "",
      _isAnomalous: i % anomalyEvery === 0,
      _anomalyReason: i % anomalyEvery === 0 ? "每 Task 仅读取几十 KB，严重浪费资源" : undefined,
    });
  }
  return tasks;
}
