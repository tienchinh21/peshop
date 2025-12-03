/**
 * Checkout Feature Module
 *
 * This is the main barrel export for the checkout feature module.
 * It re-exports everything from subdirectories for convenient importing.
 *
 * Usage:
 * import { CheckoutPage, useDefaultAddress, getAddressList } from '@/features/customer/checkout';
 */

// Components
export {
  CheckoutPage,
  AddressSection,
  AddressFormModal,
  AddressListModal,
  OrderItemsSection,
  OrderSummary,
  ShippingFeeSection,
  VoucherSection,
  OrderPromotionsSection,
} from "./components";
export type { AddressFormData } from "./components";

// Hooks
export {
  addressKeys,
  useAddressList,
  useDefaultAddress,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  checkoutKeys,
  useCreateVirtualOrder,
  useShippingFee,
  useApplyShippingFee,
  useVoucherEligibility,
  useCalculateOrderTotal,
} from "./hooks";

// Services
export {
  getAddressList,
  getDefaultAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "./services";

// Types
export type {
  CreateAddressPayload,
  UpdateAddressPayload,
  UserAddress,
  AddressListResponse,
  AddressResponse,
} from "./types";
