"use server";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";
import {
  signInSchema,
  signUpSchema,
  updateProfileSchema,
  type SignInInput,
  type SignUpInput,
  type UpdateProfileInput,
} from "@/lib/validation/auth";
import type { User, UserRole } from "@/types";

type AuthActionResult = { data: User | null; error: { message: string } | null };

function toUser(authUser: SupabaseUser): User {
  const metadata = authUser.user_metadata;
  const appRole = authUser.app_metadata?.role;
  const metadataRole = metadata?.role ?? metadata?.accountType;
  const role: UserRole =
    appRole === "administrator"
      ? "administrator"
      : metadataRole === "provider"
        ? "provider"
        : "learner";

  return {
    id: authUser.id,
    email: authUser.email ?? "",
    full_name:
      typeof metadata?.full_name === "string"
        ? metadata.full_name
        : typeof metadata?.name === "string"
          ? metadata.name
          : null,
    role,
    avatar_url: typeof metadata?.avatar_url === "string" ? metadata.avatar_url : null,
    created_at: authUser.created_at,
  };
}

export async function signUp(input: SignUpInput): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return { data: null, error: { message: "Invalid registration details." } };

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.name,
        role: parsed.data.accountType,
        onboardingComplete: false,
      },
    },
  });
  if (error) return { data: null, error: { message: error.message } };
  if (!data.user) {
    return { data: null, error: { message: "Unable to create account. Please try again." } };
  }
  if (!data.session) {
    return {
      data: null,
      error: { message: "Account created. Check your email to confirm it, then sign in." },
    };
  }
  return { data: toUser(data.user), error: null };
}

export async function signIn(input: SignInInput): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { data: null, error: { message: "Invalid email or password." } };

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { data: null, error: { message: error.message } };
  if (!data.user) return { data: null, error: { message: "Invalid email or password." } };
  return { data: toUser(data.user), error: null };
}

export async function signOut(): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<AuthActionResult> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return { data: null, error: { message: error.message } };
  return { data: data.user ? toUser(data.user) : null, error: null };
}

export async function updateOwnProfile(
  input: UpdateProfileInput,
): Promise<AuthActionResult> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) return { data: null, error: { message: "Invalid profile details." } };

  const supabase = await createServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) return { data: null, error: { message: authError.message } };
  if (!authData.user) {
    return { data: null, error: { message: "Please sign in to update your profile." } };
  }

  const metadata = {
    ...authData.user.user_metadata,
    ...(parsed.data.name !== undefined
      ? { full_name: parsed.data.name }
      : {}),
    ...(parsed.data.onboardingComplete !== undefined
      ? { onboardingComplete: parsed.data.onboardingComplete }
      : {}),
  };
  const { data, error } = await supabase.auth.updateUser({ data: metadata });
  if (error) return { data: null, error: { message: error.message } };
  return { data: data.user ? toUser(data.user) : null, error: null };
}
