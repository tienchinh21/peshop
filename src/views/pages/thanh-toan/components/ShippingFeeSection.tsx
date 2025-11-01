"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import type { ShippingFeeItem } from "@/types/users/order.types";
import _ from "lodash";

interface ShippingFeeSectionProps {
  shippingFees: ShippingFeeItem[];
  selectedShippingIds: Record<string, string>;
  onShippingChange: (shopId: string, shippingId: string) => void;
  formatPrice: (price: number) => string;
}

export function ShippingFeeSection({
  shippingFees,
  selectedShippingIds,
  onShippingChange,
  formatPrice,
}: ShippingFeeSectionProps) {
  const groupedByShop = _.groupBy(shippingFees, "shopId");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Truck className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Phương thức vận chuyển
            </h3>
            <p className="text-xs text-gray-500">
              Chọn đơn vị vận chuyển phù hợp
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedByShop).map(([shopId, options]) => (
            <div key={shopId} className="space-y-3">
              <RadioGroup
                value={selectedShippingIds[shopId] || ""}
                onValueChange={(value) => onShippingChange(shopId, value)}
              >
                {options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={option.carrier_logo}
                            alt={option.carrier_name}
                            className="w-8 h-8 object-contain"
                          />
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {option.service}
                            </p>
                            <p className="text-xs text-gray-500">
                              {option.carrier_name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(option.total_fee)}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
