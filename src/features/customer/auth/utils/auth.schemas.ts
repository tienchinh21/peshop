import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email là bắt buộc")
  .email("Email không hợp lệ")
  .max(255, "Email không được quá 255 ký tự");
export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .max(128, "Mật khẩu không được quá 128 ký tự")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
  );

export const otpSchema = z
  .string()
  .min(6, "OTP phải có 6 ký tự")
  .max(6, "OTP phải có 6 ký tự")
  .regex(/^\d{6}$/, "OTP chỉ được chứa số");

export const usernameSchema = z
  .string()
  .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
  .max(50, "Tên đăng nhập không được quá 50 ký tự")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
  );

export const nameSchema = z
  .string()
  .min(2, "Họ tên phải có ít nhất 2 ký tự")
  .max(100, "Họ tên không được quá 100 ký tự")
  .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ tên chỉ được chứa chữ cái và khoảng trắng");

export const phoneSchema = z
  .string()
  .min(10, "Số điện thoại phải có ít nhất 10 số")
  .max(15, "Số điện thoại không được quá 15 số")
  .regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ");

export const genderSchema = z
  .number()
  .int()
  .min(0, "Giới tính không hợp lệ")
  .max(2, "Giới tính không hợp lệ"); // 0: female, 1: male, 2: other

export const emailVerificationSchema = z.object({
  email: emailSchema,
});

export const otpVerificationSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const registrationSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    otp: otpSchema,
    gender: genderSchema,
    name: nameSchema,
    phone: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// ============ Type Exports ============

export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ============ Validation Helpers ============

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

/**
 * Validate OTP format
 */
export const validateOtp = (otp: string): boolean => {
  return otpSchema.safeParse(otp).success;
};
