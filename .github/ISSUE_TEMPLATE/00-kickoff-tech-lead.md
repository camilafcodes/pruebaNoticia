---
name: Kickoff (Tech Lead)
about: Bootstrap + Architecture + API contract + Tasks
title: "Kickoff: News Web MVP"
labels: ["agent:kickoff"]
---

## Goal
Build the MVP for a news website (frontend + backend) based on the documentation below.

## Important
- If the monorepo scaffold is missing, bootstrap it first (per `.github/copilot-instructions.md`).
- Then produce `/docs/architecture.md`, `/docs/api-contract.md`, `/docs/tasks.md`.
- Deliver changes as a PR.

## Constraints / Hosting
- Hosting target (e.g., HostGator / Vercel / etc.):
- Backend deploy (where/how):
- Database (if any):
- Auth (if any):
- News sources (RSS/APIs) + update frequency:
- SEO requirements:
- Analytics (if any):

## Requisitos de ejecución local (obligatorio)
- Debe funcionar en local con:
  - `npm install`
  - `npm run dev` (levanta web + api)
  - `npm run build` (sin errores)
- El frontend debe consumir el backend usando `NEXT_PUBLIC_API_URL` (ej: http://localhost:3001).
- No usar código que dependa solo de Vercel/prod para funcionar.

## Reglas Next.js
- Si una página usa estado/efectos/inputs (search, filtros interactivos), debe ser Client Component (`"use client"`).
- El render inicial debe ser compatible con SSR (no crashear en build).


## Product documentation
(Paste here)
