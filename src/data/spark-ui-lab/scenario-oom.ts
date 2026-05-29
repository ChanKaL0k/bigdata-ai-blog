import type { SparkApp } from "./types";

export const oom: SparkApp = {
  id: "application_1716201600000_0196",
  name: "Spark SQL — ml_training_feature_engineering",
  user: "ml-team",
  status: "FAILED",
  startTime: "2026-05-28 14:22:08",
  duration: "8.5 min (失败)",
  cores: 16,
  memoryPerExecutor: "2 GB",
  summary: {
    appUptime: "12 min",
    completedJobs: 1,
    failedJobs: 1,
    completedStages: 3,
    activeBatches: 0,
    totalTasks: 96,
    usedMemory: "1.9 GB",
    totalMemory: "2 GB",
  },
  jobs: [
    { id: 0, description: "parquet at FeatureEng.scala:95", submitted: "14:22:09", duration: "3.1 min", stages: "3/3", tasks: "48/48", status: "SUCCEEDED" },
    { id: 1, description: "groupBy at FeatureEng.scala:142", submitted: "14:25:20", duration: "5.2 min", stages: "1/3 (2 failed)", tasks: "32/48 (16 failed)", status: "FAILED" },
  ],
  stages: [
    { id: 0, description: "parquet at FeatureEng.scala:95 (Scan)", submitted: "14:22:10", duration: "1.8 min", tasks: "16/16", input: "8.6 GB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "5.2 GB", status: "COMPLETE", tasks_detail: [] },
    { id: 1, description: "parquet at FeatureEng.scala:95 (Agg)", submitted: "14:23:55", duration: "1.2 min", tasks: "16/16", input: "0 B", output: "1.1 GB", shuffleRead: "5.2 GB", shuffleWrite: "0 B", status: "COMPLETE", tasks_detail: [] },
    { id: 2, description: "groupBy at FeatureEng.scala:142 (Scan)", submitted: "14:25:21", duration: "3.8 min", tasks: "16/16", input: "4.2 GB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "4.8 GB", status: "COMPLETE", tasks_detail: [] },
    { id: 3, description: "groupBy at FeatureEng.scala:142 (GroupBy + UDAF)", submitted: "14:29:10", duration: "1.7 min", tasks: "16/32 (16 failed)", input: "0 B", output: "0 B", shuffleRead: "4.8 GB", shuffleWrite: "0 B", status: "FAILED", _isAnomalous: true, tasks_detail: generateOOMTasks(32) },
  ],
  executors: [
    { id: "1", address: "10.0.3.11:42111", status: "ACTIVE", cores: 4, memory: "2 GB", memoryUsed: "1.5 GB", taskActive: 0, taskCompleted: 16, taskFailed: 0, gcTime: "24 s", shuffleRead: "1.2 GB", shuffleWrite: "987 MB" },
    { id: "2", address: "10.0.3.12:42112", status: "FAILED", cores: 4, memory: "2 GB", memoryUsed: "2.0 GB", taskActive: 0, taskCompleted: 8, taskFailed: 8, gcTime: "1.2 min", shuffleRead: "2.1 GB", shuffleWrite: "1.8 GB", _isAnomalous: true },
    { id: "3", address: "10.0.3.13:42113", status: "FAILED", cores: 4, memory: "2 GB", memoryUsed: "1.9 GB", taskActive: 0, taskCompleted: 8, taskFailed: 8, gcTime: "1.5 min", shuffleRead: "2.3 GB", shuffleWrite: "2.1 GB", _isAnomalous: true },
    { id: "4", address: "10.0.3.14:42114", status: "ACTIVE", cores: 4, memory: "2 GB", memoryUsed: "1.4 GB", taskActive: 0, taskCompleted: 16, taskFailed: 0, gcTime: "18 s", shuffleRead: "1.1 GB", shuffleWrite: "912 MB" },
  ],
  storage: [
    { id: 1, rddName: "训练特征 (Parquet)", storageLevel: "Disk Memory Deserialized 1x", cachedSize: "8.6 GB", partitions: 16, inMemory: "3.8 GB", onDisk: "4.8 GB" },
    { id: 2, rddName: "UDAF 中间结果", storageLevel: "Memory Deserialized 1x", cachedSize: "1.8 GB", partitions: 32, inMemory: "1.8 GB", onDisk: "0 B" },
  ],
  sqlQueries: [
    {
      id: 0, description: "SELECT user_id, MY_UDAF(feature_vec) FROM features GROUP BY user_id", submitted: "14:25:25", duration: "5.2 min (FAILED)", details: "Job 1 failed: ExecutorLostFailure",
      plan: [
        { nodeId: 1, name: "WholeStageCodegen (3)", metrics: { "duration": "3.5 min", "status": "FAILED" }, _isAnomalous: true, children: [
          { nodeId: 2, name: "HashAggregate (MY_UDAF)", metrics: { "peak memory": "1.8 GB", "spill": "2.4 GB" }, _isAnomalous: true, children: [
            { nodeId: 3, name: "Exchange", metrics: { "shuffle write": "4.8 GB" }, children: [
              { nodeId: 4, name: "Scan parquet", metrics: { "read rows": "82,450,000", "input size": "4.2 GB" }, children: [] },
            ] },
          ] },
        ] },
      ],
    },
  ],
  environment: [
    { key: "spark.executor.memory", value: "2g" },
    { key: "spark.executor.cores", value: "4" },
    { key: "spark.sql.shuffle.partitions", value: "200" },
    { key: "spark.sql.adaptive.enabled", value: "true" },
    { key: "spark.memory.offHeap.enabled", value: "false" },
    { key: "spark.memory.fraction", value: "0.6" },
    { key: "spark.sql.adaptive.coalescePartitions.enabled", value: "true" },
    { key: "spark.dynamicAllocation.enabled", value: "false" },
    { key: "spark.executor.extraJavaOptions", value: "" },
  ],
  annotations: [
    {
      id: "oom-stage",
      targetType: "stage-row", targetId: "stage-3",
      title: "Stage 3 因 OOM 失败",
      body: "Stage 3 是 UDAF 聚合阶段，<b>32 个 Task 中有 16 个失败</b>，原因是 Executor 内存溢出（OutOfMemoryError）。每个 Executor 仅配了 <b>2 GB 内存</b>，但扫描了 4.2 GB 数据，Shuffle 后再做自定义聚合（MY_UDAF），内存严重不足。",
      severity: "critical", position: "inline"
    },
    {
      id: "oom-task",
      targetType: "task-cell", targetId: "stage-3-task-12", targetField: "errors",
      title: "OOM 错误详情",
      body: "Task 12 在 Executor 2 上运行时抛出 <b>java.lang.OutOfMemoryError: Java heap space</b>。Executor 内存仅 2 GB，Shuffle Read 1.4 GB + UDAF 中间结果 800 MB 导致堆内存溢出。<br><br><b>解决方案：</b><br>1. 增加 <code>spark.executor.memory</code> 到 <b>6 GB</b> 以上<br>2. 开启堆外内存 <code>spark.memory.offHeap.enabled=true</code><br>3. 检查 UDAF 是否有内存泄漏<br>4. 减少数据量或增加 shuffle 分区数",
      severity: "critical", position: "right"
    },
    {
      id: "oom-executor",
      targetType: "executor-row", targetId: "executor-2",
      title: "Executor 2 内存耗尽",
      body: "Executor 2 和 3 内存使用达到 <b>95%+</b>，分别有 8 个 Task 失败。GC Time 高达 <b>1.2-1.5 分钟</b>，说明 JVM 在 OOM 前频繁 Full GC 尝试回收内存但无法释放足够空间。",
      severity: "critical", position: "inline"
    },
    {
      id: "oom-env",
      targetType: "sql-node", targetId: "env-off-heap",
      title: "堆外内存未开启",
      body: "当前 <code>spark.memory.offHeap.enabled</code> = <b>false</b>，所有数据都在堆内存中。开启堆外内存可以减轻 GC 压力，将部分缓存数据移到堆外，降低 OOM 风险。建议设置为 <b>true</b> 并配置 <code>spark.memory.offHeap.size</code>。",
      severity: "warning", position: "bottom"
    },
  ],
};

function generateOOMTasks(count: number): SparkApp["stages"][0]["tasks_detail"] {
  const tasks: SparkApp["stages"][0]["tasks_detail"] = [];
  for (let i = 0; i < count; i++) {
    const isFailed = i >= 16;
    const execId = isFailed ? (i < 24 ? "2" : "3") : String((i % 2) + 1);
    tasks.push({
      index: i,
      taskId: 500 + i,
      attempt: isFailed ? 1 : 0,
      status: isFailed ? "FAILED" : "SUCCESS",
      locality: "PROCESS_LOCAL",
      executorId: execId,
      taskTime: isFailed ? `${40 + Math.floor(Math.random() * 60)} s` : `${20 + Math.floor(Math.random() * 40)} s`,
      gcTime: isFailed ? `${8 + Math.floor(Math.random() * 15)} s` : `${2 + Math.floor(Math.random() * 5)} s`,
      inputSize: "0 B",
      shuffleReadSize: isFailed ? `${800 + Math.floor(Math.random() * 600)} MB` : `${200 + Math.floor(Math.random() * 200)} MB`,
      shuffleWriteSize: "0 B",
      errors: isFailed ? "java.lang.OutOfMemoryError: Java heap space" : "",
      _isAnomalous: isFailed,
      _anomalyReason: isFailed ? "Executor OOM 导致 Task 失败" : undefined,
    });
  }
  return tasks;
}
