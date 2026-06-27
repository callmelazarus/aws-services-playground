# Design: AWS Glossary + Navigation Shell

**Date:** 2026-06-27
**Status:** Approved (pending spec review)
**Site:** `site/` — Next.js 15 App Router, statically generated, Tailwind, dark slate theme

## Goal

Add a reusable global navigation shell to the portfolio site and a new **Glossary** page: a study-oriented reference of the AWS services relevant to the 13 projects, grouped into AWS-style categories, each entry showing the official service icon, a short description, official documentation link, and cross-links to the projects that use it.

This is the first of potentially several "additional pages." The navigation is built once as a reusable shell; only the glossary content is designed in detail here.

## Scope

**In scope (v1):**
- Responsive global header (top bar, hamburger on mobile).
- `/glossary` page: ~40 services across ~10 AWS-style categories, sticky category rail, live search, official icons (with fallback), per-service docs links, and "Used in" project cross-links.
- Typed glossary data + tests.

**Out of scope (future):**
- About page (header is built to accept it later).
- Reverse cross-link: a "Services" link on project pages back into the glossary.
- Swapping official AWS icons into the project *diagrams* (would fix the generic-logo gap noted in the prior audit) — deliberately deferred.

## Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Effort scope | Glossary **+ reusable nav shell** |
| Service coverage | Project services **+ common adjacent** Developer-Associate services (~40 total) |
| Section grouping | **AWS-style categories** (~10) |
| Icon source | **Official AWS Architecture Icons**, bundled as SVGs |
| Nav form | **Top header**, responsive (hamburger on mobile) |
| Header on diagram page | **No** — the `projects/[slug]` diagram view stays immersive/header-free |
| Glossary layout | **Single scrollable page** + sticky category rail + search (Layout A) |
| Entry design | **Detailed card** (Card B): 2-sentence description, named "Used in" chips, full-width docs link |

## Architecture

### 1. Navigation shell — `components/Header.tsx`
- Rendered on header-bearing pages only (home + glossary), NOT in the root `app/layout.tsx` (see diagram-page exception below).
- **Desktop:** brand (links to `/`) on the left; nav links on the right — **Projects** (`/`) and **Glossary** (`/glossary`).
- **Mobile (`< sm`):** links collapse into a hamburger button toggling a dropdown panel.
- Client component (`'use client'`) — needs `useState` for the mobile toggle and `usePathname()` for active-link highlighting (sky-400). The rest of each page stays server-rendered.
- **Diagram page exception:** `app/projects/[slug]/page.tsx` does NOT render the header (it keeps its `h-screen` immersive layout and existing "← All projects" link). Implementation: place the `<Header />` in the home and glossary pages (or a shared non-diagram layout segment), not in the root `<body>` wrapper that the diagram page uses. Chosen approach: render `<Header />` inside `app/page.tsx` and `app/glossary/page.tsx` rather than `app/layout.tsx`, keeping the root layout neutral. (If more header-bearing pages appear later, promote to a route group layout, e.g. `app/(site)/layout.tsx`, with the diagram page outside the group.)

### 2. Glossary page — `app/glossary/page.tsx` (Layout A)
- Statically generated.
- **Sticky left category rail:** lists the ~10 categories; clicking scroll-jumps to that section. Sections have `id` anchors for deep-linking (`/glossary#database`).
- **Search box (top):** client-side live filter across service `name` + `description`. The page renders a client child component (e.g. `GlossaryBrowser`) that holds the search state and filters the (server-provided) service list; empty categories hide while filtering.
- **Sections** stacked top-to-bottom; each section is a responsive card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
- **Mobile:** the category rail collapses to a horizontal scrollable pill row above the grid.

### 3. Service entry — `components/ServiceCard.tsx` (Card B)
Renders one `AwsService`:
- Official icon (SVG from `iconFile`) — fixed box, top-left.
- Service `name` (e.g. "AWS Lambda") + `blurb` line (e.g. "Compute · Serverless").
- `description` — 2 sentences.
- **"Used in"** row: named project chips (`04 REST API`) linking to `/projects/<slug>`, derived from `projectSlugs`.
- If `projectSlugs` is empty → show a **"Not yet covered"** tag instead of the chips row.
- Full-width **"Official documentation ↗"** link (`docsUrl`, opens in new tab, `rel="noopener noreferrer"`).
- Icon fallback: if the SVG file is absent, render a colored category monogram (first letters) so the card is never broken.

### 4. Data model — `types/service.ts`, `data/services.ts`
```ts
export type GlossaryCategory =
  | 'Compute' | 'Containers' | 'Storage' | 'Database'
  | 'Networking & CDN' | 'Security & Identity' | 'App Integration'
  | 'Analytics & Streaming' | 'Management & Observability'
  | 'Developer Tools & IaC'

export type AwsService = {
  id: string             // stable slug, e.g. 'lambda'
  name: string           // 'AWS Lambda'
  category: GlossaryCategory
  blurb: string          // 'Compute · Serverless'
  description: string    // ~2 sentences
  iconFile: string       // '/icons/aws/lambda.svg'
  docsUrl: string        // verified official docs URL (https)
  projectSlugs: string[] // slugs from projects.ts; [] => not yet covered
}
```
- A separate ordered array of categories drives rail + section order.
- `projectSlugs` is authored explicitly (source of truth for cross-links) — NOT matched on display names, which are inconsistent (e.g. "API Gateway" vs "API Gateway WebSockets").

### 5. Icons — official AWS Architecture Icons
- Bundle the ~40 needed SVGs into `site/public/icons/aws/`, named by `id` (`lambda.svg`, `s3.svg`, …).
- **Implementation risk (primary):** SVGs come from AWS's Architecture Icons asset pack (a large zip); selecting/extracting the exact ~40 is a manual or scripted step. The plan treats this as its own task with the **monogram fallback** (see §3) so the feature ships even if some icons are pending.

### 6. Content sourcing
- All ~40 `description` values drafted as part of implementation (concise, study-oriented).
- Every `docsUrl` **web-verified against official AWS documentation** before inclusion — no fabricated links (same discipline used for the project `reference` links).

## Data flow
`data/services.ts` (static) → `glossary/page.tsx` (server) → `GlossaryBrowser` (client: search/filter) → `ServiceCard` (presentational). Project chips read `projectSlugs` and link to existing `/projects/<slug>` routes. No runtime data fetching; everything is statically generated at build.

## Testing
Extend `site/src/__tests__` (vitest):
- Each service has a non-empty `id`, and ids are unique.
- Every `category` is one of the defined `GlossaryCategory` values.
- Every `projectSlugs` entry matches a real slug in `projects.ts`.
- Every `docsUrl` matches `^https://`.
- Every `iconFile` is set (path string present).
- Coverage assertion: every distinct service referenced in `projects.ts` `services[]` has a corresponding glossary entry (so the glossary never lags the projects).
- `npm run build` continues to pre-render all routes, now including `/glossary`.

## Error handling / edge cases
- Missing icon SVG → monogram fallback (never a broken image).
- Search with no matches → "No services match" empty state.
- A service used by zero projects → "Not yet covered" tag (expected for the adjacent set).

## Components / files summary
| File | Purpose |
|---|---|
| `components/Header.tsx` | Responsive global nav (new) |
| `components/ServiceCard.tsx` | One glossary entry (new) |
| `components/GlossaryBrowser.tsx` | Client search/filter + section rendering (new) |
| `app/glossary/page.tsx` | Glossary route (new) |
| `app/page.tsx` | Add `<Header />` |
| `types/service.ts` | `AwsService`, `GlossaryCategory` (new) |
| `data/services.ts` | ~40 service entries (new) |
| `public/icons/aws/*.svg` | Bundled official icons (new) |
| `src/__tests__/services.test.ts` | Data-integrity tests (new) |
