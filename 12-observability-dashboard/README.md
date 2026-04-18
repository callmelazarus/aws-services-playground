# 12 — Observability Dashboard (CloudWatch + X-Ray + SNS)

## Goal
Instrument a live service (pick project 09, 10, or 11 as the target) with **CloudWatch** metrics + logs + dashboards, distributed tracing via **X-Ray**, and alarm-driven paging through **SNS**. The goal is to *see* production before things break.

## Architecture
```
 Service (Lambda / ECS / EC2) ──► CloudWatch Logs + Metrics
                                ├──► X-Ray traces (segments + subsegments)
                                └──► CloudWatch Alarms ──► SNS topic ──► email / Slack / PagerDuty
 CloudWatch Dashboard: latency, error rate, throttles, custom metrics.
```
- The target service emits structured logs and custom metrics.
- X-Ray SDK wraps outbound calls (DynamoDB, HTTP) to produce trace maps.
- CloudWatch dashboards aggregate the key SLI charts.
- Alarms on p95 latency, error rate, and DLQ depth fire into an SNS topic.

## AWS Services
- **CloudWatch** — logs, metrics, dashboards, alarms.
- **X-Ray** — distributed tracing.
- **SNS** — alarm fanout.
- **IAM** — service roles updated with `AWSXRayDaemonWriteAccess` / CloudWatch publish perms.

## Tooling
- **Terraform** — dashboards, alarms, SNS topic + subscriptions. Service code changes live with whichever earlier project you're instrumenting.
- **Node.js / TypeScript** — `aws-xray-sdk` and `@aws-sdk/client-cloudwatch` for `PutMetricData`.

## Setup Steps
1. Pick a target service (e.g. project 10).
2. Enable X-Ray active tracing on the Lambda / task.
3. Add `aws-xray-sdk` to the Node app and capture AWS SDK v3 clients.
4. Emit custom metrics with `PutMetricData` (e.g. `JobDurationMs`, `CacheHitRatio`).
5. In Terraform, define the `aws_cloudwatch_dashboard` with widgets for latency, errors, throughput, and custom metrics.
6. Define alarms + an SNS topic with email subscription.
7. `terraform apply`; generate load; verify alarms fire and the dashboard populates.

## What You Learn
- The three pillars (logs/metrics/traces) and how AWS natively implements each.
- Custom metrics dimensions — cardinality tradeoffs and cost.
- Alarm design: static thresholds vs. anomaly detection, evaluation periods.
- X-Ray service map reading — how to diagnose a latency spike in < 60 seconds.
