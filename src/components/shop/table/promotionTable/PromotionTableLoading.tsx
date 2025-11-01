import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface PromotionTableLoadingProps {
  rows?: number;
}

export function PromotionTableLoading({ rows = 5 }: PromotionTableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-5 w-[250px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-[80px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-[60px]" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

