"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, Home, Phone } from "lucide-react";
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

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">
            Thanh toán thất bại
          </CardTitle>
          <CardDescription className="text-base">
            Rất tiếc, giao dịch của bạn không thành công
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

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-left">
            <p className="text-sm font-medium text-amber-800 mb-2">
              Nguyên nhân có thể:
            </p>
            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
              <li>Số dư tài khoản không đủ</li>
              <li>Thông tin thẻ không chính xác</li>
              <li>Giao dịch bị hủy bởi ngân hàng</li>
              <li>Kết nối mạng bị gián đoạn</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Vui lòng thử lại hoặc chọn phương thức thanh toán khác. Nếu vấn đề
            vẫn tiếp tục, hãy liên hệ với chúng tôi để được hỗ trợ.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button asChild className="w-full" size="lg">
            <Link href="/gio-hang">
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử thanh toán lại
            </Link>
          </Button>

          <div className="flex w-full gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Trang chủ
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link href="/lien-he">
                <Phone className="mr-2 h-4 w-4" />
                Liên hệ hỗ trợ
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Đang tải...</div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
