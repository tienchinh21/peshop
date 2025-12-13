import { CreatePromotionPage as CreatePromotionPageView } from "@/features/shop/campaigns/promotions";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tạo chương trình mua X tặng Y",
  description: "Tạo chương trình mua X tặng Y"
};
export default function CreatePromotionPage() {
  return <CreatePromotionPageView />;
}