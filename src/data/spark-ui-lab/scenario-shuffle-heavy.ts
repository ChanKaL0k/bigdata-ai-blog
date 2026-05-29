import type { SparkApp } from "./types";

export const shuffleHeavy: SparkApp = {
  id: "application_1716201600000_0341",
  name: "Spark SQL — cross_domain_join_analysis",
  user: "analytics",
  status: "SUCCEEDED",
  startTime: "2026-05-28 18:15:44",
  duration: "28 min",
  cores: 32,
  memoryPerExecutor: "5 GB",
  summary: {
    appUptime: "32 min",
    completedJobs: 2,
    failedJobs: 0,
    completedStages: 4,
    activeBatches: 0,
    totalTasks: 192,
    usedMemory: "4.1 GB",
    totalMemory: "5 GB",
  },
  jobs: [
    { id: 0, description: "join at CrossJoin.scala:112", submitted: "18:15:45", duration: "25 min", stages: "3/3", tasks: "160/160", status: "SUCCEEDED" },
    { id: 1, description: "save at CrossJoin.scala:145", submitted: "18:41:10", duration: "2.1 min", stages: "1/1", tasks: "32/32", status: "SUCCEEDED" },
  ],
  stages: [
    { id: 0, description: "join at CrossJoin.scala:112 (Scan A)", submitted: "18:15:46", duration: "3.2 min", tasks: "32/32", input: "12.4 GB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "8.2 GB", status: "COMPLETE", _isAnomalous: true, tasks_detail: generateShuffleTasks(32, "write") },
    { id: 1, description: "join at CrossJoin.scala:112 (Scan B)", submitted: "18:19:00", duration: "2.8 min", tasks: "32/32", input: "8.6 GB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "6.8 GB", status: "COMPLETE", _isAnomalous: true, tasks_detail: generateShuffleTasks(32, "write") },
    { id: 2, description: "join at CrossJoin.scala:112 (SortMergeJoin)", submitted: "18:21:50", duration: "19.2 min", tasks: "96/96", input: "0 B", output: "5.2 GB", shuffleRead: "15 GB", shuffleWrite: "0 B", status: "COMPLETE", _isAnomalous: true, tasks_detail: generateShuffleTasks(96, "read") },
    { id: 3, description: "save at CrossJoin.scala:145", submitted: "18:41:10", duration: "2.1 min", tasks: "32/32", input: "0 B", output: "5.2 GB", shuffleRead: "0 B", shuffleWrite: "0 B", status: "COMPLETE", tasks_detail: [] },
  ],
  executors: [
    { id: "1", address: "10.0.5.11:48121", status: "ACTIVE", cores: 4, memory: "5 GB", memoryUsed: "4.1 GB", taskActive: 0, taskCompleted: 24, taskFailed: 0, gcTime: "2.1 min", shuffleRead: "3.8 GB", shuffleWrite: "3.2 GB", _isAnomalous: true },
    { id: "2", address: "10.0.5.12:48122", status: "ACTIVE", cores: 4, memory: "5 GB", memoryUsed: "4.0 GB", taskActive: 0, taskCompleted: 23, taskFailed: 0, gcTime: "1.9 min", shuffleRead: "3.5 GB", shuffleWrite: "2.9 GB", _isAnomalous: true },
    { id: "3", address: "10.0.5.13:48123", status: "ACTIVE", cores: 4, memory: "5 GB", memoryUsed: "3.8 GB", taskActive: 0, taskCompleted: 25, taskFailed: 0, gcTime: "1.8 min", shuffleRead: "3.2 GB", shuffleWrite: "2.6 GB" },
    { id: "4", address: "10.0.5.14:48124", status: "ACTIVE", cores: 4, memory: "5 GB", memoryUsed: "4.2 GB", taskActive: 0, taskCompleted: 22, taskFailed: 0, gcTime: "2.3 min", shuffleRead: "4.1 GB", shuffleWrite: "3.5 GB", _isAnomalous: true },
    { id: "5", address: "10.0.5.15:48125", status: "ACTIVE", cores: 4, memory: "5 GB", memoryUsed: "3.9 GB", taskActive: 0, taskCompleted: 26, taskFailed: 0, gcTime: "1.7 min", shuffleRead: "3.0 GB", shuffleWrite: "2.4 GB" },
    { id: "6", address: "10.0.5.16:48126", status: "ACTIVE", cores: 4, memory: "5 GB", memoryUsed: "4.0 GB", taskActive: 0, taskCompleted: 24, taskFailed: 0, gcTime: "1.9 min", shuffleRead: "3.4 GB", shuffleWrite: "2.7 GB" },
    { id: "7", address: "10.0.5.17:48127", status: "ACTIVE", cores: 4, memory: "5 GB", memoryUsed: "3.7 GB", taskActive: 0, taskCompleted: 23, taskFailed: 0, gcTime: "1.8 min", shuffleRead: "3.1 GB", shuffleWrite: "2.5 GB" },
    { id: "8", address: "10.0.5.18:48128", status: "ACTIVE", cores: 4, memory: "5 GB", memoryUsed: "4.3 GB", taskActive: 0, taskCompleted: 25, taskFailed: 0, gcTime: "2.0 min", shuffleRead: "3.9 GB", shuffleWrite: "3.1 GB" },
  ],
  storage: [
    { id: 1, rddName: "Shuffle 中间数据 (persisted)", storageLevel: "Disk Serialized 1x", cachedSize: "15 GB", partitions: 96, inMemory: "0 B", onDisk: "15 GB" },
  ],
  sqlQueries: [
    {
      id: 0, description: "SELECT a.*, b.category FROM large_orders a JOIN dim_product b ON a.product_id = b.product_id WHERE a.dt='2026-05-28'", submitted: "18:15:50", duration: "26 min", details: "Completed",
      plan: [
        { nodeId: 1, name: "WholeStageCodegen (1)", metrics: { "duration": "19.2 min (瓶颈)" }, _isAnomalous: true, children: [
          { nodeId: 2, name: "SortMergeJoin", metrics: { "duration": "19 min", "shuffle read": "15 GB", "spill to disk": "8.4 GB" }, _isAnomalous: true, children: [
            { nodeId: 3, name: "Exchange (hash)", metrics: { "shuffle write": "8.2 GB", "data size": "12.4 GB" }, _isAnomalous: true, children: [
              { nodeId: 4, name: "Scan large_orders", metrics: { "read rows": "156,230,000", "input size": "12.4 GB" }, children: [] },
            ] },
            { nodeId: 5, name: "Exchange (hash)", metrics: { "shuffle write": "6.8 GB", "data size": "8.6 GB" }, _isAnomalous: true, children: [
              { nodeId: 6, name: "Scan dim_product", metrics: { "read rows": "98,452", "input size": "8.6 GB" }, children: [] },
            ] },
          ] },
        ] },
      ],
    },
  ],
  environment: [
    { key: "spark.sql.shuffle.partitions", value: "96" },
    { key: "spark.executor.memory", value: "5g" },
    { key: "spark.executor.cores", value: "4" },
    { key: "spark.sql.adaptive.enabled", value: "true" },
    { key: "spark.sql.adaptive.coalescePartitions.enabled", value: "true" },
    { key: "spark.shuffle.compress", value: "true" },
    { key: "spark.shuffle.spill.compress", value: "true" },
    { key: "spark.shuffle.file.buffer", value: "32k" },
    { key: "spark.reducer.maxSizeInFlight", value: "48m" },
    { key: "spark.sql.autoBroadcastJoinThreshold", value: "10485760 (10 MB)" },
  ],
  annotations: [
    {
      id: "shuffle-stage-join",
      targetType: "stage-row", targetId: "stage-2",
      title: "SortMergeJoin 阶段耗时 19.2 分钟",
      body: "整个 Job 的瓶颈在 Join 阶段：Shuffle Read 高达 <b>15 GB</b>，耗时 19.2 分钟。Stage 0 和 Stage 1 分别写入了 8.2 GB 和 6.8 GB 的 Shuffle 数据。Shuffle 是分布式计算中开销最大的操作之一。",
      severity: "critical", position: "inline"
    },
    {
      id: "shuffle-spill",
      targetType: "sql-node", targetId: "sql-spill",
      title: "Shuffle Spill 8.4 GB 到磁盘",
      body: "SortMergeJoin 操作发生了 <b>8.4 GB 的 Spill to Disk</b>。当内存不足以容纳 Shuffle 数据时，Spark 会将部分数据写入磁盘，严重拖慢性能（磁盘 I/O 比内存慢 100x）。<br><br><b>解决方案：</b><br>1. 增加 <code>spark.executor.memory</code><br>2. 调整 <code>spark.sql.shuffle.partitions</code>，增加分区数分散数据<br>3. 检查是否可以用 Broadcast Join 替代（小表 < 10 MB 时自动广播）",
      severity: "critical", position: "bottom"
    },
    {
      id: "shuffle-broadcast",
      targetType: "sql-node", targetId: "env-broadcast",
      title: "Broadcast Join 阈值太小",
      body: "当前 <code>spark.sql.autoBroadcastJoinThreshold</code> = <b>10 MB</b>。dim_product 表 8.6 GB 虽不适合广播，但可以考虑对 dim_product 做筛选/去重减小体积，或对 large_orders 做分区裁剪减少数据量。<br><br>另外考虑：<code>spark.shuffle.file.buffer</code> 仅 32 KB，可以调大到 <b>64 KB-128 KB</b> 减少磁盘 I/O 次数。",
      severity: "warning", position: "bottom"
    },
    {
      id: "shuffle-executor",
      targetType: "executor-row", targetId: "executor-4",
      title: "Executor 4 Shuffle 负载最高",
      body: "Executor 4 的 Shuffle Read 为 <b>4.1 GB</b>，GC Time <b>2.3 分钟</b>。虽然各 Executor 的 Shuffle 量比较接近（3-4 GB），但总量仍然很高。增加 Shuffle 分区数可以让每个 Executor 处理更少的数据。",
      severity: "warning", position: "inline"
    },
  ],
};

function generateShuffleTasks(count: number, mode: "write" | "read"): SparkApp["stages"][0]["tasks_detail"] {
  const tasks: SparkApp["stages"][0]["tasks_detail"] = [];
  for (let i = 0; i < count; i++) {
    const isWrite = mode === "write";
    tasks.push({
      index: i,
      taskId: 700 + i,
      attempt: 0,
      status: "SUCCESS",
      locality: "PROCESS_LOCAL",
      executorId: String((i % 8) + 1),
      taskTime: isWrite ? `${(1 + Math.random() * 2).toFixed(1)} min` : `${(10 + Math.random() * 10).toFixed(1)} min`,
      gcTime: isWrite ? `${5 + Math.floor(Math.random() * 10)} s` : `${50 + Math.floor(Math.random() * 30)} s`,
      inputSize: isWrite ? `${300 + Math.floor(Math.random() * 200)} MB` : "0 B",
      shuffleReadSize: isWrite ? "0 B" : `${120 + Math.floor(Math.random() * 80)} MB`,
      shuffleWriteSize: isWrite ? `${200 + Math.floor(Math.random() * 100)} MB` : "0 B",
      errors: "",
      _isAnomalous: mode === "read" && i % 10 === 0,
      _anomalyReason: mode === "read" && i % 10 === 0 ? "大量 Shuffle Read 导致 Spill to Disk" : undefined,
    });
  }
  return tasks;
}
