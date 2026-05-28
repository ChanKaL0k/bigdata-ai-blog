---
title: "Flink Watermark 与乱序处理深度解析"
description: "理解 Flink 事件时间、Watermark 生成策略、处理迟到数据的三种方式，以及生产环境配置。"
date: 2026-05-20
tags: [flink, watermark, 流处理, 事件时间]
topic: flink
---

Flink 的事件时间和 Watermark 是流处理中理解门槛最高但也最重要的概念。本文分享我在生产环境踩过的坑和总结的最佳实践。

## 为什么需要 Watermark

在分布式流处理中，数据可能因为网络延迟、反压等原因**乱序到达**。如果无限等待迟到数据，计算延迟会无限放大。Watermark 是一种权衡机制——告诉系统"早于某个时间戳的数据大概率已经到了"。

## Watermark 生成策略

### 周期性生成（推荐）

```java
WatermarkStrategy
    .<Event>forBoundedOutOfOrderness(Duration.ofSeconds(5))
    .withTimestampAssigner((event, timestamp) -> event.getTimestamp())
```

### 断点式生成

适合数据稀疏、时间戳跳跃的场景：

```java
WatermarkStrategy
    .forMonotonousTimestamps()
```

## 处理迟到数据的三种方式

1. **直接丢弃** — sidOutput 收集，离线补数
2. **允许迟到** — `.allowedLateness(Time.minutes(5))` 触发窗口重计算
3. **更新下游** — 配合可更新的 Sink（如 ClickHouse ReplacingMergeTree）

## 实战踩坑

**问题**：Kafka 多分区时，某个分区长期无数据导致 Watermark 不推进，窗口一直不触发。

**解决**：设置 `withIdleness(Duration.ofMinutes(1))`，空闲分区不参与 Watermark 计算。

```java
WatermarkStrategy.<Event>forBoundedOutOfOrderness(Duration.ofSeconds(5))
    .withIdleness(Duration.ofMinutes(1))
```

## 监控要点

- Watermark 推进延迟 → 检查上游数据生产和网络
- 迟到数据量 → 调整 out-of-order 窗口或排查数据源
- 空闲分区告警 → 检查 Kafka partition 分布
