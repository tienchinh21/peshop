import { Zap } from "lucide-react";
export interface FlashSaleEmptyStateProps {
  title?: string;
  description?: string;
}
export function FlashSaleEmptyState({
  title = "Không có Flash Sale",
  description = "Hiện tại không có chương trình Flash Sale nào trong khoảng thời gian này."
}: FlashSaleEmptyStateProps) {
  return <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Zap className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>;
}