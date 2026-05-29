---
title: "数据倾斜与 OOM：Spark 性能调优实战指南"
description: "从资源配置、数据倾斜处理、算子选择、序列化、GC 调优等维度，总结生产环境 Spark 作业优化实战经验。配合 Spark UI Lab 手把手排查数据倾斜和 OOM。"
date: 2026-05-29
tags: [spark, 调优, 数据倾斜, 序列化, GC]
topic: spark
order: 4
---

Spark 调优是一个系统工程，涉及资源配置、代码编写、数据处理等多个层面。

## 一、资源配置调优

### 1.1 Executor 配置公式

```
总核数 ≈ 总数据量(GB) / 单分区处理量(128MB)
Executor 数量 = 总核数 / 每 Executor 核数
```

示例：处理 200GB 数据
- 总核数 ≈ 200GB / 128MB ≈ 1600
- 每 Executor 4 核 → 400 个 Executor

### 1.2 关键配置

| 参数 | 建议 | 原因 |
|------|------|------|
| `spark.sql.shuffle.partitions` | 总核数 × 2~3 | 太少则数据倾斜，太多则小文件 |
| `spark.executor.memoryOverhead` | executor.memory × 0.1（至少 384MB） | 堆外内存，防止 YARN 杀容器 |
| `spark.dynamicAllocation.enabled` | true | 动态调整 Executor 数量 |

## 二、数据倾斜处理

数据倾斜是 Spark 作业慢的最常见原因。典型症状：某个 Task 耗时远超其他 Task。

### 2.1 检测方法

- Spark UI → Stage 详情 → 看各 Task 数据量和耗时分布
- 某 Task 的 Shuffle Read 远超平均值 → 数据倾斜

### 2.2 解决方案

**方案一：加盐法（Salting）** — 对倾斜的 Key 加随机前缀打散

```scala
// 给热点 key 加随机后缀
val salted = df.withColumn("salted_key",
  concat(col("key"), lit("_"), (rand() * 100).cast("int"))
)
// 聚合后再去掉后缀
```

**方案二：Broadcast Join** — 小表广播，避免 Shuffle

```scala
import org.apache.spark.sql.functions.broadcast
bigDF.join(broadcast(smallDF), "key")
// 条件：小表 < spark.sql.autoBroadcastJoinThreshold（默认 10MB）
```

**方案三：两阶段聚合** — 先本地聚合再加全局聚合

```scala
// 第一阶段：加随机前缀聚合
// 第二阶段：去掉前缀再聚合
```

**方案四：过滤热点 Key 单独处理**

将倾斜的 Key 单独取出处理，非倾斜的 Key 正常处理，最后 Union 结果。

### 2.3 Broadcast Join 阈值

```scala
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", 50 * 1024 * 1024) // 50MB
```

## 三、算子选择

| 场景 | 推荐 | 避免 |
|------|------|------|
| 聚合 | reduceByKey / aggregateByKey | groupByKey |
| 去重 | dropDuplicates / distinct | groupBy + first |
| 连接 | Broadcast Join（小表） | 全量 Shuffle Join |
| 分区操作 | mapPartitions / foreachPartition | 逐行 map |
| Reduce 端 | 先 filter 再 join | 先 join 再 filter |

## 四、序列化优化

| 序列化器 | 速度 | 体积 | 兼容性 |
|---------|------|------|--------|
| Java | 慢 | 大 | 所有类型 |
| **Kryo** | 快（10x） | 小 | 需注册自定义类 |

```scala
spark.conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
spark.conf.set("spark.kryo.registrationRequired", "true")
```

## 五、GC 调优

GC 问题通常表现为：Task 内出现大量 GC 停顿，Executor 日志报 GC overhead。

**建议**：
- 使用 **G1GC**：`spark.executor.extraJavaOptions=-XX:+UseG1GC`
- 开启堆外内存减少 GC 压力
- 减少 Cache 的数据量，避免频繁 Full GC

## 六、小文件问题

大量小文件会导致：扫描时打开过多文件句柄、NameNode 压力大。

**解决**：
- 写入前 `repartition` / `coalesce` 控制分区数
- 使用 Delta Lake / Iceberg 的小文件合并功能
- 调整 `spark.sql.files.maxPartitionBytes` 控制分区大小

## 实战诊断：在 Spark UI Lab 中排查数据倾斜与 OOM

本文涉及两种常见故障，来模拟器中逐一定位。

> 🖥️ 打开 **[Spark UI Lab — 数据倾斜](/spark-ui-lab/data-skew)** 和 **[OOM 场景](/spark-ui-lab/oom)**。

### 排查数据倾斜（3 步）

1. 在 **数据倾斜** 场景中，进入 **Stages** 标签页。注意 Stage 3 的 Duration（8.2 min）——远高于其他 Stage（约 1-2 min）
2. 点击 Stage 3 进入 Task 详情。观察"Shuffle Read"列：
   - Task 23：**2.1 GB** 🔴
   - 其余 Task：40-80 MB
   - 差距 **38 倍**，这就是本文 2.1 节讲的倾斜特征
3. 去看 **Environment** 标签——`spark.sql.adaptive.skewJoin.enabled` = **false**。打开这个配置就能让 AQE 自动拆分倾斜分区，对应本文 2.2 节的方案

### 排查 OOM（3 步）

1. 切换到 **OOM** 场景，进入 **Executors** 标签页
2. Executor 2 和 Executor 3 的状态为 🔴 **FAILED**，Memory Used 接近 100%
3. 进入 **Stages** 标签，点击 Stage 3（FAILED）进入 Task 详情——滚动查看 Errors 列，看到 `OutOfMemoryError: Java heap space`

### 自我检测

进入 Spark UI Lab 后，不看本文，你能说出：
- 数据倾斜在 Stage 详情中看哪两列？
- OOM 在 Executors 页面看哪几个指标？
- 这两个问题的快捷键解决方案分别是什么？

## 六（续）、小文件问题

详见《[小文件问题诊断](/kb/spark/spark-small-files)》专题文章。
