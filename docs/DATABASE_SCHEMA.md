# Database Schema — Eagle's Eye

## STATUS: PROPOSED (pending backend confirmation)

This document is a frontend-proposed schema summary used to derive TypeScript types. GitHub Copilot owns the database; this is not a migration and does not create any tables. It reflects the entities needed by the frontend modules.

## Tables

### profiles
- id (uuid, PK) — references auth.users
- email (text)
- full_name (text, nullable)
- role ('learner'|'provider'|'administrator', default 'learner')
- avatar_url (text, nullable)
- created_at (timestamptz)

### providers
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- name (text)
- description (text, nullable)
- website (text, nullable)
- logo_url (text, nullable)
- contact_email (text, nullable)
- created_at (timestamptz)

### programmes
- id (uuid, PK)
- provider_id (uuid, FK providers.id)
- title (text)
- description (text, nullable)
- category (text, nullable)
- level (text, nullable)
- duration (text, nullable)
- cost (numeric, nullable)
- currency (text, default 'GBP')
- location (text, nullable)
- mode ('online'|'in-person'|'hybrid')
- status ('draft'|'pending_review'|'published'|'rejected', default 'draft')
- created_at (timestamptz)
- updated_at (timestamptz)

### saved_programmes
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- programme_id (uuid, FK programmes.id)
- created_at (timestamptz)
- unique(user_id, programme_id)

### programme_reviews
- id (uuid, PK)
- programme_id (uuid, FK programmes.id)
- reviewer_id (uuid, FK profiles.id, nullable)
- status ('pending'|'approved'|'rejected')
- comments (text, nullable)
- created_at (timestamptz)

## Relationships used by frontend

- profiles.role drives role-based navigation.
- providers.user_id → profiles (provider owns programmes via provider_id).
- programmes.provider_id → providers.
- saved_programmes.user_id → profiles; saved_programmes.programme_id → programmes.
- programme_reviews.programme_id → programmes; programme_reviews.reviewer_id → profiles.

## Frontend-derived types

See `types/index.ts`.
