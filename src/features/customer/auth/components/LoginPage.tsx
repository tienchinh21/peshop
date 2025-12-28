"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Mail, ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { login, getCurrentUserFromAPI } from "../services";
import type { LoginRequest } from "../types";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { setAuthTokenCookie } from "@/lib/utils/cookies.utils";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import { useFormValidation } from "@/shared/hooks";
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
} from "@/shared/lib/validations/html5-patterns";
const LoginPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>("");
  const { errors, validate, clearError, clearAllErrors } = useFormValidation();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      clearError(name);
    }
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError("");
    }
  };
  const validateForm = () => {
    clearAllErrors();
    let isValid = true;

    // Validate email
    if (!formData.email.trim()) {
      validate("email", "", {
        required: true,
        custom: () => VALIDATION_MESSAGES.email.required,
      });
      isValid = false;
    } else if (
      !new RegExp(VALIDATION_PATTERNS.email, "i").test(formData.email)
    ) {
      validate("email", formData.email, {
        custom: () => VALIDATION_MESSAGES.email.pattern,
      });
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      validate("password", "", {
        required: true,
        custom: () => VALIDATION_MESSAGES.password.required,
      });
      isValid = false;
    } else if (formData.password.length < 6) {
      validate("password", formData.password, {
        custom: () => VALIDATION_MESSAGES.password.minLength,
      });
      isValid = false;
    }

    return isValid;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const credentials: LoginRequest = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };
      console.log("Attempting login with:", {
        email: credentials.email,
      });
      const response = await login(credentials);

      if (response.error) {
        const errorMessage = response.error || "Đăng nhập thất bại";
        console.error("Login failed with error:", errorMessage);
        toast.error(errorMessage);
        setGeneralError(errorMessage);
        return;
      }
      if (response.data) {
        const token = response.data;
        setAuthTokenCookie(token);
        const user = await getCurrentUserFromAPI();
        if (user) {
          dispatch(
            setCredentials({
              user,
              token,
            })
          );
          toast.success("Đăng nhập thành công!", {
            description: `Chào mừng ${user.name || user.username}`,
          });
          setTimeout(() => router.push("/"), 500);
        } else {
          console.error("Failed to get user info after login");
          toast.error("Không thể lấy thông tin người dùng");
          setGeneralError("Không thể lấy thông tin người dùng");
        }
      } else {
        console.error("No data in response");
        toast.error("Đăng nhập thất bại");
        setGeneralError("Đăng nhập thất bại");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to Home Button */}
      <Button
        variant="ghost"
        onClick={() => router.replace("/")}
        className="fixed top-4 left-4 z-50 gap-2 min-h-[44px] hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Về trang chủ</span>
      </Button>

      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <Image
                  src="/01.png"
                  alt="WebCore Incom - Hệ thống quản lý"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-2xl"
                  priority
                />
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Chào mừng đến với WebCore Incom
                  </h3>
                  <p className="text-gray-600">
                    Hệ thống quản lý hiện đại và chuyên nghiệp
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="space-y-8">
              {/* Login Card */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm py-6">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center text-gray-800">
                    ĐĂNG NHẬP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Error */}
                    {generalError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{generalError}</p>
                      </div>
                    )}

                    {/* Email Field */}
                    <FormField
                      id="email"
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="Nhập email của bạn"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      icon={<Mail className="h-4 w-4" />}
                      required
                      pattern={VALIDATION_PATTERNS.email}
                    />

                    {/* Password Field */}
                    <PasswordField
                      id="password"
                      name="password"
                      label="Mật khẩu"
                      placeholder="Nhập mật khẩu của bạn"
                      value={formData.password}
                      onChange={handleInputChange}
                      error={errors.password}
                      required
                    />

                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Ghi nhớ đăng nhập
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang đăng nhập...
                        </div>
                      ) : (
                        "Đăng nhập"
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          Hoặc
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Register Link */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Chưa có tài khoản?{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/dang-ky")}
                        className="text-primary hover:text-primary/80 font-medium cursor-pointer"
                      >
                        Đăng ký ngay
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
