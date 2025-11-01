import PromotionListPageView from "@/views/pages/shop/chien-dich/muaXtangY/PromotionListPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh sách chương trình mua X tặng Y",
  description: "Danh sách chương trình mua X tặng Y",
};

export default function PromotionListPage() {
  return <PromotionListPageView />;
}
