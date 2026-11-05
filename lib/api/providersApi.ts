"use client";

import type { Provider, ApiError } from "@/types/index";

type ProvidersResult = { data: Provider[] | null; error: ApiError | null };
type ProviderResult = { data: Provider | null; error: ApiError | null };

// TEMPORARY MOCK — replace with real backend calls once endpoints are confirmed.
const MOCK_PROVIDERS: Provider[] = [
  {
    id: "prov-1",
    user_id: "user-1",
    name: "TechBridge Academy",
    description: "Practical tech courses for career changers.",
    website: "https://techbridge.example",
    logo_url: null,
    contact_email: "hello@techbridge.example",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "prov-2",
    user_id: "user-2",
    name: "Design Hub",
    description: "Creative design training led by industry professionals.",
    website: "https://designhub.example",
    logo_url: null,
    contact_email: "contact@designhub.example",
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "prov-3",
    user_id: "user-3",
    name: "Growth School",
    description: "Modern marketing for the digital age.",
    website: "https://growth.example",
    logo_url: null,
    contact_email: "team@growth.example",
    created_at: "2026-02-01T00:00:00Z",
  },
];

export async function listProviders(): Promise<ProvidersResult> {
  // TEMPORARY MOCK — replace with GET /providers
  await new Promise((r) => setTimeout(r, 200));
  return { data: MOCK_PROVIDERS, error: null };
}

export async function getProvider(id: string): Promise<ProviderResult> {
  // TEMPORARY MOCK — replace with GET /providers/:id
  await new Promise((r) => setTimeout(r, 200));
  const provider = MOCK_PROVIDERS.find((p) => p.id === id);
  return { data: provider ?? null, error: null };
}

export async function getProviderProgrammes(
  providerId: string
): Promise<{ data: any[] | null; error: ApiError | null }> {
  // TEMPORARY MOCK — replace with GET /providers/:id/programmes
  await new Promise((r) => setTimeout(r, 200));
  return { data: [], error: null };
}
