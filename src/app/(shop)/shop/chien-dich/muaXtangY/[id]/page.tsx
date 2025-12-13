"use client";

import { PromotionDetailPage } from "@/features/shop/campaigns/promotions";
import { useParams } from "next/navigation";
export default function PromotionDetailRoute() {
  const params = useParams();
  const id = params.id as string;
  return <PromotionDetailPage promotionId={id} />;
}