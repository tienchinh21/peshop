"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface ExportButtonProps {
  /** Callback when export is triggered */
  onExport: () => void;
  /** Whether export is in progress */
  isLoading: boolean;
}

/**
 * Button component for exporting products to Excel
 * Displays loading state and tooltip with description
 * @see Requirements 4.1, 4.3, 1.5
 */
export function ExportButton({ onExport, isLoading }: ExportButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xuất...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Xuất Excel
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Xuất danh sách sản phẩm ra file Excel</p>
      </TooltipContent>
    </Tooltip>
  );
}
