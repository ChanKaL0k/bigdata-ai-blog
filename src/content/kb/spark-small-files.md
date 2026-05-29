---
title: "Spark 小文件问题：从根因到治理方案"
description: "小文件是 HDFS 和 Spark 作业中的常见性能杀手。本文深入分析小文件的形成原因、对计算和存储的影响，以及从源头到治理的完整解决方案。"
date: 2026-05-29
tags: [spark, 小文件, hdfs, 性能优化, 数据治理]
topic: spark
order: 7
---

小文件问题是数据平台运维中最头疼的问题之一。单个小文件本身无害，但当成千上万个小文件堆积在 HDFS 上时，会对 NameNode 内存、Spark 调度、查询性能产生链式杀伤。本文分享我在生产环境遇到的小文件问题和治理经验。

## 什么是小文件

在 HDFS 中，**明显小于一个 Block（默认 128 MB）的文件称为小文件**。通常小于 64 MB 的文件就值得关注，小于 1 MB 的文件属于严重问题。

## 小文件有多大杀伤力

### 对 HDFS NameNode 的影响

HDFS NameNode 将整个文件系统的元数据保存在内存中。每个文件/目录/Block 大约占用 **150 字节**的 NameNode 内存：

```
10,000 个小文件 ≈ 1.5 MB 元数据（可接受）
10,000,000 个小文件 ≈ 1.5 GB 元数据（NameNode 内存告警）
```

当 NameNode 内存不足时，整个 HDFS 集群的读写都会受影响——这是最严重的情况。

### 对 Spark 作业的影响

小文件对 Spark 的打击体现在三个层面：

**1. Listing 开销**

Spak 读取目录前需要调用 `listStatus()` 获取文件列表。假设每个文件处理需要 1ms，1 万个文件就是 10 秒的 listing 时间，这还不包括 HDFS RPC 的排队延迟。

**2. Task 数量爆炸**

Spark 默认按文件来划分分区（`spark.sql.files.maxPartitionBytes=128MB`）。如果有 5,000 个小文件，每个 2 MB，Spark 至少会创建 5,000 个 Task。而总共只有 10 GB 数据，按 128 MB/分区计算，合理的 Task 数应为 **80 个左右**。

每个 Task 都有调度开销（序列化、反序列化、IPC），5,000 个 Task 的调度开销会远大于实际计算时间。

**3. Shuffle 文件膨胀**

Spark Shuffle 阶段，每个 Mapper 为每个 Reducer 生成一个文件。如果有 M 个 Mapper 和 R 个 Reducer，Shuffle 中间文件数为 **M × R**。Task 数量多意味着 M 也大，Shuffle 文件数量会指数级增长。

### 真实案例

某日志分析作业，上游 Flume 以每分钟一个文件的速度写入 HDFS。一个月后，该分区下有 **43,200 个小文件**。Spark 作业表现为：

| 指标 | 正常 | 小文件场景 |
|------|------|-----------|
| Listing 耗时 | 5 秒 | **8 分钟** |
| Task 数量 | 80 | **3,200** |
| 总作业耗时 | 12 分钟 | **42 分钟** |
| 每 Task 平均输入 | 120 MB | **3 MB** |

## 小文件是怎么产生的

### 1. 流式写入（最常见）

Flume、Spark Streaming、Flink 等流处理框架以固定间隔写入 HDFS。如果间隔过短（如每分钟写入一次），而每分钟的数据量又很小（如几百 KB），就会产生大量小文件。

```scala
// 每分钟触发一次写入 → 每小时 60 个小文件 → 每天 1,440 个
df.writeStream
  .trigger(Trigger.ProcessingTime("1 minute"))
  .format("parquet")
  .start("/data/events/")
```

### 2. 过度分区

```sql
-- 按 dt + hour + city + device 分区
-- 假设 500 个城市 × 10 种设备 = 每个时段 5,000 个分区
INSERT INTO events PARTITION (dt, hour, city, device)
SELECT ...
```

如果某个分区的数据量很小（如某个城市某个设备的日志只有几十条），这个分区下的文件就是小文件。

### 3. Shuffle 分区数过大

```scala
spark.conf.set("spark.sql.shuffle.partitions", "2000")
df.groupBy("key").count().write.parquet("/output/")
// 如果 groupBy 后只有 100 个 key，2000 个分区会产生 1900 个空文件
// 那 100 个有数据的分区也各只有很少数据
```

### 4. 多次 INSERT OVERWRITE

每次 `INSERT OVERWRITE` 都会产生新的一批文件，如果每次只写入少量数据，长期累积下来也会有小文件。

## 解决方案

### 方案一：源头控制 — 流式写入合并

在流处理框架侧主动合并文件：

```scala
// Flink: 增大 checkpoint 间隔，使用 FileSink 的 bulk-format
val sink = FileSink
  .forBulkFormat(new Path("/data/output/"), ParquetAvroWriters.forReflectRecord(classOf[Event]))
  .withBucketAssigner(new DateTimeBucketAssigner[Event]("yyyy-MM-dd"))
  .withRollingPolicy(
    DefaultRollingPolicy.builder()
      .withMaxPartSize(MemorySize.ofMebiBytes(512))  // 512 MB 才切换新文件
      .withRolloverInterval(Duration.ofMinutes(15))   // 至少 15 分钟才切换
      .withInactivityInterval(Duration.ofMinutes(5))  // 5 分钟无数据切换
      .build()
  )
  .build()
```

```scala
// Spark Streaming: 减少触发频率，增加每批次数据量
df.writeStream
  .trigger(Trigger.ProcessingTime("10 minutes"))  // 从 1 分钟调整到 10 分钟
  .format("parquet")
  .option("path", "/data/events/")
  .option("checkpointLocation", "/checkpoint/events/")
  .start()
```

### 方案二：写出时合并 — coalesce / repartition

在 Spark 写出前控制文件数量：

```scala
// 小数据集：coalesce 不触发 Shuffle，效率更高
df.coalesce(8).write.parquet("/output/")

// 大数据集：repartition 触发 Shuffle，但能均匀分布
df.repartition(8).write.parquet("/output/")

// 更佳实践：根据数据量动态计算分区数
val targetPartitionMB = 128
val outputSizeMB = estimatedSize / (1024 * 1024)
val partitions = Math.max(1, (outputSizeMB / targetPartitionMB).toInt)
df.coalesce(partitions).write.parquet("/output/")
```

### 方案三：自适应查询执行（AQE）

Spark 3.0+ 的 AQE 可以自动合并小分区：

```sql
SET spark.sql.adaptive.enabled = true;
SET spark.sql.adaptive.coalescePartitions.enabled = true;
SET spark.sql.adaptive.coalescePartitions.minPartitionSize = 1MB;
SET spark.sql.adaptive.advisoryPartitionSizeInBytes = 128MB;
```

AQE 会在 Shuffle 后自动将小分区相邻合并，减少后续 Stage 的 Task 数量。**这是成本最低的优化手段。**

### 方案四：定期后台合并

对于已经产生的小文件，使用后台作业定期合并：

```scala
// Spark 小文件合并工具
def compactSmallFiles(inputPath: String, outputPath: String): Unit = {
  spark.read.parquet(inputPath)
    .repartition(spark.conf.get("spark.sql.shuffle.partitions").toInt)
    .write
    .mode("overwrite")
    .parquet(outputPath)
}

// 按天合并：读取昨天的数据，合并后写回
val yesterday = LocalDate.now().minusDays(1).toString
compactSmallFiles(s"/data/events/dt=$yesterday/", s"/data/events/dt=$yesterday/")
```

### 方案五：使用 Delta Lake / Iceberg

Delta Lake 的 `OPTIMIZE` 命令可以自动合并小文件：

```sql
-- Delta Lake 合并小文件（默认将 < 1 GB 的文件合并到 1 GB）
OPTIMIZE events WHERE dt = '2026-05-28';

-- 配合 Z-Order 提升查询性能
OPTIMIZE events ZORDER BY (user_id) WHERE dt = '2026-05-28';
```

Apache Iceberg 的 `rewriteDataFiles` 也有类似能力：

```sql
CALL catalog.system.rewrite_data_files(
  table => 'db.events',
  strategy => 'sort',
  sort_order => 'user_id ASC',
  options => map('target-file-size-bytes', '134217728')
);
```

## 监控与预防

建立小文件监控体系：

```sql
-- 使用 HDFS 命令统计小文件
hdfs fsck /data/events/ -files -blocks -locations | grep "Total files"

-- 使用 Spark 读取目录信息，按分区统计文件数
val fileStats = spark.read
  .option("header", "true")
  .csv("/data/events/")
  .groupBy("dt")
  .count()
  .filter("count > 500")  // 单分区超过 500 个文件触发告警
```

监控指标：
- **每分区文件数**：超过 500 触发告警
- **平均文件大小**：小于 64 MB 关注，小于 1 MB 严重
- **总文件数趋势**：日增长率超过 20% 需要排查

## 总结

小文件治理的核心思路是**源头控制优于事后补救**：

1. **流处理端**：合理设置触发间隔和文件滚动策略，避免产生碎片
2. **批处理端**：合理设置 Shuffle 分区数，启用 AQE，写出前合并
3. **存储端**：使用 Delta Lake/Iceberg 等表格式，配合 OPTIMIZE 后台合并
4. **运维端**：建立小文件监控告警，定期评估文件数趋势
