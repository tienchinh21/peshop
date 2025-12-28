import { axiosDotnet } from "@/lib/config/axios.config";
import { API_ENDPOINTS } from "@/lib/config/api.config";
import type { SendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AuthUser } from "../types";

// Helper function to extract error message from API response
const extractErrorMessage = (error: any, defaultMsg: string): string => {
  if (typeof error === 'object' && error !== null) {
    return error.message || defaultMsg;
  }
  return error || defaultMsg;
};

export const sendOtp = async (data: SendOtpRequest): Promise<SendOtpResponse> => {
  try {
    const response = await axiosDotnet.post<SendOtpResponse>(API_ENDPOINTS.MAIL.SEND_OTP, data);
    // Handle error object: {"error":{"message":"..."}, "data":null}
    if (response.data?.error) {
      return {
        error: extractErrorMessage(response.data.error, "Gửi OTP thất bại"),
        data: null
      };
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        error: extractErrorMessage(error.response.data.error, "Gửi OTP thất bại"),
        data: null
      };
    }
    throw error;
  }
};

export const verifyOtp = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  try {
    const response = await axiosDotnet.post<VerifyOtpResponse>(API_ENDPOINTS.MAIL.VERIFY_OTP, data);
    // Handle error object: {"error":{"message":"..."}, "data":null}
    if (response.data?.error) {
      return {
        error: extractErrorMessage(response.data.error, "Xác thực OTP thất bại"),
        data: null
      };
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        error: extractErrorMessage(error.response.data.error, "Xác thực OTP thất bại"),
        data: null
      };
    }
    throw error;
  }
};

export const resendOtp = async (data: SendOtpRequest): Promise<SendOtpResponse> => {
  try {
    const response = await axiosDotnet.post<SendOtpResponse>(API_ENDPOINTS.MAIL.RESEND_OTP, data);
    // Handle error object: {"error":{"message":"..."}, "data":null}
    if (response.data?.error) {
      return {
        error: extractErrorMessage(response.data.error, "Gửi lại OTP thất bại"),
        data: null
      };
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return {
        error: extractErrorMessage(error.response.data.error, "Gửi lại OTP thất bại"),
        data: null
      };
    }
    throw error;
  }
};

const cleanToken = (token: string): string => {
  if (!token) return token;
  let cleaned = token.replace(/^\uFEFF/, "");
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  return cleaned;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await axiosDotnet.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    if (typeof response.data === "string") {
      const originalToken = response.data as string;
      const cleanedToken = cleanToken(originalToken);
      return {
        error: null,
        data: cleanedToken
      };
    }
    if (response.data && typeof response.data === "object") {
      // Handle error object: {"error":{"message":"..."}, "data":null}
      if (response.data.error) {
        const errorMsg = typeof response.data.error === 'object' 
          ? (response.data.error as any).message || "Đăng ký thất bại"
          : response.data.error;
        return {
          error: errorMsg,
          data: ""
        };
      }
      if (typeof response.data.data === "string") {
        return {
          error: null,
          data: cleanToken(response.data.data)
        };
      }
      return response.data;
    }
    return response.data;
  } catch (error: any) {
    console.error("Register error:", error);
    if (error.response?.data) {
      const errData = error.response.data;
      const errorMsg = typeof errData.error === 'object'
        ? errData.error.message || "Đăng ký thất bại"
        : errData.error || errData.message || "Đăng ký thất bại";
      return {
        error: errorMsg,
        data: ""
      };
    }
    throw error;
  }

};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosDotnet.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    if (typeof response.data === "string") {
      const originalToken = response.data as string;
      const cleanedToken = cleanToken(originalToken);
      return {
        error: null,
        data: cleanedToken
      };
    }
    if (response.data && typeof response.data === "object") {
      // Handle error object: {"error":{"message":"..."}, "data":null}
      if (response.data.error) {
        const errorMsg = typeof response.data.error === 'object' 
          ? (response.data.error as any).message || "Đăng nhập thất bại"
          : response.data.error;
        return {
          error: errorMsg,
          data: ""
        };
      }
      if (typeof response.data.data === "string") {
        return {
          error: null,
          data: cleanToken(response.data.data)
        };
      }
      return response.data;
    }
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.response?.data) {
      const errData = error.response.data;
      const errorMsg = typeof errData.error === 'object'
        ? errData.error.message || "Đăng nhập thất bại"
        : errData.error || errData.message || "Đăng nhập thất bại";
      return {
        error: errorMsg,
        data: ""
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


export const refreshAuthToken = async (): Promise<LoginResponse> => {
  const response = await axiosDotnet.post<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
  return response.data;
};