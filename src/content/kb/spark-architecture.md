---
title: "Spark 核心架构"
description: "Spark 的基本架构：Driver、Executor、Cluster Manager、DAG Scheduler 等核心组件。"
date: 2026-05-28
tags: [spark, 架构, 基础]
topic: spark
order: 1
---

Spark 是一个分布式计算引擎，核心设计理念是**内存计算**和**DAG 调度**。

## 核心组件

```
┌─────────────────────────────────────────┐
│              Driver Program              │
│  SparkContext → DAGScheduler → TaskScheduler │
└──────────────────┬──────────────────────┘
                   │
          Cluster Manager
          (YARN / K8s / Standalone)
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
  Executor     Executor      Executor
  (JVM + tasks)  (JVM + tasks)  (JVM + tasks)
```

## 关键概念

- **RDD (Resilient Distributed Dataset)**：不可变的分布式数据集合，支持容错
- **DataFrame/Dataset**：高层 API，带有 Schema 信息，Catalyst 优化器可做查询优化
- **DAG Scheduler**：将 RDD 的血缘关系转换为 Stage DAG
- **Task Scheduler**：将 Task 分发到 Executor 执行

## 作业执行流程

1. Action 算子触发 Job
2. DAG Scheduler 根据宽依赖划分 Stage
3. Task Scheduler 将 TaskSet 提交到 Executor
4. Executor 多线程执行 Task
5. Task 完成后将结果返回 Driver
