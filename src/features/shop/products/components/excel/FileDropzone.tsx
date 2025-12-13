"use client";

import { useCallback, useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { isValidExcelFile, formatFileSize } from "../../utils/excel.utils";

interface FileDropzoneProps {
  /** Callback when a valid file is selected */
  onFileSelect: (file: File) => void;
  /** Callback when file is cleared */
  onFileClear?: () => void;
  /** Currently selected file */
  selectedFile: File | null;
  /** Whether the dropzone is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string | null;
}

export function FileDropzone({
  onFileSelect,
  onFileClear,
  selectedFile,
  disabled = false,
  error,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const validateAndSelectFile = useCallback(
    (file: File) => {
      setValidationError(null);

      if (!isValidExcelFile(file)) {
        setValidationError("Chỉ chấp nhận file Excel (.xlsx, .xls)");
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        validateAndSelectFile(files[0]);
      }
    },
    [disabled, validateAndSelectFile]
  );

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        validateAndSelectFile(files[0]);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [validateAndSelectFile]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClearFile = useCallback(() => {
    setValidationError(null);
    onFileClear?.();
  }, [onFileClear]);

  const displayError = validationError || error;

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Dropzone area */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "cursor-not-allowed opacity-50",
            displayError && "border-destructive/50"
          )}
        >
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              isDragOver ? "bg-primary/10" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-7 w-7",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">Kéo thả file Excel vào đây</p>
            <p className="text-xs text-muted-foreground mt-1">
              hoặc click để chọn file
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            disabled={disabled}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Chọn file Excel
          </Button>

          <p className="text-xs text-muted-foreground">
            Chỉ chấp nhận file .xlsx hoặc .xls
          </p>
        </div>
      ) : (
        /* Selected file display */
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
            <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleClearFile}
            disabled={disabled}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Xóa file</span>
          </Button>
        </div>
      )}

      {/* Error message */}
      {displayError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
