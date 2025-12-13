import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ArrowRight, Loader2 } from "lucide-react";
interface OrderSummaryProps {
  orderTotal: number;
  shippingFee: number;
  voucherDiscount: number;
  finalTotal: number;
  formatPrice: (price: number) => string;
  onCheckout: () => void;
  isLoading: boolean;
  isCalculating: boolean;
}
export function OrderSummary({
  orderTotal,
  shippingFee,
  voucherDiscount,
  finalTotal,
  formatPrice,
  onCheckout,
  isLoading,
  isCalculating
}: OrderSummaryProps) {
  return <Card className="sticky top-4">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tổng đơn hàng</h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span className="font-medium">
              {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : formatPrice(orderTotal)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="font-medium">
              {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : formatPrice(shippingFee)}
            </span>
          </div>

          {voucherDiscount > 0 && <div className="flex justify-between text-sm">
              <span className="text-gray-600">Giảm giá</span>
              <span className="font-medium text-green-600">
                -{formatPrice(voucherDiscount)}
              </span>
            </div>}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between mb-6">
          <span className="text-lg font-bold">Tổng thanh toán</span>
          <span className="text-2xl font-bold text-purple-600">
            {isCalculating ? <Loader2 className="w-6 h-6 animate-spin" /> : formatPrice(finalTotal)}
          </span>
        </div>

        <Button onClick={onCheckout} disabled={isLoading || isCalculating} className="w-full h-12 text-base" size="lg">
          {isLoading ? <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang xử lý...
            </> : <>
              Đặt hàng
              <ArrowRight className="w-5 h-5 ml-2" />
            </>}
        </Button>
      </CardContent>
    </Card>;
}