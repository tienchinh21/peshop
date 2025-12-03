import { axiosDotnet } from "@/lib/config/axios.config";
import { API_ENDPOINTS } from "@/lib/config/api.config";
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  AuthUser,
} from "../types";

export const sendOtp = async (
  data: SendOtpRequest
): Promise<SendOtpResponse> => {
  const response = await axiosDotnet.post<SendOtpResponse>(
    API_ENDPOINTS.MAIL.SEND_OTP,
    data
  );
  return response.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const response = await axiosDotnet.post<VerifyOtpResponse>(
    API_ENDPOINTS.MAIL.VERIFY_OTP,
    data
  );
  return response.data;
};

export const resendOtp = async (
  data: SendOtpRequest
): Promise<SendOtpResponse> => {
  const response = await axiosDotnet.post<SendOtpResponse>(
    API_ENDPOINTS.MAIL.RESEND_OTP,
    data
  );
  return response.data;
};

/**
 * Clean and validate JWT token
 * Removes BOM, whitespace, and other unwanted characters
 */
const cleanToken = (token: string): string => {
  if (!token) return token;

  // Remove BOM if present
  let cleaned = token.replace(/^\uFEFF/, "");

  // Remove all whitespace
  cleaned = cleaned.trim();

  // Remove any non-printable characters
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

  return cleaned;
};

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await axiosDotnet.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    // Handle case where response.data is a string (token directly)
    if (typeof response.data === "string") {
      const originalToken = response.data as string;
      const cleanedToken = cleanToken(originalToken);

      return {
        error: null,
        data: cleanedToken,
      };
    }

    // Handle normal response format
    if (response.data && typeof response.data === "object") {
      // If data.data is a string (token), clean it
      if (typeof response.data.data === "string") {
        return {
          error: response.data.error || null,
          data: cleanToken(response.data.data),
        };
      }
      return response.data;
    }

    return response.data;
  } catch (error: any) {
    console.error("Register error:", error);

    // Handle error response
    if (error.response?.data) {
      return {
        error:
          error.response.data.error ||
          error.response.data.message ||
          "Đăng ký thất bại",
        data: "",
      };
    }

    throw error;
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosDotnet.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );

    // Log response for debugging
    console.log("Login response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
      dataType: typeof response.data,
    });

    // Handle case where response.data is a string (token directly)
    if (typeof response.data === "string") {
      const originalToken = response.data as string;
      const cleanedToken = cleanToken(originalToken);
      console.log("Token cleaned:", {
        original: originalToken.substring(0, 50),
        cleaned: cleanedToken.substring(0, 50),
        originalLength: originalToken.length,
        cleanedLength: cleanedToken.length,
      });

      return {
        error: null,
        data: cleanedToken,
      };
    }

    // Handle normal response format
    if (response.data && typeof response.data === "object") {
      // If data.data is a string (token), clean it
      if (typeof response.data.data === "string") {
        return {
          error: response.data.error || null,
          data: cleanToken(response.data.data),
        };
      }
      return response.data;
    }

    // Fallback
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle error response
    if (error.response?.data) {
      return {
        error:
          error.response.data.error ||
          error.response.data.message ||
          "Đăng nhập thất bại",
        data: "",
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
  const response = await axiosDotnet.post<LoginResponse>(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN
  );
  return response.data;
};
