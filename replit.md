# CareerAI

CareerAI helps students turn their experience into a stronger resume and practice interview answers with VibeCat, an adaptive AI interview coach.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/careerai run dev` — run the CareerAI web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/careerai/src/App.tsx` — CareerAI routes and UI, including the ProSim interview room
- `artifacts/careerai/src/index.css` — shared visual tokens and ProSim character/room animations
- `artifacts/api-server/src/routes/interview.ts` — adaptive interview-turn endpoint
- `artifacts/api-server/src/services/gemini.js` — Gemini prompts and retry handling
- `lib/api-spec/openapi.yaml` — source of truth for API contracts; run codegen after changes

## Architecture decisions

- ProSim sends one answer at a time to Gemini; questions are generated after analysis instead of precomputed.
- The candidate resume fields and optional job description are sent as context for every adaptive turn.
- The original VibeCat character is an inline SVG with CSS motion so the room has no external avatar dependency.

## Product

- Build an ATS-friendly resume from guided profile information.
- Download generated resumes as PDFs.
- Practice a five-question adaptive interview with VibeCat, live performance scores, answer feedback, and a personalized learning plan.

## User preferences

- Interview feedback should understand casual Gen-Z language and Hinglish without shaming the candidate.

## Gotchas

- ProSim requires `GEMINI_API_KEY` on the API server for live analysis; the UI reports a clear setup message when it is unavailable.
- Re-run `pnpm --filter @workspace/api-spec run codegen` after editing `lib/api-spec/openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
