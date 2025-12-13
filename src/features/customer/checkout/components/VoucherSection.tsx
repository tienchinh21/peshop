"use client";

import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Ticket, ChevronRight, Sparkles } from "lucide-react";
import type { VoucherEligibilityResponse } from "@/features/customer/voucher-check";
import _ from "lodash";

interface VoucherSectionProps {
  vouchers: VoucherEligibilityResponse;
  selectedSystemVoucherId: string | null;
  selectedShopVoucherIds: Record<string, string>;
  onSystemVoucherChange: (voucherId: string | null) => void;
  onShopVoucherChange: (shopId: string, voucherId: string | null) => void;
  formatPrice: (price: number) => string;
}

export function VoucherSection({
  vouchers,
  selectedSystemVoucherId,
  selectedShopVoucherIds,
  onSystemVoucherChange,
  onShopVoucherChange,
  formatPrice,
}: VoucherSectionProps) {
  const systemVouchers = _.get(vouchers, "SystemVouchers.Vouchers", []);
  const bestSystemVoucherId = _.get(
    vouchers,
    "SystemVouchers.BestVoucherId",
    null
  );
  const shopVouchers = _.get(vouchers, "ShopVouchers", []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Ticket className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Mã giảm giá
              </h3>
              <p className="text-xs text-gray-500">
                Chọn voucher để được giảm giá tốt nhất
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-6">
          {systemVouchers.length > 0 &&
            (() => {
              const allowedSystemVouchers = systemVouchers.filter(
                (item: any) => item.IsAllowed
              );
              return (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Mã giảm giá hệ thống
                  </p>
                  {allowedSystemVouchers.length > 0 ? (
                    <RadioGroup
                      value={selectedSystemVoucherId || "none"}
                      onValueChange={(value) =>
                        onSystemVoucherChange(value === "none" ? null : value)
                      }
                    >
                      <div className="flex items-center space-x-3 p-2 rounded-lg border">
                        <RadioGroupItem value="none" id="system-none" />
                        <Label
                          htmlFor="system-none"
                          className="cursor-pointer text-sm"
                        >
                          Không sử dụng
                        </Label>
                      </div>
                      {allowedSystemVouchers.map((item: any) => {
                        const voucher = item.Voucher;
                        const isBest = voucher.Id === bestSystemVoucherId;
                        return (
                          <div
                            key={voucher.Id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                              isBest
                                ? "border-purple-300 bg-purple-50 hover:bg-purple-100"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <RadioGroupItem
                              value={voucher.Id}
                              id={voucher.Id}
                            />
                            <Label
                              htmlFor={voucher.Id}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-sm text-gray-900">
                                      {voucher.Name}
                                    </p>
                                    {isBest && (
                                      <Badge
                                        variant="default"
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs"
                                      >
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Tốt nhất
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Giảm{" "}
                                    {voucher.ValueType === 2
                                      ? `${voucher.DiscountValue}%`
                                      : formatPrice(voucher.DiscountValue)}
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-6 text-gray-500 border rounded-lg bg-gray-50">
                      <div className="inline-flex p-3 bg-gray-200 rounded-full mb-2">
                        <Ticket className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">
                        Không có mã giảm giá hệ thống khả dụng
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Các voucher hệ thống hiện tại không đủ điều kiện sử dụng
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

          {shopVouchers
            .map((shop: any) => {
              const allowedVouchers = shop.Vouchers
                ? shop.Vouchers.filter((item: any) => item.IsAllowed)
                : [];
              const bestShopVoucherId = shop.BestVoucherId;
              return (
                <div key={shop.ShopId} className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Mã giảm giá của {shop.ShopName}
                  </p>
                  {allowedVouchers.length > 0 ? (
                    <RadioGroup
                      value={selectedShopVoucherIds[shop.ShopId] || "none"}
                      onValueChange={(value) =>
                        onShopVoucherChange(
                          shop.ShopId,
                          value === "none" ? null : value
                        )
                      }
                    >
                      <div className="flex items-center space-x-3 p-2 rounded border">
                        <RadioGroupItem
                          value="none"
                          id={`shop-${shop.ShopId}-none`}
                        />
                        <Label
                          htmlFor={`shop-${shop.ShopId}-none`}
                          className="cursor-pointer text-sm"
                        >
                          Không sử dụng
                        </Label>
                      </div>
                      {allowedVouchers.map((item: any) => {
                        const voucher = item.Voucher;
                        const isBest = voucher.Id === bestShopVoucherId;
                        return (
                          <div
                            key={voucher.Id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                              isBest
                                ? "border-purple-300 bg-purple-50 hover:bg-purple-100"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <RadioGroupItem
                              value={voucher.Id}
                              id={voucher.Id}
                            />
                            <Label
                              htmlFor={voucher.Id}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-sm text-gray-900">
                                      {voucher.Name}
                                    </p>
                                    {isBest && (
                                      <Badge
                                        variant="default"
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs"
                                      >
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Tốt nhất
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Giảm{" "}
                                    {voucher.ValueType === 2
                                      ? `${voucher.DiscountValue}%`
                                      : formatPrice(voucher.DiscountValue)}
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50">
                      <div className="inline-flex p-2 bg-gray-200 rounded-full mb-2">
                        <Ticket className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">
                        Không có mã giảm giá khả dụng
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Shop {shop.ShopName} hiện không có voucher đủ điều kiện
                      </p>
                    </div>
                  )}
                </div>
              );
            })
            .filter(Boolean)}

          {systemVouchers.length === 0 && shopVouchers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-3">
                <Ticket className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-sm font-medium">
                Không có mã giảm giá khả dụng
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Các voucher sẽ xuất hiện khi đơn hàng đủ điều kiện
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
