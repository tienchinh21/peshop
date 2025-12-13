"use client";

import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { cn } from "@/lib/utils";
import type { ImportResult } from "../../types/excel.types";

interface ImportResultDisplayProps {
  /** Import result to display */
  result: ImportResult;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component to display import results after an Excel import operation
 * Shows success message with count or error summary with details
 * @see Requirements 2.3, 2.4
 */
export function ImportResultDisplay({
  result,
  className,
}: ImportResultDisplayProps) {
  const { success, successCount, failedCount, errors, message } = result;

  // Fully successful import
  if (success && failedCount === 0) {
    return (
      <Alert
        className={cn(
          "border-green-500/50 bg-green-50 dark:bg-green-950/20",
          className
        )}
      >
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-700 dark:text-green-300">
          Import thành công
        </AlertTitle>
        <AlertDescription className="text-green-600 dark:text-green-400">
          Đã cập nhật thành công <strong>{successCount}</strong> bản ghi.
        </AlertDescription>
      </Alert>
    );
  }

  // Partial success (some succeeded, some failed)
  if (successCount > 0 && failedCount > 0) {
    return (
      <div className={cn("space-y-3", className)}>
        <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-300">
            Import hoàn tất với một số lỗi
          </AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-400">
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <strong>{successCount}</strong> thành công
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-600" />
                <strong>{failedCount}</strong> thất bại
              </span>
            </div>
          </AlertDescription>
        </Alert>

        {/* Error details */}
        {errors.length > 0 && <ErrorList errors={errors} />}
      </div>
    );
  }

  // Complete failure (all failed or no success)
  return (
    <div className={cn("space-y-3", className)}>
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Import thất bại</AlertTitle>
        <AlertDescription>
          {message || "Không thể import file. Vui lòng kiểm tra lại dữ liệu."}
          {failedCount > 0 && (
            <span className="block mt-1">
              <strong>{failedCount}</strong> bản ghi bị lỗi.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Error details */}
      {errors.length > 0 && <ErrorList errors={errors} />}
    </div>
  );
}

/**
 * Sub-component to display list of errors
 */
function ErrorList({ errors }: { errors: string[] }) {
  const MAX_VISIBLE_ERRORS = 10;
  const visibleErrors = errors.slice(0, MAX_VISIBLE_ERRORS);
  const remainingCount = errors.length - MAX_VISIBLE_ERRORS;

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Info className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Chi tiết lỗi</span>
      </div>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {visibleErrors.map((error, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-destructive">•</span>
            <span>{error}</span>
          </li>
        ))}
        {remainingCount > 0 && (
          <li className="text-xs italic mt-2">
            ... và {remainingCount} lỗi khác
          </li>
        )}
      </ul>
    </div>
  );
}
