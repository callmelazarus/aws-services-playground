# 07 — Kinesis Streaming Pipeline (Kinesis + Lambda + S3)

## Goal
Ingest high-volume real-time events into a Kinesis Data Stream, process them with a Lambda consumer, and archive the raw + enriched events in S3 partitioned by date. This is the pattern behind most clickstream, IoT, and audit-log pipelines on AWS.

## Architecture
```
 Producers ──(PutRecord)──► Kinesis Data Stream ──(shard iterator)──► Lambda ──► S3 (partitioned by yyyy/mm/dd/hh)
```
- Kinesis provides ordered, sharded, replayable event ingestion.
- Lambda is invoked per batch of records from each shard.
- S3 is the long-term archive; partitioning makes it Athena-queryable later.

## AWS Services
- **Kinesis Data Streams** — ingestion layer.
- **Lambda** — stream consumer.
- **S3** — archival storage.
- **IAM** — Lambda role with Kinesis read + S3 write.

## Tooling
- **AWS SAM** — defines the stream, function, and event source mapping.
- **Node.js / TypeScript** for producer (test script) and consumer.

## Setup Steps
1. Define `AWS::Kinesis::Stream` with a shard count (start at 1).
2. Define the consumer Lambda with a `Kinesis` event source, setting `StartingPosition` and `BatchSize`.
3. In the handler: decode each record's base64 data, enrich as needed, write a newline-delimited JSON object to S3 under `events/yyyy/mm/dd/hh/<uuid>.json`.
4. `sam build && sam deploy --guided`.
5. Run the TypeScript producer locally to push a few hundred records.
6. Verify S3 objects appear in the expected partition layout.

## What You Learn
- Shards, partition keys, and how they determine ordering and parallelism.
- Kinesis vs. SQS — when ordering, replay, and fanout matter.
- Batch processing semantics (`bisectBatchOnFunctionError`, `maximumRetryAttempts`).
- Partitioned S3 layout for cheap downstream analytics.
