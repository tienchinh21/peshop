"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { SearchableDropdown } from "@/shared/components/layout/SearchableDropdown";
import {
  useGHNProvinces,
  useGHNDistricts,
  useGHNWards,
} from "@/shared/hooks/useGHNAddress";
import type { GHNProvince, GHNDistrict, GHNWard } from "@/shared/types";
import type { UserAddress } from "../types";

interface AddressFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormData) => void;
  editAddress?: UserAddress | null;
  isLoading?: boolean;
}

export interface AddressFormData {
  fullNewAddress: string;
  fullOldAddress: string;
  phone: string;
  newProviceId: string;
  newWardId: string;
  oldDistrictId: string;
  oldProviceId: string;
  oldWardId: string;
  streetLine: string;
  isDefault: boolean;
}

export function AddressFormModal({
  open,
  onOpenChange,
  onSubmit,
  editAddress,
  isLoading = false,
}: AddressFormModalProps) {
  // Form data state
  const [formData, setFormData] = useState<AddressFormData>({
    fullNewAddress: "",
    fullOldAddress: "",
    phone: "",
    newProviceId: "",
    newWardId: "",
    oldDistrictId: "",
    oldProviceId: "",
    oldWardId: "",
    streetLine: "",
    isDefault: false,
  });

  // Selected location IDs for cascading dropdowns
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(0);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(0);

  // Selected location names for display
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");

  // GHN hooks for fetching address data with caching
  const { data: provinces = [], isLoading: isLoadingProvinces } =
    useGHNProvinces();

  const { data: districts = [], isLoading: isLoadingDistricts } =
    useGHNDistricts(selectedProvinceId, selectedProvinceId > 0);

  const { data: wards = [], isLoading: isLoadingWards } = useGHNWards(
    selectedDistrictId,
    selectedDistrictId > 0
  );

  // Combined loading state
  const loadingLocation =
    isLoadingProvinces || isLoadingDistricts || isLoadingWards;

  // Map provinces to dropdown options (ensure array before mapping)
  const provinceOptions = useMemo(
    () =>
      (Array.isArray(provinces) ? provinces : []).map(
        (p: GHNProvince) => p.provinceName
      ),
    [provinces]
  );

  // Map districts to dropdown options (ensure array before mapping)
  const districtOptions = useMemo(
    () =>
      (Array.isArray(districts) ? districts : []).map(
        (d: GHNDistrict) => d.districtName
      ),
    [districts]
  );

  // Map wards to dropdown options (ensure array before mapping)
  const wardOptions = useMemo(
    () => (Array.isArray(wards) ? wards : []).map((w: GHNWard) => w.wardName),
    [wards]
  );

  // Initialize form when modal opens or editAddress changes
  useEffect(() => {
    if (open) {
      if (editAddress) {
        // Populate form with edit address data
        setFormData({
          fullNewAddress: editAddress.fullNewAddress || "",
          fullOldAddress: editAddress.fullOldAddress || "",
          phone: editAddress.phone || "",
          newProviceId: editAddress.newProviceId || "",
          newWardId: editAddress.newWardId || "",
          oldDistrictId: editAddress.oldDistrictId || "",
          oldProviceId: editAddress.oldProviceId || "",
          oldWardId: editAddress.oldWardId || "",
          streetLine: editAddress.streetLine || "",
          isDefault: editAddress.isDefault,
        });

        // Set province ID to trigger district loading
        if (editAddress.oldProviceId) {
          setSelectedProvinceId(Number(editAddress.oldProviceId));
        }

        // Set district ID to trigger ward loading
        if (editAddress.oldDistrictId) {
          setSelectedDistrictId(Number(editAddress.oldDistrictId));
        }
      } else {
        resetForm();
      }
    }
  }, [open, editAddress]);

  // Pre-populate province name when provinces are loaded and we have an edit address
  useEffect(() => {
    if (
      Array.isArray(provinces) &&
      provinces.length > 0 &&
      editAddress?.oldProviceId
    ) {
      const province = provinces.find(
        (p: GHNProvince) => p.provinceID === Number(editAddress.oldProviceId)
      );
      if (province) {
        setSelectedProvinceName(province.provinceName);
      }
    }
  }, [provinces, editAddress?.oldProviceId]);

  // Pre-populate district name when districts are loaded and we have an edit address
  useEffect(() => {
    if (
      Array.isArray(districts) &&
      districts.length > 0 &&
      editAddress?.oldDistrictId
    ) {
      const district = districts.find(
        (d: GHNDistrict) => d.districtID === Number(editAddress.oldDistrictId)
      );
      if (district) {
        setSelectedDistrictName(district.districtName);
      }
    }
  }, [districts, editAddress?.oldDistrictId]);

  // Pre-populate ward name when wards are loaded and we have an edit address
  useEffect(() => {
    if (Array.isArray(wards) && wards.length > 0 && editAddress?.oldWardId) {
      const ward = wards.find(
        (w: GHNWard) => w.wardCode === editAddress.oldWardId
      );
      if (ward) {
        setSelectedWardName(ward.wardName);
      }
    }
  }, [wards, editAddress?.oldWardId]);

  /**
   * Handle province selection change
   * Maps GHN provinceID to form data oldProviceId
   * Requirements: 1.4
   */
  const handleProvinceChange = (provinceName: string) => {
    if (!Array.isArray(provinces)) return;
    const province = provinces.find(
      (p: GHNProvince) => p.provinceName === provinceName
    );
    if (province) {
      setSelectedProvinceName(provinceName);
      setSelectedProvinceId(province.provinceID);

      // Reset district and ward selections
      setSelectedDistrictName("");
      setSelectedDistrictId(0);
      setSelectedWardName("");

      // Update form data with GHN provinceID
      setFormData((prev) => ({
        ...prev,
        oldProviceId: String(province.provinceID),
        newProviceId: String(province.provinceID),
        oldDistrictId: "",
        oldWardId: "",
        newWardId: "",
      }));
    }
  };

  /**
   * Handle district selection change
   * Maps GHN districtID to form data oldDistrictId
   * Requirements: 1.5
   */
  const handleDistrictChange = (districtName: string) => {
    if (!Array.isArray(districts)) return;
    const district = districts.find(
      (d: GHNDistrict) => d.districtName === districtName
    );
    if (district) {
      setSelectedDistrictName(districtName);
      setSelectedDistrictId(district.districtID);

      // Reset ward selection
      setSelectedWardName("");

      // Update form data with GHN districtID
      setFormData((prev) => ({
        ...prev,
        oldDistrictId: String(district.districtID),
        oldWardId: "",
        newWardId: "",
      }));
    }
  };

  /**
   * Handle ward selection change
   * Maps GHN wardCode to form data oldWardId
   * Requirements: 1.6
   */
  const handleWardChange = (wardName: string) => {
    if (!Array.isArray(wards)) return;
    const ward = wards.find((w: GHNWard) => w.wardName === wardName);
    if (ward) {
      setSelectedWardName(wardName);

      // Update form data with GHN wardCode
      setFormData((prev) => ({
        ...prev,
        oldWardId: ward.wardCode,
        newWardId: ward.wardCode,
      }));
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      fullNewAddress: "",
      fullOldAddress: "",
      phone: "",
      newProviceId: "",
      newWardId: "",
      oldDistrictId: "",
      oldProviceId: "",
      oldWardId: "",
      streetLine: "",
      isDefault: false,
    });
    setSelectedProvinceId(0);
    setSelectedDistrictId(0);
    setSelectedProvinceName("");
    setSelectedDistrictName("");
    setSelectedWardName("");
  };

  /**
   * Handle form submission
   * Constructs full address from selected location names
   */
  const handleSubmit = () => {
    const fullAddress = `${formData.streetLine}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;
    const submitData = {
      ...formData,
      fullOldAddress: fullAddress,
      fullNewAddress: fullAddress,
    };
    onSubmit(submitData);
  };

  /**
   * Validate form completeness
   */
  const isFormValid = () => {
    return (
      formData.streetLine.trim() !== "" &&
      formData.oldProviceId !== "" &&
      formData.oldDistrictId !== "" &&
      formData.oldWardId !== "" &&
      formData.phone.trim() !== ""
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
        <DialogHeader>
          <DialogTitle>Quản lý địa chỉ giao hàng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Nhập số điện thoại"
                className="w-full min-h-[44px]"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetLine">
                Số nhà, tên đường <span className="text-red-500">*</span>
              </Label>
              <Input
                id="streetLine"
                type="text"
                autoComplete="street-address"
                placeholder="Ví dụ: 123 Nguyễn Văn A"
                className="w-full min-h-[44px]"
                value={formData.streetLine}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    streetLine: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchableDropdown
              label="Tỉnh/Thành phố"
              required
              value={selectedProvinceName}
              onChange={handleProvinceChange}
              options={provinceOptions}
              placeholder="Chọn tỉnh/thành phố"
            />

            <SearchableDropdown
              label="Quận/Huyện"
              required
              value={selectedDistrictName}
              onChange={handleDistrictChange}
              options={districtOptions}
              placeholder="Chọn quận/huyện"
            />

            <SearchableDropdown
              label="Phường/Xã"
              required
              value={selectedWardName}
              onChange={handleWardChange}
              options={wardOptions}
              placeholder="Chọn phường/xã"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: checked === true,
                }))
              }
            />
            <Label
              htmlFor="isDefault"
              className="text-sm font-normal cursor-pointer"
            >
              Đặt làm địa chỉ mặc định
            </Label>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading || loadingLocation}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : editAddress ? (
              "Cập nhật"
            ) : (
              "Thêm địa chỉ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
