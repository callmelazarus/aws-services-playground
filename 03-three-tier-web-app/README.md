# 03 — Three-Tier Web App (EC2 + ElastiCache + RDS)

## Goal
Build a realistic 3-tier web application: an EC2-hosted Node.js server that caches reads in ElastiCache (Redis) and persists data in RDS (Postgres). This is the classic production architecture — web tier, cache tier, database tier — wired up by hand so you feel every piece.

## Architecture
```
                ┌─────────────────── VPC ───────────────────┐
                │                                            │
 Internet ──► EC2 (Node/TS API) ──► ElastiCache (Redis)      │
                │         │                                  │
                │         └──► RDS (Postgres, private subnet)│
                └────────────────────────────────────────────┘
```
- **Web tier**: EC2 instance in a public subnet running a Node.js / TypeScript API.
- **Cache tier**: ElastiCache Redis cluster in a private subnet, read-through cache for hot queries.
- **Data tier**: RDS Postgres in a private subnet, only reachable from the EC2 security group.
- Security groups enforce least-privilege network access between tiers.

## AWS Services
- **EC2** — compute for the API server.
- **ElastiCache (Redis)** — in-memory cache.
- **RDS (Postgres)** — relational database.
- **VPC + Subnets + Security Groups** — network isolation between tiers.
- **IAM** — instance profile for the EC2 server (logs, optionally Secrets Manager).

## Tooling
- **AWS CLI** for all provisioning.
- **Node.js / TypeScript** for the API (`ioredis`, `pg`).

## Setup Steps
1. `aws ec2 create-vpc` + subnets (1 public, 2 private across AZs).
2. Create security groups: `web-sg` (port 80/443 from internet), `cache-sg` (Redis port from web-sg only), `db-sg` (Postgres port from web-sg only).
3. `aws rds create-db-instance ...` — Postgres in private subnets, `db-sg`.
4. `aws elasticache create-cache-cluster ...` — single-node Redis, `cache-sg`.
5. `aws ec2 run-instances ...` — Node runtime AMI (or Amazon Linux + install Node), `web-sg`, public subnet.
6. SSH in, clone the server, set env vars for RDS + Redis endpoints, run the API.
7. Verify: a GET request first misses the cache (logs Postgres hit), second hits Redis.

## What You Learn
- VPC design and subnet/SG relationships — the non-negotiable foundation of AWS.
- Cache-aside pattern with Redis.
- Managed database lifecycle (backups, parameter groups, endpoints).
- Why IaC exists — you'll feel the pain of wiring this by hand, which makes projects 09+ click.
