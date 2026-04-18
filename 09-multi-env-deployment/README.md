# 09 — Multi-Env Deployment (VPC + EC2 + RDS + Route 53 + Terraform Workspaces)

## Goal
Deploy a Node.js app with a Postgres backend across **separate dev and prod environments**, cleanly isolated, with DNS routing (`dev.example.com`, `api.example.com`). First Terraform project in the series — introduces **workspaces** as the mechanism for environment parity.

## Architecture
```
                 ┌──────── Terraform workspace: dev ────────┐
 dev.example.com ──► Route 53 ──► EC2 (Node API) ──► RDS   │
                 └───────────────────────────────────────────┘
                 ┌──────── Terraform workspace: prod ───────┐
 api.example.com ──► Route 53 ──► EC2 (Node API) ──► RDS   │
                 └───────────────────────────────────────────┘
```
- One Terraform codebase, two workspaces (`dev` and `prod`) producing isolated stacks.
- Each environment gets its own VPC, EC2, RDS, and Route 53 A-record under a shared hosted zone.
- Variables (instance size, RDS size, DNS name) are selected by workspace.

## AWS Services
- **VPC / Subnets / Security Groups** — per-env network isolation.
- **EC2** — Node.js / TypeScript API server.
- **RDS (Postgres)** — per-env database.
- **Route 53** — DNS routing to each environment.
- **IAM** — EC2 instance profile.

## Tooling
- **Terraform** (`>= 1.6`) with remote state in an S3 backend + DynamoDB lock table.
- **Terraform workspaces** to toggle `dev` vs. `prod`.
- **Node.js / TypeScript** API deployed via user-data or a CodeDeploy-style pull on boot.

## Setup Steps
1. Bootstrap the state backend: S3 bucket + DynamoDB lock table (one-time, separate tiny TF config).
2. `terraform init -backend-config=...`.
3. `terraform workspace new dev && terraform workspace new prod`.
4. `terraform workspace select dev && terraform apply -var-file=dev.tfvars`.
5. Repeat for `prod`.
6. Verify `dev.example.com` and `api.example.com` resolve to the correct instances and serve traffic.

## What You Learn
- Terraform module structure and when to break things apart.
- Remote state + state locking — the non-negotiable prerequisite for team IaC.
- Workspaces vs. directory-per-env — real tradeoffs, covered in the README.
- Route 53 hosted zones, record types, and TTL tuning.
