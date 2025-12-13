# Implementation Plan - Order API Alignment

## Phase 1: Update Type Definitions

- [x] 1. Create comprehensive order type definitions

  - Create `src/features/customer/orders/types/order.enums.ts` with PaymentMethod, PaymentStatus, OrderStatus, DeliveryStatus enums
  - Update `src/features/customer/orders/types/order.types.ts` with all required types from ORDER_API_GUIDE.md
  - Add types for OrderProductItem, OrderShopItem, VirtualOrderData, OrderListItem, OrderDetail
  - Add types for all API request/response structures
  - Export all types from `src/features/customer/orders/types/index.ts`
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]\* 1.1 Write property test for type definitions

  - **Property 32: Order Type Definitions Completeness**
  - **Validates: Requirements 8.1**

- [ ]\* 1.2 Write property test for type API alignment
  - **Property 33: Type Definition API Alignment**
  - **Validates: Requirements 8.2**

## Phase 2: Update Service Layer

- [x] 2. Implement complete order service

  - Update `src/features/customer/orders/services/order.service.ts` with all required functions
  - Implement `createVirtualOrder()` - POST /Order/create-virtual-order
  - Implement `updateVirtualOrder()` - PUT /Order/update-virtual-order
  - Implement `deleteVirtualOrder()` - DELETE /Order/delete-virtual-order
  - Implement `calculateOrderTotal()` - GET /Order/Calclulate-order-total
  - Implement `createOrder()` - POST /Order/create-order
  - Implement `getOrders()` - GET /Order/get-order
  - Implement `getOrderDetail()` - GET /Order/get-order-detail
  - Implement `cancelOrder()` - DELETE /Order/cancle-order
  - Implement `applySystemVoucher()` - POST /Voucher/apply-voucher-system
  - Implement `applyShopVoucher()` - POST /Voucher/apply-voucher-shop
  - Implement `getShippingFee()` - POST /FeeShipping/get-fee-shipping
  - Implement `applyShippingFee()` - POST /FeeShipping/apply-list-fee-shipping
  - Use proper error handling with lodash \_.get() for safe data extraction
  - _Requirements: 1.1, 2.1, 2.2, 3.1, 4.1, 4.2, 5.1, 6.1, 7.1_

- [ ]\* 2.1 Write property test for API call structure

  - **Property 1: Virtual Order Creation Payload Structure**
  - **Validates: Requirements 1.1**

- [ ]\* 2.2 Write property test for response structure
  - **Property 2: Virtual Order Response Contains Required Fields**
  - **Validates: Requirements 1.2**

## Phase 3: Update Hook Layer

- [x] 3. Implement complete order hooks

  - Update `src/features/customer/orders/hooks/useOrders.ts` with all required mutations and queries
  - Implement `useCreateVirtualOrder()` mutation with error handling
  - Implement `useUpdateVirtualOrder()` mutation with error handling
  - Implement `useDeleteVirtualOrder()` mutation with error handling
  - Implement `useCalculateOrderTotal()` mutation with error handling
  - Implement `useCreateOrder()` mutation with success/error handling
  - Implement `useCancelOrder()` mutation with error handling
  - Implement `useApplySystemVoucher()` mutation with error handling
  - Implement `useApplyShopVoucher()` mutation with error handling
  - Implement `useApplyShippingFee()` mutation with error handling
  - Implement `useGetOrders()` query with error handling
  - Implement `useGetOrderDetail()` query with error handling
  - All mutations should display error messages via toast notifications
  - All mutations should extract error messages from response.data.message
  - _Requirements: 1.5, 2.4, 3.4, 4.5, 5.5, 6.5, 7.3, 9.1, 9.2_

- [ ]\* 3.1 Write property test for error handling

  - **Property 5: Virtual Order Creation Error Handling**
  - **Validates: Requirements 1.5**

- [ ]\* 3.2 Write property test for voucher error handling
  - **Property 9: Voucher Application Error Handling**
  - **Validates: Requirements 2.4**

## Phase 4: Create Order List Component

- [x] 4. Implement OrdersPage component

  - Create `src/features/customer/orders/components/OrdersPage.tsx` as client component
  - Use `useGetOrders()` hook to fetch orders
  - Display loading skeleton while fetching
  - Display empty state "Chưa có đơn hàng nào" when no orders
  - Display order list with columns: orderCode, finalPrice, orderStatus, paymentStatus, shopName
  - Show product items for each order with productName, productImage, quantity, price
  - Show flash sale indicator when hasFlashSale=true
  - Add click handler to navigate to order detail page
  - Add error state with retry button
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 10.1, 10.2_

- [ ]\* 4.1 Write property test for order list display

  - **Property 20: Order List Display Fields**
  - **Validates: Requirements 5.2**

- [ ]\* 4.2 Write property test for product details display
  - **Property 21: Order Product Details Display**
  - **Validates: Requirements 5.3**

## Phase 5: Create Order Detail Component

- [ ] 5. Implement OrderDetailPage component

  - Create `src/features/customer/orders/components/OrderDetailPage.tsx` as client component
  - Use `useGetOrderDetail()` hook to fetch order details
  - Display loading skeleton while fetching
  - Display order header with orderId, orderCode, createdAt, orderStatus, paymentStatus
  - Display recipient information: recipientName, recipientPhone, recipientAddress
  - Display pricing breakdown: originalPrice, discountPrice, shippingFee, finalPrice
  - Display order items with product details and variant information
  - Show flash sale indicator when hasFlashSale=true
  - Add cancel order button with confirmation dialog
  - Handle cancel order mutation with success/error messages
  - Add error state with retry button
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 10.3, 10.4_

- [ ]\* 5.1 Write property test for order detail fields

  - **Property 25: Order Detail Display Fields**
  - **Validates: Requirements 6.2**

- [ ]\* 5.2 Write property test for recipient information
  - **Property 26: Recipient Information Display**
  - **Validates: Requirements 6.3**

## Phase 6: Create Checkout Flow Components

- [x] 6. Implement CheckoutFlow component structure

  - Create `src/features/customer/orders/components/CheckoutFlow.tsx` as client component
  - Implement multi-step checkout: Review → Voucher → Shipping → Payment
  - Use `useCreateVirtualOrder()` to create virtual order from cart
  - Display order summary with itemShops breakdown
  - Show loading state during virtual order creation
  - Handle virtual order creation errors with retry
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 7. Implement voucher application step

  - Create `src/features/customer/orders/components/VoucherStep.tsx`
  - Display system voucher input field
  - Display shop voucher input fields for each shop
  - Use `useApplySystemVoucher()` and `useApplyShopVoucher()` hooks
  - Show discount values after voucher application
  - Handle voucher application errors with user-friendly messages
  - Allow removing applied vouchers
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 8. Implement shipping fee step

  - Create `src/features/customer/orders/components/ShippingStep.tsx`
  - Display shipping fee options for each shop
  - Use `useApplyShippingFee()` hook to apply selected shipping
  - Show shipping fee for each shop
  - Update total with shipping fees
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 9. Implement payment method selection step

  - Create `src/features/customer/orders/components/PaymentStep.tsx`
  - Display payment method options: COD (1), VNPay (2)
  - Use `useCreateOrder()` hook to create order
  - Handle COD: Show success message and redirect to orders page
  - Handle VNPay: Redirect to VNPay payment URL
  - Show loading state during order creation
  - Handle order creation errors with user-friendly messages
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]\* 6.1 Write property test for COD payment

  - **Property 14: COD Payment Method API Call**
  - **Validates: Requirements 4.1**

- [ ]\* 6.2 Write property test for VNPay payment
  - **Property 15: VNPay Payment Method API Call**
  - **Validates: Requirements 4.2**

## Phase 7: Create Loading and Empty States

- [ ] 10. Create skeleton components

  - Create `src/features/customer/orders/components/OrderListSkeleton.tsx`
  - Create `src/features/customer/orders/components/OrderDetailSkeleton.tsx`
  - Create `src/features/customer/orders/components/OrderItemSkeleton.tsx`
  - Use shadcn/ui Skeleton component
  - Match layout of actual components
  - _Requirements: 10.1, 10.3, 10.4_

- [ ] 11. Create empty state component
  - Create `src/features/customer/orders/components/EmptyOrderState.tsx`
  - Display "Chưa có đơn hàng nào" message
  - Add button to navigate to products page
  - _Requirements: 10.2_

## Phase 8: Error Handling and Messages

- [ ] 12. Implement error handling utilities

  - Create `src/features/customer/orders/utils/error.utils.ts`
  - Implement `extractErrorMessage()` to get message from response.data.message
  - Implement `getOrderErrorMessage()` to map specific error codes to Vietnamese messages
  - Handle "Đơn hàng không tồn tại" for expired orders
  - Handle "Phương thức thanh toán không hợp lệ" for invalid payment methods
  - Handle "Không thể kết nối đến server. Vui lòng thử lại" for network errors
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]\* 12.1 Write property test for error message extraction

  - **Property 36: Error Message Extraction**
  - **Validates: Requirements 9.1**

- [ ]\* 12.2 Write property test for error display
  - **Property 37: Error Display via Toast**
  - **Validates: Requirements 9.2**

## Phase 9: Integration and Routing

- [ ] 13. Update order feature exports

  - Update `src/features/customer/orders/index.ts` to export all components, hooks, services, and types
  - Ensure barrel exports are complete and organized

- [ ] 14. Create order routes

  - Create `src/app/(customer)/don-hang/page.tsx` that renders OrdersPage
  - Create `src/app/(customer)/don-hang/[id]/page.tsx` that renders OrderDetailPage
  - Add proper metadata for SEO
  - _Requirements: 5.1, 6.1_

- [ ] 15. Integrate checkout flow into cart/checkout page
  - Update `src/app/(customer)/thanh-toan/page.tsx` to use CheckoutFlow component
  - Pass cart items to CheckoutFlow
  - Handle successful order creation redirect
  - _Requirements: 1.1, 4.1, 4.2_

## Phase 10: Testing

- [ ]\* 16. Write unit tests for services

  - Test all service functions call correct endpoints
  - Test error handling in services
  - Test response data extraction with lodash \_.get()
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_

- [ ]\* 17. Write unit tests for hooks

  - Test mutations handle success and error states
  - Test queries fetch data correctly
  - Test error messages are displayed via toast
  - _Requirements: 1.5, 2.4, 3.4, 4.5, 5.5, 6.5, 7.3_

- [ ]\* 18. Write unit tests for components

  - Test OrdersPage displays orders correctly
  - Test OrderDetailPage displays order details correctly
  - Test loading and empty states
  - Test error states with retry
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 10.1, 10.2, 10.3, 10.4_

- [ ]\* 19. Write property-based tests
  - **Property 3: Flash Sale Data Inclusion** - Verify flash sale data in responses
  - **Property 4: Order Total Calculation Consistency** - Verify mathematical consistency
  - **Property 6: System Voucher Application API Call** - Verify correct API calls
  - **Property 7: Shop Voucher Application API Call** - Verify correct API calls
  - **Property 8: Voucher Application State Update** - Verify state updates
  - **Property 10: Order Total Calculation API Call** - Verify correct API calls
  - **Property 11: Order Total Calculation Response Fields** - Verify response structure
  - **Property 12: Order Itemized Breakdown** - Verify itemShops structure
  - **Property 13: Order Calculation Error Handling** - Verify error handling
  - **Property 16: COD Order Creation Success** - Verify success path
  - **Property 17: VNPay Redirect Handling** - Verify redirect
  - **Property 18: Order Creation Error Handling** - Verify error handling
  - **Property 19: Order List Fetching** - Verify API calls
  - **Property 22: Flash Sale Indicator Display** - Verify indicator display
  - **Property 23: Order List Fetch Error Handling** - Verify error handling
  - **Property 24: Order Detail Fetching** - Verify API calls
  - **Property 27: Order Items Display** - Verify items display
  - **Property 28: Order Detail Fetch Error Handling** - Verify error handling
  - **Property 29: Order Cancellation API Call** - Verify API calls
  - **Property 30: Order Cancellation Success** - Verify success path
  - **Property 31: Order Cancellation Error Handling** - Verify error handling
  - **Property 34: Enum Definitions** - Verify enums exist
  - **Property 35: TypeScript Type Inference** - Verify type inference
  - **Property 38: Expired Order Error Handling** - Verify specific error handling
  - **Property 39: Invalid Payment Method Error** - Verify specific error handling
  - **Property 40: Network Error Handling** - Verify specific error handling
  - **Property 41: Loading State Display** - Verify loading states
  - **Property 42: Empty State Display** - Verify empty states
  - **Property 43: Order Detail Loading State** - Verify loading states
  - **Property 44: Order Items Loading State** - Verify loading states
  - _Requirements: 1.3, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.4, 5.5, 6.1, 6.4, 6.5, 7.1, 7.2, 7.3, 8.3, 8.4, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4_

## Phase 11: Verification

- [ ] 20. Checkpoint - Ensure all tests pass

  - Run `npm test` to verify all unit tests pass
  - Run property-based tests with minimum 100 iterations
  - Verify test coverage > 80% for critical paths
  - Fix any failing tests
  - _Requirements: All_

- [ ] 21. Verify implementation against ORDER_API_GUIDE.md

  - Check all API endpoints are called correctly
  - Verify request/response structures match the guide
  - Verify error handling matches the guide
  - Verify enums match the guide
  - _Requirements: All_

- [ ] 22. Manual testing of order flow
  - Test creating virtual order from cart
  - Test applying system and shop vouchers
  - Test calculating order total
  - Test COD payment flow
  - Test VNPay payment flow
  - Test viewing order list
  - Test viewing order detail
  - Test cancelling order
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 4.2, 5.1, 6.1, 7.1_
