"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  ApiError,
  User,
  UserRole,
  LoginInput,
  RegisterInput,
} from "@/types/index";

type AuthResult = { data: User | null; error: ApiError | null };

type SupabaseError = Error & { status?: number; code?: string };

function toApiError(err: SupabaseError): ApiError {
  return {
    message: err.message ?? "An unexpected error occurred",
    status: err.status,
    code: err.code,
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) return { data: null, error: toApiError(error) };
  return { data: data.user ? mapUser(data.user) : null, error: null };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.full_name,
        role: input.role || "learner",
      },
    },
  });

  if (error) return { data: null, error: toApiError(error) };
  return { data: data.user ? mapUser(data.user) : null, error: null };
}

export async function logout(): Promise<{ error: ApiError | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error: error ? toApiError(error) : null };
}

export async function getSession(): Promise<AuthResult> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { data: null, error: null };
  return { data: mapUser(session.user), error: null };
}

export async function getUser(): Promise<AuthResult> {
  return getSession();
}

function mapUser(
  u: { id: string; email: string; user_metadata?: Record<string, unknown> | null; created_at: string }
): User {
  const meta = u.user_metadata ?? {};
  return {
    id: u.id,
    email: u.email,
    full_name: (meta.full_name as string | undefined) ?? null,
    role: ((meta.role as UserRole) || "learner"),
    avatar_url: (meta.avatar_url as string | undefined) ?? null,
    created_at: u.created_at,
  };
}
