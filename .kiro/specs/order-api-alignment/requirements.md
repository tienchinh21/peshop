# Requirements Document - Order API Alignment

## Introduction

The PeShop order system needs to be refactored to properly align with the ORDER_API_GUIDE.md specification. The current implementation has incomplete order flow handling, missing data structures, and lacks proper support for the multi-step order creation process (virtual order → calculate → create). This spec defines requirements for implementing a complete, spec-compliant order management system that handles virtual orders, voucher application, shipping fee calculation, and final order creation with support for both COD and VNPay payment methods.

## Glossary

- **Virtual Order**: A temporary order stored in Redis (60-minute TTL) containing cart items grouped by shop, used for price calculation and voucher application before final order creation
- **Order Flow**: The 5-step process: create virtual order → apply voucher (optional) → apply shipping fee (optional) → calculate total → create order
- **Order Item**: A product with quantity, variant, and shop information
- **Item Shop**: A grouping of products from a single shop within an order, containing pricing, vouchers, and shipping information
- **Flash Sale**: A time-limited promotion that reduces product prices; flash sale discounts are calculated by the backend
- **Voucher**: A discount code that can be applied at system level or shop level to reduce order total
- **Payment Method**: The way customer pays (1 = COD/Cash on Delivery, 2 = VNPay online payment)
- **Order Status**: The state of an order (0 = Pending, 1 = Confirmed, 2 = Shipping, 3 = Delivered, 4 = Cancelled, 5 = Returned)
- **Payment Status**: The payment state (0 = Unpaid, 1 = Paid, 2 = Failed, 3 = Refunded)

## Requirements

### Requirement 1

**User Story:** As a customer, I want to create a virtual order from my cart items, so that I can proceed through the checkout flow and apply discounts before finalizing my purchase.

#### Acceptance Criteria

1. WHEN a customer initiates checkout with cart items THEN the system SHALL create a virtual order by calling POST /Order/create-virtual-order with userAddressId and items grouped by shop
2. WHEN a virtual order is created THEN the system SHALL store the orderId, recipient information, address, and itemShops structure with pricing details
3. WHEN a virtual order is created THEN the system SHALL include flash sale information (flashSaleProductId, flashSalePercentDecrease, flashSalePrice, flashSaleDiscount) for applicable products
4. WHEN a virtual order response is received THEN the system SHALL parse and store orderTotal, feeShippingTotal, discountTotal, flashSaleDiscountTotal, and amountTotal
5. IF the virtual order creation fails THEN the system SHALL display an error message and prevent progression to the next step

### Requirement 2

**User Story:** As a customer, I want to apply vouchers to my order, so that I can receive discounts on my purchase.

#### Acceptance Criteria

1. WHEN a customer applies a system-level voucher THEN the system SHALL call POST /Voucher/apply-voucher-system with voucherId and orderId
2. WHEN a customer applies a shop-level voucher THEN the system SHALL call POST /Voucher/apply-voucher-shop with voucherId, orderId, and shopId
3. WHEN a voucher is successfully applied THEN the system SHALL update the virtual order with the new discount values
4. IF a voucher application fails THEN the system SHALL display an error message and maintain the previous order state

### Requirement 3

**User Story:** As a customer, I want to calculate my final order total with all discounts and fees applied, so that I can see the exact amount I need to pay.

#### Acceptance Criteria

1. WHEN a customer requests order total calculation THEN the system SHALL call GET /Order/Calclulate-order-total with the orderId
2. WHEN order total is calculated THEN the system SHALL display orderTotal, feeShippingTotal, discountTotal, flashSaleDiscountTotal, and amountTotal
3. WHEN order total is calculated THEN the system SHALL show itemized breakdown by shop including individual shop vouchers and shipping fees
4. IF order calculation fails THEN the system SHALL display an error message and prevent order creation

### Requirement 4

**User Story:** As a customer, I want to finalize my order with a payment method, so that I can complete my purchase.

#### Acceptance Criteria

1. WHEN a customer selects COD payment THEN the system SHALL call POST /Order/create-order with orderId and paymentMethod=1
2. WHEN a customer selects VNPay payment THEN the system SHALL call POST /Order/create-order with orderId and paymentMethod=2
3. WHEN COD payment is selected THEN the system SHALL create the order and display a success message
4. WHEN VNPay payment is selected THEN the system SHALL redirect to the VNPay payment URL returned by the API
5. IF order creation fails THEN the system SHALL display an error message with the reason

### Requirement 5

**User Story:** As a customer, I want to view my order history, so that I can track my purchases and their status.

#### Acceptance Criteria

1. WHEN a customer navigates to the orders page THEN the system SHALL fetch and display all orders by calling GET /Order/get-order
2. WHEN orders are displayed THEN the system SHALL show orderId, orderCode, finalPrice, paymentMethod, paymentStatus, orderStatus, shopName, and product items
3. WHEN orders are displayed THEN the system SHALL show product details including productName, productImage, variantId, variantValues, price, quantity, and isAllowReview
4. WHEN an order is displayed THEN the system SHALL show flash sale indicator if hasFlashSale is true
5. IF order fetching fails THEN the system SHALL display an error message and allow retry

### Requirement 6

**User Story:** As a customer, I want to view detailed information about a specific order, so that I can see all order details including items, pricing, and delivery information.

#### Acceptance Criteria

1. WHEN a customer views an order detail THEN the system SHALL fetch the order by calling GET /Order/get-order-detail with orderId
2. WHEN order detail is displayed THEN the system SHALL show orderId, orderCode, finalPrice, paymentMethod, paymentStatus, orderStatus, shopName, createdAt, discountPrice, shippingFee, originalPrice
3. WHEN order detail is displayed THEN the system SHALL show recipient information (recipientName, recipientPhone, recipientAddress)
4. WHEN order detail is displayed THEN the system SHALL show all order items with product details and variant information
5. IF order detail fetching fails THEN the system SHALL display an error message

### Requirement 7

**User Story:** As a customer, I want to cancel an order, so that I can stop a purchase if needed.

#### Acceptance Criteria

1. WHEN a customer requests order cancellation THEN the system SHALL call DELETE /Order/cancle-order with orderId
2. WHEN order cancellation succeeds THEN the system SHALL update the order status to cancelled and display a success message
3. IF order cancellation fails THEN the system SHALL display an error message with the reason

### Requirement 8

**User Story:** As a developer, I want proper type definitions for all order-related data structures, so that the codebase is type-safe and maintainable.

#### Acceptance Criteria

1. WHEN order types are defined THEN the system SHALL include types for VirtualOrderData, OrderShopItem, OrderProductItem, and all API request/response structures
2. WHEN order types are defined THEN the system SHALL match the exact structure from ORDER_API_GUIDE.md including all optional and required fields
3. WHEN order types are defined THEN the system SHALL include enums for PaymentMethod, PaymentStatus, OrderStatus, and DeliveryStatus
4. WHEN types are used in services THEN the system SHALL provide proper TypeScript inference for all API responses

### Requirement 9

**User Story:** As a developer, I want proper error handling throughout the order flow, so that users receive clear feedback when issues occur.

#### Acceptance Criteria

1. WHEN an API error occurs THEN the system SHALL extract the error message from response.data.message
2. WHEN an error occurs THEN the system SHALL display a user-friendly Vietnamese error message via toast notification
3. WHEN a virtual order expires THEN the system SHALL display "Đơn hàng không tồn tại" and allow user to restart checkout
4. WHEN a payment method is invalid THEN the system SHALL display "Phương thức thanh toán không hợp lệ"
5. WHEN network errors occur THEN the system SHALL display "Không thể kết nối đến server. Vui lòng thử lại"

### Requirement 10

**User Story:** As a developer, I want proper loading and empty states in the order UI, so that users have clear feedback about data loading and empty order lists.

#### Acceptance Criteria

1. WHEN orders are being fetched THEN the system SHALL display a loading skeleton
2. WHEN no orders exist THEN the system SHALL display an empty state message "Chưa có đơn hàng nào"
3. WHEN order detail is loading THEN the system SHALL display a loading skeleton for order information
4. WHEN order items are loading THEN the system SHALL display item skeletons
