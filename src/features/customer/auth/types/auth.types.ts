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
  data: string | null;
}
export interface SendOtpResponse {
  error: string | null;
  data: string | null;
}
export interface VerifyOtpResponse {
  error: string | null;
  data: {
    key: string;
    status: boolean;
  } | null;
}
export interface UserRank {
  id: string;
  name: string;
}

export interface OrderPaymentProcessing {
  time: number;
  paymentLink: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  phone: string;
  gender: number | null;
  avatar?: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
  rank: UserRank;
  orderPaymentProcessing: OrderPaymentProcessing;
}
export interface JwtPayload {
  sub: string;
  token_type: "access" | "refresh";
  iat: number;
  exp: number;
  nbf: number;
  authorities: string[];
}
export interface LoginResponse {
  error: string | null;
  data: string;
}
export interface RegisterResponse {
  error: string | null;
  data: string;
}
export interface StoredAuthData {
  user: AuthUser;
  token: string;
  expiresAt: number;
}
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
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface ValidationErrors {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
  phone?: string;
  otp?: string;
  general?: string;
}
export enum Gender {
  Female = 0,
  Male = 1,
  Other = 2,
}
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}