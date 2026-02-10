---
name: "Kickoff: Tech Lead"
about: "Tech Lead lee product_docs/ y genera /docs (arquitectura, contrato API y tareas)."
title: "Kickoff: <Project name>"
labels: ["kickoff", "tech-lead"]
---

## Fuente de verdad
Tech Lead: usa `product_docs/` como fuente primaria. NO asumas requisitos no escritos.

- Carpeta de documentación: `product_docs/`
- Si hay varios archivos, identifica automáticamente:
  - la especificación principal (el documento más completo)
  - backlog/historias (si existe)
  - modelo de datos (.sql) (si existe)
  - ejemplos (si existen)

## Cambios / Overrides (solo si difiere de product_docs)
- Hosting target: (Vercel / otro)
- UI styling: (Tailwind / CSS Modules / otro)
- Idioma del sitio:
- Dominio (si aplica):
- Frecuencia de actualización (si aplica):
- DB provider (si aplica):

## Decisiones que debes dejar por escrito en /docs/architecture.md
- Arquitectura BE (Next Route Handlers vs Express/Fastify separado vs servicio externo)
- Estrategia de actualización (cron vs cache revalidate vs scheduler externo)
- Persistencia (DB/KV/none) y por qué
- Estrategia de deduplicación
- Caching (TTL) y rate limits (si aplica)

## Requisitos de ejecución local (obligatorio)
- Debe funcionar con:
  - `npm install`
  - `npm run dev`
  - `npm run build`
- Documentar variables de entorno en `.env.example` (sin secretos).

## UI / Diseño (si no está 100% claro)
- Si faltan detalles de diseño, propón 2 opciones (A/B) y elige una para el MVP.
- No entregar UI “plana”: cards, spacing, estados loading/empty/error, responsive.

## Entregables del Tech Lead
- `/docs/architecture.md`
- `/docs/api-contract.md`
- `/docs/tasks.md`
- (si falta scaffold) bootstrap del monorepo según `.github/copilot-instructions.md`
- Abrir PR con todo lo anterior.
