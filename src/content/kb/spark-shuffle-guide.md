---
title: "Spark Shuffle 原理与调优实践"
description: "深入理解 Spark Shuffle 机制，从 Hash Shuffle 到 Sort Shuffle 的演进，以及生产环境调优参数。"
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

## 生产环境案例

某日处理 5TB 数据的 ETL 任务，Shuffle 耗时占比从 60% 降到 25%，手段：

1. 将 `spark.sql.shuffle.partitions` 从 200 调至 800
2. 开启 `spark.shuffle.compress=true`（默认开启）
3. 将 `spark.shuffle.file.buffer` 调到 64KB
4. 使用 Kryo 序列化替代 Java 序列化
