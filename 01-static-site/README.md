# 01 — Static Site (S3 + CloudFront)

## Goal
Host a static website (HTML/CSS/JS bundle) on S3 and serve it globally through a CloudFront distribution with HTTPS. First project in the series — focused on understanding S3 bucket semantics, CloudFront origins, and cache invalidation.

## Architecture
```
 User ──► CloudFront (edge cache, TLS) ──► S3 bucket (private, OAC-restricted)
```
- S3 bucket holds the built static assets. Bucket is **not** public — access is locked down to CloudFront via an Origin Access Control (OAC).
- CloudFront handles TLS termination, caching, and global edge delivery.
- Optional: custom domain via Route 53 + ACM certificate.

## AWS Services
- **S3** — static asset storage (origin).
- **CloudFront** — CDN, TLS, edge caching.
- **IAM** — OAC / bucket policy to restrict S3 to CloudFront.
- **(Optional)** ACM + Route 53 for a custom domain.

## Tooling
- **AWS CLI** for all provisioning.
- **Node.js / TypeScript** for a simple static site build (e.g. Vite or plain TS → HTML).
- No framework required; the emphasis is on infra, not the site.

## Setup Steps
1. Build the static site (`npm run build`) into `dist/`.
2. `aws s3 mb s3://<bucket-name>` — create bucket (private).
3. `aws s3 sync dist/ s3://<bucket-name>` — upload assets.
4. `aws cloudfront create-origin-access-control ...` — create OAC.
5. `aws cloudfront create-distribution ...` — create distribution pointing at the S3 origin, attach OAC.
6. Update the S3 bucket policy so only the CloudFront distribution can read objects.
7. `aws cloudfront create-invalidation --paths "/*"` after each deploy.

## What You Learn
- S3 bucket policies and OAC vs. legacy OAI.
- CloudFront distribution config: origins, behaviors, TTLs.
- Why invalidations matter and how caching surprises you.
