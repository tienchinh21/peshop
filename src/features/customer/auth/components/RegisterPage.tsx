"use client";

import React, { useReducer, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { sendOtp, resendOtp, verifyOtp } from "../services";
import { useAuth } from "@/shared/hooks";
import { useCountdown, useFormValidation } from "@/shared/hooks";
import { registerReducer, initialState } from "./registerReducer";
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from "@/shared/lib/validations/html5-patterns";
const EmailVerificationStep = lazy(() => import("./EmailVerificationStep").then(module => ({
  default: module.EmailVerificationStep
})));
const RegistrationFormStep = lazy(() => import("./RegistrationFormStep").then(module => ({
  default: module.RegistrationFormStep
})));
const RegisterPage: React.FC = () => {
  const router = useRouter();
  const {
    register: registerUser
  } = useAuth();
  const [state, dispatch] = useReducer(registerReducer, initialState);
  const {
    countdown,
    start: startCountdown
  } = useCountdown();
  const {
    errors,
    validate,
    validateAll,
    clearError,
    clearAllErrors
  } = useFormValidation();
  const handleFieldChange = (field: string, value: string) => {
    dispatch({
      type: "SET_FIELD",
      field: field as keyof typeof state.formData,
      value
    });
    clearError(field);
  };
  const handleSendOtp = async () => {
    const isValid = validate("email", state.formData.email, {
      required: true,
      pattern: new RegExp(VALIDATION_PATTERNS.email)
    });
    if (!isValid) {
      return;
    }
    dispatch({
      type: "SET_SENDING_OTP",
      sending: true
    });
    try {
      const response = await sendOtp({
        email: state.formData.email
      });
      if (!response.error) {
        dispatch({
          type: "SET_OTP_SENT",
          sent: true
        });
        startCountdown(60);
        toast.success("Mã OTP đã được gửi đến email của bạn", {
          description: "Vui lòng kiểm tra hộp thư đến hoặc spam"
        });
      } else {
        toast.error(response.error || "Gửi OTP thất bại");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Gửi OTP thất bại. Vui lòng thử lại.");
    } finally {
      dispatch({
        type: "SET_SENDING_OTP",
        sending: false
      });
    }
  };
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    dispatch({
      type: "SET_SENDING_OTP",
      sending: true
    });
    try {
      const response = await resendOtp({
        email: state.formData.email
      });
      if (!response.error) {
        startCountdown(60);
        dispatch({
          type: "SET_FIELD",
          field: "otp",
          value: ""
        });
        toast.success("Mã OTP mới đã được gửi đến email của bạn", {
          description: "Vui lòng kiểm tra hộp thư đến hoặc spam"
        });
      } else {
        toast.error(response.error || "Gửi lại OTP thất bại");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Gửi lại OTP thất bại. Vui lòng thử lại.");
    } finally {
      dispatch({
        type: "SET_SENDING_OTP",
        sending: false
      });
    }
  };
  const handleVerifyOtp = async () => {
    if (!state.otpSent) {
      toast.error("Vui lòng gửi mã OTP trước");
      return;
    }
    const isValid = validate("otp", state.formData.otp, {
      required: true,
      pattern: new RegExp(VALIDATION_PATTERNS.otp)
    });
    if (!isValid) {
      toast.error("Vui lòng nhập mã OTP gồm 6 số");
      return;
    }
    dispatch({
      type: "SET_VERIFYING_OTP",
      verifying: true
    });
    try {
      const response = await verifyOtp({
        email: state.formData.email,
        otp: state.formData.otp
      });
      if (!response.error && response.data) {
        if (response.data.status) {
          dispatch({
            type: "SET_VERIFICATION_KEY",
            key: response.data.key
          });
          dispatch({
            type: "SET_STEP",
            step: 2
          });
          clearAllErrors();
          toast.success("Xác thực OTP thành công!");
        } else {
          toast.error("Mã OTP không đúng");
        }
      } else {
        toast.error(response.error || "Xác thực OTP thất bại");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Xác thực OTP thất bại. Vui lòng thử lại.");
    } finally {
      dispatch({
        type: "SET_VERIFYING_OTP",
        verifying: false
      });
    }
  };
  const handleBackToStep1 = () => {
    dispatch({
      type: "SET_STEP",
      step: 1
    });
    clearAllErrors();
  };
  const validateRegistrationForm = (): boolean => {
    const fieldsToValidate = {
      name: {
        value: state.formData.name,
        rules: {
          required: true,
          minLength: 2,
          pattern: new RegExp(VALIDATION_PATTERNS.name)
        }
      },
      username: {
        value: state.formData.username,
        rules: {
          required: true,
          minLength: 3,
          pattern: new RegExp(VALIDATION_PATTERNS.username)
        }
      },
      password: {
        value: state.formData.password,
        rules: {
          required: true,
          minLength: 6
        }
      },
      confirmPassword: {
        value: state.formData.confirmPassword,
        rules: {
          required: true,
          custom: (value: string) => {
            if (value !== state.formData.password) {
              return VALIDATION_MESSAGES.confirmPassword.match;
            }
            return null;
          }
        }
      }
    };
    return validateAll(fieldsToValidate);
  };
  const handleSubmit = async () => {
    if (!state.verificationKey) {
      toast.error("Vui lòng xác thực OTP trước khi đăng ký");
      return;
    }
    if (!validateRegistrationForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }
    dispatch({
      type: "SET_LOADING",
      loading: true
    });
    try {
      const result = await registerUser({
        name: state.formData.name.trim(),
        username: state.formData.username.trim(),
        password: state.formData.password,
        key: state.verificationKey
      });
      if (result.success) {
        setTimeout(() => router.push("/xac-thuc"), 1500);
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      dispatch({
        type: "SET_LOADING",
        loading: false
      });
    }
  };
  return <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <Image src="/01.png" alt="WebCore Incom - Đăng ký tài khoản" width={500} height={400} className="w-full h-auto rounded-2xl" priority />
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

          {}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-4 pb-6">
                <CardTitle className="text-2xl font-bold text-center text-gray-800">
                  Đăng ký tài khoản
                </CardTitle>

                {}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-4">
                    {}
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${state.currentStep === 1 ? "bg-primary text-white shadow-lg shadow-primary/30" : state.currentStep > 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                        {state.currentStep > 1 ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg> : "1"}
                      </div>
                      <span className={`text-sm font-medium hidden sm:block ${state.currentStep === 1 ? "text-primary" : state.currentStep > 1 ? "text-green-600" : "text-gray-500"}`}>
                        Xác thực Email
                      </span>
                    </div>

                    {}
                    <div className={`flex-1 h-1 rounded-full transition-all ${state.currentStep > 1 ? "bg-green-500" : "bg-gray-200"}`} style={{
                    maxWidth: "60px"
                  }} />

                    {}
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${state.currentStep === 2 ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-200 text-gray-500"}`}>
                        2
                      </div>
                      <span className={`text-sm font-medium hidden sm:block ${state.currentStep === 2 ? "text-primary" : "text-gray-500"}`}>
                        Thông tin cá nhân
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all duration-500 ease-out" style={{
                    width: `${state.currentStep / 2 * 100}%`
                  }} />
                  </div>

                  {}
                  <p className="text-center text-sm text-gray-600">
                    {state.currentStep === 1 ? "Nhập email và xác thực mã OTP" : "Hoàn thiện thông tin để tạo tài khoản"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Suspense fallback={<div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>}>
                  {state.currentStep === 1 ? <EmailVerificationStep email={state.formData.email} otp={state.formData.otp} otpSent={state.otpSent} countdown={countdown} isSendingOtp={state.isSendingOtp} isVerifyingOtp={state.isVerifyingOtp} errors={errors} onEmailChange={value => handleFieldChange("email", value)} onOtpChange={value => handleFieldChange("otp", value)} onSendOtp={handleSendOtp} onResendOtp={handleResendOtp} onVerifyOtp={handleVerifyOtp} /> : <RegistrationFormStep email={state.formData.email} username={state.formData.username} name={state.formData.name} password={state.formData.password} confirmPassword={state.formData.confirmPassword} errors={errors} isLoading={state.isLoading} onFieldChange={handleFieldChange} onSubmit={handleSubmit} onBack={handleBackToStep1} />}
                </Suspense>

                {}
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

                {}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <button type="button" onClick={() => router.push("/xac-thuc")} className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer">
                      Đăng nhập ngay
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default RegisterPage;