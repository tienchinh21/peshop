"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui";

export function OrdersPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Chưa có đơn hàng nào. Hãy mua sắm ngay!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
