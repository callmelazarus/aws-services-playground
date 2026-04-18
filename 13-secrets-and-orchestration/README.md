# 13 — Secrets & Orchestration (Secrets Manager + Parameter Store + Step Functions + Lambda)

## Goal
Build a multi-step workflow with **Step Functions** that calls an external API using credentials stored in **Secrets Manager**, reads non-secret config from **SSM Parameter Store**, and composes several Lambdas into a retry/error-handled state machine. This is the capstone — production-grade orchestration with proper secrets hygiene.

## Architecture
```
 Trigger ──► Step Functions state machine
                 │
                 ├── Lambda A: fetch config from Parameter Store + secret from Secrets Manager
                 ├── Lambda B: call external API using the secret
                 ├── Choice state: success / retry / fail branches
                 ├── Lambda C: persist result
                 └── Catch + Retry policies on each task state
```
- Step Functions coordinates the workflow — retries, timeouts, branching, parallel fan-out all declarative.
- Each step is a Lambda; none of them know about each other directly.
- Secrets Manager holds rotating credentials (DB password, API key).
- Parameter Store holds non-sensitive config (feature flags, endpoint URLs).

## AWS Services
- **Step Functions** — workflow orchestrator (standard or express, depending on volume).
- **Lambda** — individual steps.
- **Secrets Manager** — sensitive credentials (+ rotation).
- **SSM Parameter Store** — non-secret config.
- **IAM** — scoped roles: each Lambda only sees the secrets/parameters it needs.

## Tooling
- **Terraform** — state machine definition (ASL JSON), Lambdas, secrets, parameters, IAM.
- **Node.js / TypeScript** for all Lambda steps.

## Setup Steps
1. Define the secret (`aws_secretsmanager_secret` + `_version`) and parameters (`aws_ssm_parameter`).
2. Define each Lambda step with a tightly scoped IAM role (`secretsmanager:GetSecretValue` on one ARN, not `*`).
3. Write the state machine in ASL — `Task` states, `Retry`, `Catch`, `Choice`, optional `Parallel`.
4. `terraform apply`.
5. Start an execution: `aws stepfunctions start-execution ...` and watch the visual flow in the console.
6. Force an error in a step to confirm retry + catch branches behave as designed.

## What You Learn
- Step Functions ASL mental model — states, transitions, error handling as data.
- Secrets Manager vs. Parameter Store — which belongs where and why.
- Secret rotation and why apps must re-read, not cache forever.
- Least-privilege IAM at step granularity — a real pattern, not aspirational.
