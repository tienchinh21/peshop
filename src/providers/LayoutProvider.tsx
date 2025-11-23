"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SimpleLayout from "@/layouts/SimpleLayout";
import MainLayout from "@/layouts/MainLayout";


const AUTH_PAGES = ["/xac-thuc", "/dang-ky", "/quen-mat-khau"];

interface LayoutProviderProps {
  children: React.ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isShopRegistrationPage = pathname === "/shop/dang-ky";

  const isShopPage =
    pathname.startsWith("/shop") &&
    !pathname.startsWith("/shop-view") &&
    !isShopRegistrationPage;

  const isAuthPage = AUTH_PAGES.some((route) => pathname.startsWith(route));

  const needsSimpleLayout = isAuthPage || isShopRegistrationPage;

  if (isShopPage) {
    return <>{children}</>;
  }

  if (needsSimpleLayout) {
    return <SimpleLayout>{children}</SimpleLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
}
