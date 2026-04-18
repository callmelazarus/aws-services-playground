# 06 — Async Job Queue (SQS + Lambda + DynamoDB)

## Goal
Build an asynchronous job-processing pipeline. Producers drop jobs into an SQS queue, a Lambda worker drains the queue, processes each job, and records results in DynamoDB. Includes a dead-letter queue (DLQ) for poison messages.

## Architecture
```
 Producer ──► SQS queue ──(batch)──► Lambda worker ──► DynamoDB (job results)
                  │
                  └─(maxReceiveCount exceeded)──► SQS DLQ
```
- Producer can be anything (CLI script, separate Lambda, API endpoint) — the focus here is the worker side.
- SQS decouples producers from consumers and handles retries.
- Lambda is invoked with batches of messages (SQS event source mapping).
- DLQ captures messages the worker failed to process after N attempts for later inspection.

## AWS Services
- **SQS** — primary queue + DLQ.
- **Lambda** — worker function, Node.js / TypeScript.
- **DynamoDB** — job result store.
- **IAM** — Lambda role with `sqs:ReceiveMessage/DeleteMessage` and `dynamodb:PutItem`.

## Tooling
- **AWS SAM** — `template.yaml` defines both queues, the worker Lambda, and its event source mapping.
- **Node.js / TypeScript** for the worker (+ a small CLI producer for testing).

## Setup Steps
1. Define `AWS::SQS::Queue` (main) and a second queue (DLQ), with a `RedrivePolicy` on the main queue.
2. Define the worker `AWS::Serverless::Function` with `Events: SQSEvent` referencing the main queue.
3. Implement idempotent processing logic — SQS delivers at-least-once, so dedupe by message id or job id.
4. `sam build && sam deploy --guided`.
5. Send test messages: `aws sqs send-message --queue-url ... --message-body '{...}'`.
6. Watch CloudWatch logs; confirm results land in DynamoDB.
7. Intentionally throw in the handler to verify DLQ delivery.

## What You Learn
- SQS event source mapping, batch size, partial batch failures (`batchItemFailures`).
- Idempotency — the most important property of any async worker.
- DLQs and how to drain / reprocess them.
- Visibility timeout vs. function timeout — a common footgun.
