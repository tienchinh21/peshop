export { ProductTable } from "./shopTable/ProductTable";
export { ProductTableHeader } from "./shopTable/ProductTableHeader";
export { ProductTableRow } from "./shopTable/ProductTableRow";
export { ProductTableEmpty } from "./shopTable/ProductTableEmpty";
export { ProductTableLoading } from "./shopTable/ProductTableLoading";
export { ProductTablePagination } from "./shopTable/ProductTablePagination";

export { VoucherTable } from "./voucherTable/VoucherTable";
export { VoucherTableHeader } from "./voucherTable/VoucherTableHeader";
export { VoucherTableRow } from "./voucherTable/VoucherTableRow";
export { VoucherTableLoading } from "./voucherTable/VoucherTableLoading";
export { VoucherTableEmpty } from "./voucherTable/VoucherTableEmpty";
export { VoucherTablePagination } from "./voucherTable/VoucherTablePagination";



// Re-export from new feature location for backward compatibility
export {
  PromotionTable,
  PromotionTableHeader,
  PromotionTableRow,
  PromotionTableLoading,
  PromotionTableEmpty,
  PromotionTablePagination,
} from "@/features/shop/campaigns/promotions/components/table";

// Re-export from new feature location for backward compatibility
export {
  OrderTable,
  OrderTableHeader,
  OrderTableRow,
  OrderTableLoading,
  OrderTableEmpty,
  OrderTablePagination,
} from "@/features/shop/orders/components/table";



