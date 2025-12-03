"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Package } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { getShopProducts } from "@/services/api/shops/product-list.service";
import type { ShopProduct } from "@/types/shops/product-list.type";
import _ from "lodash";

interface ProductSelectorProps {
  value: string;
  onChange: (productId: string, product: ShopProduct | null) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  excludeIds?: string[];
}

export function ProductSelector({
  value,
  onChange,
  placeholder = "Chọn sản phẩm",
  label,
  required = false,
  excludeIds = [],
}: ProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadProducts("");
    }
  }, [isOpen]);

  const loadProducts = async (search: string) => {
    setIsLoading(true);
    try {
      const response = await getShopProducts({
        page: 1,
        size: 20,
        search: search || undefined,
        status: 1,
        classify: 0,
      });

      const filteredProducts = _.get(response, "content.response", []).filter(
        (p: ShopProduct) => !excludeIds.includes(p.id)
      );

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = _.debounce((term: string) => {
    loadProducts(term);
  }, 300);

  const handleOptionSelect = (product: ShopProduct) => {
    setSelectedProduct(product);
    onChange(product.id, product);
    setIsOpen(false);
    setSearchTerm("");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const displayValue = selectedProduct
    ? selectedProduct.name
    : value
    ? "Đang tải..."
    : placeholder;

  return (
    <div className="space-y-2 flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span
              className={
                selectedProduct || value ? "text-gray-900" : "text-gray-500"
              }
            >
              {displayValue}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearchChange(e.target.value);
                  }}
                  className="pl-10 text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="px-3 py-8 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-orange-500 border-r-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleOptionSelect(product)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {product.imgMain ? (
                        <img
                          src={product.imgMain}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-orange-600 font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {searchTerm
                      ? "Không tìm thấy sản phẩm"
                      : "Chưa có sản phẩm nào"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
          {selectedProduct.imgMain ? (
            <img
              src={selectedProduct.imgMain}
              alt={selectedProduct.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {selectedProduct.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatPrice(selectedProduct.price)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
