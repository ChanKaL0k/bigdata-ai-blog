import type { ScenarioDef, SparkApp } from "./types";
import { dataSkew } from "./scenario-data-skew";
import { slowTasks } from "./scenario-slow-tasks";
import { oom } from "./scenario-oom";
import { smallFiles } from "./scenario-small-files";
import { shuffleHeavy } from "./scenario-shuffle-heavy";

export const scenarioDefs: ScenarioDef[] = [
  {
    id: "data-skew",
    nameZh: "数据倾斜",
    nameEn: "Data Skew",
    description: "一个 Task 的 Shuffle Read 是其他 Task 的 38 倍，导致整个 Stage 被单个慢 Task 拖垮。学习识别 Shuffle Read 分布不均、定位热点 Key。",
    icon: "⚖️",
    tags: ["shuffle", "partitioning", "join"],
  },
  {
    id: "slow-tasks",
    nameZh: "GC 耗时 / 慢任务",
    nameEn: "Slow Tasks & GC",
    description: "GC Time 占 Task 总时间的 15-22%，Executor 内存不足导致频繁 Full GC。学习通过 GC Time 列发现内存配置问题。",
    icon: "🐌",
    tags: ["gc", "memory", "executor"],
  },
  {
    id: "oom",
    nameZh: "Executor 内存溢出",
    nameEn: "Out of Memory",
    description: "UDAF 聚合导致 Executor heap 耗尽，16 个 Task 失败并抛出 OutOfMemoryError。学习识别内存溢出信号和堆内存分析。",
    icon: "💥",
    tags: ["oom", "memory", "udaf", "heap"],
  },
  {
    id: "small-files",
    nameZh: "小文件问题",
    nameEn: "Small Files",
    description: "2,800+ 小文件导致 1,200 个 Task 处理仅 48 MB 数据，每个 Task 读取不到 100 KB。学习通过 Task 数量和输入大小发现问题。",
    icon: "📄",
    tags: ["partitioning", "filesystem", "scheduling"],
  },
  {
    id: "shuffle-heavy",
    nameZh: "大量 Shuffle",
    nameEn: "Shuffle Heavy",
    description: "SortMergeJoin 产生 15 GB Shuffle Read，8.4 GB Spill to Disk。学习识别 Shuffle 瓶颈和优化 Join 策略。",
    icon: "🔄",
    tags: ["shuffle", "join", "spill", "broadcast"],
  },
];

export const scenarioApps: Record<string, SparkApp> = {
  "data-skew": dataSkew,
  "slow-tasks": slowTasks,
  "oom": oom,
  "small-files": smallFiles,
  "shuffle-heavy": shuffleHeavy,
};
