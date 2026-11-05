export type UserRole = "learner" | "provider" | "administrator";

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  logo_url?: string | null;
  contact_email?: string | null;
  created_at: string;
}

export interface Programme {
  id: string;
  provider_id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  level?: string | null;
  duration?: string | null;
  cost?: number | null;
  currency?: string | null;
  location?: string | null;
  mode?: "online" | "in-person" | "hybrid" | null;
  status: "draft" | "pending_review" | "published" | "rejected";
  created_at: string;
  updated_at: string;
  provider?: Provider | null;
}

export interface SavedProgramme {
  id: string;
  user_id: string;
  programme_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  programme_id: string;
  reviewer_id?: string | null;
  status: "pending" | "approved" | "rejected";
  comments?: string | null;
  created_at: string;
}

export interface ProgrammeFilters {
  search?: string;
  category?: string;
  level?: string;
  mode?: string;
  min_cost?: number;
  max_cost?: number;
  provider_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ProgrammeCreateInput {
  title: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  cost?: number;
  currency?: string;
  location?: string;
  mode?: "online" | "in-person" | "hybrid";
}

export type ProgrammeUpdateInput = Partial<ProgrammeCreateInput>;

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name?: string;
  role?: UserRole;
}

export interface AdminStats {
  total_programmes: number;
  pending_reviews: number;
  total_users: number;
  total_providers: number;
}
