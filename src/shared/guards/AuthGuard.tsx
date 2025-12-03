"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /**
   * Require specific role (optional)
   */
  requireRole?: string;
}

/**
 * AuthGuard - Bảo vệ trang yêu cầu authentication
 * Nếu chưa login → redirect đến /xac-thuc
 * Có thể yêu cầu role cụ thể (VD: "Shop", "Admin")
 */
export function AuthGuard({ children, fallback, requireRole }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  useEffect(() => {
    // Chỉ check khi đã load xong
    if (!isLoading) {
      // Nếu chưa login → redirect
      if (!isAuthenticated) {
        router.push("/xac-thuc");
        return;
      }

      // Nếu yêu cầu role cụ thể → check role
      if (requireRole && !hasRole(requireRole)) {
        router.push("/"); // Redirect về home nếu không có quyền
      }
    }
  }, [isLoading, isAuthenticated, requireRole, hasRole, router]);

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

  // Chưa login → hiển thị loading (sẽ redirect)
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  // Nếu yêu cầu role nhưng không có → hiển thị loading (sẽ redirect)
  if (requireRole && !hasRole(requireRole)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  // Đã login (và có đủ quyền nếu yêu cầu) → hiển thị content
  return <>{children}</>;
}
