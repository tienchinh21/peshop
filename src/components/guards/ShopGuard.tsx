"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ShopGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ShopGuard({ children, fallback }: ShopGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isShopOwner } = useAuth();

  console.log("isShopOwner", isShopOwner);
  console.log("isAuthenticated", isAuthenticated);
  console.log("isLoading", isLoading);
  console.log("pathname", pathname);

  const isShopRegistrationPage = pathname === "/shop/dang-ky";

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/xac-thuc");
        return;
      }

      // Allow accessing the shop registration page even if the user is not a shop owner yet
      if (!isShopOwner && !isShopRegistrationPage) {
        router.replace("/shop/dang-ky");
      }
    }
  }, [isLoading, isAuthenticated, isShopOwner, isShopRegistrationPage, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  // When on registration page, allow rendering as long as user is authenticated
  if (!isAuthenticated || (!isShopOwner && !isShopRegistrationPage)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
