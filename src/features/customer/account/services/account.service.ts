import { axiosDotnet } from "@/lib/config/axios.config";
import { API_ENDPOINTS } from "@/lib/config/api.config";
import type { AuthUser } from "@/features/customer/auth/types";
import type { UpdateProfileRequest, UpdateProfileResponse, ChangePasswordRequest, ChangePasswordResponse } from "../types";
export const getProfile = async (): Promise<AuthUser | null> => {
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
    console.error("Error getting profile:", error);
    return null;
  }
};
export const updateProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  try {
    const response = await axiosDotnet.put<UpdateProfileResponse>(API_ENDPOINTS.AUTH.ME, data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    const err = error as {
      response?: {
        data?: {
          error?: string;
          message?: string;
        };
      };
    };
    return {
      error: err.response?.data?.error || err.response?.data?.message || "Cập nhật thất bại",
      data: null
    };
  }
};
export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  try {
    const response = await axiosDotnet.post<ChangePasswordResponse>(`${API_ENDPOINTS.AUTH.ME}/change-password`, data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error changing password:", error);
    const err = error as {
      response?: {
        data?: {
          error?: string;
          message?: string;
        };
      };
    };
    return {
      error: err.response?.data?.error || err.response?.data?.message || "Đổi mật khẩu thất bại",
      data: null
    };
  }
};