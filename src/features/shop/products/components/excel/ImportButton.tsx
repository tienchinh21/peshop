"use client";

import { Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface ImportButtonProps {
  /** Callback when import button is clicked */
  onClick: () => void;
}

/**
 * Button component for importing products from Excel
 * Opens the import modal when clicked
 * @see Requirements 4.1, 4.4
 */
export function ImportButton({ onClick }: ImportButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm" onClick={onClick}>
          <Upload className="h-4 w-4" />
          Nhập Excel
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Nhập file Excel để cập nhật sản phẩm</p>
      </TooltipContent>
    </Tooltip>
  );
}
