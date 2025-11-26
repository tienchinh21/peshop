import { Metadata } from "next";
import HomePageClient from "@/views/pages/home/HomePage";
import { getProductsServerCached } from "@/services/api/users/product.server.cached";

export const metadata: Metadata = {
  title: "Trang chủ - PeShop",
  description: "Chào mừng đến với PeShop",
};

export const revalidate = 180;

export default async function HomePage() {
  let initialProducts = [];

  try {
    const data = await getProductsServerCached({ page: 1, pageSize: 20 });
    //@ts-ignore
    initialProducts = data.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch initial products:", error);
  }

  return <HomePageClient initialProducts={initialProducts} />;
}
