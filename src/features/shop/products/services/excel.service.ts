/**
 * Excel Import/Export Service for Shop Products
 * @see Requirements 1.1, 2.1, 2.3, 2.4
 */

import { axiosJava, axiosJavaFormData } from "@/lib/config/axios.config";
import type { ImportResult, ImportApiResponse } from "../types/excel.types";

/**
 * Export all shop products to Excel file
 * Calls GET /shop/product/export and returns the file as Blob
 * @returns Promise<Blob> - Excel file blob
 * @see Requirements 1.1
 */
export const exportProducts = async (): Promise<Blob> => {
  const response = await axiosJava.get("/shop/product/export", {
    responseType: "blob",
  });
  return response.data;
};

/**
 * Import Excel file to update products
 * Calls POST /shop/product/import with FormData
 * @param file - Excel file (.xlsx or .xls)
 * @returns Promise<ImportApiResponse> - API response with error details if any
 * @see Requirements 2.1
 */
export const importProducts = async (file: File): Promise<ImportApiResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosJavaFormData("/shop/product/import", formData, "POST");
  return response as ImportApiResponse;
};

/**
 * Parse import API response message into structured ImportResult
 * Backend returns error message in format:
 * "Import completed with errors. Success: 5, Failed: 2. Errors: Row 3: Invalid Price format; Row 7: Variant does not belong to this product"
 * 
 * @param response - API response from import endpoint
 * @returns ImportResult - Parsed result with success/failed counts and error details
 * @see Requirements 2.3, 2.4
 */
export const parseImportResponse = (response: ImportApiResponse): ImportResult => {
  // If no error, import was fully successful
  if (!response.error) {
    return {
      success: true,
      successCount: 0,
      failedCount: 0,
      errors: [],
      message: "Import thành công!",
    };
  }

  const errorMessage = response.error.message || "";

  // Try to parse success/failed counts from message
  // Format: "Import completed with errors. Success: 5, Failed: 2. Errors: ..."
  const successMatch = errorMessage.match(/Success:\s*(\d+)/i);
  const failedMatch = errorMessage.match(/Failed:\s*(\d+)/i);

  const successCount = successMatch ? parseInt(successMatch[1], 10) : 0;
  const failedCount = failedMatch ? parseInt(failedMatch[1], 10) : 0;

  // Extract error details after "Errors:" 
  // Format: "Errors: Row 3: Invalid Price format; Row 7: Variant does not belong to this product"
  const errorsMatch = errorMessage.match(/Errors?:\s*(.+)$/i);
  let errors: string[] = [];

  if (errorsMatch && errorsMatch[1]) {
    // Split by semicolon and trim each error
    errors = errorsMatch[1]
      .split(";")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
  }

  // Determine summary message
  let message: string;
  if (successCount > 0 && failedCount > 0) {
    message = `Import hoàn tất với một số lỗi. Thành công: ${successCount}, Thất bại: ${failedCount}`;
  } else if (successCount > 0) {
    message = `Import thành công ${successCount} bản ghi`;
  } else if (failedCount > 0) {
    message = `Import thất bại. ${failedCount} bản ghi có lỗi`;
  } else {
    // Fallback to original message if we couldn't parse counts
    message = errorMessage || "Import thất bại";
  }

  return {
    success: failedCount === 0 && successCount > 0,
    successCount,
    failedCount,
    errors,
    message,
  };
};

/**
 * Helper function to download a Blob as a file
 * Creates a temporary link and triggers download
 * 
 * @param blob - File blob to download
 * @param filename - Name for the downloaded file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  // Create object URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create temporary link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append to body, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke the object URL to free memory
  window.URL.revokeObjectURL(url);
};
