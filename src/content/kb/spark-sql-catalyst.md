---
title: "Spark SQL 与 Catalyst 优化器"
description: "Catalyst 优化器的四阶段工作流程：解析、逻辑优化、物理优化、代码生成，以及 Tungsten 全阶段代码生成原理。"
date: 2026-05-29
tags: [spark, sparksql, catalyst, tungsten, 优化器]
topic: spark
order: 3
---

Spark SQL 是 Spark 中最常用的模块，Catalyst 优化器和 Tungsten 执行引擎是其性能核心。

## Catalyst 优化器

Catalyst 是 Spark SQL 的查询优化框架，使用 **基于规则的优化（RBO）** 和 **基于代价的优化（CBO）** 两种策略。

### 优化流水线

```
SQL / DataFrame
      ↓
   [1] 解析（Parsing）
      → 语法检查 → 生成未解析的逻辑计划（Unresolved Logical Plan）
      ↓
   [2] 分析（Analysis）
      → 借助 Catalog 解析表名、列名、类型 → 生成逻辑计划（Logical Plan）
      ↓
   [3] 逻辑优化（Logical Optimization）
      → 应用标准规则（谓词下推、列裁剪、常量折叠等）
      ↓
   [4] 物理计划（Physical Planning）
      → 选择最优的物理执行策略（如 Broadcast Join vs SortMerge Join）
      ↓
   [5] 代码生成（Code Generation）
      → Tungsten 全阶段代码生成
      ↓
    RDD 执行
```

## 核心优化规则

### 谓词下推（Predicate Pushdown）

将 Filter 尽量下推到数据源层，减少读取的数据量：

```sql
-- 原始
SELECT * FROM big_table WHERE date = '2026-01-01' AND amount > 100

-- 优化后：先过滤再扫描
-- Filter 被推到 Parquet/ORC 文件读取层
```

### 列裁剪（Column Pruning）

只读取 SQL 中实际使用的列，跳过无用字段。

```sql
SELECT name, age FROM users WHERE city = '北京'
-- 只读取 name, age, city 三列，其他列跳过
```

### 常量折叠（Constant Folding）

编译期计算常量表达式：

```sql
SELECT price * (1 + 0.13) FROM orders
-- 编译期直接替换为 price * 1.13
```

### Join 重排序

CBO 根据表大小统计信息，自动选择 Join 顺序，让数据量小的表先 Join。

## Tungsten 执行引擎

Tungsten 的目标是让 Spark 的执行效率接近裸硬件。

### 全阶段代码生成（Whole-Stage Code Generation）

传统火山模型：每个算子独立处理，虚函数调用频繁，CPU 缓存不友好。

Tungsten 方案：**将多个算子融合为一个函数，直接编译成 Java 字节码**，消除虚函数调用。

```
传统：Scan → Filter → Project → Agg  (每个算子独立循环)
Tungsten：for (row in scan) { if (filter(row)) { result += project(row) } }
```

### 堆外内存 + 二进制数据格式

直接操作二进制数据，而非 JVM 对象，减少 GC 开销。使用 `UnsafeRow` 作为内部数据表示。

## DataFrame vs RDD

| 维度 | RDD | DataFrame |
|------|-----|-----------|
| 优化器 | 无 | Catalyst 自动优化 |
| 序列化 | Java / Kryo | Tungsten 二进制 |
| Schema | 运行时推断 | 编译期已知 |
| 性能 | 慢 | 快（2-10x） |

**最佳实践**：能用 DataFrame/Dataset 就不用 RDD，只在需要复杂自定义逻辑时用 RDD。

## 查看执行计划

```scala
df.explain(true)  // 打印完整的逻辑计划和物理计划

// 或者通过 Spark UI → SQL Tab 查看
```

```sql
-- Spark 3.0+ 支持 EXPLAIN EXTENDED
EXPLAIN EXTENDED SELECT ... FROM ...
```
