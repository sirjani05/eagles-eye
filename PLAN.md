# Eagle's Eye — Frontend Implementation Plan

## 1. Project assessment (current state)

- **Framework:** Next.js 16.4.5 (App Router), React 19.3.0
- **Styling:** Tailwind CSS v4, Geist font, CSS variables (`--background`, `--foreground`)
- **Auth/Backend:** Supabase client (`@supabase/supabase-js`, `@supabase/ssr`) configured via `app/.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (publishable/anonym key only — safe for browser; no service-role secret)
- **Existing files:** `app/layout.tsx`, `app/page.tsx` (default Next scaffold), `app/globals.css`
- **Missing:** `docs/API_CONTRACT.md`, `docs/DATABASE_SCHEMA.md`, `docs/FRONTEND_INTEGRATION.md` do not exist yet.
- **Git:** clean, single `initialise eagles-eye` commit on `master`.

## 2. Blocker: missing API contract docs

The integration process requires reading `docs/API_CONTRACT.md`, `docs/DATABASE_SCHEMA.md`, and `docs/FRONTEND_INTEGRATION.md` before connecting to the backend. These files are absent, so no confirmed request/response structures are available.

**Plan:** create proposed docs (clearly marked "PROPOSED — pending backend confirmation") so frontend work can begin immediately with labelled temporary mock data (per rule 10). The backend team (GitHub Copilot) should review/adjust the contract; any mismatch will be communicated rather than the backend contract being unilaterally changed.

## 3. Tech stack & conventions

- Next.js App Router (`app/`), Server Components by default, Client Components (`'use client'`) only where interactivity/auth state is needed.
- Tailwind v4 via CSS `@import "tailwindcss"` and `@theme inline` in `globals.css`. Reuse existing Geist font + CSS variables; do not introduce a competing design system.
- Shared TypeScript types under `types/` (programmes, providers, users, auth, API responses).
- Dedicated API/service layer under `lib/api/` — all backend requests live there; no `fetch` calls scattered in components.
- Supabase browser client uses only the publishable/anonym key (never the service-role secret).
- Role-based UI: `learner`, `provider`, `administrator`.
- Loading/success/empty/error states on every data-fetching page.
- Client-side form validation (Zod-like manual validation) with accessible form controls.

## 4. Proposed directory structure

```
app/
  layout.tsx              # root layout, providers, fonts, metadata
  globals.css             # Tailwind + design tokens (existing)
  page.tsx                # landing page (public)
  login/                  # learner login (page.tsx)
  register/               # learner registration (page.tsx)
  dashboard/              # learner dashboard (page.tsx)
  saved/                  # saved programmes (page.tsx)
  programmes/
    page.tsx              # discovery + search/filter list (public)
    [slug]/               # programme details (page.tsx)
  providers/
    [id]/                 # provider profile (page.tsx)
  provider/
    dashboard/            # provider dashboard (page.tsx)
    programmes/
      new/                # create programme form (page.tsx)
      [id]/edit/          # edit programme form (page.tsx)
  admin/
    dashboard/            # administrator dashboard (page.tsx)
    programmes/
      review/             # programme review & moderation (page.tsx)
      [id]/               # review detail + approve/reject (page.tsx)
components/
  ui/                     # reusable primitives (Button, Input, Card, Badge, etc.)
  layout/                 # Navbar, Footer, Sidebar, AuthProvider wrapper
  programmes/             # ProgrammeCard, ProgrammeList, SearchFilters
  auth/                   # LoginForm, RegisterForm, ProtectedRoute
lib/
  api/                    # service layer (programmesApi, providersApi, authApi, adminApi)
  supabase/               # browser + server Supabase client helpers
  validations/            # form schemas
types/
  index.ts                # shared TS types
docs/                     # API_CONTRACT.md, DATABASE_SCHEMA.md, FRONTEND_INTEGRATION.md
```

## 5. Shared TypeScript types (proposed)

```ts
// types/index.ts
export type UserRole = 'learner' | 'provider' | 'administrator';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  contact_email?: string;
  created_at: string;
}

export interface Programme {
  id: string;
  provider_id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  cost?: number;
  currency?: string;
  location?: string;
  mode?: 'online' | 'in-person' | 'hybrid';
  status: 'draft' | 'pending_review' | 'published' | 'rejected';
  created_at: string;
  updated_at: string;
  provider?: Provider;
}

export interface SavedProgramme {
  id: string;
  user_id: string;
  programme_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  programme_id: string;
  reviewer_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  created_at: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
```

## 6. API service layer (proposed — pending contract confirmation)

`lib/api/` modules:
- `authApi.ts`: `login(email, password)`, `register(...)`, `getSession()`, `signOut()`
- `programmesApi.ts`: `listProgrammes(filters)`, `getProgramme(id)`, `createProgramme(data)`, `updateProgramme(id, data)`, `deleteProgramme(id)`, `saveProgramme(id)`, `unsaveProgramme(id)`, `listSavedProgrammes()`
- `providersApi.ts`: `getProvider(id)`, `listProviders()`
- `adminApi.ts`: `listPendingProgrammes()`, `reviewProgramme(id, decision, comments)`, `listUsers()`, `getStats()`

Each returns `{ data, error }` and throws on network failure; components handle loading/error/empty.

## 7. Pages & modules to build

| Module | Pages | Notes |
|--------|-------|-------|
| Public landing | `/` | Hero, featured programmes, providers, CTA |
| Programme discovery | `/programmes` | List + search/filter (category, level, mode, cost) |
| Search & filtering | on `/programmes` | Client + server filters, URL query params |
| Programme details | `/programmes/[slug]` | Full details, provider link, save button |
| Provider profiles | `/providers/[id]` | Provider info + their programmes |
| Learner registration/login | `/register`, `/login` | Forms + validation, redirect to dashboard |
| Learner dashboard | `/dashboard` | My saved programmes, recommendations |
| Saved programmes | `/saved` | List saved programmes, remove save |
| Provider dashboard | `/provider/dashboard` | My programmes, create/edit |
| Programme management forms | `/provider/programmes/new`, `/provider/programmes/[id]/edit` | CRUD forms |
| Administrator dashboard | `/admin/dashboard` | Stats, pending reviews count |
| Programme review & moderation | `/admin/programmes/review`, `/admin/programmes/[id]` | Approve/reject programmes |

## 8. Auth & role-based navigation

- Navbar shows role-appropriate links: learner → dashboard/saved; provider → provider dashboard/new programme; admin → admin dashboard; unauthenticated → login/register.
- Protected routes redirect to login when unauthenticated; role guards redirect wrong roles to home.
- Auth state via Supabase session; persisted across page navigations.

## 9. Implementation phases

1. **Plan + docs** (this document + proposed API contract docs).
2. **Foundation**: types, supabase clients, api service layer, navbar/footer, layout.
3. **Auth**: login, register, session handling, protected routes, role-based nav.
4. **Public pages**: landing, programme discovery + filters, programme details, provider profiles.
5. **Learner**: dashboard, saved programmes.
6. **Provider**: dashboard, create/edit programme forms.
7. **Admin**: dashboard, review/moderation.
8. **Integration & verification**: connect to real backend, swap mock data, run `npm run lint` + `npm run build`, test loading/error/empty states.

## 10. Verification

- `npm run lint` must pass.
- `npm run build` must succeed.
- App runs at `http://localhost:3000` and displays real programme data from the backend once available.
