"use client";

import type { AdminStats, ApiError } from "@/types/index";

type StatsResult = { data: AdminStats | null; error: ApiError | null };

// TEMPORARY MOCK — replace with real backend calls once endpoints are confirmed.
const MOCK_STATS: AdminStats = {
  total_programmes: 12,
  pending_reviews: 3,
  total_users: 45,
  total_providers: 8,
};

export async function listPendingProgrammes(): Promise<{
  data: any[] | null;
  error: ApiError | null;
}> {
  // TEMPORARY MOCK — replace with GET /admin/programmes/pending
  await new Promise((r) => setTimeout(r, 200));
  return { data: [], error: null };
}

export async function reviewProgramme(
  id: string,
  decision: "approved" | "rejected",
  comments?: string
): Promise<{ data: any | null; error: ApiError | null }> {
  // TEMPORARY MOCK — replace with POST /admin/programmes/:id/review
  await new Promise((r) => setTimeout(r, 300));
  return { data: { id, decision, comments }, error: null };
}

export async function getAdminStats(): Promise<StatsResult> {
  // TEMPORARY MOCK — replace with GET /admin/stats
  await new Promise((r) => setTimeout(r, 200));
  return { data: MOCK_STATS, error: null };
}
