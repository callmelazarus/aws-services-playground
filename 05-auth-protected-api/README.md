# 05 — Auth-Protected API (Cognito + API Gateway + Lambda)

## Goal
Extend project 04 with real authentication. Add a **Cognito User Pool** and put a JWT authorizer in front of the API so only signed-in users can hit the endpoints. This is the standard way to add auth to a serverless API in AWS.

## Architecture
```
 Client ──sign in──► Cognito User Pool ──► JWT (id/access token)
    │
    └──request + Bearer token──► API Gateway (Cognito authorizer) ──► Lambda ──► DynamoDB
```
- Cognito User Pool handles signup, login, email/password verification, and token issuance.
- API Gateway validates the JWT on every request using the user pool as an authorizer.
- Lambda handlers receive the decoded claims in the request context — use them for per-user authorization and data scoping.

## AWS Services
- **Cognito User Pools** — identity provider.
- **API Gateway** — with a Cognito authorizer attached to protected routes.
- **Lambda** — handlers read `event.requestContext.authorizer.claims.sub` for the user id.
- **DynamoDB** — items are partitioned by user (e.g. `PK = USER#<sub>`).

## Tooling
- **AWS SAM** — `template.yaml` defines the user pool, app client, API with Cognito authorizer, and functions.
- **Node.js / TypeScript** for handlers.

## Setup Steps
1. Start from project 04's template.
2. Add `AWS::Cognito::UserPool` and `AWS::Cognito::UserPoolClient` resources.
3. Add a `Cognito` authorizer under the API's `Auth` section and set it as default.
4. Update handlers to scope DynamoDB reads/writes by `sub`.
5. `sam build && sam deploy --guided`.
6. Create a user via `aws cognito-idp admin-create-user` (or use the hosted UI).
7. Exchange credentials for a JWT (`aws cognito-idp initiate-auth`) and hit the API with `Authorization: Bearer <token>`.

## What You Learn
- Cognito User Pool vs. Identity Pool — when to use which.
- JWT authorizers vs. Lambda authorizers — cost, flexibility, cold starts.
- Scoping data access by token claims — per-user partition keys in DynamoDB.
