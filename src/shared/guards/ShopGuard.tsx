"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks";
import { getRolesFromToken } from "@/lib/utils/jwt.utils";
import { getAuthTokenCookie } from "@/lib/utils/cookies.utils";

interface ShopGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ShopGuard({ children, fallback }: ShopGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, token } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  const isShopRegistrationPage = pathname === "/shop/dang-ky";

  useEffect(() => {
    if (isLoading) return;

    setIsChecking(true);

    if (!isAuthenticated) {
      router.replace("/xac-thuc");
      return;
    }

    // Get token from state or cookie
    const currentToken = token || getAuthTokenCookie();

    if (!currentToken) {
      router.replace("/xac-thuc");
      return;
    }

    // Check if user has Shop role from token
    const roles = getRolesFromToken(currentToken);
    const hasShopRole = roles.includes("Shop");

    if (!hasShopRole && !isShopRegistrationPage) {
      router.replace("/shop/dang-ky");
      return;
    }

    setIsChecking(false);
  }, [isLoading, isAuthenticated, token, isShopRegistrationPage, router]);

  if (isLoading || isChecking) {
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
