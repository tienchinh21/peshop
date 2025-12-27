"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { useAuth } from "@/shared/hooks";
interface SimpleLayoutProps {
  children: React.ReactNode;
}
export default function SimpleLayout({ children }: SimpleLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isSellerRegistration = pathname === "/shop/dang-ky";
  return (
    <div className="min-h-screen">
      {isSellerRegistration && (
        <div className="w-full border-b bg-white">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-gray-900">
                Đăng ký trở thành Người bán PeShop
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                {(user?.name || user?.username || user?.email || "?")
                  .toString()
                  .trim()
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="text-sm text-gray-700">
                {user?.username || user?.email || "Tài khoản"}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen">{children}</main>
    </div>
  );
}
