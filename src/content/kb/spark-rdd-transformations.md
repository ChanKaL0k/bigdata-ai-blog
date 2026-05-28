---
title: "Spark RDD 算子分类与应用"
description: "Transformations vs Actions 的区别，窄依赖与宽依赖的判断，常用算子性能对比。"
date: 2026-05-28
tags: [spark, rdd, 算子]
topic: spark
order: 5
---

理解 RDD 算子是掌握 Spark 的基础。算子分为 Transformation（转换）和 Action（动作）两类。

## 窄依赖 vs 宽依赖

窄依赖：父 RDD 的每个分区最多被一个子分区依赖（1:1 映射）
宽依赖：父 RDD 的每个分区被多个子分区依赖（产生 Shuffle）

## 常用 Transformation

| 算子 | 类型 | 是否 Shuffle | 说明 |
|------|------|-------------|------|
| `map` | transform | 否 | 一对一映射 |
| `filter` | transform | 否 | 过滤数据 |
| `flatMap` | transform | 否 | 一对多映射 |
| `mapPartitions` | transform | 否 | 按分区处理，批量操作更高效 |
| `groupByKey` | transform | 是 | 按 Key 分组 |
| `reduceByKey` | transform | 是 | 先本地聚合再 Shuffle，优于 groupByKey |
| `join` | transform | 是 | 连接两个 RDD |
| `coalesce` | transform | 否 | 减少分区数（窄依赖） |
| `repartition` | transform | 是 | 重分布（宽依赖） |

## 常用 Action

| 算子 | 说明 |
|------|------|
| `collect` | 将所有数据拉到 Driver，慎用 |
| `count` | 统计行数 |
| `take(n)` | 取前 n 条 |
| `reduce` | 聚合运算 |
| `saveAsTextFile` | 写入文件系统 |

## 最佳实践

- **reduceByKey > groupByKey**：Map 端预聚合减少 Shuffle 数据量
- **mapPartitions > map**：需要初始化连接时（如数据库连接），按分区复用
- **coalesce > repartition**：仅减少分区且无需 Shuffle 时
