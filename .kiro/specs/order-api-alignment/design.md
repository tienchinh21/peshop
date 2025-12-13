# Design Document - Order API Alignment

## Overview

The order system design implements a complete order management flow aligned with the ORDER_API_GUIDE.md specification. The system follows a 5-step process: create virtual order → apply vouchers (optional) → apply shipping fees (optional) → calculate total → create order. The design emphasizes type safety, proper error handling, and clear separation between data fetching, business logic, and UI presentation.

## Architecture

The order system follows a layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                             │
│  (OrdersPage, OrderDetailPage, CheckoutFlow)                │
├─────────────────────────────────────────────────────────────┤
│                    Custom Hooks (useOrders)                  │
│  (useCreateVirtualOrder, useCalculateOrderTotal, etc.)      │
├─────────────────────────────────────────────────────────────┤
│                    Services (order.service)                  │
│  (createVirtualOrder, calculateOrderTotal, etc.)            │
├─────────────────────────────────────────────────────────────┤
│                    HTTP Client (axiosDotnet)                │
│  (Handles authentication, error interceptors)               │
├─────────────────────────────────────────────────────────────┤
│                    Backend API                               │
│  (Order, Voucher, FeeShipping endpoints)                    │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**

1. Components dispatch mutations via custom hooks
2. Hooks use React Query for state management and caching
3. Services make API calls via axios client
4. Responses are typed and validated
5. Errors are caught and displayed via toast notifications

## Components and Interfaces

### Service Layer (`services/order.service.ts`)

**Functions:**

- `createVirtualOrder(payload)` - Creates virtual order in Redis
- `updateVirtualOrder(payload)` - Updates virtual order items
- `deleteVirtualOrder(orderId)` - Deletes virtual order
- `calculateOrderTotal(orderId)` - Calculates final totals
- `createOrder(payload)` - Creates final order with payment method
- `getOrders()` - Fetches customer's order list
- `getOrderDetail(orderId)` - Fetches specific order details
- `cancelOrder(orderId)` - Cancels an order
- `applySystemVoucher(payload)` - Applies system-level voucher
- `applyShopVoucher(payload)` - Applies shop-level voucher
- `getShippingFee(payload)` - Gets shipping fee options
- `applyShippingFee(payload)` - Applies selected shipping fee

### Hook Layer (`hooks/useOrders.ts`)

**Mutations:**

- `useCreateVirtualOrder()` - Mutation for creating virtual order
- `useUpdateVirtualOrder()` - Mutation for updating virtual order
- `useDeleteVirtualOrder()` - Mutation for deleting virtual order
- `useCalculateOrderTotal()` - Mutation for calculating totals
- `useCreateOrder()` - Mutation for creating final order
- `useCancelOrder()` - Mutation for cancelling order
- `useApplySystemVoucher()` - Mutation for applying system voucher
- `useApplyShopVoucher()` - Mutation for applying shop voucher
- `useApplyShippingFee()` - Mutation for applying shipping fee

**Queries:**

- `useGetOrders()` - Query for fetching order list
- `useGetOrderDetail(orderId)` - Query for fetching order details

### Component Layer

**OrdersPage** (`components/OrdersPage.tsx`)

- Displays list of customer's orders
- Shows order status, total price, shop name
- Allows navigation to order detail
- Handles loading and empty states

**OrderDetailPage** (`components/OrderDetailPage.tsx`)

- Displays complete order information
- Shows recipient details, items, pricing breakdown
- Allows order cancellation
- Displays payment and order status

**CheckoutFlow** (to be created)

- Manages multi-step checkout process
- Handles virtual order creation
- Manages voucher application
- Calculates totals
- Handles payment method selection

## Data Models

### Order Types

```typescript
// Enums
enum PaymentMethod {
  COD = 1,
  VNPay = 2,
}

enum PaymentStatus {
  Unpaid = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3,
}

enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipping = 2,
  Delivered = 3,
  Cancelled = 4,
  Returned = 5,
}

enum DeliveryStatus {
  NotDelivered = 0,
  Delivering = 1,
  Delivered = 2,
}

// Request/Response Types
interface OrderProductItemPayload {
  productId: string;
  variantId: number | null;
  quantity: number;
  shopId: string;
}

interface CreateVirtualOrderPayload {
  userAddressId: string;
  items: OrderProductItemPayload[];
}

interface OrderProductItem {
  productId: string;
  variantId: number | null;
  quantity: number;
  priceOriginal: number;
  flashSaleProductId?: string;
  flashSalePercentDecrease?: number;
  flashSalePrice?: number;
}

interface OrderShopItem {
  shopId: string;
  shopName: string;
  shopLogoUrl: string | null;
  orderCode: string;
  products: OrderProductItem[];
  gifts: any[];
  priceOriginal: number;
  feeShipping: number;
  voucherId: string | null;
  voucherValue: number;
  flashSaleDiscount: number;
}

interface VirtualOrderData {
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  userFullNewAddress: string;
  itemShops: OrderShopItem[];
  orderTotal: number;
  feeShippingTotal: number;
  discountTotal: number;
  flashSaleDiscountTotal: number;
  amountTotal: number;
  hasFlashSale: boolean;
  createdAt: string;
}

interface OrderListItem {
  orderId: string;
  orderCode: string;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shopId: string;
  shopName: string;
  hasFlashSale: boolean;
  items: OrderProductDetail[];
}

interface OrderDetail {
  orderId: string;
  orderCode: string;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shopId: string;
  shopName: string;
  hasFlashSale: boolean;
  createdAt: string;
  discountPrice: number;
  shippingFee: number;
  originalPrice: number;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  items: OrderProductDetail[];
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Virtual Order Creation Payload Structure

_For any_ valid cart items grouped by shop, creating a virtual order should result in an API call with the correct payload structure containing userAddressId and items array.
**Validates: Requirements 1.1**

### Property 2: Virtual Order Response Contains Required Fields

_For any_ successful virtual order creation, the response should contain orderId, recipient information, address, and itemShops structure with all required pricing fields.
**Validates: Requirements 1.2**

### Property 3: Flash Sale Data Inclusion

_For any_ virtual order containing products with flash sales, the response should include flashSaleProductId, flashSalePercentDecrease, flashSalePrice, and flashSaleDiscount for those products.
**Validates: Requirements 1.3**

### Property 4: Order Total Calculation Consistency

_For any_ virtual order, the amountTotal should equal orderTotal + feeShippingTotal - discountTotal, maintaining mathematical consistency across all orders.
**Validates: Requirements 1.4**

### Property 5: Virtual Order Creation Error Handling

_For any_ failed virtual order creation, the system should display an error message and prevent progression to the next step.
**Validates: Requirements 1.5**

### Property 6: System Voucher Application API Call

_For any_ system-level voucher application, the API should be called with POST /Voucher/apply-voucher-system containing voucherId and orderId.
**Validates: Requirements 2.1**

### Property 7: Shop Voucher Application API Call

_For any_ shop-level voucher application, the API should be called with POST /Voucher/apply-voucher-shop containing voucherId, orderId, and shopId.
**Validates: Requirements 2.2**

### Property 8: Voucher Application State Update

_For any_ successful voucher application, the virtual order should be updated with new discount values.
**Validates: Requirements 2.3**

### Property 9: Voucher Application Error Handling

_For any_ failed voucher application, the system should display an error message and maintain the previous order state unchanged.
**Validates: Requirements 2.4**

### Property 10: Order Total Calculation API Call

_For any_ order total calculation request, the API should be called with GET /Order/Calclulate-order-total containing the orderId parameter.
**Validates: Requirements 3.1**

### Property 11: Order Total Calculation Response Fields

_For any_ successful order total calculation, the response should contain orderTotal, feeShippingTotal, discountTotal, flashSaleDiscountTotal, and amountTotal.
**Validates: Requirements 3.2**

### Property 12: Order Itemized Breakdown

_For any_ calculated order, the itemShops array should contain shop-level information including individual shop vouchers and shipping fees.
**Validates: Requirements 3.3**

### Property 13: Order Calculation Error Handling

_For any_ failed order calculation, the system should display an error message and prevent order creation.
**Validates: Requirements 3.4**

### Property 14: COD Payment Method API Call

_For any_ COD payment selection, the API should be called with POST /Order/create-order containing orderId and paymentMethod=1.
**Validates: Requirements 4.1**

### Property 15: VNPay Payment Method API Call

_For any_ VNPay payment selection, the API should be called with POST /Order/create-order containing orderId and paymentMethod=2.
**Validates: Requirements 4.2**

### Property 16: COD Order Creation Success

_For any_ successful COD order creation, the system should create the order and display a success message.
**Validates: Requirements 4.3**

### Property 17: VNPay Redirect Handling

_For any_ successful VNPay payment selection, the system should redirect to the VNPay payment URL returned by the API.
**Validates: Requirements 4.4**

### Property 18: Order Creation Error Handling

_For any_ failed order creation, the system should display an error message with the reason.
**Validates: Requirements 4.5**

### Property 19: Order List Fetching

_For any_ order list request, the API should be called with GET /Order/get-order to fetch all customer orders.
**Validates: Requirements 5.1**

### Property 20: Order List Display Fields

_For any_ displayed order in the list, all required fields should be present: orderId, orderCode, finalPrice, paymentMethod, paymentStatus, orderStatus, shopName, and product items.
**Validates: Requirements 5.2**

### Property 21: Order Product Details Display

_For any_ product item in an order list, all required fields should be present: productName, productImage, variantId, variantValues, price, quantity, and isAllowReview.
**Validates: Requirements 5.3**

### Property 22: Flash Sale Indicator Display

_For any_ order with hasFlashSale=true, the system should display a flash sale indicator.
**Validates: Requirements 5.4**

### Property 23: Order List Fetch Error Handling

_For any_ failed order list fetch, the system should display an error message and allow retry.
**Validates: Requirements 5.5**

### Property 24: Order Detail Fetching

_For any_ order detail request, the API should be called with GET /Order/get-order-detail containing the orderId parameter.
**Validates: Requirements 6.1**

### Property 25: Order Detail Display Fields

_For any_ displayed order detail, all required fields should be present: orderId, orderCode, finalPrice, paymentMethod, paymentStatus, orderStatus, shopName, createdAt, discountPrice, shippingFee, and originalPrice.
**Validates: Requirements 6.2**

### Property 26: Recipient Information Display

_For any_ order detail, recipient information should be displayed: recipientName, recipientPhone, and recipientAddress.
**Validates: Requirements 6.3**

### Property 27: Order Items Display

_For any_ order detail, all order items should be displayed with product details and variant information.
**Validates: Requirements 6.4**

### Property 28: Order Detail Fetch Error Handling

_For any_ failed order detail fetch, the system should display an error message.
**Validates: Requirements 6.5**

### Property 29: Order Cancellation API Call

_For any_ order cancellation request, the API should be called with DELETE /Order/cancle-order containing the orderId parameter.
**Validates: Requirements 7.1**

### Property 30: Order Cancellation Success

_For any_ successful order cancellation, the order status should be updated to cancelled and a success message should be displayed.
**Validates: Requirements 7.2**

### Property 31: Order Cancellation Error Handling

_For any_ failed order cancellation, the system should display an error message with the reason.
**Validates: Requirements 7.3**

### Property 32: Order Type Definitions Completeness

_For any_ order-related operation, proper type definitions should exist for VirtualOrderData, OrderShopItem, OrderProductItem, and all API request/response structures.
**Validates: Requirements 8.1**

### Property 33: Type Definition API Alignment

_For any_ type definition, it should match the exact structure from ORDER_API_GUIDE.md including all optional and required fields.
**Validates: Requirements 8.2**

### Property 34: Enum Definitions

_For any_ order operation, enums should be defined for PaymentMethod, PaymentStatus, OrderStatus, and DeliveryStatus.
**Validates: Requirements 8.3**

### Property 35: TypeScript Type Inference

_For any_ service function, proper TypeScript types should be used to provide inference for all API responses.
**Validates: Requirements 8.4**

### Property 36: Error Message Extraction

_For any_ API error, the error message should be extracted from response.data.message.
**Validates: Requirements 9.1**

### Property 37: Error Display via Toast

_For any_ error occurrence, a user-friendly Vietnamese error message should be displayed via toast notification.
**Validates: Requirements 9.2**

### Property 38: Expired Order Error Handling

_For any_ expired virtual order, the system should display "Đơn hàng không tồn tại" and allow user to restart checkout.
**Validates: Requirements 9.3**

### Property 39: Invalid Payment Method Error

_For any_ invalid payment method, the system should display "Phương thức thanh toán không hợp lệ".
**Validates: Requirements 9.4**

### Property 40: Network Error Handling

_For any_ network error, the system should display "Không thể kết nối đến server. Vui lòng thử lại".
**Validates: Requirements 9.5**

### Property 41: Loading State Display

_For any_ order fetching operation, a loading skeleton should be displayed while data is being fetched.
**Validates: Requirements 10.1**

### Property 42: Empty State Display

_For any_ empty order list, the system should display "Chưa có đơn hàng nào".
**Validates: Requirements 10.2**

### Property 43: Order Detail Loading State

_For any_ order detail loading, a loading skeleton should be displayed for order information.
**Validates: Requirements 10.3**

### Property 44: Order Items Loading State

_For any_ order items loading, item skeletons should be displayed.
**Validates: Requirements 10.4**

## Error Handling

**API Error Strategy:**

- All API calls are wrapped in try-catch blocks
- Error messages are extracted from `response.data.message`
- User-friendly Vietnamese messages are displayed via toast notifications
- Specific error cases are handled (expired orders, invalid payment methods, network errors)

**Error Types:**

1. **Validation Errors**: Invalid input data (empty address, invalid quantity)
2. **API Errors**: Backend returns error response with message
3. **Network Errors**: Connection failures or timeouts
4. **State Errors**: Invalid state transitions (e.g., calculating before virtual order created)

**Error Recovery:**

- Users can retry failed operations
- Virtual order can be recreated if expired
- Form validation prevents invalid submissions

## Testing Strategy

### Unit Testing

Unit tests verify specific examples and edge cases:

- Type definitions match API structure
- Error message extraction works correctly
- Enum values are correct
- Service functions call correct endpoints with correct payloads

### Property-Based Testing

Property-based tests verify universal properties across all inputs:

- **Feature: order-api-alignment, Property 1: Virtual Order Creation Payload Structure** - Verify API calls with correct payload
- **Feature: order-api-alignment, Property 2: Virtual Order Response Contains Required Fields** - Verify response structure
- **Feature: order-api-alignment, Property 4: Order Total Calculation Consistency** - Verify mathematical consistency
- **Feature: order-api-alignment, Property 9: Voucher Application Error Handling** - Verify state preservation on error
- **Feature: order-api-alignment, Property 20: Order List Display Fields** - Verify all fields present
- **Feature: order-api-alignment, Property 37: Error Display via Toast** - Verify error messages displayed

### Testing Framework

- **Unit Tests**: Jest with React Testing Library
- **Property-Based Tests**: fast-check for JavaScript
- **Minimum Iterations**: 100 per property test
- **Coverage Target**: 80%+ for critical paths

### Test Organization

- Unit tests co-located with source files (`.test.ts` suffix)
- Property tests in dedicated `__tests__` directory
- Test utilities in `utils/test-helpers.ts`
- Mock data generators in `utils/test-generators.ts`
