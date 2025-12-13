"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ShopSidebar } from "@/components/shop/ShopSidebar";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar";
import { ShopGuard } from "@/shared/guards";
import { useAuth } from "@/shared/hooks";
import { ShopChatProvider, ShopChatWidget } from "@/features/shop/chat";
interface ShopLayoutProps {
  children: React.ReactNode;
}
export default function ShopLayout({ children }: ShopLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const isShopRegistrationPage = pathname === "/shop/dang-ky";
  return (
    <ShopGuard>
      <ShopChatProvider>
        {isShopRegistrationPage ? (
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
            {/* Shop Chat Widget - Fixed position, doesn't interfere with content */}
            {/* Requirements: 8.1, 8.2 - Accessible from any shop management page */}
            <ShopChatWidget />
          </SidebarProvider>
        )}
      </ShopChatProvider>
    </ShopGuard>
  );
}
