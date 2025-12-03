"use client";

import { useState, useEffect } from "react";
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
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
} from "@/shared/services/external";
import type { UserAddress } from "../types";
import _ from "lodash";

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

interface LocationOption {
  id: string;
  name: string;
}

export function AddressFormModal({
  open,
  onOpenChange,
  onSubmit,
  editAddress,
  isLoading = false,
}: AddressFormModalProps) {
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

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

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    if (open) {
      loadProvinces();
      if (editAddress) {
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
      } else {
        resetForm();
      }
    }
  }, [open, editAddress]);

  const loadProvinces = async () => {
    setLoadingLocation(true);
    try {
      const response = await getProvinces();
      const provinceList = _.get(response, "data", []);
      setProvinces(provinceList);
    } catch (error) {
      console.error("Failed to load provinces:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const loadDistricts = async (provinceId: string) => {
    setLoadingLocation(true);
    try {
      const response = await getDistrictsByProvince(provinceId);
      const districtList = _.get(response, "data", []);
      setDistricts(districtList);
    } catch (error) {
      console.error("Failed to load districts:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const loadWards = async (districtId: string) => {
    setLoadingLocation(true);
    try {
      const response = await getWardsByDistrict(districtId);
      const wardList = _.get(response, "data", []);
      setWards(wardList);
    } catch (error) {
      console.error("Failed to load wards:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleProvinceChange = (provinceName: string) => {
    const province = provinces.find((p) => p.name === provinceName);
    if (province) {
      setSelectedProvince(provinceName);
      setSelectedDistrict("");
      setSelectedWard("");
      setDistricts([]);
      setWards([]);
      setFormData((prev) => ({
        ...prev,
        oldProviceId: province.id,
        oldDistrictId: "",
        oldWardId: "",
      }));
      loadDistricts(province.id);
    }
  };

  const handleDistrictChange = (districtName: string) => {
    const district = districts.find((d) => d.name === districtName);
    if (district) {
      setSelectedDistrict(districtName);
      setSelectedWard("");
      setWards([]);
      setFormData((prev) => ({
        ...prev,
        oldDistrictId: district.id,
        oldWardId: "",
      }));
      loadWards(district.id);
    }
  };

  const handleWardChange = (wardName: string) => {
    const ward = wards.find((w) => w.name === wardName);
    if (ward) {
      setSelectedWard(wardName);
      setFormData((prev) => ({
        ...prev,
        oldWardId: String(ward.id),
      }));
    }
  };

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
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
  };

  const handleSubmit = () => {
    const fullAddress = `${formData.streetLine}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
    const submitData = {
      ...formData,
      fullOldAddress: fullAddress,
      fullNewAddress: fullAddress,
    };
    onSubmit(submitData);
  };

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
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-visible p-6 md:p-8">
        <DialogHeader>
          <DialogTitle>Quản lý địa chỉ giao hàng</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[76vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetLine">
                Số nhà, tên đường <span className="text-red-500">*</span>
              </Label>
              <Input
                id="streetLine"
                placeholder="Ví dụ: 123 Nguyễn Văn A"
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
              value={selectedProvince}
              onChange={handleProvinceChange}
              options={provinces.map((p) => p.name)}
              placeholder="Chọn tỉnh/thành phố"
            />

            <SearchableDropdown
              label="Quận/Huyện"
              required
              value={selectedDistrict}
              onChange={handleDistrictChange}
              options={districts.map((d) => d.name)}
              placeholder="Chọn quận/huyện"
            />

            <SearchableDropdown
              label="Phường/Xã"
              required
              value={selectedWard}
              onChange={handleWardChange}
              options={wards.map((w) => w.name)}
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

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading || loadingLocation}
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
