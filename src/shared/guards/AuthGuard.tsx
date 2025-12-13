"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks";
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireRole?: string;
}
export function AuthGuard({
  children,
  fallback,
  requireRole
}: AuthGuardProps) {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    hasRole
  } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (isHydrated && !isLoading) {
      if (!isAuthenticated) {
        router.push("/xac-thuc");
        return;
      }
      if (requireRole && !hasRole(requireRole)) {
        router.push("/");
      }
    }
  }, [isHydrated, isLoading, isAuthenticated, requireRole, hasRole, router]);
  if (!isHydrated || isLoading) {
    return fallback || <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
  }
  if (!isAuthenticated) {
    return fallback || <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
  }
  if (requireRole && !hasRole(requireRole)) {
    return fallback || <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
  }
  return <>{children}</>;
}