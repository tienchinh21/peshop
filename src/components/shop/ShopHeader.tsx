"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Route mapping for breadcrumbs
const routeMap: Record<
  string,
  { title: string; parent?: string; parentHref?: string }
> = {
  "/shop": { title: "Dashboard" },
  "/shop/dashboard": { title: "Dashboard" },
  "/shop/san-pham": {
    title: "Danh sách sản phẩm",
    parent: "Quản lý sản phẩm",
    parentHref: "/shop/san-pham",
  },
  "/shop/san-pham/them": {
    title: "Thêm sản phẩm",
    parent: "Quản lý sản phẩm",
    parentHref: "/shop/san-pham",
  },
  "/shop/don-hang": {
    title: "Tất cả đơn hàng",
    parent: "Quản lý đơn hàng",
    parentHref: "/shop/don-hang",
  },
  "/shop/don-hang/moi": {
    title: "Đơn hàng mới",
    parent: "Quản lý đơn hàng",
    parentHref: "/shop/don-hang",
  },
  "/shop/don-hang/dang-xu-ly": {
    title: "Đang xử lý",
    parent: "Quản lý đơn hàng",
    parentHref: "/shop/don-hang",
  },
  "/shop/thong-ke": { title: "Thống kê" },
  "/shop/khach-hang": { title: "Khách hàng" },
  "/shop/cai-dat": { title: "Cài đặt" },
};

interface ShopHeaderProps {
  onLogout?: () => void;
}

export function ShopHeader({ onLogout }: ShopHeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logout();
    }
  };

  // Generate breadcrumb items based on current route
  const generateBreadcrumbs = () => {
    const route = routeMap[pathname];
    if (!route) return [];

    const breadcrumbs = [];

    // Add parent if exists
    if (route.parent && route.parentHref) {
      breadcrumbs.push({
        title: route.parent,
        href: route.parentHref,
        isParent: true,
      });
    }

    // Add current page
    breadcrumbs.push({
      title: route.title,
      href: pathname,
      isParent: false,
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Left side - Logo and Breadcrumb */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Link href="/shop/dashboard" className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-900">
              Kênh Người Bán
            </span>
          </Link>

          {/* Separator */}
          {breadcrumbs.length > 0 && (
            <div className="hidden md:block h-4 w-px bg-gray-300"></div>
          )}

          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <div className="hidden md:block">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage className="text-sm font-medium text-gray-900">
                            {breadcrumb.title}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            asChild
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            <Link href={breadcrumb.href || "#"}>
                              {breadcrumb.title}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                  {(user?.name || user?.username || user?.email || "?")
                    .toString()
                    .trim()
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user?.username || user?.name || user?.email || "Tài khoản"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.username || "Người dùng"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/shop/cai-dat"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Cài đặt</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/tai-khoan"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Tài khoản</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
