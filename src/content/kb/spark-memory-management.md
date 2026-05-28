---
title: "Spark 内存管理详解"
description: "堆内堆外内存的区别，统一内存管理机制（UnifiedMemoryManager），Storage 和 Execution 内存的动态抢占。"
date: 2026-05-29
tags: [spark, 内存管理, 堆内内存, 堆外内存, 调优]
topic: spark
order: 2
---

Spark 的内存管理是性能调优的核心。理解堆内/堆外内存、Storage/Execution 内存的划分与动态调整，是写出高性能 Spark 作业的前提。

## 内存分类

Spark 使用内存分为两大类：

### 1. 堆内内存（On-Heap）

由 JVM 管理，受 GC 影响。Executor 启动时通过 `spark.executor.memory` 指定。

- JVM 堆内分为：Storage 内存、Execution 内存、User 内存、Reserved 内存
- GC 暂停会阻塞所有 Task 线程

### 2. 堆外内存（Off-Heap）

直接通过 `sun.misc.Unsafe` 分配，不受 JVM GC 管理。通过 `spark.memory.offHeap.enabled=true` 开启。

**优势**：
- 避免 GC 停顿
- 适合缓存大量数据
- Tungsten 项目使用堆外内存做排序和聚合

## 统一内存管理（Spark 1.6+）

```
┌──────────────────────────────────────────┐
│            Reserved Memory (300MB)        │
├──────────────────────────────────────────┤
│            User Memory (40%)              │
│   (存储自定义数据结构、Spark 内部元数据)     │
├──────────────┬───────────────────────────┤
│ Storage (50%)│  Execution (50%)          │
│ RDD Cache    │ Shuffle / Join / Sort /   │
│ Broadcast    │ Aggregation              │
└──────────────┴───────────────────────────┘
│←────────── Unified Memory ────────────→│
```

### 动态抢占机制

Storage 和 Execution 之间可以互相借用：

- **Execution 借用 Storage**：当 Execution 内存不足，可以驱逐 Storage 中缓存的数据（写入磁盘）
- **Storage 借用 Execution**：当 Execution 未占用时，Storage 可以使用空闲空间；但当 Execution 需要时，Storage 必须归还

## 核心参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `spark.memory.fraction` | 0.6 | Unified Memory 占总堆内存的比例 |
| `spark.memory.storageFraction` | 0.5 | Storage 占 Unified Memory 的比例 |
| `spark.memory.offHeap.enabled` | false | 是否启用堆外内存 |
| `spark.memory.offHeap.size` | 0 | 堆外内存大小 |

## 常见 OOM 场景

1. **Shuffle 阶段 OOM**：reduce 端拉取数据量过大 → 增大 Execution 内存或调小 `spark.sql.shuffle.partitions`
2. **Cache 过多**：Storage 内存被撑满 → 减少 Cache 或增加内存
3. **用户代码 OOM**：collect() 拉取大量数据到 Driver → 避免对大表 collect
4. **堆外 OOM**：Tungsten 排序 / Netty 网络缓冲区过大 → 限制堆外内存大小

## 调优建议

- 开启堆外内存可显著减少 GC 压力，建议设置 `spark.memory.offHeap.size` 为 executor 内存的 10%-20%
- 监控 Storage/Execution 的使用比例，合理调整 `spark.memory.storageFraction`
- 大数据量 join 操作优先考虑 Broadcast Join（小表广播）减少 Shuffle
