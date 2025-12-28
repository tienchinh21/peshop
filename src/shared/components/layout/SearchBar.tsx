"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Loader2,
  Camera,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchWithSuggestions } from "@/features/customer/search";
import { searchByImage } from "@/features/customer/search/services";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  cartItemCount?: number;
  wishlistCount?: number;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onLogout?: () => void;
}
export function SearchBar({
  placeholder = "Tìm kiếm sản phẩm...",
  onSearch,
  cartItemCount = 0,
  wishlistCount = 0,
  user = null,
  onLogout,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isSearchingByImage, setIsSearchingByImage] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    setSearchQueryDirect,
    suggestions,
    isLoadingSuggestions,
    showSuggestions,
    setShowSuggestions,
    selectedIndex,
    handleSuggestionClick,
    handleKeyDown,
    clearSearch,
    inputRef,
    dropdownRef,
    pendingNavigation,
    consumePendingNavigation,
  } = useSearchWithSuggestions();
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQueryDirect(urlQuery);
    }
  }, [searchParams, setSearchQueryDirect]);
  useEffect(() => {
    if (pendingNavigation) {
      const keyword = consumePendingNavigation();
      if (keyword) {
        onSearch?.(keyword);
        router.push(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
      }
    }
  }, [pendingNavigation, consumePendingNavigation, router, onSearch]);
  const navigateToSearch = useCallback(
    (keyword: string) => {
      if (keyword.trim()) {
        setShowSuggestions(false);
        onSearch?.(keyword);
        router.push(`/tim-kiem?q=${encodeURIComponent(keyword.trim())}`);
      }
    },
    [router, onSearch, setShowSuggestions]
  );
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearch(searchQuery);
  };
  const handleSelectSuggestion = (keyword: string) => {
    handleSuggestionClick(keyword);
  };
  const handleLogout = () => {
    onLogout?.();
    router.push("/xac-thuc");
  };
  const handleImageSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ định dạng JPG, PNG, WEBP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file tối đa 5MB");
      return;
    }
    setIsSearchingByImage(true);
    try {
      const response = await searchByImage({
        image: file,
        page: 1,
        pageSize: 20,
      });
      if (response.data) {
        sessionStorage.setItem(
          "imageSearchResults",
          JSON.stringify(response.data)
        );
        router.push("/tim-kiem?type=image");
      }
    } catch {
      toast.error("Không thể tìm kiếm bằng hình ảnh. Vui lòng thử lại.");
    } finally {
      setIsSearchingByImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };
  return (
    <div className="flex items-center gap-4 w-full">
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              searchQuery.trim().length >= 2 && setShowSuggestions(true)
            }
            className="pl-10 pr-16 h-11 w-full rounded-full border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            autoComplete="off"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 flex items-center gap-2">
            {isLoadingSuggestions ? (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            ) : searchQuery ? (
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isSearchingByImage}
              className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
              title="Tìm kiếm bằng hình ảnh"
            >
              {isSearchingByImage ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSearch}
              className="hidden"
            />
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.keyword}-${index}`}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion.keyword)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0",
                  selectedIndex === index && "bg-gray-100"
                )}
              >
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">
                  {suggestion.keyword}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="flex items-center gap-2">
        {/* <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 rounded-full h-11 w-11"
          onClick={() => router.push("/yeu-thich")}
        >
          <Heart className="h-5 w-5 text-gray-700" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
              {wishlistCount > 9 ? "9+" : wishlistCount}
            </span>
          )}
        </Button> */}

        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 rounded-full h-11 w-11"
          onClick={() => router.push("/gio-hang")}
        >
          <ShoppingCart className="h-5 w-5 text-gray-700" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount > 9 ? "9+" : cartItemCount}
            </span>
          )}
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 rounded-full h-11 w-11"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-700" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/tai-khoan")}>
                <User className="mr-2 h-4 w-4" />
                <span>Tài khoản</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/don-hang")}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Đơn hàng</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/yeu-thich")}>
                <Heart className="mr-2 h-4 w-4" />
                <span>Yêu thích</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-full h-11 w-11"
            onClick={() => router.push("/xac-thuc")}
          >
            <User className="h-5 w-5 text-gray-700" />
          </Button>
        )}
      </div>
    </div>
  );
}
export default SearchBar;
