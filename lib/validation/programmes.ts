import { z } from "zod";

export const programmeSearchSchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    category: z.string().trim().max(100).optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    format: z.enum(["online", "in-person", "hybrid"]).optional(),
    providerId: z.string().trim().max(100).optional(),
    minPrice: z.coerce.number().int().min(0).optional(),
    maxPrice: z.coerce.number().int().min(0).optional(),
    sort: z
      .enum(["relevance", "price-asc", "price-desc", "duration-asc", "duration-desc"])
      .default("relevance"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .refine(
    ({ minPrice, maxPrice }) =>
      minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice,
    { path: ["maxPrice"], message: "Maximum price must be greater than minimum price." },
  );

export type ProgrammeSearchInput = z.input<typeof programmeSearchSchema>;
export type ProgrammeSearch = z.output<typeof programmeSearchSchema>;
