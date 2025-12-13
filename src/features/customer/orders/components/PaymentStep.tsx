"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Banknote, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, RadioGroup, RadioGroupItem } from "@/shared/components/ui";
import { formatPrice } from "@/shared/utils";
import { useCreateOrder, useCalculateOrderTotal } from "../hooks";
import { PaymentMethod } from "../types/order.enums";
import type { VirtualOrderData, CreateOrderPayload } from "../types";
export interface PaymentStepProps {
  orderId: string;
  orderData: VirtualOrderData;
  onOrderCreated?: () => void;
}
function PaymentMethodOption({
  method,
  label,
  description,
  icon: Icon,
  isSelected,
  onSelect
}: {
  method: PaymentMethod;
  label: string;
  description: string;
  icon: React.ElementType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return <div onClick={onSelect} className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
      <RadioGroupItem value={String(method)} id={`payment-${method}`} />
      <div className={`flex items-center justify-center h-12 w-12 rounded-full ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
    </div>;
}
export function PaymentStep({
  orderId,
  orderData,
  onOrderCreated
}: PaymentStepProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [isProcessing, setIsProcessing] = useState(false);
  const createOrderMutation = useCreateOrder();
  const calculateOrderMutation = useCalculateOrderTotal();
  const handleCreateOrder = useCallback(async () => {
    setIsProcessing(true);
    try {
      await calculateOrderMutation.mutateAsync(orderId);
      const payload: CreateOrderPayload = {
        orderId,
        paymentMethod: selectedMethod
      };
      const result = await createOrderMutation.mutateAsync(payload);
      if (selectedMethod === PaymentMethod.VNPay && result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }
      if (onOrderCreated) {
        onOrderCreated();
      }
      router.push("/don-hang");
    } catch {} finally {
      setIsProcessing(false);
    }
  }, [orderId, selectedMethod, calculateOrderMutation, createOrderMutation, onOrderCreated, router]);
  const isLoading = isProcessing || createOrderMutation.isPending || calculateOrderMutation.isPending;
  return <div className="space-y-6">
      {}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Chọn phương thức thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={String(selectedMethod)} onValueChange={value => setSelectedMethod(Number(value) as PaymentMethod)} className="space-y-3">
            {}
            <PaymentMethodOption method={PaymentMethod.COD} label="Thanh toán khi nhận hàng (COD)" description="Thanh toán bằng tiền mặt khi nhận hàng" icon={Banknote} isSelected={selectedMethod === PaymentMethod.COD} onSelect={() => setSelectedMethod(PaymentMethod.COD)} />

            {}
            <PaymentMethodOption method={PaymentMethod.VNPay} label="Thanh toán qua VNPay" description="Thanh toán trực tuyến qua cổng VNPay" icon={CreditCard} isSelected={selectedMethod === PaymentMethod.VNPay} onSelect={() => setSelectedMethod(PaymentMethod.VNPay)} />
          </RadioGroup>
        </CardContent>
      </Card>

      {}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tổng tiền hàng</span>
            <span>{formatPrice(orderData.orderTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            <span>{formatPrice(orderData.feeShippingTotal)}</span>
          </div>
          {orderData.discountTotal > 0 && <div className="flex justify-between text-sm text-green-600">
              <span>Giảm giá</span>
              <span>-{formatPrice(orderData.discountTotal)}</span>
            </div>}
          <div className="border-t border-purple-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-purple-600">
                {formatPrice(orderData.amountTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Button onClick={handleCreateOrder} disabled={isLoading} className="w-full h-12 text-base font-semibold" size="lg">
        {isLoading ? <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang xử lý...
          </> : selectedMethod === PaymentMethod.VNPay ? "Thanh toán qua VNPay" : "Đặt hàng"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Bằng việc đặt hàng, bạn đồng ý với{" "}
        <a href="#" className="text-primary hover:underline">
          Điều khoản dịch vụ
        </a>{" "}
        của chúng tôi
      </p>
    </div>;
}