"use client";

import React, { memo } from "react";
import { Phone, Mail } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
interface ContactInfoSectionProps {
  phone: string;
  email: string;
  phoneError?: string;
  emailError?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const ContactInfoSection = memo<ContactInfoSectionProps>(({
  phone,
  email,
  phoneError,
  emailError,
  onChange
}) => <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Phone className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
      </div>
      <Separator />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="phone" className="text-sm font-medium">
            Số điện thoại <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="phone" name="phone" type="tel" placeholder="0123456789" value={phone} onChange={onChange} className={`pl-10 ${phoneError ? "border-destructive focus-visible:ring-destructive" : ""}`} />
          </div>
          {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
          <p className="text-xs text-muted-foreground">
            Số điện thoại từ tài khoản của bạn
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="email" name="email" type="email" placeholder="shop@example.com" value={email} onChange={onChange} className={`pl-10 ${emailError ? "border-destructive focus-visible:ring-destructive" : ""}`} />
          </div>
          {emailError && <p className="text-sm text-destructive">{emailError}</p>}
          <p className="text-xs text-muted-foreground">
            Email từ tài khoản của bạn
          </p>
        </div>
      </div>
    </div>);
ContactInfoSection.displayName = "ContactInfoSection";