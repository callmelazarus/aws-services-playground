# 11 — Realtime Notifications (API Gateway WebSockets + Lambda + DynamoDB)

## Goal
Build a realtime push system: clients open a WebSocket to API Gateway, the server can push messages to any connected client, and broadcasts fan out to every active connection. DynamoDB is the connection registry.

## Architecture
```
 Client ──(ws connect)──► API Gateway WebSocket ──► $connect Lambda ──► DynamoDB (connectionId)
 Client ──(ws message)──► API Gateway WebSocket ──► $default Lambda ──► (app logic)
 Server ──► PostToConnection API ──► API Gateway ──► Clients (all stored connectionIds)
 Client ──(ws disconnect)─► API Gateway WebSocket ──► $disconnect Lambda ──► DynamoDB (delete)
```
- `$connect`, `$disconnect`, `$default` routes each have a Lambda handler.
- DynamoDB stores `connectionId` → user/channel mapping.
- To broadcast, the backend lists connections from DynamoDB and calls `ApiGatewayManagementApi.PostToConnection` for each.

## AWS Services
- **API Gateway (WebSocket)** — persistent client connections.
- **Lambda** — route handlers + broadcast logic.
- **DynamoDB** — connection registry.
- **IAM** — Lambda role with DynamoDB r/w and `execute-api:ManageConnections`.

## Tooling
- **Terraform** — WebSocket API, routes, integrations, DynamoDB table, Lambdas.
- **Node.js / TypeScript** for all handlers.

## Setup Steps
1. Define DynamoDB table with `connectionId` as the partition key.
2. Define three Lambdas for `$connect`, `$disconnect`, `$default`.
3. Define the WebSocket API and wire each route to its Lambda via `aws_apigatewayv2_*` resources.
4. Deploy a stage; note the `wss://...` URL.
5. `terraform apply`.
6. Test with `wscat -c wss://...` — open two clients, send from one, receive on the other via a small broadcast Lambda or script.

## What You Learn
- WebSocket API lifecycle on API Gateway and why it's fully managed.
- Stateless Lambda + external connection registry — the standard serverless WS pattern.
- `PostToConnection` and handling `GoneException` (stale connections).
- Costs scale with connection-minutes + messages — be deliberate.
