# yeed-api

Yeed's REST API uses Express 5 and TypeScript. Workspace development and AWS Lambda use Node.js 24; the Docker image uses `node:22-alpine`. The API supports Node.js 22.18 or later. The same application runs as a local HTTP server, in Docker, or on AWS Lambda behind API Gateway through [serverless-http](https://github.com/dougmoscrop/serverless-http).

## Setup and local development

From the repository root:

```powershell
pnpm install
# Optional: copy this file to customize the defaults.
Copy-Item services/api/.env.example services/api/.env
pnpm dev:api
```

Open <http://localhost:3000/health>. Development uses Node's native TypeScript support and watch mode. Docker, Python and AWS credentials are not required. The frontend's `VITE_API_BASE_URL` remains `http://localhost:3000`.

| Variable          | Default                 | Purpose                                                 |
| ----------------- | ----------------------- | ------------------------------------------------------- |
| `PORT`            | `3000`                  | HTTP port (1–65535); local server and Docker only.      |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated HTTP(S) origins; no paths or wildcards. |

The development and start scripts load `services/api/.env` when present. In Docker and Lambda, supply environment variables through the runtime; `.env` files are excluded from the image and Lambda bundle.

## Commands

From the repository root:

| Command                         | Purpose                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| `pnpm dev:api`                  | Start Express with automatic restarts.                       |
| `pnpm --filter @yeed/api build` | Compile the server and bundle the Lambda entry point.        |
| `pnpm start:api`                | Run the compiled HTTP server after building.                 |
| `pnpm check:api`                | Run ESLint, strict TypeScript checks and Node's test runner. |
| `pnpm --filter @yeed/api test`  | Run HTTP, configuration and Lambda adapter tests.            |
| `pnpm dev:api:sam`              | Build and run through SAM (requires Docker and SAM CLI).     |

`pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check` include this workspace alongside the frontend. Tests run on ephemeral local ports and never call AWS.

Add dependencies with `pnpm --filter @yeed/api add <package>` (or `add -D` for tools), and commit `pnpm-lock.yaml` together with `package.json`.

## Docker

Run these commands from the **repository root**, which is the build context:

```powershell
docker build -f services/api/Dockerfile --build-arg APP_VERSION=1.0.0 -t yeed-api .
docker run --rm -p 3000:3000 -e ALLOWED_ORIGINS=http://localhost:5173 yeed-api
```

The image uses `node:22-alpine` with `dependencies`, `build` and `production` stages. `npm ci` installs the exact versions in `services/api/package-lock.json`; the final stage uses `npm ci --omit=dev`, compiled JavaScript and the unprivileged `node` user. OCI labels record the title, description and `APP_VERSION`. The root `.dockerignore` excludes local dependencies, compiled output, tests, environment files and credentials. Provide credentials at runtime; never add them to the Dockerfile or image.

pnpm continues to manage local workspace development. After changing API dependencies, also regenerate the Docker lockfile with `npm install --package-lock-only --ignore-scripts --prefix services/api` and commit both lockfiles with the package manifest.

## AWS Lambda / SAM

The existing SAM template keeps API Gateway, its CORS settings, throttling and log retention. It uses `nodejs24.x` and the handler `index.handler` instead of the Python runtime.

Build the bundled handler before running SAM:

```powershell
pnpm --filter @yeed/api build
cd infrastructure
sam build
sam local start-api --port 3000
# Or invoke with the existing API Gateway v2 event:
sam local invoke HealthFunction --event ../services/api/events/get-health.json
```

`CodeUri` points to `services/api/dist/lambda/`, which contains the self-contained `index.cjs` bundle. No global esbuild installation or npm install is needed by SAM. Rebuild after code changes. `AllowedOrigins` configures both API Gateway and the application's `ALLOWED_ORIGINS` variable. No cloud resources are deployed by the local commands.

## Structure and conventions

```text
services/api/
├── src/
│   ├── app.ts              Application assembly (no listening socket)
│   ├── config.ts           Environment validation
│   ├── server.ts           Local / container HTTP entry point
│   ├── lambda.ts           AWS Lambda entry point
│   ├── routes/health.ts    GET /health
│   └── shared/             HTTP middleware and ApiError
├── tests/                  Node test runner; real HTTP requests without AWS
├── events/                 Sample API Gateway events
├── Dockerfile
└── package.json
```

- **Thin routes.** Read the request, call the use case and return JSON. Add business logic and repositories when a feature needs them.
- **Errors.** Throw `ApiError(status, code, message)` for expected failures. Messages are public. Unexpected sync and async errors return a generic `500` and log details only on the server. Invalid JSON returns `400`; bodies over 100 KiB return `413`.
- **Logs.** JSON logs include a generated request ID, also returned in `X-Request-Id`. Never log tokens, passwords, entire events or personal data.
- **Types.** Strict TypeScript; `.ts` imports run natively in development and are rewritten to `.js` during compilation.
- **CORS.** Only configured origins can read browser responses. Methods currently allow `GET`; update both Express and the SAM template when adding methods.

## API

Responses use JSON with `snake_case` fields. The existing public contract is preserved:

| Method | Path      | Authentication | Success response                              |
| ------ | --------- | -------------- | --------------------------------------------- |
| `GET`  | `/health` | None           | `200 {"status": "ok", "service": "yeed-api"}` |

Health reports reachability without querying a database or external service. Unknown routes return `404`:

```json
{
  "error": {
    "code": "not_found",
    "message": "The requested route does not exist."
  }
}
```

All errors follow the same envelope. This migration does not add authentication, database access or business endpoints.
