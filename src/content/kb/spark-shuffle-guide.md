---
title: "数据倾斜与 Shuffle 诊断：Spark Shuffle 原理与调优实践"
description: "深入理解 Spark Shuffle 机制，从 Hash Shuffle 到 Sort Shuffle 的演进。手把手带你在 Spark UI Lab 中定位数据倾斜和 Shuffle 瓶颈。"
date: 2026-05-25
tags: [spark, shuffle, 性能调优, 大数据]
topic: spark
order: 6
---

Spark Shuffle 是分布式计算中最核心也最容易成为瓶颈的环节。本文从原理出发，梳理 Shuffle 的演进历程和调优实践。

## 什么是 Shuffle

Shuffle 是 Spark 中**跨分区重新分布数据**的过程。任何需要按 Key 聚合或排序的操作（groupByKey、reduceByKey、join 等）都会触发 Shuffle。

## Shuffle 的演进

### 1. Hash Shuffle（Spark 1.x 早期）

每个 Mapper 为每个 Reducer 创建一个文件，导致 **M * R** 个文件。当 Task 数量多时，文件句柄耗尽。

### 2. Consolidation Hash Shuffle

同一个 Core 上运行的 Mapper 共享输出文件，将文件数从 M * R 降到 **Cores * R**。

### 3. Sort Shuffle（Spark 1.2+）

默认机制，每个 Mapper 只生成**两个文件**：一个数据文件 + 一个索引文件。

```
// SortShuffleWriter 核心流程
override def write(records: Iterator[Product2[K, V]]): Unit = {
  // 1. 先写入内存缓冲区
  // 2. 缓冲区满则 spill 到磁盘并排序
  // 3. 最后 merge 所有 spill 文件，生成单个数据文件 + 索引文件
}
```

### 4. Tungsten Sort Shuffle

利用堆外内存和 sun.misc.Unsafe 直接操作序列化二进制数据，减少 GC 开销。

## 核心调优参数

| 参数 | 默认值 | 建议 |
|------|--------|------|
| `spark.sql.shuffle.partitions` | 200 | 根据数据量调整，每分区 128MB-256MB |
| `spark.shuffle.file.buffer` | 32KB | 大内存可调到 64KB-128KB |
| `spark.reducer.maxSizeInFlight` | 48MB | Reduce 端同时拉取的数据量 |
| `spark.shuffle.sort.bypassMergeThreshold` | 200 | 分区数少于此值时跳过排序，减少延迟 |

## 实战诊断：在 Spark UI Lab 中定位 Shuffle 问题

读完原理，来模拟器中动手实践。

> 🖥️ 打开 **[Spark UI Lab — 数据倾斜场景](/spark-ui-lab/data-skew)** 和 **[大量 Shuffle 场景](/spark-ui-lab/shuffle-heavy)**，跟着步骤走。

### 诊断数据倾斜（2 分钟）

1. 切换场景到 **数据倾斜（Data Skew）**，点击 **Stages** 标签页
2. 观察 Stage 3 的行——Shuffle Read 高达 **4.8 GB**，Duration 达到 **8.2 min**，已是异常信号
3. **点击 Stage 3** 进入 Task 详情。这是关键页面：
   - 滚动查找标注 🔴 的 Task 23——它的 Shuffle Read 为 **2.1 GB**
   - 而其他 Task 仅 **40-80 MB**——差距高达 38 倍
   - 这就是数据倾斜的典型特征：单个 Task 数据量远超平均
4. 切换到 **Executors** 标签页，Executor 3 的 GC Time 是其他 Executor 的 **4 倍**（48s vs 10s）

### 诊断大量 Shuffle（2 分钟）

1. 切换到场景 **大量 Shuffle（Shuffle Heavy）**，看 **Stages** 标签
2. Stage 2（SortMergeJoin）耗时 **19.2 min**，Shuffle Read 总计 **15 GB**
3. 进入 **SQL** 标签页，展开查询计划——可以看到 `spill to disk: 8.4 GB`，说明内存不足以容纳 Shuffle 数据
4. 切换到 **Environment** 标签，观察 `spark.sql.autoBroadcastJoinThreshold` 仅 **10 MB**——如果有一边表能裁剪到 < 10 MB，就可以避免这场 Shuffle

### 你能回答吗？

- Task 23 的 Shuffle Read 2.1 GB，其他 Task 平均多少？这个差距意味着什么？
- SortMergeJoin 的 spill 8.4 GB 是怎么产生的？调整哪个参数可以缓解？

## 生产环境案例

某日处理 5TB 数据的 ETL 任务，Shuffle 耗时占比从 60% 降到 25%，手段：

1. 将 `spark.sql.shuffle.partitions` 从 200 调至 800
2. 开启 `spark.shuffle.compress=true`（默认开启）
3. 将 `spark.shuffle.file.buffer` 调到 64KB
4. 使用 Kryo 序列化替代 Java 序列化
