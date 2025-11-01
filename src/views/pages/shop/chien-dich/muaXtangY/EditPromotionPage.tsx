"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Info, Plus, Trash2 } from "lucide-react";
import type {
  UpdatePromotionPayload,
  PromotionGift,
  PromotionRule,
} from "@/types/shops/promotion.type";
import { ProductSelector } from "@/components/shop/ProductSelector";
import type { ShopProduct } from "@/types/shops/product-list.type";
import { useEffect } from "react";
import {
  usePromotionDetail,
  useUpdatePromotion,
} from "@/hooks/shop/useShopPromotions";
import { toast } from "sonner";
interface EditPromotionPageProps {
  promotionId: string;
}

export default function EditPromotionPage({
  promotionId,
}: EditPromotionPageProps) {
  const router = useRouter();
  const { data: promotionData, isLoading } = usePromotionDetail(promotionId);
  const updateMutation = useUpdatePromotion();

  const [formData, setFormData] = useState({
    name: "",
    status: 1,
    startTime: "",
    endTime: "",
    totalUsageLimit: 0,
  });

  const [rules, setRules] = useState<PromotionRule[]>([
    { productId: "", quantity: 1 },
  ]);

  const [gifts, setGifts] = useState<PromotionGift[]>([
    { productId: "", giftQuantity: 1, maxGiftPerOrder: 1 },
  ]);

  useEffect(() => {
    if (promotionData) {
      //@ts-ignore
      const promotion = promotionData.content;

      setFormData({
        name: promotion.name,
        status: promotion.status,
        startTime: new Date(promotion.startTime).toISOString().slice(0, 16),
        endTime: new Date(promotion.endTime).toISOString().slice(0, 16),
        totalUsageLimit: promotion.totalUsageLimit,
      });

      if (promotion.rules && promotion.rules.length > 0) {
        setRules(promotion.rules);
      }

      if (promotion.gifts && promotion.gifts.length > 0) {
        setGifts(promotion.gifts);
      }
    }
  }, [promotionData]);

  const handleBack = () => {
    router.push("/shop/chien-dich/muaXtangY");
  };

  const handleAddRule = () => {
    setRules([...rules, { productId: "", quantity: 1 }]);
  };

  const handleRemoveRule = (index: number) => {
    if (rules.length > 1) {
      setRules(rules.filter((_, i) => i !== index));
    }
  };

  const handleRuleChange = (
    index: number,
    field: keyof PromotionRule,
    value: string | number
  ) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const handleRuleProductChange = (
    index: number,
    productId: string,
    product: ShopProduct | null
  ) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], productId };
    setRules(newRules);
  };

  const handleAddGift = () => {
    setGifts([
      ...gifts,
      { productId: "", giftQuantity: 1, maxGiftPerOrder: 1 },
    ]);
  };

  const handleRemoveGift = (index: number) => {
    if (gifts.length > 1) {
      setGifts(gifts.filter((_, i) => i !== index));
    }
  };

  const handleGiftChange = (
    index: number,
    field: keyof PromotionGift,
    value: string | number
  ) => {
    const newGifts = [...gifts];
    newGifts[index] = { ...newGifts[index], [field]: value };
    setGifts(newGifts);
  };

  const handleGiftProductChange = (
    index: number,
    productId: string,
    product: ShopProduct | null
  ) => {
    const newGifts = [...gifts];
    newGifts[index] = { ...newGifts[index], productId };
    setGifts(newGifts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên chương trình");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc");
      return;
    }

    const hasEmptyRules = rules.some((rule) => !rule.productId);
    if (hasEmptyRules) {
      toast.error("Vui lòng chọn sản phẩm cho tất cả điều kiện mua");
      return;
    }

    const hasEmptyGifts = gifts.some((gift) => !gift.productId);
    if (hasEmptyGifts) {
      toast.error("Vui lòng chọn sản phẩm cho tất cả quà tặng");
      return;
    }

    const payload: UpdatePromotionPayload = {
      promotionCreateDto: {
        name: formData.name,
        status: formData.status,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        totalUsageLimit: formData.totalUsageLimit,
      },
      promotionGifts: gifts,
      promotionRules: rules,
    };

    try {
      await updateMutation.mutateAsync({ id: promotionId, payload });
      router.push("/shop/chien-dich/muaXtangY");
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chỉnh sửa chương trình Mua X Tặng Y
            </h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
              <p className="mt-4 text-sm text-gray-500">Đang tải...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chỉnh sửa chương trình Mua X Tặng Y
            </h1>
            <p className="text-sm text-gray-500">
              Cập nhật thông tin chương trình khuyến mãi
            </p>
          </div>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Lưu ý:</strong> Chương trình khuyến mãi sẽ tặng toàn bộ sản
          phẩm, không tặng theo biến thể (variant). Khách hàng sẽ nhận được sản
          phẩm quà tặng khi đáp ứng đủ điều kiện mua hàng.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chương trình</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên chương trình <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ví dụ: Mua 2 tặng 1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">
                  Thời gian kết thúc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Hoạt động</SelectItem>
                    <SelectItem value="0">Tạm dừng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalUsageLimit">Giới hạn sử dụng</Label>
                <Input
                  id="totalUsageLimit"
                  type="number"
                  min="0"
                  value={formData.totalUsageLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalUsageLimit: Number(e.target.value),
                    })
                  }
                  placeholder="0 = không giới hạn"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Điều kiện mua hàng (Mua X)</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRule}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="flex gap-4 items-end p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <ProductSelector
                    label="Sản phẩm"
                    placeholder="Chọn sản phẩm"
                    value={rule.productId}
                    onChange={(productId, product) =>
                      handleRuleProductChange(index, productId, product)
                    }
                    required
                    excludeIds={rules
                      .filter((_, i) => i !== index)
                      .map((r) => r.productId)
                      .filter(Boolean)}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Số lượng</Label>
                  <Input
                    type="number"
                    min="1"
                    value={rule.quantity}
                    onChange={(e) =>
                      handleRuleChange(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>
                {rules.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRule(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quà tặng (Tặng Y)</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddGift}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm quà tặng
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {gifts.map((gift, index) => (
              <div
                key={index}
                className="flex gap-4 items-end p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <ProductSelector
                    label="Sản phẩm quà tặng"
                    placeholder="Chọn sản phẩm quà tặng"
                    value={gift.productId}
                    onChange={(productId, product) =>
                      handleGiftProductChange(index, productId, product)
                    }
                    required
                    excludeIds={gifts
                      .filter((_, i) => i !== index)
                      .map((g) => g.productId)
                      .filter(Boolean)}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Số lượng tặng</Label>
                  <Input
                    type="number"
                    min="1"
                    value={gift.giftQuantity}
                    onChange={(e) =>
                      handleGiftChange(
                        index,
                        "giftQuantity",
                        Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Tối đa/đơn</Label>
                  <Input
                    type="number"
                    min="1"
                    value={gift.maxGiftPerOrder}
                    onChange={(e) =>
                      handleGiftChange(
                        index,
                        "maxGiftPerOrder",
                        Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>
                {gifts.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveGift(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleBack}>
            Hủy
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending
              ? "Đang cập nhật..."
              : "Cập nhật chương trình"}
          </Button>
        </div>
      </form>
    </div>
  );
}
