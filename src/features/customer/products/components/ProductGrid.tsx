"use client";

import { memo } from "react";
import { ProductCard } from "@/features/customer/home";
import { getProductKey } from "../utils";
import type { Product } from "../types";
interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}
const ProductGrid = memo(({
  products,
  onQuickView
}: ProductGridProps) => {
  return <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
      {products.map((product, index) => <ProductCard key={getProductKey(product, index)} product={product} onQuickView={onQuickView} priority={index < 10} />)}
    </div>;
});
ProductGrid.displayName = "ProductGrid";
export default ProductGrid;