/**
 * Hook for importing products from Excel file
 * @see Requirements 2.1, 2.3, 2.5
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importProducts, parseImportResponse } from "../services/excel.service";
import type { ImportResult } from "../types/excel.types";
import { shopProductKeys } from "./useShopProducts";

/**
 * Hook to import products from Excel file
 * 
 * Features:
 * - useMutation for import operation
 * - Loading state via isPending
 * - Returns parsed ImportResult with success/failed counts
 * - Invalidates product list cache on success
 * 
 * @returns Mutation object with mutate function, loading state, and parsed result
 * 
 * @example
 * const { mutate: importFromExcel, isPending, data: result } = useImportProducts();
 * 
 * const handleImport = (file: File) => {
 *   importFromExcel(file, {
 *     onSuccess: (result) => {
 *       if (result.success) {
 *         console.log("Import successful:", result.successCount);
 *       } else {
 *         console.log("Import had errors:", result.errors);
 *       }
 *     }
 *   });
 * };
 */
export const useImportProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<ImportResult> => {
      const response = await importProducts(file);
      return parseImportResponse(response);
    },
    onSuccess: (result) => {
      // Invalidate product list cache to refresh data
      if (result.successCount > 0) {
        queryClient.invalidateQueries({
          queryKey: shopProductKeys.lists(),
        });
      }
    },
  });
};
