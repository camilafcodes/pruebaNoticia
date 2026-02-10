---
name: Frontend Implementation
about: Implement frontend pages and data fetching according to api-contract and tasks
title: "Frontend: Implement UI for News Web MVP"
labels: ["agent:frontend"]
---

## Source of truth
- Kickoff issue: #<KICKOFF_ISSUE_NUMBER>
- Contract: `/docs/api-contract.md`
- Tasks: `/docs/tasks.md` (Frontend section)

## Goal
Implement the frontend pages and data fetching according to the contract. Deliver changes as a PR.

## Notes
- Hosting target: Vercel
- Use `NEXT_PUBLIC_API_URL` for backend base URL
- Do not invent endpoints or fields: follow `/docs/api-contract.md`

## Acceptance criteria
- [ ] Pages from `/docs/tasks.md` implemented (list + detail at minimum)
- [ ] FE calls backend endpoints from `/docs/api-contract.md`
- [ ] `npm run dev` works
- [ ] `npm run build` works
- [ ] PR created with a short summary and screenshots (optional)
