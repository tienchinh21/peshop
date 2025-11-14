"use client";

import PromotionDetailPage from "@/views/pages/shop/chien-dich/muaXtangY/PromotionDetailPage";
import { useParams } from "next/navigation";

export default function PromotionDetailRoute() {
  const params = useParams();
  const id = params.id as string;

  return <PromotionDetailPage promotionId={id} />;
}

