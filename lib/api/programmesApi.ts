"use client";

import type {
  Programme,
  ProgrammeFilters,
  ProgrammeCreateInput,
  ProgrammeUpdateInput,
  ApiError,
} from "@/types/index";
import { MOCK_PROGRAMMES } from "@/data/mock";

type ProgrammesResult = { data: Programme[] | null; error: ApiError | null };
type ProgrammeResult = { data: Programme | null; error: ApiError | null };
type BooleanResult = { data: boolean | null; error: ApiError | null };
type SaveResult = { data: { id: string; programme_id: string } | null; error: ApiError | null };

// TEMPORARY MOCK — replace with real backend calls once endpoints are confirmed.
// This block lets the frontend run against real-looking data before the API is ready.

let nextId = 100;

export async function listProgrammes(
  filters: ProgrammeFilters = {}
): Promise<ProgrammesResult> {
  // TEMPORARY MOCK — replace with GET /programmes
  await new Promise((r) => setTimeout(r, 300));
  let result = [...MOCK_PROGRAMMES].filter((p) => p.status === "published");

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }
  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.level) {
    result = result.filter((p) => p.level === filters.level);
  }
  if (filters.mode) {
    result = result.filter((p) => p.mode === filters.mode);
  }
  if (filters.provider_id) {
    result = result.filter((p) => p.provider_id === filters.provider_id);
  }
  if (filters.min_cost !== undefined) {
    result = result.filter((p) => (p.cost ?? 0) >= filters.min_cost!);
  }
  if (filters.max_cost !== undefined) {
    result = result.filter((p) => (p.cost ?? 0) <= filters.max_cost!);
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  const pageData = result.slice(start, start + limit);

  return { data: pageData, error: null };
}

export async function getProgramme(
  id: string
): Promise<ProgrammeResult> {
  // TEMPORARY MOCK — replace with GET /programmes/:id
  await new Promise((r) => setTimeout(r, 200));
  const prog = MOCK_PROGRAMMES.find((p) => p.id === id);
  return { data: prog ?? null, error: null };
}

export async function createProgramme(
  input: ProgrammeCreateInput
): Promise<ProgrammeResult> {
  // TEMPORARY MOCK — replace with POST /programmes
  await new Promise((r) => setTimeout(r, 300));
  const prog: Programme = {
    id: `mock-${++nextId}`,
    provider_id: "mock-provider",
    title: input.title,
    description: input.description ?? null,
    category: input.category ?? null,
    level: input.level ?? null,
    duration: input.duration ?? null,
    cost: input.cost ?? null,
    currency: input.currency ?? "GBP",
    location: input.location ?? null,
    mode: input.mode ?? null,
    status: "pending_review",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return { data: prog, error: null };
}

export async function updateProgramme(
  id: string,
  input: ProgrammeUpdateInput
): Promise<ProgrammeResult> {
  // TEMPORARY MOCK — replace with PATCH /programmes/:id
  await new Promise((r) => setTimeout(r, 300));
  const existing = MOCK_PROGRAMMES.find((p) => p.id === id);
  if (!existing)
    return { data: null, error: { message: "Programme not found" } };
  const updated = { ...existing, ...input, updated_at: new Date().toISOString() };
  return { data: updated, error: null };
}

export async function deleteProgramme(_id: string): Promise<BooleanResult> {
  // TEMPORARY MOCK — replace with DELETE /programmes/:id
  await new Promise((r) => setTimeout(r, 300));
  return { data: true, error: null };
}

export async function saveProgramme(
  programmeId: string
): Promise<SaveResult> {
  // TEMPORARY MOCK — replace with POST /programmes/:id/save
  await new Promise((r) => setTimeout(r, 200));
  return { data: { id: "saved-1", programme_id: programmeId }, error: null };
}

export async function unsaveProgramme(
  _programmeId: string
): Promise<BooleanResult> {
  // TEMPORARY MOCK — replace with DELETE /programmes/:id/save
  await new Promise((r) => setTimeout(r, 200));
  return { data: true, error: null };
}

export async function listSavedProgrammes(): Promise<ProgrammesResult> {
  // TEMPORARY MOCK — replace with GET /me/saved
  await new Promise((r) => setTimeout(r, 300));
  return { data: MOCK_PROGRAMMES.slice(0, 2), error: null };
}
