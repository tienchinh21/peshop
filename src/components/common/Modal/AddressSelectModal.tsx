"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
} from "@/services/api/address.service";

export interface AddressSelection {
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  wardId: string;
  wardName: string;
}

interface AddressSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: AddressSelection) => void;
}

export const AddressSelectModal: React.FC<AddressSelectModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [districts, setDistricts] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [wards, setWards] = useState<
    Array<{ id: string | number; name: string }>
  >([]);

  const [province, setProvince] = useState<{ id: string; name: string } | null>(
    null
  );
  const [district, setDistrict] = useState<{ id: string; name: string } | null>(
    null
  );
  const [ward, setWard] = useState<{
    id: string | number;
    name: string;
  } | null>(null);

  // Search queries
  const [provinceQuery, setProvinceQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [wardQuery, setWardQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getProvinces()
      .then((res) => setProvinces(res?.data ?? []))
      .finally(() => setLoading(false));
    // reset queries when opening
    setProvinceQuery("");
    setDistrictQuery("");
    setWardQuery("");
  }, [open]);

  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setDistrict(null);
      setWards([]);
      setWard(null);
      return;
    }
    setLoading(true);
    getDistrictsByProvince(province.id)
      .then((res) => setDistricts(res?.data ?? []))
      .finally(() => setLoading(false));
  }, [province]);

  useEffect(() => {
    if (!district) {
      setWards([]);
      setWard(null);
      return;
    }
    setLoading(true);
    getWardsByDistrict(district.id)
      .then((res) => setWards(res?.data ?? []))
      .finally(() => setLoading(false));
  }, [district]);

  // Filtered lists
  const filteredProvinces = useMemo(() => {
    const q = provinceQuery.trim().toLowerCase();
    if (!q) return provinces;
    return provinces.filter((p) => p.name.toLowerCase().includes(q));
  }, [provinces, provinceQuery]);

  const filteredDistricts = useMemo(() => {
    const q = districtQuery.trim().toLowerCase();
    if (!q) return districts;
    return districts.filter((d) => d.name.toLowerCase().includes(q));
  }, [districts, districtQuery]);

  const filteredWards = useMemo(() => {
    const q = wardQuery.trim().toLowerCase();
    if (!q) return wards;
    return wards.filter((w) => w.name.toLowerCase().includes(q));
  }, [wards, wardQuery]);

  const canConfirm = useMemo(
    () => !!province && !!district && !!ward,
    [province, district, ward]
  );

  const handleConfirm = () => {
    if (!province || !district || !ward) return;
    onConfirm({
      provinceId: province.id,
      provinceName: province.name,
      districtId: district.id,
      districtName: district.name,
      wardId: String(ward.id),
      wardName: ward.name,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chọn địa chỉ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Province combobox */}
            <div className="space-y-2">
              <Select
                onValueChange={(value) => {
                  const selected =
                    provinces.find((p) => p.id === value) || null;
                  setProvince(selected);
                }}
                value={province?.id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tỉnh / Thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 z-10 bg-white p-2">
                    <Input
                      placeholder="Tìm tỉnh / thành phố"
                      value={provinceQuery}
                      onChange={(e) => setProvinceQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      disabled={loading}
                    />
                  </div>
                  {filteredProvinces.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District combobox */}
            <div className="space-y-2">
              <Select
                onValueChange={(value) => {
                  const selected =
                    districts.find((d) => d.id === value) || null;
                  setDistrict(selected);
                }}
                value={district?.id}
                disabled={!province || loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quận / Huyện" />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 z-10 bg-white p-2">
                    <Input
                      placeholder="Tìm quận / huyện"
                      value={districtQuery}
                      onChange={(e) => setDistrictQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      disabled={!province || loading}
                    />
                  </div>
                  {filteredDistricts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ward combobox */}
            <div className="space-y-2">
              <Select
                onValueChange={(value) => {
                  const selected =
                    wards.find((w) => String(w.id) === value) || null;
                  setWard(selected);
                }}
                value={ward ? String(ward.id) : undefined}
                disabled={!district || loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Phường / Xã" />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 z-10 bg-white p-2">
                    <Input
                      placeholder="Tìm phường / xã"
                      value={wardQuery}
                      onChange={(e) => setWardQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      disabled={!district || loading}
                    />
                  </div>
                  {filteredWards.map((w) => (
                    <SelectItem key={String(w.id)} value={String(w.id)}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button disabled={!canConfirm} onClick={handleConfirm}>
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressSelectModal;
