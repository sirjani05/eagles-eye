"use client";

import type {
  Programme,
  ProgrammeFilters,
  ProgrammeCreateInput,
  ProgrammeUpdateInput,
  ApiError,
} from "@/types/index";

type ProgrammesResult = { data: Programme[] | null; error: ApiError | null };
type ProgrammeResult = { data: Programme | null; error: ApiError | null };
type BooleanResult = { data: boolean | null; error: ApiError | null };
type SavedResult = { data: any | null; error: ApiError | null };

// TEMPORARY MOCK — replace with real backend calls once endpoints are confirmed.
// This block lets the frontend run against real-looking data before the API is ready.
const MOCK_PROGRAMMES: Programme[] = [
  {
    id: "prog-1",
    provider_id: "prov-1",
    title: "Introduction to Data Analysis",
    description: "Learn the foundations of data analysis with practical exercises.",
    category: "Data & Analytics",
    level: "Beginner",
    duration: "6 weeks",
    cost: 299,
    currency: "GBP",
    location: "Online",
    mode: "online",
    status: "published",
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
    provider: {
      id: "prov-1",
      user_id: "user-1",
      name: "TechBridge Academy",
      description: "Practical tech courses for career changers.",
      website: "https://techbridge.example",
      logo_url: null,
      contact_email: "hello@techbridge.example",
      created_at: "2026-01-01T00:00:00Z",
    },
  },
  {
    id: "prog-2",
    provider_id: "prov-2",
    title: "UX Design Fundamentals",
    description: "Hands-on introduction to user experience design and prototyping.",
    category: "Design",
    level: "Beginner",
    duration: "8 weeks",
    cost: 450,
    currency: "GBP",
    location: "London",
    mode: "in-person",
    status: "published",
    created_at: "2026-02-05T00:00:00Z",
    updated_at: "2026-02-05T00:00:00Z",
    provider: {
      id: "prov-2",
      user_id: "user-2",
      name: "Design Hub",
      description: "Creative design training led by industry professionals.",
      website: "https://designhub.example",
      logo_url: null,
      contact_email: "contact@designhub.example",
      created_at: "2026-01-15T00:00:00Z",
    },
  },
  {
    id: "prog-3",
    provider_id: "prov-1",
    title: "Advanced Python for Engineers",
    description: "Deep dive into Python for engineering and automation.",
    category: "Engineering",
    level: "Advanced",
    duration: "10 weeks",
    cost: 699,
    currency: "GBP",
    location: "Online",
    mode: "online",
    status: "pending_review",
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    provider: {
      id: "prov-1",
      user_id: "user-1",
      name: "TechBridge Academy",
      description: "Practical tech courses for career changers.",
      website: "https://techbridge.example",
      logo_url: null,
      contact_email: "hello@techbridge.example",
      created_at: "2026-01-01T00:00:00Z",
    },
  },
  {
    id: "prog-4",
    provider_id: "prov-3",
    title: "Digital Marketing Essentials",
    description: "Core digital marketing channels and campaign measurement.",
    category: "Marketing",
    level: "Beginner",
    duration: "4 weeks",
    cost: 199,
    currency: "GBP",
    location: "Online",
    mode: "online",
    status: "published",
    created_at: "2026-03-20T00:00:00Z",
    updated_at: "2026-03-20T00:00:00Z",
    provider: {
      id: "prov-3",
      user_id: "user-3",
      name: "Growth School",
      description: "Modern marketing for the digital age.",
      website: "https://growth.example",
      logo_url: null,
      contact_email: "team@growth.example",
      created_at: "2026-02-01T00:00:00Z",
    },
  },
];

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

export async function deleteProgramme(id: string): Promise<BooleanResult> {
  // TEMPORARY MOCK — replace with DELETE /programmes/:id
  await new Promise((r) => setTimeout(r, 300));
  return { data: true, error: null };
}

export async function saveProgramme(
  programmeId: string
): Promise<SavedResult> {
  // TEMPORARY MOCK — replace with POST /programmes/:id/save
  await new Promise((r) => setTimeout(r, 200));
  return { data: { id: "saved-1", programme_id: programmeId }, error: null };
}

export async function unsaveProgramme(
  programmeId: string
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
