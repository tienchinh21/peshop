"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Home, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Thanh toán thành công!
          </CardTitle>
          <CardDescription className="text-base">
            Cảm ơn bạn đã mua hàng tại PeShop
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {orderId && (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
              <p className="font-mono text-lg font-semibold text-primary">
                #{orderId}
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý. Bạn sẽ nhận
            được thông báo khi đơn hàng được giao.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          {orderId && (
            <Button asChild className="w-full" size="lg">
              <Link href={`/don-hang/${orderId}`}>
                <FileText className="mr-2 h-4 w-4" />
                Xem chi tiết đơn hàng
              </Link>
            </Button>
          )}

          <div className="flex w-full gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/don-hang">
                <Package className="mr-2 h-4 w-4" />
                Đơn hàng của tôi
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Trang chủ
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Đang tải...</div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
