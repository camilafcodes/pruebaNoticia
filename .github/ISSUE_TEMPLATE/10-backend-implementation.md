---
name: Backend Implementation
about: Implement backend according to api-contract and architecture decisions
title: "Backend: Implement API for News Web MVP"
labels: ["agent:backend"]
---

## Source of truth
- Kickoff issue: #<KICKOFF_ISSUE_NUMBER>
- Contract: `/docs/api-contract.md`
- Architecture decisions: `/docs/architecture.md`
- Tasks: `/docs/tasks.md` (Backend section)

## Goal
Implement the backend according to the contract and architecture decisions. Deliver changes as a PR.

## Notes
- Hosting target: Vercel
- Do not invent endpoints or fields: follow `/docs/api-contract.md`
- Keep types in sync with `packages/shared`

## Acceptance criteria
- [ ] Backend endpoints from `/docs/api-contract.md` implemented
- [ ] Validations + error shape implemented as per contract
- [ ] `npm run dev` works
- [ ] `npm run build` works
- [ ] PR created with a short summary and testing notes
