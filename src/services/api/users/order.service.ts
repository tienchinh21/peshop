// Re-export from new location for backward compatibility
// TODO: Remove this file after all imports are updated to use @/features/customer/orders
export {
  createVirtualOrder,
  createOrder,
  getShippingFee,
  applyShippingFee,
  calculateOrderTotal,
  applySystemVoucher,
  applyShopVoucher,
} from "@/features/customer/orders";
