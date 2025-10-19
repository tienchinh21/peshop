import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format số tiền với dấu ngăn c        ách hàng trăm, hàng ngàn
 * @param amount - Số tiền cần format
 * @param currency - Ký hiệu tiền tệ (mặc định: "₫")
 * @returns Chuỗi tiền đã được format
 *
 * @example
 * formatCurrency(1000000) // "1.000.000 ₫"
 * formatCurrency(1500000, "VND") // "1.500.000 VND"
 * formatCurrency(0) // "0 ₫"
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "₫"
): string {
  // Chuyển đổi thành số nếu là string
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  // Kiểm tra nếu không phải số hợp lệ
  if (isNaN(numAmount)) {
    return `0 ${currency}`;
  }

  // Format số với dấu chấm ngăn cách hàng nghìn
  const formattedNumber = numAmount.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formattedNumber} ${currency}`;
}

/**
 * Format số tiền không có ký hiệu tiền tệ
 * @param amount - Số tiền cần format
 * @returns Chuỗi số đã được format
 *
 * @example
 * formatNumber(1000000) // "1.000.000"
 * formatNumber(1500000.5) // "1.500.000"
 */
export function formatNumber(amount: number | string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "0";
  }

  return numAmount.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format số tiền cho input field (chỉ số, không có ký hiệu tiền tệ)
 * @param amount - Số tiền cần format
 * @returns Chuỗi số đã được format cho input
 *
 * @example
 * formatInputCurrency(1000000) // "1.000.000"
 * formatInputCurrency("1500000") // "1.500.000"
 */
export function formatInputCurrency(amount: number | string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "";
  }

  return numAmount.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Parse số tiền từ input đã format (loại bỏ dấu chấm)
 * @param formattedAmount - Chuỗi tiền đã format
 * @returns Số tiền gốc
 *
 * @example
 * parseInputCurrency("1.000.000") // 1000000
 * parseInputCurrency("1.500.000") // 1500000
 */
export function parseInputCurrency(formattedAmount: string): number {
  if (!formattedAmount) return 0;

  // Loại bỏ tất cả dấu chấm và khoảng trắng
  const cleanAmount = formattedAmount.replace(/[.\s]/g, "");
  const numAmount = parseFloat(cleanAmount);

  return isNaN(numAmount) ? 0 : numAmount;
}
