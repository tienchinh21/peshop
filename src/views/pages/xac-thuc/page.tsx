"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  login,
  getCurrentUserFromAPI,
} from "@/services/api/users/auth.service";
import type { LoginRequest } from "@/types/users/auth.types";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schemas";
import { setAuthTokenCookie } from "@/lib/utils/cookies.utils";

const LoginPageComponent: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const credentials: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };

      const response = await login(credentials);

      if (response.error) {
        const errorMessage = response.error || "Đăng nhập thất bại";
        toast.error(errorMessage);
        setErrors({
          general: errorMessage,
        });
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
          toast.error("Không thể lấy thông tin người dùng");
          setErrors({
            general: "Không thể lấy thông tin người dùng",
          });
        }
      } else {
        toast.error("Đăng nhập thất bại");
        setErrors({
          general: "Đăng nhập thất bại",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
              {/* Login Form */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm py-6">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center text-gray-800">
                    ĐĂNG NHẬP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Error */}
                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{errors.general}</p>
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Nhập email của bạn"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`pl-10 ${
                            errors.email
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Mật khẩu
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu của bạn"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`pl-10 pr-10 ${
                            errors.password
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
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
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

export default LoginPageComponent;
