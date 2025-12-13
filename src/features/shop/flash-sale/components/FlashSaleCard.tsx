"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlashSaleStatus } from "../types/flash-sale.types";
import { formatFlashSaleDateTime, getStatusColor, getStatusText, isFlashSaleActive, canRegisterFlashSale } from "../utils/flash-sale.utils";
import { FlashSaleRegisterDialog } from "./FlashSaleRegisterDialog";
export interface FlashSaleCardProps {
  id: string;
  startTime: string;
  endTime: string;
  status: FlashSaleStatus;
  showRegisterButton?: boolean;
  onRegister?: (flashSaleId: string) => void;
}
export function FlashSaleCard({
  id,
  startTime,
  endTime,
  status,
  showRegisterButton = true
}: FlashSaleCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const isActive = isFlashSaleActive(status);
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);
  const canRegister = canRegisterFlashSale(status);
  const shortId = id.length > 8 ? `${id.slice(0, 8)}...` : id;
  return <>
      <div className={cn("relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md", isActive && "border-green-200 bg-green-50/30", status === FlashSaleStatus.NotStarted && "border-gray-200", status === FlashSaleStatus.Ended && "border-red-100 bg-red-50/20 opacity-75")}>
        {}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Mã Flash Sale</p>
            <p className="font-medium text-gray-900 text-sm" title={id}>
              #{shortId}
            </p>
          </div>
          <Badge variant={statusColor === "green" ? "default" : statusColor === "red" ? "destructive" : "secondary"} className={cn("text-xs", statusColor === "green" && "bg-green-500 hover:bg-green-600")}>
            {statusText}
          </Badge>
        </div>

        {}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-gray-400" />
            <span className="text-gray-600">
              {formatFlashSaleDateTime(startTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ArrowRight className="size-4 text-gray-400" />
            <span className="text-gray-600">
              {formatFlashSaleDateTime(endTime)}
            </span>
          </div>
        </div>

        {}
        {showRegisterButton && canRegister && <Button variant={isActive ? "default" : "outline"} size="sm" className="w-full" onClick={() => setShowDialog(true)}>
            Đăng ký tham gia
          </Button>}

        {}
        {status === FlashSaleStatus.Ended && <p className="text-center text-xs text-gray-400">
            Flash Sale đã kết thúc
          </p>}
      </div>

      {}
      <FlashSaleRegisterDialog open={showDialog} onOpenChange={setShowDialog} flashSaleId={id} startTime={startTime} endTime={endTime} />
    </>;
}