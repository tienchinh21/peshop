"use client";

import React, { memo } from "react";
import { Store } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
interface BasicInfoSectionProps {
  name: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const BasicInfoSection = memo<BasicInfoSectionProps>(({
  name,
  error,
  onChange
}) => <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Store className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
      </div>
      <Separator />

      <div className="space-y-3">
        <Label htmlFor="name" className="text-sm font-medium">
          Tên cửa hàng <span className="text-destructive">*</span>
        </Label>
        <Input id="name" name="name" type="text" placeholder="VD: Pet Shop Hà Nội" value={name} onChange={onChange} className={error ? "border-destructive focus-visible:ring-destructive" : ""} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>);
BasicInfoSection.displayName = "BasicInfoSection";