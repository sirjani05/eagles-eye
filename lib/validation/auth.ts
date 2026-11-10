import { z } from "zod";

export const signInSchema = z.object({
  email: z.email().max(254).transform((value) => value.trim().toLowerCase()),
  password: z.string().min(1).max(128),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(1).max(100),
  password: z.string().min(12).max(128),
  accountType: z.enum(["learner", "provider"]).default("learner"),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    onboardingComplete: z.boolean().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "Provide at least one profile field.");

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
