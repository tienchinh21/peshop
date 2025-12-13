"use client";

import React from "react";
import { TodoListContent } from "../types";
import { Package, CheckCircle, XCircle, Lock } from "lucide-react";
interface TodoListProps {
  data: TodoListContent;
}
export const TodoList: React.FC<TodoListProps> = ({
  data
}) => {
  const todoItems = [{
    id: "waiting",
    title: "Chờ giao hàng",
    count: data.waitingForDelivery,
    icon: Package,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    iconBg: "bg-blue-100",
    badge: "bg-blue-500",
    description: "Đơn hàng đang chờ được giao"
  }, {
    id: "processed",
    title: "Đã xử lý",
    count: data.processed,
    icon: CheckCircle,
    color: "bg-green-50 text-green-600 border-green-200",
    iconBg: "bg-green-100",
    badge: "bg-green-500",
    description: "Đơn hàng đã hoàn thành"
  }, {
    id: "returns",
    title: "Trả hàng/Hủy",
    count: data.returnsAndCancellations,
    icon: XCircle,
    color: "bg-red-50 text-red-600 border-red-200",
    iconBg: "bg-red-100",
    badge: "bg-red-500",
    description: "Đơn hàng bị trả/hủy"
  }, {
    id: "locked",
    title: "Sản phẩm bị khóa",
    count: data.productlocked,
    icon: Lock,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    iconBg: "bg-orange-100",
    badge: "bg-orange-500",
    description: "Sản phẩm đang bị khóa"
  }];
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Danh sách công việc</h2>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi các công việc cần xử lý của cửa hàng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {todoItems.map(item => {
        const Icon = item.icon;
        return <div key={item.id} className={`relative border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${item.color}`}>
              {}
              {item.count > 0 && <div className="absolute -top-2 -right-2">
                  <div className={`${item.badge} text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md`}>
                    {item.count > 99 ? "99+" : item.count}
                  </div>
                </div>}

              {}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${item.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs opacity-75 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{item.count}</span>
                    <span className="text-xs opacity-75">việc</span>
                  </div>
                </div>
              </div>
            </div>;
      })}
      </div>

      {}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tổng công việc cần xử lý:</span>
          <span className="font-bold text-gray-900">
            {data.waitingForDelivery + data.processed + data.returnsAndCancellations + data.productlocked}{" "}
            việc
          </span>
        </div>
      </div>
    </div>;
};