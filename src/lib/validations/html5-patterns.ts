/**
 * HTML5 Validation Patterns and Messages
 * 
 * This file contains regex patterns and Vietnamese error messages for form validation.
 * Used to replace Zod validation with native HTML5 validation attributes.
 */

/**
 * Validation regex patterns for form fields
 */
export const VALIDATION_PATTERNS = {
  email: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
  password: ".{6,}", // Minimum 6 characters
  username: "[a-zA-Z0-9_]{3,50}",
  name: "[a-zA-ZÀ-ỹ\\s]{2,100}",
  otp: "\\d{6}",
} as const;

/**
 * Vietnamese error messages for validation
 * Organized by field and validation type
 */
export const VALIDATION_MESSAGES = {
  email: {
    required: "Email là bắt buộc",
    pattern: "Email không hợp lệ",
  },
  password: {
    required: "Mật khẩu là bắt buộc",
    minLength: "Mật khẩu phải có ít nhất 6 ký tự",
  },
  username: {
    required: "Tên đăng nhập là bắt buộc",
    minLength: "Tên đăng nhập phải có ít nhất 3 ký tự",
    pattern: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
  },
  name: {
    required: "Họ và tên là bắt buộc",
    minLength: "Họ và tên phải có ít nhất 2 ký tự",
  },
  otp: {
    required: "Mã OTP là bắt buộc",
    pattern: "Mã OTP phải có 6 số",
  },
  confirmPassword: {
    required: "Vui lòng xác nhận mật khẩu",
    match: "Mật khẩu xác nhận không khớp",
  },
} as const;
