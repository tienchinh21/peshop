"use client";

import React, { memo } from "react";
import { Upload, X, Camera } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";

interface AvatarUploadSectionProps {
  avatarPreview: string | null;
  avatarFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  error?: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  onUploadClick: () => void;
}

export const AvatarUploadSection = memo<AvatarUploadSectionProps>(
  ({
    avatarPreview,
    avatarFile,
    fileInputRef,
    error,
    onAvatarChange,
    onRemoveAvatar,
    onUploadClick,
  }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Logo cửa hàng</h3>
      </div>
      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Ảnh đại diện</Label>
        <div className="flex items-start gap-6">
          {avatarPreview ? (
            <div className="relative group">
              <div className="h-28 w-28 rounded-xl border-2 border-border overflow-hidden bg-muted">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={onRemoveAvatar}
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground shadow-md flex items-center justify-center hover:bg-destructive/90 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="h-28 w-28 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
              <Camera className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onUploadClick}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {avatarFile ? "Thay đổi ảnh" : "Tải ảnh lên"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Định dạng: PNG, JPG, JPEG. Kích thước tối đa: 5MB
            </p>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
);

AvatarUploadSection.displayName = "AvatarUploadSection";
