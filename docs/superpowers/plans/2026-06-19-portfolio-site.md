# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js portfolio site in `site/` that displays the 13 AWS projects as interactive React Flow architecture diagrams, deployable to Vercel.

**Architecture:** All content is statically generated at build time from a typed `projects.ts` data file. The home page renders 13 project cards; each card links to a split-layout project page with a left info panel and a right React Flow diagram canvas. No CMS, no API routes, no runtime data fetching.

**Tech Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · `@xyflow/react` · `react-icons` · Vitest

## Global Constraints

- All files live under `site/` except `vercel.json` at the repo root
- TypeScript strict mode on throughout
- No `any` types
- All pages are statically generated (`output: 'export'` is NOT used — standard Next.js static generation via `generateStaticParams`)
- `@xyflow/react` version `^12.0.0`, `react-icons` version `^5.0.0`
- Icons imported directly from `react-icons/si` — never resolved by string at runtime
- Node positions are hardcoded `x/y` values — no auto-layout library
- `'use client'` directive required on any component using React Flow hooks or browser APIs

---

## File Map

| File | Responsibility |
|------|---------------|
| `vercel.json` | Points Vercel at `site/` as project root |
| `site/package.json` | Dependencies and scripts |
| `site/next.config.ts` | Minimal Next.js config |
| `site/tailwind.config.ts` | Tailwind content paths |
| `site/tsconfig.json` | TypeScript config with `@/*` path alias |
| `site/postcss.config.js` | Tailwind/autoprefixer PostCSS config |
| `site/vitest.config.ts` | Vitest config (node environment, no DOM needed for data tests) |
| `site/src/types/project.ts` | Shared TS types: `ServiceNodeData`, `Project`, `ServiceCategory` |
| `site/src/data/projects.ts` | All 13 project definitions (nodes, edges, metadata) |
| `site/src/__tests__/projects.test.ts` | Data integrity tests |
| `site/src/components/nodes/ServiceNode.tsx` | Custom React Flow node (client component) |
| `site/src/components/ProjectDiagram.tsx` | React Flow canvas wrapper (client component) |
| `site/src/components/ProjectCard.tsx` | Home page card (server component) |
| `site/src/app/globals.css` | Tailwind directives + `@xyflow/react` CSS import |
| `site/src/app/layout.tsx` | Root layout: font, metadata, dark background |
| `site/src/app/page.tsx` | Home page: 3-column project card grid |
| `site/src/app/projects/[slug]/page.tsx` | Project page: split layout + diagram |

---

### Task 1: Scaffold site/ directory and vercel.json

**Files:**
- Create: `vercel.json`
- Create: `site/package.json`
- Create: `site/next.config.ts`
- Create: `site/tailwind.config.ts`
- Create: `site/tsconfig.json`
- Create: `site/postcss.config.js`
- Create: `site/vitest.config.ts`
- Create: `site/src/app/globals.css`

**Interfaces:**
- Produces: `npm run dev` and `npm run build` work from `site/`; `npm test` runs Vitest

- [ ] **Step 1: Create vercel.json at repo root**

```json
{
  "rootDirectory": "site"
}
```

- [ ] **Step 2: Create site/package.json**

```json
{
  "name": "aws-portfolio-site",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@xyflow/react": "^12.0.0",
    "react-icons": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 3: Create site/next.config.ts**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

- [ ] **Step 4: Create site/tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Create site/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Create site/postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Create site/vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 8: Create site/src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 9: Create a minimal site/src/app/layout.tsx to make Next.js happy**

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 10: Create a minimal site/src/app/page.tsx**

```tsx
export default function HomePage() {
  return <main>AWS Portfolio</main>
}
```

- [ ] **Step 11: Install dependencies**

```bash
cd site && npm install
```

Expected: no errors, `node_modules/` created.

- [ ] **Step 12: Verify build runs**

```bash
cd site && npm run build
```

Expected: build succeeds with "Route (app)" output showing `/` page.

- [ ] **Step 13: Commit**

```bash
git add vercel.json site/
git commit -m "feat: scaffold site/ Next.js project with Vercel config"
```

---

### Task 2: TypeScript types

**Files:**
- Create: `site/src/types/project.ts`

**Interfaces:**
- Produces: `Project`, `ServiceNodeData`, `ServiceCategory` — used by every subsequent task

- [ ] **Step 1: Write the type file**

```typescript
// site/src/types/project.ts
import type { Node, Edge } from '@xyflow/react'

export type ServiceCategory =
  | 'compute'
  | 'storage'
  | 'networking'
  | 'messaging'
  | 'security'
  | 'observability'
  | 'client'

export type ServiceNodeData = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  category: ServiceCategory
}

export type Project = {
  slug: string
  number: number
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  tooling: 'AWS CLI' | 'AWS SAM' | 'Terraform'
  description: string
  services: string[]
  goal: string
  whatYouLearn: string[]
  diagram: {
    nodes: Node<ServiceNodeData>[]
    edges: Edge[]
  }
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
cd site && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add site/src/types/project.ts
git commit -m "feat: add TypeScript types for project data model"
```

---

### Task 3: Project data — projects 01–07

**Files:**
- Create: `site/src/data/projects.ts` (partial — projects 01–07 only)

**Interfaces:**
- Consumes: `Project`, `ServiceNodeData`, `ServiceCategory` from `site/src/types/project.ts`; `Node`, `Edge` from `@xyflow/react`
- Produces: `projects` array (partial) exported from `site/src/data/projects.ts`

**Node position guide:** nodes flow left-to-right with ~200px horizontal spacing. Branches use ±120px vertical offsets from y=120.

- [ ] **Step 1: Write the failing test for data count**

Create `site/src/__tests__/projects.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { projects } from '../data/projects'

describe('projects data', () => {
  it('exports exactly 13 projects', () => {
    expect(projects).toHaveLength(13)
  })

  it('each project has a unique slug', () => {
    const slugs = projects.map(p => p.slug)
    expect(new Set(slugs).size).toBe(13)
  })

  it('each project has a unique number 1–13', () => {
    const numbers = projects.map(p => p.number).sort((a, b) => a - b)
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  })

  it('all diagram edge sources and targets reference valid node ids', () => {
    for (const project of projects) {
      const nodeIds = new Set(project.diagram.nodes.map(n => n.id))
      for (const edge of project.diagram.edges) {
        expect(nodeIds.has(edge.source), `${project.slug}: edge source "${edge.source}" not found`).toBe(true)
        expect(nodeIds.has(edge.target), `${project.slug}: edge target "${edge.target}" not found`).toBe(true)
      }
    }
  })

  it('each project has required fields', () => {
    for (const p of projects) {
      expect(p.slug).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.goal).toBeTruthy()
      expect(p.whatYouLearn.length).toBeGreaterThan(0)
      expect(p.diagram.nodes.length).toBeGreaterThan(0)
      expect(p.diagram.edges.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run tests — expect failure (no projects.ts yet)**

```bash
cd site && npm test
```

Expected: FAIL — "Cannot find module '../data/projects'"

- [ ] **Step 3: Create site/src/data/projects.ts with projects 01–07**

```typescript
// site/src/data/projects.ts
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
```

- [ ] **Step 4: Run tests — expect partial failure**

```bash
cd site && npm test
```

Expected: FAIL on "exports exactly 13 projects" (only 7 defined). All others that don't check count should pass.

- [ ] **Step 5: Commit partial data**

```bash
git add site/src/data/projects.ts site/src/__tests__/projects.test.ts
git commit -m "feat: add project data for 01–07 and data integrity tests"
```

---

### Task 4: Project data — projects 08–13

**Files:**
- Modify: `site/src/data/projects.ts` (append projects 08–13)

**Interfaces:**
- Consumes: same imports as Task 3
- Produces: `projects` array with all 13 entries; all tests pass

- [ ] **Step 1: Append projects 08–13 to the projects array in site/src/data/projects.ts**

Add these entries inside the `projects` array after project 07:

```typescript
  // ── 08 Image Processing ───────────────────────────────────────────────────
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
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: SiAmazonaws, category: 'client' } },
        { id: 's3', type: 'service', position: { x: 220, y: 120 }, data: { label: 'S3', icon: SiAmazons3, category: 'storage' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: SiAwslambda, category: 'compute' } },
        { id: 'rekog', type: 'service', position: { x: 660, y: 120 }, data: { label: 'Rekognition', icon: SiAmazonaws, category: 'compute' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 's3', label: 'upload image' },
        { id: 'e2', source: 's3', target: 'lambda', label: 'trigger' },
        { id: 'e3', source: 'lambda', target: 'rekog', label: 'DetectLabels' },
        { id: 'e4', source: 'rekog', target: 's3', label: 'write tags' },
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
    goal: 'Deploy the same Node.js + Postgres application across isolated dev and prod environments using Terraform Workspaces. Route 53 routes traffic to the correct ALB per environment with environment-specific DNS names.',
    whatYouLearn: [
      'Terraform Workspaces — how they map to environment isolation',
      'Terraform variable files per environment (dev.tfvars, prod.tfvars)',
      'Route 53 hosted zones and A-record aliases pointing at EC2/ALB',
      'RDS parameter groups and why prod should differ from dev',
    ],
    diagram: {
      nodes: [
        { id: 'dns', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Route 53', icon: SiAmazonaws, category: 'networking' } },
        { id: 'ec2', type: 'service', position: { x: 220, y: 120 }, data: { label: 'EC2 (Node.js)', icon: SiAmazonec2, category: 'compute' } },
        { id: 'rds', type: 'service', position: { x: 440, y: 120 }, data: { label: 'RDS (Postgres)', icon: SiAmazonaws, category: 'storage' } },
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
    diagram: {
      nodes: [
        { id: 'internet', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Internet', icon: SiAmazonaws, category: 'client' } },
        { id: 'alb', type: 'service', position: { x: 220, y: 120 }, data: { label: 'ALB', icon: SiAmazonaws, category: 'networking' } },
        { id: 'ecs', type: 'service', position: { x: 440, y: 120 }, data: { label: 'ECS Fargate', icon: SiAmazonaws, category: 'compute' } },
        { id: 'ecr', type: 'service', position: { x: 660, y: 0 }, data: { label: 'ECR', icon: SiAmazonaws, category: 'storage' } },
        { id: 'cw', type: 'service', position: { x: 660, y: 240 }, data: { label: 'CloudWatch', icon: SiAmazonaws, category: 'observability' } },
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
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: SiAmazonaws, category: 'client' } },
        { id: 'apigw', type: 'service', position: { x: 220, y: 120 }, data: { label: 'API GW (WS)', icon: SiAmazonaws, category: 'networking' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda', icon: SiAwslambda, category: 'compute' } },
        { id: 'dynamo', type: 'service', position: { x: 660, y: 120 }, data: { label: 'DynamoDB', icon: SiAmazondynamodb, category: 'storage' } },
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
    diagram: {
      nodes: [
        { id: 'svc', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Service', icon: SiAmazonaws, category: 'compute' } },
        { id: 'cw', type: 'service', position: { x: 220, y: 0 }, data: { label: 'CloudWatch', icon: SiAmazonaws, category: 'observability' } },
        { id: 'xray', type: 'service', position: { x: 220, y: 240 }, data: { label: 'X-Ray', icon: SiAmazonaws, category: 'observability' } },
        { id: 'sns', type: 'service', position: { x: 440, y: 0 }, data: { label: 'SNS', icon: SiAmazonaws, category: 'messaging' } },
        { id: 'alert', type: 'service', position: { x: 660, y: 0 }, data: { label: 'Alert Subscriber', icon: SiAmazonaws, category: 'client' } },
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
    diagram: {
      nodes: [
        { id: 'client', type: 'service', position: { x: 0, y: 120 }, data: { label: 'Client', icon: SiAmazonaws, category: 'client' } },
        { id: 'sfn', type: 'service', position: { x: 220, y: 120 }, data: { label: 'Step Functions', icon: SiAmazonaws, category: 'compute' } },
        { id: 'lambda', type: 'service', position: { x: 440, y: 120 }, data: { label: 'Lambda (steps)', icon: SiAwslambda, category: 'compute' } },
        { id: 'sm', type: 'service', position: { x: 660, y: 0 }, data: { label: 'Secrets Manager', icon: SiAmazonaws, category: 'security' } },
        { id: 'ps', type: 'service', position: { x: 660, y: 240 }, data: { label: 'Parameter Store', icon: SiAmazonaws, category: 'security' } },
      ],
      edges: [
        { id: 'e1', source: 'client', target: 'sfn', label: 'start execution' },
        { id: 'e2', source: 'sfn', target: 'lambda', label: 'invoke step' },
        { id: 'e3', source: 'lambda', target: 'sm', label: 'get secret' },
        { id: 'e4', source: 'lambda', target: 'ps', label: 'get config' },
      ],
    },
  },
```

- [ ] **Step 2: Run all tests — expect all pass**

```bash
cd site && npm test
```

Expected: all 5 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add site/src/data/projects.ts
git commit -m "feat: add project data for 08–13, all data tests pass"
```

---

### Task 5: ServiceNode component

**Files:**
- Create: `site/src/components/nodes/ServiceNode.tsx`

**Interfaces:**
- Consumes: `ServiceNodeData`, `ServiceCategory` from `@/types/project`; `Handle`, `Position`, `NodeProps` from `@xyflow/react`
- Produces: `ServiceNode` — a React Flow custom node component registered as type `'service'`

- [ ] **Step 1: Create the component**

```tsx
// site/src/components/nodes/ServiceNode.tsx
'use client'

import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { ServiceNodeData } from '@/types/project'

const categoryStyles: Record<string, string> = {
  compute:      'bg-amber-950 border-amber-500 text-amber-200',
  storage:      'bg-blue-950 border-blue-500 text-blue-200',
  networking:   'bg-purple-950 border-purple-500 text-purple-200',
  messaging:    'bg-green-950 border-green-500 text-green-200',
  security:     'bg-red-950 border-red-500 text-red-200',
  observability:'bg-gray-800 border-gray-500 text-gray-200',
  client:       'bg-slate-800 border-slate-500 text-slate-200',
}

export function ServiceNode({ data }: NodeProps) {
  const nodeData = data as ServiceNodeData
  const Icon = nodeData.icon
  const styles = categoryStyles[nodeData.category] ?? categoryStyles['client']
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg border-2 min-w-[90px] ${styles}`}>
        <Icon className="w-7 h-7" />
        <span className="text-xs font-semibold whitespace-nowrap">{nodeData.label}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
cd site && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add site/src/components/nodes/ServiceNode.tsx
git commit -m "feat: add ServiceNode custom React Flow node component"
```

---

### Task 6: ProjectDiagram component

**Files:**
- Create: `site/src/components/ProjectDiagram.tsx`

**Interfaces:**
- Consumes: `ServiceNode` from `./nodes/ServiceNode`; `ServiceNodeData` from `@/types/project`; `ReactFlow`, `Background`, `Controls`, `MiniMap` from `@xyflow/react`
- Produces: `ProjectDiagram` — client component accepting `nodes: Node<ServiceNodeData>[]` and `edges: Edge[]`

- [ ] **Step 1: Create the component**

```tsx
// site/src/components/ProjectDiagram.tsx
'use client'

import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import type { Node, Edge } from '@xyflow/react'
import { ServiceNode } from './nodes/ServiceNode'
import type { ServiceNodeData } from '@/types/project'

const nodeTypes = { service: ServiceNode }

type Props = {
  nodes: Node<ServiceNodeData>[]
  edges: Edge[]
}

export function ProjectDiagram({ nodes, edges }: Props) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      proOptions={{ hideAttribution: false }}
    >
      <Background color="#334155" gap={24} />
      <Controls />
      <MiniMap nodeColor="#475569" />
    </ReactFlow>
  )
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
cd site && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add site/src/components/ProjectDiagram.tsx
git commit -m "feat: add ProjectDiagram React Flow wrapper component"
```

---

### Task 7: ProjectCard component

**Files:**
- Create: `site/src/components/ProjectCard.tsx`

**Interfaces:**
- Consumes: `Project` from `@/types/project`
- Produces: `ProjectCard` — server component that renders a single project card

- [ ] **Step 1: Create the component**

```tsx
// site/src/components/ProjectCard.tsx
import type { Project } from '@/types/project'

const difficultyStyles = {
  Beginner:     'bg-green-500/20 text-green-300 border border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  Advanced:     'bg-red-500/20 text-red-300 border border-red-500/30',
} as const

const toolingStyles = {
  'AWS CLI':    'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  'AWS SAM':    'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Terraform':  'bg-purple-500/20 text-purple-300 border border-purple-500/30',
} as const

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-colors cursor-pointer h-full flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-slate-500 font-mono text-sm font-bold min-w-[28px] pt-0.5">
          {String(project.number).padStart(2, '0')}
        </span>
        <h2 className="text-white font-semibold text-lg leading-tight">{project.title}</h2>
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyStyles[project.difficulty]}`}>
          {project.difficulty}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${toolingStyles[project.tooling]}`}>
          {project.tooling}
        </span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{project.description}</p>
      <div className="flex flex-wrap gap-1">
        {project.services.map(svc => (
          <span key={svc} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
            {svc}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
cd site && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add site/src/components/ProjectCard.tsx
git commit -m "feat: add ProjectCard component for home grid"
```

---

### Task 8: Root layout and home page

**Files:**
- Modify: `site/src/app/layout.tsx` (replace minimal placeholder)
- Modify: `site/src/app/globals.css` (add `@xyflow/react` CSS import)
- Modify: `site/src/app/page.tsx` (replace minimal placeholder)

**Interfaces:**
- Consumes: `projects` from `@/data/projects`; `ProjectCard` from `@/components/ProjectCard`
- Produces: home page at `/` showing 13 cards in a responsive grid

- [ ] **Step 1: Update globals.css to import React Flow styles**

Replace the contents of `site/src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Note: `@xyflow/react` CSS is imported in `layout.tsx` via a JS import (see next step) — not here.

- [ ] **Step 2: Replace site/src/app/layout.tsx**

```tsx
// site/src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@xyflow/react/dist/style.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AWS Services Playground',
  description: 'Interactive architecture diagrams for 13 AWS projects',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Replace site/src/app/page.tsx**

```tsx
// site/src/app/page.tsx
import Link from 'next/link'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ProjectCard'

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white">AWS Services Playground</h1>
        <p className="mt-2 text-slate-400 text-lg">
          13 hands-on projects — compute, storage, eventing, auth, and IaC.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="h-full">
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Start the dev server and verify the home page**

```bash
cd site && npm run dev
```

Open `http://localhost:3000`. Expected: dark page with 13 project cards in a 3-column grid, each showing number, title, difficulty badge, tooling badge, description, and service chips.

- [ ] **Step 5: Stop the dev server and commit**

```bash
git add site/src/app/layout.tsx site/src/app/globals.css site/src/app/page.tsx
git commit -m "feat: add root layout and home page with 13-card project grid"
```

---

### Task 9: Project page

**Files:**
- Create: `site/src/app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `projects` from `@/data/projects`; `ProjectDiagram` from `@/components/ProjectDiagram`; `Project` from `@/types/project`
- Produces: project page at `/projects/[slug]` with split left-panel / right-diagram layout; `generateStaticParams` for all 13 slugs

- [ ] **Step 1: Create the project page**

```tsx
// site/src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { ProjectDiagram } from '@/components/ProjectDiagram'

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

type Props = { params: { slug: string } }

export default function ProjectPage({ params }: Props) {
  const project = projects.find(p => p.slug === params.slug)
  if (!project) notFound()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel */}
      <aside className="w-[30%] min-w-[260px] max-w-[400px] bg-slate-800 border-r border-slate-700 overflow-y-auto p-6 flex flex-col gap-6">
        <div>
          <Link href="/" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
            ← All projects
          </Link>
          <div className="mt-3">
            <span className="text-slate-500 font-mono text-sm">{String(project.number).padStart(2, '0')}</span>
            <h1 className="text-white text-2xl font-bold mt-1 leading-tight">{project.title}</h1>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
              {project.difficulty}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
              {project.tooling}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Goal</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{project.goal}</p>
        </div>

        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Services</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.services.map(svc => (
              <span key={svc} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-600">
                {svc}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">What You Learn</h2>
          <ul className="space-y-2">
            {project.whatYouLearn.map((item, i) => (
              <li key={i} className="text-slate-300 text-sm flex gap-2">
                <span className="text-slate-600 mt-0.5 shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right panel — diagram */}
      <main className="flex-1 bg-slate-900">
        <ProjectDiagram nodes={project.diagram.nodes} edges={project.diagram.edges} />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Start dev server and verify a project page**

```bash
cd site && npm run dev
```

Open `http://localhost:3000/projects/01-static-site`. Expected: left panel with title "Static Site", goal text, services chips, and what-you-learn bullets. Right panel: React Flow canvas with 3 nodes (User → CloudFront → S3) connected by labeled arrows. Pan and zoom should work.

- [ ] **Step 3: Check a few more projects**

Open `http://localhost:3000/projects/04-serverless-rest-api` — expect 4-node linear diagram.
Open `http://localhost:3000/projects/10-containerized-microservice` — expect branching diagram (ECR and CloudWatch as side branches off ECS).

- [ ] **Step 4: Stop dev server and commit**

```bash
git add site/src/app/projects/
git commit -m "feat: add project page with split layout and React Flow diagram"
```

---

### Task 10: Production build verification

**Files:**
- No new files — verification only

- [ ] **Step 1: Run all tests**

```bash
cd site && npm test
```

Expected: 5/5 PASS.

- [ ] **Step 2: Run production build**

```bash
cd site && npm run build
```

Expected: build succeeds. Output should show 13 static project routes pre-rendered:
```
○ /projects/01-static-site
○ /projects/02-file-upload-pipeline
... (all 13)
```

- [ ] **Step 3: Run the production server locally and spot-check**

```bash
cd site && npm start
```

Open `http://localhost:3000`. Verify home page and at least two project pages render correctly in production mode. Stop the server.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: portfolio site complete — 13 projects with React Flow diagrams"
```
