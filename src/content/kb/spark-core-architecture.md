---
title: "Spark 核心架构与执行流程"
description: "Driver、Executor、DAG Scheduler、Task Scheduler 的协作机制，以及 Spark 作业从提交到执行完成的完整生命周期。"
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
