"use client";

import EditPromotionPage from "@/views/pages/shop/chien-dich/muaXtangY/EditPromotionPage";
import { useParams } from "next/navigation";

export default function EditPromotionRoute() {
  const params = useParams();
  const id = params.id as string;

  return <EditPromotionPage promotionId={id} />;
}
