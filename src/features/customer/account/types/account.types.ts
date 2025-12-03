/**
 * Account feature types
 * Re-exports auth types that are relevant for account management
 */

// Re-export user types from auth
export type { AuthUser, Gender } from "@/features/customer/auth/types";

// Account-specific types
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  gender?: number;
  avatar?: string;
}

export interface UpdateProfileResponse {
  error: string | null;
  data: {
    id: string;
    email: string;
    username: string;
    name: string;
    phone: string;
    gender: number;
    avatar?: string;
  } | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  error: string | null;
  data: string | null;
}
