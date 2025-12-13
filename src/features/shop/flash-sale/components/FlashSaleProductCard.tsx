"use client";

import Image from "next/image";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Package } from "lucide-react";
export interface FlashSaleProductCardProps {
  id: string;
  name: string;
  imgMain: string;
}
export function FlashSaleProductCard({
  id,
  name,
  imgMain
}: FlashSaleProductCardProps) {
  return <Card className="overflow-hidden">
      <div className="relative aspect-square bg-gray-100">
        {imgMain ? <Image src={imgMain} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" /> : <div className="flex items-center justify-center h-full">
            <Package className="size-12 text-gray-400" />
          </div>}
      </div>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground mb-1">ID: {id}</p>
        <h3 className="text-sm font-medium line-clamp-2" title={name}>
          {name}
        </h3>
      </CardContent>
    </Card>;
}