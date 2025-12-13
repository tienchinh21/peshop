"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { VoucherStatus, VoucherStatusLabels, VoucherType, VoucherTypeLabels } from "@/lib/utils/enums/eVouchers";
import type { CreateVoucherPayload, ShopVoucher } from "@/types/shops/voucher.type";
import { Ticket, Info, Calendar, Settings } from "lucide-react";
import _ from "lodash";
import { formatInputCurrency, parseInputCurrency } from "@/lib/utils";
interface VoucherFormProps {
  initialData?: ShopVoucher;
  onSubmit: (data: CreateVoucherPayload) => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}
export function VoucherForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode
}: VoucherFormProps) {
  const [formData, setFormData] = useState<CreateVoucherPayload>({
    name: _.get(initialData, "name", ""),
    code: _.get(initialData, "code", ""),
    type: _.get(initialData, "type", VoucherType.FIXED_AMOUNT),
    discountValue: _.get(initialData, "discountValue", 0),
    maxDiscountAmount: _.get(initialData, "maxDiscountAmount", 0),
    minimumOrderValue: _.get(initialData, "minimumOrderValue", 0),
    quantity: _.get(initialData, "quantity", 1),
    limitForUser: _.get(initialData, "limitForUser", 1),
    startTime: _.get(initialData, "startTime", ""),
    endTime: _.get(initialData, "endTime", ""),
    status: _.get(initialData, "status", VoucherStatus.INACTIVE)
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formatDateForInput = (dateString: string) => {
    if (_.isEmpty(dateString)) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: _.get(initialData, "name", ""),
        code: _.get(initialData, "code", ""),
        type: _.get(initialData, "type", VoucherType.FIXED_AMOUNT),
        discountValue: _.get(initialData, "discountValue", 0),
        maxDiscountAmount: _.get(initialData, "maxDiscountAmount", 0),
        minimumOrderValue: _.get(initialData, "minimumOrderValue", 0),
        quantity: _.get(initialData, "quantity", 1),
        limitForUser: _.get(initialData, "limitForUser", 1),
        startTime: formatDateForInput(_.get(initialData, "startTime", "")),
        endTime: formatDateForInput(_.get(initialData, "endTime", "")),
        status: _.get(initialData, "status", VoucherStatus.INACTIVE)
      });
    }
  }, [initialData]);
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (_.isEmpty(_.trim(formData.name))) {
      newErrors.name = "Tên mã giảm giá không được để trống";
    }
    if (_.isEmpty(_.trim(formData.code))) {
      newErrors.code = "Mã code không được để trống";
    }
    if (formData.discountValue <= 0) {
      newErrors.discountValue = "Giá trị giảm phải lớn hơn 0";
    }
    if (formData.type === VoucherType.PERCENTAGE && formData.discountValue > 100) {
      newErrors.discountValue = "Giá trị giảm % không được vượt quá 100";
    }
    if (formData.quantity < 1) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }
    if (formData.limitForUser < 1) {
      newErrors.limitForUser = "Giới hạn cho người dùng phải lớn hơn 0";
    }
    if (_.isEmpty(formData.startTime)) {
      newErrors.startTime = "Ngày bắt đầu không được để trống";
    }
    if (_.isEmpty(formData.endTime)) {
      newErrors.endTime = "Ngày kết thúc không được để trống";
    }
    if (!_.isEmpty(formData.startTime) && !_.isEmpty(formData.endTime)) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end <= start) {
        newErrors.endTime = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }
    setErrors(newErrors);
    return _.isEmpty(newErrors);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = _.assign({}, formData, {
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString()
      });
      onSubmit(submitData);
    }
  };
  const handleChange = (field: keyof CreateVoucherPayload, value: any) => {
    setFormData(_.assign({}, formData, {
      [field]: value
    }));
    if (!_.isNil(errors[field])) {
      setErrors(_.omit(errors, field));
    }
  };
  const handleCurrencyChange = (field: keyof CreateVoucherPayload, formattedValue: string) => {
    const parsed = parseInputCurrency(formattedValue);
    handleChange(field, parsed);
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên mã giảm giá <span className="text-red-500">*</span>
              </Label>
              <Input id="name" value={formData.name} onChange={e => handleChange("name", _.get(e, "target.value"))} placeholder="Ví dụ: Giảm giá mùa hè" maxLength={100} />
              {!_.isNil(errors.name) && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">
                Mã code <span className="text-red-500">*</span>
              </Label>
              <Input id="code" value={formData.code} onChange={e => handleChange("code", _.toUpper(_.get(e, "target.value")))} placeholder="Ví dụ: SUMMER2025" maxLength={20} className="uppercase" />
              {!_.isNil(errors.code) && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Trạng thái <span className="text-red-500">*</span>
            </Label>
            <Select value={_.toString(formData.status)} onValueChange={value => handleChange("status", _.toNumber(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VoucherStatus.INACTIVE.toString()}>
                  {VoucherStatusLabels[VoucherStatus.INACTIVE]}
                </SelectItem>
                <SelectItem value={VoucherStatus.ACTIVE.toString()}>
                  {VoucherStatusLabels[VoucherStatus.ACTIVE]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt giảm giá
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">
              Loại giảm giá <span className="text-red-500">*</span>
            </Label>
            <Select value={_.toString(formData.type)} onValueChange={value => handleChange("type", _.toNumber(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VoucherType.FIXED_AMOUNT.toString()}>
                  {VoucherTypeLabels[VoucherType.FIXED_AMOUNT]}
                </SelectItem>
                <SelectItem value={VoucherType.PERCENTAGE.toString()}>
                  {VoucherTypeLabels[VoucherType.PERCENTAGE]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Giá trị giảm <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                {formData.type === VoucherType.PERCENTAGE ? <Input id="discountValue" type="number" min="0" max={100} value={formData.discountValue || ""} onChange={e => handleChange("discountValue", _.toNumber(_.get(e, "target.value")))} placeholder="0" /> : <Input id="discountValue" type="text" inputMode="numeric" value={_.isNil(formData.discountValue) ? "" : formatInputCurrency(formData.discountValue)} onChange={e => handleCurrencyChange("discountValue", _.get(e, "target.value", ""))} placeholder="0" />}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {formData.type === VoucherType.PERCENTAGE ? "%" : "₫"}
                </span>
              </div>
              {!_.isNil(errors.discountValue) && <p className="text-sm text-red-500">{errors.discountValue}</p>}
            </div>

            {formData.type === VoucherType.PERCENTAGE && <div className="space-y-2">
                <Label htmlFor="maxDiscountAmount">Giảm tối đa</Label>
                <div className="relative">
                  <Input id="maxDiscountAmount" type="text" inputMode="numeric" value={_.isNil(formData.maxDiscountAmount) ? "" : formatInputCurrency(formData.maxDiscountAmount)} onChange={e => handleCurrencyChange("maxDiscountAmount", _.get(e, "target.value", ""))} placeholder="0" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    ₫
                  </span>
                </div>
              </div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumOrderValue">
              Giá trị đơn hàng tối thiểu
            </Label>
            <div className="relative">
              <Input id="minimumOrderValue" type="text" inputMode="numeric" value={_.isNil(formData.minimumOrderValue) ? "" : formatInputCurrency(formData.minimumOrderValue)} onChange={e => handleCurrencyChange("minimumOrderValue", _.get(e, "target.value", ""))} placeholder="0" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                ₫
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Số lượng & Giới hạn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Tổng số lượng <span className="text-red-500">*</span>
              </Label>
              <Input id="quantity" type="number" min="1" value={formData.quantity || ""} onChange={e => handleChange("quantity", _.toNumber(_.get(e, "target.value")))} placeholder="1" />
              {!_.isNil(errors.quantity) && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="limitForUser">
                Giới hạn/người dùng <span className="text-red-500">*</span>
              </Label>
              <Input id="limitForUser" type="number" min="1" value={formData.limitForUser || ""} onChange={e => handleChange("limitForUser", _.toNumber(_.get(e, "target.value")))} placeholder="1" />
              {!_.isNil(errors.limitForUser) && <p className="text-sm text-red-500">{errors.limitForUser}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Thời gian áp dụng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input id="startTime" type="datetime-local" value={formData.startTime} onChange={e => handleChange("startTime", _.get(e, "target.value"))} />
              {!_.isNil(errors.startTime) && <p className="text-sm text-red-500">{errors.startTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                Ngày kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input id="endTime" type="datetime-local" value={formData.endTime} onChange={e => handleChange("endTime", _.get(e, "target.value"))} />
              {!_.isNil(errors.endTime) && <p className="text-sm text-red-500">{errors.endTime}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? mode === "create" ? "Đang tạo..." : "Đang cập nhật..." : mode === "create" ? "Tạo mã giảm giá" : "Cập nhật mã giảm giá"}
        </Button>
      </div>
    </form>;
}