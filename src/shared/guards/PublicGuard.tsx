"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks";

interface PublicGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /**
   * Redirect URL khi đã login (default: "/")
   */
  redirectTo?: string;
}

/**
 * PublicGuard - Bảo vệ trang public (login, register)
 * Nếu đã login → redirect đến trang chỉ định (default: "/")
 */
export function PublicGuard({
  children,
  fallback,
  redirectTo = "/",
}: PublicGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Chỉ check khi đã load xong
    if (!isLoading && isAuthenticated) {
      // Nếu đã login → redirect về home hoặc trang chỉ định
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  // Đang load
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  // Đã login → hiển thị loading (sẽ redirect)
  if (isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  // Chưa login → hiển thị content
  return <>{children}</>;
}
