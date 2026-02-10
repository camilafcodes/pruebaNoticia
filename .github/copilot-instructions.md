# GitHub Copilot Instructions (Repo-wide)

## 0) Context
This repository will implement a news website with:
- Frontend: Next.js (TypeScript)
- Backend: Node.js API (TypeScript)
- Goal: deliver ready-to-run code for FE + BE, with clear scripts, consistent conventions, and minimal assumptions.

If product documentation is provided, Tech Lead must convert it into:
- /docs/architecture.md
- /docs/api-contract.md
- /docs/tasks.md
Frontend and Backend must implement strictly according to /docs/api-contract.md.

---

## 1) Repo structure (preferred)
Use a monorepo layout:

- /apps/web         -> Next.js app (frontend)
- /apps/api         -> Node.js API (backend)
- /packages/shared  -> shared types (DTOs/interfaces) used by FE and BE
- /docs             -> architecture, api contract, tasks, decisions

If something already exists, adapt without breaking, but keep FE/BE clearly separated.

---

## 2) Language, naming, and style
- Use TypeScript everywhere (FE and BE).
- All code identifiers (variables, methods, classes, files) must be in English.
- Keep code simple and readable. Avoid over-engineering.
- Prefer functional, small modules; avoid huge files.
- Add/update documentation when behavior changes.

Formatting/linting:
- Use ESLint + Prettier (or Next defaults for FE).
- No unused variables, no implicit any, strict typing.

---

## 3) Tooling & scripts (must exist)
At the repo root:
- Provide commands to run FE and BE locally.
- Provide build commands.
- Provide lint commands.

Preferred: npm workspaces.
- Root `package.json` should define `workspaces: ["apps/*", "packages/*"]`.

Expected scripts (root):
- `npm run dev` (runs both apps or explains how)
- `npm run build`
- `npm run lint`
- `npm run test` (at least minimal)

Each app should have:
- `dev`, `build`, `start`, `lint` scripts.

---

## 4) Backend requirements (apps/api)
- Provide a simple HTTP API in Node.js TypeScript.
- Use a lightweight framework (Express or Fastify). Choose ONE and keep it consistent.
- Provide `/health` endpoint.
- Implement endpoints strictly from `/docs/api-contract.md`.

### API conventions
- All responses JSON.
- Define a consistent error shape:
  - `{ "error": { "code": string, "message": string, "details"?: any } }`
- Validation:
  - Validate inputs for every endpoint (query params, path params, body).
- Logging:
  - Log errors with enough context (route, requestId if available), but do not log secrets.

### Data & ingestion
- Do NOT scrape websites by default.
- Prefer RSS/Atom or official APIs when available.
- If the product requires ingestion, implement it as a pluggable “source” module:
  - `sources/<sourceName>.ts`
- Add caching (in-memory) to avoid refetching on every request.
- If persistence is required but not specified, default to a simple file-based JSON store under `apps/api/data/` and document it.

Env:
- Provide `.env.example` with placeholders.
- Do not commit real secrets.

---

## 5) Frontend requirements (apps/web)
- Next.js with TypeScript.
- App Router preferred.
- Pages must cover MVP flows defined in documentation (list + detail at minimum for news).
- Must implement loading, empty, and error states.
- Basic SEO:
  - set metadata (title, description) per page (at least for list/detail).
- Data fetching must follow the contract from `/docs/api-contract.md`.

UI:
- Keep UI simple and readable.
- Avoid heavy component libraries unless explicitly required.
- If using Tailwind, configure it properly; otherwise stick to simple CSS modules.

---

## 6) Shared types (packages/shared)
- Shared DTOs/interfaces used by FE and BE.
- Do not duplicate types in FE and BE.
- Keep them stable; if contract changes, update shared types and `/docs/api-contract.md`.

---

## 7) Documentation rules
Must exist in `/docs`:
- `architecture.md`: key decisions (stack, structure, ingestion approach, caching).
- `api-contract.md`: endpoints, request/response examples, error codes.
- `tasks.md`: task breakdown for FE/BE.

README:
- Root README must explain how to run FE and BE locally.

---

## 8) Quality gates (Definition of Done)
A feature/PR is done only if:
- `npm run lint` passes (root or per-app)
- `npm run build` passes (root or per-app)
- API contract is respected
- README/docs updated if behavior changed
- No secrets committed

---

## 9) Collaboration protocol (for agents)
- Tech Lead owns architecture + API contract in /docs.
- Frontend and Backend do not invent endpoints or payloads.
- If a requirement is missing/ambiguous, create a “Decision needed” note in `/docs/architecture.md` and proceed with the safest default.
