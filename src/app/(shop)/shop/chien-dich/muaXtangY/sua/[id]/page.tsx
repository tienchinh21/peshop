"use client";

import { EditPromotionPage } from "@/features/shop/campaigns/promotions";
import { useParams } from "next/navigation";

export default function EditPromotionRoute() {
  const params = useParams();
  const id = params.id as string;

  return <EditPromotionPage promotionId={id} />;
}
