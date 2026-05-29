---
title: "慢任务与 GC 诊断：Spark 核心架构与执行流程"
description: "Driver、Executor、DAG Scheduler、Task Scheduler 的协作机制。配合 Spark UI Lab 学习如何通过 Task 指标定位慢任务和 GC 问题。"
date: 2026-05-29
tags: [spark, 架构, 核心原理]
topic: spark
order: 1
---

Spark 是一个基于内存的分布式计算引擎。本文梳理其核心架构组件和作业执行全流程。

## 核心组件

Spark 采用 Master-Slave 架构，核心组件如下：

| 组件 | 角色 | 职责 |
|------|------|------|
| **Driver** | 指挥者 | 解析用户代码 → 生成 DAG → 调度 Task → 收集结果 |
| **Executor** | 执行者 | 运行 Task、缓存数据、向 Driver 汇报状态 |
| **Cluster Manager** | 资源管理者 | 分配计算资源（支持 YARN / K8s / Standalone） |

### Driver 详解

Driver 是 Spark 应用的入口，运行 `main()` 方法的 JVM 进程。核心工作：

1. **创建 SparkContext**：与 Cluster Manager 通信，申请 Executor 资源
2. **DAG 生成与优化**：将 RDD 转换操作构建为 DAG，交由 Catalyst / Tungsten 优化
3. **Stage 划分**：根据宽依赖（Shuffle）切分 Stage
4. **Task 分发**：将 TaskSet 交给 TaskScheduler，分配到各 Executor 执行
5. **结果收集**：收集 Task 执行结果，返回给用户代码

### Executor 详解

Executor 是实际干活的 JVM 进程，运行在集群的 Worker 节点上：

- **多线程执行 Task**：每个 Core 同时运行一个 Task
- **数据缓存**：通过 BlockManager 管理 RDD 缓存（内存/磁盘）
- **Shuffle 服务**：写 Shuffle 文件供下游 Stage 拉取
- **心跳上报**：定期向 Driver 汇报运行状态

### Cluster Manager

支持三种模式：

| 模式 | 适用场景 | 特点 |
|------|---------|------|
| Standalone | 开发测试 | Spark 自带，无需外部依赖 |
| YARN | 生产环境 | 与 Hadoop 生态共用资源 |
| Kubernetes | 云原生 | 容器化部署，弹性伸缩 |

## 作业执行完整流程

```
用户提交代码
    ↓
Driver 解析代码，构建 RDD DAG
    ↓
DAG Scheduler 根据 Shuffle 依赖切分 Stage
    ↓
每个 Stage 内部生成 TaskSet（Task 数 = 数据分区数）
    ↓
TaskScheduler 将 Task 分发到 Executor
    ↓
Executor 多线程执行 Task
    ↓
Task 完成后 Driver 收集结果，触发下一个 Stage
    ↓
最终结果返回给用户
```

### 关键概念

**窄依赖 vs 宽依赖**：
- 窄依赖：父 RDD 的每个分区最多被一个子分区使用（map、filter、union）
- 宽依赖：父 RDD 分区被多个子分区使用（groupByKey、reduceByKey、join），触发 Shuffle，划分 Stage 边界

**Stage 划分**：
- 遇到 Shuffle 操作就切分一个新 Stage
- 同一个 Stage 内的算子可以流水线（Pipeline）执行，不必等全部完成

## 核心配置

| 参数 | 说明 | 建议值 |
|------|------|--------|
| `spark.driver.memory` | Driver 内存 | 1-4G（大任务适当增加） |
| `spark.executor.memory` | 每个 Executor 内存 | 4-8G |
| `spark.executor.cores` | 每个 Executor 核数 | 2-4 |
| `spark.executor.instances` | Executor 数量 | 根据总数据量估算 |
| `spark.default.parallelism` | 默认并行度 | Executor 总核数 × 2~3 |

## 实战诊断：在 Spark UI Lab 中定位慢任务

理解了 Driver 调度 Task 和 Executor 执行 Task 的机制后，来模拟器中体验一下当某些 Task 异常缓慢时 Spark UI 长什么样。

> 🖥️ 打开 **[Spark UI Lab — GC 耗时 / 慢任务](/spark-ui-lab/slow-tasks)**。

### Step by Step

1. 页面加载后看到 **Jobs** 标签——Job 1（save）耗时 **24 min**，而 Job 0 仅 4.2 min。点击进入 **Stages** 标签
2. 注意 Stage 3（Scan + Join）：Duration **23.5 min**，是整个 Job 的瓶颈。点击该 Stage 进入 Task 详情
3. 在 Task 详情中，关注两个关键列：
   - **GC Time**：Task 3、7、15、19 的 GC Time 高达 **32-42 秒**——正常情况下 GC Time 应 < 总 Task 时间的 5%
   - **Task Time**：这些 Task 耗时 **2.8-3.2 min**，是其他 Task 的 3-5 倍
4. 切换到 **Executors** 标签：
   - Executor 4 的 GC Time 累计 **3.2 分钟**，Memory Used **2.9 GB / 3 GB**（97%），几乎耗尽
   - 这说明 Executor 内存不足，JVM 频繁 Full GC 拖慢了 Task
5. 切换到 **Environment** 标签——`spark.executor.memory` = **3g**。对比 Executor 4 的使用率（97%），内存配置明显不足

### 什么是 GC Time 过高？

GC Time 占 Task Time 的比例是衡量 JVM 压力的关键指标。正常情况下应 < 5%，超过 10% 说明存在内存瓶颈。这些 Task 的 GC Time 占比达 15-22%，说明 Executor 在拼命做垃圾回收而不是执行计算。

### 你能诊断吗？

不看本文，进 Spark UI Lab 切换到慢任务场景，尝试回答：
- 哪些 Task 是异常的？你通过什么指标判断的？
- 建议把 `spark.executor.memory` 调到多少？
