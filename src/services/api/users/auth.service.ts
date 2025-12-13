import { axiosDotnet } from "@/lib/config/axios.config";
import { API_ENDPOINTS } from "@/lib/config/api.config";
import type { SendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AuthUser } from "@/types/users/auth.types";
export const sendOtp = async (data: SendOtpRequest): Promise<SendOtpResponse> => {
  const response = await axiosDotnet.post<SendOtpResponse>(API_ENDPOINTS.MAIL.SEND_OTP, data);
  return response.data;
};
export const verifyOtp = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  const response = await axiosDotnet.post<VerifyOtpResponse>(API_ENDPOINTS.MAIL.VERIFY_OTP, data);
  return response.data;
};
export const resendOtp = async (data: SendOtpRequest): Promise<SendOtpResponse> => {
  const response = await axiosDotnet.post<SendOtpResponse>(API_ENDPOINTS.MAIL.RESEND_OTP, data);
  return response.data;
};
const cleanToken = (token: string): string => {
  if (!token) return token;
  let cleaned = token.replace(/^\uFEFF/, '');
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  return cleaned;
};
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await axiosDotnet.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    if (typeof response.data === 'string') {
      const originalToken = response.data as string;
      const cleanedToken = cleanToken(originalToken);
      return {
        error: null,
        data: cleanedToken
      };
    }
    if (response.data && typeof response.data === 'object') {
      if (typeof response.data.data === 'string') {
        return {
          error: response.data.error || null,
          data: cleanToken(response.data.data)
        };
      }
      return response.data;
    }
    return response.data;
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.response?.data) {
      return {
        error: error.response.data.error || error.response.data.message || 'Đăng ký thất bại',
        data: ''
      };
    }
    throw error;
  }
};
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosDotnet.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    if (typeof response.data === 'string') {
      const originalToken = response.data as string;
      const cleanedToken = cleanToken(originalToken);
      return {
        error: null,
        data: cleanedToken
      };
    }
    if (response.data && typeof response.data === 'object') {
      if (typeof response.data.data === 'string') {
        return {
          error: response.data.error || null,
          data: cleanToken(response.data.data)
        };
      }
      return response.data;
    }
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response?.data) {
      return {
        error: error.response.data.error || error.response.data.message || 'Đăng nhập thất bại',
        data: ''
      };
    }
    throw error;
  }
};
export const logout = async (): Promise<void> => {
  await axiosDotnet.post(API_ENDPOINTS.AUTH.LOGOUT);
};
export const getCurrentUserFromAPI = async (): Promise<AuthUser | null> => {
  try {
    const response = await axiosDotnet.get<{
      error: string | null;
      data: AuthUser;
    }>(API_ENDPOINTS.AUTH.ME);
    if (!response.data.error && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * @deprecated Use refreshAuthToken from @/services/core/auth instead
 * This is kept for backward compatibility
 */
export const refreshAuthToken = async (): Promise<LoginResponse> => {
  const response = await axiosDotnet.post<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
  return response.data;
};