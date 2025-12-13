"use client";

import { lazy, Suspense, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, Star, MessageCircle, UserPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ProductSkeleton } from "@/shared/components/skeleton";
import type { ShopData } from "../types";
import type { Product } from "@/features/customer/products";
import SectionContainer from "@/shared/components/layout/SectionContainer";
const ProductGrid = lazy(() => import("@/features/customer/products/components/ProductGrid"));
const ProductsPagination = lazy(() => import("@/features/customer/products/components/ProductsPagination"));
interface ShopPageClientProps {
  shopData: ShopData;
  initialProducts: Product[];
  initialPage: number;
  initialTotalPages: number;
}
export default function ShopPageClient({
  shopData,
  initialProducts,
  initialPage,
  initialTotalPages
}: ShopPageClientProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const handlePageChange = useCallback((page: number) => {
    setIsNavigating(true);
    router.push(`/shop-view/${shopData.id}?page=${page}`, {
      scroll: true
    });
  }, [router, shopData.id]);
  const renderSkeletons = useMemo(() => {
    return [...Array(20)].map((_, index) => <ProductSkeleton key={index} />);
  }, []);
  return <div className="min-h-screen">
      {}
      <SectionContainer>
        <div className="relative mb-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {}
              <div className="flex justify-center md:justify-start">
                <div className="h-32 w-32 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                  {shopData.logo ? <img src={shopData.logo} alt={shopData.name} className="h-full w-full rounded-full object-cover" /> : <Store className="h-16 w-16 text-gray-400" />}
                </div>
              </div>

              {}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {shopData.name}
                </h1>

                {shopData.address && <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{shopData.address}</span>
                  </div>}

                {}
                <div className="flex flex-wrap gap-6 mb-4">
                  {}
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                    <span className="font-medium">5.0</span>
                    <span className="text-sm text-gray-500">
                      (Đánh giá shop)
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {shopData.productCount || 0}
                    </span>
                    <span className="text-gray-500"> sản phẩm</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {shopData.followersCount || 0}
                    </span>
                    <span className="text-gray-500"> người theo dõi</span>
                  </div>
                </div>

                {}
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Theo dõi
                  </Button>
                  <Button className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat ngay
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {}
        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Sản phẩm của shop ({initialProducts.length})
            </h2>
          </div>

          {isNavigating && <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {renderSkeletons}
            </div>}

          {!isNavigating && initialProducts.length === 0 && <Card className="p-12">
              <div className="text-center">
                <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Shop chưa có sản phẩm nào</p>
              </div>
            </Card>}

          {!isNavigating && initialProducts.length > 0 && <>
              <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                    {renderSkeletons}
                  </div>}>
                <ProductGrid products={initialProducts} onQuickView={() => {}} />
              </Suspense>

              <Suspense fallback={<div className="h-16 animate-pulse bg-gray-100 rounded" />}>
                <ProductsPagination currentPage={initialPage} totalPages={initialTotalPages} onPageChange={handlePageChange} />
              </Suspense>

              <div className="text-center mt-4 text-sm text-gray-600">
                Hiển thị {initialProducts.length} sản phẩm
              </div>
            </>}
        </div>
      </SectionContainer>
    </div>;
}