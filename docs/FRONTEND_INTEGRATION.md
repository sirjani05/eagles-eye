# Frontend Integration — Eagle's Eye

## STATUS: PROPOSED (pending backend confirmation)

This document guides how the frontend integrates with the GitHub Copilot backend. Review and update as the real API contract is confirmed.

## Service layer

All backend requests live in `lib/api/`. Components never call `fetch` directly. Each API function returns `{ data, error }`.

Files:
- `lib/api/authApi.ts` — login, register, logout, getSession
- `lib/api/programmesApi.ts` — list, get, create, update, delete, save/unsave, list saved
- `lib/api/providersApi.ts` — list, get provider with programmes
- `lib/api/adminApi.ts` — pending programmes, review, stats

## Supabase clients

- `lib/supabase/client.ts` — browser client (uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` only).
- `lib/supabase/server.ts` — server client (middleware/SSR; service-role key must never reach the browser).

## Environment variables (browser-safe only)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never commit `.env.local`; never expose service-role keys in client code.

## Auth flow

1. Client reads Supabase session on app mount.
2. `login`/`register` set the session; protected routes redirect to `/login` when unauthenticated.
3. Navbar renders role-appropriate links based on `user.role`.

## Data flow

- Server Components fetch initial data where SEO-relevant (landing, programme list, programme details, provider profile).
- Client Components handle interactive state (search filters, saves, forms, auth).
- Every data-fetching component handles: loading, success, empty, error states.

## Mock data (temporary)

Until the backend is ready, `lib/api/` functions return labelled temporary mock data. Each mock function is clearly commented `// TEMPORARY MOCK — replace with real backend call`. Swap to real calls once endpoints are confirmed.

## Integration mismatch handling

If the real backend response shape differs from this doc, do not change backend code. Report the mismatch and update `types/index.ts` + service layer accordingly.
