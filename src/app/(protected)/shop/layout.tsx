"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ShopGuard } from "@/components/guards";
import { useAuth } from "@/hooks/useAuth";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const isShopRegistrationPage = pathname === "/shop/dang-ky";

  return (
    <ShopGuard>
      {isShopRegistrationPage ? (
        // Registration page should not show the seller sidebar
        <>{children}</>
      ) : (
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-gray-50">
            <ShopSidebar />
            <SidebarInset className="flex-1 flex flex-col">
              <ShopHeader onLogout={logout} />
              <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      )}
    </ShopGuard>
  );
}
