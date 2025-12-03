import { Metadata } from "next";
import { HomePage as HomePageClient } from "@/features/customer/home";
import { getProductsServerCached } from "@/features/customer/products";

export const metadata: Metadata = {
  title: "Trang chủ - PeShop",
  description: "Chào mừng đến với PeShop",
};

export const revalidate = 180;

export default async function HomePage() {
  let initialProducts = [];

  try {
    const data = await getProductsServerCached(1, 20);
    //@ts-ignore
    initialProducts = data.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
  }

  return <HomePageClient initialProducts={initialProducts} />;
}
