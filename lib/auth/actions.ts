"use server";

import { generateExpiredPayloadCookie, generatePayloadCookie } from "payload";
import { cookies, headers } from "next/headers";
import { getPayloadClient } from "@/lib/data/payload";
import {
  signInSchema,
  signUpSchema,
  updateProfileSchema,
  type SignInInput,
  type SignUpInput,
  type UpdateProfileInput,
} from "@/lib/validation/auth";
import type { User } from "@/types";

type AuthActionResult = { data: User | null; error: { message: string } | null };

type UserDocument = {
  id: string;
  email?: string | null;
  name?: string | null;
  accountType?: "learner" | "provider";
  onboardingComplete?: boolean;
  createdAt?: string;
};

function toUser(document: UserDocument): User {
  return {
    id: document.id,
    email: document.email ?? "",
    full_name: document.name ?? null,
    role: document.accountType ?? "learner",
    avatar_url: null,
    created_at: document.createdAt ?? "",
  };
}

async function setAuthCookie(token: string) {
  const payload = await getPayloadClient();
  const authCollection = payload.config.collections.find(({ slug }) => slug === "users");
  if (!authCollection?.auth) throw new Error("The users auth collection is not configured.");

  const cookie = generatePayloadCookie({
    collectionAuthConfig: authCollection.auth,
    cookiePrefix: payload.config.cookiePrefix,
    token,
    returnCookieAsObject: true,
  });
  const cookieStore = await cookies();
  cookieStore.set(cookie.name, cookie.value, {
    domain: cookie.domain,
    expires: cookie.expires ? new Date(cookie.expires) : undefined,
    httpOnly: cookie.httpOnly,
    maxAge: cookie.maxAge,
    path: cookie.path,
    sameSite: cookie.sameSite?.toLowerCase() as "lax" | "strict" | "none" | undefined,
    secure: cookie.secure,
  });
}

async function clearAuthCookie() {
  const payload = await getPayloadClient();
  const authCollection = payload.config.collections.find(({ slug }) => slug === "users");
  if (!authCollection?.auth) throw new Error("The users auth collection is not configured.");

  const cookie = generateExpiredPayloadCookie({
    collectionAuthConfig: authCollection.auth,
    cookiePrefix: payload.config.cookiePrefix,
    returnCookieAsObject: true,
  });
  const cookieStore = await cookies();
  cookieStore.set(cookie.name, "", {
    domain: cookie.domain,
    expires: cookie.expires ? new Date(cookie.expires) : new Date(0),
    httpOnly: cookie.httpOnly,
    path: cookie.path,
    sameSite: cookie.sameSite?.toLowerCase() as "lax" | "strict" | "none" | undefined,
    secure: cookie.secure,
  });
}

export async function signUp(input: SignUpInput): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return { data: null, error: { message: "Invalid registration details." } };

  try {
    const payload = await getPayloadClient();
    const created = (await payload.create({
      collection: "users",
      data: {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
        accountType: parsed.data.accountType,
        onboardingComplete: false,
      },
      overrideAccess: true,
    })) as unknown as UserDocument;
    const result = await payload.login({
      collection: "users",
      data: { email: parsed.data.email, password: parsed.data.password },
    });

    if (!result.token || !result.user) {
      return { data: null, error: { message: "Unable to create account. Please try again." } };
    }

    await setAuthCookie(result.token);
    return { data: toUser((result.user as unknown as UserDocument) ?? created), error: null };
  } catch {
    return { data: null, error: { message: "Unable to create account. Please try again." } };
  }
}

export async function signIn(input: SignInInput): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { data: null, error: { message: "Invalid email or password." } };

  try {
    const payload = await getPayloadClient();
    const result = await payload.login({
      collection: "users",
      data: parsed.data,
    });
    if (!result.token || !result.user) {
      return { data: null, error: { message: "Invalid email or password." } };
    }
    await setAuthCookie(result.token);
    return { data: toUser(result.user as unknown as UserDocument), error: null };
  } catch {
    return { data: null, error: { message: "Invalid email or password." } };
  }
}

export async function signOut(): Promise<void> {
  await clearAuthCookie();
}

export async function getCurrentUser(): Promise<AuthActionResult> {
  const payload = await getPayloadClient();
  const result = await payload.auth({ headers: await headers() });
  if (!result.user || result.user.collection !== "users") {
    return { data: null, error: null };
  }
  return { data: toUser(result.user as unknown as UserDocument), error: null };
}

export async function updateOwnProfile(
  input: UpdateProfileInput,
): Promise<AuthActionResult> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) return { data: null, error: { message: "Invalid profile details." } };

  const payload = await getPayloadClient();
  const auth = await payload.auth({ headers: await headers() });
  if (!auth.user || auth.user.collection !== "users") {
    return { data: null, error: { message: "Please sign in to update your profile." } };
  }

  try {
    const updated = await payload.update({
      collection: "users",
      id: auth.user.id,
      data: parsed.data as UpdateProfileInput,
      overrideAccess: true,
    });
    return { data: toUser(updated as unknown as UserDocument), error: null };
  } catch {
    return { data: null, error: { message: "Unable to update profile. Please try again." } };
  }
}
