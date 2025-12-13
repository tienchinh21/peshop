"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SimpleLayout from "@/layouts/SimpleLayout";
import MainLayout from "@/layouts/MainLayout";
const AUTH_PAGES = ["/xac-thuc", "/dang-ky", "/quen-mat-khau"];
interface LayoutProviderProps {
  children: React.ReactNode;
}
export function LayoutProvider({
  children
}: LayoutProviderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isShopRegistrationPage = pathname === "/shop/dang-ky";
  const isShopPage = pathname.startsWith("/shop") && !pathname.startsWith("/shop-view") && !isShopRegistrationPage;
  const isAuthPage = AUTH_PAGES.some(route => pathname.startsWith(route));
  const needsSimpleLayout = isAuthPage || isShopRegistrationPage;
  if (!mounted) {
    return <>{children}</>;
  }
  if (isShopPage) {
    return <>{children}</>;
  }
  if (needsSimpleLayout) {
    return <SimpleLayout>{children}</SimpleLayout>;
  }
  return <MainLayout>{children}</MainLayout>;
}