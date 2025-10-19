"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  sendOtp,
  resendOtp,
  verifyOtp,
} from "@/services/api/users/auth.service";
import { useAuth } from "@/hooks/useAuth";
import {
  emailVerificationSchema,
  validateOtp,
} from "@/lib/validations/auth.schemas";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    otp: "",
  });
  const [verificationKey, setVerificationKey] = useState<string>(""); // Key từ verify OTP
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0); // Countdown timer for resend OTP (in seconds)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Countdown effect for resend OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Họ và tên không được để trống";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Họ và tên phải có ít nhất 2 ký tự";
    }

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Step 1: Send OTP
  const handleSendOtp = async () => {
    // Validate email using zod schema
    const emailResult = emailVerificationSchema.safeParse({
      email: formData.email,
    });

    if (!emailResult.success) {
      const emailError = emailResult.error.issues[0]?.message;
      setErrors({ email: emailError || "Email không hợp lệ" });
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await sendOtp({ email: formData.email });
      if (!response.error) {
        setOtpSent(true);
        setCountdown(60); // Start 60 second countdown
        toast.success("Mã OTP đã được gửi đến email của bạn", {
          description: "Vui lòng kiểm tra hộp thư đến hoặc spam",
        });
      } else {
        toast.error(response.error || "Gửi OTP thất bại");
        setErrors({ general: response.error || "Gửi OTP thất bại" });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Gửi OTP thất bại. Vui lòng thử lại.");
      setErrors({ general: "Gửi OTP thất bại. Vui lòng thử lại." });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return; // Prevent resend if countdown is still active

    setIsSendingOtp(true);
    try {
      const response = await resendOtp({ email: formData.email });
      if (!response.error) {
        setCountdown(60); // Reset countdown to 60 seconds
        setFormData((prev) => ({ ...prev, otp: "" })); // Clear OTP input
        toast.success("Mã OTP mới đã được gửi đến email của bạn", {
          description: "Vui lòng kiểm tra hộp thư đến hoặc spam",
        });
      } else {
        toast.error(response.error || "Gửi lại OTP thất bại");
        setErrors({ general: response.error || "Gửi lại OTP thất bại" });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Gửi lại OTP thất bại. Vui lòng thử lại.");
      setErrors({ general: "Gửi lại OTP thất bại. Vui lòng thử lại." });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      otp: value,
    }));
    // Clear OTP error when user starts typing
    if (errors.otp) {
      setErrors((prev) => ({
        ...prev,
        otp: "",
      }));
    }
  };

  // Handle Step 1 completion: Verify OTP and proceed to Step 2
  const handleProceedToStep2 = async () => {
    if (!otpSent) {
      toast.error("Vui lòng gửi mã OTP trước");
      return;
    }

    // Validate OTP using helper function
    if (!validateOtp(formData.otp)) {
      toast.error("Vui lòng nhập mã OTP gồm 6 số");
      setErrors({ otp: "Mã OTP phải có 6 số" });
      return;
    }

    // Verify OTP with backend
    setIsVerifyingOtp(true);
    try {
      const response = await verifyOtp({
        email: formData.email,
        otp: formData.otp,
      });

      if (!response.error && response.data) {
        if (response.data.status) {
          // OTP verified successfully, save the key
          setVerificationKey(response.data.key);
          setCurrentStep(2);
          setErrors({}); // Clear errors when moving to next step
          toast.success("Xác thực OTP thành công!");
        } else {
          toast.error("Mã OTP không đúng");
          setErrors({ otp: "Mã OTP không đúng" });
        }
      } else {
        toast.error(response.error || "Xác thực OTP thất bại");
        setErrors({ otp: response.error || "Xác thực OTP thất bại" });
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Xác thực OTP thất bại. Vui lòng thử lại.");
      setErrors({ otp: "Xác thực OTP thất bại. Vui lòng thử lại." });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle back to Step 1
  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setErrors({}); // Clear errors when going back
  };

  // Handle Step 2: Complete registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationKey) {
      toast.error("Vui lòng xác thực OTP trước khi đăng ký");
      return;
    }

    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi register từ useAuth hook
      const result = await registerUser({
        name: formData.name.trim(),
        username: formData.username.trim(),
        password: formData.password,
        key: verificationKey, // Key từ verify OTP
      });

      if (result.success) {
        // Toast đã được hiển thị trong hook
        // Redirect to login page after successful registration
        setTimeout(() => router.push("/xac-thuc"), 1500);
      } else {
        setErrors({
          general: result.error || "Đăng ký thất bại. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <Image
                  src="/01.png"
                  alt="WebCore Incom - Đăng ký tài khoản"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-2xl"
                  priority
                />
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Đăng ký tài khoản mới
                  </h3>
                  <p className="text-gray-600">
                    Tham gia hệ thống quản lý chuyên nghiệp ngay hôm nay
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Register Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-4 pb-6">
                <CardTitle className="text-2xl font-bold text-center text-gray-800">
                  Đăng ký tài khoản
                </CardTitle>

                {/* Step Indicator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-4">
                    {/* Step 1 */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                          currentStep === 1
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : currentStep > 1
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {currentStep > 1 ? (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          "1"
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium hidden sm:block ${
                          currentStep === 1
                            ? "text-primary"
                            : currentStep > 1
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        Xác thực Email
                      </span>
                    </div>

                    {/* Divider */}
                    <div
                      className={`flex-1 h-1 rounded-full transition-all ${
                        currentStep > 1 ? "bg-green-500" : "bg-gray-200"
                      }`}
                      style={{ maxWidth: "60px" }}
                    />

                    {/* Step 2 */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                          currentStep === 2
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        2
                      </div>
                      <span
                        className={`text-sm font-medium hidden sm:block ${
                          currentStep === 2 ? "text-primary" : "text-gray-500"
                        }`}
                      >
                        Thông tin cá nhân
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all duration-500 ease-out"
                      style={{ width: `${(currentStep / 2) * 100}%` }}
                    />
                  </div>

                  {/* Step Description */}
                  <p className="text-center text-sm text-gray-600">
                    {currentStep === 1
                      ? "Nhập email và xác thực mã OTP"
                      : "Hoàn thiện thông tin để tạo tài khoản"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {currentStep === 1 ? (
                  // Step 1: Email & OTP
                  <div className="space-y-4">
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
                        Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={otpSent}
                          className={`pl-10 h-11 text-sm ${
                            errors.email
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          } ${otpSent ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* OTP Input - Show after email sent */}
                    {otpSent && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="otp"
                          className="text-sm font-medium text-gray-700"
                        >
                          Mã OTP *
                        </Label>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={formData.otp}
                            onChange={handleOtpChange}
                            autoFocus={true}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        {errors.otp && (
                          <p className="text-sm text-red-600 text-center">
                            {errors.otp}
                          </p>
                        )}
                        <p className="text-xs text-center text-gray-500">
                          {countdown > 0
                            ? `Bạn có thể gửi lại mã sau ${countdown}s`
                            : "Không nhận được mã?"}
                        </p>
                      </div>
                    )}

                    {!otpSent ? (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !formData.email}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {isSendingOtp ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang gửi OTP...
                          </div>
                        ) : (
                          "Gửi mã OTP"
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isSendingOtp || countdown > 0}
                          variant="outline"
                          className="w-full"
                        >
                          {isSendingOtp ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                              Đang gửi lại...
                            </div>
                          ) : countdown > 0 ? (
                            `Gửi lại mã OTP (${countdown}s)`
                          ) : (
                            "Gửi lại mã OTP"
                          )}
                        </Button>
                        <Button
                          type="button"
                          onClick={handleProceedToStep2}
                          disabled={
                            !formData.otp ||
                            formData.otp.length < 6 ||
                            isVerifyingOtp
                          }
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        >
                          {isVerifyingOtp ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Đang xác thực...
                            </div>
                          ) : (
                            "Tiếp tục"
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  // Step 2: Complete Registration Form
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* General Error */}
                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                        <p className="text-xs text-red-600">{errors.general}</p>
                      </div>
                    )}

                    {/* Email display (read-only) */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">
                        Email đã xác thực
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 font-medium">
                          ✓ {formData.email}
                        </div>
                      </div>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="username"
                        className="text-xs font-medium text-gray-700"
                      >
                        Tên đăng nhập *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="Tên đăng nhập"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={`pl-10 h-9 text-sm ${
                            errors.username
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      {errors.username && (
                        <p className="text-xs text-red-600">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Name Field */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="name"
                        className="text-xs font-medium text-gray-700"
                      >
                        Họ và tên *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Họ và tên"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`h-9 text-sm ${
                          errors.name ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Password & Confirm Password Fields - Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Password Field */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="password"
                          className="text-xs font-medium text-gray-700"
                        >
                          Mật khẩu *
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`pl-10 pr-10 h-9 text-sm ${
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
                          <p className="text-xs text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-xs font-medium text-gray-700"
                        >
                          Xác nhận mật khẩu *
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`pl-10 pr-10 h-9 text-sm ${
                              errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-xs text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        onClick={handleBackToStep1}
                        variant="outline"
                        className="flex-1 h-10"
                      >
                        Quay lại
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-10 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang đăng ký...
                          </div>
                        ) : (
                          "Hoàn tất đăng ký"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Divider */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Hoặc</span>
                    </div>
                  </div>
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/xac-thuc")}
                      className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                    >
                      Đăng nhập ngay
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
