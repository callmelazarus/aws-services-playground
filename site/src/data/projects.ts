import {
  SiAmazons3,
  SiAwslambda,
  SiAmazondynamodb,
  SiAmazonec2,
  SiAmazonsqs,
  SiAmazonaws,
} from 'react-icons/si'
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
    diagram: {
      nodes: [
        { id: 'user', type: 'service', position: { x: 0, y: 100 }, data: { label: 'User', icon: SiAmazonaws, category: 'client' } },
        { id: 'cf', type: 'service', position: { x: 220, y: 100 }, data: { label: 'CloudFront', icon: SiAmazonaws, category: 'networking' } },
        { id: 's3', type: 'service', position: { x: 440, y: 100 }, data: { label: 'S3', icon: SiAmazons3, category: 'storage' } },
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
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: SiAmazonaws, category: 'client' } },
        { id: 's3', type: 'service', position: { x: 220, y: 120 }, data: { label: 'S3', icon: SiAmazons3, category: 'storage' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: SiAwslambda, category: 'compute' } },
        { id: 'sns', type: 'service', position: { x: 660, y: 0 }, data: { label: 'SNS', icon: SiAmazonaws, category: 'messaging' } },
        { id: 'sub', type: 'service', position: { x: 880, y: 0 }, data: { label: 'Subscriber', icon: SiAmazonaws, category: 'client' } },
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
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: SiAmazonaws, category: 'client' } },
        { id: 'ec2', type: 'service', position: { x: 220, y: 120 }, data: { label: 'EC2 (Node.js)', icon: SiAmazonec2, category: 'compute' } },
        { id: 'redis', type: 'service', position: { x: 440, y: 0 }, data: { label: 'ElastiCache', icon: SiAmazonaws, category: 'storage' } },
        { id: 'rds', type: 'service', position: { x: 440, y: 240 }, data: { label: 'RDS (Postgres)', icon: SiAmazonaws, category: 'storage' } },
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
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: SiAmazonaws, category: 'client' } },
        { id: 'apigw', type: 'service', position: { x: 220, y: 120 }, data: { label: 'API Gateway', icon: SiAmazonaws, category: 'networking' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: SiAwslambda, category: 'compute' } },
        { id: 'dynamo', type: 'service', position: { x: 660, y: 120 }, data: { label: 'DynamoDB', icon: SiAmazondynamodb, category: 'storage' } },
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
    services: ['Cognito', 'API Gateway', 'Lambda'],
    goal: 'Add JWT-based authentication to the serverless REST API (project 04) using Amazon Cognito. The client authenticates with Cognito to get a JWT, then passes it as a Bearer token on every API request. API Gateway validates the token before invoking Lambda.',
    whatYouLearn: [
      'Cognito User Pools vs. Identity Pools',
      'API Gateway Cognito authorizers — token validation without Lambda',
      'JWT claims and how to use them inside Lambda handlers',
      'CORS preflight handling with an authorizer in place',
    ],
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: SiAmazonaws, category: 'client' } },
        { id: 'cognito', type: 'service', position: { x: 220, y: 0 }, data: { label: 'Cognito', icon: SiAmazonaws, category: 'security' } },
        { id: 'apigw', type: 'service', position: { x: 220, y: 240 }, data: { label: 'API Gateway', icon: SiAmazonaws, category: 'networking' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: SiAwslambda, category: 'compute' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'cognito', label: 'authenticate' },
        { id: 'e2', source: 'client', target: 'apigw', label: 'JWT Bearer' },
        { id: 'e3', source: 'apigw', target: 'lambda', label: 'authorized' },
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
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: SiAmazonaws, category: 'client' } },
        { id: 'sqs', type: 'service', position: { x: 220, y: 120 }, data: { label: 'SQS', icon: SiAmazonsqs, category: 'messaging' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda (worker)', icon: SiAwslambda, category: 'compute' } },
        { id: 'dynamo', type: 'service', position: { x: 660, y: 120 }, data: { label: 'DynamoDB', icon: SiAmazondynamodb, category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'sqs', label: 'enqueue' },
        { id: 'e2', source: 'sqs', target: 'lambda', label: 'trigger' },
        { id: 'e3', source: 'lambda', target: 'dynamo', label: 'update status' },
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
    diagram: {
      nodes: [
        { id: 'producer', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Producer', icon: SiAmazonaws, category: 'client' } },
        { id: 'kinesis', type: 'service', position: { x: 220, y: 120 }, data: { label: 'Kinesis', icon: SiAmazonaws, category: 'messaging' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: SiAwslambda, category: 'compute' } },
        { id: 's3', type: 'service', position: { x: 660, y: 120 }, data: { label: 'S3', icon: SiAmazons3, category: 'storage' } },
      ],
      edges: [
        { id: 'e1', source: 'producer', target: 'kinesis', label: 'put records' },
        { id: 'e2', source: 'kinesis', target: 'lambda', label: 'shard trigger' },
        { id: 'e3', source: 'lambda', target: 's3', label: 'archive' },
      ],
    },
  },
]
