"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import SectionContainer from "./SectionContainer";
import { cn } from "@/lib/utils";

interface HeaderProps {
  /**
   * User data nếu đã đăng nhập
   */
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;

  cartItemCount?: number;

  wishlistCount?: number;

  onLogout?: () => void;
}

export function Header({
  user = null,
  cartItemCount = 0,
  wishlistCount = 0,
  onLogout,
}: HeaderProps) {
  const pathname = usePathname();

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <SectionContainer>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <span className="text-2xl font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline-block">
              PeShop
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl">
            <SearchBar
              placeholder="Tìm kiếm sản phẩm..."
              onSearch={handleSearch}
              cartItemCount={cartItemCount}
              wishlistCount={wishlistCount}
              user={user}
              onLogout={onLogout}
            />
          </div>
        </div>
      </SectionContainer>

      <div className="border-t bg-gray-50">
        <SectionContainer>
          <nav className="flex items-center justify-between py-3 text-sm font-medium">
            <div className="flex items-center space-x-6">
              <Link
                href="/san-pham"
                className={cn(
                  "transition-colors relative pb-1",
                  isActive("/san-pham")
                    ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                Sản phẩm
              </Link>
              <Link
                href="/danh-muc"
                className={cn(
                  "transition-colors relative pb-1",
                  isActive("/danh-muc")
                    ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                Danh mục
              </Link>
              <Link
                href="/khuyen-mai"
                className={cn(
                  "transition-colors relative pb-1",
                  isActive("/khuyen-mai")
                    ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                Khuyến mãi
              </Link>
              <Link
                href="/lien-he"
                className={cn(
                  "transition-colors relative pb-1",
                  isActive("/lien-he")
                    ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                Liên hệ
              </Link>
            </div>

            <Link
              href="/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-primary hover:bg-primary/90 text-primary hover:text-white rounded-md transition-colors"
            >
              Kênh người bán
            </Link>
          </nav>
        </SectionContainer>
      </div>
    </header>
  );
}

export default Header;
