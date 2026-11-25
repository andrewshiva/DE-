import React, { useMemo } from 'react';
import { RotateCcw, Pause, Play } from 'lucide-react';

const SIM_PRESETS = {
  pipeline: {
    metrics: [
      { label: 'SOURCE LATENCY', values: ['850 ms', '420 ms', '180 ms', '95 ms', '45 ms'] },
      { label: 'TRANSFORM TIME', values: ['—', '3.4 s', '2.1 s', '1.4 s', '0.6 s'] },
      { label: 'THROUGHPUT', values: ['120 rows/s', '500 rows/s', '2,400 rows/s', '12,000 rows/s', '28,000 rows/s'] },
      { label: 'FRESHNESS SLA', values: ['18 hrs', '1 hr', '25 min', '10 min', '30 sec'] },
    ],
    nodes: [
      { id: 'src', label: 'Source DB', sub: 'Postgres', x: 14, y: 50, color: '#3b82f6' },
      { id: 'ext', label: 'Extract', sub: 'CDC / Pull', x: 36, y: 34, color: '#16a34a' },
      { id: 'tx', label: 'Transform', sub: 'dbt / Spark', x: 58, y: 50, color: '#d97706' },
      { id: 'wh', label: 'Warehouse', sub: 'Snowflake', x: 76, y: 34, color: '#2563eb' },
      { id: 'bi', label: 'Serve', sub: 'BI / ML', x: 88, y: 62, color: '#7c3aed' },
    ],
    edges: [
      ['src', 'ext', '#3b82f6'],
      ['ext', 'tx', '#16a34a'],
      ['tx', 'wh', '#d97706'],
      ['wh', 'bi', '#7c3aed'],
    ],
  },
  sql: {
    metrics: [
      { label: 'SCAN ROWS', values: ['12.4M', '4.2M', '840K', '120K', '4.8K'] },
      { label: 'EXECUTION TIME', values: ['8.4 s', '2.9 s', '620 ms', '140 ms', '28 ms'] },
      { label: 'INDEX HIT', values: ['0%', '45%', '78%', '94%', '99%'] },
      { label: 'COST', values: ['High', 'Med', 'Low', 'Optimal', 'Optimal'] },
    ],
    nodes: [
      { id: 'q', label: 'SQL Query', sub: 'SELECT / JOIN', x: 14, y: 50, color: '#3b82f6' },
      { id: 'parse', label: 'Parser', sub: 'AST + Plan', x: 35, y: 36, color: '#7c3aed' },
      { id: 'opt', label: 'Optimizer', sub: 'Cost-Based', x: 56, y: 50, color: '#d97706' },
      { id: 'idx', label: 'Index Scan', sub: 'B-Tree', x: 75, y: 34, color: '#16a34a' },
      { id: 'res', label: 'Result Set', sub: 'Aggregated', x: 88, y: 62, color: '#2563eb' },
    ],
    edges: [
      ['q', 'parse', '#3b82f6'],
      ['parse', 'opt', '#7c3aed'],
      ['opt', 'idx', '#d97706'],
      ['idx', 'res', '#16a34a'],
    ],
  },
  python: {
    metrics: [
      { label: 'API RATE', values: ['10 req/s', '50 req/s', '120 req/s', '250 req/s', '500 req/s'] },
      { label: 'MEMORY', values: ['4.2 GB', '2.1 GB', '820 MB', '340 MB', '180 MB'] },
      { label: 'RETRIES', values: ['12', '4', '1', '0', '0'] },
      { label: 'VALIDATION', values: ['None', 'Basic', 'Schema', 'Pydantic', '100% Pass'] },
    ],
    nodes: [
      { id: 'api', label: 'REST / SDK', sub: 'Requests / Boto3', x: 14, y: 50, color: '#eab308' },
      { id: 'val', label: 'Validate', sub: 'Pydantic / Try', x: 36, y: 34, color: '#16a34a' },
      { id: 'df', label: 'Process', sub: 'Pandas / Polars', x: 58, y: 50, color: '#3b82f6' },
      { id: 'parq', label: 'Serialize', sub: 'Parquet / Arrow', x: 76, y: 34, color: '#d97706' },
      { id: 's3', label: 'Cloud Sink', sub: 'S3 / Postgres', x: 88, y: 62, color: '#7c3aed' },
    ],
    edges: [
      ['api', 'val', '#eab308'],
      ['val', 'df', '#16a34a'],
      ['df', 'parq', '#3b82f6'],
      ['parq', 's3', '#7c3aed'],
    ],
  },
  etl: {
    metrics: [
      { label: 'STAGING LOAD', values: ['45 min', '22 min', '11 min', '4.2 min', '1.8 min'] },
      { label: 'WAREHOUSE CPU', values: ['92%', '74%', '52%', '38%', '24%'] },
      { label: 'MODELS BUILT', values: ['1', '8', '24', '64', '120'] },
      { label: 'TEST PASS', values: ['65%', '82%', '94%', '99%', '100%'] },
    ],
    nodes: [
      { id: 'src', label: 'Sources', sub: 'SaaS / ERP / DB', x: 14, y: 50, color: '#3b82f6' },
      { id: 'ing', label: 'Ingest (EL)', sub: 'Fivetran / ADF', x: 36, y: 34, color: '#f97316' },
      { id: 'raw', label: 'Raw Zone', sub: 'Bronze Layer', x: 56, y: 64, color: '#d97706' },
      { id: 'dbt', label: 'Transform (T)', sub: 'dbt / SQL', x: 72, y: 34, color: '#16a34a' },
      { id: 'gold', label: 'Curated Marts', sub: 'Gold Tables', x: 88, y: 56, color: '#7c3aed' },
    ],
    edges: [
      ['src', 'ing', '#3b82f6'],
      ['ing', 'raw', '#f97316'],
      ['raw', 'dbt', '#d97706'],
      ['dbt', 'gold', '#16a34a'],
    ],
  },
  database: {
    metrics: [
      { label: 'READ LATENCY', values: ['190 ms', '65 ms', '18 ms', '7 ms', '3 ms'] },
      { label: 'WRITE QPS', values: ['1,200', '4,500', '12,000', '35,000', '50,000'] },
      { label: 'SHARDS', values: ['1', '2', '4', '8', '16'] },
      { label: 'AVAILABILITY', values: ['99.0%', '99.9%', '99.95%', '99.99%', '99.99%'] },
    ],
    nodes: [
      { id: 'app', label: 'Clients', sub: 'App / API', x: 14, y: 50, color: '#3b82f6' },
      { id: 'rt', label: 'Router', sub: 'Shard Key', x: 36, y: 50, color: '#7c3aed' },
      { id: 'p', label: 'Primary', sub: 'Read / Write', x: 60, y: 30, color: '#16a34a' },
      { id: 'r1', label: 'Replica A', sub: 'WAL Sync', x: 60, y: 70, color: '#d97706' },
      { id: 's3', label: 'Snapshots', sub: 'Object Store', x: 85, y: 50, color: '#2563eb' },
    ],
    edges: [
      ['app', 'rt', '#3b82f6'],
      ['rt', 'p', '#16a34a'],
      ['p', 'r1', '#d97706'],
      ['p', 's3', '#2563eb'],
    ],
  },
  spark: {
    metrics: [
      { label: 'PARTITIONS', values: ['1', '16', '64', '200', '200'] },
      { label: 'SHUFFLE READ', values: ['42 GB', '18 GB', '6.4 GB', '1.8 GB', '420 MB'] },
      { label: 'STAGE TIME', values: ['14 min', '6.2 min', '2.1 min', '48 s', '19 s'] },
      { label: 'EXECUTORS', values: ['2', '8', '16', '32', '32'] },
    ],
    nodes: [
      { id: 'drv', label: 'Driver', sub: 'Catalyst', x: 16, y: 50, color: '#7c3aed' },
      { id: 's1', label: 'Stage 1', sub: 'Map / Filter', x: 40, y: 32, color: '#16a34a' },
      { id: 'shf', label: 'Shuffle', sub: 'Exchange', x: 58, y: 55, color: '#d97706' },
      { id: 's2', label: 'Stage 2', sub: 'GroupBy / Join', x: 76, y: 34, color: '#2563eb' },
      { id: 'out', label: 'Parquet', sub: 'Delta Lake', x: 88, y: 64, color: '#16a34a' },
    ],
    edges: [
      ['drv', 's1', '#7c3aed'],
      ['s1', 'shf', '#16a34a'],
      ['shf', 's2', '#d97706'],
      ['s2', 'out', '#2563eb'],
    ],
  },
  cloud: {
    metrics: [
      { label: 'STORAGE TIER', values: ['Hot', 'Standard', 'IA / Cool', 'Intelligent', 'Glacier'] },
      { label: 'EGRESS COST', values: ['$4,200/mo', '$2,800/mo', '$1,450/mo', '$820/mo', '$410/mo'] },
      { label: 'IAM POLICIES', values: ['Open', 'Role-Based', 'Least Priv', 'Scoped', 'Zero Trust'] },
      { label: 'AVAILABILITY', values: ['1 AZ', '2 AZs', '3 AZs', 'Multi-Region', '99.99%'] },
    ],
    nodes: [
      { id: 'iam', label: 'IAM & VPC', sub: 'Security', x: 14, y: 50, color: '#06b6d4' },
      { id: 'obj', label: 'Object Store', sub: 'S3 / ADLS / GCS', x: 38, y: 34, color: '#3b82f6' },
      { id: 'cmp', label: 'Serverless', sub: 'Glue / Lambda', x: 58, y: 62, color: '#d97706' },
      { id: 'dwh', label: 'Cloud DWH', sub: 'BQ / Redshift', x: 76, y: 34, color: '#16a34a' },
      { id: 'fin', label: 'FinOps', sub: 'Cost Monitor', x: 88, y: 64, color: '#7c3aed' },
    ],
    edges: [
      ['iam', 'obj', '#06b6d4'],
      ['obj', 'cmp', '#3b82f6'],
      ['cmp', 'dwh', '#d97706'],
      ['dwh', 'fin', '#16a34a'],
    ],
  },
  orchestration: {
    metrics: [
      { label: 'DAG TASKS', values: ['4', '8', '12', '16', '24'] },
      { label: 'RETRY POLICY', values: ['None', '1x', '3x Backoff', '3x + SLA', 'Idempotent'] },
      { label: 'QUEUE DELAY', values: ['45 s', '12 s', '4 s', '1.2 s', '0.4 s'] },
      { label: 'SUCCESS RATE', values: ['82%', '91%', '96%', '99.2%', '99.9%'] },
    ],
    nodes: [
      { id: 'sch', label: 'Scheduler', sub: 'Cron / Event', x: 14, y: 50, color: '#7c3aed' },
      { id: 'ext', label: 'Extract', sub: 'Task 1', x: 36, y: 32, color: '#16a34a' },
      { id: 'chk', label: 'Quality', sub: 'dbt test', x: 36, y: 68, color: '#d97706' },
      { id: 'tr', label: 'Transform', sub: 'Task 2', x: 62, y: 50, color: '#2563eb' },
      { id: 'al', label: 'Alerting', sub: 'Slack / Pager', x: 86, y: 50, color: '#16a34a' },
    ],
    edges: [
      ['sch', 'ext', '#7c3aed'],
      ['ext', 'chk', '#16a34a'],
      ['chk', 'tr', '#d97706'],
      ['tr', 'al', '#2563eb'],
    ],
  },
  viz: {
    metrics: [
      { label: 'QUERY TIME', values: ['14.2 s', '6.1 s', '1.8 s', '420 ms', '110 ms'] },
      { label: 'EXTRACT SIZE', values: ['18 GB', '8.4 GB', '3.1 GB', '920 MB', '280 MB'] },
      { label: 'METRIC DRIFT', values: ['High', 'Medium', 'Low', 'Aligned', 'Single Source'] },
      { label: 'ADOPTION', values: ['12%', '34%', '58%', '79%', '94%'] },
    ],
    nodes: [
      { id: 'dwh', label: 'Warehouse', sub: 'Fact + Dim', x: 14, y: 50, color: '#3b82f6' },
      { id: 'sem', label: 'Semantic Layer', sub: 'DAX / Metrics', x: 37, y: 34, color: '#ec4899' },
      { id: 'cache', label: 'VertiPaq / Hyper', sub: 'In-Memory', x: 58, y: 62, color: '#d97706' },
      { id: 'dash', label: 'BI Canvas', sub: 'Tableau / PBI', x: 76, y: 34, color: '#16a34a' },
      { id: 'exec', label: 'Stakeholders', sub: 'Decisions', x: 89, y: 60, color: '#7c3aed' },
    ],
    edges: [
      ['dwh', 'sem', '#3b82f6'],
      ['sem', 'cache', '#ec4899'],
      ['cache', 'dash', '#d97706'],
      ['dash', 'exec', '#16a34a'],
    ],
  },
  devops: {
    metrics: [
      { label: 'BUILD TIME', values: ['12 min', '7.5 min', '4.1 min', '2.2 min', '55 s'] },
      { label: 'TEST COVERAGE', values: ['18%', '42%', '68%', '85%', '94%'] },
      { label: 'DEPLOY FREQ', values: ['Monthly', 'Weekly', 'Daily', 'On-Merge', 'Continuous'] },
      { label: 'ROLLBACK', values: ['Manual', '30 min', '5 min', '60 s', 'Auto'] },
    ],
    nodes: [
      { id: 'git', label: 'Git PR', sub: 'Branch / Lint', x: 14, y: 50, color: '#64748b' },
      { id: 'ci', label: 'CI Runner', sub: 'Pytest / SQLFluff', x: 36, y: 34, color: '#3b82f6' },
      { id: 'img', label: 'Docker', sub: 'Immutable Img', x: 58, y: 62, color: '#06b6d4' },
      { id: 'k8s', label: 'Kubernetes', sub: 'Terraform IaC', x: 76, y: 34, color: '#7c3aed' },
      { id: 'obs', label: 'Prod Monitor', sub: 'Logs & Metrics', x: 88, y: 60, color: '#16a34a' },
    ],
    edges: [
      ['git', 'ci', '#64748b'],
      ['ci', 'img', '#3b82f6'],
      ['img', 'k8s', '#06b6d4'],
      ['k8s', 'obs', '#16a34a'],
    ],
  },
  'system-design': {
    metrics: [
      { label: 'EVENT RATE', values: ['5K/s', '25K/s', '100K/s', '500K/s', '1M/s'] },
      { label: 'E2E P99', values: ['4.8 s', '1.9 s', '620 ms', '180 ms', '45 ms'] },
      { label: 'FAULTS', values: ['Data Loss', 'Retry', 'DLQ', 'Idempotent', 'Zero Loss'] },
      { label: 'SCALE TIER', values: ['1x', '5x', '20x', '100x', 'Global'] },
    ],
    nodes: [
      { id: 'prod', label: 'Producers', sub: 'Apps / IoT', x: 13, y: 50, color: '#f43f5e' },
      { id: 'bus', label: 'Kafka Bus', sub: 'Partitioned Log', x: 35, y: 34, color: '#3b82f6' },
      { id: 'proc', label: 'Stream / Batch', sub: 'Flink + Spark', x: 57, y: 60, color: '#d97706' },
      { id: 'lake', label: 'Lakehouse', sub: 'Iceberg / Delta', x: 76, y: 34, color: '#16a34a' },
      { id: 'srv', label: 'Serving', sub: 'OLAP + Cache', x: 89, y: 58, color: '#7c3aed' },
    ],
    edges: [
      ['prod', 'bus', '#f43f5e'],
      ['bus', 'proc', '#3b82f6'],
      ['proc', 'lake', '#d97706'],
      ['lake', 'srv', '#16a34a'],
    ],
  },
  interview: {
    metrics: [
      { label: 'CLARIFY', values: ['Skipped', '2 Qs', 'Scope Set', 'SLA Defined', 'Locked'] },
      { label: 'TRADEOFFS', values: ['0', '1', '3', '5', 'Explicit'] },
      { label: 'DEPTH', values: ['Surface', 'Tools Only', 'Mechanics', 'Failure Modes', 'Architect'] },
      { label: 'SIGNAL', values: ['Weak', 'Mixed', 'Strong', 'Hire', 'Strong Hire'] },
    ],
    nodes: [
      { id: 'req', label: 'Requirements', sub: 'Scale & SLAs', x: 14, y: 50, color: '#14b8a6' },
      { id: 'est', label: 'Estimation', sub: 'QPS & Storage', x: 35, y: 34, color: '#3b82f6' },
      { id: 'hld', label: 'High-Level', sub: 'Core Boxes', x: 56, y: 60, color: '#7c3aed' },
      { id: 'deep', label: 'Deep Dive', sub: 'Bottlenecks', x: 75, y: 34, color: '#d97706' },
      { id: 'trd', label: 'Tradeoffs', sub: 'Cost vs Latency', x: 89, y: 58, color: '#16a34a' },
    ],
    edges: [
      ['req', 'est', '#14b8a6'],
      ['est', 'hld', '#3b82f6'],
      ['hld', 'deep', '#7c3aed'],
      ['deep', 'trd', '#16a34a'],
    ],
  },
  governance: {
    metrics: [
      { label: 'LINEAGE', values: ['Unknown', 'Table-Level', 'Column-Level', 'End-to-End', 'Automated'] },
      { label: 'PII MASKING', values: ['0%', '40%', '85%', '98%', '100%'] },
      { label: 'QUALITY SLA', values: ['Manual', 'Daily', 'Hourly', 'Contracted', 'Enforced'] },
      { label: 'AUDIT READY', values: ['No', 'Partial', 'Mostly', 'Yes', 'SOC2 / GDPR'] },
    ],
    nodes: [
      { id: 'cat', label: 'Data Catalog', sub: 'Discovery', x: 14, y: 50, color: '#a855f7' },
      { id: 'lin', label: 'Lineage', sub: 'OpenLineage', x: 36, y: 34, color: '#3b82f6' },
      { id: 'dq', label: 'Quality Gate', sub: 'Contracts', x: 58, y: 62, color: '#16a34a' },
      { id: 'rbac', label: 'Policy / PII', sub: 'Masking & IAM', x: 76, y: 34, color: '#d97706' },
      { id: 'obs', label: 'Observability', sub: 'Freshness SLA', x: 89, y: 58, color: '#7c3aed' },
    ],
    edges: [
      ['cat', 'lin', '#a855f7'],
      ['lin', 'dq', '#3b82f6'],
      ['dq', 'rbac', '#16a34a'],
      ['rbac', 'obs', '#7c3aed'],
    ],
  },
  'ai-rag': {
    metrics: [
      { label: 'RETRIEVAL', values: ['480 ms', '210 ms', '85 ms', '32 ms', '18 ms'] },
      { label: 'CONTEXT HIT', values: ['62%', '74%', '86%', '92%', '96%'] },
      { label: 'TOKENS / SEC', values: ['24', '45', '78', '110', '145'] },
      { label: 'GUARDRAILS', values: ['Off', 'Schema', 'PII Filter', 'RBAC', 'Enforced'] },
    ],
    nodes: [
      { id: 'usr', label: 'User / Agent', sub: 'Prompt', x: 14, y: 50, color: '#3b82f6' },
      { id: 'mcp', label: 'MCP Server', sub: 'Tools / Auth', x: 36, y: 34, color: '#16a34a' },
      { id: 'vec', label: 'Vector DB', sub: 'Embeddings', x: 58, y: 64, color: '#7c3aed' },
      { id: 'llm', label: 'LLM Engine', sub: 'Reasoning', x: 74, y: 34, color: '#d97706' },
      { id: 'out', label: 'Verified Out', sub: 'Grounded', x: 88, y: 58, color: '#16a34a' },
    ],
    edges: [
      ['usr', 'mcp', '#3b82f6'],
      ['mcp', 'vec', '#7c3aed'],
      ['vec', 'llm', '#d97706'],
      ['mcp', 'llm', '#16a34a'],
      ['llm', 'out', '#16a34a'],
    ],
  },
};

// Lesson-specific node overrides so each lesson in a module feels distinct
const LESSON_OVERRIDES = {
  '02-excel-deep-dive': [
    { label: 'CSV / ERP', sub: 'Raw Export' },
    { label: 'Power Query', sub: 'M Transforms' },
    { label: 'Data Model', sub: 'Power Pivot' },
    { label: 'Pivot / DAX', sub: 'Aggregations' },
    { label: 'Workbook', sub: 'Exec Report' },
  ],
  '03-tableau-deep-dive': [
    { label: 'Warehouse', sub: 'Live / Extract' },
    { label: 'Hyper Engine', sub: 'In-Memory' },
    { label: 'VizQL', sub: 'Query Compiler' },
    { label: 'Worksheets', sub: 'Marks & Shelves' },
    { label: 'Tableau Server', sub: 'Published Dash' },
  ],
  '04-powerbi-deep-dive': [
    { label: 'Sources', sub: 'SQL / Lake' },
    { label: 'Power Query', sub: 'ETL Prep' },
    { label: 'VertiPaq', sub: 'Columnar Store' },
    { label: 'DAX Engine', sub: 'Measures' },
    { label: 'PBI Service', sub: 'RLS & Workspaces' },
  ],
  '05-dax-deep-dive': [
    { label: 'Star Schema', sub: 'Fact + Dim' },
    { label: 'Row Context', sub: 'Iterator' },
    { label: 'Filter Context', sub: 'CALCULATE()' },
    { label: 'Time Intel', sub: 'YTD / YoY' },
    { label: 'Measure Out', sub: 'Dynamic KPI' },
  ],
  '06-modern-bi-semantic-layer': [
    { label: 'Data Lakehouse', sub: 'Gold Tables' },
    { label: 'MetricFlow', sub: 'YAML Metrics' },
    { label: 'Semantic API', sub: 'SQL / GraphQL' },
    { label: 'BI + Notebooks', sub: 'Consistent KPI' },
    { label: 'AI Copilot', sub: 'Text-to-SQL' },
  ],
};

export default function SimulationCanvas({
  simType = 'pipeline',
  lessonId = '',
  lessonTitle = '',
  stepHeading = '',
  stepIndex = 0,
  totalSteps = 10,
  stepTag = 'TECHNIQUE',
  isPaused,
  onTogglePause,
  replayKey,
  onReplay,
}) {
  const basePreset = SIM_PRESETS[simType] || SIM_PRESETS.pipeline;
  const nodes = useMemo(() => {
    const override = LESSON_OVERRIDES[lessonId];
    if (!override) return basePreset.nodes;
    return basePreset.nodes.map((node, idx) =>
      override[idx] ? { ...node, ...override[idx] } : node
    );
  }, [basePreset.nodes, lessonId]);

  const progressRatio = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;
  const metricTier = Math.min(4, Math.floor(progressRatio * 4.99));
  const isProblemStep = stepTag === 'PROBLEM' || stepTag === 'INTERVIEW TRAP';

  const activeNodeIdx = useMemo(() => {
    if (stepTag === 'RECAP') return -1;
    return stepIndex % nodes.length;
  }, [stepIndex, stepTag, nodes.length]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Metrics Bar */}
      <div className="grid grid-cols-4 gap-2.5 mb-3">
        {basePreset.metrics.map((m) => {
          const val = isProblemStep && stepIndex > 0 ? m.values[0] : m.values[metricTier];
          return (
            <div
              key={m.label}
              className="px-3 py-2 rounded-xl border"
              style={{
                backgroundColor: 'var(--de-card)',
                borderColor: 'var(--de-border)',
              }}
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-wider truncate"
                style={{ color: 'var(--de-muted)' }}
              >
                {m.label}
              </div>
              <div
                className="text-sm font-bold font-mono-code mt-0.5"
                style={{
                  color: isProblemStep ? 'var(--de-orange)' : 'var(--de-text)',
                }}
              >
                {val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Isometric Simulation Canvas */}
      <div
        className="flex-1 relative rounded-xl border overflow-hidden sim-grid-bg min-h-[260px]"
        style={{ borderColor: 'var(--de-border)' }}
      >
        {/* Active Lesson & Step Focus Pill */}
        <div
          className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg border text-[11px] font-medium max-w-[60%] truncate"
          style={{
            backgroundColor: 'var(--de-card)',
            borderColor: 'var(--de-border)',
            color: 'var(--de-muted)',
          }}
        >
          <span style={{ color: 'var(--de-text)', fontWeight: 600 }}>{lessonTitle}</span>
          {stepHeading ? ` · ${stepHeading}` : ''}
        </div>

        {/* Replay & Pause Controls */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <button
            onClick={onReplay}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors hover:opacity-85"
            style={{
              backgroundColor: 'var(--de-card)',
              borderColor: 'var(--de-border)',
              color: 'var(--de-text)',
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
          <button
            onClick={onTogglePause}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors hover:opacity-85"
            style={{
              backgroundColor: 'var(--de-card)',
              borderColor: 'var(--de-border)',
              color: 'var(--de-text)',
            }}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>

        {/* SVG Architecture Graph */}
        <svg
          key={`${simType}-${lessonId}-${replayKey}`}
          viewBox="0 0 800 400"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="nodeShadow" x="-15%" y="-15%" width="130%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Edges & Flowing Particles */}
          {basePreset.edges.map(([fromId, toId, edgeColor], idx) => {
            const from = nodes.find((n) => n.id === fromId);
            const to = nodes.find((n) => n.id === toId);
            if (!from || !to) return null;
            const x1 = (from.x / 100) * 800;
            const y1 = (from.y / 100) * 400;
            const x2 = (to.x / 100) * 800;
            const y2 = (to.y / 100) * 400;
            const pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
            const activeColor = isProblemStep && idx === basePreset.edges.length - 1 ? '#dc2626' : edgeColor;

            return (
              <g key={`${fromId}-${toId}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={activeColor}
                  strokeWidth="2.5"
                  strokeDasharray="6 5"
                  strokeOpacity="0.65"
                />
                {!isPaused && (
                  <>
                    <circle r="4.5" fill={activeColor}>
                      <animateMotion dur="2.2s" begin={`${idx * 0.35}s`} repeatCount="indefinite" path={pathD} />
                    </circle>
                    <circle r="3.5" fill={activeColor} opacity="0.7">
                      <animateMotion dur="2.2s" begin={`${idx * 0.35 + 1.1}s`} repeatCount="indefinite" path={pathD} />
                    </circle>
                  </>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const cx = (node.x / 100) * 800;
            const cy = (node.y / 100) * 400;
            const isHighlighted = activeNodeIdx === idx || stepTag === 'RECAP';
            const strokeColor = isProblemStep && activeNodeIdx === idx ? '#dc2626' : node.color;

            return (
              <g
                key={node.id}
                transform={`translate(${cx}, ${cy})`}
                filter="url(#nodeShadow)"
              >
                <rect
                  x="-64"
                  y="-34"
                  width="128"
                  height="68"
                  rx="14"
                  fill="var(--de-card)"
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? '3' : '1.75'}
                />
                <rect
                  x="-64"
                  y="-34"
                  width="128"
                  height="68"
                  rx="14"
                  fill={strokeColor}
                  fillOpacity={isHighlighted ? '0.14' : '0.05'}
                />
                <text
                  y="-4"
                  textAnchor="middle"
                  fill="var(--de-text)"
                  fontSize="12.5"
                  fontWeight="700"
                >
                  {node.label}
                </text>
                <text
                  y="15"
                  textAnchor="middle"
                  fill="var(--de-muted)"
                  fontSize="10.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.sub}
                </text>
                {isHighlighted && (
                  <circle cx="50" cy="-20" r="4.5" fill={strokeColor} />
                )}
              </g>
            );
          })}
        </svg>

        {/* Bottom Legend */}
        <div
          className="absolute bottom-3 left-4 flex flex-wrap items-center gap-4 text-[11px]"
          style={{ color: 'var(--de-muted)' }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            ingest / source
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-600" />
            processed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            transform / cache
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            serve / output
          </span>
        </div>
      </div>
    </div>
  );
}
