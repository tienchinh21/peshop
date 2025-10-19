"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ShopDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Shop
          </h1>
          <p className="text-gray-600">Quản lý cửa hàng của bạn</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500 mt-1">Sản phẩm đang bán</p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500 mt-1">Đơn hàng mới</p>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Doanh thu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0₫</div>
              <p className="text-xs text-gray-500 mt-1">Tháng này</p>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Đánh giá
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0.0</div>
              <p className="text-xs text-gray-500 mt-1">Trung bình</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-lg font-semibold mb-1">Thêm sản phẩm</div>
                <div className="text-sm text-gray-600">
                  Thêm sản phẩm mới vào shop
                </div>
              </button>

              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-lg font-semibold mb-1">
                  Quản lý đơn hàng
                </div>
                <div className="text-sm text-gray-600">
                  Xem và xử lý đơn hàng
                </div>
              </button>

              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-lg font-semibold mb-1">Cài đặt shop</div>
                <div className="text-sm text-gray-600">
                  Cập nhật thông tin shop
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🚧 Đang phát triển
          </h3>
          <p className="text-yellow-700">
            Dashboard đầy đủ sẽ được cập nhật sớm với nhiều tính năng quản lý
            hơn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
