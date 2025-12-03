"use client";

import { useState, useCallback } from "react";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface UseFormValidationReturn {
  errors: Record<string, string>;
  validate: (name: string, value: string, rules: ValidationRule) => boolean;
  validateAll: (
    fields: Record<string, { value: string; rules: ValidationRule }>
  ) => boolean;
  clearError: (name: string) => void;
  clearAllErrors: () => void;
}

// Vietnamese error messages
const getErrorMessage = (
  fieldName: string,
  rule: keyof ValidationRule,
  ruleValue?: number | RegExp
): string => {
  const messages: Record<string, Record<string, string>> = {
    email: {
      required: "Email là bắt buộc",
      pattern: "Email không hợp lệ",
    },
    password: {
      required: "Mật khẩu là bắt buộc",
      minLength: `Mật khẩu phải có ít nhất ${ruleValue} ký tự`,
    },
    confirmPassword: {
      required: "Vui lòng xác nhận mật khẩu",
      custom: "Mật khẩu xác nhận không khớp",
    },
    username: {
      required: "Tên đăng nhập là bắt buộc",
      minLength: `Tên đăng nhập phải có ít nhất ${ruleValue} ký tự`,
      pattern: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
    },
    name: {
      required: "Họ và tên là bắt buộc",
      minLength: `Họ và tên phải có ít nhất ${ruleValue} ký tự`,
    },
    otp: {
      required: "Mã OTP là bắt buộc",
      pattern: "Mã OTP phải có 6 số",
      minLength: "Mã OTP phải có 6 số",
    },
  };

  // Return field-specific message or generic message
  if (messages[fieldName]?.[rule]) {
    return messages[fieldName][rule];
  }

  // Generic messages
  switch (rule) {
    case "required":
      return "Trường này là bắt buộc";
    case "minLength":
      return `Phải có ít nhất ${ruleValue} ký tự`;
    case "maxLength":
      return `Không được vượt quá ${ruleValue} ký tự`;
    case "pattern":
      return "Định dạng không hợp lệ";
    default:
      return "Giá trị không hợp lệ";
  }
};

export const useFormValidation = (): UseFormValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (name: string, value: string, rules: ValidationRule): boolean => {
      // Check required
      if (rules.required && !value.trim()) {
        const errorMsg = getErrorMessage(name, "required");
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
        return false;
      }

      // Check minLength
      if (rules.minLength && value.length < rules.minLength) {
        const errorMsg = getErrorMessage(name, "minLength", rules.minLength);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
        return false;
      }

      // Check maxLength
      if (rules.maxLength && value.length > rules.maxLength) {
        const errorMsg = getErrorMessage(name, "maxLength", rules.maxLength);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
        return false;
      }

      // Check pattern
      if (rules.pattern && !rules.pattern.test(value)) {
        const errorMsg = getErrorMessage(name, "pattern", rules.pattern);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
        return false;
      }

      // Check custom validation
      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          setErrors((prev) => ({ ...prev, [name]: customError }));
          return false;
        }
      }

      // Clear error if validation passes
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      return true;
    },
    []
  );

  const validateAll = useCallback(
    (
      fields: Record<string, { value: string; rules: ValidationRule }>
    ): boolean => {
      let isValid = true;
      const newErrors: Record<string, string> = {};

      Object.entries(fields).forEach(([name, { value, rules }]) => {
        // Check required
        if (rules.required && !value.trim()) {
          newErrors[name] = getErrorMessage(name, "required");
          isValid = false;
          return;
        }

        // Check minLength
        if (rules.minLength && value.length < rules.minLength) {
          newErrors[name] = getErrorMessage(name, "minLength", rules.minLength);
          isValid = false;
          return;
        }

        // Check maxLength
        if (rules.maxLength && value.length > rules.maxLength) {
          newErrors[name] = getErrorMessage(name, "maxLength", rules.maxLength);
          isValid = false;
          return;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
          newErrors[name] = getErrorMessage(name, "pattern", rules.pattern);
          isValid = false;
          return;
        }

        // Check custom validation
        if (rules.custom) {
          const customError = rules.custom(value);
          if (customError) {
            newErrors[name] = customError;
            isValid = false;
            return;
          }
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    []
  );

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    validateAll,
    clearError,
    clearAllErrors,
  };
};
