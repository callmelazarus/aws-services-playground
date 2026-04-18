# 02 — File Upload Pipeline (S3 + Lambda + SNS)

## Goal
When a file is uploaded to an S3 bucket, a Lambda function runs automatically and publishes a notification to an SNS topic (which can fan out to email, SQS, or another Lambda). This is the canonical "event-driven S3" pattern.

## Architecture
```
 Uploader ──► S3 bucket ──(s3:ObjectCreated)──► Lambda ──► SNS topic ──► subscribers (email/SQS)
```
- S3 bucket configured with an event notification on `s3:ObjectCreated:*`.
- Lambda receives the event, extracts metadata (key, size, content-type), and publishes a message to SNS.
- SNS topic fans out to whatever subscribers you attach (start with email confirmation for simplicity).

## AWS Services
- **S3** — source of events.
- **Lambda** — event handler, written in Node.js / TypeScript.
- **SNS** — pub/sub fanout.
- **IAM** — execution role for Lambda (read S3 metadata, publish to SNS).

## Tooling
- **AWS CLI** for all provisioning.
- **Node.js / TypeScript** for the Lambda handler (bundled with `esbuild` into a zip).

## Setup Steps
1. Create S3 bucket: `aws s3 mb s3://<bucket-name>`.
2. Create SNS topic: `aws sns create-topic --name file-upload-notifications`.
3. Subscribe an email to the topic and confirm it.
4. Create Lambda execution role with `AWSLambdaBasicExecutionRole` + `sns:Publish` + `s3:GetObject`.
5. Build + zip the handler: `npm run build && zip -r function.zip dist node_modules`.
6. `aws lambda create-function ...` with the zip.
7. `aws lambda add-permission ...` to allow S3 to invoke it.
8. `aws s3api put-bucket-notification-configuration ...` wiring the bucket to the Lambda.
9. Upload a test file and verify the SNS email arrives.

## What You Learn
- S3 event notifications and their delivery guarantees.
- Lambda execution roles vs. resource-based policies.
- SNS as a fanout primitive — one event, many consumers.
