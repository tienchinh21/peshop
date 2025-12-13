"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import SectionContainer from "./SectionContainer";
import { cn } from "@/lib/utils";
function SearchBarFallback() {
  return <div className="flex items-center gap-4 w-full">
      <div className="flex-1 max-w-2xl">
        <div className="h-11 w-full rounded-full border-2 border-gray-200 bg-gray-50 animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-11 w-11 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-11 w-11 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-11 w-11 rounded-full bg-gray-100 animate-pulse" />
      </div>
    </div>;
}
interface HeaderProps {
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
  onLogout
}: HeaderProps) {
  const pathname = usePathname();
  const handleSearch = (_query: string) => {};
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };
  return <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <SectionContainer>
        <div className="flex h-14 md:h-16 items-center justify-between gap-2 md:gap-4">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg">
              <span className="text-xl md:text-2xl font-bold text-white">
                P
              </span>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900 hidden sm:inline-block">
              PeShop
            </span>
          </Link>

          <div className="flex-1 max-w-3xl">
            <Suspense fallback={<SearchBarFallback />}>
              <SearchBar placeholder="Tìm kiếm sản phẩm..." onSearch={handleSearch} cartItemCount={cartItemCount} wishlistCount={wishlistCount} user={user} onLogout={onLogout} />
            </Suspense>
          </div>
        </div>
      </SectionContainer>

      <div className="border-t bg-gray-50">
        <SectionContainer>
          <nav className="flex items-center justify-between py-2 md:py-3 text-sm font-medium">
            <div className="flex items-center gap-3 md:gap-6 overflow-x-auto scrollbar-hide flex-1 -mx-2 px-2">
              <Link href="/san-pham" className={cn("transition-colors relative pb-1 whitespace-nowrap flex-shrink-0", isActive("/san-pham") ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary" : "text-gray-700 hover:text-primary")}>
                Sản phẩm
              </Link>
              <Link href="/danh-muc" className={cn("transition-colors relative pb-1 whitespace-nowrap flex-shrink-0", isActive("/danh-muc") ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary" : "text-gray-700 hover:text-primary")}>
                Danh mục
              </Link>
              <Link href="/khuyen-mai" className={cn("transition-colors relative pb-1 whitespace-nowrap flex-shrink-0", isActive("/khuyen-mai") ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary" : "text-gray-700 hover:text-primary")}>
                Khuyến mãi
              </Link>
              <Link href="/lien-he" className={cn("transition-colors relative pb-1 whitespace-nowrap flex-shrink-0", isActive("/lien-he") ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary" : "text-gray-700 hover:text-primary")}>
                Liên hệ
              </Link>
            </div>

            <Link href="/shop" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 border border-primary hover:bg-primary/90 text-primary hover:text-white rounded-md transition-colors text-xs md:text-sm whitespace-nowrap flex-shrink-0 ml-2">
              <span className="hidden sm:inline">Kênh người bán</span>
              <span className="sm:hidden">Bán hàng</span>
            </Link>
          </nav>
        </SectionContainer>
      </div>
    </header>;
}
export default Header;