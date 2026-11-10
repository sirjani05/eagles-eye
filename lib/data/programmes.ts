import "server-only";

import type { Where } from "payload";
import { z } from "zod";
import { unstable_cache } from "next/cache";
import { getPayloadClient } from "@/lib/data/payload";
import {
  programmeSearchSchema,
  type ProgrammeSearchInput,
} from "@/lib/validation/programmes";

export interface ProviderSummary {
  id: string;
  name: string;
  slug: string;
  location: string;
  verified: boolean;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface ProgrammeRecord {
  id: string;
  title: string;
  slug: string;
  summary: string;
  fullDescription: unknown;
  provider: ProviderSummary;
  category: CategorySummary;
  level: "beginner" | "intermediate" | "advanced";
  tuitionFeeGBP: number;
  format: "online" | "in-person" | "hybrid";
  durationWeeks: number;
  qualification: string;
  entryRequirements: string;
  learningMethods: { method: string }[];
  featured: boolean;
  status: "draft" | "published" | "archived";
}

export interface ProviderRecord {
  id: string;
  name: string;
  slug: string;
  providerType: "independent-college" | "academy" | "training-centre";
  location: string;
  description: string;
  verified: boolean;
  foundedYear?: number | null;
  learnerCount?: number | null;
  completionRate?: number | null;
}

const slugSchema = z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
type Relation<T> = string | T;
type ProgrammeDocument = Omit<ProgrammeRecord, "provider" | "category"> & {
  provider: Relation<ProviderSummary>;
  category: Relation<CategorySummary>;
};

function isPopulated<T>(relation: Relation<T>): relation is T {
  return typeof relation !== "string";
}

function normalizeProgramme(doc: ProgrammeDocument): ProgrammeRecord {
  if (!isPopulated(doc.provider) || !isPopulated(doc.category)) {
    throw new Error(`Programme "${doc.slug}" has an unresolved provider or category.`);
  }
  return { ...doc, provider: doc.provider, category: doc.category };
}

export async function searchProgrammes(input: ProgrammeSearchInput = {}) {
  const filters = programmeSearchSchema.parse(input);
  const where: Where = {
    and: [
      { status: { equals: "published" } },
      ...(filters.category ? [{ "category.name": { equals: filters.category } }] : []),
      ...(filters.level ? [{ level: { equals: filters.level } }] : []),
      ...(filters.format ? [{ format: { equals: filters.format } }] : []),
      ...(filters.providerId ? [{ provider: { equals: filters.providerId } }] : []),
      ...(filters.minPrice !== undefined
        ? [{ tuitionFeeGBP: { greater_than_equal: filters.minPrice } }]
        : []),
      ...(filters.maxPrice !== undefined
        ? [{ tuitionFeeGBP: { less_than_equal: filters.maxPrice } }]
        : []),
      ...(filters.search
        ? [
            {
              or: [
                { title: { like: filters.search } },
                { summary: { like: filters.search } },
              ],
            },
          ]
        : []),
    ],
  };
  const sortBy = {
    relevance: filters.search ? "-_score" : "-updatedAt",
    "price-asc": "tuitionFeeGBP",
    "price-desc": "-tuitionFeeGBP",
    "duration-asc": "durationWeeks",
    "duration-desc": "-durationWeeks",
  }[filters.sort];
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "programmes",
    where,
    depth: 1,
    page: filters.page,
    limit: filters.limit,
    sort: sortBy,
    overrideAccess: false,
  });

  return {
    docs: (result.docs as unknown as ProgrammeDocument[]).map(normalizeProgramme),
    page: result.page ?? filters.page,
    limit: filters.limit,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  };
}

export async function getFeaturedProgrammes(limit = 6) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "programmes",
    where: {
      and: [{ status: { equals: "published" } }, { featured: { equals: true } }],
    },
    depth: 1,
    limit: Math.min(Math.max(limit, 1), 50),
    sort: "-updatedAt",
  });
  return (result.docs as unknown as ProgrammeDocument[]).map(normalizeProgramme);
}

export async function getProgrammeBySlug(slug: string) {
  const safeSlug = slugSchema.parse(slug);
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "programmes",
    where: { and: [{ slug: { equals: safeSlug } }, { status: { equals: "published" } }] },
    depth: 1,
    limit: 1,
  });
  const doc = result.docs[0] as unknown as ProgrammeDocument | undefined;
  return doc ? normalizeProgramme(doc) : null;
}

export async function getProviders() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "providers",
    where: { verified: { equals: true } },
    depth: 0,
    limit: 50,
    sort: "name",
  });
  return result.docs as unknown as ProviderRecord[];
}

export async function getProviderBySlug(slug: string) {
  const safeSlug = slugSchema.parse(slug);
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "providers",
    where: { and: [{ slug: { equals: safeSlug } }, { verified: { equals: true } }] },
    depth: 0,
    limit: 1,
  });
  return (result.docs[0] as unknown as ProviderRecord | undefined) ?? null;
}

export async function getProviderProgrammes(providerId: string) {
  const safeId = slugSchema.parse(providerId);
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "programmes",
    where: {
      and: [{ provider: { equals: safeId } }, { status: { equals: "published" } }],
    },
    depth: 1,
    limit: 50,
  });
  return (result.docs as unknown as ProgrammeDocument[]).map(normalizeProgramme);
}

export const getCachedProgrammeBySlug = (slug: string) =>
  unstable_cache(() => getProgrammeBySlug(slug), ["programme", slug], {
    tags: ["programmes", `programme:${slug}`],
  })();

export const getCachedProviders = () =>
  unstable_cache(() => getProviders(), ["providers"], { tags: ["providers"] })();

export const getCachedProviderBySlug = (slug: string) =>
  unstable_cache(() => getProviderBySlug(slug), ["provider", slug], {
    tags: ["providers", `provider:${slug}`],
  })();
