export interface ScenarioDef {
  id: string;
  nameZh: string;
  nameEn: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface SparkJob {
  id: number;
  description: string;
  submitted: string;
  duration: string;
  stages: string;
  tasks: string;
  status: "RUNNING" | "SUCCEEDED" | "FAILED";
}

export interface SparkTaskDetail {
  index: number;
  taskId: number;
  attempt: number;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  locality: string;
  executorId: string;
  taskTime: string;
  gcTime: string;
  inputSize: string;
  shuffleReadSize: string;
  shuffleWriteSize: string;
  errors: string;
  _isAnomalous?: boolean;
  _anomalyReason?: string;
}

export interface SparkStage {
  id: number;
  description: string;
  submitted: string;
  duration: string;
  tasks: string;
  input: string;
  output: string;
  shuffleRead: string;
  shuffleWrite: string;
  status: "COMPLETE" | "FAILED" | "PENDING" | "ACTIVE";
  tasks_detail: SparkTaskDetail[];
  _isAnomalous?: boolean;
}

export interface SparkExecutor {
  id: string;
  address: string;
  status: "ACTIVE" | "FAILED" | "DEAD";
  cores: number;
  memory: string;
  memoryUsed: string;
  taskActive: number;
  taskCompleted: number;
  taskFailed: number;
  gcTime: string;
  shuffleRead: string;
  shuffleWrite: string;
  _isAnomalous?: boolean;
}

export interface SparkStorageEntry {
  id: number;
  rddName: string;
  storageLevel: string;
  cachedSize: string;
  partitions: number;
  inMemory: string;
  onDisk: string;
}

export interface SparkSQLQuery {
  id: number;
  description: string;
  submitted: string;
  duration: string;
  details: string;
  plan: SparkSQLNode[];
}

export interface SparkSQLNode {
  nodeId: number;
  name: string;
  metrics: Record<string, string>;
  children: SparkSQLNode[];
  _isAnomalous?: boolean;
}

export interface SparkConfigEntry {
  key: string;
  value: string;
}

export interface SparkSummary {
  appUptime: string;
  completedJobs: number;
  failedJobs: number;
  completedStages: number;
  activeBatches: number;
  totalTasks: number;
  usedMemory: string;
  totalMemory: string;
}

export interface SparkApp {
  id: string;
  name: string;
  user: string;
  status: "RUNNING" | "SUCCEEDED" | "FAILED";
  startTime: string;
  duration: string;
  cores: number;
  memoryPerExecutor: string;
  summary: SparkSummary;
  jobs: SparkJob[];
  stages: SparkStage[];
  executors: SparkExecutor[];
  storage: SparkStorageEntry[];
  sqlQueries: SparkSQLQuery[];
  environment: SparkConfigEntry[];
  annotations: AnnotationDef[];
}

export interface AnnotationDef {
  id: string;
  targetType: "summary-metric" | "job-row" | "stage-row" | "task-cell" | "executor-row" | "storage-row" | "sql-node";
  targetId: string;
  targetField?: string;
  title: string;
  body: string;
  severity: "critical" | "warning" | "info";
  position: "inline" | "right" | "bottom";
}
