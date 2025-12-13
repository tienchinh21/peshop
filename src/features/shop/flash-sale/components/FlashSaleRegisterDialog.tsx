"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Loader2, Search, Package } from "lucide-react";
import { joinFlashSale, FlashSaleProductRegistration } from "../services/flash-sale.service";
import { shopFlashSaleKeys } from "../hooks/useShopFlashSale";
import { formatFlashSaleDateTime } from "../utils/flash-sale.utils";
import { getShopProducts } from "@/features/shop/products/services/product-list.service";
import type { ShopProduct } from "@/features/shop/products/types";
interface SelectedProduct {
  product: ShopProduct;
  percentDecrease: number;
  quantity: number;
  orderLimit: number;
}
export interface FlashSaleRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashSaleId: string;
  startTime: string;
  endTime: string;
}
export function FlashSaleRegisterDialog({
  open,
  onOpenChange,
  flashSaleId,
  startTime,
  endTime
}: FlashSaleRegisterDialogProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Map<string, SelectedProduct>>(new Map());
  const {
    data: productsData,
    isLoading: isLoadingProducts
  } = useQuery({
    queryKey: ["shop-products-for-flash-sale", search],
    queryFn: () => getShopProducts({
      page: 1,
      size: 50,
      search: search || undefined,
      status: 1
    }),
    enabled: open
  });
  const products = productsData?.content?.response || [];
  const mutation = useMutation({
    mutationFn: (data: FlashSaleProductRegistration[]) => joinFlashSale(flashSaleId, data),
    onSuccess: () => {
      toast.success("Đăng ký Flash Sale thành công!");
      queryClient.invalidateQueries({
        queryKey: shopFlashSaleKeys.all
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error("Đăng ký thất bại", {
        description: error.message
      });
    }
  });
  const resetForm = () => {
    setSelectedProducts(new Map());
    setSearch("");
  };
  const toggleProduct = (product: ShopProduct) => {
    const newSelected = new Map(selectedProducts);
    if (newSelected.has(product.id)) {
      newSelected.delete(product.id);
    } else {
      newSelected.set(product.id, {
        product,
        percentDecrease: 10,
        quantity: 10,
        orderLimit: 2
      });
    }
    setSelectedProducts(newSelected);
  };
  const updateProductConfig = (productId: string, field: "percentDecrease" | "quantity" | "orderLimit", value: number) => {
    const newSelected = new Map(selectedProducts);
    const item = newSelected.get(productId);
    if (item) {
      newSelected.set(productId, {
        ...item,
        [field]: value
      });
      setSelectedProducts(newSelected);
    }
  };
  const handleSubmit = () => {
    if (selectedProducts.size === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    const data: FlashSaleProductRegistration[] = Array.from(selectedProducts.values()).map(item => ({
      productId: item.product.id,
      percentDecrease: item.percentDecrease,
      quantity: item.quantity,
      orderLimit: item.orderLimit
    }));
    mutation.mutate(data);
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Đăng ký tham gia Flash Sale</DialogTitle>
          <DialogDescription>
            Chọn sản phẩm và cấu hình giảm giá để tham gia Flash Sale
          </DialogDescription>
        </DialogHeader>

        {}
        <div className="flex-shrink-0 p-3 bg-orange-50 rounded-lg text-sm border border-orange-200">
          <p className="font-medium text-orange-800">
            Flash Sale: #{flashSaleId.slice(0, 8)}...
          </p>
          <p className="text-orange-600 mt-1">
            {formatFlashSaleDateTime(startTime)} →{" "}
            {formatFlashSaleDateTime(endTime)}
          </p>
        </div>

        {}
        <div className="flex-shrink-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input placeholder="Tìm kiếm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        {}
        <div className="flex-1 overflow-y-auto border rounded-lg">
          {isLoadingProducts ? <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="flex gap-3">
                  <Skeleton className="size-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>)}
            </div> : products.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
              <Package className="size-12 mb-2 opacity-50" />
              <p>Không tìm thấy sản phẩm</p>
            </div> : <div className="divide-y">
              {products.map(product => {
            const isSelected = selectedProducts.has(product.id);
            const config = selectedProducts.get(product.id);
            return <div key={product.id} className={`p-3 transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                    <div className="flex items-start gap-3">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleProduct(product)} />
                      <div className="relative size-14 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={product.imgMain || "/placeholder-product.svg"} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-sm text-orange-600 font-medium mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>

                    {}
                    {isSelected && config && <div className="mt-3 ml-7 grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Giảm giá (%)</Label>
                          <Input type="number" min={1} max={99} value={config.percentDecrease} onChange={e => updateProductConfig(product.id, "percentDecrease", parseInt(e.target.value) || 0)} className="h-8 text-sm" />
                        </div>
                        <div>
                          <Label className="text-xs">Số lượng</Label>
                          <Input type="number" min={1} value={config.quantity} onChange={e => updateProductConfig(product.id, "quantity", parseInt(e.target.value) || 0)} className="h-8 text-sm" />
                        </div>
                        <div>
                          <Label className="text-xs">Giới hạn/đơn</Label>
                          <Input type="number" min={1} value={config.orderLimit} onChange={e => updateProductConfig(product.id, "orderLimit", parseInt(e.target.value) || 0)} className="h-8 text-sm" />
                        </div>
                      </div>}
                  </div>;
          })}
            </div>}
        </div>

        {}
        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-600">
              Đã chọn: <strong>{selectedProducts.size}</strong> sản phẩm
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit} disabled={mutation.isPending || selectedProducts.size === 0}>
                {mutation.isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
                Đăng ký ({selectedProducts.size})
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}