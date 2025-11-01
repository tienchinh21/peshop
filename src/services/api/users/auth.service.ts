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
} from "@/types/users/auth.types";

// ============ Auth API Functions ============

export const sendOtp = async (
    data: SendOtpRequest,
): Promise<SendOtpResponse> => {
    const response = await axiosDotnet.post<SendOtpResponse>(
        API_ENDPOINTS.MAIL.SEND_OTP,
        data,
    );
    return response.data;
};

export const verifyOtp = async (
    data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
    const response = await axiosDotnet.post<VerifyOtpResponse>(
        API_ENDPOINTS.MAIL.VERIFY_OTP,
        data,
    );
    return response.data;
};

export const resendOtp = async (
    data: SendOtpRequest,
): Promise<SendOtpResponse> => {
    const response = await axiosDotnet.post<SendOtpResponse>(
        API_ENDPOINTS.MAIL.RESEND_OTP,
        data,
    );
    return response.data;
};

export const register = async (
    data: RegisterRequest,
): Promise<RegisterResponse> => {
    const response = await axiosDotnet.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data,
    );
    return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosDotnet.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data,
    );
    return response.data;
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
    const response = await axiosDotnet.post<LoginResponse>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    );
    return response.data;
};
