# API Contract — Eagle's Eye

## STATUS: PROPOSED (pending backend confirmation)

This document is a frontend-proposed API contract. GitHub Copilot owns the backend; review and adjust endpoints/shapes as needed. The frontend will use clearly labelled temporary mock data until the real backend is available and this contract is confirmed.

## Base

All requests are made from the frontend service layer (`lib/api/`). No Supabase service-role secret is exposed in browser code. Requests use the Supabase publishable/anonym key plus a JWT session cookie/token where auth is required.

## Auth

### POST /auth/login
Request: `{ email: string, password: string }`
Response (200): `{ user: User, session: { access_token: string } }`
Response (401): `{ error: { message: string } }`

### POST /auth/register
Request: `{ email: string, password: string, full_name?: string, role?: 'learner'|'provider' }`
Response (200): `{ user: User }`
Response (400): `{ error: { message: string } }`

### POST /auth/logout
Request: none
Response (200): `{ ok: true }`

### GET /auth/me
Response (200): `{ user: User | null }`
Response (401): `{ error: { message: string } }`

## Programmes

### GET /programmes
Query: `?category=...&level=...&mode=...&min_cost=...&max_cost=...&search=...&provider_id=...&status=...&page=...&limit=...`
Response (200): `{ data: Programme[], meta: { page, limit, total } }`

### GET /programmes/:id
Response (200): `{ data: Programme }`
Response (404): `{ error: { message: string } }`

### POST /programmes  (provider only)
Request: ProgrammeCreateInput
Response (201): `{ data: Programme }`
Response (400): `{ error: { message: string } }`
Response (403): `{ error: { message: string } }`

### PATCH /programmes/:id  (provider owner or admin)
Request: Partial<ProgrammeUpdateInput>
Response (200): `{ data: Programme }`
Response (403): `{ error: { message: string } }`

### DELETE /programmes/:id  (provider owner or admin)
Response (200): `{ ok: true }`
Response (403): `{ error: { message: string } }`

### GET /programmes/:id/saved
Response (200): `{ data: SavedProgramme[] }`

### POST /programmes/:id/save  (learner only)
Response (200): `{ data: SavedProgramme }`

### DELETE /programmes/:id/save  (learner only)
Response (200): `{ ok: true }`

### GET /me/saved  (learner only)
Response (200): `{ data: Programme[] }`

## Providers

### GET /providers
Response (200): `{ data: Provider[] }`

### GET /providers/:id
Response (200): `{ data: Provider & { programmes: Programme[] } }`
Response (404): `{ error: { message: string } }`

## Admin

### GET /admin/programmes/pending
Response (200): `{ data: Programme[] }`

### POST /admin/programmes/:id/review
Request: `{ decision: 'approved'|'rejected', comments?: string }`
Response (200): `{ data: Programme }`
Response (403): `{ error: { message: string } }`

### GET /admin/stats
Response (200): `{ data: { total_programmes: number, pending_reviews: number, total_users: number, total_providers: number } }`

## Error shape (all endpoints)

`{ error: { message: string, status?: number, code?: string } }`

## Types (shared)

See `types/index.ts` for `User`, `Provider`, `Programme`, `SavedProgramme`, `Review`, `UserRole`.
