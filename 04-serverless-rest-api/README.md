# 04 — Serverless REST API (API Gateway + Lambda + DynamoDB)

## Goal
Build a full CRUD REST API on fully managed, pay-per-request infrastructure. First project using **AWS SAM** — instead of wiring resources by hand, you describe the whole app in a template and let CloudFormation provision it.

## Architecture
```
 Client ──► API Gateway (REST) ──► Lambda (Node/TS) ──► DynamoDB table
```
- API Gateway exposes `/items` endpoints (GET, POST, GET/:id, PUT/:id, DELETE/:id).
- Each route is backed by its own Lambda (or one handler dispatching on method/path).
- DynamoDB stores items keyed by `id`.

## AWS Services
- **API Gateway (REST)** — HTTP front door.
- **Lambda** — handlers in Node.js / TypeScript.
- **DynamoDB** — on-demand capacity, single-table design for simplicity.
- **IAM** — SAM generates scoped execution roles via policy templates (`DynamoDBCrudPolicy`).

## Tooling
- **AWS SAM** — `template.yaml` describes the API, functions, and table.
- **Node.js / TypeScript** with `esbuild` (SAM handles bundling via `Metadata: BuildMethod: esbuild`).
- `sam local start-api` for local iteration.

## Setup Steps
1. `sam init` (skip — this repo scaffolds it).
2. Implement handlers under `src/` (one per route or one router).
3. `sam build` — SAM compiles TypeScript + bundles deps.
4. `sam deploy --guided` — first-time deploy prompts for stack name, region, etc.
5. Test the printed API Gateway URL with curl/Postman.
6. `sam delete` to tear down.

## What You Learn
- SAM template structure: `AWS::Serverless::Function`, `AWS::Serverless::Api`, `AWS::Serverless::SimpleTable`.
- Event sources as first-class: `Events.Api` on a function replaces hand-wired integrations.
- DynamoDB access patterns — why you design around the access pattern, not the entity.
- Local iteration with `sam local invoke` / `sam local start-api`.
