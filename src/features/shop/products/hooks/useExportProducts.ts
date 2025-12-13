/**
 * Hook for exporting shop products to Excel
 * @see Requirements 1.1, 1.5
 */

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { exportProducts, downloadBlob } from "../services/excel.service";

/**
 * Hook to export all shop products to Excel file
 * 
 * Features:
 * - useMutation for export operation
 * - Loading state via isPending
 * - Error handling with toast notifications
 * - Auto-download on success
 * 
 * @returns Mutation object with mutate function and loading state
 * 
 * @example
 * const { mutate: exportToExcel, isPending } = useExportProducts();
 * 
 * <Button onClick={() => exportToExcel()} disabled={isPending}>
 *   {isPending ? "Đang xuất..." : "Xuất Excel"}
 * </Button>
 */
export const useExportProducts = () => {
  return useMutation({
    mutationFn: exportProducts,
    onSuccess: (blob) => {
      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `products_${date}.xlsx`;
      
      // Trigger file download
      downloadBlob(blob, filename);
      
      toast.success("Xuất file Excel thành công");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || "Không thể xuất file. Vui lòng thử lại.";
      toast.error(errorMessage);
    },
  });
};
