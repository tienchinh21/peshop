"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SimpleLayout from "@/layouts/SimpleLayout";
import MainLayout from "@/layouts/MainLayout";

/**
 * AUTH_PAGES: Các trang authentication (login, register, forgot password)
 * Các trang này dùng SimpleLayout (không có header/footer)
 */
const AUTH_PAGES = ["/xac-thuc", "/dang-ky", "/quen-mat-khau"];

interface LayoutProviderProps {
  children: React.ReactNode;
}

/**
 * LayoutProvider - Chọn layout phù hợp cho từng route
 *
 * Logic:
 * - Auth pages (login, register) → SimpleLayout
 * - Shop registration page → SimpleLayout
 * - Shop pages (dashboard, ...) → Không wrap layout (có ShopLayout riêng)
 * - Tất cả các trang khác → MainLayout (full UI với header/footer)
 */
export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Kiểm tra trang shop registration (cần SimpleLayout)
  const isShopRegistrationPage = pathname === "/shop/dang-ky";

  // Kiểm tra trang shop (dashboard, settings...) - không cần MainLayout
  const isShopPage = pathname.startsWith("/shop") && !isShopRegistrationPage;

  // Kiểm tra trang auth
  const isAuthPage = AUTH_PAGES.some((route) => pathname.startsWith(route));

  // Trang cần SimpleLayout
  const needsSimpleLayout = isAuthPage || isShopRegistrationPage;

  // Shop pages không wrap layout (có ShopLayout riêng với sidebar)
  if (isShopPage) {
    return <>{children}</>;
  }

  // Auth pages và shop registration dùng SimpleLayout
  if (needsSimpleLayout) {
    return <SimpleLayout>{children}</SimpleLayout>;
  }

  // Tất cả các trang khác dùng MainLayout
  return <MainLayout>{children}</MainLayout>;
}
