"use client";

import React, { useState, useEffect } from "react";
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
import { ArrowLeft, Info, Plus, Trash2, Loader2 } from "lucide-react";
import type {
  Promotion,
  PromotionGift,
  PromotionRule,
} from "@/types/shops/promotion.type";
import { ProductSelector } from "@/components/shop/ProductSelector";
import type { ShopProduct } from "@/types/shops/product-list.type";
import {
  useUpdatePromotion,
  useAddPromotionRules,
  useAddPromotionGifts,
  useDeletePromotionRules,
  useDeletePromotionGifts,
} from "@/hooks/shop/useShopPromotions";
import { toast } from "sonner";
import _ from "lodash";

interface EditPromotionPageProps {
  promotionId: string;
}

export default function EditPromotionPage({
  promotionId,
}: EditPromotionPageProps) {
  const router = useRouter();
  const updateMutation = useUpdatePromotion();
  const addRulesMutation = useAddPromotionRules();
  const addGiftsMutation = useAddPromotionGifts();
  const deleteRulesMutation = useDeletePromotionRules();
  const deleteGiftsMutation = useDeletePromotionGifts();

  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: 1,
    startTime: "",
    endTime: "",
    totalUsageLimit: 0,
  });

  const [rules, setRules] = useState<PromotionRule[]>([]);
  const [gifts, setGifts] = useState<PromotionGift[]>([]);

  const [rulesToDelete, setRulesToDelete] = useState<string[]>([]);
  const [giftsToDelete, setGiftsToDelete] = useState<string[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem(`promotion_${promotionId}`);
    if (storedData) {
      try {
        const promotionData: Promotion = JSON.parse(storedData);
        setPromotion(promotionData);

        setFormData({
          name: promotionData.name,
          status: promotionData.status,
          startTime: new Date(promotionData.startTime).toISOString().slice(0, 16),
          endTime: new Date(promotionData.endTime).toISOString().slice(0, 16),
          totalUsageLimit: promotionData.totalUsageLimit,
        });

        if (promotionData.rules && promotionData.rules.length > 0) {
          setRules(promotionData.rules);
        }

        if (promotionData.gifts && promotionData.gifts.length > 0) {
          setGifts(promotionData.gifts);
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu chương trình");
        router.push("/shop/chien-dich/muaXtangY");
      }
    } else {
      toast.error("Không thể tải dữ liệu chương trình");
      router.push("/shop/chien-dich/muaXtangY");
    }
  }, [promotionId, router]);

  const handleBack = () => {
    router.push("/shop/chien-dich/muaXtangY");
  };

  const handleAddRule = () => {
    setRules([...rules, { productId: "", quantity: 1 }]);
  };

  const handleRemoveRule = (index: number) => {
    const rule = rules[index];
    if (rule.id) {
      setRulesToDelete([...rulesToDelete, rule.id]);
    }
    setRules(_.filter(rules, (_, i) => i !== index));
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
    newRules[index] = {
      ...newRules[index],
      productId,
      product: product ? {
        id: product.id,
        name: product.name,
        imgMain: product.imgMain,
      } : undefined,
    };
    setRules(newRules);
  };

  const handleAddGift = () => {
    setGifts([
      ...gifts,
      { productId: "", giftQuantity: 1, maxGiftPerOrder: 1 },
    ]);
  };

  const handleRemoveGift = (index: number) => {
    const gift = gifts[index];
    if (gift.id) {
      setGiftsToDelete([...giftsToDelete, gift.id]);
    }
    setGifts(_.filter(gifts, (_, i) => i !== index));
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
    newGifts[index] = {
      ...newGifts[index],
      productId,
      product: product ? {
        id: product.id,
        name: product.name,
        imgMain: product.imgMain,
      } : undefined,
    };
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

    const hasEmptyRules = _.some(rules, (rule) => !rule.productId);
    if (hasEmptyRules) {
      toast.error("Vui lòng chọn sản phẩm cho tất cả điều kiện mua");
      return;
    }

    const hasEmptyGifts = _.some(gifts, (gift) => !gift.productId);
    if (hasEmptyGifts) {
      toast.error("Vui lòng chọn sản phẩm cho tất cả quà tặng");
      return;
    }

    try {
      const promises: Promise<any>[] = [];

      const existingRules = _.filter(rules, (r) => r.id);
      const newRules = _.filter(rules, (r) => !r.id);
      const existingGifts = _.filter(gifts, (g) => g.id);
      const newGifts = _.filter(gifts, (g) => !g.id);

      if (!_.isEmpty(existingRules) || !_.isEmpty(existingGifts)) {
        const updatePayload = {
          promotionUpdateDto: {
            name: formData.name,
            status: formData.status,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            totalUsageLimit: formData.totalUsageLimit,
          },
          promotionGifts: _.map(existingGifts, (g) => ({
            id: g.id!,
            productId: _.get(g, "productId") || _.get(g, "product.id", ""),
            giftQuantity: g.giftQuantity,
          })),
          promotionRules: _.map(existingRules, (r) => ({
            id: r.id!,
            productId: _.get(r, "productId") || _.get(r, "product.id", ""),
            quantity: r.quantity,
          })),
        };
        promises.push(updateMutation.mutateAsync({ id: promotionId, payload: updatePayload }));
      }

      if (!_.isEmpty(newRules)) {
        const addRulesPayload = _.map(newRules, (r) => ({
          productId: _.get(r, "productId") || _.get(r, "product.id", ""),
          quantity: r.quantity,
        }));
        promises.push(addRulesMutation.mutateAsync({ id: promotionId, payload: addRulesPayload }));
      }

      if (!_.isEmpty(newGifts)) {
        const addGiftsPayload = _.map(newGifts, (g) => ({
          productId: _.get(g, "productId") || _.get(g, "product.id", ""),
          giftQuantity: g.giftQuantity,
        }));
        promises.push(addGiftsMutation.mutateAsync({ id: promotionId, payload: addGiftsPayload }));
      }

      if (!_.isEmpty(rulesToDelete)) {
        promises.push(deleteRulesMutation.mutateAsync(rulesToDelete));
      }

      if (!_.isEmpty(giftsToDelete)) {
        promises.push(deleteGiftsMutation.mutateAsync(giftsToDelete));
      }

      await Promise.all(promises);
      toast.success("Cập nhật chương trình thành công");
      router.push("/shop/chien-dich/muaXtangY");
    } catch (error) {
      // Errors handled by mutations
    }
  };

  if (!promotion) {
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

  const isSubmitting =
    updateMutation.isPending ||
    addRulesMutation.isPending ||
    addGiftsMutation.isPending ||
    deleteRulesMutation.isPending ||
    deleteGiftsMutation.isPending;

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
            {_.isEmpty(rules) ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Chưa có điều kiện mua hàng
              </p>
            ) : (
              _.map(rules, (rule, index) => {
                const productId = _.get(rule, "productId") || _.get(rule, "product.id");
                return (
                  <div
                    key={index}
                    className="flex gap-4 items-end p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <ProductSelector
                        label="Sản phẩm"
                        placeholder="Chọn sản phẩm"
                        value={productId || ""}
                        onChange={(productId, product) =>
                          handleRuleProductChange(index, productId, product)
                        }
                        required
                        excludeIds={_.compact(
                          _.map(rules, (r, i) =>
                            i !== index ? _.get(r, "productId") || _.get(r, "product.id") : null
                          )
                        )}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Số lượng</Label>
                      <Input
                        type="number"
                        min="1"
                        value={_.get(rule, "quantity", 1)}
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
                );
              })
            )}
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
            {_.isEmpty(gifts) ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Chưa có quà tặng
              </p>
            ) : (
              _.map(gifts, (gift, index) => {
                const productId = _.get(gift, "productId") || _.get(gift, "product.id");
                return (
                  <div
                    key={index}
                    className="flex gap-4 items-end p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <ProductSelector
                        label="Sản phẩm quà tặng"
                        placeholder="Chọn sản phẩm quà tặng"
                        value={productId || ""}
                        onChange={(productId, product) =>
                          handleGiftProductChange(index, productId, product)
                        }
                        required
                        excludeIds={_.compact(
                          _.map(gifts, (g, i) =>
                            i !== index ? _.get(g, "productId") || _.get(g, "product.id") : null
                          )
                        )}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Số lượng tặng</Label>
                      <Input
                        type="number"
                        min="1"
                        value={_.get(gift, "giftQuantity", 1)}
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
                        value={_.get(gift, "maxGiftPerOrder", 1)}
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
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleBack}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
