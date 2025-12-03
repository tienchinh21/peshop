import Image from "next/image";
import { Button } from "@/shared/components/ui/button";

interface ProductSaleCardProps {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice: number;
  image: string;
  store: string;
  storeColor: string;
  rating: number;
  reviewCount: number;
  badges?: string[];
  colors?: string;
  totalQuantity: number;
  soldQuantity: number;
}

export default function ProductSaleCard({
  id,
  name,
  currentPrice,
  originalPrice,
  image,
  store,
  storeColor,
  rating,
  reviewCount,
  badges = [],
  colors,
  totalQuantity,
  soldQuantity,
}: ProductSaleCardProps) {
  const discountPercentage = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );

  const soldPercentage = Math.round((soldQuantity / totalQuantity) * 100);
  const remainingQuantity = totalQuantity - soldQuantity;

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs font-medium rounded-full text-white ${
                  badge === "Sale"
                    ? "bg-red-500"
                    : badge === "Hot"
                    ? "bg-orange-500"
                    : "bg-blue-500"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Product Name - Fixed height */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight h-10 flex items-start">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2 h-6">
          <span className="text-lg font-bold text-gray-900">
            ${currentPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${originalPrice.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
            -{discountPercentage}%
          </span>
        </div>

        {/* Store */}
        <div className="flex items-center gap-2 mb-2 h-5">
          <div className={`w-4 h-4 rounded-full ${storeColor}`} />
          <span className="text-xs text-gray-600">{store}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3 h-5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Colors - Fixed height container */}
        <div className="h-5 mb-3">
          {colors && <div className="text-xs text-gray-600">{colors}</div>}
        </div>

        {/* Sale Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Sold: {soldQuantity}</span>
            <span className="text-xs text-gray-600">{soldPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${soldPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              Available: {remainingQuantity}
            </span>
            <span className="text-xs text-gray-500">
              Total: {totalQuantity}
            </span>
          </div>
        </div>

        {/* Action Buttons - Hidden by default, shown on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="default"
            size="default"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm h-10"
          >
            Add to cart
          </Button>
          <Button
            variant="outline"
            size="default"
            className="flex-1 text-purple-600 border-purple-600 hover:bg-purple-50 text-sm h-10"
          >
            Quick View
          </Button>
        </div>
      </div>
    </div>
  );
}
