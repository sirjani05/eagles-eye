"use client";

import type { Provider, ApiError, Programme } from "@/types/index";
import { MOCK_PROVIDERS } from "@/data/mock";

type ProvidersResult = { data: Provider[] | null; error: ApiError | null };
type ProviderResult = { data: Provider | null; error: ApiError | null };

// TEMPORARY MOCK — replace with real backend calls once endpoints are confirmed.

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
  _providerId: string
): Promise<{ data: Programme[] | null; error: ApiError | null }> {
  // TEMPORARY MOCK — replace with GET /providers/:id/programmes
  await new Promise((r) => setTimeout(r, 200));
  return { data: [], error: null };
}
