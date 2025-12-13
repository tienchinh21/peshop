# Order API Alignment Spec

## Overview

This spec defines the complete refactoring of the PeShop order system to align with the ORDER_API_GUIDE.md specification. The implementation will create a robust, type-safe order management system supporting the full order flow from virtual order creation through final payment.

## Spec Files

- **requirements.md** - 10 requirements covering all aspects of the order system
- **design.md** - Architecture, components, data models, and 44 correctness properties
- **tasks.md** - 22 implementation tasks organized in 11 phases

## Key Features

### Order Flow

1. Create virtual order (temporary, stored in Redis for 60 minutes)
2. Apply vouchers (system-level or shop-level)
3. Apply shipping fees
4. Calculate final totals
5. Create final order with payment method (COD or VNPay)

### Components

- **OrdersPage** - Display customer's order history
- **OrderDetailPage** - Display complete order information
- **CheckoutFlow** - Multi-step checkout process
- **VoucherStep** - Apply vouchers
- **ShippingStep** - Select shipping method
- **PaymentStep** - Select payment method

### Data Models

- Complete type definitions matching ORDER_API_GUIDE.md
- Enums for PaymentMethod, PaymentStatus, OrderStatus, DeliveryStatus
- Request/response types for all API endpoints

### Error Handling

- Proper error message extraction from API responses
- User-friendly Vietnamese error messages
- Specific handling for common errors (expired orders, invalid payment methods, network errors)
- Toast notifications for all errors

### Testing

- Unit tests for services, hooks, and components
- Property-based tests for all 44 correctness properties
- Minimum 100 iterations per property test
- 80%+ coverage target for critical paths

## Implementation Phases

1. **Type Definitions** - Create comprehensive order types and enums
2. **Service Layer** - Implement all API service functions
3. **Hook Layer** - Create React Query hooks for mutations and queries
4. **Order List** - Build OrdersPage component
5. **Order Detail** - Build OrderDetailPage component
6. **Checkout Flow** - Create multi-step checkout components
7. **Loading/Empty States** - Create skeleton and empty state components
8. **Error Handling** - Implement error utilities and messages
9. **Integration** - Wire up routes and integrate with existing pages
10. **Testing** - Write unit and property-based tests
11. **Verification** - Verify implementation and manual testing

## Correctness Properties

The design includes 44 correctness properties covering:

- API call structure and parameters
- Response data structure and fields
- Mathematical consistency (order total calculations)
- State management (voucher application, error handling)
- UI display (loading states, empty states, error states)
- Error handling and recovery
- Type safety and inference

## Next Steps

1. Review and approve the spec
2. Execute tasks in order, starting with Phase 1
3. Run tests after each phase
4. Verify implementation against ORDER_API_GUIDE.md
5. Perform manual testing of complete order flow

## Related Documentation

- **ORDER_API_GUIDE.md** - Complete API specification
- **structure.md** - Project structure guidelines
- **tech.md** - Technology stack details
- **product.md** - Product overview
