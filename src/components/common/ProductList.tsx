"use client";

import { useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Product } from "@/types/users/product.types";
import ProductCard from "@/views/pages/home/components/ProductCard";
import { filterValidProducts, getProductKey } from "@/lib/utils/product.utils";

interface ProductListProps {
  products: Product[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  onQuickView?: (product: Product) => void;
  showViewAllButton?: boolean;
}

export default function ProductList({
  products,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onQuickView,
  showViewAllButton = false,
}: ProductListProps) {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        // User is approaching the load more button
        // Could auto-trigger here, but keeping manual button click
      }
    },
    [hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  const handleViewAll = () => {
    router.push("/san-pham?page=2");
  };

  const validProducts = useMemo(() => {
    return filterValidProducts(products);
  }, [products]);

  if (!validProducts || validProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {validProducts.map((product, index) => (
          <ProductCard
            key={getProductKey(product, index)}
            product={product}
            onQuickView={onQuickView}
            priority={index < 10}
          />
        ))}
      </div>

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <Button
            onClick={showViewAllButton ? handleViewAll : onLoadMore}
            disabled={isFetchingNextPage && !showViewAllButton}
            size="lg"
            variant="outline"
            className="min-w-[200px]"
          >
            {isFetchingNextPage && !showViewAllButton ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : showViewAllButton ? (
              "Xem tất cả sản phẩm"
            ) : (
              "Xem thêm"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
