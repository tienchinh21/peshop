// ============ Request Types ============

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
  key: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  error: string | null;
  data: string | null; // Message or confirmation
}

// ============ Response Types ============

export interface SendOtpResponse {
  error: string | null;
  data: string | null; // Message or confirmation
}

export interface VerifyOtpResponse {
  error: string | null;
  data: {
    key: string;
    status: boolean;
  } | null;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  phone: string;
  gender: number;
  avatar?: string;
  roles: string[]; // ["User", "Shop", "Admin"]
  createdAt?: string;
  updatedAt?: string;
}

// JWT Token Payload
export interface JwtPayload {
  sub: string; // user id
  token_type: "access" | "refresh";
  iat: number; // issued at
  exp: number; // expiration
  nbf: number; // not before
  authorities: string[]; // roles
}

// Login response - only returns access token (refresh token in cookie)
export interface LoginResponse {
  error: string | null;
  data: string; // JWT access token
}

// Register response - same as login
export interface RegisterResponse {
  error: string | null;
  data: string; // JWT access token
}

// ============ Local Storage Types ============
export interface StoredAuthData {
  user: AuthUser;
  token: string;
  expiresAt: number;
  // Note: refreshToken is stored in HTTP-only cookie
}

// ============ Form Types ============
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  gender: number;
  otp: string;
}

// ============ Auth State Types ============
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============ Validation Types ============
export interface ValidationErrors {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
  phone?: string;
  otp?: string;
  general?: string;
}

// ============ Gender Enum ============
export enum Gender {
  Female = 0,
  Male = 1,
  Other = 2,
}

// ============ Auth Error Types ============
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}
