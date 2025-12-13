"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks";
interface PublicGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}
export function PublicGuard({
  children,
  fallback,
  redirectTo = "/"
}: PublicGuardProps) {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (isHydrated && !isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isHydrated, isLoading, isAuthenticated, redirectTo, router]);
  if (!isHydrated) {
    return <>{children}</>;
  }
  if (isLoading) {
    return fallback || <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
  }
  if (isAuthenticated) {
    return fallback || <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
  }
  return <>{children}</>;
}