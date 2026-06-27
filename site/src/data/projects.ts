import type { Project } from '@/types/project'

export const projects: Project[] = [
  // ── 01 Static Site ────────────────────────────────────────────────────────
  {
    slug: '01-static-site',
    number: 1,
    title: 'Static Site',
    difficulty: 'Beginner',
    tooling: 'AWS CLI',
    description: 'Host a static site on S3 served globally through a CloudFront CDN with HTTPS.',
    services: ['S3', 'CloudFront', 'IAM'],
    goal: 'Host a static website (HTML/CSS/JS bundle) on S3 and serve it globally through a CloudFront distribution with HTTPS. Focused on understanding S3 bucket semantics, CloudFront origins, and cache invalidation.',
    whatYouLearn: [
      'S3 bucket policies and OAC vs. legacy OAI',
      'CloudFront distribution config: origins, behaviors, TTLs',
      'Why invalidations matter and how caching surprises you',
    ],
    reference: {
      label: 'AWS — Get started with a secure static website (CloudFront + S3 + OAC)',
      url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/getting-started-secure-static-website-cloudformation-template.html',
    },
    diagram: {
      nodes: [
        { id: 'user', type: 'service', position: { x: 0, y: 100 }, data: { label: 'User', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'cf', type: 'service', position: { x: 220, y: 100 }, data: { label: 'CloudFront', icon: 'SiAmazonaws', category: 'networking' } },
        { id: 's3', type: 'service', position: { x: 440, y: 100 }, data: { label: 'S3', icon: 'SiAmazons3', category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'user', target: 'cf', label: 'HTTPS' },
        { id: 'e2', source: 'cf', target: 's3', label: 'OAC-restricted' },
      ],
    },
  },

  // ── 02 File Upload Pipeline ───────────────────────────────────────────────
  {
    slug: '02-file-upload-pipeline',
    number: 2,
    title: 'File Upload Pipeline',
    difficulty: 'Beginner',
    tooling: 'AWS CLI',
    description: 'S3 upload event triggers a Lambda function that fans out a notification via SNS.',
    services: ['S3', 'Lambda', 'SNS'],
    goal: 'Trigger a Lambda function when a file is uploaded to S3, process the event, and fan out a notification through SNS to downstream subscribers.',
    whatYouLearn: [
      'S3 event notifications and Lambda triggers',
      'SNS topics, subscriptions, and fan-out pattern',
      'Lambda execution role scoping for S3 and SNS access',
    ],
    reference: {
      label: 'AWS Architecture Blog — Amazon S3 event-driven design patterns',
      url: 'https://aws.amazon.com/blogs/architecture/get-started-with-amazon-s3-event-driven-design-patterns/',
    },
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: 'SiAmazonaws', category: 'client' } },
        { id: 's3', type: 'service', position: { x: 220, y: 120 }, data: { label: 'S3', icon: 'SiAmazons3', category: 'storage' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: 'SiAwslambda', category: 'compute' } },
        { id: 'sns', type: 'service', position: { x: 660, y: 0 }, data: { label: 'SNS', icon: 'SiAmazonaws', category: 'messaging' } },
        { id: 'sub', type: 'service', position: { x: 880, y: 0 }, data: { label: 'Subscriber', icon: 'SiAmazonaws', category: 'client' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 's3', label: 'upload' },
        { id: 'e2', source: 's3', target: 'lambda', label: 'trigger' },
        { id: 'e3', source: 'lambda', target: 'sns', label: 'publish' },
        { id: 'e4', source: 'sns', target: 'sub', label: 'notify' },
      ],
    },
  },

  // ── 03 Three-tier Web App ────────────────────────────────────────────────
  {
    slug: '03-three-tier-web-app',
    number: 3,
    title: 'Three-Tier Web App',
    difficulty: 'Intermediate',
    tooling: 'AWS CLI',
    description: 'Classic Node.js app on EC2 with Redis caching and a Postgres relational database.',
    services: ['EC2', 'ElastiCache', 'RDS', 'Security Groups', 'IAM'],
    goal: 'Deploy a classic 3-tier Node.js application: an EC2 instance running the app server, ElastiCache (Redis) for caching, and RDS (Postgres) as the relational database. Focuses on VPC layout, security groups, and IAM.',
    whatYouLearn: [
      'Security group rules: allowing EC2 → RDS and EC2 → Redis traffic only',
      'IAM instance profiles vs. hardcoded credentials',
      'Connection pooling patterns for Lambda vs. EC2',
      'Why ElastiCache dramatically reduces RDS read load',
    ],
    reference: {
      label: 'AWS Architecture Blog — Building a three-tier architecture',
      url: 'https://aws.amazon.com/blogs/architecture/building-a-three-tier-architecture-on-a-budget/',
    },
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'ec2', type: 'service', position: { x: 220, y: 120 }, data: { label: 'EC2 (Node.js)', icon: 'SiAmazonec2', category: 'compute' } },
        { id: 'redis', type: 'service', position: { x: 440, y: 0 }, data: { label: 'ElastiCache', icon: 'SiAmazonaws', category: 'storage' } },
        { id: 'rds', type: 'service', position: { x: 440, y: 240 }, data: { label: 'RDS (Postgres)', icon: 'SiAmazonaws', category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'ec2' },
        { id: 'e2', source: 'ec2', target: 'redis', label: 'cache' },
        { id: 'e3', source: 'ec2', target: 'rds', label: 'query' },
      ],
    },
  },

  // ── 04 Serverless REST API ────────────────────────────────────────────────
  {
    slug: '04-serverless-rest-api',
    number: 4,
    title: 'Serverless REST API',
    difficulty: 'Intermediate',
    tooling: 'AWS SAM',
    description: 'Full CRUD REST API on API Gateway + Lambda with DynamoDB storage, provisioned by AWS SAM.',
    services: ['API Gateway', 'Lambda', 'DynamoDB', 'IAM'],
    goal: 'Build a full CRUD REST API on fully managed, pay-per-request infrastructure using AWS SAM. API Gateway exposes /items endpoints backed by Lambda handlers reading and writing to DynamoDB.',
    whatYouLearn: [
      'SAM template structure: Function, Api, SimpleTable',
      'Event sources as first-class SAM concepts',
      'DynamoDB access patterns — design around access pattern, not entity',
      'Local iteration with sam local start-api',
    ],
    reference: {
      label: 'AWS — Tutorial: Using Lambda with API Gateway (CRUD + DynamoDB)',
      url: 'https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-tutorial.html',
    },
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'apigw', type: 'service', position: { x: 220, y: 120 }, data: { label: 'API Gateway', icon: 'SiAmazonaws', category: 'networking' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: 'SiAwslambda', category: 'compute' } },
        { id: 'dynamo', type: 'service', position: { x: 660, y: 120 }, data: { label: 'DynamoDB', icon: 'SiAmazondynamodb', category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'apigw', label: 'REST' },
        { id: 'e2', source: 'apigw', target: 'lambda', label: 'invoke' },
        { id: 'e3', source: 'lambda', target: 'dynamo', label: 'CRUD' },
      ],
    },
  },

  // ── 05 Auth-Protected API ─────────────────────────────────────────────────
  {
    slug: '05-auth-protected-api',
    number: 5,
    title: 'Auth-Protected API',
    difficulty: 'Intermediate',
    tooling: 'AWS SAM',
    description: 'Adds Cognito JWT-based authentication to the serverless REST API from project 04.',
    services: ['Cognito', 'API Gateway', 'Lambda', 'DynamoDB'],
    goal: 'Add JWT-based authentication to the serverless REST API (project 04) using Amazon Cognito. The client authenticates with Cognito to get a JWT, then passes it as a Bearer token on every API request. API Gateway validates the token before invoking Lambda.',
    whatYouLearn: [
      'Cognito User Pools vs. Identity Pools',
      'API Gateway Cognito authorizers — token validation without Lambda',
      'JWT claims and how to use them inside Lambda handlers',
      'CORS preflight handling with an authorizer in place',
    ],
    reference: {
      label: 'AWS — Control access to REST APIs using Amazon Cognito user pools',
      url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html',
    },
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'cognito', type: 'service', position: { x: 220, y: 0 }, data: { label: 'Cognito', icon: 'SiAmazonaws', category: 'security' } },
        { id: 'apigw', type: 'service', position: { x: 220, y: 240 }, data: { label: 'API Gateway', icon: 'SiAmazonaws', category: 'networking' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: 'SiAwslambda', category: 'compute' } },
        { id: 'dynamo', type: 'service', position: { x: 660, y: 120 }, data: { label: 'DynamoDB', icon: 'SiAmazondynamodb', category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'cognito', label: 'authenticate' },
        { id: 'e2', source: 'client', target: 'apigw', label: 'JWT Bearer' },
        { id: 'e3', source: 'apigw', target: 'lambda', label: 'authorized' },
        { id: 'e4', source: 'lambda', target: 'dynamo', label: 'CRUD (scoped by sub)' },
      ],
    },
  },

  // ── 06 Async Job Queue ────────────────────────────────────────────────────
  {
    slug: '06-async-job-queue',
    number: 6,
    title: 'Async Job Queue',
    difficulty: 'Intermediate',
    tooling: 'AWS SAM',
    description: 'Durable asynchronous job processing: SQS queues work, Lambda processes it, DynamoDB tracks status.',
    services: ['SQS', 'Lambda', 'DynamoDB'],
    goal: 'Build a durable asynchronous job processing system. Clients enqueue jobs to SQS; a Lambda worker polls the queue, processes each job, and writes the result status to DynamoDB. Failed jobs retry automatically via SQS visibility timeout.',
    whatYouLearn: [
      'SQS visibility timeout and how it drives retry behavior',
      'Lambda event source mapping for SQS — batch size and concurrency',
      'Dead-letter queues for unprocessable messages',
      'Idempotency — why job handlers must be safe to run twice',
    ],
    reference: {
      label: 'AWS — Creating and configuring an Amazon SQS event source mapping',
      url: 'https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html',
    },
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'sqs', type: 'service', position: { x: 220, y: 120 }, data: { label: 'SQS', icon: 'SiAmazonsqs', category: 'messaging' } },
        { id: 'dlq', type: 'service', position: { x: 220, y: 300 }, data: { label: 'SQS DLQ', icon: 'SiAmazonsqs', category: 'messaging' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda (worker)', icon: 'SiAwslambda', category: 'compute' } },
        { id: 'dynamo', type: 'service', position: { x: 660, y: 120 }, data: { label: 'DynamoDB', icon: 'SiAmazondynamodb', category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'sqs', label: 'enqueue' },
        { id: 'e2', source: 'sqs', target: 'lambda', label: 'poll batch' },
        { id: 'e3', source: 'lambda', target: 'dynamo', label: 'update status' },
        { id: 'e4', source: 'sqs', target: 'dlq', label: 'maxReceiveCount exceeded' },
      ],
    },
  },

  // ── 07 Kinesis Streaming Pipeline ────────────────────────────────────────
  {
    slug: '07-kinesis-streaming-pipeline',
    number: 7,
    title: 'Kinesis Streaming Pipeline',
    difficulty: 'Intermediate',
    tooling: 'AWS SAM',
    description: 'High-volume real-time event ingestion via Kinesis Data Streams, processed and archived to S3.',
    services: ['Kinesis Data Streams', 'Lambda', 'S3'],
    goal: 'Ingest high-volume real-time events using Kinesis Data Streams. A Lambda processor consumes shard records in micro-batches and writes aggregated data to S3 for archival and downstream analysis.',
    whatYouLearn: [
      'Kinesis shard model — partition keys, sequence numbers, throughput limits',
      'Lambda event source mapping for Kinesis — batch window and parallelism',
      'At-least-once delivery and how to handle duplicates',
      'Kinesis vs. SQS — when to use each',
    ],
    reference: {
      label: 'AWS — Using Lambda to process records from Amazon Kinesis Data Streams',
      url: 'https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html',
    },
    diagram: {
      nodes: [
        { id: 'producer', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Producer', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'kinesis', type: 'service', position: { x: 220, y: 120 }, data: { label: 'Kinesis', icon: 'SiAmazonaws', category: 'messaging' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: 'SiAwslambda', category: 'compute' } },
        { id: 's3', type: 'service', position: { x: 660, y: 120 }, data: { label: 'S3', icon: 'SiAmazons3', category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'producer', target: 'kinesis', label: 'put records' },
        { id: 'e2', source: 'kinesis', target: 'lambda', label: 'shard trigger' },
        { id: 'e3', source: 'lambda', target: 's3', label: 'archive' },
      ],
    },
  },

  // ── 08 Image Processing ───────────────────────────────────────────────────────
  {
    slug: '08-image-processing-service',
    number: 8,
    title: 'Image Processing Service',
    difficulty: 'Intermediate',
    tooling: 'AWS SAM',
    description: 'Auto-tag uploaded images using Rekognition — S3 upload triggers Lambda which calls the vision API.',
    services: ['S3', 'Lambda', 'Rekognition'],
    goal: 'Auto-tag uploaded images using managed computer vision. When an image lands in S3, a Lambda function calls Rekognition DetectLabels and writes the resulting tags back to the object metadata.',
    whatYouLearn: [
      'Rekognition DetectLabels API — confidence scores and label hierarchy',
      'S3 object metadata as a lightweight tag store',
      'Async event-driven processing vs. synchronous request/response',
      'IAM least-privilege for cross-service Lambda calls',
    ],
    reference: {
      label: 'AWS — Using Amazon Rekognition and Lambda to tag assets in an S3 bucket',
      url: 'https://docs.aws.amazon.com/rekognition/latest/dg/images-lambda-s3-tutorial.html',
    },
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: 'SiAmazonaws', category: 'client' } },
        { id: 's3', type: 'service', position: { x: 220, y: 120 }, data: { label: 'S3', icon: 'SiAmazons3', category: 'storage' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: 'SiAwslambda', category: 'compute' } },
        { id: 'rekog', type: 'service', position: { x: 660, y: 120 }, data: { label: 'Rekognition', icon: 'SiAmazonaws', category: 'compute' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 's3', label: 'upload image' },
        { id: 'e2', source: 's3', target: 'lambda', label: 'trigger' },
        { id: 'e3', source: 'lambda', target: 'rekog', label: 'DetectLabels' },
        { id: 'e4', source: 'rekog', target: 'lambda', label: 'labels' },
        { id: 'e5', source: 'lambda', target: 's3', label: 'write tags' },
      ],
    },
  },

  // ── 09 Multi-env Deployment ───────────────────────────────────────────────
  {
    slug: '09-multi-env-deployment',
    number: 9,
    title: 'Multi-Env Deployment',
    difficulty: 'Advanced',
    tooling: 'Terraform',
    description: 'Node + Postgres app deployed across dev and prod environments using Terraform Workspaces and Route 53.',
    services: ['VPC', 'EC2', 'RDS', 'Route 53', 'Terraform Workspaces'],
    goal: 'Deploy the same Node.js + Postgres application across isolated dev and prod environments using Terraform Workspaces. Route 53 routes traffic to the correct EC2 instance per environment with environment-specific DNS names.',
    whatYouLearn: [
      'Terraform Workspaces — how they map to environment isolation',
      'Terraform variable files per environment (dev.tfvars, prod.tfvars)',
      'Route 53 hosted zones and A-record aliases pointing at EC2/ALB',
      'RDS parameter groups and why prod should differ from dev',
    ],
    reference: {
      label: 'Terraform — Manage workspaces (environment isolation)',
      url: 'https://developer.hashicorp.com/terraform/cli/workspaces',
    },
    diagram: {
      nodes: [
        { id: 'dns', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Route 53', icon: 'SiAmazonaws', category: 'networking' } },
        { id: 'ec2', type: 'service', position: { x: 220, y: 120 }, data: { label: 'EC2 (Node.js)', icon: 'SiAmazonec2', category: 'compute' } },
        { id: 'rds', type: 'service', position: { x: 440, y: 120 }, data: { label: 'RDS (Postgres)', icon: 'SiAmazonaws', category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'dns', target: 'ec2', label: 'A record' },
        { id: 'e2', source: 'ec2', target: 'rds', label: 'query' },
      ],
    },
  },

  // ── 10 Containerized Microservice ─────────────────────────────────────────
  {
    slug: '10-containerized-microservice',
    number: 10,
    title: 'Containerized Microservice',
    difficulty: 'Advanced',
    tooling: 'Terraform',
    description: 'Dockerized Node.js service on ECS Fargate behind an Application Load Balancer, image stored in ECR.',
    services: ['ECS Fargate', 'ECR', 'ALB', 'VPC', 'IAM', 'CloudWatch Logs'],
    goal: 'Ship a Dockerized Node.js service on ECS Fargate behind an ALB. The container image is stored in ECR. Terraform provisions everything: VPC, ECR, ECS cluster + service + task definition, and ALB with health checks.',
    whatYouLearn: [
      'ECS task definition vs. service vs. cluster — the mental model',
      'Task execution role (pull image, write logs) vs. task role (app-level AWS calls)',
      'ALB target groups and health checks driving zero-downtime deploys',
      'Fargate pricing model vs. EC2-backed ECS',
    ],
    reference: {
      label: 'AWS — Use an Application Load Balancer for Amazon ECS',
      url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html',
    },
    diagram: {
      nodes: [
        { id: 'internet', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Internet', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'alb', type: 'service', position: { x: 220, y: 120 }, data: { label: 'ALB', icon: 'SiAmazonaws', category: 'networking' } },
        { id: 'ecs', type: 'service', position: { x: 440, y: 120 }, data: { label: 'ECS Fargate', icon: 'SiAmazonaws', category: 'compute' } },
        { id: 'ecr', type: 'service', position: { x: 660, y: 0 }, data: { label: 'ECR', icon: 'SiAmazonaws', category: 'storage' } },
        { id: 'cw', type: 'service', position: { x: 660, y: 240 }, data: { label: 'CloudWatch', icon: 'SiAmazonaws', category: 'observability' } },
      ],
      edges: [
        { id: 'e1', source: 'internet', target: 'alb' },
        { id: 'e2', source: 'alb', target: 'ecs', label: 'route' },
        { id: 'e3', source: 'ecs', target: 'ecr', label: 'pull image' },
        { id: 'e4', source: 'ecs', target: 'cw', label: 'logs' },
      ],
    },
  },

  // ── 11 Realtime Notifications ─────────────────────────────────────────────
  {
    slug: '11-realtime-notifications',
    number: 11,
    title: 'Realtime Notifications',
    difficulty: 'Advanced',
    tooling: 'Terraform',
    description: 'Live push updates to connected clients via API Gateway WebSockets, Lambda, and DynamoDB connection store.',
    services: ['API Gateway WebSockets', 'Lambda', 'DynamoDB'],
    goal: 'Push real-time updates to connected browser clients using API Gateway WebSockets. Lambda handles connect/disconnect/message routes. DynamoDB stores active connection IDs so any Lambda invocation can broadcast to all connected clients.',
    whatYouLearn: [
      'API Gateway WebSocket routes: $connect, $disconnect, $default',
      'How to broadcast to multiple connections from Lambda',
      'Connection ID lifecycle and stale connection cleanup',
      'WebSockets vs. Server-Sent Events vs. polling — when to use each',
    ],
    reference: {
      label: 'AWS — WebSocket chat app with API Gateway, Lambda and DynamoDB',
      url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-chat-app.html',
    },
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'apigw', type: 'service', position: { x: 220, y: 120 }, data: { label: 'API GW (WS)', icon: 'SiAmazonaws', category: 'networking' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: 'SiAwslambda', category: 'compute' } },
        { id: 'dynamo', type: 'service', position: { x: 660, y: 120 }, data: { label: 'DynamoDB', icon: 'SiAmazondynamodb', category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'apigw', label: 'ws connect' },
        { id: 'e2', source: 'apigw', target: 'lambda', label: 'route' },
        { id: 'e3', source: 'lambda', target: 'dynamo', label: 'store connectionId' },
        { id: 'e4', source: 'lambda', target: 'apigw', label: 'postToConnection' },
      ],
    },
  },

  // ── 12 Observability Dashboard ────────────────────────────────────────────
  {
    slug: '12-observability-dashboard',
    number: 12,
    title: 'Observability Dashboard',
    difficulty: 'Advanced',
    tooling: 'Terraform',
    description: 'Structured logging, distributed tracing with X-Ray, CloudWatch metrics, and SNS alerting across a live service.',
    services: ['CloudWatch', 'X-Ray', 'SNS'],
    goal: 'Instrument a live service with structured logging, distributed tracing (X-Ray), CloudWatch metrics, and alarm-driven SNS alerting. Provides the observability foundation for any production workload.',
    whatYouLearn: [
      'Structured JSON logs vs. text logs — why parseable logs matter',
      'X-Ray trace segments, subsegments, and sampling rules',
      'CloudWatch metric filters — turning log patterns into metrics',
      'Alarm → SNS → email/PagerDuty notification chain',
    ],
    reference: {
      label: 'AWS — Notify with CloudWatch + SNS when X-Ray detects latency, errors, faults',
      url: 'https://aws.amazon.com/blogs/devops/using-amazon-cloudwatch-and-amazon-sns-to-notify-when-aws-x-ray-detects-elevated-levels-of-latency-errors-and-faults-in-your-application/',
    },
    diagram: {
      nodes: [
        { id: 'svc', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Service', icon: 'SiAmazonaws', category: 'compute' } },
        { id: 'cw', type: 'service', position: { x: 220, y: 0 }, data: { label: 'CloudWatch', icon: 'SiAmazonaws', category: 'observability' } },
        { id: 'xray', type: 'service', position: { x: 220, y: 240 }, data: { label: 'X-Ray', icon: 'SiAmazonaws', category: 'observability' } },
        { id: 'sns', type: 'service', position: { x: 440, y: 0 }, data: { label: 'SNS', icon: 'SiAmazonaws', category: 'messaging' } },
        { id: 'alert', type: 'service', position: { x: 660, y: 0 }, data: { label: 'Alert Subscriber', icon: 'SiAmazonaws', category: 'client' } },
      ],
      edges: [
        { id: 'e1', source: 'svc', target: 'cw', label: 'metrics/logs' },
        { id: 'e2', source: 'svc', target: 'xray', label: 'traces' },
        { id: 'e3', source: 'cw', target: 'sns', label: 'alarm' },
        { id: 'e4', source: 'sns', target: 'alert', label: 'notify' },
      ],
    },
  },

  // ── 13 Secrets & Orchestration ────────────────────────────────────────────
  {
    slug: '13-secrets-and-orchestration',
    number: 13,
    title: 'Secrets & Orchestration',
    difficulty: 'Advanced',
    tooling: 'Terraform',
    description: 'Multi-step workflow via Step Functions with proper secrets handling via Secrets Manager and Parameter Store.',
    services: ['Secrets Manager', 'Parameter Store', 'Step Functions', 'Lambda'],
    goal: 'Build a multi-step workflow using Step Functions where each Lambda step fetches runtime secrets from Secrets Manager and configuration from Parameter Store — no secrets in environment variables or code.',
    whatYouLearn: [
      'Step Functions state machine definition — Task, Choice, Wait, Parallel states',
      'Secrets Manager vs. Parameter Store — rotation, cost, use cases',
      'IAM resource-based policies for Step Functions → Lambda invocation',
      'Error handling and retries in state machine definitions',
    ],
    reference: {
      label: 'AWS — Creating a Step Functions state machine that uses Lambda',
      url: 'https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-creating-lambda-state-machine.html',
    },
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: 'SiAmazonaws', category: 'client' } },
        { id: 'sfn', type: 'service', position: { x: 220, y: 120 }, data: { label: 'Step Functions', icon: 'SiAmazonaws', category: 'compute' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda (steps)', icon: 'SiAwslambda', category: 'compute' } },
        { id: 'sm', type: 'service', position: { x: 660, y: 0 }, data: { label: 'Secrets Manager', icon: 'SiAmazonaws', category: 'security' } },
        { id: 'ps', type: 'service', position: { x: 660, y: 240 }, data: { label: 'Parameter Store', icon: 'SiAmazonaws', category: 'security' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'sfn', label: 'start execution' },
        { id: 'e2', source: 'sfn', target: 'lambda', label: 'invoke step' },
        { id: 'e3', source: 'lambda', target: 'sm', label: 'get secret' },
        { id: 'e4', source: 'lambda', target: 'ps', label: 'get config' },
      ],
    },
  },
]
