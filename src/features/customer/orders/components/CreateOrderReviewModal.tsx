"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Star, Loader2 } from "lucide-react";
import { useCreateOrderReview } from "@/features/customer/reviews/hooks/useProductReviews";

interface CreateOrderReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  productId: string;
  variantId: string;
  productName?: string;
}

export function CreateOrderReviewModal({ open, onOpenChange, orderId, productId, variantId, productName }: CreateOrderReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const { mutate, isPending } = useCreateOrderReview(orderId);

  const isValid = useMemo(() => {
    return rating >= 1 && rating <= 5 && content.trim().length > 0;
  }, [rating, content]);

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.size <= 5 * 1024 * 1024);
    setImages(validFiles);
  };

  const handleSubmit = () => {
    if (!isValid) return;
    mutate(
      {
        orderId,
        productId,
        variantId,
        content: content.trim(),
        rating,
        images
      },
      {
        onSuccess: () => {
          setContent("");
          setImages([]);
          setRating(5);
          onOpenChange(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {productName && <div className="text-sm font-medium">{productName}</div>}
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setRating(idx + 1)}
                className="p-1"
                aria-label={`rate-${idx + 1}`}
              >
                <Star className={idx < rating ? "h-5 w-5 fill-orange-500 text-orange-500" : "h-5 w-5 fill-gray-200 text-gray-300"} />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Nội dung đánh giá"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="space-y-2">
            <Input type="file" multiple accept="image/*" onChange={handleSelectImages} />
            <p className="text-xs text-muted-foreground">Hỗ trợ JPG, PNG, WEBP, tối đa 5MB mỗi ảnh</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Gửi đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrderReviewModal;
