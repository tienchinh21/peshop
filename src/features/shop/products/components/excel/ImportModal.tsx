"use client";

import { useState, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { ImportInstructions } from "./ImportInstructions";
import { FileDropzone } from "./FileDropzone";
import { ImportResultDisplay } from "./ImportResultDisplay";
import type { ImportResult } from "../../types/excel.types";

interface ImportModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when import is triggered with selected file */
  onImport: (file: File) => void;
  /** Whether import is in progress */
  isLoading: boolean;
  /** Import result to display (null if no import has been done yet) */
  result: ImportResult | null;
  /** Error message from import operation */
  error?: string | null;
}

/**
 * Modal dialog for importing products from Excel file
 * Contains instructions, file dropzone, and result display
 * @see Requirements 4.2, 5.1, 5.5
 */
export function ImportModal({
  isOpen,
  onClose,
  onImport,
  isLoading,
  result,
  error,
}: ImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleFileClear = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleImport = useCallback(() => {
    if (selectedFile) {
      onImport(selectedFile);
    }
  }, [selectedFile, onImport]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        // Reset state when closing
        setSelectedFile(null);
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import sản phẩm từ Excel
          </DialogTitle>
          <DialogDescription>
            Cập nhật hàng loạt thông tin sản phẩm bằng file Excel
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Instructions section */}
          <ImportInstructions />

          {/* File dropzone */}
          <div>
            <h4 className="font-medium mb-3">Chọn file để import</h4>
            <FileDropzone
              onFileSelect={handleFileSelect}
              onFileClear={handleFileClear}
              selectedFile={selectedFile}
              disabled={isLoading}
              error={error}
            />
          </div>

          {/* Import result display */}
          {result && <ImportResultDisplay result={result} />}
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            {result ? "Đóng" : "Hủy"}
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang import...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
