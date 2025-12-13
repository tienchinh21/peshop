"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks";
interface ShopGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
export function ShopGuard({
  children,
  fallback
}: ShopGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isAuthenticated,
    isLoading,
    isShopOwner
  } = useAuth();
  const isShopRegistrationPage = pathname === "/shop/dang-ky";
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/xac-thuc");
        return;
      }
      if (!isShopOwner && !isShopRegistrationPage) {
        router.replace("/shop/dang-ky");
      }
    }
  }, [isLoading, isAuthenticated, isShopOwner, isShopRegistrationPage, router]);
  if (isLoading) {
    return fallback || <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
  }
  if (!isAuthenticated || !isShopOwner && !isShopRegistrationPage) {
    return fallback || <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
  }
  return <>{children}</>;
}