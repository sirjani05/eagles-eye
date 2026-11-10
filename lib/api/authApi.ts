 "use client";

import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "@/lib/auth/actions";
import type {
  ApiError,
  User,
  UserRole,
  LoginInput,
  RegisterInput,
} from "@/types/index";

type AuthResult = { data: User | null; error: ApiError | null };

export async function login(input: LoginInput): Promise<AuthResult> {
  return signIn(input);
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const accountType: UserRole =
    input.role === "provider" ? "provider" : "learner";
  if (accountType !== input.role && input.role !== undefined) {
    return { data: null, error: { message: "Invalid registration details." } };
  }
  return signUp({
    email: input.email,
    password: input.password,
    name: input.full_name ?? "",
    accountType,
  });
}

export async function logout(): Promise<{ error: ApiError | null }> {
  await signOut();
  return { error: null };
}

export async function getSession(): Promise<AuthResult> {
  return getCurrentUser();
}

export async function getUser(): Promise<AuthResult> {
  return getSession();
}
