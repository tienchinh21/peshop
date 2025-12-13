/**
 * Excel utility functions for product import/export
 */

/**
 * Valid Excel file extensions
 */
const VALID_EXCEL_EXTENSIONS = [".xlsx", ".xls"];

/**
 * Validates if a file is a valid Excel file based on its extension
 * @param file - The file to validate
 * @returns true if the file has a valid Excel extension (.xlsx or .xls)
 */
export function isValidExcelFile(file: File): boolean {
  if (!file || !file.name) {
    return false;
  }

  const fileName = file.name.toLowerCase();
  return VALID_EXCEL_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - The file size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "500 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0 || !Number.isFinite(bytes)) {
    return "0 B";
  }

  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const base = 1024;

  // Find the appropriate unit
  let unitIndex = 0;
  let size = bytes;

  while (size >= base && unitIndex < units.length - 1) {
    size /= base;
    unitIndex++;
  }

  // Format with appropriate decimal places
  // No decimals for bytes, 1 decimal for KB, 2 decimals for MB and above
  const decimals = unitIndex === 0 ? 0 : unitIndex === 1 ? 1 : 2;

  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}
