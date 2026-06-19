# Portfolio Site Design

**Date:** 2026-06-19
**Status:** Approved

## Goal

A Vercel-hosted Next.js website that lives inside this repo and renders each of the 13 AWS projects as an interactive architecture diagram — primarily for personal reference and learning navigation.

---

## Architecture

```
aws-services-playground/
  site/
    src/
      app/
        page.tsx                    # home — 13-card grid
        projects/[slug]/
          page.tsx                  # per-project diagram page
      components/
        ProjectCard.tsx             # card on home page
        ProjectDiagram.tsx          # React Flow wrapper
        nodes/
          ServiceNode.tsx           # custom node: AWS icon + label
      data/
        projects.ts                 # all 13 project definitions (typed)
      types/
        project.ts                  # shared TypeScript types
    package.json
    next.config.ts
    tailwind.config.ts
    tsconfig.json
  vercel.json                       # { "rootDirectory": "site" }
```

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · React Flow (`@xyflow/react`) · `react-icons` (AWS service icons)

---

## Data Model

All projects defined in `src/data/projects.ts` as a typed array.

```typescript
type DiagramNode = {
  id: string
  label: string            // e.g. "S3", "CloudFront"
  icon: React.ComponentType<{ className?: string }>  // imported directly: import { SiAmazons3 } from "react-icons/si"
  position: { x: number; y: number }
}

type DiagramEdge = {
  id: string
  source: string
  target: string
  label?: string           // e.g. "OAC-restricted"
}

type Project = {
  slug: string             // "01-static-site"
  number: number
  title: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tooling: "AWS CLI" | "AWS SAM" | "Terraform"
  description: string      // one-liner for card
  services: string[]       // chip list on card
  goal: string             // paragraph from README
  whatYouLearn: string[]   // bullets from README
  diagram: {
    nodes: DiagramNode[]
    edges: DiagramEdge[]
  }
}
```

Diagram node/edge data maps directly to the Architecture section of each project's README.

---

## Pages

### Home (`/`)

- Dark background, 3-column responsive card grid
- Each card displays:
  - Number badge (01–13) + project title
  - Difficulty badge: Beginner (green) / Intermediate (yellow) / Advanced (red)
  - Tooling badge: AWS CLI / AWS SAM / Terraform
  - Row of AWS service name chips
  - One-line description
- Clicking a card navigates to `/projects/[slug]`

### Project (`/projects/[slug]`)

Split layout:
- **Left panel (30%):** title, goal paragraph, AWS services list with icons, "What You Learn" bullets
- **Right panel (70%):** full-height React Flow canvas — pan/zoom enabled
  - Nodes: `ServiceNode` — styled card with AWS service icon + label
  - Edges: labeled arrows showing data flow direction
  - Node background color grouped by service category (compute, storage, networking, etc.)

---

## Components

### `ServiceNode`

Custom React Flow node. Renders a small card:
- Colored icon (from `react-icons/si`) on top
- Service name label below
- Border color keyed to service category

### `ProjectDiagram`

Wraps `<ReactFlow>` with:
- `nodes` and `edges` passed from the project data
- `nodeTypes={{ service: ServiceNode }}`
- Background grid pattern
- MiniMap + Controls (zoom in/out/fit)
- `fitView` on mount

### `ProjectCard`

Home page card. Receives a `Project` object, renders all visible fields. Wraps in a `<Link>` to the project page.

---

## Vercel Deployment

`vercel.json` at repo root:
```json
{
  "rootDirectory": "site"
}
```

Vercel treats `site/` as the Next.js project root. No other configuration needed. Deploy via `git push` to main.

---

## Constraints & Decisions

- **No CMS or markdown parsing at runtime.** All project content (goal, services, whatYouLearn, diagram) is hardcoded in `src/data/projects.ts`. The READMEs remain the source of truth for humans; the data file is the source of truth for the site.
- **No database, no API routes.** Fully static — all pages are statically generated at build time (`generateStaticParams` for project pages).
- **react-icons coverage.** Most AWS services have icons in the `si` (Simple Icons) set. Icons are imported directly in `projects.ts` (e.g. `import { SiAmazons3 } from "react-icons/si"`) and passed as React components — not resolved by string at runtime. For any gaps, fall back to a generic `SiAmazonaws` icon.
- **Node positions are manual.** Each project's diagram nodes have hardcoded `x/y` positions — no auto-layout. 13 projects is small enough that this is not worth automating.
