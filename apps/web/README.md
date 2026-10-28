# @yeed/web

Yeed's frontend: React 19, TypeScript 6 and Vite 8, linted with ESLint (type-aware rules), formatted with Prettier and tested with Vitest and Testing Library.

## Setup

From the repository root, after installing the tools listed in the [root README](../../README.md#requirements):

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
├── app/           Root component, configuration, global styles and the generated theme (styles/)
├── features/      One folder per feature with its components, hooks, API calls and tests
│   ├── auth/      Log-in and sign-up dialog with client-side validation (preview, no API yet)
│   ├── catalog/   Content types of the catalog (RF-05)
│   ├── health/    API connection indicator (GET /health)
│   └── landing/   Sections of the landing page (hero, how it works, call to action)
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
- **Styles.** One `Component.module.css` next to each component, using only the design tokens below. Combine CSS Module classes with `cx()` or `composes`, never with template literals. Media queries go mobile first with `min-width`.
- **Accessibility.** Semantic HTML first. A state is never shown with color alone. Buttons and other touch targets are at least 44 px tall.
- **Tests.** Next to the code they test (`*.test.ts` or `*.test.tsx`). Query elements by role, label or text, the way a user finds them. Replace `fetch` with `vi.stubGlobal`; tests never use the network. The test setup reports reduced motion, so animations render their final state.

## Design line

The interface is built on [`@yewdiel21/motion-kit`](https://motion-kit-playground.vercel.app) (GSAP recipes, controls and Material 3 tokens) with a playful, colorful look: soft colored surfaces, bold rounded type and simple geometric shapes.

| Layer   | Where                         | What                                                                                                          |
| ------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Kit CSS | `@yewdiel21/motion-kit/css`   | Tokens (`--mk-*`), controls (`.mk-button`, `.mk-status`, `.mk-chip`…) and recipe styles.                      |
| Theme   | `src/app/styles/yeed.css`     | The `yeed` theme (`<html data-mk-theme="yeed">`), generated from `#3D6BFF`. Light and dark follow the system. |
| Palette | `src/app/global.css`          | Accent colors `--yeed-{sky,sun,mint,coral,grape}` and their `-soft` versions, for categories and decorations. |
| Motion  | `@yewdiel21/motion-kit/react` | Hooks such as `useMaskText`, `useFlow` and `useLetters`. They clean up on unmount and respect reduced motion. |
| Type    | `index.html`                  | DM Sans from Google Fonts; headings use weights 800–900.                                                      |

Rules:

- Colors only through `--mk-*` (surfaces, text, accent) and `--yeed-*` (accents). No hex values in components.
- Keep `data-mk="<recipe>"` on elements animated by a hook, so they start hidden before the first paint.
- `index.html` inlines motion-kit's `MK_HEAD_SCRIPT`. Keep it in sync after upgrading the kit.
- To change the theme, regenerate it instead of editing `yeed.css` by hand:

```powershell
pnpm --filter @yeed/web exec motion-kit theme yeed --seed "#3D6BFF" --variant vibrant --out src/app/styles
```
