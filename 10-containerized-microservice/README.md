# 10 — Containerized Microservice (ECS Fargate + ECR + ALB)

## Goal
Ship a Dockerized Node.js / TypeScript service on **ECS Fargate** behind an **Application Load Balancer**, with the image pulled from **ECR**. No servers to manage, horizontal scaling via task count, zero-downtime deploys.

## Architecture
```
 Internet ──► ALB ──► Target Group ──► ECS Service (Fargate tasks, N replicas) ──► (Docker image in ECR)
```
- ECR private registry stores the container image.
- ECS Fargate service runs N tasks of the image, registers them with an ALB target group.
- ALB handles TLS and routes `/` to the service; health checks drive deploys.

## AWS Services
- **ECR** — container image registry.
- **ECS Fargate** — serverless container runtime.
- **ALB** — load balancer + TLS termination.
- **VPC / Subnets / Security Groups** — private subnets for tasks, public for the ALB.
- **IAM** — task execution role (pull image, write logs) and task role (app-level AWS calls).
- **CloudWatch Logs** — task stdout/stderr.

## Tooling
- **Terraform** — VPC, ECR, ECS cluster + service + task definition, ALB.
- **Docker** — image build.
- **Node.js / TypeScript** — minimal HTTP service (e.g. Fastify or bare Node).

## Setup Steps
1. Write the Node app and a `Dockerfile` (multi-stage: builder → distroless runtime).
2. `terraform apply` creates ECR repo, cluster, task def (placeholder image), service, ALB.
3. Build + push image: `docker build -t <repo> . && docker push <repo>`.
4. Update the task definition image tag (via Terraform var or `aws ecs update-service --force-new-deployment`).
5. Hit the ALB DNS name; verify rolling deploys keep traffic up.

## What You Learn
- ECS task definition vs. service vs. cluster — the mental model.
- Task execution role vs. task role — subtle and critical.
- ALB target groups and health checks driving deploy behavior.
- Fargate pricing model and how it differs from EC2-backed ECS.
