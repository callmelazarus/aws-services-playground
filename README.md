# aws-services-playground

A hands-on portfolio of 13 AWS projects built to reinforce the knowledge from the **AWS Certified Developer – Associate** certification, develop system-design intuition, and prepare for re-certification. Every project is written in **Node.js / TypeScript** and ships as a self-contained subdirectory with its own README, architecture notes, and setup steps.

The tooling deliberately progresses from raw AWS CLI → AWS SAM → Terraform, mirroring how an engineer grows on the job: you start by learning what the services *are*, then learn to model serverless applications declaratively, then graduate to full infrastructure-as-code across environments.

---

## Projects

| # | Project | AWS Services | Difficulty | Tooling | Description |
|---|---------|--------------|------------|---------|-------------|
| 01 | [static-site](./01-static-site) | S3, CloudFront | Beginner | AWS CLI | Host a static site behind a CDN. |
| 02 | [file-upload-pipeline](./02-file-upload-pipeline) | S3, Lambda, SNS | Beginner | AWS CLI | S3 upload triggers Lambda and fans out a notification. |
| 03 | [three-tier-web-app](./03-three-tier-web-app) | EC2, ElastiCache (Redis), RDS (Postgres), Security Groups, IAM | Intermediate | AWS CLI | Classic 3-tier Node.js app with caching and a relational DB. |
| 04 | [serverless-rest-api](./04-serverless-rest-api) | API Gateway, Lambda, DynamoDB | Intermediate | AWS SAM | Full CRUD REST API on fully managed compute and storage. |
| 05 | [auth-protected-api](./05-auth-protected-api) | Cognito, API Gateway, Lambda | Intermediate | AWS SAM | Adds JWT-based auth to project 04. |
| 06 | [async-job-queue](./06-async-job-queue) | SQS, Lambda, DynamoDB | Intermediate | AWS SAM | Durable asynchronous job processing with a queue-backed worker. |
| 07 | [kinesis-streaming-pipeline](./07-kinesis-streaming-pipeline) | Kinesis Data Streams, Lambda, S3 | Intermediate | AWS SAM | High-volume real-time event ingestion and archival. |
| 08 | [image-processing-service](./08-image-processing-service) | S3, Lambda, Rekognition | Intermediate | AWS SAM | Auto-tag uploaded images using managed computer vision. |
| 09 | [multi-env-deployment](./09-multi-env-deployment) | VPC, EC2, RDS, Route 53, Terraform Workspaces | Advanced | Terraform | Node + Postgres app deployed across dev/prod with DNS routing. |
| 10 | [containerized-microservice](./10-containerized-microservice) | ECS Fargate, ECR, ALB | Advanced | Terraform | Dockerized Node service behind a load balancer. |
| 11 | [realtime-notifications](./11-realtime-notifications) | API Gateway WebSockets, Lambda, DynamoDB | Advanced | Terraform | Live push updates to connected clients. |
| 12 | [observability-dashboard](./12-observability-dashboard) | CloudWatch, X-Ray, SNS | Advanced | Terraform | Tracing, metrics, and alerting across a live service. |
| 13 | [secrets-and-orchestration](./13-secrets-and-orchestration) | Secrets Manager, Parameter Store, Step Functions, Lambda | Advanced | Terraform | Multi-step workflow with proper secrets handling. |

---

## Coverage

### Strengths

This repo covers the core pillars of real AWS production architecture — compute (EC2, Lambda, ECS Fargate), storage (S3, DynamoDB, RDS, ElastiCache), eventing and messaging (SQS, SNS, EventBridge, Kinesis, WebSockets), auth (Cognito), orchestration (Step Functions), secrets management (Secrets Manager, Parameter Store), observability (CloudWatch, X-Ray), networking (VPC, ALB, Security Groups), DNS (Route 53), and IaC (Terraform, SAM, CLI). The tooling progression mirrors how engineers grow on the job. Projects intentionally build on each other — project 05 extends 04, project 12 can instrument 09–11.

### Known Gaps

A few meaningful AWS services are not covered here. Lambda@Edge and advanced CloudFront behaviors (project 01 only scratches the surface). Aurora Serverless is increasingly common in production but not covered — project 03 and 09 use standard RDS. AWS AppSync (managed GraphQL) is absent. EventBridge is only lightly touched. This repo is not exhaustive — it is intentionally scoped to the highest-signal services for a Developer Associate foundation and system design fluency. These gaps are good candidates for future projects.

---

## Tooling Progression

| Projects | Tooling | Why |
|----------|---------|-----|
| 01–03 | **AWS CLI** | Forces you to touch every service primitive directly. No abstraction — you learn what `aws s3 cp`, `aws iam create-role`, and `aws ec2 run-instances` actually do. |
| 04–08 | **AWS SAM** | Declarative serverless modeling. You stop clicking and start describing: functions, events, tables, permissions all live in one template. |
| 09–13 | **Terraform** | Full IaC across providers. Workspaces, modules, state, and the language used to ship production infra in real companies. |

## Language

Every project uses **Node.js + TypeScript** — Lambda handlers, EC2 servers, container workloads. Shared conventions (tsconfig, linting, package scripts) live with each project so each directory is independently runnable.

## How to Use This Repo

1. Walk the projects in order. Each one introduces new services and reuses earlier patterns.
2. Read the per-project README before touching any code — the architecture diagram and AWS services section are the study material.
3. Tear down resources after each project. Billing alerts > surprises.
4. Come back to this roadmap periodically. Projects are living documents; revisit to upgrade with new services or patterns.
