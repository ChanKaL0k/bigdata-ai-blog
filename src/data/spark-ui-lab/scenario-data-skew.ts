import type { SparkApp } from "./types";

export const dataSkew: SparkApp = {
  id: "application_1716201600000_0042",
  name: "Spark SQL — daily_user_behavior_agg",
  user: "data-team",
  status: "SUCCEEDED",
  startTime: "2026-05-28 03:00:15",
  duration: "18 min",
  cores: 24,
  memoryPerExecutor: "4 GB",
  summary: {
    appUptime: "22 min",
    completedJobs: 3,
    failedJobs: 0,
    completedStages: 9,
    activeBatches: 0,
    totalTasks: 216,
    usedMemory: "3.2 GB",
    totalMemory: "4 GB",
  },
  jobs: [
    { id: 0, description: "count at DailyUserBehavior.scala:42", submitted: "03:00:16", duration: "2.1 s", stages: "1/1", tasks: "1/1", status: "SUCCEEDED" },
    { id: 1, description: "json at DailyUserBehavior.scala:58", submitted: "03:00:19", duration: "4.5 min", stages: "5/5", tasks: "120/120", status: "SUCCEEDED" },
    { id: 2, description: "save at DailyUserBehavior.scala:85", submitted: "03:04:50", duration: "12 min", stages: "3/3", tasks: "96/96", status: "SUCCEEDED" },
  ],
  stages: [
    { id: 0, description: "count at DailyUserBehavior.scala:42", submitted: "03:00:16", duration: "2.1 s", tasks: "1/1", input: "0 B", output: "0 B", shuffleRead: "0 B", shuffleWrite: "0 B", status: "COMPLETE", tasks_detail: [] },
    { id: 1, description: "json at DailyUserBehavior.scala:58 (阶段 1)", submitted: "03:00:19", duration: "2.1 min", tasks: "24/24", input: "3.6 GB", output: "0 B", shuffleRead: "0 B", shuffleWrite: "2.8 GB", status: "COMPLETE", tasks_detail: [] },
    { id: 2, description: "json at DailyUserBehavior.scala:58 (阶段 2)", submitted: "03:02:20", duration: "1.5 min", tasks: "24/24", input: "0 B", output: "0 B", shuffleRead: "2.8 GB", shuffleWrite: "1.9 GB", status: "COMPLETE", tasks_detail: [] },
    { id: 3, description: "json at DailyUserBehavior.scala:58 (阶段 3)", submitted: "03:03:50", duration: "8.2 min", tasks: "48/48", input: "0 B", output: "4.8 GB", shuffleRead: "4.8 GB", shuffleWrite: "0 B", status: "COMPLETE", _isAnomalous: true, tasks_detail: generateSkewedTasks(48) },
    { id: 4, description: "save at DailyUserBehavior.scala:85 (阶段 1)", submitted: "03:04:50", duration: "3.1 min", tasks: "24/24", input: "0 B", output: "0 B", shuffleRead: "4.8 GB", shuffleWrite: "1.1 GB", status: "COMPLETE", tasks_detail: [] },
    { id: 5, description: "save at DailyUserBehavior.scala:85 (阶段 2)", submitted: "03:08:00", duration: "1.8 min", tasks: "48/48", input: "0 B", output: "2.1 GB", shuffleRead: "1.1 GB", shuffleWrite: "0 B", status: "COMPLETE", tasks_detail: [] },
  ],
  executors: [
    { id: "1", address: "10.0.1.11:37121", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "2.1 GB", taskActive: 0, taskCompleted: 36, taskFailed: 0, gcTime: "12 s", shuffleRead: "1.1 GB", shuffleWrite: "876 MB" },
    { id: "2", address: "10.0.1.12:37122", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "1.8 GB", taskActive: 0, taskCompleted: 35, taskFailed: 0, gcTime: "11 s", shuffleRead: "926 MB", shuffleWrite: "724 MB" },
    { id: "3", address: "10.0.1.13:37123", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "3.2 GB", taskActive: 1, taskCompleted: 34, taskFailed: 0, gcTime: "48 s", shuffleRead: "2.8 GB", shuffleWrite: "1.1 GB", _isAnomalous: true },
    { id: "4", address: "10.0.1.14:37124", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "2.0 GB", taskActive: 0, taskCompleted: 36, taskFailed: 0, gcTime: "10 s", shuffleRead: "987 MB", shuffleWrite: "856 MB" },
    { id: "5", address: "10.0.1.15:37125", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "1.9 GB", taskActive: 0, taskCompleted: 37, taskFailed: 0, gcTime: "9 s", shuffleRead: "892 MB", shuffleWrite: "724 MB" },
    { id: "6", address: "10.0.1.16:37126", status: "ACTIVE", cores: 4, memory: "4 GB", memoryUsed: "2.2 GB", taskActive: 0, taskCompleted: 38, taskFailed: 0, gcTime: "13 s", shuffleRead: "1.2 GB", shuffleWrite: "941 MB" },
  ],
  storage: [
    { id: 1, rddName: "每日用户行为数据 (JSON)", storageLevel: "Disk Memory Deserialized 1x", cachedSize: "2.1 GB", partitions: 24, inMemory: "1.2 GB", onDisk: "987 MB" },
    { id: 2, rddName: "按用户ID聚合结果", storageLevel: "Disk Serialized 1x", cachedSize: "856 MB", partitions: 48, inMemory: "0 B", onDisk: "856 MB" },
  ],
  sqlQueries: [
    {
      id: 0, description: "SELECT user_id, COUNT(*), SUM(amount) FROM user_behavior GROUP BY user_id", submitted: "03:00:45", duration: "15 min", details: "Completed",
      plan: [
        { nodeId: 1, name: "WholeStageCodegen (1)", metrics: { "duration": "14.8 min", "output rows": "45,231,892" }, children: [
          { nodeId: 2, name: "HashAggregate (GROUP BY user_id)", metrics: { "shuffle read": "4.8 GB", "spill": "1.2 GB" }, _isAnomalous: true, children: [
            { nodeId: 3, name: "Exchange (hashpartitioning)", metrics: { "shuffle write": "2.8 GB", "shuffle read": "0 B" }, children: [
              { nodeId: 4, name: "Scan json", metrics: { "read rows": "45,231,892", "input size": "3.6 GB" }, children: [] },
            ] },
          ] },
        ] },
      ],
    },
  ],
  environment: [
    { key: "spark.sql.shuffle.partitions", value: "200" },
    { key: "spark.executor.memory", value: "4g" },
    { key: "spark.executor.cores", value: "4" },
    { key: "spark.sql.adaptive.enabled", value: "true" },
    { key: "spark.sql.adaptive.skewJoin.enabled", value: "false" },
    { key: "spark.sql.adaptive.coalescePartitions.enabled", value: "true" },
    { key: "spark.serializer", value: "org.apache.spark.serializer.KryoSerializer" },
    { key: "spark.shuffle.compress", value: "true" },
  ],
  annotations: [
    {
      id: "skew-stage-overview",
      targetType: "stage-row", targetId: "stage-3",
      title: "Stage 3 出现严重数据倾斜",
      body: "Stage 3 的 Shuffle Read 为 <b>4.8 GB</b>，看似正常，但分布极不均衡。点击 Stage 3 查看 Task 级别详情，会发现一个 Task 读取了 <b>2.1 GB</b>（占总量的 44%），而其余 47 个 Task 平均仅读取 ~55 MB。这是因为分区键 <code>user_id</code> 存在热点值，导致某个 Key 的数据量远超其他。",
      severity: "critical", position: "inline"
    },
    {
      id: "skew-task-detail",
      targetType: "task-cell", targetId: "stage-3-task-23", targetField: "shuffleReadSize",
      title: "倾斜的 Task 23",
      body: "Task 23 的 Shuffle Read 高达 <b>2.1 GB</b>，是其他 Task 的 <b>38 倍</b>。所有下游 Task 都必须等待它完成，导致整个 Stage 耗时 <b>8.2 分钟</b>。这是典型的数据倾斜（Data Skew）现象。<br><br><b>解决方案：</b>使用 <code>salting</code>（加盐）技术打散热点 Key，或者开启 <code>spark.sql.adaptive.skewJoin.enabled</code>。",
      severity: "critical", position: "right"
    },
    {
      id: "skew-executor",
      targetType: "executor-row", targetId: "executor-3",
      title: "Executor 3 压力异常",
      body: "Executor 3 负责处理倾斜的 Task 23，其 Shuffle Read 高达 <b>2.8 GB</b>（是其他 Executor 的 2-3 倍），GC 耗时 <b>48 秒</b>（其他仅 9-13 秒）。内存使用也更高（3.2 GB / 4 GB）。",
      severity: "warning", position: "inline"
    },
    {
      id: "skew-env-config",
      targetType: "sql-node", targetId: "env-skew-join",
      title: "未开启 Skew Join 优化",
      body: "当前配置中 <code>spark.sql.adaptive.skewJoin.enabled</code> 为 <b>false</b>。开启后 Spark AQE 会自动检测倾斜分区并拆分处理。这是最简单的优化手段。",
      severity: "info", position: "bottom"
    },
  ],
};

function generateSkewedTasks(count: number): SparkApp["stages"][0]["tasks_detail"] {
  const tasks: SparkApp["stages"][0]["tasks_detail"] = [];
  for (let i = 0; i < count; i++) {
    const isSkewed = i === 23;
    tasks.push({
      index: i,
      taskId: 300 + i,
      attempt: 0,
      status: "SUCCESS",
      locality: isSkewed ? "ANY" : "PROCESS_LOCAL",
      executorId: isSkewed ? "3" : String((i % 5) + 1),
      taskTime: isSkewed ? "8.2 min" : i < 10 ? "32 s" : `${15 + (i % 10)} s`,
      gcTime: isSkewed ? "36 s" : `${1 + (i % 3)} s`,
      inputSize: isSkewed ? "0 B" : "0 B",
      shuffleReadSize: isSkewed ? "2.1 GB" : `${40 + Math.floor(Math.random() * 80)} MB`,
      shuffleWriteSize: "0 B",
      errors: "",
      _isAnomalous: isSkewed,
      _anomalyReason: isSkewed ? "Shuffle Read 是其他 Task 的 38 倍" : undefined,
    });
  }
  return tasks;
}
