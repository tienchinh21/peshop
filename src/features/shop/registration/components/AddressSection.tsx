"use client";

import React, { memo } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import type { AddressSelection } from "@/shared/components/layout/AddressSelectModal";
interface AddressSectionProps {
  streetLine: string;
  selectedAddress: AddressSelection | null;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenModal: () => void;
}
export const AddressSection = memo<AddressSectionProps>(({
  streetLine,
  selectedAddress,
  error,
  onChange,
  onOpenModal
}) => <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Địa chỉ</h3>
      </div>
      <Separator />

      <div className="space-y-3">
        <Label htmlFor="streetLine" className="text-sm font-medium">
          Địa chỉ cửa hàng <span className="text-destructive">*</span>
        </Label>
        <div className="space-y-3">
          <Input id="streetLine" name="streetLine" type="text" placeholder="Số nhà, tên đường" value={streetLine} onChange={onChange} className={error ? "border-destructive focus-visible:ring-destructive" : ""} />
          <Button type="button" variant="outline" onClick={onOpenModal} className="w-full justify-start">
            <MapPin className="mr-2 h-4 w-4" />
            {selectedAddress ? `${selectedAddress.wardName}, ${selectedAddress.districtName}, ${selectedAddress.provinceName}` : "Chọn Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>);
AddressSection.displayName = "AddressSection";