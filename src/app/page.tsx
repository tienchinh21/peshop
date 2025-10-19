import { Metadata } from "next";
import HomePageClient from "@/views/pages/home/HomePage";
export const metadata: Metadata = {
  title: "Trang chủ - PeShop",
  description: "Chào mừng đến với PeShop",
};

export default function HomePage() {
  return <HomePageClient />;
}
