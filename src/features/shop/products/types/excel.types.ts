/**
 * Types for Product Excel Import/Export functionality
 * @see Requirements 2.3, 2.4
 */

/**
 * Parsed import result for frontend display
 * Used to show success/error summary after import operation
 */
export interface ImportResult {
  /** Whether the import was fully successful (no errors) */
  success: boolean;
  /** Number of successfully imported/updated records */
  successCount: number;
  /** Number of failed records */
  failedCount: number;
  /** List of error messages for failed rows */
  errors: string[];
  /** Summary message for the import operation */
  message: string;
}

/**
 * API response structure from POST /shop/product/import
 * Backend returns this format for import operations
 */
export interface ImportApiResponse {
  error: {
    message: string;
    exception: string;
  } | null;
  content: null;
}
