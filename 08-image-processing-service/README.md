# 08 — Image Processing Service (S3 + Lambda + Rekognition)

## Goal
Upload an image to S3 and have it automatically analyzed by Amazon Rekognition. A Lambda detects labels (objects, scenes, concepts), stores the tags as S3 object metadata / in a DynamoDB index, and optionally flags NSFW content.

## Architecture
```
 Uploader ──► S3 (incoming/) ──event──► Lambda ──► Rekognition.detectLabels
                                           │
                                           ├──► S3 object metadata (tags)
                                           └──► DynamoDB index (imageId → labels)
```
- S3 event on `incoming/` prefix triggers the Lambda.
- Lambda calls `Rekognition.detectLabels` (and optionally `detectModerationLabels`).
- Results are persisted as S3 object tags and in a DynamoDB lookup table for search.

## AWS Services
- **S3** — image input + metadata store.
- **Lambda** — orchestrator, Node.js / TypeScript.
- **Rekognition** — managed computer vision.
- **DynamoDB** — label index (optional but recommended for query).
- **IAM** — Lambda role with S3 r/w, Rekognition, DynamoDB write.

## Tooling
- **AWS SAM** — template defines bucket, function, table, and the S3 event.
- **Node.js / TypeScript** with the AWS SDK v3 (`@aws-sdk/client-rekognition`).

## Setup Steps
1. Define the bucket with an event notification on `s3:ObjectCreated:*` for the `incoming/` prefix.
2. Define the Lambda with `S3` event and policies `RekognitionLabelsAccess`, `S3CrudPolicy`, `DynamoDBCrudPolicy`.
3. Implement the handler: fetch object, call `DetectLabelsCommand`, write tags + DynamoDB row.
4. `sam build && sam deploy --guided`.
5. Upload a test image to `incoming/`; confirm tags appear on the S3 object and in DynamoDB.

## What You Learn
- Calling managed AI services from Lambda (no model hosting, no GPUs).
- S3 object tagging vs. metadata vs. separate index — tradeoffs.
- Rekognition quotas and per-call costs — worth checking before scaling.
