# @yeed/web

Yeed's frontend: React 19, TypeScript 6 and Vite 8. Tooling decisions are explained in [ADR-0005](../../docs/decisions/0005-frontend-toolchain.md).

## Setup

From the repository root, after following [docs/development.md](../../docs/development.md):

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local   # Git Bash: cp apps/web/.env.example apps/web/.env.local
pnpm install
pnpm dev:web
```

## Scripts

Run them from `apps/web`, or from the root with `pnpm --filter @yeed/web <script>`.

| Script            | What it does                                                   |
| ----------------- | -------------------------------------------------------------- |
| `pnpm dev`        | Development server at <http://localhost:5173> with hot reload. |
| `pnpm build`      | Type check, then production build in `dist/`.                  |
| `pnpm preview`    | Serves the production build locally.                           |
| `pnpm typecheck`  | Type check only.                                               |
| `pnpm lint`       | ESLint with type-aware, React Hooks and accessibility rules.   |
| `pnpm test`       | Runs the tests once.                                           |
| `pnpm test:watch` | Runs the tests again whenever a file changes.                  |

## Environment variables

Defined in `.env.local`, which is never committed. `.env.example` lists every variable.

| Variable            | Required | Description                                                    |
| ------------------- | -------- | -------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Yes      | Base URL of the Yeed API, for example `http://localhost:3000`. |

Every `VITE_` variable is embedded in the JavaScript sent to the browser, so none of them may contain secrets. `src/app/config.ts` validates them on startup: a missing or invalid value stops the app with a message that explains how to fix it.

## Structure

```text
src/
├── app/           Root component, configuration and global styles
├── features/      One folder per feature with its components, hooks, API calls and tests
│   └── health/    API connection check (GET /health)
├── layouts/       Page frames shared between screens
├── pages/         One component per screen
├── services/      HTTP client for the Yeed API
├── test/          Test setup
├── utils/         Small helpers shared by several features
├── env.d.ts       Types of the VITE_ variables
└── main.tsx       Entry point
```

Folders are created when the first file needs them: `components/` (UI used by two or more features), `hooks/` (hooks shared by several features), `types/` (types shared by several features) and `assets/`.

## Conventions

- **Where code goes.** Code used by one feature stays in `features/<feature>/`. It moves to a shared folder only when a second feature needs it.
- **Exports.** Named exports only. No barrel `index.ts` files.
- **Imports.** `@/...` across folders, `./...` within the same folder.
- **HTTP.** Components never call `fetch`. Each feature has an API module (`<feature>Api.ts`) that calls `apiRequest` with a type guard, so every response is checked at runtime before it is used.
- **Errors.** `ApiError.message` is written for users and can be shown. Any other error is a bug: show a generic message and log the details with `console.error`.
- **Types.** No `any`. Unknown data, such as parsed JSON, is narrowed with type guards.
- **Styles.** One `Component.module.css` next to each component. Colors, spacing and radii come from the tokens in `src/app/global.css`. Media queries go mobile first with `min-width`.
- **Accessibility.** Semantic HTML first. A state is never shown with color alone. Buttons and other touch targets are at least 44 px tall.
- **Tests.** Next to the code they test (`*.test.ts` or `*.test.tsx`). Query elements by role, label or text, the way a user finds them. Replace `fetch` with `vi.stubGlobal`; tests never use the network.
