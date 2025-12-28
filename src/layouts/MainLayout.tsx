"use client";

import React from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { Header, Footer } from "@/shared/components/layout";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/lib/store/slices/authSlice";
import { useCartCount } from "@/features/customer/cart";
import { ChatWidget, ChatProvider } from "@/features/customer/chat";
import { toast } from "sonner";
interface MainLayoutProps {
  children: React.ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: cartCount } = useCartCount(isAuthenticated);
  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Đăng xuất thành công");
    router.push("/xac-thuc");
  };
  return (
    <ChatProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          user={
            user
              ? {
                  name: user.name || user.username || "",
                  email: user.email || "",
                  avatar: user.avatar,
                }
              : null
          }
          cartItemCount={_.get(cartCount, "totalItems", 0)}
          wishlistCount={0}
          onLogout={handleLogout}
        />

        {}
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

        {}
        <Footer />
      </div>

      {/* ChatWidget đặt ngoài div chính để tránh stacking context */}
      <ChatWidget />
    </ChatProvider>
  );
}
